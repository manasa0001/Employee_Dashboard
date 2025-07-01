
import express from 'express';
import Attendance from '../../models/employee_models/Attendance.js';

const router = express.Router();

// POST /api/attendance/checkin
router.post('/checkin', async (req, res) => {
  const { userId, date, time } = req.body;

  try {
    let attendance = await Attendance.findOne({ userId, date });

    if (attendance) {
      // Already checked in
      if (attendance.clockIn) {
        return res.status(400).json({ 
          error: 'You have already checked in today' 
        });
      } else {
        attendance.clockIn = time;
      }
    } else {
      // New check-in
      attendance = new Attendance({
        userId,
        date,
        clockIn: time,
        status: 'Present'
      });
    }

    await attendance.save();
    res.status(200).json({ message: 'Checked in successfully', attendance });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// POST /api/attendance/checkout
router.post('/checkout', async (req, res) => {
  const { userId, date, time } = req.body;

  try {
    let attendance = await Attendance.findOne({ userId, date });

    if (!attendance) {
      return res.status(404).json({ error: 'No check-in found for today' });
    }

    if (attendance.clockOut) {
      return res.status(400).json({ error: 'You have already checked out today' });
    }

    attendance.clockOut = time;
    await attendance.save();

    res.status(200).json({ message: 'Checked out successfully', attendance });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
// Example Node.js Express route (backend)
router.get('/:userId', async (req, res) => {
  const userId = req.params.userId;

  // Example DB fetch (replace with your DB logic)
  try {
    // Mock example, replace with your DB query
    // const attendanceRecords = await AttendanceModel.find({ userId });

    // For demo, let's pretend:
    const attendanceRecords = [{ date: '2025-05-01', status: 'Present', userId }];

    if (!attendanceRecords || attendanceRecords.length === 0) {
      return res.status(404).json({ error: 'Attendance not found for user' });
    }

    res.json(attendanceRecords);
  } catch (error) {
    console.error('Error fetching attendance:', error);
    res.status(500).json({ error: 'Server error' });
  }
});
export default router;
