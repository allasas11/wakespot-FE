import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import api from "../../api";
import { BarLoader } from "react-spinners";

import type { Location } from "../../types/types";
import type { Instructor } from "../../types/types";

const SessionEditPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [locations, setLocations] = useState<Location[]>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [formData, setFormData] = useState({
    location: "",
    instructor: "", 
    date: "",
    time: "",
    durationMinutes: 10,
    price: 0,
    status: "available"
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [sessionRes, locationsRes, instructorsRes] = await Promise.all([
          api.get(`/sessions/${id}`),
          api.get("/locations"),
          api.get("/instructors")
        ]);

        const session = sessionRes.data;

        setFormData({
          location: session.location._id,
          instructor: session.instructor?._id || "", 
          date: new Date(session.date).toISOString().split("T")[0],
          time: session.time,
          durationMinutes: session.durationMinutes,
          price: session.price,
          status: session.status
        });

        setLocations(locationsRes.data);
        setInstructors(instructorsRes.data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to load data"));
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      location: formData.location,
      date: formData.date,
      time: formData.time,
      durationMinutes: Number(formData.durationMinutes),
      price: Number(formData.price),
      status: formData.status,
      ...(formData.instructor && { instructor: formData.instructor })
    };

    try {
      await api.put(`/sessions/${id}`, payload);
      navigate("/sessions");
    } catch (err) {
      console.error("Error updating session:", err);
      setError(err instanceof Error ? err : new Error("Failed to update session"));
    } finally {
      setLoading(false);
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
      <h1>Edit Wakeboarding Session</h1>

      <form onSubmit={handleSubmit}>

        <div className="formControl">
          <label htmlFor="location">Location:</label>
          <select
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
          >
            <option value="">Select location</option>
            {locations.map((loc) => (
              <option key={loc._id} value={loc._id}>
                {loc.name}, {loc.address}
              </option>
            ))}
          </select>
        </div>

        <div className="formControl">
          <label htmlFor="instructor">Instructor:</label>
          <select
            id="instructor"
            name="instructor"
            value={formData.instructor || ""}
            onChange={handleChange}
          >
            <option value="">Not assigned</option>
            {instructors.map((inst) => (
              <option key={inst._id} value={inst._id}>
                {inst.name}
              </option>
            ))}
          </select>
        </div>

        <div className="formControl">
          <label htmlFor="date">Date:</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="formControl">
          <label htmlFor="time">Time:</label>
          <input
            type="time"
            id="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
          />
        </div>

        <div className="formControl">
          <label htmlFor="durationMinutes">Duration (minutes):</label>
          <select
            id="durationMinutes"
            name="durationMinutes"
            value={formData.durationMinutes}
            onChange={handleChange}
            required
          >
            <option value="10">10 minutes</option>
            <option value="30">30 minutes</option>
            <option value="60">60 minutes</option>
          </select>
        </div>

        <div className="formControl">
          <label htmlFor="price">Price (€):</label>
          <input
            type="number"
            id="price"
            name="price"
            min="0"
            step="0.01"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>

        <div className="formControl">
          <label htmlFor="status">Status:</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
          >
            <option value="available">Available</option>
            <option value="booked">Booked</option>
          </select>
        </div>

        <button type="submit">Save Changes</button>
        <button type="button" onClick={() => navigate(-1)}>Cancel</button>
      </form>
    </div>
  );
};

export default SessionEditPage;