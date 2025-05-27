import React, { useState, useEffect, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  useGetDepartmentsQuery,
  useDeleteDepartmentByIdMutation,
} from "../../services/api";
import { Edit, Eye, Trash } from "lucide-react";

import InputField from "../../components/UI/Input/InputField";
import Button from "../../components/UI/Button/Button";
import { setDepartments } from "../../features/department/departmentSlice";
import toast from "react-hot-toast";

import "./DepartmentList.scss";

const DepartmentList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [searchTerm, setSearchTerm] = useState("");
  const { data, isLoading, error, refetch } = useGetDepartmentsQuery();
  const [deleteDepartment] = useDeleteDepartmentByIdMutation();

  const departments = useMemo(() => data?.departments || [], [data]);
  const { dept } = useSelector((state) => state.departments);

  useEffect(() => {
    if (departments.length > 0) {
      dispatch(setDepartments(departments));
    }
  }, [departments, dispatch]);



  const handleChange = (e) => setSearchTerm(e.target.value);
  const addDepartment = () => navigate("/admin-dashboard/departments/add");

  const filteredDepartments = dept.filter((dep) =>
    dep.dep_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this department?"
    );
    if (confirmDelete) {
      try {
        await deleteDepartment(id).unwrap();
        toast.success("Department deleted successfully");
        refetch(); // ✅ Refetch after deletion
      } catch (err) {
        console.error("Delete failed", err);
        toast.error("Failed to delete department");
      }
    }
  };

  useEffect(() =>{
    refetch()
  }, [refetch])

  return (
    <>
      <Helmet>
        <title>Departments • Admin Panel</title>
        <meta
          name="description"
          content="Manage departments: search, view, and add new departments in the admin panel."
        />
      </Helmet>

      <section className="department-list">
        <header className="department-header">
          <h1 className="department-title">Manage Departments</h1>
          <div className="department-actions">
            <InputField
              type="text"
              label="Search Departments"
              name="department"
              placeholder="Search by department name"
              value={searchTerm}
              onChange={handleChange}
              required={false}
            />
            <Button onClick={addDepartment} text="+ Add Department" />
          </div>
        </header>

        <div className="department-content">
          {isLoading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>Error loading departments</p>
          ) : filteredDepartments.length > 0 ? (
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
                      <td data-label="#"> {index + 1} </td>
                      <td data-label="Department Name"> {dep.dep_name} </td>
                      <td data-label="Created By">
                        {dep.created_by?.name || "-"}
                      </td>
                      <td data-label="Actions">
                        <div className="actions-cell">
                          <Button
                            title="Edit"
                            onClick={() =>
                              navigate(
                                `/admin-dashboard/departments/${dep._id}/edit`
                              )
                            }
                            Icon={Edit}
                          />
                          <Button
                            title="View"
                            onClick={() =>
                              navigate(
                                `/admin-dashboard/departments/${dep._id}/view`
                              )
                            }
                            Icon={Eye}
                          />
                          <Button
                            title="Delete"
                            Icon={Trash}
                            onClick={() => handleDelete(dep._id)}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="no-department-message">No departments found.</p>
          )}
        </div>
      </section>
    </>
  );
};

export default DepartmentList;
