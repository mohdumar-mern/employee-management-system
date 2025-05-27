// routes/ProtectedRoutes.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

/**
 * Wrap your protected routes with this component.
 * - allowedRoles: array of roles that may access these routes.
 * - children (optional): if you pass a component directly instead of nesting.
 */
const ProtectedRoutes = ({ allowedRoles, children }) => {
  const adminInfo = useSelector((state) => state.admin.adminInfo);

  // 1. Not logged in? Redirect to login.
  if (!adminInfo) {
    return <Navigate to="/login" replace />;
  }

  // 2. Role not allowed? Redirect to unauthorized.
  if (!allowedRoles.includes(adminInfo.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // 3a. If children passed directly, render them
  if (children) {
    return children;
  }

  // 3b. Otherwise render nested routes via Outlet
  return <Outlet />;
};

export default ProtectedRoutes;
