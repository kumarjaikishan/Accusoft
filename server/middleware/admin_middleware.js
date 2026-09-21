const authorizationMiddleware = (accept = []) => {
  return async (req, res, next) => {
    if (!req.user || !req.user.userType) {
      return res.status(401).json({
        message: "Unauthorized"
      });
    }

    if (accept.includes(req.user.userType)) {
      return next();
    }

    return res.status(403).json({
      message: "Access Denied!"
    });
  };
};

module.exports = { authorizationMiddleware };