import {
  FETCH_INVENTORY_REQUEST,
  FETCH_INVENTORY_SUCCESS,
  FETCH_INVENTORY_FAIL,
  ADD_INVENTORY_REQUEST,
  ADD_INVENTORY_SUCCESS,
  ADD_INVENTORY_FAIL,
} from "../constants/inventoryConstants";

const initialState = {
  items: [],
  loading: false,
  error: null,
};

export const inventoryReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_INVENTORY_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_INVENTORY_SUCCESS:
      return { ...state, loading: false, items: action.payload };
    case FETCH_INVENTORY_FAIL:
      return { ...state, loading: false, error: action.payload };

    case ADD_INVENTORY_REQUEST:
      return { ...state, loading: true, error: null };
    case ADD_INVENTORY_SUCCESS:
      return { ...state, loading: false, items: [...state.items, action.payload] };
    case ADD_INVENTORY_FAIL:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};
