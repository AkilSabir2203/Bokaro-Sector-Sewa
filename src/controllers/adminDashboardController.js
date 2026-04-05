const Complaint = require("../models/Complaint");

const getDashboardSummary = async (req, res) => {
  try {
    const [total, pending, assigned, resolved, highPriority, sectorBreakdown, categoryBreakdown] =
      await Promise.all([
        Complaint.countDocuments(),
        Complaint.countDocuments({ status: "Pending" }),
        Complaint.countDocuments({ status: "Assigned" }),
        Complaint.countDocuments({ status: "Resolved" }),
        Complaint.countDocuments({ priority: "High" }),
        Complaint.aggregate([
          { $group: { _id: "$sector", count: { $sum: 1 } } },
          { $sort: { _id: 1 } },
        ]),
        Complaint.aggregate([
          { $group: { _id: "$category", count: { $sum: 1 } } },
          { $sort: { count: -1 } },
        ]),
      ]);

    return res.status(200).json({
      success: true,
      data: {
        totals: {
          total,
          pending,
          assigned,
          resolved,
          highPriority,
        },
        sectorBreakdown,
        categoryBreakdown,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard analytics.",
      error: error.message,
    });
  }
};

module.exports = {
  getDashboardSummary,
};
