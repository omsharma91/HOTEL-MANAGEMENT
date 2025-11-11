import React, { useState } from "react";

export default function AddInventoryModal({ isOpen, onClose, onAddInventory }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [unit, setUnit] = useState("pcs");
  const [price, setPrice] = useState(0);
  const [addedBy, setAddedBy] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddInventory({ name, category, quantity, unit, price, addedBy });
    // reset form
    setName("");
    setCategory("");
    setQuantity(0);
    setUnit("pcs");
    setPrice(0);
    setAddedBy("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
        <h3 className="text-xl font-semibold mb-4">Add Inventory</h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border px-2 py-1 rounded"
            required
          />
          <input
            type="text"
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border px-2 py-1 rounded"
            required
          />
          <input
            type="number"
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-full border px-2 py-1 rounded"
            required
          />
          <input
            type="text"
            placeholder="Unit"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="w-full border px-2 py-1 rounded"
          />
          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="w-full border px-2 py-1 rounded"
          />
          <input
            type="text"
            placeholder="Added By"
            value={addedBy}
            onChange={(e) => setAddedBy(e.target.value)}
            className="w-full border px-2 py-1 rounded"
          />
          <div className="flex justify-end gap-2 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
