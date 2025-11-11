import axios from "axios";
import {
  FETCH_INVENTORY_REQUEST,
  FETCH_INVENTORY_SUCCESS,
  FETCH_INVENTORY_FAIL,
  ADD_INVENTORY_REQUEST,
  ADD_INVENTORY_SUCCESS,
  ADD_INVENTORY_FAIL,
} from "../constants/inventoryConstants";

// Fetch all inventory items from backend
export const fetchInventory = () => async (dispatch) => {
  try {
    dispatch({ type: FETCH_INVENTORY_REQUEST });

    const { data } = await axios.get("/api/inventory"); // Call backend

    dispatch({ type: FETCH_INVENTORY_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: FETCH_INVENTORY_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

// Add a new inventory item to backend
export const addInventory = (item) => async (dispatch) => {
  try {
    dispatch({ type: ADD_INVENTORY_REQUEST });

    const { data } = await axios.post("http://localhost:5000/api/inventory", item); // Call backend

    dispatch({ type: ADD_INVENTORY_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: ADD_INVENTORY_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
