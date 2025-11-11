// src/pages/BookingPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchRooms } from "../actions/roomAction";

export default function BookingPage() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { data: rooms, loading, error } = useSelector((state) => state.rooms);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);

  const room = rooms.find((r) => r._id === roomId);

  useEffect(() => {
    if (!rooms.length) {
      dispatch(fetchRooms());
    }
  }, [dispatch, rooms.length]);

  useEffect(() => {
    if (room && checkIn && checkOut) {
      const start = new Date(checkIn);
      const end = new Date(checkOut);
      const days = Math.max(
        1,
        Math.ceil((end - start) / (1000 * 60 * 60 * 24))
      );
      setTotalPrice(days * room.price);
    }
  }, [checkIn, checkOut, room]);

  const handleProceedToPayment = (e) => {
    e.preventDefault();
    if (!checkIn || !checkOut) {
      alert("Please select check-in and check-out dates");
      return;
    }

    // navigate to payment page with details
    navigate(`/payment/${room._id}`, {
      state: {
        checkIn,
        checkOut,
        totalPrice,
        room,
      },
    });
  };

  if (loading) return <p className="p-8">Loading room...</p>;
  if (error) return <p className="p-8 text-red-500">Error: {error}</p>;
  if (!room) return <p className="p-8">Room not found.</p>;

  return (
    <div className="p-8 min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-4">Book {room.name}</h1>
        <p className="mb-2">Type: {room.type}</p>
        <p className="mb-4">Price per night: ₹{room.price}</p>

        <form onSubmit={handleProceedToPayment} className="space-y-4">
          <div>
            <label className="block mb-1 font-semibold">Check-in Date</label>
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="border px-3 py-2 rounded w-full"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Check-out Date</label>
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="border px-3 py-2 rounded w-full"
              required
            />
          </div>

          {totalPrice > 0 && (
            <p className="text-lg font-bold">Total: ₹{totalPrice}</p>
          )}

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Pay Now
          </button>
        </form>
      </div>
    </div>
  );
}
