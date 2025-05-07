import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import api from "../../api";
import { BarLoader } from "react-spinners";

import type { Location } from "../../types/types";

const LocationEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<Omit<Location, '_id'>>({
    name: "",
    address: "",
    description: "",
    imageUrl: ""
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const response = await api.get<Location>(`/locations/${id}`);
        setFormData(response.data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to load location"));
      } finally {
        setLoading(false);
      }
    };

    fetchLocation();
  }, [id]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      await api.put(`/locations/${id}`, formData);
      navigate("/locations");
    } catch (err) {
      console.error("Failed to update location:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <BarLoader color="#646cff" loading={true} />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <h1>Edit Wakeboarding Spot</h1>

      <form onSubmit={handleSubmit}>
        <div className="formControl">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="formControl">
          <label htmlFor="address">Address:</label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>

        <div className="formControl">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            required
          />
        </div>

        <div className="formControl">
          <label htmlFor="imageUrl">Image URL:</label>
          <input
            type="url"
            id="imageUrl"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
          />
        </div>

        <button type="submit">Save Changes</button>
        <button type="button" onClick={() => navigate(-1)}>Cancel</button>
      </form>
    </div>
  );
};

export default LocationEditPage;