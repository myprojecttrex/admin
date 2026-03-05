import React, { useState } from "react";
import "./App.css";

export default function Login({ onLogin }) {
  const [form, setForm] = useState({ username: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hoverBtn, setHoverBtn] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    if (!form.username || !form.password) {
      setError("Please enter username and password.");
      return;
    }
    setLoading(true);
    const result = await onLogin(form.username.trim(), form.password);
    if (!result.success) setError(result.error || "Invalid credentials. Try the hints below.");
    setLoading(false);
  };

  const quickFill = (username, pw) => setForm({ username, password: pw });

  const hints = [
    { role: "Main Admin", username: "admin1", pw: "pass123", initial: "M", color: "#4f46e5" },
    { role: "Company Admin", username: "companyadmin", pw: "admin123", initial: "C", color: "#10b981" },
  ];

  const inputStyle = {
    width: "100%", padding: "13px 14px 13px 42px", borderRadius: 10,
    border: "1.5px solid #e2e8f0", fontSize: 14, outline: "none",
    boxSizing: "border-box", color: "#0f172a", background: "rgba(248,250,252,0.8)",
    transition: "border-color .2s, box-shadow .2s",
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", background: "rgba(15, 23, 42, 0.45)" }}>

      {/* Left branding panel */}
      <div style={{
        flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
        padding: 48, color: "white",
        background: "rgba(15, 23, 42, 0.4)", backdropFilter: "blur(3px)",
      }}>
        <div style={{ cursor: "default" }}>
          <div style={{
            width: 56, height: 56, borderRadius: 14,
            background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 13, fontWeight: 800, letterSpacing: 1, color: "white",
            border: "1px solid rgba(255,255,255,.2)", marginBottom: 20,
          }}>
            GB
          </div>
          <h1 style={{
            fontSize: 38, fontWeight: 800, margin: "0 0 12px", letterSpacing: -0.5,
            textShadow: "0 2px 12px rgba(0,0,0,.4)", cursor: "default",
          }}>GoBus Admin</h1>
          <p style={{
            fontSize: 15, opacity: .85, maxWidth: 320, lineHeight: 1.7,
            textShadow: "0 1px 4px rgba(0,0,0,.3)", cursor: "default",
          }}>
            Smart Real-Time Bus Tracking System — Monitor your fleet live, manage drivers, and trips.
          </p>
          <div style={{ marginTop: 36, display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              ["Live GPS tracking via driver mobile", "◉"],
              ["Route & trip management", "◈"],
              ["Real-time analytics & reports", "◎"],
            ].map(([text, dot]) => (
              <div key={text} style={{
                display: "flex", alignItems: "center", gap: 12, fontSize: 14,
                opacity: .85, textShadow: "0 1px 3px rgba(0,0,0,.3)", cursor: "default",
              }}>
                <span style={{ fontSize: 14, opacity: .7 }}>{dot}</span>{text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right login panel */}
      <div style={{
        width: 480, background: "rgba(255, 255, 255, 0.9)", backdropFilter: "blur(20px)",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        padding: 48, borderLeft: "1px solid rgba(255,255,255,.3)",
      }}>
        <div style={{ width: "100%", maxWidth: 380 }}>

          <h2 style={{ fontSize: 26, fontWeight: 800, color: "#0f172a", margin: "0 0 6px", cursor: "default" }}>Welcome Back</h2>
          <p style={{ color: "#64748b", marginBottom: 32, fontSize: 14, cursor: "default" }}>Sign in with your admin username</p>

          <form onSubmit={handleSubmit}>

            {/* Username */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: "#64748b", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: .5 }}>Username</label>
              <div style={{ position: "relative" }}>
                <svg style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", width: 16, height: 16 }} viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                </svg>
                <input
                  name="username" type="text" value={form.username} onChange={handleChange}
                  placeholder="Enter username" autoComplete="off"
                  style={inputStyle}
                  onFocus={e => { e.target.style.borderColor = "#4f46e5"; e.target.style.boxShadow = "0 0 0 3px rgba(79,70,229,.1)"; }}
                  onBlur={e => { e.target.style.borderColor = "#e2e8f0"; e.target.style.boxShadow = "none"; }}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: "#64748b", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: .5 }}>Password</label>
              <div style={{ position: "relative" }}>
                <svg style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", width: 16, height: 16 }} viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <input
                  name="password" type={showPass ? "text" : "password"} value={form.password}
                  onChange={handleChange} placeholder="••••••••"
                  style={{ ...inputStyle, paddingRight: 44 }}
                  onFocus={e => { e.target.style.borderColor = "#4f46e5"; e.target.style.boxShadow = "0 0 0 3px rgba(79,70,229,.1)"; }}
                  onBlur={e => { e.target.style.borderColor = "#e2e8f0"; e.target.style.boxShadow = "none"; }}
                />
                <button type="button" onClick={() => setShowPass(p => !p)}
                  style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9ca3af", padding: 0, display: "flex" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {showPass ? <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" /><line x1="1" y1="1" x2="23" y2="23" /></> : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>}
                  </svg>
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div style={{ background: "#fef2f2", color: "#991b1b", padding: "10px 14px", borderRadius: 10, fontSize: 13, fontWeight: 600, marginBottom: 16, border: "1px solid #fecaca" }}>
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit" disabled={isLoading}
              onMouseEnter={() => setHoverBtn(true)}
              onMouseLeave={() => setHoverBtn(false)}
              style={{
                width: "100%", background: hoverBtn && !isLoading ? "#4338ca" : "#4f46e5",
                color: "white", border: "none", padding: "14px", borderRadius: 10,
                fontSize: 15, fontWeight: 700, cursor: isLoading ? "not-allowed" : "pointer",
                opacity: isLoading ? .7 : 1, transition: "background .2s, transform .15s, box-shadow .2s",
                transform: hoverBtn && !isLoading ? "translateY(-1px)" : "none",
                boxShadow: hoverBtn && !isLoading ? "0 6px 20px rgba(79,70,229,.35)" : "0 2px 8px rgba(79,70,229,.2)",
              }}>
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Demo credential hints */}
          <div style={{ marginTop: 28 }}>
            <div style={{ fontSize: 11, color: "#94a3b8", textAlign: "center", marginBottom: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>
              Demo Accounts
            </div>
            {hints.map(h => (
              <button
                key={h.role}
                onClick={() => quickFill(h.username, h.pw)}
                style={{
                  width: "100%", background: "rgba(248,250,252,0.8)", border: "1.5px solid #e2e8f0",
                  borderRadius: 10, padding: "11px 14px", marginBottom: 8, cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 12,
                  transition: "border-color .2s, background .2s, transform .15s, box-shadow .2s",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = h.color;
                  e.currentTarget.style.background = `${h.color}08`;
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow = `0 4px 12px ${h.color}18`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = "#e2e8f0";
                  e.currentTarget.style.background = "rgba(248,250,252,0.8)";
                  e.currentTarget.style.transform = "none";
                  e.currentTarget.style.boxShadow = "none";
                }}>
                <div style={{
                  width: 34, height: 34, borderRadius: 8,
                  background: `${h.color}12`, color: h.color,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 14, fontWeight: 800,
                }}>{h.initial}</div>
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{h.role}</div>
                  <div style={{ fontSize: 11, color: "#94a3b8" }}>
                    {h.username} · <strong>{h.pw}</strong>
                  </div>
                </div>
                <span style={{ marginLeft: "auto", fontSize: 11, color: h.color, fontWeight: 700 }}>Fill →</span>
              </button>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}