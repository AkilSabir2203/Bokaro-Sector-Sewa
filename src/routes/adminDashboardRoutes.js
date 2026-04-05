const express = require("express");
const { getDashboardSummary } = require("../controllers/adminDashboardController");
const { protect, restrictTo } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/summary", protect, restrictTo("admin"), getDashboardSummary);

module.exports = router;
