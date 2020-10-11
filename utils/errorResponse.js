class ErrorResponse extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        console.log(message, statusCode, 'hi')
        // Error.captureStackTrace(this, this.constructor);
    }
}
module.exports = ErrorResponse;