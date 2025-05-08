import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { BarLoader } from "react-spinners";
import api from "../../api";

import type { Instructor } from "../../types/types";
import { useAuth } from "../../AuthContext";
import ROLES from "../../config/roles";

const InstructorPage: React.FC = () => {
  const [instructor, setInstructor] = useState<Instructor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const { user } = useAuth();
  
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInstructor = async () => {
      try {
        const response = await api.get<Instructor>(`/instructors/${id}`);
        setInstructor(response.data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to load instructor"));
      } finally {
        setLoading(false);
      }
    };

    fetchInstructor();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this instructor?")) return;

    try {
      await api.delete(`/instructors/${id}`);
      navigate("/instructors");
    } catch (err) {
      console.error("Error deleting instructor:", err);
    }
  };

  const handleEdit = () => {
    navigate(`/instructors/edit/${id}`);
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

  if (!instructor) {
    return <div>No instructor found</div>;
  }

  return (
    <div>
        <h1>{instructor.name}</h1>

        <p><strong>Bio:</strong> {instructor.bio}</p>

        <p><strong>Specialty:</strong> {instructor.specialty}</p>

        <p><strong>Years of Experience:</strong> {instructor.yearsOfExperience || 'N/A'}</p>

        <p><strong>Certifications:</strong></p>

        <ul>
            {instructor.certifications.length > 0 ? (
            instructor.certifications.map((cert, index) => <li key={index}>{cert}</li>)
            ) : (
            <li>No certifications listed</li>
            )}
        </ul>


        <p><strong>Active Locations:</strong></p>
        <ul>
            {instructor.activeLocations && instructor.activeLocations.length > 0 ? (
                instructor.activeLocations.map((location) => (
                    <li key={location._id}>
                        <Link to={`/locations/${location._id}`}>
                            {location.name} – {location.address}
                        </Link>
                    </li>
            ))
            ) : (
                <li>No active locations</li>
            )}
        </ul>

        {instructor.imageUrl && (
            <div style={{ marginBottom: '20px' }}>
            <img src={instructor.imageUrl} alt={instructor.name} style={{ width: '300px', borderRadius: '8px' }} />
            </div>
        )}

        {user?.role === ROLES.ADMIN && (
          <div>
            <button onClick={handleEdit}>Edit Instructor</button>
            <button onClick={handleDelete}>Delete Instructor</button>
          </div>
        )}

        <div style={{ marginTop: '20px' }}>
            <button onClick={() => navigate(-1)}>Back</button>
        </div>
    </div>
  );
};

export default InstructorPage;