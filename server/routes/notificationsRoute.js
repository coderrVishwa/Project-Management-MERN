const router = require("express").Router();
const Notification = require("../models/notificationsModel");
const authMiddleware = require("../middlewares/authMiddleware");

// Add a new notification
router.post("/add-notification", authMiddleware, async (req, res) => {
  try {
    const newNotification = new Notification({
      user: req.body.userId, // Ensure userId is passed in the request body
      title: req.body.title,
      description: req.body.description,
      onClick: req.body.onClick,
    });

    await newNotification.save();

    res.status(201).send({
      success: true,
      message: "Notification added successfully",
      data: newNotification,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Failed to add notification",
      error: error.message,
    });
  }
});

// Get all notifications for the authenticated user
router.get("/get-all-notifications", authMiddleware, async (req, res) => {
  try {
    const notifications = await Notification.find({
      user: req.body.userId,
    }).sort({ createdAt: -1 });

    res.status(200).send({
      success: true,
      data: notifications,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Failed to retrieve notifications",
      error: error.message,
    });
  }
});

// Mark all unread notifications as read
router.post("/mark-as-read", authMiddleware, async (req, res) => {
  try {
    const updatedNotifications = await Notification.updateMany(
      {
        user: req.body.userId,
        read: false,
      },
      {
        read: true,
      }
    );

    // Fetch the updated list of notifications
    const notifications = await Notification.find({
      user: req.body.userId,
    }).sort({ createdAt: -1 });

    res.status(200).send({
      success: true,
      message: "Notifications marked as read",
      data: notifications,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Failed to mark notifications as read",
      error: error.message,
    });
  }
});

// Delete all notifications for the authenticated user
router.delete("/delete-all-notifications", authMiddleware, async (req, res) => {
  try {
    await Notification.deleteMany({
      user: req.body.userId,
    });

    res.status(200).send({
      success: true,
      message: "All notifications deleted",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Failed to delete notifications",
      error: error.message,
    });
  }
});

module.exports = router;
