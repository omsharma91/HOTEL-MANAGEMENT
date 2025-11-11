import React from "react";

export default function FilterBar({ search, setSearch, sort, setSort, onAddHotel,showAddButton, }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
      {/* Search Input */}
      <input
        type="text"
        placeholder="Search hotels..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border border-gray-300 rounded-lg px-4 py-2 w-full md:w-1/3"
      />

      {/* Sort Dropdown */}
      <select
        value={sort}
        onChange={(e) => setSort(e.target.value)}
        className="border border-gray-300 rounded-lg px-4 py-2"
      >
        <option value="price">Sort by Price</option>
        <option value="rating">Sort by Rating</option>
        <option value="name">Sort by Name</option>
      </select>

      {/* Add Hotel Button */}
      {/* ✅ Button shown only if userRole === 'admin' */}
      {showAddButton && (
        <button
          onClick={onAddHotel}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow"
        >
          Add Hotel
        </button>
      )}
    </div>
  );
}
