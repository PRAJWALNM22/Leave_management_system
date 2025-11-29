import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import Toast from "../components/Toast";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("employee");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);
  const nav = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setToast(null);
    
    try {
      await api.post("/auth/register", { name, email, password, role });
      setToast({ message: "Account created successfully! Redirecting to login...", type: "success" });
      setTimeout(() => {
        nav("/login");
      }, 2000);
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Registration failed. Please try again.";
      setError(errorMsg);
      setToast({ message: errorMsg, type: "error" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="login-container">
        <h2>Create Account</h2>
        <p style={{ textAlign: "center", color: "var(--text-muted)", marginBottom: "var(--spacing-lg)" }}>
          Sign up to get started with leave management
        </p>
        
        {error && (
          <div style={{
            background: "var(--danger-light)",
            color: "#991b1b",
            padding: "var(--spacing-md)",
            borderRadius: "var(--radius-md)",
            marginBottom: "var(--spacing-md)",
            border: "1px solid rgba(239, 68, 68, 0.2)"
          }}>
            {error}
          </div>
        )}
        
        <form onSubmit={submit} className="form">
          <label>
            Full Name
            <input 
              placeholder="Enter your full name" 
              value={name} 
              onChange={e => setName(e.target.value)}
              required
            />
          </label>
          
          <label>
            Email Address
            <input 
              type="email"
              placeholder="Enter your email" 
              value={email} 
              onChange={e => setEmail(e.target.value)}
              required
            />
          </label>
          
          <label>
            Password
            <input 
              type="password"
              placeholder="Create a password" 
              value={password} 
              onChange={e => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </label>
          
          <label>
            Role
            <select value={role} onChange={e => setRole(e.target.value)}>
              <option value="employee">Employee</option>
              <option value="manager">Manager</option>
            </select>
          </label>
          
          <div className="form-actions">
            <button className="btn" type="submit" disabled={loading}>
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </div>
          
          <p style={{ textAlign: "center", marginTop: "var(--spacing-md)", marginBottom: 0 }}>
            Already have an account? <Link to="/login" className="register-link">Sign in here</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
