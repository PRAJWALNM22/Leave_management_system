// src/components/Navbar.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../store/useAuth";

export default function Navbar() {
  const auth = useAuth();
  const nav = useNavigate();

  function handleLogout() {
    auth.logout();
    nav("/");
  }

  return (
    <header className="nav">
      <div className="nav-left">
        <Link to="/" className="brand">LeaveMgmt</Link>
        {auth.token && (
          <Link to="/" className="nav-link">Home</Link>
        )}
        {auth.token && auth.role === "employee" && (
          <>
            <Link to="/apply" className="nav-link">Apply Leave</Link>
            <Link to="/my" className="nav-link">My Requests</Link>
          </>
        )}
        {auth.token && auth.role === "manager" && (
          <Link to="/pending" className="nav-link">Pending Requests</Link>
        )}
      </div>

      <div className="nav-right">
        {auth.token ? (
          <>
            <div className="user-info">
              <span>👤</span>
              <span>{auth.name || "User"}</span>
              <span className="muted">({auth.role})</span>
            </div>
            <button className="btn small" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <Link to="/login" className="btn small">Sign In</Link>
        )}
      </div>
    </header>
  );
}
