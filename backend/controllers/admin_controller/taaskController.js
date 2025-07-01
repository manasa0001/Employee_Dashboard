import Taask from "../../models/admin_models/Taask.js";

export const getTaasks = async (req, res) => {
  try {
    const taasks = await Taask.find();
    res.status(200).json(taasks);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const createTaask = async (req, res) => {
  try {
    const newTaask = new Taask(req.body);
    const savedTaask = await newTaask.save();
    res.status(201).json(savedTaask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateTaask = async (req, res) => {
  try {
    const updatedTaask = await Taask.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedTaask) return res.status(404).json({ message: "Taask not found" });
    res.status(200).json(updatedTaask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteTaask = async (req, res) => {
  try {
    const deleted = await Taask.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Taask not found" });
    res.status(200).json({ message: "Taask deleted" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};