const express = require("express");
const {
  registerAdmin,
  loginAdmin,
  getAdminProfile,
} = require("../controllers/adminAuthController");
const { protectAdmin } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/signup", registerAdmin);
router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.get("/me", protectAdmin, getAdminProfile);

module.exports = router;
