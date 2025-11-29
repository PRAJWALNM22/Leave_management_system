import React, { useEffect } from "react";

export default function Toast({ message, type = "success", onClose, duration = 3000 }) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const bgColor = type === "error" ? "var(--danger)" : type === "warning" ? "var(--warning)" : "var(--success)";
  const icon = type === "error" ? "✗" : type === "warning" ? "⚠" : "✓";

  return (
    <div style={{
      position: "fixed",
      top: "20px",
      right: "20px",
      background: bgColor,
      color: "white",
      padding: "16px 24px",
      borderRadius: "var(--radius-md)",
      boxShadow: "var(--shadow-lg)",
      zIndex: 1001,
      display: "flex",
      alignItems: "center",
      gap: "12px",
      minWidth: "300px",
      animation: "slideIn 0.3s ease"
    }}>
      <span style={{ fontSize: "1.2rem" }}>{icon}</span>
      <span style={{ flex: 1, fontWeight: 500 }}>{message}</span>
      <button
        onClick={onClose}
        style={{
          background: "transparent",
          border: "none",
          color: "white",
          cursor: "pointer",
          fontSize: "1.2rem",
          padding: "0",
          width: "24px",
          height: "24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        ×
      </button>
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

