const Hotel = require('../models/Hotel.js');
const Room = require('../models/room.js');
// const Room = require("../models/Room");
// const Hotel = require("../models/Hotel");

// Create room
const createRoom = async (req, res) => {
  try {
    const {
      name,
      type,
      price,
      description,
      capacity,
      size,
      amenities,
      images,
      isBooked,
      isAvailable,
      floor,
      roomNumber,
      hotel
    } = req.body;

    // Validate required fields
    if (!name || !type || !price) {
      return res.status(400).json({ 
        success: false, 
        message: "Name, type, and price are required" 
      });
    }

    // Check if hotel exists
    if (hotel) {
      const hotelExists = await Hotel.findById(hotel);
      if (!hotelExists) {
        return res.status(404).json({ 
          success: false, 
          message: "Hotel not found" 
        });
      }
    }

    // Check if room number already exists in this hotel
    if (roomNumber && hotel) {
      const existingRoom = await Room.findOne({ roomNumber, hotel });
      if (existingRoom) {
        return res.status(400).json({ 
          success: false, 
          message: "Room number already exists in this hotel" 
        });
      }
    }

    const newRoom = await Room.create({
      name,
      type,
      price: Number(price),
      description: description || "",
      capacity: capacity || 1,
      size: size || "",
      amenities: amenities || [],
      images: images || [],
      isBooked: isBooked || false,
      isAvailable: isAvailable !== undefined ? isAvailable : true,
      floor: floor || 1,
      roomNumber: roomNumber || "",
      hotel: hotel || null,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Populate hotel information
    await newRoom.populate('hotel', 'name location');

    res.status(201).json({
      success: true,
      message: "Room created successfully",
      data: newRoom
    });
  } catch (err) {
    console.error("Error creating room:", err);
    res.status(500).json({ 
      success: false, 
      message: "Error creating room",
      error: err.message 
    });
  }
};

// Get all rooms or rooms by hotel
const getRooms = async (req, res) => {
  try {
    const { hotel, type, minPrice, maxPrice, available, page = 1, limit = 50 } = req.query;
    
    let query = {};
    
    // Filter by hotel if provided
    if (hotel) {
      query.hotel = hotel;
    }
    
    // Filter by room type
    if (type) {
      query.type = type;
    }
    
    // Filter by price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    
    // Filter by availability
    if (available !== undefined) {
      query.isAvailable = available === 'true';
    }

    const skip = (page - 1) * limit;
    
    const rooms = await Room.find(query)
      .populate('hotel', 'name location rating')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Room.countDocuments(query);

    res.status(200).json({
      success: true,
      data: rooms,
      pagination: {
        current: Number(page),
        total: Math.ceil(total / limit),
        count: rooms.length,
        totalRecords: total
      }
    });
  } catch (err) {
    console.error("Error fetching rooms:", err);
    res.status(500).json({ 
      success: false, 
      message: "Error fetching rooms",
      error: err.message 
    });
  }
};

// Get rooms by hotel ID (specific endpoint)
const getRoomsByHotel = async (req, res) => {
  try {
    const { hotelId } = req.params;
    console.log(hotelId);
    
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

// Get room by ID
const getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id)
      .populate('hotel', 'name location rating contact');
      
    if (!room) {
      return res.status(404).json({ 
        success: false, 
        message: "Room not found" 
      });
    }
    
    res.status(200).json({
      success: true,
      data: room
    });
  } catch (err) {
    console.error("Error fetching room by ID:", err);
    res.status(500).json({ 
      success: false, 
      message: "Error fetching room",
      error: err.message 
    });
  }
};

// Update room
const updateRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body, updatedAt: new Date() };

    // If updating room number, check for duplicates
    if (updateData.roomNumber && updateData.hotel) {
      const existingRoom = await Room.findOne({ 
        roomNumber: updateData.roomNumber, 
        hotel: updateData.hotel,
        _id: { $ne: id }
      });
      
      if (existingRoom) {
        return res.status(400).json({ 
          success: false, 
          message: "Room number already exists in this hotel" 
        });
      }
    }

    const updated = await Room.findByIdAndUpdate(
      id, 
      updateData, 
      { new: true, runValidators: true }
    ).populate('hotel', 'name location');
    
    if (!updated) {
      return res.status(404).json({ 
        success: false, 
        message: "Room not found" 
      });
    }
    
    res.status(200).json({
      success: true,
      message: "Room updated successfully",
      data: updated
    });
  } catch (err) {
    console.error("Error updating room:", err);
    res.status(500).json({ 
      success: false, 
      message: "Error updating room",
      error: err.message 
    });
  }
};

