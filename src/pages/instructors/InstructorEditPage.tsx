import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import api from "../../api";
import { BarLoader } from "react-spinners";

import type { Location } from "../../types/types";
import { CERTIFICATIONS } from "../../config/certifications";

const InstructorEditPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    imageUrl: "",
    specialty: "",
    yearsOfExperience: 0,
    certifications: [] as string[],
    activeLocations: [] as string[]
  });

  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [instructorRes, locationsRes] = await Promise.all([
          api.get(`/instructors/${id}`),
          api.get("/locations")
        ]);

        const instructor = instructorRes.data;
        const locationList = locationsRes.data;

        setFormData({
          name: instructor.name || "",
          bio: instructor.bio || "",
          imageUrl: instructor.imageUrl || "",
          specialty: instructor.specialty || "",
          yearsOfExperience: instructor.yearsOfExperience || 0,
          certifications: instructor.certifications || [],
          activeLocations: instructor.activeLocations.map((loc: Location) => loc._id) || []
        });

        setLocations(locationList);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to load data"));
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "certifications" || name === "activeLocations") {
      return; // handled separately
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCertificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;

    setFormData((prev) => {
      const updatedCerts = checked
        ? [...prev.certifications, value]
        : prev.certifications.filter((cert) => cert !== value);

      return { ...prev, certifications: updatedCerts };
    });
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;

    setFormData((prev) => {
      const updatedLocations = checked
        ? [...prev.activeLocations, value]
        : prev.activeLocations.filter((locId) => locId !== value);

      return { ...prev, activeLocations: updatedLocations };
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.put(`/instructors/${id}`, formData);
      navigate("/instructors");
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Error updating instructor:", err.message);
        alert(`Update failed: ${err.message}`);
      } else {
        console.error("Unexpected error:", err);
        alert("Update failed due to an unexpected error.");
      }
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
      <h1>Edit Wakeboarding Instructor</h1>

      <form onSubmit={handleSubmit}>
        <div className="formControl">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="formControl">
          <label htmlFor="bio">Bio:</label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows={4}
            required
          />
        </div>

        <div className="formControl">
          <label htmlFor="imageUrl">Image URL:</label>
          <input
            type="url"
            id="imageUrl"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
          />
        </div>

        <div className="formControl">
          <label htmlFor="specialty">Specialty:</label>
          <select
            id="specialty"
            name="specialty"
            value={formData.specialty}
            onChange={handleChange}
            required
          >
            <option value="">Select specialty</option>
            <option value="BEGINNER">Beginner</option>
            <option value="INTERMEDIATE">Intermediate</option>
            <option value="ADVANCED">Advanced</option>
          </select>
        </div>

        <div className="formControl">
          <label htmlFor="yearsOfExperience">Years of Experience:</label>
          <input
            type="number"
            id="yearsOfExperience"
            name="yearsOfExperience"
            value={formData.yearsOfExperience || ""}
            onChange={handleChange}
            min="0"
            max="50"
          />
        </div>

        <div className="formControl">
          <label>Certifications:</label>
          <div>
            {Object.values(CERTIFICATIONS).map((cert) => (
              <label key={cert} style={{ display: "block" }}>
                <input
                  type="checkbox"
                  value={cert}
                  checked={formData.certifications.includes(cert)}
                  onChange={handleCertificationChange}
                />
                {cert}
              </label>
            ))}
          </div>
        </div>

        <div className="formControl">
          <label>Active Locations:</label>
          <div>
            {locations.map((location) => (
              <label key={location._id} style={{ display: "block" }}>
                <input
                  type="checkbox"
                  value={location._id}
                  checked={formData.activeLocations.includes(location._id)}
                  onChange={handleLocationChange}
                />
                {location.name} – {location.address}
              </label>
            ))}
          </div>
        </div>

        <button type="submit">Save Changes</button>
        <button type="button" onClick={() => navigate(-1)}>Cancel</button>
      </form>
    </div>
  );
};

export default InstructorEditPage;