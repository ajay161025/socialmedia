const authentication = async (req, res, next) => {
  const authHeader = req.headers.cookies;
  if (!authHeader || authHeader == null || authHeader === undefined) {
    if (!token) res.status(401).json({ message: "Token expired" });
  }
  const token = authHeader.split("=")[1];
  if (!token || token == "")
    return res.status(401).json({ message: "Invalid token" });
  const verify = jwt.verify(token, "jwtsdkjfei");
  if (!verify)
    return res.status(404).json({ message: "Token expired or Invalid" });
  const user = await Users.findById(verify.userId);
  if (!user) return res.status(404).json({ message: "Token expired" });
  next();
};
module.exports ={authentication}