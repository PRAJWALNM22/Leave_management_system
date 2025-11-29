// src/pages/ApplyLeave.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Toast from "../components/Toast";

export default function ApplyLeave() {
  const [type, setType] = useState("sick");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  function calcTotalDays(s, e) {
    const sd = new Date(s);
    const ed = new Date(e);
    if (isNaN(sd) || isNaN(ed)) return 0;

    const utc1 = Date.UTC(sd.getFullYear(), sd.getMonth(), sd.getDate());
    const utc2 = Date.UTC(ed.getFullYear(), ed.getMonth(), ed.getDate());

    return Math.ceil((utc2 - utc1) / (1000 * 60 * 60 * 24)) + 1;
  }

  async function submit(e) {
    e.preventDefault();
    setError("");
    setToast(null);

    // validation
    if (!start || !end) {
      setError("Please select start and end dates");
      return;
    }

    const totalDays = calcTotalDays(start, end);
    if (totalDays <= 0) {
      setError("End date must be same or after start date");
      return;
    }

    setLoading(true);

    try {
      const body = {
        leaveType: type,
        startDate: start,
        endDate: end,
        reason,
        totalDays,
      };

      console.log("Submitting leave request:", body);
      const res = await api.post("/leaves", body);
      console.log("Leave request response:", res.data);

      if (res && res.data) {
        // CLEAR FORM
        setType("sick");
        setStart("");
        setEnd("");
        setReason("");

        // Trigger a custom event to refresh statistics on Home page
        window.dispatchEvent(new Event('leaveUpdated'));
        
        // Show success toast and redirect to home
        setToast({ message: "Leave applied successfully!", type: "success" });
        setTimeout(() => {
          navigate("/");
        }, 1500);
      }
    } catch (err) {
      console.error("Error submitting leave:", err);
      console.error("Error response:", err.response);
      const errorMsg = err.response?.data?.error || err.message || "Failed to apply leave";
      setError(errorMsg);
      setToast({ message: errorMsg, type: "error" });
    } finally {
      setLoading(false);
    }
  }

  const totalDays = calcTotalDays(start, end);

  return (
    <div className="container">
      <h2>Apply Leave</h2>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

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

      <form onSubmit={submit} className="form card">
        <label>
          Leave Type
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="sick">Sick Leave</option>
            <option value="casual">Casual Leave</option>
            <option value="vacation">Vacation</option>
          </select>
        </label>

        <div style={{ display: "flex", gap: "var(--spacing-md)" }}>
          <label style={{ flex: 1 }}>
            Start Date
            <input 
              type="date" 
              value={start} 
              onChange={(e) => setStart(e.target.value)}
              required
            />
          </label>

          <label style={{ flex: 1 }}>
            End Date
            <input 
              type="date" 
              value={end} 
              onChange={(e) => setEnd(e.target.value)}
              required
            />
          </label>
        </div>

        {start && end && (
          <div style={{
            padding: "var(--spacing-sm)",
            background: "var(--primary-light)",
            borderRadius: "var(--radius-sm)",
            color: "var(--primary)",
            fontWeight: 600,
            fontSize: "0.9rem",
            border: "1px solid rgba(59, 130, 246, 0.2)"
          }}>
            Total Days: {totalDays} day(s)
          </div>
        )}

        <label>
          Reason (Optional)
          <textarea
            placeholder="Provide a reason for your leave request..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={4}
          />
        </label>

        <button 
          className="btn" 
          disabled={loading || !start || !end} 
          type="submit"
          style={{
            opacity: (loading || !start || !end) ? 0.6 : 1,
            cursor: (loading || !start || !end) ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? "Submitting..." : "Submit Leave Request"}
        </button>
      </form>
    </div>
  );
}
