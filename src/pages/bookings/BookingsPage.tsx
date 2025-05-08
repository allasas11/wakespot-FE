import React, { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";
import api from "../../api";
import { Link } from "react-router";

import type { Booking } from "../../types/types";

import { useAuth } from "../../AuthContext";

const BookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const { user } = useAuth(); 

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

  const filteredBookings = user?.role === "CUSTOMER"
  ? bookings.filter((booking) => booking.user._id === user.id)
  : bookings;

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

      <div style={{ marginBottom: "20px" }}>
        <Link to="/bookings/create">
          <button>Book a Session</button>
        </Link>
      </div>

      <ul style={{ listStyle: "none", paddingLeft: 0 }}>
        {filteredBookings.length > 0 ? (
          filteredBookings.map((booking) => (
            <li key={booking._id} style={{ borderBottom: "1px solid #ddd", paddingBottom: "20px", marginBottom: "20px" }}>
              <Link
                to={`/bookings/${booking._id}`}
                style={{ fontSize: "1.2rem", display: "block", margin: "10px 0" }}
              >
                <strong>{new Date(booking.session.date).toLocaleDateString()}</strong> –{" "}
                {booking.session.time} • €{booking.totalPrice}
                {" "}
                <span
                  style={{
                    marginLeft: "10px",
                    color: booking.status === "confirmed" ? "#4CAF50" : "#F44336"
                  }}
                >
                  ({booking.status})
                </span>
              </Link>

              <p style={{ margin: "0 0 0 20px", fontSize: "0.95rem" }}>
                User: {booking.user.username} • Payment: {booking.paymentStatus}
              </p>

              <p style={{ margin: "0 0 0 20px", fontSize: "0.95rem" }}>
                Gear Packages:
                {booking.equipmentPackages.length > 0 ? (
                  <> {booking.equipmentPackages.map((pkg) => pkg.name).join(", ")}</>
                ) : (
                  <em> No gear rented</em>
                )}
              </p>
            </li>
          ))
        ) : (
          <p>No bookings found</p>
        )}
      </ul>
    </div>
  );
};

export default BookingsPage;