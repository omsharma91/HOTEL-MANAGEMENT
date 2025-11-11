import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { authHeaders } from "../assets/apiConfig";


const API_BASE_URL = "http://localhost:5000/api";

// Fetch rooms - supports hotel-specific filtering
export const fetchRooms = createAsyncThunk(
  "rooms/fetchRooms", 
  async (hotelId = null, { rejectWithValue }) => {
    
    try {
      const url = hotelId 
        ? `${API_BASE_URL}/hotels/${hotelId}/rooms`
        : `${API_BASE_URL}/rooms`;
        
      const response = await axios.get(url,authHeaders() );
      // console.log(response);
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Fetch single room by ID
export const fetchRoomById = createAsyncThunk(
  "rooms/fetchRoomById",
  async (roomId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/rooms/${roomId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Create new room
export const createRoom = createAsyncThunk(
  "rooms/createRoom", 
  async (roomData, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/rooms`, roomData);
      // Refresh the rooms list after creating
      if (roomData.hotel) {
        dispatch(fetchRooms(roomData.hotel));
      } else {
        dispatch(fetchRooms());
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Update existing room
export const updateRoom = createAsyncThunk(
  "rooms/updateRoom",
  async ({ id, data }, { dispatch, getState, rejectWithValue }) => {
    try {
      const {
        userLogin: { userInfo },
      } = getState();

      const token = userInfo?.token || JSON.parse(localStorage.getItem("userInfo"))?.token;

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.put(`${API_BASE_URL}/rooms/${id}`, data, config);

      // Refresh the rooms list after updating
      if (data.hotel) {
        dispatch(fetchRooms(data.hotel));
      } else {
        dispatch(fetchRooms());
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);


// Delete room
export const deleteRoom = createAsyncThunk(
  "rooms/deleteRoom",
  async (roomId, { dispatch, getState, rejectWithValue }) => {
    try {
      await axios.delete(`${API_BASE_URL}/rooms/${roomId}`);
      // Refresh the rooms list after deleting
      const currentRoom = getState().rooms.data.find(room => room._id === roomId);
      if (currentRoom && currentRoom.hotel) {
        dispatch(fetchRooms(currentRoom.hotel));
      } else {
        dispatch(fetchRooms());
      }
      return roomId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Book room (update booking status)
export const bookRoom = createAsyncThunk(
  "rooms/bookRoom", 
  async (room, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/rooms/${room._id}`, {
        ...room,
        isBooked: true,
      });
      // Refresh the rooms list after booking
      if (room.hotel) {
        dispatch(fetchRooms(room.hotel));
      } else {
        dispatch(fetchRooms());
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Update room availability (for maintenance, etc.)
export const updateRoomAvailability = createAsyncThunk(
  "rooms/updateRoomAvailability",
  async ({ roomId, isAvailable }, { dispatch, getState, rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/rooms/${roomId}`, {
        isAvailable
      });
      // Refresh the rooms list
      const currentRoom = getState().rooms.data.find(room => room._id === roomId);
      if (currentRoom && currentRoom.hotel) {
        dispatch(fetchRooms(currentRoom.hotel));
      } else {
        dispatch(fetchRooms());
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Bulk update rooms
export const bulkUpdateRooms = createAsyncThunk(
  "rooms/bulkUpdateRooms",
  async ({ roomIds, updateData }, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/rooms/bulk-update`, {
        roomIds,
        updateData
      });
      // Refresh the rooms list after bulk update
      dispatch(fetchRooms());
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Search rooms with filters
export const searchRooms = createAsyncThunk(
  "rooms/searchRooms",
  async (searchParams, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams(searchParams).toString();
      const response = await axios.get(`${API_BASE_URL}/rooms/search?${queryParams}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Get room statistics
export const getRoomStatistics = createAsyncThunk(
  "rooms/getRoomStatistics",
  async (hotelId = null, { rejectWithValue }) => {
    try {
      const url = hotelId 
        ? `${API_BASE_URL}/hotels/${hotelId}/rooms/statistics`
        : `${API_BASE_URL}/rooms/statistics`;
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Create Order (Razorpay order)
export const createOrder = createAsyncThunk(
  "payment/createOrder",
  async ({ amount, roomId, userId }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post( `${API_BASE_URL}/payment/create-order`, {
        amount,
        roomId,
        userId,
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to create order");
    }
  }
);

// Verify Payment
export const verifyPayment = createAsyncThunk(
  "payment/verifyPayment",
  async ({ roomId, userId }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`${API_BASE_URL}/payment/verify`, {
        roomId,
        userId,
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Payment verification failed");
    }
  }
);
