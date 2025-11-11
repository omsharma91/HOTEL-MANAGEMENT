const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true }, // e.g., Food, Beverage, Linen
    quantity: { type: Number, required: true },
    unit: { type: String, default: "pcs" }, // unit of measurement
    price: { type: Number, default: 0 },
    addedBy: { type: String }, // Admin or Staff
  },
  { timestamps: true }
);

const Inventory = mongoose.model("Inventory", inventorySchema);
module.exports = Inventory;
