import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import HotelCard from "../components/HotelCard";
import FilterBar from "../components/FilterBar";
import AddHotelModal from "../components/AddHotelModal";
import { createHotel, fetchHotels, deleteHotel } from "../actions/hotelAction";
import { logoutUser } from "../actions/authAction";
import StaffPage from "./StaffPage";
import InventoryScreen from "./InventoryScreen";
import ReportScreen from "./ReportScreen";

export default function HotelPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const hotels = useSelector((state) => state.hotels.data) || [];
  const loading = useSelector((state) => state.hotels.loading);
  const error = useSelector((state) => state.hotels.error);
  const { rooms, loadingRooms, errorRooms } = useSelector((state) => state.rooms);
  console.log(rooms);

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.userLogin);
  const storedUser = JSON.parse(localStorage.getItem("userInfo"));
  const userRole = user.userInfo?.user?.role || storedUser?.role;

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("price");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("hotels");

  // Add Hotel
  const handleAddHotel = (newHotel) => {
    dispatch(createHotel(newHotel));
    setIsModalOpen(false);
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    localStorage.removeItem("token");
    dispatch(logoutUser());
    navigate("/login", { replace: true });
  };

  // Delete Hotel
  const handleDeleteHotel = (id) => {
    if (window.confirm("Are you sure you want to delete this hotel?")) {
      dispatch(deleteHotel(id));
    }
  };

  // Fetch hotels
  useEffect(() => {
    if (
      isAuthenticated ||
      token ||
      localStorage.getItem("userInfo") ||
      localStorage.getItem("token")
    ) {
      dispatch(fetchHotels());
    }
  }, [dispatch, isAuthenticated, token]);

  // Filter & Sort hotels
  const filteredHotels = hotels
    .filter(
      (hotel) =>
        hotel.name.toLowerCase().includes(search.toLowerCase()) ||
        hotel.location.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sort === "price") return a.price - b.price;
      if (sort === "rating") return b.rating - a.rating;
      if (sort === "name") return a.name.localeCompare(b.name);
      return 0;
    });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Hotel Management</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow"
        >
          Logout
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-6 mb-6 pb-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("hotels")}
          className={`capitalize font-medium pb-2 transition-colors ${
            activeTab === "hotels"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600 hover:text-blue-500"
          }`}
        >
          Hotels
        </button>

        <button
          onClick={() => setActiveTab("history")}
          className={`capitalize font-medium pb-2 transition-colors ${
            activeTab === "history"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600 hover:text-blue-500"
          }`}
        >
          Booking History
        </button>

        {userRole === "admin" && (
          <>
            <button
              onClick={() => setActiveTab("reports")}
              className={`capitalize font-medium pb-2 transition-colors ${
                activeTab === "reports"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-blue-500"
              }`}
            >
              Reports
            </button>
            <button
              onClick={() => setActiveTab("staff")}
              className={`capitalize font-medium pb-2 transition-colors ${
                activeTab === "staff"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-blue-500"
              }`}
            >
              Staff
            </button>
            <button
              onClick={() => setActiveTab("inventory")}
              className={`capitalize font-medium pb-2 transition-colors ${
                activeTab === "inventory"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-blue-500"
              }`}
            >
              Inventory
            </button>
          </>
        )}
      </div>

      {/* Tab Content */}
      {activeTab === "hotels" && (
        <>
          <FilterBar
            search={search}
            setSearch={setSearch}
            sort={sort}
            setSort={setSort}
            onAddHotel={() => setIsModalOpen(true)}
            showAddButton={userRole === "admin"}
          />

          {loading && <p className="text-center text-gray-500">Loading...</p>}
          {error && <p className="text-center text-red-500">{error}</p>}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
            {filteredHotels.length > 0 ? (
              filteredHotels.map((hotel) => (
                <HotelCard
                  key={hotel._id}
                  hotel={hotel}
                  rooms={hotel.rooms}
                  onDelete={handleDeleteHotel}
                  canDelete={userRole === "admin"}
                />
              ))
            ) : (
              <p className="col-span-full text-center text-gray-500">
                No hotels found.
              </p>
            )}
          </div>

          <AddHotelModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onAddHotel={handleAddHotel}
          />
        </>
      )}

      {activeTab === "history" && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Booking History</h2>
          {loadingRooms ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            </div>
          ) : errorRooms ? (
            <p className="text-red-600">Error: {errorRooms}</p>
          ) : !rooms ||
            rooms.filter((b) => b.status === "booked").length === 0 ? (
            <p className="text-gray-600">No booked rooms found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto border border-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 border-b text-left">Guest Name</th>
                    <th className="px-4 py-2 border-b text-left">Email</th>
                    <th className="px-4 py-2 border-b text-left">Hotel</th>
                    <th className="px-4 py-2 border-b text-left">Room</th>
                    <th className="px-4 py-2 border-b text-left">Room Type</th>
                    <th className="px-4 py-2 border-b text-left">Price</th>
                    <th className="px-4 py-2 border-b text-left">
                      Booking Date
                    </th>
                    <th className="px-4 py-2 border-b text-left">Status</th>
                    <th className="px-4 py-2 border-b text-left">Invoice</th>
                  </tr>
                </thead>
                <tbody>
                  {rooms &&
                    rooms
                      .filter((b) => b.status === "booked") // only show booked rooms
                      .map((b) => (
                        <tr key={b._id} className="hover:bg-gray-50">
                          <td className="px-4 py-2">{b.guestName || "N/A"}</td>
                          <td className="px-4 py-2">{b.guestEmail || "N/A"}</td>
                          <td className="px-4 py-2">
                            {b.hotel?.name || "N/A"}
                          </td>
                          <td className="px-4 py-2">
                            {b.name} ({b.roomNumber || "N/A"})
                          </td>
                          <td className="px-4 py-2">{b.type || "N/A"}</td>
                          <td className="px-4 py-2">₹{b.price}</td>
                          <td className="px-4 py-2">
                            {new Date(b.bookingDate).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-2">{b.status}</td>
                          <td className="px-4 py-2">
                            <button
                              onClick={() => handleDownloadInvoice(b)}
                              className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm"
                            >
                              Download
                            </button>
                          </td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === "reports" && <ReportScreen />}
      {activeTab === "staff" && <StaffPage />}
      {activeTab === "inventory" && <InventoryScreen />}
    </div>
  );
}
