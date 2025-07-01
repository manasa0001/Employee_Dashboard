import Emmployee from "../../models/admin_models/Emmployee.js";

export const getEmmployees = async (req, res) => {
  try {
    const employees = await Emmployee.find();
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const createEmmployee = async (req, res) => {
  try {
    const newEmployee = new Emmployee(req.body);
    const savedEmployee = await newEmployee.save();
    res.status(201).json(savedEmployee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
