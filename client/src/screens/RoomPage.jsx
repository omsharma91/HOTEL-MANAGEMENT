import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchRooms,
  bookRoom,
  createRoom,
  updateRoom,
  deleteRoom,
} from "../actions/roomAction";
import RoomCard from "../components/RoomCard";
import { useNavigate, useParams } from "react-router-dom";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Filter,
  Download,
  Upload,
  Bed,
  Users,
  Wifi,
  Car,
  Coffee,
  Tv,
  Bath,
  Star,
  MapPin,
  CheckCircle,
  XCircle,
  Calendar,
  DollarSign,
  Home,
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // optional if you want tables

export default function RoomPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { hotelId } = useParams();
  const { data: rooms, loading, error } = useSelector((state) => state.rooms);
  const { data: currentHotel } = useSelector(
    (state) => state.hotels.currentHotel || {}
  );
  const user = useSelector((state) => state.userLogin);
  const storedUser = JSON.parse(localStorage.getItem("userInfo"));
  const userRole = user.userInfo.user?.role || storedUser?.role;

  // State management
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [viewMode, setViewMode] = useState("grid"); // grid or list

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);

  // Form state
  const [newRoom, setNewRoom] = useState({
    name: "",
    type: "single",
    price: "",
    description: "",
    capacity: 1,
    size: "",
    amenities: [],
    images: [],
    isBooked: false,
    isAvailable: true,
    floor: 1,
    roomNumber: "",
  });

  const roomTypes = ["single", "double", "deluxe", "suite", "presidential"];
  const amenitiesList = [
    "wifi",
    "tv",
    "ac",
    "minibar",
    "balcony",
    "parking",
    "breakfast",
    "gym",
    "pool",
    "spa",
  ];

  useEffect(() => {
    if (hotelId) {
      dispatch(fetchRooms(hotelId));
    } else {
      dispatch(fetchRooms());
    }
  }, [dispatch, hotelId]);

  useEffect(() => {
    let filtered = [...rooms];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (room) =>
          room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          room.roomNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          room.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter((room) => room.type === typeFilter);
    }

    // Price filter
    if (priceFilter !== "all") {
      filtered = filtered.filter((room) => room.price <= parseInt(priceFilter));
    }

    // Status filter
    if (statusFilter !== "all") {
      if (statusFilter === "available") {
        filtered = filtered.filter(
          (room) => !room.isBooked && room.isAvailable
        );
      } else if (statusFilter === "booked") {
        filtered = filtered.filter((room) => room.isBooked);
      } else if (statusFilter === "maintenance") {
        filtered = filtered.filter((room) => !room.isAvailable);
      }
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "price":
          return a.price - b.price;
        case "type":
          return a.type.localeCompare(b.type);
        case "roomNumber":
          return (a.roomNumber || "").localeCompare(b.roomNumber || "");
        default:
          return 0;
      }
    });

    setFilteredRooms(filtered);
  }, [rooms, searchTerm, typeFilter, priceFilter, statusFilter, sortBy]);

  const handleBookRoom = (room) => {
    navigate(`/booking/${room._id}`);
  };

  const handleCancelBooking = (roomId) => {
  if (window.confirm("Are you sure you want to cancel this booking?")) {
    const cancelData = {
      isBooked: false,
      isAvailable: true,
    };

    dispatch(updateRoom({ id: roomId, data: cancelData }))
      .unwrap()
      .then(() => {
        alert("Booking canceled successfully!");
      })
      .catch((err) => {
        console.error("Error canceling booking:", err);
        alert("Failed to cancel booking. Please try again.");
      });
  }
};


  const handleDownloadInvoice = (room) => {
  const doc = new jsPDF();

  // Title
  doc.setFontSize(20);
  doc.text("Hotel Booking Invoice", 105, 20, { align: "center" });

  doc.setFontSize(12);
  const today = new Date().toLocaleDateString();

  // Guest Info
  doc.text(`Guest Name: ${room?.currentBooking?.guestName || "Guest User"}`, 14, 35);
  doc.text(`Email: ${room?.guestEmail || "Not Provided"}`, 14, 42);
  doc.text(`Invoice Date: ${today}`, 14, 49);

  // Room Booking Details Table
  autoTable(doc, {
    startY: 60,
    head: [["Field", "Details"]],
    body: [
      ["Hotel Name", room?.hotel?.name || "N/A"],
      ["Room Name / Number", room?.name || room?.roomNumber || "N/A"],
      ["Room Type", room?.type || "N/A"],
      ["Guest Capacity", room?.capacity || "N/A"],
      ["Price Per Night", `Rs ${room?.price || 0}`],
      ["Check-in Date", room?.currentBooking?.checkIn
        ? new Date(room.currentBooking.checkIn).toLocaleDateString()
        : "N/A"],
      ["Check-out Date", room?.currentBooking?.checkOut
        ? new Date(room.currentBooking.checkOut).toLocaleDateString()
        : "N/A"],
      ["Status", room?.isBooked ? "Booked" : "Available"],
    ],
    theme: "grid",
    headStyles: { fillColor: [41, 128, 185], textColor: 255 },
    bodyStyles: { textColor: 50 },
  });

  // Footer Note
  const finalY = doc.lastAutoTable.finalY + 10;
  doc.setFontSize(10);
  doc.text("Thank you for booking with us! Have a pleasant stay.", 14, finalY);

  // Save the file
  const fileName = `Invoice_${room?.name || "Room"}_${today}.pdf`;
  doc.save(fileName);
};


  const handleEditRoom = (room) => {
    setSelectedRoom(room);
    setNewRoom({
      name: room.name,
      type: room.type,
      price: room.price.toString(),
      description: room.description || "",
      capacity: room.capacity || 1,
      size: room.size || "",
      amenities: room.amenities || [],
      images: room.images || [],
      isBooked: room.isBooked,
      isAvailable: room.isAvailable,
      floor: room.floor || 1,
      roomNumber: room.roomNumber || "",
    });
    setShowEditModal(true);
  };

  const handleDeleteRoom = async (roomId) => {
    if (window.confirm("Are you sure you want to delete this room?")) {
      dispatch(deleteRoom(roomId));
    }
  };

  const handleViewDetails = (room) => {
    setSelectedRoom(room);
    setShowDetailsModal(true);
  };

  const handleCreateRoom = (e) => {
    e.preventDefault();
    const payload = {
      ...newRoom,
      price: Number(newRoom.price),
      capacity: Number(newRoom.capacity),
      floor: Number(newRoom.floor),
      hotel: hotelId,
    };
    dispatch(createRoom(payload));
    setShowAddModal(false);
    resetForm();
  };

  const handleUpdateRoom = (e) => {
    e.preventDefault();
    const payload = {
      ...newRoom,
      price: Number(newRoom.price),
      capacity: Number(newRoom.capacity),
      floor: Number(newRoom.floor),
    };
    dispatch(updateRoom({ id: selectedRoom._id, data: payload }));
    setShowEditModal(false);
    resetForm();
  };

  const resetForm = () => {
    setNewRoom({
      name: "",
      type: "single",
      price: "",
      description: "",
      capacity: 1,
      size: "",
      amenities: [],
      images: [],
      isBooked: false,
      isAvailable: true,
      floor: 1,
      roomNumber: "",
    });
    setSelectedRoom(null);
  };

  const handleAmenityChange = (amenity) => {
    const updatedAmenities = newRoom.amenities.includes(amenity)
      ? newRoom.amenities.filter((a) => a !== amenity)
      : [...newRoom.amenities, amenity];
    setNewRoom({ ...newRoom, amenities: updatedAmenities });
  };

  const getStatusText = (room) => {
  if (room.isBooked && room.currentBooking?.checkOut) {
    const today = new Date();
    const checkoutDate = new Date(room.currentBooking.checkOut);

    // Automatically switch to available after checkout
    if (today >= checkoutDate) {
      return "Available";
    } else {
      return "Booked";
    }
  }

  if (!room.isAvailable) return "Maintenance";
  return "Available";
};

