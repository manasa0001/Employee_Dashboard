
import express from "express";
import multer from "multer";
import path from "path";
import EmployeeTask from "../models/EmployeeTask.js";
import TaskUpdate from "../models/EmployeeTaskUpdates.js";

const router = express.Router();

// ---------------- Multer Setup for File Uploads ----------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage });

// ---------------- Fetch All Tasks (with Updates) ----------------
router.get("/tasks", async (req, res) => {
  try {
    const employeeId = req.user.id;

    const assignedTasks = await EmployeeTask.find({ assignee: employeeId });

    const tasksWithUpdates = await Promise.all(
      assignedTasks.map(async (task) => {
        const taskUpdate = await TaskUpdate.findOne({ taskId: task._id });

        if (taskUpdate) {
          return {
            _id: task._id,
            title: taskUpdate.title || task.title,
            description: task.description,
            status: taskUpdate.progress || task.status,
            assignee: task.assignee,
            team: task.team,
            startDate: task.startDate,
            endDate: task.endDate,
            reporter: task.reporter,
            attachments: [...(task.attachments || []), ...(taskUpdate.uploads || [])],
            comments: [...(task.comments || []), ...(taskUpdate.comments || [])],
            priority: taskUpdate.priority,
            deadline: taskUpdate.deadline,
          };
        } else {
          return {
            _id: task._id,
            title: task.title,
            description: task.description,
            status: task.status,
            assignee: task.assignee,
            team: task.team,
            startDate: task.startDate,
            endDate: task.endDate,
            reporter: task.reporter,
            attachments: task.attachments || [],
            comments: task.comments || [],
            priority: null,
            deadline: null,
          };
        }
      })
    );

    res.json(tasksWithUpdates);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ---------------- Update/Save Task Update ----------------
router.put("/tasks/:taskId", async (req, res) => {
  try {
    const { taskId } = req.params;
    const { title, priority, deadline, progress } = req.body;

    const originalTask = await EmployeeTask.findById(taskId);
    if (!originalTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    let taskUpdate = await TaskUpdate.findOne({ taskId });

    if (!taskUpdate) {
      taskUpdate = new TaskUpdate({
        taskId,
        title,
        priority,
        deadline,
        progress,
      });
    } else {
      taskUpdate.title = title || taskUpdate.title;
      taskUpdate.priority = priority || taskUpdate.priority;
      taskUpdate.deadline = deadline || taskUpdate.deadline;
      taskUpdate.progress = progress || taskUpdate.progress;
    }

    await taskUpdate.save();

    res.json({ message: "Task updated successfully", taskUpdate });
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ---------------- Add Comment to Task ----------------
router.post("/tasks/:taskId/comments", async (req, res) => {
  try {
    const { taskId } = req.params;
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: "Comment text is required" });
    }

    let taskUpdate = await TaskUpdate.findOne({ taskId });

    if (!taskUpdate) {
      taskUpdate = new TaskUpdate({
        taskId,
        comments: [{ user: req.user.name, text }],
      });
    } else {
      taskUpdate.comments.push({ user: req.user.name, text });
    }

    await taskUpdate.save();

    res.json({ message: "Comment added successfully", taskUpdate });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ---------------- Upload File to Task ----------------
router.post("/tasks/:taskId/uploads", upload.single("file"), async (req, res) => {
  try {
    const { taskId } = req.params;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    let taskUpdate = await TaskUpdate.findOne({ taskId });

    if (!taskUpdate) {
      taskUpdate = new TaskUpdate({
        taskId,
        uploads: [`/uploads/${req.file.filename}`],
      });
    } else {
      taskUpdate.uploads.push(`/uploads/${req.file.filename}`);
    }

    await taskUpdate.save();

    res.json({ message: "File uploaded successfully", taskUpdate });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
