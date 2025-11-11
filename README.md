# Hotel Management System

A full-stack web application for managing hotel operations including bookings, rooms, staff, inventory, payments, and reporting.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

## 📖 Overview

The Hotel Management System is a comprehensive solution designed to streamline hotel operations. It provides tools for managing hotel properties, rooms, staff members, inventory, bookings, and generating detailed reports. The system includes a secure authentication system and integrated payment processing.

## ✨ Features

### Core Functionality
- **Hotel Management**: Add, view, and manage multiple hotel properties
- **Room Management**: Track room inventory, availability, and pricing
- **Booking System**: Create and manage guest bookings with availability checking
- **Staff Management**: Manage hotel staff members and their assignments
- **Inventory Management**: Track and manage hotel inventory items
- **Payment Processing**: Integrated payment gateway (Razorpay) for bookings
- **Reporting**: Generate and view detailed hotel operation reports
- **User Authentication**: Secure login and registration with JWT tokens
- **Dashboard**: Interactive dashboard with charts and statistics

### Additional Features
- User role-based access control
- Real-time data updates
- PDF report generation
- Responsive UI design
- RESTful API architecture

## 🛠 Tech Stack

### Frontend
- **React 19**: UI library
- **Vite**: Build tool and dev server
- **Redux & Redux Toolkit**: State management
- **React Router v7**: Client-side routing
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library
- **Recharts**: Data visualization
- **jsPDF**: PDF generation
- **Axios**: HTTP client

### Backend
- **Node.js & Express**: Server framework
- **MongoDB & Mongoose**: Database
- **JWT**: Authentication
- **Bcryptjs**: Password hashing
- **Nodemon**: Development server auto-reload

## 📁 Project Structure

```
Hotel-Management/
├── client/                          # React frontend application
│   ├── src/
│   │   ├── components/              # Reusable React components
│   │   │   ├── AddHotelModal.jsx
│   │   │   ├── AddInventoryModal.jsx
│   │   │   ├── FilterBar.jsx
│   │   │   ├── HotelCard.jsx
│   │   │   ├── InventoryCard.jsx
│   │   │   ├── ReportCard.jsx
│   │   │   ├── RoomCard.jsx
│   │   │   └── StaffCard.jsx
│   │   ├── screens/                 # Page components
│   │   │   ├── BookingPage.jsx
│   │   │   ├── HotelPage.jsx
│   │   │   ├── InventoryScreen.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── PaymentPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── ReportScreen.jsx
│   │   │   ├── RoomPage.jsx
│   │   │   └── StaffPage.jsx
│   │   ├── actions/                 # Redux action creators
│   │   ├── Reducers/                # Redux reducers
│   │   ├── constants/               # Constants and action types
│   │   ├── assets/                  # Static assets and config
│   │   ├── App.jsx                  # Main App component
│   │   └── main.jsx                 # React entry point
│   ├── vite.config.js               # Vite configuration
│   ├── eslint.config.js             # ESLint configuration
│   ├── index.html                   # HTML template
│   └── package.json                 # Frontend dependencies
│
├── server/                          # Express backend application
│   ├── controllers/                 # Route controllers
│   │   ├── authController.js
│   │   ├── bookingController.js
│   │   ├── hotelController.js
│   │   ├── inventoryController.js
│   │   ├── reportController.js
│   │   └── roomController.js
│   ├── models/                      # Mongoose schemas
│   │   ├── Hotel.js
│   │   ├── Room.js
│   │   ├── Inventory.js
│   │   ├── Report.js
│   │   ├── booking.js
│   │   └── userModel.js
│   ├── routes/                      # API routes
│   │   ├── authRoutes.js
│   │   ├── bookingRoutes.js
│   │   ├── hotelRoutes.js
│   │   ├── inventoryRoutes.js
│   │   ├── paymentRoutes.js
│   │   ├── reportRoutes.js
│   │   └── roomRoutes.js
│   ├── middleware/                  # Custom middleware
│   │   ├── auth.js                  # Authentication middleware
│   │   └── user.js                  # User validation middleware
│   ├── config/                      # Configuration files
│   │   └── db.js                    # Database configuration
│   ├── index.js                     # Server entry point
│   └── package.json                 # Backend dependencies
│
└── README.md                        # This file
```

## 🚀 Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or Atlas cloud)

### Backend Setup

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the server directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/hotel-management
   JWT_SECRET=your_jwt_secret_key
   ```

### Frontend Setup

1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Update the API configuration in `src/assets/apiConfig.js`:
   ```javascript
   export const API_BASE_URL = 'http://localhost:5000/api';
   ```

## ⚙️ Configuration

### Database Configuration
Edit `server/config/db.js` to configure your MongoDB connection:
```javascript
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/hotel-management';
```

### Environment Variables
Create a `.env` file in the server directory:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/hotel-management
JWT_SECRET=your_super_secret_key_here
NODE_ENV=development
```

## 🎯 Running the Application

### Start the Backend Server
```bash
cd server
npm start
```
The server will start on `http://localhost:5000`

### Start the Frontend Development Server
```bash
cd client
npm run dev
```
The frontend will start on `http://localhost:5173`

### Build for Production

**Frontend:**
```bash
cd client
npm run build
```

**Linting:**
```bash
cd client
npm run lint
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (protected)
- `POST /api/auth/logout` - User logout

### Hotels
- `GET /api/hotels` - Get all hotels
- `POST /api/hotels` - Create a new hotel
- `GET /api/hotels/:id` - Get hotel details
- `PUT /api/hotels/:id` - Update hotel
- `DELETE /api/hotels/:id` - Delete hotel

### Rooms
- `GET /api/rooms` - Get all rooms
- `POST /api/rooms` - Create a new room
- `GET /api/rooms/:id` - Get room details
- `PUT /api/rooms/:id` - Update room
- `DELETE /api/rooms/:id` - Delete room

### Bookings
- `GET /api/bookings` - Get all bookings
- `POST /api/bookings` - Create a new booking
- `GET /api/bookings/:id` - Get booking details
- `PUT /api/bookings/:id` - Update booking status

### Inventory
- `GET /api/inventory` - Get all inventory items
- `POST /api/inventory` - Add new inventory
- `PUT /api/inventory/:id` - Update inventory item
- `DELETE /api/inventory/:id` - Delete inventory item

### Payments
- `POST /api/payments` - Process payment
- `GET /api/payments/verify/:paymentId` - Verify payment

### Reports
- `GET /api/reports` - Get all reports
- `POST /api/reports` - Generate new report
- `GET /api/reports/:id` - Get report details

### Staff
- `GET /api/staff` - Get all staff members
- `POST /api/staff` - Add new staff member
- `PUT /api/staff/:id` - Update staff information
- `DELETE /api/staff/:id` - Remove staff member

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License - see the LICENSE file for details.

---

**Last Updated**: November 11, 2025

For issues or questions, please open an issue in the repository.
