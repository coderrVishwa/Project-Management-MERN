const router = require("express").Router();
const Project = require("../models/projectModel");
const authMiddleware = require("../middlewares/authMiddleware");
const User = require("../models/userModel");

// Create a new project
router.post("/create-project", authMiddleware, async (req, res) => {
  try {
    const newProject = new Project(req.body);
    await newProject.save();
    res.status(201).send({
      success: true,
      data: newProject,
      message: "Project created successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Failed to create project",
      error: error.message,
    });
  }
});

// Get all projects by owner
router.post("/get-all-projects", authMiddleware, async (req, res) => {
  try {
    const projects = await Project.find({ owner: req.body.userId })
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      data: projects,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Failed to retrieve projects",
      error: error.message,
    });
  }
});

// Get project by ID
router.post("/get-project-by-id", authMiddleware, async (req, res) => {
  try {
    const project = await Project.findById(req.body._id)
      .populate("owner")
      .populate("members.user");

    if (!project) {
      return res.status(404).send({
        success: false,
        message: "Project not found",
      });
    }

    res.status(200).send({
      success: true,
      data: project,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Failed to retrieve project",
      error: error.message,
    });
  }
});

// Get projects by user role
router.post("/get-projects-by-role", authMiddleware, async (req, res) => {
  try {
    const userId = req.body.userId;
    const projects = await Project.find({ "members.user": userId })
      .sort({ createdAt: -1 })
      .populate("owner");

    res.status(200).send({
      success: true,
      data: projects,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Failed to retrieve projects by role",
      error: error.message,
    });
  }
});

// Edit project
router.post("/edit-project", authMiddleware, async (req, res) => {
  try {
    const updatedProject = await Project.findByIdAndUpdate(req.body._id, req.body, { new: true });

    if (!updatedProject) {
      return res.status(404).send({
        success: false,
        message: "Project not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Project updated successfully",
      data: updatedProject,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Failed to update project",
      error: error.message,
    });
  }
});

// Delete project
router.post("/delete-project", authMiddleware, async (req, res) => {
  try {
    const deletedProject = await Project.findByIdAndDelete(req.body._id);

    if (!deletedProject) {
      return res.status(404).send({
        success: false,
        message: "Project not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Failed to delete project",
      error: error.message,
    });
  }
});

// Add member to project
router.post("/add-member", authMiddleware, async (req, res) => {
  try {
    const { email, role, projectId } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    await Project.findByIdAndUpdate(projectId, {
      $push: {
        members: { user: user._id, role },
      },
    });

    res.status(200).send({
      success: true,
      message: "Member added successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Failed to add member",
      error: error.message,
    });
  }
});

// Remove member from project
router.post("/remove-member", authMiddleware, async (req, res) => {
  try {
    const { memberId, projectId } = req.body;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).send({
        success: false,
        message: "Project not found",
      });
    }

    project.members.pull(memberId);
    await project.save();

    res.status(200).send({
      success: true,
      message: "Member removed successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Failed to remove member",
      error: error.message,
    });
  }
});

module.exports = router;
