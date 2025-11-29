import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import useAuth from "../store/useAuth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const auth = useAuth();
  const nav = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const res = await api.post("/auth/login", { email, password });
      const { token, role, name } = res.data;
      auth.setAuth(token, role, name);
      nav("/");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <div className="login-container">
        <h2>Welcome Back</h2>
        <p style={{ textAlign: "center", color: "var(--text-muted)", marginBottom: "var(--spacing-lg)" }}>
          Sign in to your account to continue
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
              placeholder="Enter your password" 
              value={password} 
              onChange={e => setPassword(e.target.value)}
              required
            />
          </label>
          
          <div className="form-actions">
            <button className="btn" type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </div>
          
          <p style={{ textAlign: "center", marginTop: "var(--spacing-md)", marginBottom: 0 }}>
            Don't have an account? <Link to="/register" className="register-link">Register here</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
