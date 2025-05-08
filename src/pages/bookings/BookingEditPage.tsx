import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import api from "../../api";
import { BarLoader } from "react-spinners";

import type { Session } from "../../types/types";
import type { EquipmentPackage } from "../../types/types";

import { useAuth } from "../../AuthContext";
import axios from "axios";

interface BookingErrorResponse {
  message?: string;
  error?: string;
  response?: {
    data: {
      error: string;
    };
  };
}

const BookingEditPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [bookingData, setBookingData] = useState<{
    sessionId: string;
    packageIds: string[];
    notes: string;
  }>({
    sessionId: "",
    packageIds: [],
    notes: ""
  });

  const [sessions, setSessions] = useState<Session[]>([]);
  const [packages, setPackages] = useState<EquipmentPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const { user } = useAuth();

  useEffect(() => {
    const loadBooking = async () => {
      try {
        const [bookingRes, sessionsRes, packagesRes] = await Promise.all([
          api.get(`/bookings/${id}`),
          api.get("/sessions"),
          api.get("/packages")
        ]);

        const booking = bookingRes.data;

        setBookingData({
          sessionId: booking.session._id,
          packageIds: booking.equipmentPackages.map((p: EquipmentPackage) => p._id),
          notes: booking.notes || ""
        });

        setSessions(sessionsRes.data);
        setPackages(packagesRes.data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to load booking"));
      } finally {
        setLoading(false);
      }
    };

    loadBooking();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setBookingData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;

    setBookingData((prev) => {
      const updatedPackages = checked
        ? [...prev.packageIds, value]
        : prev.packageIds.filter((pkgId) => pkgId !== value);

      return { ...prev, packageIds: updatedPackages };
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (!user) {
      alert("You must be logged in");
      return;
    }

    try {
      await api.put(`/bookings/${id}`, {
        session: bookingData.sessionId,
        equipmentPackages: bookingData.packageIds,
        notes: bookingData.notes
      });

      navigate("/bookings");
    } catch (err) {
      const error = err as Error | BookingErrorResponse;

      console.error("Failed to update booking:", error.message);

      const message =
        axios.isAxiosError(error) && error.response?.data?.error
          ? error.response.data.error
          : "Failed to update booking – please try again";

      setError(new Error(message));
    } finally {
      setLoading(false);
    }
  };

  const selectedSession = sessions.find((s) => s._id === bookingData.sessionId);
  const selectedPackages = packages.filter((p) =>
    bookingData.packageIds.includes(p._id)
  );

  const sessionPrice = selectedSession?.price || 0;
  const gearTotal = selectedPackages.reduce(
    (sum, p) => sum + (p.price || 0),
    0
  );
  const totalPrice = sessionPrice + gearTotal;

  if (loading && (!sessions.length || !packages.length)) {
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
      <h1>Edit Booking</h1>

      <form onSubmit={handleSubmit}>

        <div className="formControl">
          <label htmlFor="sessionId">Available Sessions:</label>
          <select
            id="sessionId"
            name="sessionId"
            value={bookingData.sessionId}
            onChange={handleChange}
            required
          >
            <option value="">Choose a session</option>
            {sessions.map((session) => (
              <option key={session._id} value={session._id}>
                {new Date(session.date).toLocaleDateString()} –{" "}
                {session.time} •{" "}
                {session.location.name}, {session.location.address} •{" "}
                Instructor: {session.instructor?.name || "TBD"} •{" "}
                €{session.price}
              </option>
            ))}
          </select>
        </div>

        <div className="formControl">
          <label>Gear Packages (optional):</label>
          {bookingData.sessionId ? (
            <div>
              {packages.map((pkg) => (
                <label key={pkg._id} style={{ display: "block" }}>
                  <input
                    type="checkbox"
                    value={pkg._id}
                    checked={bookingData.packageIds.includes(pkg._id)}
                    onChange={handleGearChange}
                  />
                  {pkg.name} – €{pkg.price}
                </label>
              ))}
            </div>
          ) : (
            <em>Please select a session first</em>
          )}
        </div>

        <div className="formControl">
          <label htmlFor="notes">Notes (optional):</label>
          <textarea
            id="notes"
            name="notes"
            rows={4}
            value={bookingData.notes}
            onChange={handleChange}
          />
        </div>

        <div className="formControl" style={{ fontWeight: "bold" }}>
          {bookingData.sessionId ? (
            <p>Total Price: €{totalPrice}</p>
          ) : (
            <p>Select a session to see total price</p>
          )}
        </div>

        <button type="submit" disabled={!bookingData.sessionId || loading}>
          {loading ? "Updating..." : "Save Changes"}
        </button>
        <button type="button" onClick={() => navigate(-1)}>Cancel</button>
      </form>
    </div>
  );
};

export default BookingEditPage;