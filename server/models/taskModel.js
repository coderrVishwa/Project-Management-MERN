const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    status: {
      type: String,
      required: true,
      default: "pending", // 👈 default value, good
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "projects", // 👈 should match the model name
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users", // 👈 should match the model name
    },
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    attachments: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("tasks", taskSchema);
