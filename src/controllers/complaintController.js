const Complaint = require("../models/Complaint");

const PRIORITY_ORDER = {
  High: 1,
  Medium: 2,
  Low: 3,
};

const normalizeComplaintId = (id) => String(id || "").trim().toUpperCase();

const generateComplaintId = async (sector) => {
  const prefix = `SEC${sector}-`;
  const latestComplaint = await Complaint.findOne({
    complaintId: { $regex: `^${prefix}` },
  })
    .sort({ createdAt: -1 })
    .lean();

  let nextSequence = 1;

  if (latestComplaint && latestComplaint.complaintId) {
    const parts = latestComplaint.complaintId.split("-");
    const previousSequence = Number(parts[1]);

    if (!Number.isNaN(previousSequence)) {
      nextSequence = previousSequence + 1;
    }
  }

  return `${prefix}${String(nextSequence).padStart(3, "0")}`;
};

const createComplaint = async (req, res) => {
  try {
    if (req.user.role !== "resident") {
      return res.status(403).json({
        success: false,
        message: "Only residents can create complaints.",
      });
    }

    const { quarterNo, quarterNumber, sector, category, description, priority } =
      req.body;
    const resolvedQuarterNo = quarterNo || quarterNumber;

    if (!resolvedQuarterNo || !sector || !category || !description) {
      return res.status(400).json({
        success: false,
        message:
          "quarterNo, sector, category, and description are required fields.",
      });
    }

    const active = await Complaint.findOne({
      user: req.user.id,
      status: { $in: ["Pending", "Assigned"] },
    });

    if (active) {
      return res.status(409).json({
        success: false,
        message: "You already have an active complaint.",
      });
    }

    const normalizedSector = Number(sector);
    const complaintId = await generateComplaintId(normalizedSector);

    const complaint = await Complaint.create({
      user: req.user.id,
      complaintId,
      quarterNo: String(resolvedQuarterNo).trim(),
      sector: normalizedSector,
      category,
      description: String(description).trim(),
      priority,
    });

    return res.status(201).json({
      success: true,
      message: "Complaint created successfully.",
      data: complaint,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create complaint.",
      error: error.message,
    });
  }
};

const getAllComplaints = async (req, res) => {
  try {
    const { status, priority, sector, page = 1, limit = 20, search } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (sector) filter.sector = Number(sector);
    if (search) {
      filter.$or = [
        { complaintId: { $regex: search, $options: "i" } },
        { quarterNo: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const safePage = Math.max(Number(page) || 1, 1);
    const safeLimit = Math.min(Math.max(Number(limit) || 20, 1), 100);
    const skip = (safePage - 1) * safeLimit;

    const [complaints, total] = await Promise.all([
      Complaint.find(filter).skip(skip).limit(safeLimit).lean(),
      Complaint.countDocuments(filter),
    ]);

    complaints.sort((a, b) => {
      const prioritySort = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
      if (prioritySort !== 0) return prioritySort;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    return res.status(200).json({
      success: true,
      count: complaints.length,
      pagination: {
        total,
        page: safePage,
        limit: safeLimit,
        totalPages: Math.ceil(total / safeLimit),
      },
      data: complaints,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch complaints.",
      error: error.message,
    });
  }
};

const getComplaintById = async (req, res) => {
  try {
    const complaintId = normalizeComplaintId(req.params.complaintId);

    const complaint = await Complaint.findOne({ complaintId });

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: complaint,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch complaint.",
      error: error.message,
    });
  }
};

const getMyStatus = async (req, res) => {
  try {
    if (req.user.role !== "resident") {
      return res.status(403).json({
        success: false,
        message: "Only residents can view their complaint status.",
      });
    }

    const complaints = await Complaint.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      count: complaints.length,
      data: complaints,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch complaint status.",
      error: error.message,
    });
  }
};

const updateComplaintStatus = async (req, res) => {
  try {
    const complaintId = normalizeComplaintId(req.params.complaintId);
    const { status, assignedTo } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "status is required.",
      });
    }

    const complaint = await Complaint.findOneAndUpdate(
      { complaintId },
      {
        status,
        assignedTo: assignedTo || "",
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Complaint updated successfully.",
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
  createComplaint,
  getAllComplaints,
  getComplaintById,
  getMyStatus,
  updateComplaintStatus,
};
