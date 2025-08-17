import React, { useState } from 'react';
import { FaUser, FaLock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './LoginForm.css';

const LoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    rememberMe: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login submitted:', formData);
    // Add your login logic here
    // After successful login, navigate to dashboard or desired page
    // navigate('/dashboard');
  };

  const handleRegisterClick = (e) => {
    e.preventDefault();
    console.log('Navigate to register');
    navigate('/register');
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    console.log('Navigate to forgot password');
    // Add forgot password logic here
    // navigate('/forgot-password');
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

            <div className="input-group">
              <div className="input-box">
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Username"
                  required
                />
                <FaUser className="input-icon" />
              </div>

              <div className="input-box">
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  required
                />
                <FaLock className="input-icon" />
              </div>
            </div>

            <div className="remember-forgot">
              <label className="remember-label">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                />
                <span className="checkmark"></span>
                Remember me
              </label>
              <a href="#" onClick={handleForgotPassword} className="forgot-link">
                Forgot password?
              </a>
            </div>

            <button type="submit" className="login-btn">
              Login
            </button>

            <div className="register-link">
              <p>
                Don't have an account?{' '}
                <a href="#" onClick={handleRegisterClick}>
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

        {/* Background decorative elements */}
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