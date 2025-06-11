import React, { useState, useEffect, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useGetDepartmentsQuery, useDeleteDepartmentByIdMutation } from "../../services/api";

import { Edit, Eye, Trash } from "lucide-react";
import InputField from "../../components/UI/Input/InputField";
import Button from "../../components/UI/Button/Button";
import { setDepartments } from "../../features/department/departmentSlice";
import toast from "react-hot-toast";

import "./DepartmentList.scss";
import Spinner from "../../components/UI/spinner/Spinner";

const DepartmentList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [searchTerm, setSearchTerm] = useState("");
  const { data, isLoading, error, refetch } = useGetDepartmentsQuery();
  const [deleteDepartment] = useDeleteDepartmentByIdMutation();
  const { dept } = useSelector((state) => state.departments);

  const departments = useMemo(() => data?.departments || [], [data]);

  useEffect(() => {
    if (departments.length > 0) {
      dispatch(setDepartments(departments));
    }
  }, [departments, dispatch]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  const filteredDepartments = dept.filter((dep) =>
    dep.dep_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this department?")) {
      try {
        await deleteDepartment(id).unwrap();
        toast.success("Department deleted successfully");
        refetch();
      } catch (err) {
        console.error("Delete failed", err);
        toast.error("Failed to delete department");
      }
    }
  };

  const handleAdd = () => navigate("/admin-dashboard/departments/add");

  return (
    <>
      <Helmet>
        <title>Manage Departments • Admin Panel</title>
        <meta
          name="description"
          content="Easily manage, search, add, and delete departments from the admin dashboard."
        />
      </Helmet>

      <section className="department-list">
        <header className="department-header">
          <div className="department-actions">
            <h1 className="department-title">Manage Departments</h1>
            <Button onClick={handleAdd} text="+ Add Department" />
          </div>

          <div className="search-box">
            <InputField
              type="text"
              label="Search Departments"
              name="search"
              placeholder="Search by department name"
              value={searchTerm}
              onChange={handleSearchChange}
              required={false}
            />
          </div>
        </header>

        <div className="department-content">
          {isLoading ? (
            <Spinner />
          ) : error ? (
            <p role="alert">Failed to load departments. Please try again.</p>
          ) : filteredDepartments.length === 0 ? (
            <p className="no-department-message">No departments found.</p>
          ) : (
            <div className="table-container">
              <table className="department-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Department Name</th>
                    <th>Created By</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDepartments.map((dep, index) => (
                    <tr key={dep._id}>
                      <td data-label="#">{index + 1}</td>
                      <td data-label="Department Name">{dep.dep_name}</td>
                      <td data-label="Created By">{dep.created_by?.name || "-"}</td>
                      <td data-label="Actions">
                        <div className="actions-cell">
                          <Button
                            title="Edit Department"
                            onClick={() =>
                              navigate(`/admin-dashboard/departments/${dep._id}/edit`)
                            }
                            Icon={Edit}
                          />
                          <Button
                            title="View Department"
                            onClick={() =>
                              navigate(`/admin-dashboard/departments/${dep._id}/view`)
                            }
                            Icon={Eye}
                          />
                          <Button
                            title="Delete Department"
                            onClick={() => handleDelete(dep._id)}
                            Icon={Trash}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default DepartmentList;
