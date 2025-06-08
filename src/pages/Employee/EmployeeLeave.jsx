// src/pages/Emp Dashboard/EmployeeLeave/EmployeeLeave.jsx
import React, { useState, useEffect, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";

import { useGetEmployeeLeavesByEmployeeIdQuery } from "../../services/api";
import InputField from "../../components/UI/Input/InputField";
import "./EmployeeLeave.scss";

const EmployeeLeave = () => {
  const { id } = useParams();
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: leaveHistory,
    isLoading,
    isError,
    error,
  } = useGetEmployeeLeavesByEmployeeIdQuery(id, {
    refetchOnMountOrArgChange: true,
  });

  // Handle error side effect
  useEffect(() => {
    if (isError) {
      console.error("Error fetching leave history:", error);
    }
  }, [isError, error]);

  // Filter leaves by empName, empId, leaveType, or status
  const filteredLeaves = useMemo(() => {
    if (!leaveHistory?.data) return [];
    const lowerSearch = searchTerm.toLowerCase();

    return leaveHistory.data.filter((leave) => {
      const empName = leave.employeeId?.emp_name?.toLowerCase() || "";
      const empId = leave.employeeId?.empId?.toLowerCase() || "";
      const leaveType = leave.leaveType?.toLowerCase() || "";
      const status = leave.status?.toLowerCase() || "";

      return (
        empName.includes(lowerSearch) ||
        empId.includes(lowerSearch) ||
        leaveType.includes(lowerSearch) ||
        status.includes(lowerSearch)
      );
    });
  }, [leaveHistory, searchTerm]);

  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  const formatDate = (date) =>
    date
      ? new Date(date).toLocaleDateString("en-IN", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "-";

  return (
    <>
      <Helmet>
        <title>Employee Leave History • Employee Panel</title>
        <meta
          name="description"
          content="View and manage your leave history."
        />
      </Helmet>

      <section className="leave-list">
        <header className="leave-header">
          <h1 className="leave-title">Employee Leave History</h1>
          <div className="leave-actions">
            <InputField
              type="text"
              label="Search Leaves"
              name="search"
              placeholder="Search by name, ID, type, or status"
              value={searchTerm}
              onChange={handleSearchChange}
              required={false}
            />
          </div>
        </header>

        <div className="leave-content">
          {isLoading && (
            <p className="loading-text">Loading leave records...</p>
          )}

          {isError && (
            <p className="error-text">
              Failed to load leave history:{" "}
              {error?.data?.message || "Unknown error"}
            </p>
          )}

          {!isLoading && !isError && filteredLeaves.length > 0 && (
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
                    <th>Applied On</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeaves.map((leave, index) => (
                    <tr key={leave._id}>
                      <td data-label="#"> {index + 1}</td>
                      <td data-label="Emp ID">
                        {leave.employeeId?.empId || "-"}
                      </td>
                      <td data-label="Leave Type">{leave.leaveType || "-"}</td>
                      <td data-label="From">{formatDate(leave.startDate)}</td>
                      <td data-label="To">{formatDate(leave.endDate)}</td>
                      <td data-label="Description">
                        {leave.description || "-"}
                      </td>
                      <td data-label="Applied On">
                        {formatDate(leave.createdAt)}
                      </td>
                      <td className={`status ${leave.status}`}>
                        {leave.status === "approved" && (
                          <>
                            ✅ <span>Approved</span>
                          </>
                        )}
                        {leave.status === "pending" && (
                          <>
                            🕒 <span>Pending</span>
                          </>
                        )}
                        {leave.status === "rejected" && (
                          <>
                            ❌ <span>Rejected</span>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!isLoading && !isError && filteredLeaves.length === 0 && (
            <p className="no-records">No leave records found.</p>
          )}
        </div>
      </section>
    </>
  );
};

export default EmployeeLeave;
