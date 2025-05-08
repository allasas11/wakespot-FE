import React, { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";
import api from "../../api";
import { Link } from "react-router";

import type { EquipmentPackage } from "../../types/types";
import { useAuth } from "../../AuthContext";
import ROLES from "../../config/roles";

const EquipmentPackagesPage: React.FC = () => {
  const [packages, setPackages] = useState<EquipmentPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const { user } = useAuth();
  
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await api.get("/packages");
        setPackages(response.data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to load packages"));
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
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
      <h1>Equipment Packages</h1>

      {user?.role === ROLES.ADMIN && (
        <div style={{ marginBottom: "20px" }}>
          <Link to="/packages/create">
            <button>Create New Package</button>
          </Link>
        </div>
      )}

      <ul style={{ listStyle: "none", paddingLeft: 0 }}>
        {packages.map((pkg) => (
          <li key={pkg._id} style={{ marginBottom: "20px", borderBottom: "1px solid #ddd", paddingBottom: "10px" }}>
            <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>

              <div style={{ width: "80px", height: "80px", flexShrink: 0 }}>
                {pkg.imageUrl ? (
                  <img
                    src={pkg.imageUrl}
                    alt={pkg.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "8px"
                    }}
                  />
                ) : (
                  <div style={{
                    width: "100%",
                    height: "100%",
                    backgroundColor: "#f0f0f0",
                    borderRadius: "8px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: "12px",
                    color: "#999"
                  }}>
                    No image
                  </div>
                )}
              </div>

              <div>
                <Link
                  to={`/packages/${pkg._id}`}
                  style={{ fontSize: "1.2rem", fontWeight: "bold", display: "block", margin: "10px 0" }}
                >
                  {pkg.name}
                </Link>
                <p style={{ margin: "0 0 10px 0" }}>
                  <strong>€{pkg.price}</strong> – {pkg.description || "No description"}
                </p>
                <p style={{ margin: "0", fontSize: "0.9rem" }}>
                  Includes: {pkg.itemsIncluded.join(", ")}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EquipmentPackagesPage;