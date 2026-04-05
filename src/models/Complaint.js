const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    complaintId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    quarterNo: {
      type: String,
      required: true,
      trim: true,
    },
    sector: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },
    category: {
      type: String,
      required: true,
      enum: ["Plumbing", "Electrical", "Carpentry"],
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 1000,
    },
    priority: {
      type: String,
      enum: ["High", "Medium", "Low"],
      default: "Medium",
    },
    status: {
      type: String,
      enum: ["Pending", "Assigned", "Resolved", "Rejected"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Complaint", complaintSchema);
