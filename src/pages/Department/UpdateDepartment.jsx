import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import "./UpdateDepartment.scss";
import InputField from "../../components/UI/Input/InputField";
import Button from "../../components/UI/Button/Button";
import {
  useUpdateDepartmentByIdMutation,
  useGetDepartmentByIdQuery,
} from "../../services/api";

const UpdateDepartment = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    dep_name: "",
    description: "",
  });

  // Fetch existing department data
  const {
    data: departmentData,
    isLoading: isFetching,
    error: fetchError,
  } = useGetDepartmentByIdQuery(id);

  const [updateDepartment, { isLoading: isUpdating }] = useUpdateDepartmentByIdMutation();

  useEffect(() => {
    if (departmentData) {
      setFormData({
        dep_name: departmentData.department.dep_name || "",
        description: departmentData.department.description || "",
      });
    }
  }, [departmentData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.dep_name.trim() || !formData.description.trim()) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      await updateDepartment({ id, payload: formData }).unwrap();
      toast.success("Department updated successfully!");
      navigate("/admin-dashboard/departments", {
        state: { updated: true },
      });
    } catch (err) {
      console.error("Failed to update department:", err);
      toast.error(err?.data?.message || "Failed to update department");
    }
  };

  return (
    <main className="uppdate-department-page">
      <Helmet>
        <title>Update Department | Employee Management</title>
        <meta
          name="description"
          content="Edit an existing department in your company through the admin panel."
        />
      </Helmet>

      <section className="update-department-card">
        <h2 className="update-department-subtitle">Edit Department</h2>

        {isFetching ? (
          <p>Loading department details...</p>
        ) : fetchError ? (
          <p>Error loading department data</p>
        ) : (
          <form className="update-department-form" onSubmit={handleSubmit}>
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
                text={isUpdating ? "Updating..." : "Update Department"}
              />
            </div>
          </form>
        )}
      </section>
    </main>
  );
};

export default UpdateDepartment;
