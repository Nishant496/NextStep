import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./Landing/Landing"; // Import your Landing component
import LoginForm from "./LoginForm/LoginForm";
import { Register } from "./Register/Register";
import SignUp from "./signUp/signUP";
import UserInput from "./User/UserInput";
import './App.css';

const App = () => {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<Register />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/userinput" element={<UserInput />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;