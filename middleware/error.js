const ErrorResponse = require('../utils/errorResponse');
const errorHandler = (err, req, res, next) => {
    //console.log(err.name,'top')
    let error = {...err};
    //console.log(error)
    //console.log(err.name, err.message,err.statusCode,err.value,'try')
   // console.log(error,'oh no')
    error.message = err.message;
    //console.log(error,'oh no')

    //:
   // console.log(error, 'here i am');
    if (err.name === 'CastError' || error.statusCode === 404) {
        const message = error.message;
        error = new ErrorResponse(message, 404);
    }
    if (error.code === 11000) {
        const message = 'Duplicate key value';
        error = new ErrorResponse((message, 400));
    }
    if (error._message === 'Bootcamp validation failed') {
        //console.log(error.name)
        const message = Object.values(error.errors).map(val => val.message);
        error = new ErrorResponse(message, 400);
    }
    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Server Error'
    });
}
module.exports = errorHandler;