import { Helmet } from "react-helmet-async";
import {
  UserCircle,
  Activity,
  CheckCircle,
  Mail,
  Building2,
  Wallet,
  CalendarDays,
} from "lucide-react";
import "./DashboardHome.scss";

import { useSelector } from "react-redux";
import { useDashboardSummaryQuery } from "../../../services/api";

const DashboardHome = () => {
  const { adminInfo } = useSelector((state) => state.admin);
  const { data, isLoading, error } = useDashboardSummaryQuery();

  if (isLoading) {
    return <div className="loader">Loading dashboard summary...</div>;
  }

  if (error) {
    return <div className="error">Failed to load dashboard data.</div>;
  }

  const {
    totalDepartments = 0,
    totalEmployees = 0,
    totalSalary = 0,
    leaveSummary = {},
  } = data || {};

  const {
    appliedFor = 0,
    approved = 0,
    rejected = 0,
    pending = 0,
  } = leaveSummary || {};

  return (
    <>
      <Helmet>
        <title>{`Dashboard • Welcome ${adminInfo?.name || "Admin"}`}</title>
        <meta
          name="description"
          content={`Dashboard overview for ${adminInfo?.name || "Admin"}`}
        />
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>

      <section className="dashboard-home" aria-labelledby="dashboard-heading">
        <header className="dashboard-heading" id="dashboard-heading">
          <figure className="avatar" aria-hidden="true">
            <img
              src={adminInfo?.profile?.url || "/default-avatar.png"}
              alt={`${adminInfo?.name || "Admin"}’s profile photo`}
              className="avatar-img"
            />
          </figure>
          <div className="avatar-text">
            <h1 className="welcome-text">
              Welcome back, {adminInfo?.name || "Admin"}!
            </h1>
            <p className="email-text">
              <Mail className="mail-icon" aria-hidden="true" />
              <span className="visually-hidden">Email:</span>
              {adminInfo?.email || "Not available"}
            </p>
          </div>
        </header>

        <p className="dashboard-subtext">
          Here's a quick snapshot of your dashboard. Manage your portfolio,
          track your activity, and stay up to date — all in one place.
        </p>

        {/* Main Stats */}
        <div
          className="dashboard-cards"
          role="region"
          aria-label="Dashboard statistics"
        >
          <div className="card blue" tabIndex={0}>
            <UserCircle className="icon" />
            <div>
              <h3>Total Employees</h3>
              <span>{totalEmployees}</span>
            </div>
          </div>
          <div className="card green" tabIndex={0}>
            <Building2 className="icon" />
            <div>
              <h3>Total Departments</h3>
              <span>{totalDepartments}</span>
            </div>
          </div>
          <div className="card orange" tabIndex={0}>
            <Wallet className="icon" />
            <div>
              <h3>Total Salary</h3>
              <span>₹{totalSalary.toLocaleString("en-IN")}</span>
            </div>
          </div>
        </div>

        {/* Leave Summary */}
        <div
          className="dashboard-cards"
          role="region"
          aria-label="Leave Summary"
        >
          <div className="card purple" tabIndex={0}>
            <CalendarDays className="icon" />
            <div>
              <h3>Leave Applied</h3>
              <span>{appliedFor}</span>
            </div>
          </div>
          <div className="card green" tabIndex={0}>
            <CheckCircle className="icon" />
            <div>
              <h3>Approved</h3>
              <pspan>{approved}</pspan>
            </div>
          </div>
          <div className="card red" tabIndex={0}>
            <CalendarDays className="icon" />
            <div>
              <h3>Rejected</h3>
              <span>{rejected}</span>
            </div>
          </div>
          <div className="card yellow" tabIndex={0}>
            <CalendarDays className="icon" />
            <div className="block">
              <h3>Pending</h3>
              <span>{pending}</span>
            </div>
          </div>
        </div>

      
      </section>
    </>
  );
};

export default DashboardHome;
