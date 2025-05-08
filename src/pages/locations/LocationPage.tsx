import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { BarLoader } from "react-spinners";
import api from "../../api";

import type { Location } from "../../types/types";
import { useAuth } from "../../AuthContext";
import ROLES from "../../config/roles";

const LocationPage: React.FC = () => {
  const [location, setLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { user } = useAuth();

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const { data } = await api.get<Location>(`/locations/${id}`);
        setLocation(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("An unknown error occurred"));
      } finally {
        setLoading(false);
      }
    };

    fetchLocation();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this location?")) return;

    try {
      await api.delete(`/locations/${id}`);
      navigate("/locations");
    } catch (err) {
      console.error("Failed to delete location:", err);
    }
  };

  const handleEdit = () => {
    navigate(`/locations/edit/${id}`);
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

  if (!location) {
    return <div>No location found</div>;
  }

  return (
    <div>
        <h1>{location.name}</h1>

        <p><strong>Address:</strong> {location.address}</p>
        <p><strong>Description:</strong> {location.description}</p>

        {location.imageUrl && (
            <div style={{ marginBottom: '20px' }}>
            <img src={location.imageUrl} alt={location.name} style={{ width: '300px', borderRadius: '8px' }} />
            </div>
        )}

        {user?.role === ROLES.ADMIN && (
          <div>
            <button onClick={handleEdit}>Edit Location</button>
            <button onClick={handleDelete}>Delete Location</button>
          </div>
        )}

        <div style={{ marginTop: '20px' }}>
            <button onClick={() => navigate(-1)}>Back</button>
        </div>

    </div>
  );
};

export default LocationPage;