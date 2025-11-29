import React from "react";

export default function ConfirmModal({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirm", cancelText = "Cancel", type = "warning" }) {
  if (!isOpen) return null;

  const bgColor = type === "danger" ? "var(--danger)" : type === "success" ? "var(--success)" : "var(--warning)";

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
      padding: "20px"
    }} onClick={onClose}>
      <div style={{
        background: "white",
        borderRadius: "var(--radius-lg)",
        padding: "32px",
        maxWidth: "500px",
        width: "100%",
        boxShadow: "var(--shadow-xl)",
        position: "relative"
      }} onClick={(e) => e.stopPropagation()}>
        <h3 style={{ marginTop: 0, marginBottom: "16px", fontSize: "1.5rem", color: "var(--text-main)" }}>
          {title}
        </h3>
        <p style={{ marginBottom: "24px", color: "var(--text-muted)", fontSize: "1rem", lineHeight: "1.6" }}>
          {message}
        </p>
        <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
          <button
            className="btn muted"
            onClick={onClose}
            style={{ padding: "10px 20px" }}
          >
            {cancelText}
          </button>
          <button
            className="btn"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            style={{ 
              padding: "10px 20px",
              background: bgColor
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

