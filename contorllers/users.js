const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const advancedResults = require('../middleware/advancedResults');
const User = require('../models/User');
// @desc    get all users
// @route   GET/api/v1/users
// @access  private
exports.getUsers = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedResults);
});
// @desc    get all users
// @route   GET/api/v1/users
// @access  private
exports.getUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    res.status(200).json({success: true, data: user});
});
// @desc    create user
// @route   Post/api/v1/users
// @access  private
exports.createUser = asyncHandler(async (req, res, next) => {
    const user = await User.create(req.body);
    res.status(200).json({success: true, data: user});
});
// @desc    update user
// @route   Put/api/v1/users
// @access  private
exports.updateUser = asyncHandler(async (req, res, next) => {
console.log('user update', req.params.id)
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    res.status(200).json({success: true, data: user});
});
// @desc    delete user
// @route   delete/api/v1/users
// @access  private
exports.deleteUser = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndDelete(req.params.id);
    res.status(200).json({success: true, data: {}});
});
