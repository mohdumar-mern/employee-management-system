import React, { useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { Eye } from "lucide-react";

import InputField from "../../components/UI/Input/InputField";
import Button from "../../components/UI/Button/Button";
import { useGetAdminAllLeavesQuery } from "../../services/api";

import "./AdminLeaveList.scss";

const AdminLeaveList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: leaveData,
    isLoading,
    isError,
    error,
  } = useGetAdminAllLeavesQuery();

  console.log(leaveData)

  const leave = leaveData?.data || [];

  const handleChange = (e) => setSearchTerm(e.target.value);

  const filteredLeaves = useMemo(() => {
    const lowerSearch = searchTerm.toLowerCase();
    return leave.filter((lea) => {
      const emp = lea.employeeId || {};
      return (
        String(emp.empId || "").toLowerCase().includes(lowerSearch) ||
        String(emp.emp_name || "").toLowerCase().includes(lowerSearch) ||
        String(emp.department?.dep_name || "").toLowerCase().includes(lowerSearch) ||
        String(lea.leaveType || "").toLowerCase().includes(lowerSearch) ||
        String(lea.status || "").toLowerCase().includes(lowerSearch)
      ); 
    });
  }, [leave, searchTerm]);

  return (
    <>
      <Helmet>
        <title>Leaves • Admin Panel</title>
        <meta name="description" content="Manage employee leaves in the admin panel." />
      </Helmet>

      <section className="employee-list">
        <header className="employee-header">
          <h1 className="employee-title">Manage Leaves</h1>
          <div className="employee-actions">
            <InputField
              type="text"
              label="Search Leaves"
              name="leave"
              placeholder="Search by employee name, ID, or department"
              value={searchTerm}
              onChange={handleChange}
            />
          </div>
        </header>

        <div className="employee-content">
          {isLoading ? (
            <p>Loading...</p>
          ) : isError ? (
            <p>Error loading leaves: {error?.data?.message || "Unknown error"}</p>
          ) : filteredLeaves.length > 0 ? (
            <div className="table-container">
              <table className="employee-table">
                <thead>
                  <tr>
                    <th>Sr No.</th>
                    <th>Emp ID</th>
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
                        <td data-label="Emp ID">{emp.empId || "-"}</td>
                        <td data-label="Name">{emp.emp_name || "-"}</td>
                        <td data-label="Leave Type">{lea.leaveType || "-"}</td>
                        <td data-label="Department">{emp.department?.dep_name || "-"}</td>
                        <td data-label="Days">
                          {lea.startDate && lea.endDate
                            ? Math.ceil(
                                (new Date(lea.endDate) - new Date(lea.startDate)) /
                                  (1000 * 60 * 60 * 24)
                              ) + 1
                            : "-"}
                        </td>
                        <td data-label="Status">{lea.status || "-"}</td>
                        <td data-label="Actions">
                          <div className="actions-cell">
                            <Button
                              title="View"
                              onClick={() =>
                                navigate(`/admin-dashboard/leave/${lea._id}/view`)
                              }
                              Icon={Eye}
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
