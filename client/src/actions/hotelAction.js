import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchHotels = createAsyncThunk(
  "hotels/fetchHotels",
  async (_, { getState }) => {
    const { userLogin } = getState();
    const token = userLogin?.userInfo?.token;

    const response = await axios.get("http://localhost:5000/api/hotels", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  }
);

export const createHotel = createAsyncThunk(
  "hotels/createHotel",
  async (hotelData, { dispatch, getState }) => {
    const { userLogin } = getState();
    const token = userLogin?.userInfo?.token;

    const res = await axios.post("http://localhost:5000/api/hotels", hotelData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    dispatch(fetchHotels());
    return res.data;
  }
);

export const deleteHotel = createAsyncThunk(
  "hotels/deleteHotel",
  async (id, { getState, rejectWithValue }) => {
    try {
      const { userLogin } = getState();
      const token = userLogin?.userInfo?.token;

      await axios.delete(`http://localhost:5000/api/hotels/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return id; // return deleted hotel ID to remove from state
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);