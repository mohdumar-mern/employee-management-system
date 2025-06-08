import React, { useState, useEffect, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { useGetLeaveHistoryQuery } from "../../../services/api";

import InputField from "../../../components/UI/Input/InputField";
import Button from "../../../components/UI/Button/Button";

import "./EmployeeLeaveList.scss";

const EmployeeLeaveList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: leaveHistory,
    isLoading,
    isError,
    error,
  } = useGetLeaveHistoryQuery();

  const filteredLeaves = useMemo(() => {
    if (!leaveHistory?.data) return [];
    return leaveHistory.data.filter((leave) =>
      leave.employeeId?.emp_name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }, [leaveHistory, searchTerm]);

  useEffect(() => {
    if (isError) {
      console.error("Error fetching leave history:", error);
    }
  }, [isError, error]);

  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  const handleAddLeave = () => navigate("/employee-dashboard/leave/add");

  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString() : "-";

  return (
    <>
      <Helmet>
        <title>Leave Management • Admin Panel</title>
        <meta name="description" content="Manage employee leaves." />
      </Helmet>

      <section className="leave-list">
        <header className="leave-header">
          <h1 className="leave-title">Manage Leaves</h1>
          <div className="leave-actions">
            <InputField
              type="text"
              label="Search Leaves"
              name="search"
              placeholder="Search by employee name"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <Button onClick={handleAddLeave} text="+ Add Leave" />
          </div>
        </header>

        <div className="leave-content">
          {isLoading ? (
            <p className="loading-text">Loading leave records...</p>
          ) : isError ? (
            <p className="error-text">
              Failed to load leave history:{" "}
              {error?.data?.message || "Unknown error"}
            </p>
          ) : filteredLeaves.length > 0 ? (
            <div className="table-wrapper">
              <table className="leave-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Emp ID</th>
                    <th>Leave Type</th>
                    <th>From</th>
                    <th>To</th>
                    <th>Description</th>
                    <th>Applied Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeaves.map((leave, index) => (
                    <tr key={leave._id}>
                      <td>{index + 1}</td>
                      <td>{leave.employeeId?.empId || "-"}</td>
                      <td>{leave.leaveType || "-"}</td>
                      <td>{formatDate(leave.startDate)}</td>
                      <td>{formatDate(leave.endDate)}</td>
                      <td>{leave.description || "-"}</td>
                      <td>{formatDate(leave.createdAt)}</td>
                      <td>{leave.status || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="no-records">No leave records found.</p>
          )}
        </div>
      </section>
    </>
  );
};

export default EmployeeLeaveList;
