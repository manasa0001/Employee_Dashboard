import express from "express";
import multer from "multer";
import path from "path";
import mongoose from "mongoose"; // ✅ Added this import
import EmployeeTask from "../../models/employee_models/EmployeeTask.js";
import TaskUpdate from "../../models/employee_models/EmployeeTaskUpdates.js";
import ActivityModel from "../../models/employee_models/Activity.js"; // <-- Make sure this path is correct
const router = express.Router();

// Multer storage setup remains the same
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});
const upload = multer({ storage });

// Fetch tasks
router.get("/", async (req, res) => {
  try {
    const rawUserId = req.user?.id || req.query.userId;
    console.log("Incoming userId:", rawUserId);

    if (!rawUserId) {
      console.log("No userId provided!");
      return res.status(400).json({ message: "User ID is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(rawUserId)) {
      console.log("Invalid ObjectId!");
      return res.status(400).json({ message: "Invalid User ID format" });
    }

    const userId = new mongoose.Types.ObjectId(rawUserId);
    console.log("Fetching tasks for userId:", userId);

    const assignedTasks = await EmployeeTask.find({ userId });
    console.log("Found assignedTasks:", assignedTasks);

    const tasksWithUpdates = await Promise.all(
      assignedTasks.map(async (task) => {
        const taskUpdate = await TaskUpdate.findOne({ taskId: task._id });
        console.log("Task:", task._id, "Update:", taskUpdate);

        return {
          _id: task._id,
          title: taskUpdate?.title || task.title,
          description: task.description,
          status: taskUpdate?.progress || task.status,
          assignee: task.assignee,
          team: task.team,
          startDate: task.startDate,
          endDate: task.endDate,
          reporter: task.reporter,
          attachments: [...(task.attachments || []), ...(taskUpdate?.uploads || [])],
          comments: [...(task.comments || []), ...(taskUpdate?.comments || [])],
          priority: task.priority || null,
          deadline: task.deadline || null,
        };
      })
    );

    res.json(tasksWithUpdates);
  } catch (error) {
    console.error("Error fetching tasks:", error.stack || error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
      stack: error.stack
    });
  }
});

// other routes remain unchanged...

// ---------------- Update/Save Task Update ----------------
router.put("/tasks/:taskId", async (req, res) => {
  try {
    const { taskId } = req.params;
    const { title, deadline, priority, progress, comments, uploads } = req.body;

    // 1️⃣ Find the main task first
    const task = await EmployeeTask.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // 2️⃣ Update the main task selectively
    if (title) task.title = title;
    if (deadline) task.deadline = deadline;
    if (priority) task.priority = priority;
    if (progress) task.progress = progress;

    await task.save();

    // 3️⃣ Create a snapshot in TaskUpdate (append a new update log)
    const taskUpdate = new TaskUpdate({
      taskId,
      title: task.title,
      deadline: task.deadline,
      priority: task.priority,
      progress: task.progress,
      comments: comments ? comments.map((c) => ({
        user: c.user,
        text: c.text,
      })) : [],
      uploads: uploads || [],
    });

    await taskUpdate.save();

    res.json({
      message: "Task updated successfully",
      task,
      taskUpdate,
    });
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
// ---------------- Add Comment to Task ----------------
router.put("/:taskId/status", async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status, userId } = req.body;

    if (!["To Do", "In Progress", "Completed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const task = await EmployeeTask.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    task.status = status;
    await task.save();

    await TaskUpdate.findOneAndUpdate(
      { taskId },
      { progress: status },
      { upsert: true, new: true }
    );

    // ✅ Log activity
    await ActivityModel.create({
      userId,
      taskId,
      action: "status_update",
      newStatus: status,
      timestamp: Date.now(),
    });

    res.json({ message: "Status updated successfully", task });
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
 
router.post("/:taskId/comments", async (req, res) => {
  try {
    const { taskId } = req.params;
    const { text, user, userId } = req.body;

    if (!text) {
      return res.status(400).json({ message: "Comment text is required" });
    }

    let taskUpdate = await TaskUpdate.findOne({ taskId });

    if (!taskUpdate) {
      taskUpdate = new TaskUpdate({
        taskId,
        comments: [{ user, text, createdAt: new Date() }],
      });
    } else {
      taskUpdate.comments.push({ user, text, createdAt: new Date() });
    }

    await taskUpdate.save();

    // ✅ Log Activity
    await ActivityModel.create({
      userId,
      taskId,
      action: "comment_added",
      taskTitle: taskUpdate?.title,
      timestamp: Date.now(),
    });

    res.json({ message: "Comment added successfully", taskUpdate });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


// Upload file to task
router.post("/:taskId/attachments", upload.single("file"), async (req, res) => {
  try {
    const { taskId } = req.params;
    const { userId } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const filePath = `/uploads/${req.file.filename}`;
    let taskUpdate = await TaskUpdate.findOne({ taskId });

    if (!taskUpdate) {
      taskUpdate = new TaskUpdate({ taskId, uploads: [filePath] });
    } else {
      taskUpdate.uploads.push(filePath);
    }

    await taskUpdate.save();

    // ✅ Log Activity
    await ActivityModel.create({
      userId,
      taskId,
      action: "file_upload",
      filename: req.file.originalname,
      timestamp: Date.now(),
    });

    res.json({
      message: "File uploaded successfully",
      filePath,
      taskUpdate,
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
router.delete("/:taskId/attachments", async (req, res) => {
  try {
    const { taskId } = req.params;
    const { fileUrl, userId } = req.body;

    if (!fileUrl) {
      return res.status(400).json({ message: "File URL required" });
    }

    let taskUpdate = await TaskUpdate.findOne({ taskId });
    if (!taskUpdate) {
      return res.status(404).json({ message: "Task update not found" });
    }

    taskUpdate.uploads = taskUpdate.uploads.filter(url => url !== fileUrl);
    await taskUpdate.save();

    // ✅ Log Activity
    await ActivityModel.create({
      userId,
      taskId,
      action: "file_delete",
      filename: fileUrl.split('/').pop(),
      timestamp: Date.now(),
    });

    res.json({ message: "Attachment deleted successfully", taskUpdate });
  } catch (err) {
    console.error("Error deleting file:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});


// In your backend routes file
// In your backend routes file
router.get('/activity', async (req, res) => {
  try {
    const { userId } = req.query;
    const activities = await ActivityModel.find({ userId })
      .sort({ timestamp: -1 })
      .limit(10);
    res.json(activities);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
 