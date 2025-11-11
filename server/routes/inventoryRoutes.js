const express = require("express");
const {
  getInventory,
  createInventory,
  getInventoryById,
  updateInventory,
  deleteInventory,
} = require("../controllers/inventoryController");

const router = express.Router();

router.route("/").get(getInventory).post(createInventory);
router.route("/:id").get(getInventoryById).put(updateInventory).delete(deleteInventory);

module.exports = router;
