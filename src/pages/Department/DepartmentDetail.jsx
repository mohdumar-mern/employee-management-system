import React, { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ChevronLeft } from "lucide-react";

import { useGetDepartmentByIdQuery } from "../../services/api";
import Button from "../../components/UI/Button/Button";
import "./DepartmentDetail.scss";

const DepartmentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, error } = useGetDepartmentByIdQuery(id);
  const department = useMemo(() => data?.department, [data]);

  if (isLoading) return <p>Loading department details...</p>;
  if (error) return <p>Error loading department details.</p>;
  if (!department) return <p>No department found.</p>;

  return (
    <>
      <Helmet>
        <title>{`${department.dep_name} • Department Details | Admin Panel`}</title>
        <meta
          name="description"
          content={`View detailed information about the ${department.dep_name} department, including its description, creator, and creation date.`}
        />
      </Helmet>

      <div className="department-detail">
        <div className="department-header">
          <h1>{department.dep_name}</h1>
          <h3>{department.created_by?.email}</h3>
        </div>

        <div className="department-info">
          <p>
            <strong>Description:</strong> {department.description || "No description provided."}
          </p>
          <p>
            <strong>Created By:</strong> {department.created_by?.name || "Unknown"}
          </p>
          <p>
            <strong>Created At:</strong>{" "}
            {new Date(department.createdAt).toLocaleString()}
          </p>
        </div>

        <div className="department-actions">
          <Button
            onClick={() => navigate(-1)}
            text="Back to Departments"
            Icon={ChevronLeft}
          />
        </div>
      </div>
    </>
  );
};

export default DepartmentDetail;
