import uSers from '../../models/admin_models/UserModel.js';

// @desc   Get user profile
// @route  GET /api/uSers/profile
// @access Private
export const getProfile = async (req, res) => {
  const user = req.user;

  res.json({
    fullName: user.fullName || '',
    email: user.email || '',
    contactNumber: user.contactNumber || '',
    address: user.address || '',
    profilePic: user.profilePic || ''
  });
};

// @desc   Update user profile
// @route  PUT /api/uSers/profile
// @access Private
export const updateProfile = async (req, res) => {
  const user = await uSers.findById(req.user._id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  user.fullName = req.body.fullName || user.fullName;
  user.email = req.body.email || user.email;
  user.contactNumber = req.body.contactNumber || user.contactNumber;
  user.address = req.body.address || user.address;

  const updated = await user.save();

  res.json({
    fullName: updated.fullName,
    email: updated.email,
    contactNumber: updated.contactNumber,
    address: updated.address,
    profilePic: updated.profilePic
  });
};
