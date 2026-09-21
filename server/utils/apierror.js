class ApiError extends Error {
    constructor(
        statusCode,
        message = "Something went wrong defaulted",
        errors = [],
        stack = ""
    ) {
        super(message)
        // this.success = false;
        this.statusCode = statusCode
        this.status = statusCode >= 400 && statusCode < 500 ? 'fail' : 'error';
        this.isOperational = true;
        this.message = message
        this.errors = errors

        if (stack) {
            this.stack = stack
        } else {
            Error.captureStackTrace(this, this.constructor)
        }

    }
}

module.exports = { ApiError };