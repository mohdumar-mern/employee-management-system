import { Helmet } from "react-helmet-async";
import {
  UserCircle,
  CheckCircle,
  Mail,
  Building2,
  Wallet,
  CalendarDays,
} from "lucide-react";

import "./DashboardHome.scss";

import { useSelector } from "react-redux";
import { useDashboardSummaryQuery } from "../../../services/api";
import Spinner from "../../../components/UI/spinner/Spinner";

const DashboardHome = () => {
  const { adminInfo } = useSelector((state) => state.admin);
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useDashboardSummaryQuery();

  if (isLoading) {
    return (
      <div
        className="loader-wrapper"
        role="status"
        aria-live="polite"
        aria-busy="true"
      >
        <Spinner />
        <span className="visually-hidden">Loading dashboard summary...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error" role="alert" aria-live="assertive">
        <p>Oops! Unable to load dashboard data.</p>
        <button onClick={() => refetch()} className="retry-button">
          Retry
        </button>
      </div>
    );
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
        {/* Change noindex only if you want to hide from search */}
        <meta name="robots" content="index,follow" />
        <meta name="author" content="Admin Dashboard Team" />
        <meta property="og:title" content="Admin Dashboard" />
        <meta
          property="og:description"
          content={`Admin summary for ${adminInfo?.name || "Admin"}`}
        />
        <meta
          property="og:image"
          content={adminInfo?.profile?.url || "/default-avatar.png"}
        />
      </Helmet>

      <section
        className="dashboard-home"
        aria-labelledby="dashboard-heading"
      >
        <header className="dashboard-heading" id="dashboard-heading">
          <figure className="avatar" aria-hidden="true">
            <img
              src={adminInfo?.profile?.url || "/default-avatar.png"}
              alt={`${adminInfo?.name || "Admin"}’s profile photo`}
              className="avatar-img"
              loading="lazy"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/default-avatar.png";
              }}
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
            <div className="card1">
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
              <span>{approved}</span>
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
