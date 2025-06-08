import React, { useState, useEffect, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Edit, Eye, HandCoins, LogOut, Trash } from "lucide-react";
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
import Spinner from "../../components/UI/spinner/Spinner";

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
  console.log(employeesData);

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

  return (
    <>
      <Helmet>
        <title>Employees • Admin Panel</title>
        <meta
          name="description"
          content="Manage employees in the admin panel."
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
              placeholder="Search by employee name"
              value={searchTerm}
              onChange={handleChange}
              required={false}
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
            <p>
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
                      <td data-label="#"> {index + 1} </td>
                      <td data-label="Profile">
                        <img
                          src={
                            emp?.userId?.profile?.url || "/default-profile.png"
                          }
                          alt="Profile"
                          className="profile-image"
                        />
                      </td>
                      <td data-label="Name">{emp.emp_name || "-"}</td>
                      <td data-label="Department">
                        {emp.department?.dep_name || "-"}
                      </td>
                      <td data-label="Created By">{emp.userId?.name || "-"}</td>
                      <td data-label="Actions">
                        <div className="actions-cell">
                          <Button
                            title="Edit"
                            onClick={() =>
                              navigate(
                                `/admin-dashboard/employees/${emp._id}/edit`
                              )
                            }
                            Icon={Edit}
                          />
                          <Button
                            title="View"
                            onClick={() =>
                              navigate(
                                `/admin-dashboard/employees/${emp._id}/view`
                              )
                            }
                            Icon={Eye}
                          />
                          <Button
                            title="Salary"
                            onClick={() =>
                              navigate(
                                `/admin-dashboard/salary/${emp.empId}/history`
                              )
                            }
                            Icon={HandCoins}
                          />
                          <Button
                            title="Leaves"
                            onClick={() =>
                              navigate(
                                `/admin-dashboard/employees/${emp._id}/leaves`
                              )
                            }
                            Icon={LogOut}
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
