// src/pages/Pending.jsx
import React, { useEffect, useState } from "react";
import api from "../services/api";
import ConfirmModal from "../components/ConfirmModal";
import Toast from "../components/Toast";

export default function Pending() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, id: null, action: null });
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchPending();
  }, []);

  async function fetchPending() {
    setLoading(true);
    try {
      const res = await api.get("/leaves/pending");
      setList(res.data || []);
    } catch (err) {
      console.error(err);
      setToast({ message: "Could not load pending requests.", type: "error" });
    } finally {
      setLoading(false);
    }
  }

  function handleActionClick(id, action) {
    setConfirmModal({ isOpen: true, id, action });
  }

  async function decide(id, action) {
    const actionText = action === "approve" ? "approve" : "reject";
    
    try {
      const res = await api.put(`/leaves/${id}/${action}`, {});
      // success — remove from list / refresh
      setList(prev => prev.filter(x => x._id !== id));
      // Trigger event to refresh pending count on Home page
      window.dispatchEvent(new Event('leaveUpdated'));
      setToast({ message: `Leave request ${actionText}d successfully`, type: "success" });
    } catch (err) {
      console.error('Error:', err);
      console.error('Error response:', err.response);
      const errorMsg = err.response?.data?.error || err.message || "Action failed";
      setToast({ message: errorMsg, type: "error" });
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

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, id: null, action: null })}
        onConfirm={() => decide(confirmModal.id, confirmModal.action)}
        title={confirmModal.action === "approve" ? "Approve Leave Request" : "Reject Leave Request"}
        message={confirmModal.action === "approve" 
          ? "Are you sure you want to approve this leave request?" 
          : "Are you sure you want to reject this leave request?"}
        confirmText={confirmModal.action === "approve" ? "Approve" : "Reject"}
        type={confirmModal.action === "approve" ? "success" : "danger"}
      />

      <h2>Pending Leave Requests</h2>
      <p style={{ color: "var(--text-muted)", marginBottom: "var(--spacing-lg)" }}>
        Review and manage leave requests from your team
      </p>
      
      {loading && <div className="loading">Loading pending requests...</div>}
      
      {!loading && list.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">✅</div>
          <h3>All caught up!</h3>
          <p>There are no pending leave requests at the moment.</p>
        </div>
      )}
      
      {!loading && list.length > 0 && (
        <div className="pending-grid">
          {list.map(l => (
            <div className="card pending-card" key={l._id}>
              <div className="pending-top">
                <div className="request-user">
                  {l.userId?.name || (typeof l.userId === "string" ? l.userId : "User")}
                </div>
                <div className="request-type" style={{ textTransform: "capitalize" }}>
                  {l.leaveType}
                </div>
              </div>

              <div className="request-dates" style={{ 
                marginBottom: "var(--spacing-md)",
                padding: "var(--spacing-sm)",
                background: "var(--bg)",
                borderRadius: "var(--radius-sm)"
              }}>
                <div style={{ marginBottom: "4px" }}>
                  <strong>Start:</strong> {new Date(l.startDate).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
                <div>
                  <strong>End:</strong> {new Date(l.endDate).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
                <div style={{ 
                  marginTop: "var(--spacing-sm)",
                  paddingTop: "var(--spacing-sm)",
                  borderTop: "1px solid var(--border)",
                  fontWeight: 600,
                  color: "var(--primary)"
                }}>
                  Total: {l.totalDays} day{l.totalDays !== 1 ? 's' : ''}
                </div>
              </div>

              {l.reason && (
                <div className="request-reason" style={{
                  padding: "var(--spacing-sm)",
                  background: "var(--bg)",
                  borderRadius: "var(--radius-sm)",
                  fontStyle: "italic",
                  color: "var(--text-muted)"
                }}>
                  <strong>Reason:</strong> {l.reason}
                </div>
              )}

              <div className="request-actions">
                <button className="btn accept" onClick={() => handleActionClick(l._id, "approve")}>
                  ✓ Approve
                </button>
                <button className="btn reject" onClick={() => handleActionClick(l._id, "reject")}>
                  ✗ Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
