import React, { useState, useEffect, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Edit, Eye, HandCoins, LogOut } from "lucide-react";
import toast from "react-hot-toast";

import InputField from "../../components/UI/Input/InputField";
import Button from "../../components/UI/Button/Button";
import Spinner from "../../components/UI/spinner/Spinner";

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

  const {
    data: employeesDataFromApi,
    isLoading,
    isError,
    error,
  } = useGetEmployeesQuery();

  const [deleteEmployee] = useDeleteEmployeeByIdMutation();

  const { employees: employeesData = [] } = useSelector(
    (state) => state.employees
  );

  // Sync API data to Redux
  useEffect(() => {
    if (employeesDataFromApi?.employees?.length) {
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
    const term = searchTerm.toLowerCase();
    return employeesData.filter(
      (emp) =>
        emp.emp_name?.toLowerCase().includes(term) ||
        emp.empId?.toLowerCase().includes(term) ||
        emp.userId?.email?.toLowerCase().includes(term) ||
        emp.department?.dep_name?.toLowerCase().includes(term)
    );
  }, [employeesData, searchTerm]);

  return (
    <>
      <Helmet>
        <title>Employees • Admin Panel</title>
        <meta
          name="description"
          content="Manage employee details, departments, and access in the admin dashboard."
        />
      </Helmet>

      <section className="employee-list">
        <header className="employee-header">
          <div className="employee-actions">
            <h1 className="employee-title">Manage Employees</h1>
            <Button onClick={addEmployee} text="+ Add Employee" />
          </div>
          <div className="search-box">
            <InputField
              type="text"
              label="Search Employees"
              name="employee"
              placeholder="Search by name, ID, department, or email"
              value={searchTerm}
              onChange={handleChange}
            />
          </div>
        </header>

        <div className="employee-content">
          {isLoading ? (
            <div
              className="loader-wrapper"
              role="status"
              aria-live="polite"
              aria-busy="true"
            >
              <Spinner />
              <span className="visually-hidden">Loading Employees...</span>
            </div>
          ) : isError ? (
            <p className="error-message">
              Error loading employees: {error?.data?.message || "Unknown error"}
            </p>
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
                      <td data-label="#">{index + 1}</td>
                      <td data-label="Profile">
                        <img
                          src={
                            emp?.userId?.profile?.url ||
                            "/default-profile.png"
                          }
                          alt={`${emp.emp_name || "Employee"} Profile`}
                          className="profile-image"
                        />
                      </td>
                      <td data-label="Name">{emp.emp_name || "-"}</td>
                      <td data-label="Department">
                        {emp.department?.dep_name || "-"}
                      </td>
                      <td data-label="Created By">
                        {emp.userId?.name || "-"}
                      </td>
                      <td data-label="Actions">
                        <div className="actions-cell">
                          <Button
                            title="Edit"
                            Icon={Edit}
                            onClick={() =>
                              navigate(
                                `/admin-dashboard/employees/${emp._id}/edit`
                              )
                            }
                          />
                          <Button
                            title="View"
                            Icon={Eye}
                            onClick={() =>
                              navigate(
                                `/admin-dashboard/employees/${emp._id}/view`
                              )
                            }
                          />
                          <Button
                            title="Salary History"
                            Icon={HandCoins}
                            onClick={() =>
                              navigate(
                                `/admin-dashboard/salary/${emp.empId}/history`
                              )
                            }
                          />
                          <Button
                            title="Leave Records"
                            Icon={LogOut}
                            onClick={() =>
                              navigate(
                                `/admin-dashboard/employees/${emp._id}/leaves`
                              )
                            }
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
