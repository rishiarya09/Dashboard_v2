const jwt = require("jsonwebtoken");
const config_json = require("../config.json");

const config = process.env.TOKEN_KEY || config_json.TOKEN;
const verifyToken = (req, res, next) => {
  const token = req.headers["x-access-token"];
  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    const decoded = jwt.verify(token, config.TOKEN_KEY, (err, verifiedJwt) => {
      if (err) {
        res.send(err.message);
      }
    });
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return next();
};

module.exports = verifyToken;
