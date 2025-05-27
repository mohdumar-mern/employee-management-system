// Sidebar.jsx
import { useState } from "react";
import {
  LogOut,
  LayoutDashboard,
  Users,
  Menu,
  X,
  Calendar,
  HandCoins,
  Landmark,
  Settings,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearAdmin } from "../../../features/admin/adminSlice";
import { useLogoutMutation } from "../../../services/api";
import SidebarItem from "./SidebarItem/SidebarItem";
import "./Sidebar.scss";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      dispatch(clearAdmin());
      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const tabs = [
    { label: "Dashboard", icon: LayoutDashboard, path: "" },
    { label: "Employees", icon: Users, path: "employees" },
    { label: "Departments", icon: Landmark, path: "departments" },
    { label: "Leaves", icon: Calendar, path: "leaves" },
    { label: "Salary", icon: HandCoins, path: "salary" },
    { label: "Settings", icon: Settings, path: "settings" },
  ];

  const toggleSidebar = () => setIsOpen((prev) => !prev);
  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      <button className="sidebar-toggle" onClick={toggleSidebar} aria-label="Toggle sidebar">
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <aside className={`sidebar ${isOpen ? "open" : ""}`} aria-label="Sidebar Navigation">
        <div onClick={closeSidebar}>
          <h2 className="sidebar-title">Admin Panel</h2>
          <nav className="sidebar-nav">
            {tabs.map(({ label, icon, path }) => (
              <SidebarItem key={label} to={path} icon={icon} label={label} onClick={closeSidebar} />
            ))}
          </nav>
        </div>

        <div className="sidebar-logout">
          <button
            className="logout-button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            aria-disabled={isLoggingOut}
          >
            <LogOut className="icon" />
            {isLoggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
