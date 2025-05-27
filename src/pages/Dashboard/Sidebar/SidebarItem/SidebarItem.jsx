import { NavLink } from "react-router-dom";
import "./SidebarItem.scss";

const SidebarItem = ({ to, icon: Icon, label }) => (
  <NavLink
    to={to}
    end
    className={({ isActive }) =>
      `sidebar-item ${isActive ? "active" : ""}`
    }
  >
    {Icon && <Icon className="sidebar-icon" />}
    <span className="sidebar-label">{label}</span>
  </NavLink>
);

export default SidebarItem;
