import { Helmet } from "react-helmet-async";
import { UserCircle, Activity, CheckCircle, Mail } from "lucide-react";
import "./DashboardHome.scss";
import {  useSelector } from "react-redux";

const DashboardHome = () => {
  const {adminInfo} = useSelector(state => state.admin)


  return (
    <>
      <Helmet>
      <title>{`Dashboard • Welcome ${adminInfo.name}`}</title>
        <meta name="description" content={`Dashboard overview for ${adminInfo.name}`} />
        <meta name="robots" content="noindex,nofollow" />
        {/* If you want it indexed, change robots */}
      </Helmet>

      <section className="dashboard-home" aria-labelledby="dashboard-heading">
        <header className="dashboard-heading" id="dashboard-heading">
          <figure className="avatar" aria-hidden="true">
            <img
              src={adminInfo.profile?.url}
              alt={`${adminInfo.name}’s profile photo`}
              className="avatar-img"
            />
          </figure>
          <div className="avatar-text">
            <h1 className="welcome-text">Welcome back, {adminInfo.name}!</h1>
            <p className="email-text">
              <Mail aria-hidden="true" className="mail-icon" />
              <span className="visually-hidden">Email:</span> {adminInfo.email}
            </p>
          </div>
        </header>

        <p className="dashboard-subtext">
          Here's a quick snapshot of your dashboard. Manage your portfolio, track
          your activity, and stay up to date — all in one place.
        </p>

        <div className="dashboard-cards" role="region" aria-label="Quick actions">
          <div className="card indigo" tabIndex={0}>
            <Activity className="icon" aria-hidden="true" />
            <span>Monitor recent activity</span>
          </div>
          <div className="card green" tabIndex={0}>
            <CheckCircle className="icon" aria-hidden="true" />
            <span>Review completed tasks</span>
          </div>
          <div className="card yellow" tabIndex={0}>
            <UserCircle className="icon" aria-hidden="true" />
            <span>Update your profile info</span>
          </div>
        </div>
      </section>
    </>
  );
};

export default DashboardHome;
