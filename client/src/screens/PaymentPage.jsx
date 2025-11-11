import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { resetPayment } from "../Reducers/paymentReducer";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import axios from "axios";

export default function PaymentPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { room, checkIn, checkOut, totalPrice } = location.state || {};
  const { loading, error } = useSelector((state) => state.payment);
  const userInfo = useSelector((state) => state.userLogin.userInfo);

  const [pdfUrl, setPdfUrl] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // ✅ Payment + update room
  const handlePayment = async () => {
    try {
      // 1️⃣ Update room status in backend
      const { data } = await axios.put(
        `http://localhost:5000/api/rooms/${room._id}`,
        {
          isBooked: true,
          status: "occupied",
          currentBooking: {
            guestName: userInfo.user?.name,
            guestEmail: userInfo.user?.email,
            checkIn,
            checkOut,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );

      console.log("Room updated:", data);

      // 2️⃣ Generate invoice
      const url = generateInvoice(false);
      setPdfUrl(url);
      setShowModal(true);
      alert("Payment Successful ✅");

      dispatch(resetPayment());
    } catch (err) {
      console.error(err);
      alert("Payment failed ❌");
    }
  };

  // ✅ Generate Invoice PDF (with check-in, check-out, nights)
  const generateInvoice = (save = true) => {
    const doc = new jsPDF();

    const formattedCheckIn = checkIn
      ? new Date(checkIn).toLocaleDateString()
      : "N/A";
    const formattedCheckOut = checkOut
      ? new Date(checkOut).toLocaleDateString()
      : "N/A";

    const nights = checkIn && checkOut
      ? Math.max(
          1,
          Math.ceil(
            (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)
          )
        )
      : 1;

    const totalAmount = room?.price ? room.price * nights : totalPrice;

    // Header
    doc.setFontSize(18);
    doc.text("Hotel Booking Invoice", 105, 20, { align: "center" });

    // Guest Info
    doc.setFontSize(12);
    doc.text(`Guest Name: ${userInfo.user?.name || "Guest User"}`, 14, 35);
    doc.text(`Email: ${userInfo.user?.email || "Not Provided"}`, 14, 42);
    doc.text(`Invoice Date: ${new Date().toLocaleDateString()}`, 14, 49);

    // Booking Table
    autoTable(doc, {
      startY: 60,
      head: [["Field", "Details"]],
      body: [
        ["Hotel Name", room?.hotel?.name || "N/A"],
        ["Room Name / Number", room?.name || room?.roomNumber || "N/A"],
        ["Room Type", room?.type || "N/A"],
        ["Check-in Date", formattedCheckIn],
        ["Check-out Date", formattedCheckOut],
        ["Total Nights", nights.toString()],
        ["Price per Night", `Rs ${room?.price || 0}`],
        ["Total Amount", `Rs ${totalAmount.toLocaleString()}`],
        ["Status", "Payment Completed"],
      ],
      theme: "grid",
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      bodyStyles: { textColor: 50 },
    });

    // Footer
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(10);
    doc.text(
      "Thank you for booking with us! We look forward to your stay.",
      14,
      finalY
    );

    if (save) {
      doc.save(`Invoice_${room?.name || "Room"}_${formattedCheckIn}.pdf`);
    } else {
      const pdfBlob = doc.output("blob");
      return URL.createObjectURL(pdfBlob);
    }
  };

  useEffect(() => {
    if (error) alert(`Payment Failed ❌ - ${error}`);
  }, [error]);

  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">No booking details found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6 space-y-6">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-3xl">
        <h1 className="text-2xl font-bold mb-6">Complete Your Payment</h1>

        <div className="mb-6 border-b pb-4">
          <h2 className="text-lg font-semibold">Room Details</h2>
          <p className="text-gray-600">{room.name}</p>
          <p className="text-gray-600">
            {new Date(checkIn).toLocaleDateString()} →{" "}
            {new Date(checkOut).toLocaleDateString()}
          </p>
          <p className="text-gray-800 font-bold mt-2">
            Total: ₹{totalPrice.toLocaleString()}
          </p>
        </div>

        <button
          onClick={handlePayment}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-lg"
        >
          {loading ? "Processing..." : "Pay & Preview Invoice"}
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-3xl relative">
            <button
              onClick={() => {
                setShowModal(false);
                navigate("/home");
              }}
              className="absolute top-4 right-4 text-xl font-bold text-gray-600 hover:text-gray-900"
            >
              ×
            </button>
            <h2 className="text-lg font-semibold mb-4">Invoice Preview</h2>
            <iframe
              src={pdfUrl}
              title="Invoice Preview"
              className="w-full h-96 border"
            />
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => generateInvoice(true)}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                Download Invoice
              </button>
              <button
                onClick={() => {
                  setShowModal(false);
                  navigate("/home");
                }}
                className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
              >
                Close & Go Home
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
