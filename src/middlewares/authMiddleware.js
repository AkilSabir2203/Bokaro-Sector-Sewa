const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Admin = require("../models/Admin");

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Token missing.",
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const model = decoded.role === "admin" ? Admin : User;

    const account = await model.findById(decoded.id).select("-password");

    if (!account) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Invalid token.",
      });
    }

    req.user = {
      id: account._id.toString(),
      role: decoded.role,
      email: account.email,
      username: account.username,
    };

    return next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized.",
    });
  }
};

const restrictTo = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: "Forbidden. You do not have permission for this action.",
    });
  }

  return next();
};

module.exports = {
  protect,
  restrictTo,
};
