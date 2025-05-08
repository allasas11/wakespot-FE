import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
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

const BookingCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); 
  const [sessions, setSessions] = useState<Session[]>([]);
  const [packages, setPackages] = useState<EquipmentPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const [formData, setFormData] = useState({
    sessionId: "",
    packageIds: [] as string[],
    notes: ""
  });

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [sessionsRes, packagesRes] = await Promise.all([
          api.get("/sessions"),
          api.get("/packages")
        ]);

        setSessions(sessionsRes.data);
        setPackages(packagesRes.data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to load options"));
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;

    setFormData((prev) => {
      const updatedPackages = checked
        ? [...prev.packageIds, value]
        : prev.packageIds.filter((id) => id !== value);

      return { ...prev, packageIds: updatedPackages };
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user) {
      alert("You must be logged in to book");
      return;
    }

    if (!formData.sessionId) {
      alert("Please select a session first");
      return;
    }

    setLoading(true);

    try {
        await api.post("/bookings", {
            session: formData.sessionId,
            equipmentPackages: formData.packageIds,
            notes: formData.notes,
            user: user.id 
            });

      navigate("/bookings");
    } catch (err) {
        const error = err as Error | BookingErrorResponse;

        console.error("Failed to create booking:", error.message);
    
        const message =
          axios.isAxiosError(error) && error.response?.data?.error
            ? error.response.data.error
            : "Failed to book – please try again";
    
        setError(new Error(message));
    } finally {
      setLoading(false);
    }
  };

  const selectedSession = sessions.find((s) => s._id === formData.sessionId);
  const selectedPackages = packages.filter((p) =>
    formData.packageIds.includes(p._id)
  );

  const sessionPrice = selectedSession?.price || 0;
  const gearTotal = selectedPackages.reduce((sum, p) => sum + (p.price || 0), 0);
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
      <h1>Book Wakeboarding Session</h1>

      <form onSubmit={handleSubmit}>

        <div className="formControl">
          <label htmlFor="sessionId">Available Sessions:</label>
          <select
            id="sessionId"
            name="sessionId"
            value={formData.sessionId}
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
          {formData.sessionId ? (
            <div>
              {packages.map((pkg) => (
                <label key={pkg._id} style={{ display: "block" }}>
                  <input
                    type="checkbox"
                    value={pkg._id}
                    checked={formData.packageIds.includes(pkg._id)}
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
            value={formData.notes}
            onChange={handleChange}
          />
        </div>

        <div className="formControl" style={{ fontWeight: "bold" }}>
          {formData.sessionId ? (
            <p>Total Price: €{totalPrice}</p>
          ) : (
            <p>Select a session to see total price</p>
          )}
        </div>

        <button type="submit" disabled={!formData.sessionId || loading}>
          {loading ? "Booking..." : "Confirm Booking"}
        </button>
        <button type="button" onClick={() => navigate(-1)}>Cancel</button>
      </form>
    </div>
  );
};

export default BookingCreatePage;