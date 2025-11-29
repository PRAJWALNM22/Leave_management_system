import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../store/useAuth";
import api from "../services/api";

export default function Home() {
  const auth = useAuth();
  const [statistics, setStatistics] = useState({ 
    totalApplied: 0, 
    totalApproved: 0, 
    totalRejected: 0, 
    totalPending: 0,
    totalRequests: 0
  });
  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingPending, setLoadingPending] = useState(false);

  function fetchStatistics() {
    if (auth.token && auth.role === "employee") {
      setLoading(true);
      api.get("/leaves/statistics")
        .then(res => {
          console.log("Statistics response:", res.data);
          if (res.data && typeof res.data === 'object') {
            setStatistics({
              totalApplied: res.data.totalApplied || 0,
              totalApproved: res.data.totalApproved || 0,
              totalRejected: res.data.totalRejected || 0,
              totalPending: res.data.totalPending || 0,
              totalRequests: res.data.totalRequests || 0
            });
          } else {
            console.warn("Invalid statistics response, defaulting to 0");
            setStatistics({ totalApplied: 0, totalApproved: 0, totalRejected: 0, totalPending: 0, totalRequests: 0 });
          }
        })
        .catch(err => {
          console.error("Failed to load statistics:", err);
          console.error("Error response:", err.response);
          console.error("Error status:", err.response?.status);
          console.error("Error data:", err.response?.data);
          setStatistics({ totalApplied: 0, totalApproved: 0, totalRejected: 0, totalPending: 0, totalRequests: 0 });
        })
        .finally(() => setLoading(false));
    }
  }

  function fetchPendingCount() {
    if (auth.token && auth.role === "manager") {
      setLoadingPending(true);
      api.get("/leaves/pending")
        .then(res => {
          const count = Array.isArray(res.data) ? res.data.length : 0;
          setPendingCount(count);
        })
        .catch(err => {
          console.error("Failed to load pending count:", err);
          setPendingCount(0);
        })
        .finally(() => setLoadingPending(false));
    }
  }

  useEffect(() => {
    if (auth.token) {
      if (auth.role === "employee") {
        fetchStatistics();
      } else if (auth.role === "manager") {
        fetchPendingCount();
      }
    }
    
    // Refresh statistics when page becomes visible (user navigates back)
    const handleVisibilityChange = () => {
      if (!document.hidden && auth.token) {
        if (auth.role === "employee") {
          fetchStatistics();
        } else if (auth.role === "manager") {
          fetchPendingCount();
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Also refresh when window gains focus
    const handleFocus = () => {
      if (auth.token) {
        if (auth.role === "employee") {
          fetchStatistics();
        } else if (auth.role === "manager") {
          fetchPendingCount();
        }
      }
    };
    window.addEventListener('focus', handleFocus);
    
    // Listen for leave updates from other pages
    const handleLeaveUpdate = () => {
      if (auth.token) {
        if (auth.role === "employee") {
          fetchStatistics();
        } else if (auth.role === "manager") {
          fetchPendingCount();
        }
      }
    };
    window.addEventListener('leaveUpdated', handleLeaveUpdate);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('leaveUpdated', handleLeaveUpdate);
    };
  }, [auth.token, auth.role]);

  return (
    <div className="container" style={{ paddingTop: "60px", paddingBottom: "60px" }}>
      <div className="hero" style={{ marginBottom: "48px", padding: "60px 40px" }}>
        <h1 style={{ marginBottom: "20px", fontSize: "3rem" }}>Leave Management System</h1>
        <p style={{ fontSize: "1.2rem", marginBottom: "32px", maxWidth: "700px", margin: "0 auto 32px" }}>
          Streamline your leave requests with our modern, intuitive platform. Built with React, Node.js, and MongoDB.
        </p>
        {!auth.token ? (
          <div className="hero-actions" style={{ gap: "16px" }}>
            <Link to="/login" className="btn" style={{ padding: "14px 28px", fontSize: "1rem" }}>Get Started</Link>
            <Link to="/register" className="btn muted" style={{ padding: "14px 28px", fontSize: "1rem" }}>Create Account</Link>
          </div>
        ) : (
          <div className="hero-actions">
            {auth.role === "manager" ? (
              <Link to="/pending" className="btn" style={{ padding: "14px 28px", fontSize: "1rem" }}>Review Pending Requests</Link>
            ) : (
              <Link to="/apply" className="btn" style={{ padding: "14px 28px", fontSize: "1rem" }}>Apply for Leave</Link>
            )}
          </div>
        )}
      </div>
      
      {auth.token && (
        <>
          <div className="card" style={{ marginBottom: "32px", padding: "32px" }}>
            <h3 style={{ marginBottom: "12px", fontSize: "1.5rem" }}>Welcome back, {auth.name || "User"}!</h3>
            <p style={{ color: "var(--text-muted)", marginBottom: 0, fontSize: "1.05rem", lineHeight: "1.6" }}>
              {auth.role === "manager" 
                ? "You can review and manage pending leave requests from your team."
                : "You can apply for leave or check the status of your requests."}
            </p>
          </div>

          {auth.role === "employee" && (
            <div className="card" style={{ 
              background: "linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(99, 102, 241, 0.08) 100%)",
              padding: "40px",
              marginBottom: "32px"
            }}>
              <div style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center", 
                marginBottom: "32px" 
              }}>
                <h3 style={{ margin: 0, fontSize: "1.5rem" }}>Your Leave Statistics</h3>
                <button 
                  className="btn small" 
                  onClick={fetchStatistics}
                  disabled={loading}
                  style={{ fontSize: "0.85rem", padding: "8px 16px" }}
                >
                  {loading ? "Loading..." : "🔄 Refresh"}
                </button>
              </div>
              {loading ? (
                <div className="loading" style={{ padding: "40px" }}>Loading statistics...</div>
              ) : (
                <>
                  <div style={{ 
                    display: "grid", 
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
                    gap: "24px",
                    marginBottom: "32px"
                  }}>
                    <div style={{ 
                      textAlign: "center", 
                      padding: "32px 24px", 
                      background: "white", 
                      borderRadius: "var(--radius-lg)",
                      boxShadow: "var(--shadow-md)",
                      transition: "transform 0.2s ease"
                    }}>
                      <div style={{ fontSize: "0.95rem", color: "var(--text-muted)", marginBottom: "12px", fontWeight: 500 }}>Total Applied</div>
                      <div style={{ fontSize: "2.5rem", fontWeight: 700, color: "var(--primary)", marginBottom: "8px" }}>
                        {statistics.totalApplied || 0}
                      </div>
                      <div style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>days</div>
                    </div>
                    <div style={{ 
                      textAlign: "center", 
                      padding: "32px 24px", 
                      background: "white", 
                      borderRadius: "var(--radius-lg)",
                      boxShadow: "var(--shadow-md)",
                      transition: "transform 0.2s ease"
                    }}>
                      <div style={{ fontSize: "0.95rem", color: "var(--text-muted)", marginBottom: "12px", fontWeight: 500 }}>Approved</div>
                      <div style={{ fontSize: "2.5rem", fontWeight: 700, color: "var(--success)", marginBottom: "8px" }}>
                        {statistics.totalApproved || 0}
                      </div>
                      <div style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>days</div>
                    </div>
                    <div style={{ 
                      textAlign: "center", 
                      padding: "32px 24px", 
                      background: "white", 
                      borderRadius: "var(--radius-lg)",
                      boxShadow: "var(--shadow-md)",
                      transition: "transform 0.2s ease"
                    }}>
                      <div style={{ fontSize: "0.95rem", color: "var(--text-muted)", marginBottom: "12px", fontWeight: 500 }}>Rejected</div>
                      <div style={{ fontSize: "2.5rem", fontWeight: 700, color: "var(--danger)", marginBottom: "8px" }}>
                        {statistics.totalRejected || 0}
                      </div>
                      <div style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>days</div>
                    </div>
                    <div style={{ 
                      textAlign: "center", 
                      padding: "32px 24px", 
                      background: "white", 
                      borderRadius: "var(--radius-lg)",
                      boxShadow: "var(--shadow-md)",
                      transition: "transform 0.2s ease"
                    }}>
                      <div style={{ fontSize: "0.95rem", color: "var(--text-muted)", marginBottom: "12px", fontWeight: 500 }}>Pending</div>
                      <div style={{ fontSize: "2.5rem", fontWeight: 700, color: "var(--warning)", marginBottom: "8px" }}>
                        {statistics.totalPending || 0}
                      </div>
                      <div style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>days</div>
                    </div>
                  </div>
                  {!loading && (
                    <div style={{ 
                      padding: "20px", 
                      background: "white", 
                      borderRadius: "var(--radius-md)",
                      textAlign: "center",
                      fontSize: "1rem",
                      color: "var(--text-muted)",
                      boxShadow: "var(--shadow-sm)"
                    }}>
                      Total Requests: <strong style={{ color: "var(--text-main)", fontSize: "1.1rem" }}>{statistics.totalRequests || 0}</strong>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {auth.role === "manager" && (
            <div className="card" style={{ 
              background: "linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(99, 102, 241, 0.08) 100%)",
              padding: "40px",
              marginBottom: "32px"
            }}>
              <div style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center", 
                marginBottom: "32px" 
              }}>
                <h3 style={{ margin: 0, fontSize: "1.5rem" }}>Pending Requests Overview</h3>
                <button 
                  className="btn small" 
                  onClick={fetchPendingCount}
                  disabled={loadingPending}
                  style={{ fontSize: "0.85rem", padding: "8px 16px" }}
                >
                  {loadingPending ? "Loading..." : "🔄 Refresh"}
                </button>
              </div>
              {loadingPending ? (
                <div className="loading" style={{ padding: "40px" }}>Loading pending requests...</div>
              ) : (
                <div style={{ 
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "32px"
                }}>
                  <div style={{ 
                    textAlign: "center", 
                    padding: "48px 60px", 
                    background: "white", 
                    borderRadius: "var(--radius-lg)",
                    boxShadow: "var(--shadow-md)",
                    minWidth: "300px"
                  }}>
                    <div style={{ fontSize: "1.1rem", color: "var(--text-muted)", marginBottom: "16px", fontWeight: 500 }}>
                      Pending Leave Requests
                    </div>
                    <div style={{ fontSize: "4rem", fontWeight: 700, color: pendingCount > 0 ? "var(--warning)" : "var(--success)", marginBottom: "12px" }}>
                      {pendingCount}
                    </div>
                    <div style={{ fontSize: "1rem", color: "var(--text-muted)", marginBottom: "24px" }}>
                      {pendingCount === 1 ? "request" : "requests"} awaiting your review
                    </div>
                    {pendingCount > 0 && (
                      <Link 
                        to="/pending" 
                        className="btn" 
                        style={{ 
                          padding: "12px 24px",
                          fontSize: "1rem",
                          textDecoration: "none",
                          display: "inline-block"
                        }}
                      >
                        Review Requests
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
