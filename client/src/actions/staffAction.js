// src/actions/staffAction.js
import {
  STAFF_LIST_REQUEST,
  STAFF_LIST_SUCCESS,
  STAFF_LIST_FAIL,
} from "../constants/staffConstants";

// Dummy data
const dummyStaff = [
  { id: 1, name: "John Doe", role: "Manager" },
  { id: 2, name: "Jane Smith", role: "Receptionist" },
];

export const fetchStaff = () => async (dispatch) => {
  try {
    dispatch({ type: STAFF_LIST_REQUEST });
    // simulate API
    setTimeout(() => {
      dispatch({ type: STAFF_LIST_SUCCESS, payload: dummyStaff });
    }, 500);
  } catch (error) {
    dispatch({ type: STAFF_LIST_FAIL, payload: error.message });
  }
};
