import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

export default function HotelCard({ hotel, onDelete, canDelete }) {
  const [showDetails, setShowDetails] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleBookNow = () => {
    // Navigate to booking page with hotel data
    navigate(`/hotels/${hotel._id}/rooms`, {
      state: { 
        hotel: hotel,
        hotelId: hotel._id 
      } 
    });
  };

  return (
    <>
      <div className="bg-white shadow-lg rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
        <div className="relative overflow-hidden group">
          <img
            src={hotel.image || "https://via.placeholder.com/300x200"}
            alt={hotel.name}
            className="w-full h-52 object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg">
            <span className="text-yellow-500 text-sm font-semibold flex items-center gap-1">
              ⭐ {hotel.rating || "N/A"}
            </span>
          </div>
        </div>

        <div className="p-5">
          <h2 className="text-2xl font-bold text-gray-900 mb-1 line-clamp-1">
            {hotel.name}
          </h2>
          <p className="text-gray-500 text-sm flex items-center gap-1 mb-3">
            <span className="text-base">📍</span>
            {hotel.location}
          </p>

          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-3xl font-bold text-blue-600">
              ₹{hotel.price}
            </span>
            <span className="text-sm text-gray-500">/ night</span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleBookNow}
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg"
            >
              View Details
            </button>

            {canDelete && (
              <button
                onClick={() => onDelete(hotel._id)}
                className="px-4 py-2.5 bg-red-50 hover:bg-red-500 text-red-500 hover:text-white rounded-xl font-medium transition-all duration-200 border border-red-200 hover:border-red-500"
                title="Delete hotel"
              >
                🗑️
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}