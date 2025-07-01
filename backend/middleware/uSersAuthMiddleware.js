import jwt from 'jsonwebtoken';
import uSers from '../models/admin_models/UserModel.js';

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await uSers.findById(decoded.id).select('-password');
    if (!req.user) throw new Error("User not found");
    next();
  } catch (error) {
    console.error("Auth error:", error);
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};

export default protect;
