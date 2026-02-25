// ═══════════════════════════════════════════════════════════
// TRIP CODE MANAGER — Company Admin Panel
// File: src/TripCodeManager.js
// Trip codes are NUMBERS ONLY (6-digit) e.g. 100234
// Uses Firebase directly — NO backend server needed
// ═══════════════════════════════════════════════════════════

import React, { useState, useEffect } from "react";
import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase, ref, set, get, update, onValue } from "firebase/database";

// ── Firebase Config ────────────────────────────────────────
const firebaseConfig = {
  apiKey: "AIzaSyBRDCFSJl___6-r3l2FAUdqn0fQ9eVvjRU",
  authDomain: "expo-projects-f6ba3.firebaseapp.com",
  databaseURL: "https://expo-projects-f6ba3-default-rtdb.firebaseio.com",
  projectId: "expo-projects-f6ba3",
};
const _app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db   = getDatabase(_app);

// ── Generate 6-digit numeric trip code ────────────────────
function generateNumericCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// ── Ensure code is unique in Firebase ─────────────────────
async function generateUniqueCode() {
  let code;
  let attempts = 0;
  do {
    code = generateNumericCode();
    const snap = await get(ref(db, `tripCodes/${code}`));
    if (!snap.exists()) break;
    attempts++;
    if (attempts > 10) throw new Error("Could not generate unique code");
  } while (true);
  return code;
}

// ── Shared styles ──────────────────────────────────────────
const INP = {
  padding: "10px 13px",
  borderRadius: 10,
  border: "1.5px solid #e2e8f0",
  fontSize: 14,
  outline: "none",
  color: "#1e293b",
  width: "100%",
  boxSizing: "border-box",
  background: "white",
};

const statusColor = {
  pending:  "#f59e0b",
  active:   "#10b981",
  ended:    "#6b7280",
  expired:  "#ef4444",
};

