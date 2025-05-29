import React, { useState, useEffect, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Edit, Eye, HandCoins, Trash } from "lucide-react";
import toast from "react-hot-toast";

import InputField from "../../components/UI/Input/InputField";
import Button from "../../components/UI/Button/Button";

import {
  useGetEmployeesQuery,
  useDeleteEmployeeByIdMutation,
} from "../../services/api";
import {
  setEmployees,
  removeEmployee,
} from "../../features/employee/employeeSlice";

import "./EmployeeList.scss";

const EmployeeList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch employees from API
  const {
    data: employeesDataFromApi,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetEmployeesQuery();

  const [deleteEmployee] = useDeleteEmployeeByIdMutation();

  const { employees: employeesData = [] } = useSelector(
    (state) => state.employees
  );

  // Sync API data to Redux
  useEffect(() => {
    if (employeesDataFromApi?.employees?.length > 0) {
      dispatch(
        setEmployees({
          employees: employeesDataFromApi.employees,
          message: employeesDataFromApi.message,
          success: employeesDataFromApi.success,
        })
      );
    }
  }, [employeesDataFromApi, dispatch]);

  const handleChange = (e) => setSearchTerm(e.target.value);

  const addEmployee = () => navigate("/admin-dashboard/employees/add");

  const filteredEmployees = useMemo(() => {
    return employeesData.filter((emp) =>
      emp.emp_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [employeesData, searchTerm]);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this employee?"
    );
    if (confirmDelete) {
      try {
        await deleteEmployee(id).unwrap();
        dispatch(removeEmployee(id));
        toast.success("Employee deleted successfully");
        refetch();
      } catch (err) {
        console.error("Delete failed", err);
        toast.error("Failed to delete employee");
      }
    }
  };

  return (
    <>
      <Helmet>
        <title>Employees • Admin Panel</title>
        <meta name="description" content="Manage employees in the admin panel." />
      </Helmet>

      <section className="employee-list">
        <header className="employee-header">
          <h1 className="employee-title">Manage Employees</h1>
          <div className="employee-actions">
            <InputField
              type="text"
              label="Search Employees"
              name="employee"
              placeholder="Search by employee name"
              value={searchTerm}
              onChange={handleChange}
              required={false}
            />
            <Button onClick={addEmployee} text="+ Add Employee" />
          </div>
        </header>

        <div className="employee-content">
          {isLoading ? (
            <p>Loading...</p>
          ) : isError ? (
            <p>Error loading employees: {error?.data?.message || "Unknown error"}</p>
          ) : filteredEmployees.length > 0 ? (
            <div className="table-container">
              <table className="employee-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Profile</th>
                    <th>Name</th>
                    <th>Department</th>
                    <th>Created By</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.map((emp, index) => (
                    <tr key={emp._id}>
                      <td data-label="#"> {index + 1} </td>
                      <td data-label="Profile">
                        <img
                          src={emp?.userId?.profile?.url || "/default-profile.png"}
                          alt="Profile"
                          className="profile-image"
                        />
                      </td>
                      <td data-label="Name">{emp.emp_name || "-"}</td>
                      <td data-label="Department">{emp.department?.dep_name || "-"}</td>
                      <td data-label="Created By">{emp.userId?.name || "-"}</td>
                      <td data-label="Actions">
                        <div className="actions-cell">
                          <Button
                            title="Edit"
                            onClick={() =>
                              navigate(`/admin-dashboard/employees/${emp._id}/edit`)
                            }
                            Icon={Edit}
                          />
                          <Button
                            title="View"
                            onClick={() =>
                              navigate(`/admin-dashboard/employees/${emp._id}/view`)
                            }
                            Icon={Eye}
                          />
                          <Button
                            title="Delete"
                            onClick={() => handleDelete(emp._id)}
                            Icon={Trash}
                          />
                          <Button
                            title="Salary"
                            onClick={() =>
                              navigate(`/admin-dashboard/salary/${emp.empId}/history`)
                            }
                            Icon={HandCoins}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="no-employee-message">No employees found.</p>
          )}
        </div>
      </section>
    </>
  );
};

export default EmployeeList;
