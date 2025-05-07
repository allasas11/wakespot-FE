import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import api from "../../api";
import { BarLoader } from "react-spinners";

import type { EquipmentPackage } from "../../types/types";
import { CATEGORY_LABELS, type CategoryValue } from "../../config/categories";
import { ITEMS_INCLUDED, type ItemIncludedValue } from "../../config/itemsIncluded";

const EquipmentPackageEditPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [pkg, setPackage] = useState<Partial<EquipmentPackage> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const response = await api.get(`/packages/${id}`);
        const data = response.data;

        setPackage({
          name: data.name,
          description: data.description,
          price: data.price,
          itemsIncluded: data.itemsIncluded || [],
          category: data.category,
          imageUrl: data.imageUrl
        });
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to load package"));
      } finally {
        setLoading(false);
      }
    };

    fetchPackage();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "itemsIncluded") {
      return; 
    }

    setPackage((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleItemsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    const itemValue = value as ItemIncludedValue;

    if (!Object.values(ITEMS_INCLUDED).includes(itemValue)) {
      return;
    }

    setPackage((prev) => {
      const currentItems = prev?.itemsIncluded || [];

      const updatedItems = checked
        ? [...currentItems, itemValue]
        : currentItems.filter((item) => item !== itemValue);

      return { ...prev, itemsIncluded: updatedItems };
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      name: pkg?.name || "",
      description: pkg?.description || "",
      price: Number(pkg?.price),
      itemsIncluded: pkg?.itemsIncluded || [],
      category: (pkg?.category as CategoryValue) || "other",
      imageUrl: pkg?.imageUrl || ""
    };

    try {
      await api.put(`/packages/${id}`, payload);
      navigate("/packages");
    } catch (err) {
      console.error("Error updating package:", err);
      setError(err instanceof Error ? err : new Error("Failed to update package"));
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

  if (!pkg) {
    return <div>No package found</div>;
  }

  return (
    <div>
      <h1>Edit Gear Package</h1>

      <form onSubmit={handleSubmit}>
        <div className="formControl">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={pkg.name || ""}
            onChange={handleChange}
            required
          />
        </div>

        <div className="formControl">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            rows={4}
            value={pkg.description || ""}
            onChange={handleChange}
          />
        </div>

        <div className="formControl">
          <label htmlFor="price">Price ($):</label>
          <input
            type="number"
            id="price"
            name="price"
            min="0"
            step="0.01"
            value={pkg.price || ""}
            onChange={handleChange}
            required
          />
        </div>

        <div className="formControl">
          <label htmlFor="category">Category:</label>
          <select
            id="category"
            name="category"
            value={pkg.category || ""}
            onChange={handleChange}
            required
          >
            <option value="">Select category</option>
            {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="formControl">
          <label>Items Included:</label>
          <div>
            {Object.values(ITEMS_INCLUDED).map((item) => (
              <label key={item} style={{ display: "block" }}>
                <input
                  type="checkbox"
                  value={item}
                  checked={pkg?.itemsIncluded?.includes(item) || false}
                  onChange={handleItemsChange}
                />
                {item}
              </label>
            ))}
          </div>
        </div>

        <div className="formControl">
          <label htmlFor="imageUrl">Image URL:</label>
          <input
            type="url"
            id="imageUrl"
            name="imageUrl"
            value={pkg.imageUrl || ""}
            onChange={handleChange}
          />
        </div>

        <button type="submit">Save Changes</button>
        <button type="button" onClick={() => navigate(-1)}>Cancel</button>
      </form>
    </div>
  );
};

export default EquipmentPackageEditPage;