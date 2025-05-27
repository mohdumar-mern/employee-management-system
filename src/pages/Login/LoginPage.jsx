import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useDispatch } from "react-redux";

import "./LoginPage.scss";
import InputField from "../../components/UI/Input/InputField";
import { useLoginMutation, } from "../../services/api";
import { setAdmin } from "../../features/admin/adminSlice";
import Button from "../../components/UI/Button/Button";


const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch()

  const [login, { isLoading: isLoginLoading }] = useLoginMutation();
 

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });

    try {
      const res = await login(formData).unwrap();

      if (res.success && res.user && res.token) {
       
        dispatch(setAdmin({user: res.user, token: res.token}))
        setMessage({ text: res.message, type: "success" });
        navigate("/admin-dashboard");
      } else {
        setMessage({ text: res.message || "Login failed", type: "error" });
      }
    } catch (err) {
      const msg =
        err?.data?.error || err?.error || "An unexpected error occurred";
      setMessage({ text: msg, type: "error" });
    }
  };


  return (
    <main className="login-page">
      <Helmet>
        <title>Login | Employee Management</title>
        <meta name="description" content="Login securely to the portal." />
      </Helmet>

      <section className="login-card">
        <h1 className="login-title">Employee Management</h1>
        <h2 className="login-subtitle">Admin Login</h2>

        <form className="login-form" onSubmit={handleSubmit}>
            {message.text && (
            <p
              style={{
                color: message.type === "error" ? "red" : "green",
                marginTop: "1rem",
              }}
            >
              {message.text}
            </p>
          )}
          <InputField
            label="Email"
            type="email"
            name="email"
            placeholder="admin@example.com"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <InputField
            label="Password"
            type="password"
            name="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <div className="form-actions">
            <Button
              type="submit"
              disabled={isLoginLoading}
              text ="Login"
            />

          </div>

        
        </form>

       
      
      </section>
    </main>
  );
};

export default LoginPage;
