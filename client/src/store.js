import { createStore, combineReducers, applyMiddleware } from 'redux';
import {thunk} from 'redux-thunk'; // ✅ Import this
import { userReducer } from './Reducers/userReducer';
import roomReducer from './Reducers/roomReducer';
import hotelsReducer from './Reducers/hotelReducer'
import paymentReducer from "./Reducers/paymentReducer"
import authReducer from './Reducers/authReducer';
import { staffReducer } from './Reducers/staffReducer';
import { inventoryReducer } from './Reducers/inventoryReducer';
import { reportReducer } from './Reducers/reportReducer';

// Combine reducers (you can add more later)
const rootReducer = combineReducers({
  userLogin: userReducer,
  auth: authReducer,
  rooms: roomReducer,
  hotels:hotelsReducer,
  payment:paymentReducer,
  staff: staffReducer,
  inventory: inventoryReducer,
  reports: reportReducer,
});

// Get user info from localStorage (persisted login)
const userInfoFromStorage = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo'))
  : null;

// Initial state with persisted user info
const initialState = {
  userLogin: { userInfo: userInfoFromStorage },
};

// Apply middleware (thunk for async actions)
const middleware = [thunk];

// Create the store
export const store = createStore(
  rootReducer,
  initialState,
  applyMiddleware(...middleware)
);
