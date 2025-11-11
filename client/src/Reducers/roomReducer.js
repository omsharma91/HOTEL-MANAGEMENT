import { createSlice } from "@reduxjs/toolkit";
import { 
  fetchRooms, 
  fetchRoomById,
  bookRoom, 
  createRoom, 
  updateRoom, 
  deleteRoom,
  updateRoomAvailability,
  bulkUpdateRooms,
  searchRooms,
  getRoomStatistics
} from "../actions/roomAction";

const roomSlice = createSlice({
  name: "rooms",
  initialState: {
    data: [],
    currentRoom: null,
    statistics: {
      total: 0,
      available: 0,
      booked: 0,
      maintenance: 0,
      avgPrice: 0
    },
    loading: false,
    error: null,
    searchResults: [],
    searchLoading: false,
  },
  reducers: {
    // Synchronous actions for immediate UI updates
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentRoom: (state) => {
      state.currentRoom = null;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    // Local room updates for optimistic UI
    updateRoomLocally: (state, action) => {
      const { roomId, updates } = action.payload;
      const roomIndex = state.data.findIndex(room => room._id === roomId);
      if (roomIndex !== -1) {
        state.data[roomIndex] = { ...state.data[roomIndex], ...updates };
      }
    },
    removeRoomLocally: (state, action) => {
      state.data = state.data.filter(room => room._id !== action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all rooms
      .addCase(fetchRooms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRooms.fulfilled, (state, action) => {
  state.loading = false;
  state.error = null;

  // unpack the response
  const { data: rooms = [], hotel = null, pagination = null } = action.payload;

  // save rooms separately
  state.data = rooms;
  state.hotel = hotel;
  state.pagination = pagination;

  // calculate statistics from rooms
  state.statistics = {
    total: rooms.length,
    available: rooms.filter(r => !r.isBooked && r.isAvailable).length,
    booked: rooms.filter(r => r.isBooked).length,
    maintenance: rooms.filter(r => !r.isAvailable).length,
    avgPrice: rooms.length > 0 
      ? Math.round(rooms.reduce((sum, r) => sum + r.price, 0) / rooms.length) 
      : 0
  };
})

      .addCase(fetchRooms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // Fetch single room
      .addCase(fetchRoomById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoomById.fulfilled, (state, action) => {
        state.currentRoom = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchRoomById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // Create room
      .addCase(createRoom.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createRoom.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        // Room will be added to the list when fetchRooms is called
      })
      .addCase(createRoom.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // Update room
      .addCase(updateRoom.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateRoom.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        // Room will be updated when fetchRooms is called
      })
      .addCase(updateRoom.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // Delete room
      .addCase(deleteRoom.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteRoom.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        // Room will be removed when fetchRooms is called
      })
      .addCase(deleteRoom.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // Book room
      .addCase(bookRoom.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(bookRoom.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        // Room booking status will be updated when fetchRooms is called
      })
      .addCase(bookRoom.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // Update room availability
      .addCase(updateRoomAvailability.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateRoomAvailability.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(updateRoomAvailability.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // Bulk update rooms
      .addCase(bulkUpdateRooms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(bulkUpdateRooms.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(bulkUpdateRooms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // Search rooms
      .addCase(searchRooms.pending, (state) => {
        state.searchLoading = true;
        state.error = null;
      })
      .addCase(searchRooms.fulfilled, (state, action) => {
        state.searchResults = action.payload;
        state.searchLoading = false;
        state.error = null;
      })
      .addCase(searchRooms.rejected, (state, action) => {
        state.searchLoading = false;
        state.error = action.payload || action.error.message;
      })

      // Get room statistics
      .addCase(getRoomStatistics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRoomStatistics.fulfilled, (state, action) => {
        state.statistics = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getRoomStatistics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { 
  clearError, 
  clearCurrentRoom, 
  clearSearchResults, 
  setLoading, 
  updateRoomLocally, 
  removeRoomLocally 
} = roomSlice.actions;

export default roomSlice.reducer;