
import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import Leave from "../models/Leave.js";
import LeaveUpdate from "../models/LeaveUpdate.js";

dotenv.config();
const router = express.Router();

const BASE_URL = "http://192.168.1.172:5000";  // adjust to your IP/port

// helper to get a transporter
function makeTransporter() {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "naniy8123@gmail.com",
      pass: "bgpp vikc sucf kjix",
    },
  });
}

// 1) Create a leave request
router.post("/request", async (req, res) => {
  try {
    const leave = new Leave(req.body);
    await leave.save();
    res.status(200).json({ message: "Leave saved", leaveId: leave._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// 2) Send initial email to admin
router.post("/send-email", async (req, res) => {
  const {
    to = "muthaipallymanasa001@gmail.com",
    subject,
    text,
    employeeName,
    leaveType,
    fromDate,
    toDate,
    about,
    leaveId,
  } = req.body;

  if (!(employeeName && leaveType && fromDate && toDate && about && leaveId)) {
    return res.status(400).json({ error: "Missing leave details" });
  }

  const approvalLink = `${BASE_URL}/api/leaves/status/${leaveId}/Approved`;
  const rejectionLink = `${BASE_URL}/api/leaves/status/${leaveId}/Rejected`;

  const mailOptions = {
    from: "naniy8123@gmail.com",
    to,
    subject: subject || `Leave Request from ${employeeName}`,
    html: `
      <p><strong>${employeeName}</strong> requests <strong>${leaveType}</strong> from
         ${new Date(fromDate).toLocaleDateString()} to ${new Date(toDate).toLocaleDateString()}.</p>
      <p>Reason: ${about}</p>
      <p>
        <a href="${approvalLink}">✅ Approve</a> |
        <a href="${rejectionLink}">❌ Reject</a>
      </p>
    `,
  };

  try {
    await makeTransporter().sendMail(mailOptions);
    res.status(200).json({ message: "Email sent to admin" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// 3) Approve or reject a leave
router.get("/status/:id/:action", async (req, res) => {
  const { id, action } = req.params;
  if (!["Approved", "Rejected"].includes(action)) {
    return res.status(400).send("Invalid action");
  }

  try {
    const updatedLeave = await Leave.findByIdAndUpdate(
      id,
      { status: action, seen: false },
      { new: true }
    );
    if (!updatedLeave) return res.status(404).send("Leave not found");

    const formattedDate = new Date(updatedLeave.fromDate).toLocaleDateString(
      "en-US",
      { year: "numeric", month: "long", day: "numeric" }
    );
    const message = `${action} ${updatedLeave.leaveType} on ${formattedDate}`;

    const leaveUpdate = new LeaveUpdate({
      leaveId: updatedLeave._id,
      employeeName: updatedLeave.employeeName,
      leaveType: updatedLeave.leaveType,
      fromDate: updatedLeave.fromDate,
      toDate: updatedLeave.toDate,
      status: action,
      message,
    });
    await leaveUpdate.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "naniy8123@gmail.com",
        pass: "bgpp vikc sucf kjix",
      },
    });

    await transporter.sendMail({
      from: "naniy8123@gmail.com",
      to: "muthaipallymanasa001@gmail.com",
      subject: `Leave ${action} for ${updatedLeave.employeeName}`,
      html: `
        <p><strong>${updatedLeave.employeeName}</strong>'s <strong>${updatedLeave.leaveType}</strong> leave has been <strong>${action}</strong>.</p>
        <p>Dates: ${new Date(updatedLeave.fromDate).toDateString()} – ${new Date(updatedLeave.toDate).toDateString()}</p>
        <p>Action taken at: ${new Date().toLocaleString()}</p>
      `,
    });

    res.send(`Leave ${action} & update recorded.`);
  } catch (err) {
    console.error("Error in /status:", err);
    res.status(500).send(err.message);
  }
});

// 4) Last 10 LeaveUpdate notifications
router.get("/notifications", async (req, res) => {
  try {
    const notes = await LeaveUpdate.find(
      {},
      { message: 1, status: 1, seen: 1, createdAt: 1 }
    )
      .sort({ createdAt: -1 })
      .limit(10);

    res.json(notes);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// 5) Count unseen notifications
router.get("/notifications/unseen-count", async (req, res) => {
  try {
    const count = await LeaveUpdate.countDocuments({ seen: false });
    res.json({ unseenCount: count });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// 6) Mark all as seen
router.put("/notifications/mark-seen", async (req, res) => {
  try {
    await LeaveUpdate.updateMany({ seen: false }, { seen: true });
    res.json({ message: "All notifications marked as seen" });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

export default router;