const getStatusColor = (room) => {
  if (room.isBooked && room.currentBooking?.checkOut) {
    const today = new Date();
    const checkoutDate = new Date(room.currentBooking.checkOut);

    if (today >= checkoutDate) {
      return "text-green-600 bg-green-100";
    } else {
      return "text-red-600 bg-red-100";
    }
  }

  if (!room.isAvailable) return "text-orange-600 bg-orange-100";
  return "text-green-600 bg-green-100";
};


useEffect(() => {
  rooms.forEach((room) => {
    if (room.isBooked && room.currentBooking?.checkOut) {
      const today = new Date();
      const checkoutDate = new Date(room.currentBooking.checkOut);

      // If checkout date has passed, update the backend
      if (today >= checkoutDate) {
        dispatch(
          updateRoom({
            id: room._id,
            data: {
              isBooked: false,
              isAvailable: true,
              status: "available",
            },
          })
        );
      }
    }
  });
}, [rooms, dispatch]);


  const getRoomStats = () => {
    const total = rooms.length;
    const available = rooms.filter((r) => !r.isBooked && r.isAvailable).length;
    const booked = rooms.filter((r) => r.isBooked).length;
    const maintenance = rooms.filter((r) => !r.isAvailable).length;
    const avgPrice =
      rooms.length > 0
        ? Math.round(rooms.reduce((sum, r) => sum + r.price, 0) / rooms.length)
        : 0;

    return { total, available, booked, maintenance, avgPrice };
  };
  console.log(rooms);

  const stats = getRoomStats();

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Room Management
            </h1>
            <p className="text-gray-600 mt-1">
              {currentHotel?.name || "Hotel"} • {filteredRooms.length} of{" "}
              {rooms.length} rooms
            </p>
          </div>
          <div className="flex gap-3 mt-4 md:mt-0">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Home size={18} />
              Back to Hotels
            </button>
            {userRole === "admin" && !showAddModal && !showEditModal && (
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                <Plus size={18} />
                Add Room
              </button>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {stats.total}
            </div>
            <div className="text-sm text-blue-600">Total Rooms</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {stats.available}
            </div>
            <div className="text-sm text-green-600">Available</div>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-red-600">
              {stats.booked}
            </div>
            <div className="text-sm text-red-600">Booked</div>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">
              {stats.maintenance}
            </div>
            <div className="text-sm text-orange-600">Maintenance</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              ₹{stats.avgPrice}
            </div>
            <div className="text-sm text-purple-600">Avg. Price</div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search rooms by name, number, or type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Types</option>
            {roomTypes.map((type) => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="available">Available</option>
            <option value="booked">Booked</option>
            <option value="maintenance">Maintenance</option>
          </select>

          <select
            value={priceFilter}
            onChange={(e) => setPriceFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Prices</option>
            <option value="2000">Under ₹2000</option>
            <option value="5000">Under ₹5000</option>
            <option value="10000">Under ₹10000</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="name">Sort by Name</option>
            <option value="price">Sort by Price</option>
            <option value="type">Sort by Type</option>
            <option value="roomNumber">Sort by Room Number</option>
          </select>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800">Error: {error}</p>
        </div>
      )}

      {/* Room Cards Grid */}
      <div
        className={`grid gap-6 ${
          viewMode === "grid"
            ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            : "grid-cols-1"
        }`}
      >
        {filteredRooms.map((room) => (
          <div
            key={room._id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {room.name}
                  </h3>
                  <p className="text-gray-600">
                    Room {room.roomNumber || "N/A"} • Floor{" "}
                    {room.floor || "N/A"}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    room
                  )}`}
                >
                  {getStatusText(room)}
                </span>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2">
                  <Bed size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {room.type.charAt(0).toUpperCase() + room.type.slice(1)} •{" "}
                    {room.capacity} guests
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign size={16} className="text-gray-400" />
                  <span className="text-lg font-semibold text-gray-900">
                    ₹{room.price}/night
                  </span>
                </div>
                {room.size && (
                  <div className="flex items-center gap-2">
                    <Home size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {room.size} sq ft
                    </span>
                  </div>
                )}
              </div>

              {room.amenities && room.amenities.length > 0 && (
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {room.amenities.slice(0, 3).map((amenity) => (
                      <span
                        key={amenity}
                        className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                      >
                        {amenity}
                      </span>
                    ))}
                    {room.amenities.length > 3 && (
                      <span className="text-xs text-gray-500">
                        +{room.amenities.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-4 border-t">
                <button
                  onClick={() => handleViewDetails(room)}
                  className="flex items-center gap-1 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg text-sm"
                >
                  <Eye size={16} />
                  View
                </button>

                {userRole === "admin" && !showAddModal && !showEditModal && (
                  <>
                    <button
                      onClick={() => handleEditRoom(room)}
                      className="flex items-center gap-1 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg text-sm"
                    >
                      <Edit2 size={16} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteRoom(room._id)}
                      className="flex items-center gap-1 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </>
                )}
                
                {room.isBooked && room.isAvailable && (
                  <button
                  onClick={() => handleDownloadInvoice(room)}
                  className="px-3 py-1 text-purple-700 text-sm"
                >
                  Download
                </button>
                

                )}
                

                {!room.isBooked && room.isAvailable && (
                  <button
                    onClick={() => handleBookRoom(room)}
                    className="flex items-center gap-1 px-3 py-2 bg-green-600 text-white hover:bg-green-700 rounded-lg text-sm ml-auto"
                  >
                    <Calendar size={16} />
                    Book room
                  </button>
                )}
                {room.isBooked && (
                <button
                  onClick={() => handleCancelBooking(room._id)}
                  className="ml-auto text-red-700"
                >
                  Cancel
                </button>                
                )}
                
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredRooms.length === 0 && !loading && (
        <div className="text-center py-12">
          <Bed size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No rooms found
          </h3>
          <p className="text-gray-600">
            Try adjusting your filters or add a new room.
          </p>
        </div>
      )}

      {/* Add/Edit Room Modal */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-gradient-to-br from-black/40 via-black/30 to-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6">
                {showEditModal ? "Edit Room" : "Add New Room"}
              </h2>

              <form
                onSubmit={showEditModal ? handleUpdateRoom : handleCreateRoom}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Room Name
                    </label>
                    <input
                      type="text"
                      value={newRoom.name}
                      onChange={(e) =>
                        setNewRoom({ ...newRoom, name: e.target.value })
                      }
                      required
                      className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Deluxe Suite 101"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Room Number
                    </label>
                    <input
                      type="text"
                      value={newRoom.roomNumber}
                      onChange={(e) =>
                        setNewRoom({ ...newRoom, roomNumber: e.target.value })
                      }
                      className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="101"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Room Type
                    </label>
                    <select
                      value={newRoom.type}
                      onChange={(e) =>
                        setNewRoom({ ...newRoom, type: e.target.value })
                      }
                      className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      {roomTypes.map((type) => (
                        <option key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price (₹/night)
                    </label>
                    <input
                      type="number"
                      value={newRoom.price}
                      onChange={(e) =>
                        setNewRoom({ ...newRoom, price: e.target.value })
                      }
                      required
                      className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="2500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Capacity
                    </label>
                    <input
                      type="number"
                      value={newRoom.capacity}
                      onChange={(e) =>
                        setNewRoom({
                          ...newRoom,
                          capacity: parseInt(e.target.value),
                        })
                      }
                      min="1"
                      max="10"
                      className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Floor
                    </label>
                    <input
                      type="number"
                      value={newRoom.floor}
                      onChange={(e) =>
                        setNewRoom({
                          ...newRoom,
                          floor: parseInt(e.target.value),
                        })
                      }
                      min="1"
                      className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Size (sq ft)
                    </label>
                    <input
                      type="text"
                      value={newRoom.size}
                      onChange={(e) =>
                        setNewRoom({ ...newRoom, size: e.target.value })
                      }
                      className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="450"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={newRoom.description}
                    onChange={(e) =>
                      setNewRoom({ ...newRoom, description: e.target.value })
                    }
                    rows="3"
                    className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Spacious room with city view..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amenities
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {amenitiesList.map((amenity) => (
                      <label
                        key={amenity}
                        className="flex items-center space-x-2"
                      >
                        <input
                          type="checkbox"
                          checked={newRoom.amenities.includes(amenity)}
                          onChange={() => handleAmenityChange(amenity)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">
                          {amenity.charAt(0).toUpperCase() + amenity.slice(1)}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={newRoom.isAvailable}
                      onChange={(e) =>
                        setNewRoom({
                          ...newRoom,
                          isAvailable: e.target.checked,
                        })
                      }
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">
                      Available for booking
                    </span>
                  </label>

                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={newRoom.isBooked}
                      onChange={(e) =>
                        setNewRoom({ ...newRoom, isBooked: e.target.checked })
                      }
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">
                      Currently booked
                    </span>
                  </label>
                </div>

                <div className="flex justify-end gap-4 pt-6 border-t">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      setShowEditModal(false);
                      resetForm();
                    }}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    {showEditModal ? "Update Room" : "Create Room"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Room Details Modal */}
      {showDetailsModal && selectedRoom && (
        <div className="fixed inset-0 bg-gradient-to-br from-black/40 via-black/30 to-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold">{selectedRoom.name}</h2>
                  <p className="text-gray-600">
                    Room {selectedRoom.roomNumber} • Floor {selectedRoom.floor}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    selectedRoom
                  )}`}
                >
                  {getStatusText(selectedRoom)}
                </span>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Bed className="mx-auto mb-2 text-gray-600" size={24} />
                    <div className="text-sm text-gray-600">Type</div>
                    <div className="font-semibold">{selectedRoom.type}</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Users className="mx-auto mb-2 text-gray-600" size={24} />
                    <div className="text-sm text-gray-600">Capacity</div>
                    <div className="font-semibold">
                      {selectedRoom.capacity} guests
                    </div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <DollarSign
                      className="mx-auto mb-2 text-gray-600"
                      size={24}
                    />
                    <div className="text-sm text-gray-600">Price</div>
                    <div className="font-semibold">₹{selectedRoom.price}</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Home className="mx-auto mb-2 text-gray-600" size={24} />
                    <div className="text-sm text-gray-600">Size</div>
                    <div className="font-semibold">
                      {selectedRoom.size || "N/A"}
                    </div>
                  </div>
                </div>

                {selectedRoom.description && (
                  <div>
                    <h3 className="font-semibold mb-2">Description</h3>
                    <p className="text-gray-600">{selectedRoom.description}</p>
                  </div>
                )}

                {selectedRoom.amenities &&
                  selectedRoom.amenities.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-3">Amenities</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {selectedRoom.amenities.map((amenity) => (
                          <div
                            key={amenity}
                            className="flex items-center gap-2 text-sm text-gray-700"
                          >
                            <CheckCircle size={16} className="text-green-500" />
                            {amenity.charAt(0).toUpperCase() + amenity.slice(1)}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              </div>

              <div className="flex justify-end gap-4 pt-6 border-t">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
