import React from "react";
import "./Register.css";
import { useNavigate } from "react-router-dom";

export const Register = () => {
  const navigate = useNavigate();

  const handleNext = (e) => {
    e.preventDefault();
    // You can add validation or store data here
    navigate("/userinput");
  };

  return (
    <form onSubmit={handleNext}>
      <h1>Academic Details</h1>

      {/* name */}
      <div>
        <label htmlFor="name">Enter Your Name:</label>
        <input type="text" placeholder="Enter Full Name" required />
      </div>

      {/* roll no */}
      <div>
        <label htmlFor="roll">Enter Roll No:</label>
        <input type="text" placeholder="Enter Roll No" required />
      </div>

      {/* department */}
      <div>
        <label htmlFor="department">Select Department:</label>
        <select id="department" name="department" required>
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
      <div>
        <label htmlFor="semester">Select Year</label>
        <select id="semester" name="semester" required>
          <option value="">--Select Year--</option>
          <option value="1">I</option>
          <option value="2">II</option>
          <option value="3">III</option>
          <option value="4">IV</option>
        </select>
      </div>

      {/* cgpa */}
      <div>
        <label htmlFor="cgpa">Enter CGPA:</label>
        <input
          type="number"
          id="cgpa"
          name="cgpa"
          placeholder="Enter your CGPA"
          step="0.01"
          min="0"
          max="10"
          required
        />
      </div>

      {/* backlogs */}
      <div>
        <label htmlFor="backlogs">Number of Backlogs (if any):</label>
        <input
          type="number"
          id="backlogs"
          name="backlogs"
          placeholder="Enter number of backlogs"
          min="0"
        />
      </div>

      <button type="submit">Next</button>
    </form>
  );
};
