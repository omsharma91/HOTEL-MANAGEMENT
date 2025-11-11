const express = require("express");
const {
  createBooking,
  getUserBookings,
  cancelBooking,
} = require("../controllers/bookingController");
const { protect, authorize } = require("../middleware/user");

const router = express.Router();

router.post("/", protect,authorize("admin"), createBooking);
router.get("/my", protect,authorize("user","admin"), getUserBookings);
router.put("/cancel/:id", protect,authorize("admin"), cancelBooking);

module.exports = router;
