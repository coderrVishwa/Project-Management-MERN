const router = require("express").Router();
const Task = require("../models/taskModel");
const Project = require("../models/projectModel");
const User = require("../models/userModel");
const authMiddleware = require("../middlewares/authMiddleware");
const cloudinary = require("../config/cloudinaryConfig");
const multer = require("multer");

// Create a new task
router.post("/create-task", authMiddleware, async (req, res) => {
  try {
    const newTask = new Task(req.body);
    await newTask.save();
    res.status(201).send({
      success: true,
      message: "Task created successfully",
      data: newTask,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Failed to create task",
      error: error.message,
    });
  }
});

// Get all tasks with filtering and sorting
router.post("/get-all-tasks", authMiddleware, async (req, res) => {
  try {
    // Filter out any keys with value "all"
    Object.keys(req.body).forEach((key) => {
      if (req.body[key] === "all") {
        delete req.body[key];
      }
    });
    delete req.body["userId"];

    const tasks = await Task.find(req.body)
      .populate("assignedTo")
      .populate("assignedBy")
      .populate("project")
      .sort({ createdAt: -1 });

    res.status(200).send({
      success: true,
      message: "Tasks fetched successfully",
      data: tasks,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Failed to fetch tasks",
      error: error.message,
    });
  }
});

// Update a task
router.post("/update-task", authMiddleware, async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(req.body._id, req.body, { new: true });

    if (!updatedTask) {
      return res.status(404).send({
        success: false,
        message: "Task not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Task updated successfully",
      data: updatedTask,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Failed to update task",
      error: error.message,
    });
  }
});

// Delete a task
router.post("/delete-task", authMiddleware, async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.body._id);

    if (!deletedTask) {
      return res.status(404).send({
        success: false,
        message: "Task not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Failed to delete task",
      error: error.message,
    });
  }
});

// Set up multer for file upload
const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

router.post(
  "/upload-image",
  authMiddleware,
  multer({ storage: storage }).single("file"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).send({
          success: false,
          message: "No file uploaded",
        });
      }

      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "tasks",
      });

      const imageURL = result.secure_url;

      // Update task with the new image URL
      const task = await Task.findOneAndUpdate(
        { _id: req.body.taskId },
        {
          $push: {
            attachments: imageURL,
          },
        },
        { new: true }
      );

      // Delete the local file after upload
      const fs = require("fs");
      fs.unlinkSync(req.file.path);

      if (!task) {
        return res.status(404).send({
          success: false,
          message: "Task not found",
        });
      }

      res.status(200).send({
        success: true,
        message: "Image uploaded successfully",
        data: imageURL,
      });
    } catch (error) {
      res.status(500).send({
        success: false,
        message: "Failed to upload image",
        error: error.message,
      });
    }
  }
);

module.exports = router;
