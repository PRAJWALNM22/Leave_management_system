import React, { useEffect, useState } from "react";
import api from "../services/api";
import ConfirmModal from "../components/ConfirmModal";
import Toast from "../components/Toast";

export default function MyRequests() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(null);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, id: null });
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  function fetchRequests() {
    setLoading(true);
    api.get("/leaves/my-requests")
      .then(r => setList(r.data || []))
      .catch(e => {
        console.error(e);
        setToast({ message: "Failed to load requests", type: "error" });
      })
      .finally(() => setLoading(false));
  }

  function handleCancelClick(id) {
    setConfirmModal({ isOpen: true, id });
  }

  async function handleCancel(id) {
    setCancelling(id);
    try {
      await api.delete(`/leaves/${id}`);
      setList(prev => prev.filter(x => x._id !== id));
      setToast({ message: "Leave request cancelled successfully", type: "success" });
      window.dispatchEvent(new Event('leaveUpdated'));
    } catch (err) {
      console.error(err);
      setToast({ message: err.response?.data?.error || "Failed to cancel request", type: "error" });
    } finally {
      setCancelling(null);
    }
  }

  const getStatusBadge = (status) => {
    return <span className={`status-badge ${status.toLowerCase()}`}>{status}</span>;
  };

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
        onClose={() => setConfirmModal({ isOpen: false, id: null })}
        onConfirm={() => {
          handleCancel(confirmModal.id);
          setConfirmModal({ isOpen: false, id: null });
        }}
        title="Cancel Leave Request"
        message="Are you sure you want to cancel this leave request? This action cannot be undone."
        confirmText="Cancel Request"
        type="danger"
      />

      <h2>My Leave Requests</h2>
      
      {loading ? (
        <div className="loading">Loading your requests...</div>
      ) : list.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📋</div>
          <h3>No leave requests yet</h3>
          <p>You haven't submitted any leave requests. Start by applying for leave!</p>
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <table className="table">
            <thead>
              <tr>
                <th>Leave Type</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Total Days</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map(l => (
                <tr key={l._id}>
                  <td style={{ textTransform: "capitalize", fontWeight: 600 }}>
                    {l.leaveType}
                  </td>
                  <td>{new Date(l.startDate).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                  })}</td>
                  <td>{new Date(l.endDate).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                  })}</td>
                  <td style={{ fontWeight: 600 }}>{l.totalDays} day{l.totalDays !== 1 ? 's' : ''}</td>
                  <td>
                    {getStatusBadge(l.status)}
                  </td>
                  <td>
                    {l.status === 'pending' && (
                      <button
                        className="btn small"
                        style={{ 
                          background: "var(--danger)", 
                          fontSize: "0.8rem",
                          padding: "6px 12px"
                        }}
                        onClick={() => handleCancelClick(l._id)}
                        disabled={cancelling === l._id}
                      >
                        {cancelling === l._id ? "Cancelling..." : "Cancel"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
