const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Room name is required"],
    trim: true,
    maxLength: [100, "Room name cannot exceed 100 characters"]
  },
  
  roomNumber: {
    type: String,
    trim: true,
    maxLength: [10, "Room number cannot exceed 10 characters"]
  },
  
  type: {
    type: String,
    required: [true, "Room type is required"],
    enum: {
      values: ["single", "double", "deluxe", "suite", "presidential"],
      message: "Room type must be single, double, deluxe, suite, or presidential"
    }
  },
  
  price: {
    type: Number,
    required: [true, "Room price is required"],
    min: [0, "Price cannot be negative"]
  },
  
  description: {
    type: String,
    trim: true,
    maxLength: [1000, "Description cannot exceed 1000 characters"]
  },
  
  capacity: {
    type: Number,
    required: true,
    min: [1, "Capacity must be at least 1"],
    max: [10, "Capacity cannot exceed 10"],
    default: 1
  },
  
  size: {
    type: String,
    trim: true
  },
  
  floor: {
    type: Number,
    min: [1, "Floor must be at least 1"],
    default: 1
  },
  
  amenities: [{
    type: String,
    enum: [
      "wifi", "tv", "ac", "minibar", "balcony", "parking", 
      "breakfast", "gym", "pool", "spa", "roomservice", 
      "laundry", "safe", "hairdryer", "bathtub", "shower",
      "workdesk", "telephone", "coffemaker", "refrigerator"
    ]
  }],
  
  images: [{
    url: {
      type: String,
      required: true
    },
    alt: {
      type: String,
      default: ""
    },
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  
  isBooked: {
    type: Boolean,
    default: false
  },
  
  isAvailable: {
    type: Boolean,
    default: true
  },
  
  maintenanceNotes: {
    type: String,
    trim: true
  },
  
  lastCleaned: {
    type: Date
  },
  
  lastMaintenance: {
    type: Date
  },
  
  hotel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hotel",
    required: [true, "Hotel reference is required"]
  },
  
  // Booking information
  currentBooking: {
    guestName: String,
    guestEmail: String,
    guestPhone: String,
    checkIn: Date,
    checkOut: Date,
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking"
    }
  },
  
  // Pricing options
  seasonalPricing: [{
    season: {
      type: String,
      enum: ["peak", "regular", "off"]
    },
    price: Number,
    startDate: Date,
    endDate: Date
  }],
  
  // Room features
  bedType: {
    type: String,
    enum: ["single", "double", "queen", "king", "twin", "sofa"],
    default: "double"
  },
  
  bedCount: {
    type: Number,
    min: 1,
    default: 1
  },
  
  bathroomType: {
    type: String,
    enum: ["private", "shared", "ensuite"],
    default: "private"
  },
  
  view: {
    type: String,
    enum: ["city", "garden", "pool", "ocean", "mountain", "courtyard", "none"],
    default: "none"
  },
  
  smokingAllowed: {
    type: Boolean,
    default: false
  },
  
  petFriendly: {
    type: Boolean,
    default: false
  },
  
  // Accessibility features
  accessible: {
    type: Boolean,
    default: false
  },
  
  accessibilityFeatures: [{
    type: String,
    enum: [
      "wheelchair_accessible", "grab_bars", "lowered_fixtures",
      "wide_doorways", "accessible_shower", "hearing_accessible",
      "visual_accessible", "accessible_parking"
    ]
  }],
  
  // Room status tracking
  status: {
    type: String,
    enum: ["available", "occupied", "cleaning", "maintenance", "out_of_order"],
    default: "available"
  },
  
  housekeepingStatus: {
    type: String,
    enum: ["clean", "dirty", "inspected", "out_of_order"],
    default: "clean"
  },
  
  // Rating and reviews
  rating: {
    average: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },
    count: {
      type: Number,
      default: 0
    }
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
roomSchema.index({ hotel: 1, roomNumber: 1 }, { unique: true });
roomSchema.index({ hotel: 1, type: 1 });
roomSchema.index({ hotel: 1, isBooked: 1, isAvailable: 1 });
roomSchema.index({ price: 1 });
roomSchema.index({ capacity: 1 });
roomSchema.index({ amenities: 1 });
roomSchema.index({ floor: 1 });
roomSchema.index({ status: 1 });

// Virtual for checking if room is currently bookable
roomSchema.virtual('isBookable').get(function() {
  return this.isAvailable && !this.isBooked && this.status === 'available';
});

// Virtual for full room identifier
roomSchema.virtual('fullRoomId').get(function() {
  return this.roomNumber ? `${this.roomNumber} - ${this.name}` : this.name;
});

// Pre-save middleware to update timestamps and validate
roomSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  
  // If room is not available, it shouldn't be bookable
  if (!this.isAvailable) {
    this.isBooked = false;
  }
  
  // Update status based on booking and availability
  if (!this.isAvailable) {
    this.status = 'maintenance';
  } else if (this.isBooked) {
    this.status = 'occupied';
  } else {
    this.status = 'available';
  }
  
  next();
});

// Pre-update middleware
roomSchema.pre(['updateOne', 'findOneAndUpdate'], function(next) {
  this.set({ updatedAt: new Date() });
  next();
});

// Static method to find available rooms
roomSchema.statics.findAvailableRooms = function(hotelId, checkIn, checkOut) {
  return this.find({
    hotel: hotelId,
    isAvailable: true,
    isBooked: false,
    status: 'available'
  });
};

// Instance method to book room
roomSchema.methods.bookRoom = function(bookingDetails) {
  this.isBooked = true;
  this.status = 'occupied';
  this.currentBooking = bookingDetails;
  return this.save();
};

// Instance method to checkout room
roomSchema.methods.checkoutRoom = function() {
  this.isBooked = false;
  this.status = 'cleaning';
  this.currentBooking = undefined;
  return this.save();
};

// Instance method to set maintenance mode
roomSchema.methods.setMaintenance = function(notes) {
  this.isAvailable = false;
  this.isBooked = false;
  this.status = 'maintenance';
  this.maintenanceNotes = notes;
  this.lastMaintenance = new Date();
  return this.save();
};

const Room = mongoose.models.Room || mongoose.model("Room", roomSchema);
module.exports = Room;