// Delete room
const deleteRoom = async (req, res) => {
  try {
    const deleted = await Room.findByIdAndDelete(req.params.id);
    
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

// Bulk update rooms
const bulkUpdateRooms = async (req, res) => {
  try {
    const { roomIds, updateData } = req.body;
    
    if (!roomIds || !Array.isArray(roomIds) || roomIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Room IDs array is required"
      });
    }

    const result = await Room.updateMany(
      { _id: { $in: roomIds } },
      { ...updateData, updatedAt: new Date() }
    );

    res.status(200).json({
      success: true,
      message: `${result.modifiedCount} rooms updated successfully`,
      data: result
    });
  } catch (err) {
    console.error("Error bulk updating rooms:", err);
    res.status(500).json({
      success: false,
      message: "Error updating rooms",
      error: err.message
    });
  }
};

// Search rooms with advanced filters
const searchRooms = async (req, res) => {
  try {
    const {
      q, // search query
      hotel,
      type,
      minPrice,
      maxPrice,
      capacity,
      amenities,
      available,
      floor,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 20
    } = req.query;

    let query = {};

    // Text search
    if (q) {
      query.$or = [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { roomNumber: { $regex: q, $options: 'i' } },
        { type: { $regex: q, $options: 'i' } }
      ];
    }

    // Filters
    if (hotel) query.hotel = hotel;
    if (type) query.type = type;
    if (capacity) query.capacity = { $gte: Number(capacity) };
    if (floor) query.floor = Number(floor);
    
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    
    if (amenities) {
      const amenitiesArray = Array.isArray(amenities) ? amenities : [amenities];
      query.amenities = { $in: amenitiesArray };
    }
    
    if (available !== undefined) {
      query.isAvailable = available === 'true';
      if (available === 'true') {
        query.isBooked = false;
      }
    }

    const sortObj = {};
    sortObj[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const skip = (page - 1) * limit;

    const rooms = await Room.find(query)
      .populate('hotel', 'name location rating')
      .sort(sortObj)
      .skip(skip)
      .limit(Number(limit));

    const total = await Room.countDocuments(query);

    res.status(200).json({
      success: true,
      data: rooms,
      pagination: {
        current: Number(page),
        total: Math.ceil(total / limit),
        count: rooms.length,
        totalRecords: total
      },
      query: req.query
    });
  } catch (err) {
    console.error("Error searching rooms:", err);
    res.status(500).json({
      success: false,
      message: "Error searching rooms",
      error: err.message
    });
  }
};

// Get room statistics
const getRoomStatistics = async (req, res) => {
  try {
    const { hotelId } = req.params;
    
    let matchQuery = {};
    if (hotelId) {
      matchQuery.hotel = hotelId;
    }

    const stats = await Room.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          available: {
            $sum: {
              $cond: [
                { $and: [{ $eq: ["$isAvailable", true] }, { $eq: ["$isBooked", false] }] },
                1,
                0
              ]
            }
          },
          booked: {
            $sum: { $cond: [{ $eq: ["$isBooked", true] }, 1, 0] }
          },
          maintenance: {
            $sum: { $cond: [{ $eq: ["$isAvailable", false] }, 1, 0] }
          },
          avgPrice: { $avg: "$price" },
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" }
        }
      }
    ]);

    const roomTypeStats = await Room.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: "$type",
          count: { $sum: 1 },
          avgPrice: { $avg: "$price" }
        }
      }
    ]);

    const result = {
      total: stats[0]?.total || 0,
      available: stats[0]?.available || 0,
      booked: stats[0]?.booked || 0,
      maintenance: stats[0]?.maintenance || 0,
      avgPrice: Math.round(stats[0]?.avgPrice || 0),
      minPrice: stats[0]?.minPrice || 0,
      maxPrice: stats[0]?.maxPrice || 0,
      typeBreakdown: roomTypeStats
    };

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (err) {
    console.error("Error fetching room statistics:", err);
    res.status(500).json({
      success: false,
      message: "Error fetching statistics",
      error: err.message
    });
  }
};
module.exports = {
  createRoom,
  getRooms,
  getRoomStatistics,
  searchRooms,
  bulkUpdateRooms,
  getRoomsByHotel,
  getRoomById,
  updateRoom,
  deleteRoom
};