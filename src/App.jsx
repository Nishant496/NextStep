import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from "./LoginForm/LoginForm";
import { Register } from "./Register/Register";
import UserInput from "./User/UserInput"; // Correct import path

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/register" element={<Register />} />
        <Route path="/userinput" element={<UserInput />} /> {/* Fixed here */}
      </Routes>
    </Router>
  );
};

export default App;
