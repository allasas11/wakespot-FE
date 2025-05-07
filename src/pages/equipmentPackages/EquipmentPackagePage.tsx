import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { BarLoader } from "react-spinners";
import api from "../../api";

import type { EquipmentPackage } from "../../types/types";

const EquipmentPackagePage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [pkg, setPackage] = useState<EquipmentPackage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const response = await api.get(`/packages/${id}`);
        setPackage(response.data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to load package"));
      } finally {
        setLoading(false);
      }
    };

    fetchPackage();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this package?")) return;

    try {
      await api.delete(`/packages/${id}`);
      navigate("/packages");
    } catch (err) {
      console.error("Error deleting package:", err);
    }
  };

  const handleEdit = () => {
    navigate(`/packages/edit/${id}`);
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

  if (!pkg) {
    return <div>No package found</div>;
  }

  return (
    <div>
        <h1>{pkg.name}</h1>

        <p><strong>Description:</strong> {pkg.description || "No description provided"}</p>
        <p><strong>Price:</strong>€{pkg.price}</p>
        <p><strong>Category:</strong> {pkg.category}</p>

        <p><strong>Items Included:</strong></p>
        <ul>
            {pkg.itemsIncluded.length > 0 ? (
            pkg.itemsIncluded.map((item, index) => <li key={index}>{item}</li>)
            ) : (
            <li>No items listed</li>
            )}
        </ul>

        {pkg.imageUrl && (
            <div style={{ marginBottom: "20px" }}>
            <img src={pkg.imageUrl} alt={pkg.name} style={{ width: "300px", borderRadius: "8px" }} />
            </div>
        )}

        <div>
          <button onClick={handleEdit}>Edit Package</button>
          <button onClick={handleDelete}>Delete Package</button>
        </div>

        <div style={{ marginTop: "20px" }}>
            <button onClick={() => navigate(-1)}>Back</button>
        </div>
    </div>
  );
};

export default EquipmentPackagePage;