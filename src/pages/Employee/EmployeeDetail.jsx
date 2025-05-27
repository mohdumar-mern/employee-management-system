import React, { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ChevronLeft } from "lucide-react";

import { useGetEmployeeByIdQuery } from "../../services/api";
import Button from "../../components/UI/Button/Button";
import "./EmployeeDetail.scss";

const EmployeeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, error } = useGetEmployeeByIdQuery(id);
  const employee = useMemo(() => data?.employee, [data]);

  if (isLoading) return <p>Loading employee details...</p>;
  if (error) return <p>Error loading employee details.</p>;
  if (!employee) return <p>No employee found.</p>;

  return (
    <>
      <Helmet>
        <title>{`${employee.dep_name} • Employee Details | Admin Panel`}</title>
        <meta
          name="description"
          content={`View detailed information about the ${employee.dep_name} employee, including their description, creator, and creation date.`}
        />
      </Helmet>

      <div className="employee-detail">
        <div className="employee-header">
          <h1>{employee.emp_name}</h1>
          <h3>{employee.userId?.email}</h3>
        </div>

        <div className="employee-profile">
          <img
            src={employee.userId?.profile?.url}
            alt={employee.emp_name}
            className="employee-image"
          />
        </div>

        <div className="employee-info">
          <p><strong>Emp Name:</strong> {employee.emp_name || "Unknown"}</p>
          <p><strong>Emp ID:</strong> {employee.empId || "Unknown"}</p>
          <p><strong>Date of Birth:</strong> {new Date(employee.dob).toLocaleDateString()}</p>
          <p><strong>Gender:</strong> {employee.gender || "Unknown"}</p>
          <p><strong>Marital Status:</strong> {employee.maritalStatus || "Unknown"}</p>
          <p><strong>Designation:</strong> {employee.designation || "Unknown"}</p>
          <p><strong>Salary:</strong> {employee.salary || "Unknown"}</p>
          <p><strong>Department:</strong> {employee.department?.dep_name || "Unknown"}</p>
          <p><strong>Created At:</strong> {new Date(employee.createdAt).toLocaleString()}</p>
        </div>

        <div className="employee-actions">
          <Button
            onClick={() => navigate(-1)}
            text="Back to Employees"
            Icon={ChevronLeft}
          />
        </div>
      </div>
    </>
  );
};

export default EmployeeDetail;
