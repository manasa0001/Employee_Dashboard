import express from "express";
import {
  getProjects,
  createProject,
  updateProject
} from "../../controllers/admin_controller/projectController.js";

const router = express.Router();

router.get("/", getProjects);
router.post("/", createProject);
router.put("/:id", updateProject);

export default router;
