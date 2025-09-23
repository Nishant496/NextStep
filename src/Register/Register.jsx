import React, { useState } from "react";
import "./Register.css";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { studentDB } from "../lib/supabase";

export const Register = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [formData, setFormData] = useState({
    name: '',
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
      // Debug: Check if user email exists
      const userEmail = user.primaryEmailAddress?.emailAddress;
      console.log('User email:', userEmail);
      
      if (!userEmail) {
        alert('User email not found. Please ensure you are properly signed in.');
        return;
      }



      // Check if user already has a student record
      const existingUserStudent = await studentDB.getStudentByEmail(userEmail);
      if (existingUserStudent.success && existingUserStudent.data) {
        alert('You already have a student profile. Please contact support if you need to update your information.');
        return;
      }

      // Save student data to Supabase
      const studentData = {
        full_name: formData.name,
        department: formData.department,
        academic_year: formData.semester,
        cgpa: parseFloat(formData.cgpa),
        active_backlog: parseInt(formData.backlogs) || 0,
        email: userEmail,
        phone: null,
        linkedin_url: null,
        github_url: null,
        resume_pdf_url: null
      };

      console.log('Attempting to save student data:', studentData);
      const result = await studentDB.createStudent(studentData);
      console.log('Database operation result:', result);
      
      if (result.success) {
        try {
          // Store student ID in Clerk metadata for later use
          await user.update({
            unsafeMetadata: {
              hasCompletedRegistration: true,
              studentId: result.data.id,
              academicDetails: formData
            },
          });
          
          console.log('Student data saved successfully:', result.data);
          console.log('User metadata updated successfully');
          navigate("/userinput");
        } catch (clerkError) {
          console.warn('Failed to update Clerk metadata, but student data was saved:', clerkError);
          // Try alternative approach - store in localStorage as fallback
          try {
            localStorage.setItem('nextStep_studentId', result.data.id);
            localStorage.setItem('nextStep_registrationComplete', 'true');
            console.log('Stored student data in localStorage as fallback');
          } catch (localStorageError) {
            console.warn('Failed to store in localStorage:', localStorageError);
          }
          // Still navigate since the main data was saved successfully
          navigate("/userinput");
        }
      } else {
        console.error('Failed to save student data:', result.error);
        
        // Handle specific database errors
        if (result.error.includes('duplicate key value violates unique constraint "students_roll_no_key"')) {
          alert('A student with this roll number already exists. Please check your roll number or contact support if this is an error.');
        } else if (result.error.includes('duplicate key value violates unique constraint "students_email_key"')) {
          alert('A student with this email already exists. Please use a different email or contact support.');
        } else {
          alert(`Failed to save academic details: ${result.error}`);
        }
      }
    } catch (error) {
      console.error('Error during registration:', error);
      alert(`Registration error: ${error.message}`);
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