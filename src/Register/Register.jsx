import React, { useState } from "react";
import "./Register.css";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

export const Register = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [formData, setFormData] = useState({
    name: '',
    roll: '',
    department: '',
    semester: '',
    cgpa: '',
    backlogs: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNext = async (e) => {
    e.preventDefault();
    console.log('Academic Details:', formData);
    
    try {
      // Mark registration as complete in Clerk
      await user.update({
        publicMetadata: {
          ...user.publicMetadata,
          hasCompletedRegistration: true,
          academicDetails: formData // Optional: store the form data
        },
      });
      
      // Navigate to userinput after successful registration
      navigate("/userinput");
    } catch (error) {
      console.error('Error updating user metadata:', error);
      // Still navigate even if metadata update fails
      navigate("/userinput");
    }
  };

  const handleBackToLogin = (e) => {
    e.preventDefault();
    navigate("/");
  };

  return (
    <div className="route-container">
      <div className="register-container">
        <div className="register-wrapper">
          <form onSubmit={handleNext} className="register-form">
            <div className="form-header">
              <h1>Academic Details</h1>
              <div className="header-underline"></div>
              <p className="form-subtitle">Please fill in your academic information</p>
            </div>

            <div className="form-grid">
              {/* name */}
              <div className="input-group">
                <label htmlFor="name">Full Name</label>
                <input 
                  type="text" 
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name" 
                  required 
                />
              </div>

              {/* roll no */}
              <div className="input-group">
                <label htmlFor="roll">Roll Number</label>
                <input 
                  type="text" 
                  id="roll"
                  name="roll"
                  value={formData.roll}
                  onChange={handleChange}
                  placeholder="Enter your roll number" 
                  required 
                />
              </div>

              {/* department */}
              <div className="input-group">
                <label htmlFor="department">Department</label>
                <select 
                  id="department" 
                  name="department" 
                  value={formData.department}
                  onChange={handleChange}
                  required
                >
                  <option value="">--Select Department--</option>
                  <option value="aiml">Artificial Intelligence & ML</option>
                  <option value="cse">Computer Science & Engineering</option>
                  <option value="extc">EXTC</option>
                  <option value="mech">Mechanical Engineering</option>
                  <option value="civil">Civil Engineering</option>
                  <option value="chem">Chemical Engineering</option>
                </select>
              </div>

              {/* semester */}
              <div className="input-group">
                <label htmlFor="semester">Academic Year</label>
                <select 
                  id="semester" 
                  name="semester" 
                  value={formData.semester}
                  onChange={handleChange}
                  required
                >
                  <option value="">--Select Year--</option>
                  <option value="1">First Year</option>
                  <option value="2">Second Year</option>
                  <option value="3">Third Year</option>
                  <option value="4">Fourth Year</option>
                </select>
              </div>

              {/* cgpa */}
              <div className="input-group">
                <label htmlFor="cgpa">CGPA</label>
                <input
                  type="number"
                  id="cgpa"
                  name="cgpa"
                  value={formData.cgpa}
                  onChange={handleChange}
                  placeholder="Enter your CGPA (0.00 - 10.00)"
                  step="0.01"
                  min="0"
                  max="10"
                  required
                />
              </div>

              {/* backlogs */}
              <div className="input-group">
                <label htmlFor="backlogs">Active Backlogs</label>
                <input
                  type="number"
                  id="backlogs"
                  name="backlogs"
                  value={formData.backlogs}
                  onChange={handleChange}
                  placeholder="Number of active backlogs (if any)"
                  min="0"
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="next-btn">
                Continue
              </button>
            </div>

            <div className="platform-info">
              <div className="info-text">
                <span className="platform-emoji">🎓</span>
                <span>Step 1 of 2 - Academic Information</span>
              </div>
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