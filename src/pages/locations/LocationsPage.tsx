import React, { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";
import api from "../../api";
import { Link } from "react-router";

import type { Location } from "../../types/types";
import { useAuth } from "../../AuthContext";
import ROLES from "../../config/roles";

const LocationsPage: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const { user } = useAuth();

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const { data } = await api.get("/locations");
        setLocations(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("An unknown error occurred"));
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

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

  if (locations.length === 0) {
    return <div>No wakeboarding spots found</div>;
  }

  return (
    <div>
      <h1>Wakeboarding Spots</h1>

      {user?.role === ROLES.ADMIN && (
        <div style={{ marginBottom: '20px' }}>
          <Link to="/locations/create">
            <button>Create New Location</button>
          </Link>
      </div>
      )}

      <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
        {locations.map((location) => (
          <li key={location._id}>
            <Link to={`/locations/${location._id}`} >
                {location.name} 
                {location.imageUrl && (
                    <div style={{ marginBottom: '20px' }}>
                    <img src={location.imageUrl} alt={location.name} style={{ width: '150px', borderRadius: '6px' }} />
                    </div>
                )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LocationsPage;