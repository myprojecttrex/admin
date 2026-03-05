// ═══════════════════════════════════════════════════════════
// TRIP CODE MANAGER — Company Admin Panel
// File: src/TripCodeManager.js
// Fetches real-time trips from MySQL backend (bus-backend)
// Auto-refreshes every 8 seconds for live status updates
// ═══════════════════════════════════════════════════════════

import React, { useState, useEffect, useCallback } from "react";
import { API_URL } from "./config/api";
import { TN_DISTRICTS } from "./config/constants";

// ── Shared styles ───────────────────────────────────────────
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

const STATUS = {
  pending: { color: "#f59e0b", bg: "#fffbeb", label: "Pending", dot: "#f59e0b" },
  active: { color: "#10b981", bg: "#f0fdf4", label: "Active 🟢", dot: "#10b981" },
  ended: { color: "#6b7280", bg: "#f9fafb", label: "Ended", dot: "#6b7280" },
  expired: { color: "#ef4444", bg: "#fef2f2", label: "Expired", dot: "#ef4444" },
};

function StatusBadge({ status }) {
  const s = STATUS[status] || STATUS.ended;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      fontSize: 11, fontWeight: 800,
      background: s.bg, color: s.color,
      padding: "4px 12px", borderRadius: 20,
      textTransform: "uppercase", letterSpacing: 0.5,
    }}>
      <span style={{
        width: 7, height: 7, borderRadius: "50%", background: s.dot, display: "inline-block",
        boxShadow: status === "active" ? `0 0 0 3px ${s.dot}44` : "none",
        animation: status === "active" ? "pulse 2s infinite" : "none",
      }} />
      {s.label}
    </span>
  );
}

function fmtTime(ts) {
  if (!ts) return "—";
  const d = new Date(ts);
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" }) +
    " " + d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}

