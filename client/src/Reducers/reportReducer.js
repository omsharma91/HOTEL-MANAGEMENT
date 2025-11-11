import {
  FETCH_REPORT_REQUEST,
  FETCH_REPORT_SUCCESS,
  FETCH_REPORT_FAIL,
  GENERATE_REPORT_REQUEST,
  GENERATE_REPORT_SUCCESS,
  GENERATE_REPORT_FAIL,
} from "../constants/reportConstants";

export const reportReducer = (state = { reports: [] }, action) => {
  switch (action.type) {
    case FETCH_REPORT_REQUEST:
      return { loading: true, reports: [] };
    case FETCH_REPORT_SUCCESS:
      return { loading: false, reports: action.payload };
    case FETCH_REPORT_FAIL:
      return { loading: false, error: action.payload };

    case GENERATE_REPORT_REQUEST:
      return { ...state, loading: true };
    case GENERATE_REPORT_SUCCESS:
      return { loading: false, reports: [...state.reports, action.payload] };
    case GENERATE_REPORT_FAIL:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};
