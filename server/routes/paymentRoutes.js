const express = require("express");
const Booking = require("../models/Booking.js");
const Room = require("../models/Room.js");

const router = express.Router();

// Mock "Create Order" (No Razorpay)
router.post("/create-order", async (req, res) => {
  try {
    const { amount, roomId, userId } = req.body;

    // Just return a mock order object
    const mockOrder = {
      id: `mock_order_${Date.now()}`,
      amount: amount * 100,
      currency: "INR",
      status: "created",
    };

    res.json({ order: mockOrder, roomId, userId });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating mock order");
  }
});

// Mock "Verify Payment" (Always Successful)
router.post("/verify", async (req, res) => {
  try {
    const { roomId, userId } = req.body;

    // ✅ Directly mark as booked without Razorpay verification
    const booking = new Booking({
      user: userId,
      room: roomId,
      paymentId: `mock_payment_${Date.now()}`,
      status: "confirmed",
    });

    await booking.save();

    // Update room availability
    await Room.findByIdAndUpdate(roomId, { isBooked: true });

    res.json({ success: true, message: "payment verified & room booked!" });
  } catch (err) {
    console.error(err);
    res.status(500).send("payment verification failed");
  }
});

module.exports = router;
