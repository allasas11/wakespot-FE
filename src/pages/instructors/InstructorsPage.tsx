import React, { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";
import api from "../../api";
import { Link } from "react-router";

import type { Instructor } from "../../types/types";

const InstructorsPage: React.FC = () => {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const { data } = await api.get("/instructors");
        setInstructors(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to load instructors"));
      } finally {
        setLoading(false);
      }
    };

    fetchInstructors();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <BarLoader color="mediumseagreen" loading={true} />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
        <h1>Wakeboarding Instructors</h1>

        <div style={{ marginBottom: '20px' }}>
            <Link to="/instructors/create">
                <button>Create New Instructor</button>
            </Link>
        </div>
 
        <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
            {instructors.map((instructor) => (
                <li key={instructor._id}>
                    <Link to={`/instructors/${instructor._id}`}>
                        {instructor.name} - {instructor.imageUrl && <img src={instructor.imageUrl} alt={instructor.name} style={{ width: '50px', height: '50px', borderRadius: '50%' }} />}
                    </Link>
                </li>
            ))}
        </ul>
    </div>
  );
};

export default InstructorsPage;