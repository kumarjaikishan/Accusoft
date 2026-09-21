// const errorHandler = (err, req, res, next) => {
//     console.log("Error Handler", err.message)
//     res.status(500).json({
//         message: err.message
//     })
// }

const errorHandler = (err, req, res, next) => {
    // console.error(err.message);

    const statusCode = err.statusCode || 500;

    res.status(statusCode).json({
        statusCode: statusCode,
        success: false,
        message: err.message || "Internal Server Error",
        errors: err.errors || [],
       // stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
};

module.exports = errorHandler;
