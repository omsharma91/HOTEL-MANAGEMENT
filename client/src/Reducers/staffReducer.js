// src/reducers/staffReducer.js
import {
  STAFF_LIST_REQUEST,
  STAFF_LIST_SUCCESS,
  STAFF_LIST_FAIL,
} from "../constants/staffConstants";

export const staffReducer = (state = { data: [] }, action) => {
  switch (action.type) {
    case STAFF_LIST_REQUEST:
      return { loading: true, data: [] };
    case STAFF_LIST_SUCCESS:
      return { loading: false, data: action.payload };
    case STAFF_LIST_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
