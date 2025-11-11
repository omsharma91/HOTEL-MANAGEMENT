const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

// ✅ Middleware to verify token and attach user to req
exports.protect = async (req, res, next) => {
  let token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ msg: "Not authorized, no token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) return res.status(401).json({ msg: "User not found" });

    next();
  } catch (err) {
    return res.status(401).json({ msg: "Invalid token" });
  }
};

// ✅ Middleware to check role
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ msg: "No user found in request" });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ msg: "Access denied: insufficient role" });
    }
    next();
  };
};
