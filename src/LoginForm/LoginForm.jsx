import React from "react";
import { FaLock, FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // import useNavigate
import "./LoginForm.css";

const LoginForm = () => {
  const navigate = useNavigate(); // initialize navigate

  const handleSubmit = (e) => {
    e.preventDefault();
    // Your login logic here (validate user, API call, etc.)

    // Redirect to Register page after login
    navigate("/register");
  };

  return (
    <div className="wrapper">
      <form onSubmit={handleSubmit}>
        <h1>Login</h1>
        <div className="input-box">
          <input type="text" placeholder="Username" required />
          <FaUser />
        </div>
        <div className="input-box">
          <input type="password" placeholder="Password" required />
          <FaLock />
        </div>

        <div className="remember-forgot">
          <label>
            <input type="checkbox" />
            Remember me{" "}
          </label>
          <a href="#">Forgot password?</a>
        </div>

        <button type="submit">Login</button>

        <div className="register-link">
          <p>
            Don't have an account?{" "}
            <a href="#" onClick={() => navigate("/register")}>
              Register
            </a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