// ══════════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════════
export default function TripCodeManager({ drivers = [], buses = [] }) {
  const [form, setForm]       = useState({ driverPhone: "", busNo: "", from: "", to: "" });
  const [loading, setLoading] = useState(false);
  const [result, setResult]   = useState(null);
  const [allTrips, setAllTrips] = useState([]);
  const [copied, setCopied]   = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm]     = useState("");

  // ── Load all trip codes from Firebase in real-time ──────
  useEffect(() => {
    const tripsRef = ref(db, "tripCodes");
    const unsub = onValue(tripsRef, (snap) => {
      if (snap.exists()) {
        const data = snap.val();
        const list = Object.values(data).sort((a, b) => b.createdAt - a.createdAt);
        setAllTrips(list);
      } else {
        setAllTrips([]);
      }
    });
    return () => unsub();
  }, []);

  // ── Create Trip → Generate numeric code → Save Firebase ─
  async function createTrip() {
    if (!form.driverPhone || !form.busNo || !form.from || !form.to) {
      alert("Please fill all fields.");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const driver = drivers.find(d => d.phone === form.driverPhone);
      if (!driver) {
        alert("Driver not found.");
        setLoading(false);
        return;
      }

      // Generate unique 6-digit numeric code
      const tripCode = await generateUniqueCode();

      const now     = Date.now();
      const expires = now + 24 * 60 * 60 * 1000; // 24 hours

      const tripData = {
        tripCode,                          // e.g. "100234"
        driverPhone: String(form.driverPhone),
        driverName:  driver.name,
        busNo:       form.busNo,
        from:        form.from,
        to:          form.to,
        status:      "pending",
        createdAt:   now,
        expiresAt:   expires,
      };

      // Save to Firebase tripCodes/{tripCode}
      await set(ref(db, `tripCodes/${tripCode}`), tripData);

      // Also save basic info to trips/ node for GPS tracking linkage
      await set(ref(db, `trips/${tripCode}`), {
        from:        form.from,
        to:          form.to,
        busNo:       form.busNo,
        driverPhone: String(form.driverPhone),
        driverName:  driver.name,
        status:      "pending",
        createdAt:   now,
      });

      setResult({ tripCode, data: tripData });
      setForm({ driverPhone: "", busNo: "", from: "", to: "" });

    } catch (err) {
      alert("Error: " + err.message);
    }

    setLoading(false);
  }

  // ── End a trip manually from admin ──────────────────────
  async function endTrip(tripCode) {
    if (!window.confirm(`End trip ${tripCode}?`)) return;
    await update(ref(db, `tripCodes/${tripCode}`), { status: "ended", endedAt: Date.now() });
    await update(ref(db, `trips/${tripCode}`),     { status: "ended", endedAt: Date.now() });
  }

  function copyCode(code) {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(false), 2000);
  }

  // ── Filter trips ─────────────────────────────────────────
  const filtered = allTrips.filter(t => {
    const matchStatus = filterStatus === "all" || t.status === filterStatus;
    const matchSearch = !searchTerm ||
      t.tripCode.includes(searchTerm) ||
      t.driverName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.driverPhone?.includes(searchTerm);
    return matchStatus && matchSearch;
  });

  // ── Stats ────────────────────────────────────────────────
  const stats = {
    total:   allTrips.length,
    pending: allTrips.filter(t => t.status === "pending").length,
    active:  allTrips.filter(t => t.status === "active").length,
    ended:   allTrips.filter(t => t.status === "ended").length,
  };

  // ════════════════════════════════════════════════════════
  // RENDER
  // ════════════════════════════════════════════════════════
  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif" }}>

      {/* ── Header ── */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: "#0f172a" }}>
          🎫 Trip Code Manager
        </h2>
        <p style={{ margin: "4px 0 0", fontSize: 13, color: "#64748b" }}>
          Generate numeric trip codes for drivers • Codes are 6-digit numbers only
        </p>
      </div>

      {/* ── Stats Row ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
        {[
          { label: "Total Trips", value: stats.total,   color: "#4f46e5", bg: "#eef2ff" },
          { label: "Pending",     value: stats.pending, color: "#f59e0b", bg: "#fffbeb" },
          { label: "Active",      value: stats.active,  color: "#10b981", bg: "#f0fdf4" },
          { label: "Ended",       value: stats.ended,   color: "#6b7280", bg: "#f9fafb" },
        ].map(s => (
          <div key={s.label} style={{ background: s.bg, borderRadius: 16, padding: "16px 20px" }}>
            <div style={{ fontSize: 28, fontWeight: 900, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 12, color: "#64748b", fontWeight: 600, marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "400px 1fr", gap: 24 }}>

        {/* ══ LEFT — CREATE FORM ══ */}
        <div style={{ background: "#fff", borderRadius: 20, padding: 26, boxShadow: "0 4px 20px rgba(0,0,0,.07)" }}>
          <h3 style={{ margin: "0 0 20px", fontSize: 16, fontWeight: 800, color: "#0f172a" }}>
            ➕ Create New Trip
          </h3>

          {/* Driver Select */}
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: .5, display: "block", marginBottom: 6 }}>
              Assign Driver *
            </label>
            <select
              style={INP}
              value={form.driverPhone}
              onChange={e => {
                const d = drivers.find(x => x.phone === e.target.value);
                setForm(f => ({
                  ...f,
                  driverPhone: e.target.value,
                  busNo: d?.busId ? (buses.find(b => b.id === d.busId)?.number || "") : "",
                }));
              }}
            >
              <option value="">— Select Driver —</option>
              {drivers.map(d => (
                <option key={d.id} value={d.phone}>
                  {d.name} · {d.phone}
                </option>
              ))}
            </select>
          </div>

          {/* Bus Select */}
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: .5, display: "block", marginBottom: 6 }}>
              Bus *
            </label>
            <select
              style={INP}
              value={form.busNo}
              onChange={e => setForm(f => ({ ...f, busNo: e.target.value }))}
            >
              <option value="">— Select Bus —</option>
              {buses.map(b => (
                <option key={b.id} value={b.number}>{b.number} · {b.model}</option>
              ))}
            </select>
          </div>

          {/* From */}
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: .5, display: "block", marginBottom: 6 }}>
              From *
            </label>
            <input
              style={INP}
              placeholder="e.g. Chennai"
              value={form.from}
              onChange={e => setForm(f => ({ ...f, from: e.target.value }))}
            />
          </div>

          {/* To */}
          <div style={{ marginBottom: 22 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: .5, display: "block", marginBottom: 6 }}>
              To *
            </label>
            <input
              style={INP}
              placeholder="e.g. Madurai"
              value={form.to}
              onChange={e => setForm(f => ({ ...f, to: e.target.value }))}
            />
          </div>

          <button
            onClick={createTrip}
            disabled={loading}
            style={{
              width: "100%",
              background: loading ? "#94a3b8" : "linear-gradient(135deg, #4f46e5, #7c3aed)",
              color: "#fff",
              border: "none",
              padding: "14px",
              fontSize: 15,
              fontWeight: 800,
              borderRadius: 12,
              cursor: loading ? "not-allowed" : "pointer",
              letterSpacing: .5,
            }}
          >
            {loading ? "⏳ Generating..." : "🔢 Generate Trip Code"}
          </button>

          {/* ── Success Result ── */}
          {result && (
            <div style={{
              marginTop: 22,
              background: "linear-gradient(135deg, #f0fdf4, #dcfce7)",
              border: "2px solid #86efac",
              borderRadius: 18,
              padding: 22,
              textAlign: "center",
            }}>
              <div style={{ fontSize: 13, color: "#166534", fontWeight: 700, marginBottom: 10 }}>
                ✅ Trip Code Generated!
              </div>

              {/* Big numeric code display */}
              <div style={{
                fontSize: 44,
                fontWeight: 900,
                color: "#15803d",
                fontFamily: "monospace",
                letterSpacing: 6,
                marginBottom: 14,
                padding: "10px 0",
                borderBottom: "2px dashed #86efac",
                borderTop: "2px dashed #86efac",
              }}>
                {result.tripCode}
              </div>

              <button
                onClick={() => copyCode(result.tripCode)}
                style={{
                  background: copied === result.tripCode ? "#15803d" : "#4f46e5",
                  color: "#fff",
                  border: "none",
                  padding: "9px 22px",
                  borderRadius: 8,
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: "pointer",
                  marginBottom: 14,
                }}
              >
                {copied === result.tripCode ? "✅ Copied!" : "📋 Copy Code"}
              </button>

              <div style={{ fontSize: 12, color: "#374151", lineHeight: 2 }}>
                <div>👤 <strong>{result.data?.driverName}</strong></div>
                <div>📍 {result.data?.from} → {result.data?.to}</div>
                <div>🚌 {result.data?.busNo}</div>
                <div>⏰ Valid for 24 hours</div>
              </div>

              <div style={{ marginTop: 14, background: "#fff3cd", borderRadius: 10, padding: 10, fontSize: 12, color: "#92400e" }}>
                📲 Share this 6-digit code with the driver via SMS/WhatsApp
              </div>
            </div>
          )}
        </div>

        {/* ══ RIGHT — TRIP LIST ══ */}
        <div style={{ background: "#fff", borderRadius: 20, padding: 26, boxShadow: "0 4px 20px rgba(0,0,0,.07)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "#0f172a" }}>📋 All Trip Codes</h3>
            <span style={{ fontSize: 12, color: "#64748b" }}>Live from Firebase 🔴</span>
          </div>

          {/* Search + Filter */}
          <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
            <input
              style={{ ...INP, flex: 1 }}
              placeholder="🔍 Search by code, driver name, phone..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            <select
              style={{ ...INP, width: 130 }}
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="active">Active</option>
              <option value="ended">Ended</option>
              <option value="expired">Expired</option>
            </select>
          </div>

          {/* Trip List */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10, maxHeight: 480, overflowY: "auto" }}>
            {filtered.length === 0 && (
              <div style={{ textAlign: "center", color: "#94a3b8", padding: 50, fontSize: 14 }}>
                {allTrips.length === 0 ? "No trips created yet. Generate your first trip code!" : "No trips match your search."}
              </div>
            )}

            {filtered.map(trip => (
              <div
                key={trip.tripCode}
                style={{
                  border: "1.5px solid #e2e8f0",
                  borderRadius: 14,
                  padding: "14px 18px",
                  display: "grid",
                  gridTemplateColumns: "120px 1fr auto",
                  gap: 16,
                  alignItems: "center",
                  background: trip.status === "active" ? "#f0fdf4" : "#fff",
                  borderColor: trip.status === "active" ? "#86efac" : "#e2e8f0",
                }}
              >
                {/* Trip Code — big numeric */}
                <div>
                  <div style={{
                    fontFamily: "monospace",
                    fontSize: 22,
                    fontWeight: 900,
                    color: "#4f46e5",
                    letterSpacing: 2,
                  }}>
                    {trip.tripCode}
                  </div>
                  <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 3 }}>
                    {new Date(trip.createdAt).toLocaleDateString("en-IN")}{" "}
                    {new Date(trip.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>

                {/* Details */}
                <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.8 }}>
                  <div>👤 <strong>{trip.driverName}</strong> · 📞 {trip.driverPhone}</div>
                  <div>📍 {trip.from} → {trip.to}</div>
                  <div>🚌 {trip.busNo}</div>
                </div>

                {/* Actions */}
                <div style={{ textAlign: "right", display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-end" }}>
                  <span style={{
                    fontSize: 11,
                    fontWeight: 800,
                    background: `${statusColor[trip.status]}22`,
                    color: statusColor[trip.status],
                    padding: "4px 12px",
                    borderRadius: 20,
                    textTransform: "uppercase",
                    letterSpacing: .5,
                  }}>
                    {trip.status}
                  </span>

                  <div style={{ display: "flex", gap: 6 }}>
                    <button
                      onClick={() => copyCode(trip.tripCode)}
                      style={{ background: "#eef2ff", border: "none", color: "#4f46e5", padding: "5px 10px", borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: "pointer" }}
                    >
                      {copied === trip.tripCode ? "✅" : "📋"} Copy
                    </button>

                    {trip.status === "active" && (
                      <button
                        onClick={() => endTrip(trip.tripCode)}
                        style={{ background: "#fef2f2", border: "none", color: "#ef4444", padding: "5px 10px", borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: "pointer" }}
                      >
                        ⏹ End
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}