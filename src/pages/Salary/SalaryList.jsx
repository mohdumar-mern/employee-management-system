import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";

import { useGetSalaryQuery } from "../../services/api";

import "./SalaryHistory.scss";
import Button from "../../components/UI/Button/Button";

const SalaryList = () => {
  const navigate = useNavigate();

  const {
    data,
    isLoading,
    isError,
    error,
  } = useGetSalaryQuery(); // pass empId to query hook

  const addSalaryHandler = () => {
    navigate("/admin-dashboard/salary/add");
  };

  return (
    <>
      <Helmet>
        <title>Salary List • Admin Panel</title>
        <meta name="description" content="View and manage salary history." />
      </Helmet>

      <section className="salary-list">
        <header className="salary-header">
          <h1 className="salary-title">Salary History</h1>
          <Button onClick={addSalaryHandler} text="+ Add Salary" />
        </header>

        <div className="salary-content">
          {isLoading ? (
            <p>Loading...</p>
          ) : isError ? (
            <p>Error: {error?.message || "Unknown error"}</p>
          ) : data?.salaries?.length > 0 ? (
            <div className="table-container">
              <table className="employee-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Emp ID</th>
                    <th>Salary</th>
                    <th>Allowances</th>
                    <th>Deductions</th>
                    <th>Total</th>
                    <th>Pay Date</th>
                  </tr>
                </thead>
                <tbody>
                  {data.salaries.map((record, index) => (
                    <tr key={record._id}>
                      <td data-label="#">{index + 1}</td>
                      <td data-label="Emp ID">{record?.empId || "-"}</td>
                      <td data-label="Salary">{record.basicSalary}</td>
                      <td data-label="Allowances">{record.allowances}</td>
                      <td data-label="Deductions">{record.deductions}</td>
                      <td data-label="Total">{record.netSalary}</td>
                      <td data-label="Pay Date">
                        {new Date(record.payDate).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="no-salary-message">No Salary Records found.</p>
          )}
        </div>
      </section>
    </>
  );
};

export default SalaryList;
