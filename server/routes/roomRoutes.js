const express = require("express");
const {
  createRoom,
  getRooms,
  getRoomsByHotel,
  getRoomById,
  updateRoom,
  deleteRoom,
  bulkUpdateRooms,
  searchRooms,
  getRoomStatistics
} = require("../controllers/roomController");
const authMiddleware = require("../middleware/auth");
const { protect, authorize } = require("../middleware/user");

const router = express.Router();

// Routes for rooms
router.post("/",protect,authorize("admin","user"), createRoom);                    // Create room
router.get("/",protect,authorize("admin","user"), getRooms);                      // Get all rooms with filters
router.get("/search",protect,authorize("admin","user"), searchRooms);             // Search rooms with advanced filters
router.get("/statistics",protect,authorize("admin","user"), getRoomStatistics);   // Get overall room statistics
router.put("/bulk-update",protect,authorize("admin","user"), bulkUpdateRooms);    // Bulk update multiple rooms
router.get("/:id",protect,authorize("admin","user"), getRoomById);                // Get single room by ID
router.put("/:id",protect,authorize("admin","user"), updateRoom);                 // Update room by ID
router.delete("/:id",protect,authorize("admin","user"), deleteRoom);              // Delete room by ID

// Routes for hotel-specific rooms
// router.get("/hotel/:hotelId/rooms", getRoomsByHotel);           // Get rooms by hotel ID
router.get("/hotel/:hotelId/statistics",protect,authorize("admin","user"), getRoomStatistics); // Get hotel room statistics

module.exports = router;