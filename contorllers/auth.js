const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const advancedResults = require('../middleware/advancedResults');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');
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
    sendTokenResponse(user, 200, res);
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
    sendTokenResponse(user, 200, res);
});
const sendTokenResponse = (user, statusCode, res) => {
    const token = user.getSignedJwtToken();
    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true
    };
    console.log(token, options)
    res.status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true,
            token
        });
    // res.cookie('title', 'GeeksforGeeks').json({success: 'ok'});
}
// @desc    get current user
// @route   PGET/api/v1/auth/me
// @access  private
exports.getMe = asyncHandler(async (req, res, next) => {
    console.log(req.user)
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success: true,
        data: user
    })
});
// @desc    forgot password
// @route   Post/api/v1/auth/foret
// @access  pulict
exports.forgotPassword = asyncHandler(async (req, res, next) => {
    console.log(req.body.email)
    const user = await User.findOne({email: req.body.email});
    // console.log(user)
    if (!user) {
        return next(new ErrorResponse(`There is no user with this emial`, 401));
    }
    //console.log('forgot pass')
    const resetToken = user.getResetPassword();
    console.log(resetToken, 'from forgotpass');
    // console.log(resetToken)
    await user.save({validateBeforeSave: false});
    console.log(resetToken, 'after forgot')
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/resetpassword/${resetToken}`;
    const message = `Please change password via this url.\n\n${resetUrl}`;
    console.log(resetUrl)
    try {
        await sendEmail({
            to: 'sadiqul842@gmail.com',
            subject: 'Reset password token',
            text: resetUrl
        });
        res.status(200).json({success: true, message: 'Email Sent'});
    } catch (e) {
        // console.log(e);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined,
            await user.save({validateBeforeSave: false});
        return next(new ErrorResponse('Email can not be send', 500));
    }
    // console.log(resetToken)
    res.status(200).json({
        success: true,
        data: user
    })
});
// @desc    get current user
// @route   PGET/api/v1/auth/me
// @access  private
exports.resetPassword = asyncHandler(async (req, res, next) => {
    console.log(req.params.resettoken);
    //
    const resetPasswordToken = crypto.createHash('sha256')
        .update(req.params.resettoken)
        .digest('hex');
    console.log(resetPasswordToken);
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: {$gt: Date.now()}
    });
    console.log(user);
    if (!user) {
        return next(new ErrorResponse('Invalid token', 400));
    }
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    sendTokenResponse(user, 200, res);
});
// @desc    update current user
// @route   PUT/api/v1/auth/me
// @access  private
exports.updateDetails = asyncHandler(async (req, res, next) => {
    console.log(req.user, 'req.user')
    const fieldsToUpdate = {
        name: req.body.name,
        emial: req.body.email
    }
    const user = await User.findById(req.user.id, fieldsToUpdate, {
        new: true,
        runValidators: true
    });
    res.status(200).json({
        success: true,
        data: user
    })
});
// @desc    update Password
// @route   Put/api/v1/auth/me
// @access  private
exports.updatePassword = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id).select('+password');
    if (!(await user.matchPassword(req.body.currentPassword))) {
        return next(new ErrorResponse('Invalid id', 400));
    }
    user.password = req.body.newPassword;
    await user.save();
    sendTokenResponse(user, 200, res);
});