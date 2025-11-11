import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchInventory, addInventory } from "../actions/inventoryAction";
import InventoryCard from "../components/InventoryCard";
import AddInventoryModal from "../components/AddInventoryModal";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function InventoryScreen() {
  const dispatch = useDispatch();
  const inventoryState = useSelector((state) => state.inventory);
  const { loading, error, items = [] } = inventoryState; // Default to empty array

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    dispatch(fetchInventory());
  }, [dispatch]);

  // Ensure items is always an array
  const safeItems = Array.isArray(items) ? items : [];

  // Filter inventory by selected category
  const filteredItems = selectedCategory
    ? safeItems.filter((item) => item.category === selectedCategory)
    : safeItems;

  // Chart data
  const chartData = filteredItems.reduce((acc, curr) => {
    const found = acc.find((item) => item.category === curr.category);
    if (found) found.quantity += curr.quantity;
    else acc.push({ category: curr.category, quantity: curr.quantity });
    return acc;
  }, []);

  // Get unique categories safely
  const categories = [...new Set(safeItems.map((item) => item.category || "Uncategorized"))];

  const handleAddInventory = (newItem) => {
    dispatch(addInventory(newItem));
    setIsModalOpen(false);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Inventory Management</h2>

      {/* Controls: Add button + Category Filter */}
      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Add Inventory
        </button>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border rounded px-2 py-1"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Inventory Chart */}
      {chartData.length > 0 ? (
        <div className="w-full h-64 mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="category" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="quantity" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p className="text-gray-500 mb-4">No data available for the chart.</p>
      )}

      {/* Loading/Error */}
      {loading && <p>Loading inventory...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Inventory Cards */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredItems.map((item) => (
            <InventoryCard key={item._id || item.id} item={item} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No inventory items found.</p>
      )}

      {/* Add Inventory Modal */}
      <AddInventoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddInventory={handleAddInventory}
      />
    </div>
  );
}
