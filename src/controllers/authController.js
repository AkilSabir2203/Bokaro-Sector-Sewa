const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const Admin = require("../models/Admin");

const signToken = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "7d" });

const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "username, email and password are required.",
      });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const alreadyResident = await User.findOne({ email: normalizedEmail });
    const alreadyAdmin = await Admin.findOne({ email: normalizedEmail });

    if (alreadyResident || alreadyAdmin) {
      return res.status(409).json({
        success: false,
        message: "User already exists with this email.",
      });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      username: String(username).trim(),
      email: normalizedEmail,
      password: hashed,
      role: "resident",
    });

    const token = signToken(user._id.toString(), "resident");

    return res.status(201).json({
      success: true,
      message: "Resident signup successful.",
      data: {
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to signup user.",
      error: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "email and password are required.",
      });
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    let account = await Admin.findOne({ email: normalizedEmail });
    let role = account ? "admin" : "resident";

    if (!account) {
      account = await User.findOne({ email: normalizedEmail });
    }

    if (!account) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials.",
      });
    }

    const isMatch = await bcrypt.compare(password, account.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials.",
      });
    }

    const token = signToken(account._id.toString(), role);

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      data: {
        token,
        user: {
          id: account._id,
          username: account.username,
          email: account.email,
          role,
        },
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to login user.",
      error: error.message,
    });
  }
};

module.exports = {
  signup,
  login,
};
