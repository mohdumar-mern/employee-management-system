import { Helmet } from "react-helmet-async";
import { UserCircle, Activity, CheckCircle, Mail } from "lucide-react";
import { useSelector } from "react-redux";

import "./EmpDashboardHome.scss";

const EmpDashboardHome = () => {
  const { adminInfo } = useSelector((state) => state.admin);

  return (
    <>
      <Helmet>
        <title>{`Dashboard • Welcome ${adminInfo.name}`}</title>
        <meta
          name="description"
          content={`Dashboard overview for ${adminInfo.name}`}
        />
        <meta name="robots" content="noindex,nofollow" />
        {/* If you want it indexed, change robots */}
      </Helmet>

      <section
        className="emp-dashboard-home"
        aria-labelledby="dashboard-heading"
      >
        <header className="emp-dashboard-heading" id="dashboard-heading">
          <figure className="emp-avatar" aria-hidden="true">
            <img
              src={adminInfo.profile?.url}
              alt={`${adminInfo.name}’s profile photo`}
              className="emp-avatar-img"
            />
          </figure>
          <div className="emp-avatar-text">
            <h1 className="emp-welcome-text">
              Welcome back, {adminInfo.name}!
            </h1>
            <p className="emp-email-text">
              <Mail aria-hidden="true" className="emp-email-icon" />
              {adminInfo.email}
            </p>
          </div>
        </header>

        <p className="emp-dashboard-subtext">
          Here's a quick snapshot of your dashboard. Manage your portfolio,
          track your activity, and stay up to date — all in one place.
        </p>

        <div
          className="emp-dashboard-cards"
          role="region"
          aria-label="Quick actions"
        >
          <div className="emp-card indigo" tabIndex={0}>
            <Activity className="icon" aria-hidden="true" />
            <span>Monitor recent activity</span>
          </div>
          <div className="emp-card green" tabIndex={0}>
            <CheckCircle className="emp-icon" aria-hidden="true" />
            <span>Review completed tasks</span>
          </div>
          <div className="emp-card yellow" tabIndex={0}> 
            <UserCircle className="emp-icon" aria-hidden="true" />
            <span>Update your profile info</span>
          </div>
        </div>
      </section>
    </>
  );
};

export default EmpDashboardHome;
