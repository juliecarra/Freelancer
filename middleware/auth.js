//jwt configuration (middleware which set restrictions to routes if we don't have a valid token)
const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function(req, res, next) {
  const token = req.header("x-auth-token"); //Request token from header

  if (!token) {
    //If there is no token and the route is protected by the middleware (jwt) then, the access is denied
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, config.get("jwtSecret")); //If there is a valid token, it will be decoded

    req.user = decoded.user;
    next();
  } catch (err) {
    //If the token is not valid then, it will throw an error
    res.status(401).json({ msg: "Token is not valid" });
  }
};
