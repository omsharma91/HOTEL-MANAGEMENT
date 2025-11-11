const Hotel = require('../models/Hotel.js');
const room = require('../models/room.js');

const createHotel = async (req, res) => {
  try {
    const hotel = await Hotel.create(req.body);
    res.status(201).json(hotel);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getHotels = async (req, res) => {
  try {
    const hotels = await Hotel.find();
    res.json(hotels);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getRoomsByHotel = async (req, res) => {
  try {
    const { hotelId } = req.params;
    
    const { page = 1, limit = 50 } = req.query;

    // Verify hotel exists
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({ 
        success: false, 
        message: "Hotel not found" 
      });
    }

    const skip = (page - 1) * limit;
    
    const rooms = await Room.find({ hotel: hotelId })
      .populate('hotel', 'name location rating')
      .sort({ floor: 1, roomNumber: 1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Room.countDocuments({ hotel: hotelId });

    res.status(200).json({
      success: true,
      data: rooms,
      hotel: hotel,
      pagination: {
        current: Number(page),
        total: Math.ceil(total / limit),
        count: rooms.length,
        totalRecords: total
      }
    });
  } catch (err) {
    console.error("Error fetching rooms by hotel:", err);
    res.status(500).json({ 
      success: false, 
      message: "Error fetching rooms",
      error: err.message 
    });
  }
};

const deleteHotel = async (req, res) => {
  try {
    const deleted = await Hotel.findByIdAndDelete(req.params.id);
    
    if (!deleted) {
      return res.status(404).json({ 
        success: false, 
        message: "Room not found" 
      });
    }
    
    res.status(200).json({ 
      success: true, 
      message: "Room deleted successfully" 
    });
  } catch (err) {
    console.error("Error deleting room:", err);
    res.status(500).json({ 
      success: false, 
      message: "Error deleting room",
      error: err.message 
    });
  }
};

module.exports = {
  deleteHotel,
  getRoomsByHotel,
  getHotels,
  createHotel
};