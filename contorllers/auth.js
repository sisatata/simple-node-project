const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const advancedResults = require('../middleware/advancedResults');
const User = require('../models/User');
// @desc    register user
// @route   Post/api/v1/auth/register
// @access  public
exports.register = asyncHandler(async (req, res, next) => {
    const {name, email, password, role} = req.body;
    const user = await User.create({
        name,
        email,
        password,
        role
    });
    const token = user.getSignedJwtToken();
    res.status(200).json({success: true, token});
});
// @desc    login user
// @route   Post/api/v1/auth/login
// @access  public
exports.login = asyncHandler(async (req, res, next) => {
    const {email, password} = req.body;
    if (!email || !password) {
        return next(new ErrorResponse(`Plaese provide email and password`, 400));
    }
    const user = await User.findOne({email}).select('+password');
    if (!user) {
        return next(new ErrorResponse(`Invalid creadentials`, 401));
    }

    const isMatch = await user.matchPassword(password);
    console.log(isMatch);
    if (!isMatch) {
        return next(new ErrorResponse(`Invalid creadentials`, 401));
    }
    const token = user.getSignedJwtToken();
    res.status(200).json({success: true, token});
});


