import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import api from "../../api";
import { BarLoader } from "react-spinners";

import type { Session } from "../../types/types";
import { useAuth } from "../../AuthContext";
import ROLES from "../../config/roles";

const SessionPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const { user } = useAuth();
  
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await api.get(`/sessions/${id}`);
        setSession(response.data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to load session"));
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this session?")) return;

    try {
      await api.delete(`/sessions/${id}`);
      navigate("/sessions");
    } catch (err) {
      console.error("Error deleting session:", err);
    }
  };

  const handleEdit = () => {
    navigate(`/sessions/edit/${id}`);
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

  if (!session) {
    return <div>No session found</div>;
  }

  return (
    <div>
        <h1>Wakeboarding Session Details</h1>

        <p><strong>Date:</strong> {new Date(session.date).toLocaleDateString()}</p>
        <p><strong>Time:</strong> {session.time}</p>
        <p><strong>Duration:</strong> {session.durationMinutes} minutes</p>
        <p><strong>Price:</strong> €{session.price}</p>
        <p><strong>Status:</strong> {session.status}</p>

        <p>
            <strong>Location:</strong>{" "}
            {session.location ? `${session.location.name}, ${session.location.address}` : "Unknown"}
        </p>

        <p>
            <strong>Instructor:</strong>{" "}
            {session.instructor ? session.instructor.name : "Not assigned"}
        </p>

        {user?.role === ROLES.ADMIN && (
          <div>
            <button onClick={handleEdit}>Edit Session</button>
            <button onClick={handleDelete}>Delete Session</button>
          </div>
        )}

        <div style={{ marginTop: "20px" }}>
            <button type="button" onClick={() => navigate(-1)}>Back</button>
        </div>
    </div>
  );
};

export default SessionPage;