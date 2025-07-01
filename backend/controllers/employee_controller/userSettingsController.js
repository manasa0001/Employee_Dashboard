import UsersData from '../../models/UsersData.js';
import bcrypt from 'bcryptjs';

// Change Password
export const changePassword = async (req, res) => {
  try {
    const userId = req.userId;
    const { currentPassword, newPassword } = req.body;

    const user = await UsersData.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Current password is incorrect' });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update Notification Preferences
export const updateNotificationSettings = async (req, res) => {
  try {
    const userId = req.userId;
    const { emailNotifications, smsNotifications } = req.body;

    const user = await UsersData.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.notificationPreferences = { emailNotifications, smsNotifications };
    await user.save();

    res.status(200).json({ message: 'Notification settings updated' });
  } catch (error) {
    console.error('Notification update error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
