import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import Landing from "./Landing/Landing"; // Import your Landing component
import Dashboard from "./Dashboard/Dashboard";
import LoginForm from "./LoginForm/LoginForm";
import { Register } from "./Register/Register";
import SignUp from "./signUp/signUP";
import UserInput from "./User/UserInput";
import './App.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
};

const App = () => {
  return (
    <div className="App">
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          
          {/* Keep existing auth routes as fallbacks (optional) */}
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<Register />} />
          <Route path="/signup" element={<SignUp />} />
          
          {/* Protected Routes - Only accessible when signed in */}
          <Route 
            path="/userinput" 
            element={
              <ProtectedRoute>
                <UserInput />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Add more protected routes as needed */}
          {/* 
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          */}
        </Routes>
      </Router>
    </div>
  );
};

export default App;