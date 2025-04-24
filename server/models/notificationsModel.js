const mongoose = require("mongoose");

const notificationsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users", // ✅ references the "users" collection
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    onClick: {
      type: String,
      required: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // ✅ auto adds createdAt and updatedAt
  }
);

module.exports = mongoose.model("notifications", notificationsSchema);
