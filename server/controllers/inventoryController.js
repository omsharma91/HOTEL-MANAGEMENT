const Inventory = require("../models/Inventory");

// @desc   Fetch all inventory items
// @route  GET /api/inventory
// @access Private (admin/staff)
const getInventory = async (req, res) => {
  try {
    const items = await Inventory.find({});
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc   Create a new inventory item
// @route  POST /api/inventory
// @access Private
const createInventory = async (req, res) => {
  try {
    const { name, category, quantity, unit, price, addedBy } = req.body;

    const newItem = new Inventory({ name, category, quantity, unit, price, addedBy });
    const createdItem = await newItem.save();

    res.status(201).json(createdItem);
  } catch (error) {
    res.status(400).json({ message: "Invalid data", error: error.message });
  }
};

// @desc   Get single inventory item by ID
// @route  GET /api/inventory/:id
// @access Private
const getInventoryById = async (req, res) => {
  try {
    const item = await Inventory.findById(req.params.id);
    if (item) res.json(item);
    else res.status(404).json({ message: "Inventory item not found" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc   Update inventory item
// @route  PUT /api/inventory/:id
// @access Private
const updateInventory = async (req, res) => {
  try {
    const item = await Inventory.findById(req.params.id);
    if (item) {
      const { name, category, quantity, unit, price, addedBy } = req.body;
      item.name = name || item.name;
      item.category = category || item.category;
      item.quantity = quantity || item.quantity;
      item.unit = unit || item.unit;
      item.price = price || item.price;
      item.addedBy = addedBy || item.addedBy;

      const updatedItem = await item.save();
      res.json(updatedItem);
    } else res.status(404).json({ message: "Inventory item not found" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc   Delete inventory item
// @route  DELETE /api/inventory/:id
// @access Private
const deleteInventory = async (req, res) => {
  try {
    const item = await Inventory.findById(req.params.id);
    if (item) {
      await item.remove();
      res.json({ message: "Inventory item removed" });
    } else res.status(404).json({ message: "Inventory item not found" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

module.exports = {
  getInventory,
  createInventory,
  getInventoryById,
  updateInventory,
  deleteInventory,
};
