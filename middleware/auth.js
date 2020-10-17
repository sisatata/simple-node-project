const jwt = require('jsonwebtoken');
const asyncHanler = require('./async');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');
exports.protect = asyncHanler(async (req, res, next) => {
    let token;
    // console.log(req.headers.authorization)
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer'))
        token = req.headers.authorization.split(' ')[1];
    // console.log(token)
    if (!token) {
        return next(new ErrorResponse(`Not authorized`, 401));
    }
    try {
        console.log(token)
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);
        //console.log(req.use)
        next();
    } catch (e) {
        return next(new ErrorResponse(`Not authorized`, 401));
    }
});
// @desc grant access to a specific role
exports.authorize = (...roles) => {
    return (req, res, next) => {
        console.log(req.user.role);
        if (!roles.includes(req.user.role))
            return next(new ErrorResponse(`No permission`, 403));
        next();
    }
};

