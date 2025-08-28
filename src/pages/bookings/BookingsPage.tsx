import React, { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";
import api from "../../api";
import { Link } from "react-router";
import { Booking } from "../../types/types";
import { useAuth } from "../../AuthContext";
import AdminBookingModal from "../../components/AdminBookingModal";
import { Button } from "@mui/material";

const BookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const { user } = useAuth();

  const [modalBooking, setModalBooking] = useState<Booking | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await api.get("/bookings");
        setBookings(response.data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to load bookings"));
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const handleStatusChange = async (bookingId: string, newStatus: "confirmed" | "completed" | "cancelled", reason?: string) => {
    try {
      const response = await api.put(`/bookings/${bookingId}`, {
        status: newStatus,
        cancellationReason: reason,
      });
      const updatedBooking = response.data;
      setBookings(prev => prev.map(b => (b._id === bookingId ? updatedBooking : b)));
    } catch (err) {
      console.error("Failed to update booking:", err);
      alert("Failed to update booking status.");
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <BarLoader color="#mediumseagreen" loading={true} />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <h1>{user?.role === "ADMIN" ? "All Bookings" : "My Bookings"}</h1>

      {user && (
        <div style={{ marginBottom: "20px" }}>
          <Link to="/bookings/create">
            <button>Book a Session</button>
          </Link>
        </div>
      )}

      <ul style={{ listStyle: "none", paddingLeft: 0 }}>
        {bookings.length > 0 ? (
          bookings.map((booking) => {
            const gearTotal = booking.equipmentPackages.reduce((sum, pkg) => sum + pkg.price, 0);
            const totalPrice = booking.totalPrice + gearTotal;

            return (
              <li key={booking._id} style={{ borderBottom: "1px solid #ddd", paddingBottom: "20px", marginBottom: "20px" }}>
                <Link
                  to={`/bookings/${booking._id}`}
                  style={{ fontSize: "1.2rem", display: "block", margin: "10px 0" }}
                >
                  <strong>{new Date(booking.session.date).toLocaleDateString()}</strong> – {booking.session.time} • €{totalPrice}{" "}
                  <span
                    style={{
                      marginLeft: "10px",
                      fontWeight: "bold",
                      color:
                        booking.status === "confirmed"
                          ? "#4CAF50"
                          : booking.status === "cancelled"
                          ? "#FF9800"
                          : booking.status === "completed"
                          ? "#2196F3"
                          : "#F44336",
                    }}
                  >
                    ({booking.status})
                  </span>
                </Link>

                <p style={{ margin: "0 0 0 20px", fontSize: "0.95rem" }}>
                  User: {booking.user.username} • Payment: {booking.paymentStatus}
                </p>

                <p style={{ margin: "0 0 0 20px", fontSize: "0.95rem" }}>
                  Session Price: €{booking.totalPrice}
                </p>

                {booking.equipmentPackages.length > 0 && (
                  <div style={{ margin: "0 0 0 20px", fontSize: "0.95rem" }}>
                    Gear Packages:
                    <ul style={{ margin: 0, paddingLeft: "20px" }}>
                      {booking.equipmentPackages.map((pkg) => (
                        <li key={pkg._id}>
                          {pkg.name}: €{pkg.price}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <p style={{ margin: "0 0 0 20px", fontSize: "0.95rem", fontWeight: "bold" }}>
                  Total Price: €{booking.totalPrice + booking.equipmentPackages.reduce((sum, pkg) => sum + pkg.price, 0)}
                </p>

                {booking.status === "cancelled" && booking.cancellationReason && (
                  <p style={{ margin: "5px 0 0 20px", fontStyle: "italic", color: "#D32F2F" }}>
                    Reason: {booking.cancellationReason}
                  </p>
                )}

                {user?.role === "ADMIN" && (
                  <div style={{ marginTop: "10px" }}>
                    <Button variant="contained" color="primary" onClick={() => setModalBooking(booking)}>
                      Manage Booking
                    </Button>
                  </div>
                )}
              </li>
            );
          })
        ) : (
          <p>No bookings found</p>
        )}
      </ul>

      {modalBooking && (
        <AdminBookingModal
          booking={modalBooking}
          open={!!modalBooking}
          onClose={() => setModalBooking(null)}
          onUpdateStatus={(status, reason) => handleStatusChange(modalBooking._id, status, reason)}
        />
      )}
    </div>
  );
};

export default BookingsPage;
