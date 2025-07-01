import express from "express";
import { getEmmployees, createEmmployee } from "../../controllers/admin_controller/emmployeeController.js";

const router = express.Router();

router.get("/", getEmmployees);
router.post("/", createEmmployee);

export default router;
