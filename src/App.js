// ============================================================
// src/App.js  –  GoBus Fleet Management – Root Router
// ============================================================

import { useState, useEffect } from "react";
import Login from "./Login";
import CompanyAdmin from "./CompanyAdmin";
import MainAdminPanel from "./MainAdminPanel";
import { API_URL } from "./config/api";

export default function App() {
  const [user, setUser] = useState(() => {
    // Restore session from localStorage on page refresh
    try {
      const saved = localStorage.getItem("bus_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    // Apply background image globally to the body element via JS to bypass Webpack loader errors
    document.body.style.backgroundImage = "url('/bg.jpg')";
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundAttachment = "fixed";
    document.body.style.backgroundRepeat = "no-repeat";
  }, []);

  // ── Login handler: calls real backend ─────────────────────
  // username field accepts:
  //   main admin   → uses /api/auth/main-admin/login
  //   company admin → uses /api/auth/company-admin/login
  // Returns { success, error?, user?, token? }
  const handleLogin = async (username, password) => {
    // Try main-admin first, then company-admin
    const endpoints = [
      { url: `${API_URL}/api/auth/main-admin/login`, role: "main-admin" },
      { url: `${API_URL}/api/auth/company-admin/login`, role: "company-admin" },
    ];

    for (const ep of endpoints) {
      try {
        const res = await fetch(ep.url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        });
        const data = await res.json();
        if (data.success) {
          const userData = {
            ...data.user,
            role: ep.role,
            token: data.token,
          };
          localStorage.setItem("bus_user", JSON.stringify(userData));
          localStorage.setItem("bus_token", data.token);
          setUser(userData);
          return { success: true };
        }
      } catch (err) {
        console.error("Login fetch error:", err);
      }
    }
    return { success: false, error: "Invalid credentials or backend offline." };
  };

  const handleLogout = () => {
    localStorage.removeItem("bus_user");
    localStorage.removeItem("bus_token");
    setUser(null);
  };

  if (!user) return <Login onLogin={handleLogin} />;
  if (user.role === "main-admin") return <MainAdminPanel user={user} onLogout={handleLogout} />;
  if (user.role === "company-admin") return <CompanyAdmin user={user} onLogout={handleLogout} />;

  return <Login onLogin={handleLogin} />;
}