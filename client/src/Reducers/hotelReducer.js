import { createSlice } from "@reduxjs/toolkit";
import { fetchHotels, createHotel, deleteHotel } from "../actions/hotelAction";

const hotelSlice = createSlice({
  name: "hotels",
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Hotels
      .addCase(fetchHotels.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHotels.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(fetchHotels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Create Hotel
      .addCase(createHotel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createHotel.fulfilled, (state, action) => {
        state.loading = false;
        state.data.push(action.payload); // add the new hotel to data
      })
      .addCase(createHotel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Delete Hotel
      .addCase(deleteHotel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteHotel.fulfilled, (state, action) => {
        state.loading = false;
        // Remove the deleted hotel from state.data
        state.data = state.data.filter((hotel) => hotel._id !== action.payload);
      })
      .addCase(deleteHotel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default hotelSlice.reducer;
