const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authentication = async (req, res, next) => {
  const token = req.cookies.smCookies;
  if (!token || token == "")
    return res.status(401).json({ message: "Invalid token" });
  const verify = jwt.verify(token, "jwtsdkjfei");
  if (!verify)
    return res.status(404).json({ message: "Token expired or Invalid" });
  const user = await User.findById(verify.userId);
  if (!user) return res.status(404).json({ message: "Token expired" });
  req.UserId = user.id
  next();
};
module.exports ={authentication}