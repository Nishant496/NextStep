import React, { useState } from 'react';
import { FaUser, FaLock, FaEnvelope, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './SignUp.css';

const SignUp = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the terms and conditions';
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length === 0) {
      // Store user data for the next step (Register.jsx)
      // Using sessionStorage instead of localStorage for better compatibility
      try {
        sessionStorage.setItem('signupData', JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password, // In real app, never store plain password
          registeredAt: new Date().toISOString()
        }));
      } catch (error) {
        console.log('Storage not available, proceeding without saving data');
      }

      console.log('User signup completed:', formData);
      console.log('Navigating to register page for additional details...');
      
      // Navigate to register page for additional academic/personal details
      navigate('/register');
    } else {
      setErrors(newErrors);
      console.log('Form validation failed:', newErrors);
    }
  };

  const handleLoginClick = (e) => {
    e.preventDefault();
    console.log('Navigating back to login page');
    navigate('/');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="route-container">
      <div className="signup-container">
        <div className="signup-wrapper">
          <form onSubmit={handleSubmit} className="signup-form">
            <div className="form-header">
              <h1>Create Account</h1>
              <div className="header-underline"></div>
              <p className="form-subtitle">Join our Placement Preparation Platform</p>
            </div>

            <div className="input-group">
              {/* Full Name */}
              <div className="input-box">
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Full Name"
                  className={errors.fullName ? 'error' : ''}
                  required
                />
                <FaUser className="input-icon" />
                {errors.fullName && <span className="error-text">{errors.fullName}</span>}
              </div>

              {/* Email */}
              <div className="input-box">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email Address"
                  className={errors.email ? 'error' : ''}
                  required
                />
                <FaEnvelope className="input-icon" />
                {errors.email && <span className="error-text">{errors.email}</span>}
              </div>

              {/* Password */}
              <div className="input-box">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className={errors.password ? 'error' : ''}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
                {errors.password && <span className="error-text">{errors.password}</span>}
              </div>

              {/* Confirm Password */}
              <div className="input-box">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm Password"
                  className={errors.confirmPassword ? 'error' : ''}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={toggleConfirmPasswordVisibility}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
                {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="terms-section">
              <label className="terms-label">
                <input
                  type="checkbox"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  className={errors.agreeTerms ? 'error' : ''}
                />
                <span className="checkmark"></span>
                I agree to the <a href="#" className="terms-link">Terms & Conditions</a> and <a href="#" className="terms-link">Privacy Policy</a>
              </label>
              {errors.agreeTerms && <span className="error-text">{errors.agreeTerms}</span>}
            </div>

            {/* Sign Up Button */}
            <button type="submit" className="signup-btn">
              Create Account
            </button>

            {/* Login Link */}
            <div className="login-link">
              <p>
                Already have an account?{' '}
                <a href="#" onClick={handleLoginClick}>
                  Sign In
                </a>
              </p>
            </div>

            <div className="platform-info">
              <div className="info-text">
                <span className="platform-emoji">🚀</span>
                <span>Start Your Placement Journey</span>
              </div>
              <p className="info-subtitle">
                Practice tests • Mock interviews • Career guidance
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

export default SignUp;