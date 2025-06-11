import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useSelector, useDispatch } from "react-redux";

import { useGetSalaryByEmpIdQuery } from "../../services/api";
import { setSalary } from "../../features/salary/salarySlice";

import "./SalaryHistory.scss";

import Button from "../../components/UI/Button/Button";
import Spinner from "../../components/UI/spinner/Spinner";

const SalaryHistory = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { empId } = useParams();

  // Fetch salary data
  const {
    data: salaryData,
    isLoading,
    isError,
    error,
  } = useGetSalaryByEmpIdQuery(empId, {
    refetchOnMountOrArgChange: true,
  });

  const { salary: salaryFromStore = [] } = useSelector((state) => state.salary);

  // Set data to Redux store when fetched
  useEffect(() => {
    if (salaryData?.salaries) {
      dispatch(
        setSalary({
          salary: salaryData.salaries,
          message: salaryData.message,
          success: salaryData.success,
        })
      );
    }
  }, [salaryData, dispatch]);

 
  // Navigation handler
  const addSalaryHandler = () => navigate("/admin-dashboard/salary/add");

  return (
    <>
      <Helmet>
        <title>Salary History • Admin Panel</title>
        <meta name="description" content="View and manage employee salary records." />
      </Helmet>

      <section className="salary-list">
        <header className="salary-header">
          <div className="salary-actions">
            <h1 className="salary-title">Salary History</h1>
            <Button onClick={addSalaryHandler} text="+ Add Salary" />
          </div>

          
        </header>

        <div className="salary-content">
          {isLoading ? (
            <Spinner />
          ) : isError ? (
            <p className="error-message">
              Error loading salary records: {error?.data?.message || "Unknown error"}
            </p>
          ) : salaryFromStore.length > 0 ? (
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
                        {record.payDate ? new Date(record.payDate).toLocaleDateString() : "-"}
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

export default SalaryHistory;
