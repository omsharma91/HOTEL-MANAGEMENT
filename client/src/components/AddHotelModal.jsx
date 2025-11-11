import React, { useState } from "react";
import {X, MapPin, DollarSign, Star, Users, Image, FileText, Sparkles,} from "lucide-react";

export default function AddHotelModal({ isOpen, onClose, onAddHotel }) {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    price: "",
    totalRooms: "",
    rating: "",
    description: "",
    amenities: "",
    image: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Hotel name is required";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    if (!formData.price || parseFloat(formData.price) <= 0)
      newErrors.price = "Valid price is required";
    if (!formData.totalRooms || parseInt(formData.totalRooms) <= 0)
      newErrors.totalRooms = "Valid number of rooms required";
    if (
      !formData.rating ||
      parseFloat(formData.rating) < 0 ||
      parseFloat(formData.rating) > 5
    ) {
      newErrors.rating = "Rating must be between 0 and 5";
    }
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.amenities.trim())
      newErrors.amenities = "At least one amenity is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 500));

    const newHotel = {
      ...formData,
      id: Date.now(),
      price: parseFloat(formData.price),
      totalRooms: parseInt(formData.totalRooms, 10),
      rating: parseFloat(formData.rating),
      amenities: formData.amenities
        .split(",")
        .map((a) => a.trim())
        .filter((a) => a.length > 0),
    };

    onAddHotel(newHotel);

    setFormData({
      name: "",
      location: "",
      price: "",
      totalRooms: "",
      rating: "",
      description: "",
      amenities: "",
      image: "",
    });
    setErrors({});
    setIsSubmitting(false);
    onClose();
  };

  const inputFields = [
    {
      name: "name",
      type: "text",
      placeholder: "Enter hotel name",
      icon: Sparkles,
      label: "Hotel Name",
    },
    {
      name: "location",
      type: "text",
      placeholder: "Enter location",
      icon: MapPin,
      label: "Location",
    },
    {
      name: "image",
      type: "url",
      placeholder: "Enter image URL",
      icon: Image,
      label: "Image URL",
    },
  ];

  const numberFields = [
    {
      name: "price",
      type: "number",
      step: "0.01",
      placeholder: "0.00",
      icon: DollarSign,
      label: "Price per night",
      prefix: "$",
    },
    {
      name: "totalRooms",
      type: "number",
      step: "1",
      placeholder: "0",
      icon: Users,
      label: "Total Rooms",
    },
    {
      name: "rating",
      type: "number",
      step: "0.1",
      placeholder: "0.0",
      icon: Star,
      label: "Rating (0-5)",
      max: "5",
      min: "0",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-gradient-to-br from-black/40 via-black/30 to-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="flex min-h-full items-center justify-center p-4">
        {/* Modal */}
        <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-2xl border border-white/20 my-8">
          {/* Header */}
          <div className="bg-white/95 backdrop-blur-xl border-b border-gray-200/50 p-6 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Add New Hotel
                </h2>
                <p className="text-gray-600 mt-1">Create a new hotel listing</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-gray-100/80 transition-colors group"
                type="button"
              >
                <X className="w-6 h-6 text-gray-500 group-hover:text-gray-700" />
              </button>
            </div>
          </div>

          {/* Form */}
          <div className="p-6 space-y-6">
            {/* Text Fields */}
            <div className="space-y-4">
              {inputFields.map((field) => {
                const Icon = field.icon;
                return (
                  <div key={field.name} className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      {field.label}
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <Icon className="w-5 h-5" />
                      </div>
                      <input
                        type={field.type}
                        name={field.name}
                        placeholder={field.placeholder}
                        value={formData[field.name]}
                        onChange={handleChange}
                        className={`w-full pl-11 pr-4 py-3 border rounded-xl bg-white/70 backdrop-blur-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 ${
                          errors[field.name]
                            ? "border-red-300 focus:border-red-500 focus:ring-red-500/50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        required
                      />
                    </div>
                    {errors[field.name] && (
                      <p className="text-red-500 text-sm flex items-center gap-1">
                        <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                        {errors[field.name]}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Number Fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {numberFields.map((field) => {
                
                return (
                  <div key={field.name} className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      {field.label}
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        
                      </div>
                      <input
                        type="number"                        
                        name={field.name}
                        placeholder={field.placeholder}
                        value={formData[field.name]}
                        onChange={handleChange}
                        min={field.min}
                        max={field.max}
                        className={`w-full pl-11 pr-4 py-3 border rounded-xl bg-white/70 backdrop-blur-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 ${
                          errors[field.name]
                            ? "border-red-300 focus:border-red-500 focus:ring-red-500/50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        required
                      />
                      
                    </div>
                    {errors[field.name] && (
                      <p className="text-red-500 text-sm flex items-center gap-1">
                        <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                        {errors[field.name]}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Description
              </label>
              <div className="relative">
                <div className="absolute left-3 top-3 text-gray-400">
                  <FileText className="w-5 h-5" />
                </div>
                <textarea
                  name="description"
                  placeholder="Describe the hotel and its features..."
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className={`w-full pl-11 pr-4 py-3 border rounded-xl bg-white/70 backdrop-blur-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 resize-none ${
                    errors.description
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500/50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  required
                />
              </div>
              {errors.description && (
                <p className="text-red-500 text-sm flex items-center gap-1">
                  <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                  {errors.description}
                </p>
              )}
            </div>

            {/* Amenities */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Amenities
              </label>
              <div className="relative">
                <div className="absolute left-3 top-3 text-gray-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <textarea
                  name="amenities"
                  placeholder="Enter amenities separated by commas (e.g., WiFi, Pool, Gym, Spa)"
                  value={formData.amenities}
                  onChange={handleChange}
                  rows={3}
                  className={`w-full pl-11 pr-4 py-3 border rounded-xl bg-white/70 backdrop-blur-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 resize-none ${
                    errors.amenities
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500/50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  required
                />
              </div>
              {errors.amenities && (
                <p className="text-red-500 text-sm flex items-center gap-1">
                  <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                  {errors.amenities}
                </p>
              )}
              <p className="text-xs text-gray-500 ml-11">
                Separate multiple amenities with commas
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-6 border-t border-gray-200/50">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-6 py-3 rounded-xl bg-gray-100/80 hover:bg-gray-200/80 text-gray-700 font-medium transition-all backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                onClick={handleSubmit}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium transition-all backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    Adding...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Add Hotel
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
