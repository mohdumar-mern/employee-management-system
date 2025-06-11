import React, { useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { Eye } from "lucide-react";

import InputField from "../../components/UI/Input/InputField";
import Button from "../../components/UI/Button/Button";
import { useGetAdminAllLeavesQuery } from "../../services/api";

import "../Employee/EmployeeList.scss";

const AdminLeaveList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: leaveData,
    isLoading,
    isError,
    error,
  } = useGetAdminAllLeavesQuery();

  const leave = leaveData?.data || [];

  const handleChange = (e) => setSearchTerm(e.target.value);

  const filteredLeaves = useMemo(() => {
    const lowerSearch = searchTerm.toLowerCase();
    return leave.filter((lea) => {
      const emp = lea.employeeId || {};
      return (
        emp.emp_name?.toLowerCase().includes(lowerSearch) ||
        emp.department?.dep_name?.toLowerCase().includes(lowerSearch) ||
        lea.leaveType?.toLowerCase().includes(lowerSearch) ||
        lea.status?.toLowerCase().includes(lowerSearch)
      );
    });
  }, [leave, searchTerm]);

  const calculateDays = (start, end) => {
    if (!start || !end) return "-";
    const diff = (new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24);
    return `${Math.ceil(diff) + 1}`;
  };

  return (
    <>
      <Helmet>
        <title>Manage Leaves • Admin Panel</title>
        <meta
          name="description"
          content="Admin panel to manage and review employee leave applications including department, type, duration, and status."
        />
      </Helmet>

      <section className="employee-list">
        <header className="employee-header">
          <div className="employee-actions">
            <h1 className="employee-title">Manage Employee Leaves</h1>
          </div>
          <div className="search-box">
            <InputField
              type="text"
              label="Search Leaves"
              name="leave"
              placeholder="Search by employee name, ID, department, type or status"
              value={searchTerm}
              onChange={handleChange}
            />
          </div>
        </header>

        <div className="employee-content">
          {isLoading ? (
            <p>Loading leave records...</p>
          ) : isError ? (
            <p className="error-message">
              Error loading leaves: {error?.data?.message || "Unknown error"}
            </p>
          ) : filteredLeaves.length > 0 ? (
            <div className="table-container">
              <table className="employee-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Leave Type</th>
                    <th>Department</th>
                    <th>Days</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeaves.map((lea, index) => {
                    const emp = lea.employeeId || {};
                    return (
                      <tr key={lea._id}>
                        <td data-label="#">{index + 1}</td>
                        <td data-label="Name">{emp.emp_name || "-"}</td>
                        <td data-label="Leave Type">{lea.leaveType || "-"}</td>
                        <td data-label="Department">
                          {emp.department?.dep_name || "-"}
                        </td>
                        <td data-label="Days">
                          {calculateDays(lea.startDate, lea.endDate)}
                        </td>
                        <td data-label="Status">{lea.status || "-"}</td>
                        <td data-label="Action">
                          <div className="actions-cell">
                            <Button
                              title="View Leave"
                              Icon={Eye}
                              onClick={() =>
                                navigate(
                                  `/admin-dashboard/leave/${lea._id}/view`
                                )
                              }
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="no-employee-message">No leave records found.</p>
          )}
        </div>
      </section>
    </>
  );
};

export default AdminLeaveList;
