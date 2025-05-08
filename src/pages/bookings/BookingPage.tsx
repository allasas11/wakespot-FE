import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import api from "../../api";
import { BarLoader } from "react-spinners";

import type { Booking } from "../../types/types";

import { useAuth } from "../../AuthContext";

const BookingPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const { user } = useAuth();

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await api.get(`/bookings/${id}`);
        const data = response.data;

        setBooking(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to load booking"));
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [id]);


  useEffect(() => {
    if (!loading && booking && user && user.role === "CUSTOMER" && booking.user._id !== user.id) {
      alert("You can only view your own bookings");
      navigate("/bookings");
    }
  }, [loading, booking, user, navigate]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <BarLoader color="#mediumseagreen" loading={true} />
      </div>
    );
  }

  if (error || !booking) {
    return <div>{error?.message || "No booking found"}</div>;
  }

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this booking?")) return;

    try {
      await api.delete(`/bookings/${id}`);
      navigate("/bookings");
    } catch (err) {
      console.error("Failed to delete booking:", err);
      setError(new Error("Failed to delete booking"));
    }
  };

  return (
    <div>
      <h1>Booking Details</h1>

      <p><strong>Session Date:</strong> {new Date(booking.session.date).toLocaleDateString()}</p>
      <p><strong>Time:</strong> {booking.session.time}</p>
      <p>
        <strong>Location:</strong>{" "}
        {booking.session.location
          ? `${booking.session.location.name}, ${booking.session.location.address}`
          : "Unknown"}
      </p>
      <p>
        <strong>Instructor:</strong>{" "}
        {booking.session.instructor?.name || "Not assigned"}
      </p>
      <p><strong>Total Price:</strong> €{booking.totalPrice}</p>
      <p><strong>Status:</strong> 
        <span style={{
          marginLeft: "10px",
          color: booking.status === "confirmed" ? "#4CAF50" : "#F44336"
        }}>
          ({booking.status})
        </span>
      </p>
      <p><strong>Payment Status:</strong> {booking.paymentStatus}</p>
      <p><strong>User:</strong> {booking.user.username} – {booking.user.email}</p>

      <div>
        <strong>Gear Packages:</strong>
        {booking.equipmentPackages.length > 0 ? (
          <ul>
            {booking.equipmentPackages.map((pkg) => (
              <li key={pkg._id}>
                {pkg.name} – €{pkg.price}
              </li>
            ))}
          </ul>
        ) : (
          <p>No gear packages selected</p>
        )}
      </div>

      {user?.role === "ADMIN" && (
        <div>
          <button onClick={() => navigate(`/bookings/edit/${id}`)}>Edit Booking</button>
          <button onClick={handleDelete}>Delete Booking</button>
        </div>
      )}

      <div style={{ marginTop: "20px" }}>
        <button onClick={() => navigate(-1)}>Back</button>
      </div>
    </div>
  );
};

export default BookingPage;