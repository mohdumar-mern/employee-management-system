// App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "./App.scss";

import Home from "./components/Home";
import LoginPage from "./pages/Login/LoginPage";
import ProtectedRoutes from "./routes/ProtectedRoutes";
import DashboardLayout from "./pages/Dashboard/DashboardLayout/DashboardLayout";
import DashboardHome from "./pages/Dashboard/DashboardHome/DashboardHome";
import DepartmentList from "./pages/Department/DepartmentList";
import AddDepartment from "./pages/Department/AddDepartment";
import DepartmentDetail from "./pages/Department/DepartmentDetail";
import UpdateDepartment from "./pages/Department/UpdateDepartment";
import EmployeeList from "./pages/Employee/EmployeeList";
import AddEmployee from "./pages/Employee/AddEmployee";
import EmployeeDetail from "./pages/Employee/EmployeeDetail";
import UpdateEmployee from "./pages/Employee/UpdateEmployee";
import AddSalary from "./pages/Salary/AddSalary";
import SalaryHistory from "./pages/Salary/SalaryHistory";

function App() {
  return (
    <Router>
         <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Unauthorized */}
        <Route path="/unauthorized" element={<div>Unauthorized Access</div>} />

        {/* Protected Admin Dashboard (Role: 'admin') */}
        <Route element={<ProtectedRoutes allowedRoles={["admin"]} />}> 
          <Route path="/admin-dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardHome />} />
            <Route path="employees" element={<EmployeeList />} />
             <Route path="employees/add" element={<AddEmployee />} />
            <Route path="employees/:id/view" element={<EmployeeDetail />} />
            <Route path="employees/:id/edit" element={<UpdateEmployee />} /> 

            <Route path="departments" element={<DepartmentList />} />
            <Route path="departments/add" element={<AddDepartment />} />
            <Route path="departments/:id/view" element={<DepartmentDetail />} />
            <Route path="departments/:id/edit" element={<UpdateDepartment />} />

            <Route path="leaves" element={<div>Leaves</div>} />
            <Route path="salary/:empId/history" element={<SalaryHistory />} />
            <Route path="salary/add" element={<AddSalary />} />
            <Route path="settings" element={<div>Settings</div>} />
          </Route>
        </Route>

        {/* 404 Fallback */}
        <Route path="*" element={<div>Page Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;
