import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from "./LoginForm/LoginForm";
import { Register } from "./Register/Register";
import UserInput from "./User/UserInput";
import './App.css';

const App = () => {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route path="/register" element={<Register />} />
          <Route path="/userinput" element={<UserInput />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;