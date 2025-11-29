import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./style.css";

// Initialize theme on page load
const savedTheme = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const shouldUseDark = savedTheme === 'dark' || (!savedTheme && prefersDark);

if (shouldUseDark) {
  document.documentElement.classList.add('dark');
} else {
  document.documentElement.classList.remove('dark');
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
