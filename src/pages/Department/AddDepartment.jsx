import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import "./AddDepartment.scss";
import InputField from "../../components/UI/Input/InputField";
import Button from "../../components/UI/Button/Button";
import { useAddDepartmentMutation } from "../../services/api";

const AddDepartment = () => {
  const [formData, setFormData] = useState({
    dep_name: "",
    description: "",
  });

  const [addDepartment, { isLoading }] = useAddDepartmentMutation();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.dep_name.trim() || !formData.description.trim()) {
      toast.error("Please fill out all required fields");
      return;
    }

    try {
      await addDepartment(formData).unwrap();
      toast.success("Department added successfully!");
      navigate("/admin-dashboard/departments");
    } catch (err) {
      console.error("Failed to add department:", err);
      toast.error(err?.data?.message || "Failed to add department");
    }
  };

  return (
    <main className="department-page">
      <Helmet>
        <title>Add Department | Employee Management</title>
        <meta
          name="description"
          content="Add a new department to your company through the admin panel."
        />
      </Helmet>

      <section className="department-card">
        <h2 className="department-subtitle">Add Department</h2>

        <form className="department-form" onSubmit={handleSubmit}>
          <InputField
            label="Department Name"
            type="text"
            name="dep_name"
            placeholder="IT"
            value={formData.dep_name}
            onChange={handleChange}
            required
          />

          <InputField
            label="Description"
            type="textarea"
            name="description"
            placeholder="Short description"
            value={formData.description}
            onChange={handleChange}
            required
          />

          <div className="form-actions">
            <Button
              type="submit"
              text={isLoading ? "Submitting..." : "Add Department"}
            />
          </div>
        </form>
      </section>
    </main>
  );
};

export default AddDepartment;
