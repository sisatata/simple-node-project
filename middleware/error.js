const ErrorResponse = require('../utils/errorResponse');
const errorHandler = (err, req, res, next) => {
    let error = {...err};
    //console.log(error)
    //:

    if(err.name === 'CastError'){
        const message = `Resource Not found wiht the id ${err.value}`;
        error = new ErrorResponse(message, 404);
    }
    if(error.code === 11000){
        const message = 'Duplicate key value';
        error = new ErrorResponse((message,400));
    }
    if(error._message === 'Bootcamp validation failed'){
        //console.log(error.name)
        const message = Object.values(err.errors).map(val=>val.message);
        error = new ErrorResponse(message, 400);

    }
    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Server Error'
    });
}
module.exports = errorHandler;