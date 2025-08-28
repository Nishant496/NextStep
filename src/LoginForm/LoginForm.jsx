import React, { useState } from "react";
import { FaUser, FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./LoginForm.css";

const LoginForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Please enter a valid email";

    if (!formData.password) newErrors.password = "Password is required";

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      // Simulate API call - replace with your actual login logic
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, accept any valid email/password combination
      // Replace this with your actual authentication logic
      if (formData.email && formData.password) {
        console.log("Login successful:", formData.email);
        
        // Store user session if needed (replace with your auth system)
        if (formData.rememberMe) {
          localStorage.setItem("userEmail", formData.email);
        }
        
        navigate("/dashboard"); // redirect after login
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (err) {
      setErrors({ general: err.message || "Login failed. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterClick = (e) => {
    e.preventDefault();
    navigate("/signup");
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    // You can create a forgot password page or show an alert for now
    alert("Forgot password functionality - implement as needed");
    // navigate("/forgot-password");
  };

  return (
    <div className="route-container">
      <div className="login-container">
        <div className="login-wrapper">
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-header">
              <h1>Login</h1>
              <div className="header-underline"></div>
            </div>

            {errors.general && (
              <div className="error-message">{errors.general}</div>
            )}

            <div className="input-group">
              <div className="input-box">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email Address"
                  className={errors.email ? "error" : ""}
                  required
                  disabled={isSubmitting}
                />
                <FaUser className="input-icon" />
                {errors.email && (
                  <span className="error-text">{errors.email}</span>
                )}
              </div>

              <div className="input-box">
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className={errors.password ? "error" : ""}
                  required
                  disabled={isSubmitting}
                />
                <FaLock className="input-icon" />
                {errors.password && (
                  <span className="error-text">{errors.password}</span>
                )}
              </div>
            </div>

            <div className="remember-forgot">
              <label className="remember-label">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
                <span className="checkmark"></span>
                Remember me
              </label>
              <a
                href="#"
                onClick={handleForgotPassword}
                className="forgot-link"
                style={{ opacity: isSubmitting ? 0.6 : 1 }}
              >
                Forgot password?
              </a>
            </div>

            <button type="submit" className="login-btn" disabled={isSubmitting}>
              {isSubmitting ? "Signing in..." : "Login"}
            </button>

            <div className="register-link">
              <p>
                Don't have an account?{" "}
                <a
                  href=""
                  onClick={handleRegisterClick}
                  style={{ opacity: isSubmitting ? 0.6 : 1 }}
                >
                  Register
                </a>
              </p>
            </div>

            <div className="platform-info">
              <div className="info-text">
                <span className="platform-emoji">🎯</span>
                <span>Placement Preparation Platform</span>
              </div>
              <p className="info-subtitle">
                Secure login • Practice tests • Interview prep
              </p>
            </div>
          </form>
        </div>

        <div className="bg-decoration">
          <div className="decoration-circle circle-1"></div>
          <div className="decoration-circle circle-2"></div>
          <div className="decoration-circle circle-3"></div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;