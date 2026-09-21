const jwt = require('jsonwebtoken');
const { ApiError } = require('../utils/apierror');

const authmiddlewre = async (req, res, next) => {
    const bearertoken = req.header('Authorization');
    // console.log(bearertoken)
    if (!bearertoken) {
        return next({ statusCode: 401, message: "Unauthorizes HTTP, token not provided" });
    }

    try {
        const token = bearertoken.replace("Bearer", "").trim();
        const verified = jwt.verify(token, process.env.jwt_token);
        // console.log(verified);

        req.user = verified;
        req.userid = verified.userId;
        req.token = token;

        next();
    } catch (error) {
        // console.log("Error from Auth Middleware:",error.name,":", error.message);
        if (error.name === 'JsonWebTokenError') {
            return next({ statusCode: 403, message: "Invalid Token"});
        }
        if (error.name === 'TokenExpiredError') {
            return next({ statusCode: 401, message: "Access token expired"});
        }
        return next({ statusCode: 400, message: error.message});
    }
}
module.exports = authmiddlewre;