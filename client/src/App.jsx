// App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import LoginPage from "./screens/LoginPage";
import RegisterPage from "./screens/RegisterPage";
import RoomPage from "./screens/RoomPage";
import HotelPage from "./screens/HotelPage";      // corrected import
import BookingPage from "./screens/BookingPage";
import PaymentPage from "./screens/PaymentPage";

/**
 * ProtectedRoute:
 * - Pure (no side-effects). Returns children when authenticated,
 *   otherwise returns a <Navigate /> to /login.
 * - Don't use useNavigate, dispatch, or setState here (those can trigger loops).
 */
function ProtectedRoute({ children }) {
  const token = useSelector((state) => state.auth?.token);
  const isAuthenticated = useSelector((state) => state.auth?.isAuthenticated);
  
  // Check multiple sources for authentication
  const storedToken = localStorage.getItem("token");
  const storedUserInfo = localStorage.getItem("userInfo");
  
  // Consider authenticated if any of these exist
  const isAuth = isAuthenticated || token || storedToken || storedUserInfo;

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Root redirects to /hotels (protected) */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HotelPage />
            </ProtectedRoute>
          }
        />

        {/* Protected routes */}
        <Route
          path="/hotels"
          element={
            <ProtectedRoute>
              <HotelPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hotels/:hotelId/rooms"
          element={
            <ProtectedRoute>
              <RoomPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/booking/:roomId"
          element={
            <ProtectedRoute>
              <BookingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment/:roomId"
          element={
            <ProtectedRoute>
              <PaymentPage />
            </ProtectedRoute>
          }
        />

        {/* 404 fallback — sends unauthenticated users to login, authenticated users to /hotels */}
        <Route
          path="*"
          element={
            <ProtectedRoute>
              <Navigate to="/hotels" replace />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
