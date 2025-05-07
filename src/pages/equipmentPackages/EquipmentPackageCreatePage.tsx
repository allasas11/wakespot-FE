import React, { useState } from "react";
import { useNavigate } from "react-router";
import api from "../../api";
import { BarLoader } from "react-spinners";

import type { EquipmentPackage } from "../../types/types";
import { CATEGORY_LABELS, type CategoryValue } from "../../config/categories";
import { ITEMS_INCLUDED, type ItemIncludedValue } from "../../config/itemsIncluded";

const EquipmentPackageCreatePage: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<Partial<EquipmentPackage>>({
    name: "",
    description: "",
    price: 0,
    itemsIncluded: [],
    category: undefined,
    imageUrl: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "itemsIncluded") {
      return;
    }

    setFormData((prev) => ({
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
  
    setFormData((prev) => {
      const currentItems = prev.itemsIncluded || [];
  
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
      name: formData.name || "",
      description: formData.description || "",
      price: Number(formData.price), 
      itemsIncluded: formData.itemsIncluded || [], 
      category: (formData.category as CategoryValue) || "other", 
      imageUrl: formData.imageUrl || "" 
    };
  
    try {
      await api.post("/packages", payload);
      navigate("/packages");
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to create package"));
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

  return (
    <div>
      <h1>Create New Gear Package</h1>

      <form onSubmit={handleSubmit}>
        <div className="formControl">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name || ""}
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
            value={formData.description || ""}
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
            value={formData.price || ""}
            onChange={handleChange}
            required
          />
        </div>

        <div className="formControl">
          <label htmlFor="category">Category:</label>
          <select
            id="category"
            name="category"
            value={formData.category || ""}
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
                            checked={formData.itemsIncluded?.includes(item)}
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
            value={formData.imageUrl || ""}
            onChange={handleChange}
          />
        </div>

        <button type="submit">Create Package</button>
        <button type="button" onClick={() => navigate(-1)}>Cancel</button>
      </form>
    </div>
  );
};

export default EquipmentPackageCreatePage;