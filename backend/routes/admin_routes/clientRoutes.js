import express from "express";
import { getClients, createClient, deleteClient } from "../../controllers/admin_controller/clientController.js";

const router = express.Router();

router.get("/", getClients);
router.post("/", createClient);
router.delete("/:id", deleteClient);

export default router;
