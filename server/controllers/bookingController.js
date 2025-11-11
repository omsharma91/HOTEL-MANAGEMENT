const Booking = require('../models/Booking.js');
const room = require('../models/room.js');
// const Booking = require("../models/booking.js");
// const Room = require("../models/Room");

// Create a booking
const createBooking = async (req, res) => {
  try {
    const { room, checkIn, checkOut, guests } = req.body;

    const booking = await Booking.create({
      user: req.user.id,
      room,
      checkIn,
      checkOut,
      guests,
    });

    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all bookings for a user
const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).populate("room");
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Cancel a booking
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { status: "cancelled" },
      { new: true }
    );
    if (!booking) return res.status(404).json({ msg: "Booking not found" });

    res.status(200).json({ msg: "Booking cancelled", booking });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createBooking,
  getUserBookings,
  cancelBooking
};