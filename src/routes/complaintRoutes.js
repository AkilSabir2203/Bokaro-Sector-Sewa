const express = require("express");
const {
  createComplaint,
  getAllComplaints,
  getComplaintById,
  getMyStatus,
} = require("../controllers/complaintController");
const { protect, restrictTo } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", protect, restrictTo("resident"), createComplaint);
router.get("/my-status", protect, restrictTo("resident"), getMyStatus);
router.get("/", protect, restrictTo("admin"), getAllComplaints);
router.get("/:complaintId", getComplaintById);

module.exports = router;
