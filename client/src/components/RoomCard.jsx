import React from "react";
import {
  Bed,
  Users,
  DollarSign,
  MapPin,
  Star,
  Wifi,
  Car,
  Coffee,
  Tv,
  Bath,
  Home,
  Calendar,
  Edit2,
  Trash2,
  Eye,
} from "lucide-react";

const RoomCard = ({
  room,
  onBook,
  onEdit,
  onDelete,
  onView,
  showActions = true,
}) => {
  const getStatusColor = () => {
    if (room.isBooked) return "text-red-600 bg-red-100";
    if (!room.isAvailable) return "text-orange-600 bg-orange-100";
    return "text-green-600 bg-green-100";
  };

  const getStatusText = () => {
    if (room.isBooked) return "Booked";
    if (!room.isAvailable) return "Maintenance";
    return "Available";
  };

  const getAmenityIcon = (amenity) => {
    const iconMap = {
      wifi: <Wifi size={14} />,
      tv: <Tv size={14} />,
      parking: <Car size={14} />,
      breakfast: <Coffee size={14} />,
      pool: <Bath size={14} />,
    };
    return iconMap[amenity] || <Star size={14} />;
  };

  const handleBookClick = (e) => {
    e.stopPropagation();
    onBook && onBook(room);
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    onEdit && onEdit(room);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    onDelete && onDelete(room);
  };

  const handleViewClick = (e) => {
    e.stopPropagation();
    onView && onView(room);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
      {/* Image Section */}
      {room.images && room.images.length > 0 ? (
        <div className="h-48 bg-gray-200 relative overflow-hidden">
          <img
            src={room.images[0].url}
            alt={room.images[0].alt || room.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src =
                "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=400&h=300&fit=crop";
            }}
          />
          <div className="absolute top-3 right-3">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}
            >
              {getStatusText()}
            </span>
          </div>
        </div>
      ) : (
        <div className="h-48 bg-gray-100 flex items-center justify-center relative">
          <Bed size={48} className="text-gray-400" />
          <div className="absolute top-3 right-3">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}
            >
              {getStatusText()}
            </span>
          </div>
        </div>
      )}

      <div className="p-4">
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
              {room.name}
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
              {room.roomNumber && (
                <>
                  <span>Room {room.roomNumber}</span>
                  <span>•</span>
                </>
              )}
              <span>Floor {room.floor || "N/A"}</span>
            </div>
          </div>
          {room.rating && room.rating.average > 0 && (
            <div className="flex items-center gap-1">
              <Star size={14} className="text-yellow-400 fill-current" />
              <span className="text-sm text-gray-600">
                {room.rating.average.toFixed(1)}
              </span>
            </div>
          )}
        </div>

        {/* Room Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Bed size={16} className="text-gray-400" />
              <span className="text-gray-600">
                {room.type.charAt(0).toUpperCase() + room.type.slice(1)}
                {room.bedType && ` • ${room.bedType}`}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Users size={16} className="text-gray-400" />
              <span className="text-gray-600">{room.capacity} guests</span>
            </div>
          </div>

          {room.size && (
            <div className="flex items-center gap-2 text-sm">
              <Home size={16} className="text-gray-400" />
              <span className="text-gray-600">{room.size} sq ft</span>
            </div>
          )}

          {room.view && room.view !== "none" && (
            <div className="flex items-center gap-2 text-sm">
              <MapPin size={16} className="text-gray-400" />
              <span className="text-gray-600">
                {room.view.charAt(0).toUpperCase() + room.view.slice(1)} view
              </span>
            </div>
          )}
        </div>

        {/* Price */}
        <div className="mb-4">
          <div className="flex items-center gap-2">
            <DollarSign size={18} className="text-gray-400" />
            <span className="text-xl font-bold text-gray-900">
              ₹{room.price.toLocaleString()}
            </span>
            <span className="text-sm text-gray-500">/night</span>
          </div>
        </div>

        {/* Amenities */}
        {room.amenities && room.amenities.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {room.amenities.slice(0, 4).map((amenity, index) => (
                <div
                  key={index}
                  className="flex items-center gap-1 bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs"
                >
                  {getAmenityIcon(amenity)}
                  <span>
                    {amenity.charAt(0).toUpperCase() + amenity.slice(1)}
                  </span>
                </div>
              ))}
              {room.amenities.length > 4 && (
                <span className="text-xs text-gray-500 px-2 py-1">
                  +{room.amenities.length - 4} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Description */}
        {room.description && (
          <div className="mb-4">
            <p className="text-sm text-gray-600 line-clamp-2">
              {room.description}
            </p>
          </div>
        )}

        {/* Actions */}
        {showActions && (
          <div className="flex gap-2 pt-3 border-t border-gray-100">
            <button
              onClick={handleViewClick}
              className="flex items-center gap-1 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg text-sm transition-colors"
            >
              <Eye size={16} />
              View
            </button>

            <button
              onClick={handleEditClick}
              className="flex items-center gap-1 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg text-sm transition-colors"
            >
              <Edit2 size={16} />
              Edit
            </button>

            <button
              onClick={handleDeleteClick}
              className="flex items-center gap-1 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm transition-colors"
            >
              <Trash2 size={16} />
              Delete
            </button>

            {!room.isBooked && room.isAvailable && (
              <button
                onClick={handleBookClick}
                className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded-lg text-sm ml-auto transition-colors"
              >
                <Calendar size={16} />
                Book Now
              </button>
            )}
           
          </div>
        )}

        {/* Additional Info */}
        {room.currentBooking && room.isBooked && (
          <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-xs text-red-800">
              <strong>Current Guest:</strong> {room.currentBooking.guestName}
            </p>
            {room.currentBooking.checkOut && (
              <p className="text-xs text-red-800">
                <strong>Check-out:</strong>{" "}
                {new Date(room.currentBooking.checkOut).toLocaleDateString()}
              </p>
            )}
          </div>
        )}

        {room.maintenanceNotes && !room.isAvailable && (
          <div className="mt-3 p-2 bg-orange-50 border border-orange-200 rounded-lg">
            <p className="text-xs text-orange-800">
              <strong>Maintenance:</strong> {room.maintenanceNotes}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomCard;
