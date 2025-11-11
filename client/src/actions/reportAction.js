import {
  FETCH_REPORT_REQUEST,
  FETCH_REPORT_SUCCESS,
  FETCH_REPORT_FAIL,
  GENERATE_REPORT_REQUEST,
  GENERATE_REPORT_SUCCESS,
  GENERATE_REPORT_FAIL,
} from "../constants/reportConstants";

export const fetchReports = () => async (dispatch) => {
  try {
    dispatch({ type: FETCH_REPORT_REQUEST });

    // Mock API call
    const data = [
      { id: 1, type: "Sales Report", date: "2025-10-01" },
      { id: 2, type: "Inventory Report", date: "2025-10-02" },
    ];

    dispatch({ type: FETCH_REPORT_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: FETCH_REPORT_FAIL, payload: error.message });
  }
};

export const generateReport = (report) => async (dispatch) => {
  try {
    dispatch({ type: GENERATE_REPORT_REQUEST });

    // Mock API call
    const newReport = { id: Date.now(), ...report };

    dispatch({ type: GENERATE_REPORT_SUCCESS, payload: newReport });
  } catch (error) {
    dispatch({ type: GENERATE_REPORT_FAIL, payload: error.message });
  }
};
