import React, { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";
import api from "../../api";
import { Link } from "react-router";

import type { Session } from "../../types/types";
import { useAuth } from "../../AuthContext";
import ROLES from "../../config/roles";

const getStatusColors = (status: string) => {
  switch (status) {
    case "available":
      return { bg: "#C8E6C9", color: "#388E3C" };
    case "booked":
      return { bg: "#FFCDD2", color: "#D32F2F" };
    case "completed":
      return { bg: "#BBDEFB", color: "#1976D2" };
    default:
      return { bg: "#E0E0E0", color: "#424242" }; 
  }
}

const SessionsPage: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const { user } = useAuth();

  const getSessionStatusColors = (session: Session) => getStatusColors(session.status);
  
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await api.get("/sessions");
        setSessions(response.data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to load sessions"));
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

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
      <h1>Available Wakeboarding Sessions</h1>

      {user?.role === ROLES.ADMIN && (
        <div style={{ marginBottom: "20px" }}>
          <Link to="/sessions/create">
            <button>Create New Session</button>
          </Link>
        </div>
      )}

      <ul style={{ listStyle: "none", paddingLeft: 0 }}>
          {sessions.length > 0 ? (
              sessions.map((session) => (
                  <li key={session._id}>
                      <Link
                          to={`/sessions/${session._id}`}
                          style={{ fontSize: "1.2rem", display: "block", margin: "10px 0" }}
                        >
                          {new Date(session.date).toLocaleDateString()} – {session.time} •{" "}
                      
                          Location:{" "}
                          {session.location ? `${session.location.name}, ${session.location.address}` : "Unknown"} •{" "}
                      
                          Instructor:{" "}
                          {session.instructor ? session.instructor.name : "Not assigned"} • €
                          {session.price}

                          <span
                            style={{
                              marginLeft: "10px",
                              display: "inline-block",
                              padding: "4px 8px",
                              borderRadius: "4px",
                              fontSize: "0.9rem",
                              backgroundColor: getSessionStatusColors(session).bg,
                              color: getSessionStatusColors(session).color
                            }}
                          >
                            {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                          </span>

                      </Link>
                  </li>
              ))
              ) : (
              <p>No sessions found</p>
          )}
      </ul>
    </div>
  );
};

export default SessionsPage;