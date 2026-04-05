const express = require("express");

const { protect, restrictTo } = require("../middlewares/authMiddleware");
const { updateComplaintStatus } = require("../controllers/adminController");

const router = express.Router();

router.patch("/complaints/:id/status", protect, restrictTo("admin"), updateComplaintStatus);

module.exports = router;