function AutocompleteInput({ value, onChange, suggestions = [], placeholder, style }) {
  const [show, setShow] = useState(false);

  // Show all if value is empty, else filter based on value
  const filtered = !value
    ? suggestions
    : suggestions.filter(s => s.toLowerCase().includes(value.toLowerCase()));

  const handleBlur = () => {
    setTimeout(() => {
      setShow(false);
      // Enforce strict selection — clear if not a valid district
      if (value && !suggestions.some(s => s.toLowerCase() === value.toLowerCase())) {
        onChange("");
      } else if (value) {
        // Auto-correct casing to match the canonical name
        const match = suggestions.find(s => s.toLowerCase() === value.toLowerCase());
        if (match && match !== value) onChange(match);
      }
    }, 200);
  };

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <div style={{ position: "relative" }}>
        <input
          style={{ ...style, paddingRight: 30 }}
          placeholder={placeholder}
          value={value}
          onChange={e => { onChange(e.target.value); setShow(true); }}
          onFocus={() => setShow(true)}
          onBlur={handleBlur}
        />
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setShow(!show)}
          style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#94a3b8", fontSize: 10 }}
        >
          ▼
        </button>
      </div>
      {show && filtered.length > 0 && (
        <div style={{
          position: "absolute", top: "100%", left: 0, right: 0,
          background: "white", borderRadius: 10, boxShadow: "0 10px 25px rgba(0,0,0,.1)",
          zIndex: 1000, marginTop: 5, maxHeight: 150, overflowY: "auto", border: "1px solid #e2e8f0"
        }}>
          {filtered.map((s, idx) => (
            <div key={idx} onMouseDown={() => { onChange(s); setShow(false); }} style={{
              padding: "10px 14px", cursor: "pointer", fontSize: 13, borderBottom: "1px solid #f1f5f9", textAlign: "left"
            }} onMouseEnter={e => e.target.style.background = "#f8fafc"} onMouseLeave={e => e.target.style.background = "transparent"}>
              📍 {s}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════════
export default function TripCodeManager({ drivers: propDrivers = [], buses: propBuses = [], routes = [], user }) {
  const token = localStorage.getItem("bus_token");

  // Use static TN_DISTRICTS instead of parsing from routes
  const locations = TN_DISTRICTS;

  // ── Fetch real drivers & buses from backend ───────────────
  const [drivers, setDrivers] = useState(propDrivers);
  const [buses, setBuses] = useState(propBuses);

  // Helper: merge two arrays, deduplicate by key
  const mergeUnique = (arr1, arr2, keyFn) => {
    const map = new Map();
    [...arr1, ...arr2].forEach(item => {
      const key = keyFn(item);
      if (key && !map.has(key)) map.set(key, item);
    });
    return Array.from(map.values());
  };

  useEffect(() => {
    if (!token) return;
    const headers = { Authorization: `Bearer ${token}` };

    fetch(`${API_URL}/api/company/drivers`, { headers })
      .then(r => r.json())
      .then(d => {
        if (d.success && d.drivers) {
          setDrivers(prev => mergeUnique(d.drivers, prev, x => String(x.driver_id || x.id)));
        }
      })
      .catch(() => { });

    fetch(`${API_URL}/api/company/buses`, { headers })
      .then(r => r.json())
      .then(d => {
        if (d.success && d.buses) {
          setBuses(prev => mergeUnique(d.buses, prev, x => String(x.bus_id || x.id)));
        }
      })
      .catch(() => { });
  }, [token]);

  // Sync with parent props when they change (e.g. new driver/bus added)
  useEffect(() => {
    if (propDrivers.length) {
      setDrivers(prev => mergeUnique(prev, propDrivers, x => String(x.driver_id || x.id)));
    }
  }, [propDrivers]);
  useEffect(() => {
    if (propBuses.length) {
      setBuses(prev => mergeUnique(prev, propBuses, x => String(x.bus_id || x.id)));
    }
  }, [propBuses]);

  // ── Form state ────────────────────────────────────────────
  const [form, setForm] = useState({ driver_id: "", bus_id: "", from_location: "", to_location: "" });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  // ── Trip list state ───────────────────────────────────────
  const [allTrips, setAllTrips] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [copied, setCopied] = useState(false);
  const [endingCode, setEndingCode] = useState(null);

  // ── Fetch trips from backend ──────────────────────────────
  const fetchTrips = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/tripcodes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setAllTrips(data.tripCodes || []);
        setLastRefresh(new Date());
      }
    } catch (e) {
      // silently retry
    } finally {
      setFetching(false);
    }
  }, [token]);

  useEffect(() => {
    fetchTrips();
    // Auto-refresh every 8 seconds for real-time updates
    const t = setInterval(fetchTrips, 8000);
    return () => clearInterval(t);
  }, [fetchTrips]);

  // ── Create Trip via backend ───────────────────────────────
  async function createTrip() {
    if (!form.driver_id || !form.bus_id || !form.from_location || !form.to_location) {
      setError("Please fill all fields.");
      return;
    }
    setLoading(true);
    setResult(null);
    setError("");
    try {
      const res = await fetch(`${API_URL}/api/tripcodes/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          driver_id: parseInt(form.driver_id),
          bus_id: parseInt(form.bus_id),
          from_location: form.from_location,
          to_location: form.to_location,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setResult(data);
        setForm({ driver_id: "", bus_id: "", from_location: "", to_location: "" });
        fetchTrips();
      } else {
        setError(data.error || "Failed to generate trip code.");
      }
    } catch {
      setError("Cannot reach backend. Make sure bus-backend is running on port 5000.");
    }
    setLoading(false);
  }

  // ── End a trip via backend ───────────────────────────────
  async function endTrip(trip) {
    if (!window.confirm(`End trip ${trip.trip_code}?`)) return;
    setEndingCode(trip.trip_code);
    try {
      const res = await fetch(`${API_URL}/api/tripcodes/end`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ trip_code: trip.trip_code, phone: trip.driver_phone }),
      });
      const data = await res.json();
      if (data.success) fetchTrips();
      else alert(data.error || "Could not end trip.");
    } catch {
      alert("Backend offline.");
    }
    setEndingCode(null);
  }

  function copyCode(code) {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(false), 2000);
  }

  // ── Filtering ─────────────────────────────────────────────
  const filtered = allTrips.filter(t => {
    const matchStatus = filterStatus === "all" || t.status === filterStatus;
    const matchSearch = !searchTerm ||
      t.trip_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.driver_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.driver_phone?.includes(searchTerm) ||
      t.bus_number?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchStatus && matchSearch;
  });

  // ── Stats ─────────────────────────────────────────────────
  const stats = {
    total: allTrips.length,
    pending: allTrips.filter(t => t.status === "pending").length,
    active: allTrips.filter(t => t.status === "active").length,
    ended: allTrips.filter(t => t.status === "ended").length,
    expired: allTrips.filter(t => t.status === "expired").length,
  };

  // ════════════════════════════════════════════════════════
  // RENDER
  // ════════════════════════════════════════════════════════
  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif" }}>
      <style>{`
        @keyframes pulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(16,185,129,.5); }
          50%      { box-shadow: 0 0 0 6px rgba(16,185,129,.0); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      {/* ── Header ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#0f172a" }}>
            🎫 Trip Management
          </h2>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: "#64748b" }}>
            Generate, track, and manage all trips in real-time
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 11, color: "#64748b" }}>
            {lastRefresh ? `Updated ${lastRefresh.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}` : "Loading..."}
          </span>
          <button
            onClick={fetchTrips}
            style={{ background: "#eef2ff", border: "none", color: "#4f46e5", padding: "8px 14px", borderRadius: 8, fontWeight: 700, fontSize: 12, cursor: "pointer" }}
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* ── Stats Row ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12, marginBottom: 24 }}>
        {[
          { label: "Total", value: stats.total, color: "#4f46e5", bg: "#eef2ff" },
          { label: "Pending", value: stats.pending, color: "#f59e0b", bg: "#fffbeb" },
          { label: "Active", value: stats.active, color: "#10b981", bg: "#f0fdf4" },
          { label: "Ended", value: stats.ended, color: "#6b7280", bg: "#f9fafb" },
          { label: "Expired", value: stats.expired, color: "#ef4444", bg: "#fef2f2" },
        ].map(s => (
          <div
            key={s.label}
            onClick={() => setFilterStatus(filterStatus === s.label.toLowerCase() ? "all" : s.label.toLowerCase())}
            style={{
              background: filterStatus === s.label.toLowerCase() ? s.color : s.bg,
              borderRadius: 14, padding: "14px 18px",
              cursor: "pointer", transition: "all .2s",
              border: `2px solid ${filterStatus === s.label.toLowerCase() ? s.color : "transparent"}`,
            }}
          >
            <div style={{ fontSize: 26, fontWeight: 900, color: filterStatus === s.label.toLowerCase() ? "#fff" : s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, color: filterStatus === s.label.toLowerCase() ? "rgba(255,255,255,.8)" : "#64748b", fontWeight: 700, marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "380px 1fr", gap: 24 }}>

        {/* ══ LEFT — CREATE FORM ══ */}
        <div style={{ background: "#fff", borderRadius: 20, padding: 24, boxShadow: "0 4px 20px rgba(0,0,0,.07)", alignSelf: "start" }}>
          <h3 style={{ margin: "0 0 18px", fontSize: 15, fontWeight: 800, color: "#0f172a" }}>
            ➕ Create New Trip
          </h3>

          {error && (
            <div style={{ background: "#fef2f2", color: "#991b1b", padding: "10px 14px", borderRadius: 10, fontSize: 13, fontWeight: 600, marginBottom: 14 }}>
              ✕ {error}
            </div>
          )}

          {/* Driver Select */}
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: .5, display: "block", marginBottom: 5 }}>
              Assign Driver *
            </label>
            <select
              style={INP}
              value={form.driver_id}
              onChange={e => setForm(f => ({ ...f, driver_id: e.target.value }))}
            >
              <option value="">— Select Driver —</option>
              {drivers.map(d => (
                <option key={d.driver_id || d.id} value={d.driver_id || d.id}>
                  {d.name} · {d.phone}
                </option>
              ))}
            </select>
          </div>

          {/* Bus Select */}
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: .5, display: "block", marginBottom: 5 }}>
              Bus *
            </label>
            <select
              style={INP}
              value={form.bus_id}
              onChange={e => setForm(f => ({ ...f, bus_id: e.target.value }))}
            >
              <option value="">— Select Bus —</option>
              {buses.map(b => (
                <option key={b.bus_id || b.id} value={b.bus_id || b.id}>
                  {b.bus_number || b.number} {b.model ? `(${b.model})` : ""}
                </option>
              ))}
            </select>
          </div>

          {/* From */}
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: .5, display: "block", marginBottom: 5 }}>
              From *
            </label>
            <AutocompleteInput
              style={INP}
              placeholder="e.g. Chennai Central"
              value={form.from_location}
              onChange={val => setForm(f => ({ ...f, from_location: val }))}
              suggestions={locations}
            />
          </div>

          {/* To */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: .5, display: "block", marginBottom: 5 }}>
              To *
            </label>
            <AutocompleteInput
              style={INP}
              placeholder="e.g. Madurai"
              value={form.to_location}
              onChange={val => setForm(f => ({ ...f, to_location: val }))}
              suggestions={locations}
            />
          </div>

          <button
            onClick={createTrip}
            disabled={loading}
            style={{
              width: "100%",
              background: loading ? "#94a3b8" : "linear-gradient(135deg, #4f46e5, #7c3aed)",
              color: "#fff", border: "none",
              padding: "13px", fontSize: 14, fontWeight: 800,
              borderRadius: 12, cursor: loading ? "not-allowed" : "pointer",
              letterSpacing: .5, transition: "all .2s",
            }}
          >
            {loading ? "⏳ Generating..." : "🔢 Generate Trip Code"}
          </button>

          {/* Success result */}
          {result && (
            <div style={{
              marginTop: 20,
              background: "linear-gradient(135deg, #f0fdf4, #dcfce7)",
              border: "2px solid #86efac",
              borderRadius: 16, padding: 20, textAlign: "center",
            }}>
              <div style={{ fontSize: 12, color: "#166534", fontWeight: 700, marginBottom: 8 }}>
                ✅ Trip Code Generated!
              </div>
              <div style={{
                fontSize: 38, fontWeight: 900, color: "#15803d",
                fontFamily: "monospace", letterSpacing: 4,
                marginBottom: 12, padding: "8px 0",
                borderBottom: "2px dashed #86efac", borderTop: "2px dashed #86efac",
              }}>
                {result.tripCode}
              </div>
              <button
                onClick={() => copyCode(result.tripCode)}
                style={{
                  background: copied === result.tripCode ? "#15803d" : "#4f46e5",
                  color: "#fff", border: "none", padding: "8px 20px",
                  borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: "pointer", marginBottom: 12,
                }}
              >
                {copied === result.tripCode ? "✅ Copied!" : "📋 Copy Code"}
              </button>
              <div style={{ fontSize: 12, color: "#374151", lineHeight: 2 }}>
                <div>📍 {result.data?.from} → {result.data?.to}</div>
                <div>🚌 {result.data?.busNo}</div>
                <div>⏰ Valid for 24 hours</div>
              </div>
              <div style={{ marginTop: 10, background: "#fff3cd", borderRadius: 8, padding: "8px 12px", fontSize: 12, color: "#92400e" }}>
                📲 Share this code with the driver
              </div>
            </div>
          )}
        </div>

        {/* ══ RIGHT — REAL-TIME TRIP LIST ══ */}
        <div style={{ background: "#fff", borderRadius: 20, padding: 24, boxShadow: "0 4px 20px rgba(0,0,0,.07)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: "#0f172a" }}>
              📋 All Trips
              {fetching && (
                <span style={{ marginLeft: 10, fontSize: 12, color: "#94a3b8", fontStyle: "italic" }}>Loading…</span>
              )}
            </h3>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{
                fontSize: 10, fontWeight: 800, background: "#fef2f2", color: "#ef4444",
                padding: "3px 10px", borderRadius: 20, letterSpacing: 1,
              }}>● LIVE</span>
              <span style={{ fontSize: 11, color: "#94a3b8" }}>Auto-refresh every 8s</span>
            </div>
          </div>

          {/* Search + Filter by status */}
          <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
            <input
              style={{ ...INP, flex: 1 }}
              placeholder="🔍 Search by code, driver, bus…"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            <select
              style={{ ...INP, width: 140 }}
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status ({allTrips.length})</option>
              <option value="active">Active ({stats.active})</option>
              <option value="pending">Pending ({stats.pending})</option>
              <option value="ended">Ended ({stats.ended})</option>
              <option value="expired">Expired ({stats.expired})</option>
            </select>
          </div>

          {/* Trip Cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10, maxHeight: 520, overflowY: "auto" }}>
            {fetching && allTrips.length === 0 && (
              <div style={{ textAlign: "center", color: "#94a3b8", padding: 60, fontSize: 14 }}>
                <div style={{ fontSize: 30, marginBottom: 8, animation: "spin 1.2s linear infinite", display: "inline-block" }}>⏳</div>
                <div>Fetching trips from database…</div>
              </div>
            )}

            {!fetching && filtered.length === 0 && (
              <div style={{ textAlign: "center", color: "#94a3b8", padding: 60, fontSize: 14 }}>
                {allTrips.length === 0
                  ? "No trips yet. Generate your first trip code!"
                  : "No trips match your filter."}
              </div>
            )}

            {filtered.map(trip => {
              const isActive = trip.status === "active";
              const isEnding = endingCode === trip.trip_code;

              return (
                <div
                  key={trip.trip_code}
                  style={{
                    border: `1.5px solid ${isActive ? "#86efac" : "#e2e8f0"}`,
                    borderRadius: 14,
                    padding: "14px 18px",
                    background: isActive ? "#f0fdf4" : "#fff",
                    transition: "all .3s",
                  }}
                >
                  {/* Row 1: Code + Status + Actions */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                      <div style={{
                        fontFamily: "monospace", fontSize: 24, fontWeight: 900,
                        color: "#4f46e5", letterSpacing: 3,
                        background: "#eef2ff", padding: "6px 14px", borderRadius: 10,
                      }}>
                        {trip.trip_code}
                      </div>
                      <StatusBadge status={trip.status} />
                    </div>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button
                        onClick={() => copyCode(trip.trip_code)}
                        style={{ background: "#eef2ff", border: "none", color: "#4f46e5", padding: "6px 12px", borderRadius: 7, fontSize: 12, fontWeight: 700, cursor: "pointer" }}
                      >
                        {copied === trip.trip_code ? "✅ Copied" : "📋 Copy"}
                      </button>
                      {isActive && (
                        <button
                          onClick={() => endTrip(trip)}
                          disabled={isEnding}
                          style={{ background: "#fef2f2", border: "none", color: "#ef4444", padding: "6px 12px", borderRadius: 7, fontSize: 12, fontWeight: 700, cursor: "pointer", opacity: isEnding ? .6 : 1 }}
                        >
                          {isEnding ? "⏹…" : "⏹ End Trip"}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Row 2: Trip details grid */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                    <Detail icon="👤" label="Driver" value={`${trip.driver_name} · ${trip.driver_phone}`} />
                    <Detail icon="🚌" label="Bus" value={trip.bus_number} />
                    <Detail icon="📍" label="Route" value={`${trip.from_location} → ${trip.to_location}`} />
                    <Detail icon="🕐" label="Created" value={fmtTime(trip.created_at)} />
                    {trip.activated_at && <Detail icon="▶️" label="Started" value={fmtTime(trip.activated_at)} />}
                    {trip.ended_at && <Detail icon="⏹" label="Ended" value={fmtTime(trip.ended_at)} />}
                    {trip.expires_at && trip.status === "pending" &&
                      <Detail icon="⏰" label="Expires" value={fmtTime(trip.expires_at)} />
                    }
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// Small helper for detail row
function Detail({ icon, label, value }) {
  return (
    <div style={{ fontSize: 12, color: "#374151" }}>
      <span style={{ color: "#94a3b8", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: .5 }}>{icon} {label}</span>
      <div style={{ fontWeight: 600, marginTop: 2 }}>{value}</div>
    </div>
  );
}