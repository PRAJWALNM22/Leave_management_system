/**
 * Main App Component
 * Sets up routing and protected routes for the application
 */
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ApplyLeave from "./pages/ApplyLeave";
import MyRequests from "./pages/MyRequests";
import Pending from "./pages/Pending";
import useAuth from "./store/useAuth";
import Navbar from "./components/Navbar";

/**
 * Protected Route Component
 * Ensures user is authenticated and has correct role
 */
function Protected({ children, role }) {
  const auth = useAuth();
  if (!auth.token) return <Navigate to="/login" />;
  if (role && auth.role !== role) return <div className="container">Unauthorized</div>;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/apply" element={<Protected role="employee"><ApplyLeave /></Protected>} />
        <Route path="/my" element={<Protected role="employee"><MyRequests /></Protected>} />
        <Route path="/pending" element={<Protected role="manager"><Pending /></Protected>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
