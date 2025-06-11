import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";

import { useGetSalaryQuery } from "../../services/api";

import "./SalaryHistory.scss";
import Button from "../../components/UI/Button/Button";
import InputField from "../../components/UI/Input/InputField";
import Spinner from "../../components/UI/spinner/Spinner";

const SalaryList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading, isError, error } = useGetSalaryQuery();

  const handleChange = (e) => setSearchTerm(e.target.value);
  const addSalaryHandler = () => navigate("/admin-dashboard/salary/add");

  const filteredSalaries = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return data?.salaries?.filter((sal) =>
      sal.empId?.toLowerCase().includes(term)
    ) || [];
  }, [data, searchTerm]);

  return (
    <>
      <Helmet>
        <title>Salary List • Admin Panel</title>
        <meta name="description" content="View and manage salary history." />
      </Helmet>

      <section className="salary-list">
        <header className="salary-headers">
          <div className="salary-actions">
            <h1 className="salary-title">Salary History</h1>
            <Button onClick={addSalaryHandler} text="+ Add Salary" />
          </div>

          <div className="search-box">
            <InputField
              type="text"
              label="Search Salaries"
              name="salary-search"
              placeholder="Search by Emp ID"
              value={searchTerm}
              onChange={handleChange}
            />
          </div>
        </header>
       

        <div className="salary-content">
          {isLoading ? (
            <Spinner />
          ) : isError ? (
            <p className="error-message">
              Error loading salary records: {error?.message || "Unknown error"}
            </p>
          ) : filteredSalaries.length > 0 ? (
            <div className="table-container">
              <table className="employee-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Emp ID</th>
                    <th>Basic Salary</th>
                    <th>Allowances</th>
                    <th>Deductions</th>
                    <th>Net Salary</th>
                    <th>Pay Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSalaries.map((record, index) => (
                    <tr key={record._id}>
                      <td data-label="#">{index + 1}</td>
                      <td data-label="Emp ID">{record.empId || "-"}</td>
                      <td data-label="Basic Salary">{record.basicSalary || 0}</td>
                      <td data-label="Allowances">{record.allowances || 0}</td>
                      <td data-label="Deductions">{record.deductions || 0}</td>
                      <td data-label="Net Salary">{record.netSalary || 0}</td>
                      <td data-label="Pay Date">
                        {record.payDate
                          ? new Date(record.payDate).toLocaleDateString()
                          : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="no-salary-message">No salary records found.</p>
          )}
        </div>
      </section>
    </>
  );
};

export default SalaryList;
