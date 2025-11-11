const express = require("express");
const {
  getHotels,
  createHotel,
  getRoomsByHotel,
  deleteHotel
} = require("../controllers/hotelController.js");
const { authorize, protect } = require("../middleware/user.js");
const router = express()

router.get('/',protect,authorize("user","admin"), getHotels);

router.post('/',protect, authorize("admin"), createHotel);
router.get("/:hotelId/rooms",protect,authorize("user", "admin"),  getRoomsByHotel); 
router.delete("/:id",protect,authorize("admin","user"), deleteHotel);              // Delete room by ID

module.exports = router;