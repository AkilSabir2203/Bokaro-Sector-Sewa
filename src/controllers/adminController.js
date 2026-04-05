const Complaint = require("../models/Complaint");
const updateComplaintStatus = async (req, res) => {
  try {
    const complaintId = String(req.params.id || "").trim();
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "status is required.",
      });
    }

    const allowedUpdates = ["Assigned", "Resolved", "Rejected"];
    if (!allowedUpdates.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "status must be Assigned, Resolved or Rejected.",
      });
    }

    const complaint = await Complaint.findById(complaintId);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found.",
      });
    }

    const transitions = {
      Pending: ["Assigned", "Rejected"],
      Assigned: ["Resolved", "Rejected"],
      Resolved: [],
      Rejected: [],
    };

    if (!transitions[complaint.status].includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status transition from ${complaint.status} to ${status}.`,
      });
    }

    complaint.status = status;
    await complaint.save();

    return res.status(200).json({
      success: true,
      message: "Complaint status updated successfully.",
      data: complaint,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update complaint status.",
      error: error.message,
    });
  }
};

module.exports = {
  updateComplaintStatus,
};
