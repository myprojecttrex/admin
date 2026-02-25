// import React, { useState, useEffect, useRef } from "react";
// import { initializeApp, getApps, getApp } from "firebase/app";
// import { getDatabase, ref, onValue } from "firebase/database";

// // ═══════════════════════════════════════════════════════════
// // SEED DATA
// // ═══════════════════════════════════════════════════════════
// const SEED_BUSES = [
//     { id: 1, number: "TN-01-AB-1234", model: "Ashok Leyland", capacity: 52, fuel: "Diesel", status: "active", routeId: "R-101", driverId: 1, lastService: "2024-11-10", kmRun: 42300, year: 2020 },
//     { id: 2, number: "TN-01-CD-5678", model: "Tata Starbus", capacity: 45, fuel: "CNG", status: "active", routeId: "R-102", driverId: 2, lastService: "2024-10-25", kmRun: 38100, year: 2021 },
//     { id: 3, number: "TN-01-EF-9012", model: "Eicher Pro", capacity: 35, fuel: "Diesel", status: "maintenance", routeId: null, driverId: null, lastService: "2024-09-05", kmRun: 61500, year: 2018 },
//     { id: 4, number: "TN-01-GH-3456", model: "Volvo 9400", capacity: 56, fuel: "Diesel", status: "idle", routeId: null, driverId: null, lastService: "2024-12-01", kmRun: 15200, year: 2023 },
// ];

// const SEED_DRIVERS = [
//     { id: 1, name: "Ramesh Kumar", phone: "9876543210", license: "TN-2023-12345", status: "on-duty", busId: 1, experience: "5 yrs", rating: 4.8, joinDate: "2023-01-15" },
//     { id: 2, name: "Suresh Babu", phone: "9123456780", license: "TN-2022-98765", status: "on-duty", busId: 2, experience: "3 yrs", rating: 4.5, joinDate: "2022-06-20" },
//     { id: 3, name: "Arjun Selvam", phone: "9988776655", license: "TN-2021-54321", status: "off-duty", busId: null, experience: "7 yrs", rating: 4.9, joinDate: "2021-03-10" },
//     { id: 4, name: "Karthik Raj", phone: "9765432100", license: "TN-2020-11223", status: "off-duty", busId: null, experience: "2 yrs", rating: 4.2, joinDate: "2024-02-01" },
// ];

// const SEED_ROUTES = [
//     { id: "R-101", name: "City Center → Airport", from: "City Center", to: "Airport", stops: ["City Center", "Gandhi Nagar", "Anna Salai", "Airport"], distance: "28 km", duration: "55 min", fare: 35, status: "active" },
//     { id: "R-102", name: "Central → Meenakshi", from: "Madurai Central", to: "Meenakshi Temple", stops: ["Madurai Central", "KK Nagar", "Goripalayam", "Meenakshi Temple"], distance: "12 km", duration: "30 min", fare: 15, status: "active" },
//     { id: "R-103", name: "North → South Ring Road", from: "Bypass Jn", to: "Aavin Roundana", stops: ["Bypass Jn", "Arapalayam", "Mattuthavani", "Aavin Roundana"], distance: "18 km", duration: "40 min", fare: 20, status: "inactive" },
// ];

// const SEED_TRIPS = [
//     { id: "T-2001", routeId: "R-101", busId: 1, driverId: 1, date: "2025-02-21", time: "08:00", status: "completed", passengers: 41, revenue: 1435 },
//     { id: "T-2002", routeId: "R-102", busId: 2, driverId: 2, date: "2025-02-21", time: "09:30", status: "in-progress", passengers: 33, revenue: 495 },
//     { id: "T-2003", routeId: "R-101", busId: 1, driverId: 1, date: "2025-02-21", time: "13:00", status: "scheduled", passengers: 0, revenue: 0 },
//     { id: "T-2004", routeId: "R-102", busId: 2, driverId: 2, date: "2025-02-22", time: "07:00", status: "scheduled", passengers: 0, revenue: 0 },
//     { id: "T-2005", routeId: "R-101", busId: 1, driverId: 1, date: "2025-02-20", time: "08:00", status: "completed", passengers: 48, revenue: 1680 },
//     { id: "T-2006", routeId: "R-102", busId: 2, driverId: 2, date: "2025-02-20", time: "10:00", status: "completed", passengers: 38, revenue: 570 },
// ];

// // Simulated GPS locations for live tracking
// const GPS_POSITIONS = [
//     { busId: 1, lat: 9.9252, lng: 78.1198, speed: 42, heading: "North", lastUpdate: "just now", passengers: 33 },
//     { busId: 2, lat: 9.9310, lng: 78.1250, speed: 28, heading: "East", lastUpdate: "30 sec ago", passengers: 21 },
// ];

// const COMPANY = { name: "Sri Murugan Transport Co.", id: "COMP-001", city: "Madurai", state: "Tamil Nadu", contact: "9876500000", email: "admin@smt.in", license: "TN-TRANS-2020-001" };

// const EMPTY_BUS = { number: "", model: "", capacity: "", fuel: "Diesel", status: "idle", routeId: "", driverId: "", lastService: "", kmRun: "", year: "" };
// const EMPTY_DRIVER = { name: "", phone: "", license: "", experience: "", status: "off-duty", busId: "", rating: "5.0", joinDate: "" };
// const EMPTY_ROUTE = { id: "", name: "", from: "", to: "", stops: "", distance: "", duration: "", fare: "", status: "active" };
// const EMPTY_TRIP = { routeId: "", busId: "", driverId: "", date: "", time: "", status: "scheduled" };

// // ═══════════════════════════════════════════════════════════
// // SHARED SMALL COMPONENTS
// // ═══════════════════════════════════════════════════════════
// function Toast({ toast }) {
//     if (!toast) return null;
//     const isErr = toast.type === "error";
//     return (
//         <div style={{
//             position: "fixed", top: 24, right: 24, zIndex: 9999, padding: "13px 22px",
//             borderRadius: 14, fontWeight: 700, fontSize: 14, color: "white",
//             background: isErr ? "#ef4444" : "#10b981",
//             boxShadow: "0 8px 30px rgba(0,0,0,.2)", animation: "caFade .3s ease",
//         }}>
//             {isErr ? "✕ " : "✓ "}{toast.msg}
//         </div>
//     );
// }

// function Badge({ val }) {
//     const map = {
//         active: "#d1fae5,#065f46", idle: "#fef3c7,#92400e", maintenance: "#fee2e2,#991b1b",
//         "on-duty": "#d1fae5,#065f46", "off-duty": "#f3f4f6,#374151",
//         completed: "#d1fae5,#065f46", "in-progress": "#dbeafe,#1e40af",
//         scheduled: "#fef3c7,#92400e", cancelled: "#fee2e2,#991b1b", inactive: "#f3f4f6,#374151",
//     };
//     const [bg, color] = (map[val] || "#f3f4f6,#374151").split(",");
//     return (
//         <span style={{ background: bg, color, padding: "3px 12px", borderRadius: 20, fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: .5 }}>
//             {val}
//         </span>
//     );
// }

// function Modal({ title, onClose, wide, children }) {
//     return (
//         <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,.55)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 16 }}
//             onClick={onClose}>
//             <div style={{ background: "#fff", borderRadius: 22, padding: 32, width: "100%", maxWidth: wide ? 700 : 560, boxShadow: "0 24px 80px rgba(0,0,0,.22)", maxHeight: "90vh", overflowY: "auto" }}
//                 onClick={e => e.stopPropagation()}>
//                 <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
//                     <span style={{ fontSize: 19, fontWeight: 800, color: "#0f172a" }}>{title}</span>
//                     <button onClick={onClose} style={{ background: "#f1f5f9", border: "none", borderRadius: 8, width: 32, height: 32, cursor: "pointer", fontSize: 16, color: "#64748b" }}>✕</button>
//                 </div>
//                 {children}
//             </div>
//         </div>
//     );
// }

// function Field({ label, required, children, span }) {
//     return (
//         <div style={{ display: "flex", flexDirection: "column", gap: 5, gridColumn: span ? "1/-1" : undefined }}>
//             <label style={{ fontSize: 12, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: .5 }}>
//                 {label}{required && <span style={{ color: "#ef4444" }}> *</span>}
//             </label>
//             {children}
//         </div>
//     );
// }

// function StatCard({ icon, label, value, sub, color }) {
//     return (
//         <div style={{ background: "#fff", borderRadius: 18, padding: "22px 24px", boxShadow: "0 4px 20px rgba(0,0,0,.06)", borderLeft: `4px solid ${color}`, display: "flex", gap: 18, alignItems: "center" }}>
//             <div style={{ fontSize: 28, background: `${color}18`, width: 52, height: 52, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>{icon}</div>
//             <div>
//                 <div style={{ fontSize: 26, fontWeight: 800, color: "#0f172a" }}>{value}</div>
//                 <div style={{ fontSize: 13, fontWeight: 600, color: "#334155" }}>{label}</div>
//                 {sub && <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>{sub}</div>}
//             </div>
//         </div>
//     );
// }

// function ConfirmDel({ name, onConfirm, onClose }) {
//     return (
//         <Modal title="⚠️ Confirm Delete" onClose={onClose}>
//             <p style={{ color: "#64748b", marginBottom: 24 }}>Delete <strong style={{ color: "#0f172a" }}>{name}</strong>? This cannot be undone.</p>
//             <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
//                 <button style={B.cancel} onClick={onClose}>Cancel</button>
//                 <button style={B.danger} onClick={onConfirm}>Yes, Delete</button>
//             </div>
//         </Modal>
//     );
// }

// // Shared styles
// const B = {
//     primary: { background: "#4f46e5", color: "#fff", border: "none", padding: "10px 22px", borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: "pointer" },
//     cancel: { background: "#f1f5f9", color: "#475569", border: "none", padding: "10px 22px", borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: "pointer" },
//     danger: { background: "#ef4444", color: "#fff", border: "none", padding: "10px 22px", borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: "pointer" },
//     sm: { border: "none", padding: "6px 13px", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer" },
// };
// const INP = { padding: "10px 13px", borderRadius: 10, border: "1.5px solid #e2e8f0", fontSize: 14, outline: "none", color: "#1e293b", width: "100%", boxSizing: "border-box", background: "white" };
// const SEL = { ...INP, appearance: "auto" };
// const TABLE = {
//     card: { background: "#fff", borderRadius: 18, boxShadow: "0 4px 20px rgba(0,0,0,.06)", overflow: "hidden" },
//     table: { width: "100%", borderCollapse: "collapse" },
//     th: { textAlign: "left", padding: "13px 16px", fontSize: 12, color: "#64748b", background: "#f8fafc", fontWeight: 700, textTransform: "uppercase", letterSpacing: .5, borderBottom: "1px solid #e2e8f0", whiteSpace: "nowrap" },
//     td: { padding: "13px 16px", borderBottom: "1px solid #f1f5f9", fontSize: 14, color: "#374151", verticalAlign: "middle" },
// };
// const PG = {
//     hdr: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 22 },
//     title: { margin: 0, fontSize: 22, fontWeight: 800, color: "#0f172a" },
//     sub: { margin: "4px 0 0", fontSize: 13, color: "#64748b" },
//     bar: { display: "flex", gap: 12, marginBottom: 18, flexWrap: "wrap", alignItems: "center" },
//     srch: { flex: 1, minWidth: 220, padding: "10px 14px", borderRadius: 10, border: "1.5px solid #e2e8f0", fontSize: 14, outline: "none", background: "white" },
// };

// // ═══════════════════════════════════════════════════════════
// // 1. DASHBOARD
// // ═══════════════════════════════════════════════════════════
// function Dashboard({ buses, drivers, routes, trips, company, setPage }) {
//     const today = "2025-02-21";
//     const todayTrips = trips.filter(t => t.date === today);
//     const activeBuses = buses.filter(b => b.status === "active").length;
//     const onDuty = drivers.filter(d => d.status === "on-duty").length;
//     const totalRev = trips.filter(t => t.status === "completed").reduce((s, t) => s + t.revenue, 0);
//     const inProgress = trips.filter(t => t.status === "in-progress").length;

//     // weekly bar chart data (fake)
//     const weekData = [
//         { day: "Mon", trips: 4, rev: 3200 }, { day: "Tue", trips: 6, rev: 4800 },
//         { day: "Wed", trips: 5, rev: 4100 }, { day: "Thu", trips: 7, rev: 5600 },
//         { day: "Fri", trips: 8, rev: 6200 }, { day: "Sat", trips: 3, rev: 2400 }, { day: "Sun", trips: 2, rev: 1600 },
//     ];
//     const maxTrips = Math.max(...weekData.map(d => d.trips));

//     return (
//         <div>
//             <div style={PG.hdr}>
//                 <div>
//                     <h2 style={PG.title}>Company Dashboard</h2>
//                     <p style={PG.sub}>{company.name} · {today}</p>
//                 </div>
//                 <div style={{ background: "#eef2ff", padding: "8px 16px", borderRadius: 10, fontSize: 13, fontWeight: 600, color: "#4f46e5" }}>
//                     🏢 {company.city}, {company.state}
//                 </div>
//             </div>

//             {/* Stats */}
//             <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(210px,1fr))", gap: 16, marginBottom: 28 }}>
//                 <StatCard icon="🚌" label="Total Buses" value={buses.length} sub={`${activeBuses} active now`} color="#4f46e5" />
//                 <StatCard icon="👤" label="Total Drivers" value={drivers.length} sub={`${onDuty} on duty`} color="#8b5cf6" />
//                 <StatCard icon="🗺" label="Routes" value={routes.length} sub={`${routes.filter(r => r.status === "active").length} active`} color="#10b981" />
//                 <StatCard icon="📋" label="Today's Trips" value={todayTrips.length} sub={`${inProgress} in progress`} color="#f59e0b" />
//                 <StatCard icon="💰" label="Total Revenue" value={`₹${totalRev.toLocaleString()}`} sub="All time" color="#06b6d4" />
//                 <StatCard icon="📡" label="Live Buses" value={inProgress} sub="Transmitting GPS" color="#ef4444" />
//             </div>

//             {/* Fleet Status + Weekly Chart */}
//             <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>

//                 {/* Fleet Status */}
//                 <div style={{ background: "#fff", borderRadius: 18, padding: 24, boxShadow: "0 4px 20px rgba(0,0,0,.06)" }}>
//                     <h3 style={{ margin: "0 0 18px", fontSize: 15, fontWeight: 800, color: "#0f172a" }}>Fleet Health</h3>
//                     {[["Active", "active", "#10b981"], ["Idle", "idle", "#f59e0b"], ["Maintenance", "maintenance", "#ef4444"]].map(([lbl, key, col]) => {
//                         const cnt = buses.filter(b => b.status === key).length;
//                         const pct = Math.round((cnt / buses.length) * 100) || 0;
//                         return (
//                             <div key={key} style={{ marginBottom: 14 }}>
//                                 <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5, fontSize: 13 }}>
//                                     <span style={{ fontWeight: 600, color: "#334155" }}>{lbl}</span>
//                                     <span style={{ color: col, fontWeight: 700 }}>{cnt} bus{cnt !== 1 ? "es" : ""} ({pct}%)</span>
//                                 </div>
//                                 <div style={{ height: 8, background: "#f1f5f9", borderRadius: 999 }}>
//                                     <div style={{ width: `${pct}%`, height: "100%", background: col, borderRadius: 999, transition: "width .6s" }} />
//                                 </div>
//                             </div>
//                         );
//                     })}
//                     <button style={{ ...B.primary, marginTop: 12, width: "100%", fontSize: 13 }} onClick={() => setPage("buses")}>
//                         Manage Fleet →
//                     </button>
//                 </div>

//                 {/* Weekly Trips Bar Chart */}
//                 <div style={{ background: "#fff", borderRadius: 18, padding: 24, boxShadow: "0 4px 20px rgba(0,0,0,.06)" }}>
//                     <h3 style={{ margin: "0 0 18px", fontSize: 15, fontWeight: 800, color: "#0f172a" }}>This Week's Trips</h3>
//                     <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 120 }}>
//                         {weekData.map(d => (
//                             <div key={d.day} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
//                                 <span style={{ fontSize: 10, color: "#94a3b8", fontWeight: 700 }}>{d.trips}</span>
//                                 <div style={{ width: "100%", height: `${(d.trips / maxTrips) * 100}px`, background: "linear-gradient(to top,#4f46e5,#818cf8)", borderRadius: "6px 6px 0 0", transition: "height .5s", minHeight: 6 }} />
//                                 <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600 }}>{d.day}</span>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             </div>

//             {/* Today's Trips */}
//             <div style={{ ...TABLE.card, padding: 24 }}>
//                 <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
//                     <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: "#0f172a" }}>Today's Trip Schedule</h3>
//                     <button style={{ ...B.primary, fontSize: 13 }} onClick={() => setPage("trips")}>View All →</button>
//                 </div>
//                 <table style={TABLE.table}>
//                     <thead><tr>
//                         <th style={TABLE.th}>Trip ID</th><th style={TABLE.th}>Route</th>
//                         <th style={TABLE.th}>Bus</th><th style={TABLE.th}>Time</th>
//                         <th style={TABLE.th}>Passengers</th><th style={TABLE.th}>Revenue</th><th style={TABLE.th}>Status</th>
//                     </tr></thead>
//                     <tbody>
//                         {todayTrips.length === 0 && <tr><td colSpan={7} style={{ padding: 24, textAlign: "center", color: "#94a3b8" }}>No trips today.</td></tr>}
//                         {todayTrips.map(t => {
//                             const bus = buses.find(b => b.id === t.busId);
//                             const route = routes.find(r => r.id === t.routeId);
//                             return (
//                                 <tr key={t.id} style={{ cursor: "default" }} onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"} onMouseLeave={e => e.currentTarget.style.background = ""}>
//                                     <td style={TABLE.td}><code style={{ background: "#eef2ff", color: "#4f46e5", padding: "2px 8px", borderRadius: 6, fontSize: 12 }}>{t.id}</code></td>
//                                     <td style={TABLE.td}>{route?.name || t.routeId}</td>
//                                     <td style={TABLE.td}>{bus?.number || "—"}</td>
//                                     <td style={TABLE.td}>{t.time}</td>
//                                     <td style={TABLE.td}>{t.passengers || "—"}</td>
//                                     <td style={TABLE.td}>{t.revenue ? `₹${t.revenue}` : "—"}</td>
//                                     <td style={TABLE.td}><Badge val={t.status} /></td>
//                                 </tr>
//                             );
//                         })}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// }

// // ═══════════════════════════════════════════════════════════
// // 2. BUS MANAGEMENT
// // ═══════════════════════════════════════════════════════════
// function BusManagement({ buses, setBuses, drivers, routes, showToast }) {
//     const [modal, setModal] = useState(null);
//     const [sel, setSel] = useState(null);
//     const [form, setForm] = useState(EMPTY_BUS);
//     const [search, setSearch] = useState("");
//     const [filter, setFilter] = useState("All");

//     const filtered = buses
//         .filter(b => filter === "All" || b.status === filter.toLowerCase())
//         .filter(b => b.number.toLowerCase().includes(search.toLowerCase()) || b.model.toLowerCase().includes(search.toLowerCase()));

//     const driverName = id => drivers.find(d => d.id === id)?.name || "Unassigned";
//     const routeName = id => routes.find(r => r.id === id)?.name || "—";

//     const save = () => {
//         if (!form.number || !form.model || !form.capacity) { showToast("Fill required fields.", "error"); return; }
//         if (modal === "add") {
//             setBuses(p => [...p, { ...form, id: Math.max(...p.map(x => x.id), 0) + 1, capacity: +form.capacity, kmRun: +form.kmRun || 0, driverId: form.driverId ? +form.driverId : null, routeId: form.routeId || null }]);
//             showToast("Bus added successfully.");
//         } else {
//             setBuses(p => p.map(b => b.id === sel.id ? { ...form, id: sel.id, capacity: +form.capacity, kmRun: +form.kmRun || 0, driverId: form.driverId ? +form.driverId : null, routeId: form.routeId || null } : b));
//             showToast("Bus updated.");
//         }
//         setModal(null);
//     };

//     const BusForm = () => (
//         <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 24 }}>
//             <Field label="Bus Number" required><input style={INP} value={form.number} onChange={e => setForm(f => ({ ...f, number: e.target.value }))} placeholder="TN-01-XX-0000" /></Field>
//             <Field label="Model" required><input style={INP} value={form.model} onChange={e => setForm(f => ({ ...f, model: e.target.value }))} placeholder="Ashok Leyland" /></Field>
//             <Field label="Capacity (seats)" required><input style={INP} type="number" value={form.capacity} onChange={e => setForm(f => ({ ...f, capacity: e.target.value }))} /></Field>
//             <Field label="Fuel Type"><select style={SEL} value={form.fuel} onChange={e => setForm(f => ({ ...f, fuel: e.target.value }))}>{["Diesel", "CNG", "Electric", "Petrol"].map(x => <option key={x}>{x}</option>)}</select></Field>
//             <Field label="Status"><select style={SEL} value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>{["active", "idle", "maintenance"].map(x => <option key={x}>{x}</option>)}</select></Field>
//             <Field label="Year of Manufacture"><input style={INP} type="number" value={form.year} onChange={e => setForm(f => ({ ...f, year: e.target.value }))} placeholder="2022" /></Field>
//             <Field label="KM Run"><input style={INP} type="number" value={form.kmRun} onChange={e => setForm(f => ({ ...f, kmRun: e.target.value }))} /></Field>
//             <Field label="Last Service Date"><input style={INP} type="date" value={form.lastService} onChange={e => setForm(f => ({ ...f, lastService: e.target.value }))} /></Field>
//             <Field label="Assign Route" span><select style={SEL} value={form.routeId || ""} onChange={e => setForm(f => ({ ...f, routeId: e.target.value || null }))}>
//                 <option value="">— No Route —</option>{routes.map(r => <option key={r.id} value={r.id}>{r.id}: {r.name}</option>)}
//             </select></Field>
//             <Field label="Assign Driver" span><select style={SEL} value={form.driverId || ""} onChange={e => setForm(f => ({ ...f, driverId: e.target.value || null }))}>
//                 <option value="">— No Driver —</option>{drivers.map(d => <option key={d.id} value={d.id}>{d.name} ({d.status})</option>)}
//             </select></Field>
//         </div>
//     );

//     return (
//         <div>
//             <div style={PG.hdr}>
//                 <div><h2 style={PG.title}>Bus Management</h2><p style={PG.sub}>{buses.length} buses in your fleet</p></div>
//                 <button style={B.primary} onClick={() => { setForm(EMPTY_BUS); setModal("add"); }}>+ Add Bus</button>
//             </div>
//             <div style={PG.bar}>
//                 <input style={PG.srch} placeholder="🔍 Search by number or model..." value={search} onChange={e => setSearch(e.target.value)} />
//                 <div style={{ display: "flex", gap: 6 }}>
//                     {["All", "Active", "Idle", "Maintenance"].map(f => (
//                         <button key={f} onClick={() => setFilter(f)} style={{ padding: "8px 16px", borderRadius: 8, border: "1.5px solid", borderColor: filter === f ? "#4f46e5" : "#e2e8f0", background: filter === f ? "#eef2ff" : "white", color: filter === f ? "#4f46e5" : "#64748b", fontWeight: filter === f ? 700 : 500, fontSize: 13, cursor: "pointer" }}>{f}</button>
//                     ))}
//                 </div>
//             </div>
//             <div style={TABLE.card}>
//                 <table style={TABLE.table}>
//                     <thead><tr>
//                         <th style={TABLE.th}>Bus No.</th><th style={TABLE.th}>Model</th><th style={TABLE.th}>Capacity</th>
//                         <th style={TABLE.th}>Fuel</th><th style={TABLE.th}>Route</th><th style={TABLE.th}>Driver</th>
//                         <th style={TABLE.th}>KM Run</th><th style={TABLE.th}>Status</th><th style={TABLE.th}>Actions</th>
//                     </tr></thead>
//                     <tbody>
//                         {filtered.length === 0 && <tr><td colSpan={9} style={{ padding: 32, textAlign: "center", color: "#94a3b8" }}>No buses found.</td></tr>}
//                         {filtered.map(b => (
//                             <tr key={b.id} onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"} onMouseLeave={e => e.currentTarget.style.background = ""}>
//                                 <td style={TABLE.td}><code style={{ background: "#eef2ff", color: "#4f46e5", padding: "3px 8px", borderRadius: 6, fontSize: 12, fontWeight: 700 }}>{b.number}</code></td>
//                                 <td style={{ ...TABLE.td, fontWeight: 600 }}>{b.model}</td>
//                                 <td style={TABLE.td}>{b.capacity}</td>
//                                 <td style={TABLE.td}>{b.fuel}</td>
//                                 <td style={TABLE.td}>{routeName(b.routeId)}</td>
//                                 <td style={TABLE.td}>{driverName(b.driverId)}</td>
//                                 <td style={TABLE.td}>{(b.kmRun || 0).toLocaleString()} km</td>
//                                 <td style={TABLE.td}><Badge val={b.status} /></td>
//                                 <td style={TABLE.td}>
//                                     <div style={{ display: "flex", gap: 5 }}>
//                                         <button style={{ ...B.sm, background: "#f1f5f9", color: "#475569" }} onClick={() => { setSel(b); setModal("view") }}>👁</button>
//                                         <button style={{ ...B.sm, background: "#dbeafe", color: "#1e40af" }} onClick={() => { setSel(b); setForm({ ...b, driverId: b.driverId || "", routeId: b.routeId || "" }); setModal("edit") }}>✏</button>
//                                         <button style={{ ...B.sm, background: "#fee2e2", color: "#991b1b" }} onClick={() => { setSel(b); setModal("delete") }}>🗑</button>
//                                     </div>
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>

//             {(modal === "add" || modal === "edit") && <Modal title={modal === "add" ? "🚌 Add New Bus" : "✏ Edit Bus"} onClose={() => setModal(null)}><BusForm /><div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}><button style={B.cancel} onClick={() => setModal(null)}>Cancel</button><button style={B.primary} onClick={save}>{modal === "add" ? "Add Bus" : "Save Changes"}</button></div></Modal>}
//             {modal === "view" && sel && <Modal title="🚌 Bus Details" onClose={() => setModal(null)}>
//                 <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
//                     {[["Bus Number", sel.number], ["Model", sel.model], ["Capacity", sel.capacity + " seats"], ["Fuel", sel.fuel], ["Year", sel.year || "—"], ["KM Run", (sel.kmRun || 0).toLocaleString() + " km"], ["Last Service", sel.lastService || "—"], ["Route", routeName(sel.routeId)], ["Driver", driverName(sel.driverId)], ["Status", sel.status]].map(([k, v]) => (
//                         <div key={k} style={{ background: "#f8fafc", padding: "12px 14px", borderRadius: 10 }}>
//                             <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 700, textTransform: "uppercase" }}>{k}</div>
//                             <div style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", marginTop: 3 }}>{v}</div>
//                         </div>
//                     ))}
//                 </div>
//                 <div style={{ display: "flex", justifyContent: "flex-end" }}><button style={B.primary} onClick={() => setModal(null)}>Close</button></div>
//             </Modal>}
//             {modal === "delete" && sel && <ConfirmDel name={sel.number} onConfirm={() => { setBuses(p => p.filter(b => b.id !== sel.id)); setModal(null); showToast("Bus deleted.", "error"); }} onClose={() => setModal(null)} />}
//         </div>
//     );
// }

// // ═══════════════════════════════════════════════════════════
// // 3. DRIVER MANAGEMENT
// // ═══════════════════════════════════════════════════════════
// function DriverManagement({ drivers, setDrivers, buses, showToast }) {
//     const [modal, setModal] = useState(null);
//     const [sel, setSel] = useState(null);
//     const [form, setForm] = useState(EMPTY_DRIVER);
//     const [search, setSearch] = useState("");
//     const [filter, setFilter] = useState("All");

//     const filtered = drivers
//         .filter(d => filter === "All" || d.status === filter.toLowerCase().replace(" ", "-"))
//         .filter(d => d.name.toLowerCase().includes(search.toLowerCase()) || d.license.toLowerCase().includes(search.toLowerCase()));

//     const busNum = id => buses.find(b => b.id === id)?.number || "Unassigned";
//     const stars = r => "★".repeat(Math.floor(r)) + "☆".repeat(5 - Math.floor(r));

//     const save = () => {
//         if (!form.name || !form.phone || !form.license) { showToast("Fill required fields.", "error"); return; }
//         if (modal === "add") {
//             setDrivers(p => [...p, { ...form, id: Math.max(...p.map(x => x.id), 0) + 1, busId: form.busId ? +form.busId : null, rating: +form.rating }]);
//             showToast("Driver added.");
//         } else {
//             setDrivers(p => p.map(d => d.id === sel.id ? { ...form, id: sel.id, busId: form.busId ? +form.busId : null, rating: +form.rating } : d));
//             showToast("Driver updated.");
//         }
//         setModal(null);
//     };

//     const DForm = () => (
//         <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 24 }}>
//             <Field label="Full Name" required><input style={INP} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></Field>
//             <Field label="Phone" required><input style={INP} type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} /></Field>
//             <Field label="License No." required><input style={INP} value={form.license} onChange={e => setForm(f => ({ ...f, license: e.target.value }))} /></Field>
//             <Field label="Experience"><input style={INP} value={form.experience} onChange={e => setForm(f => ({ ...f, experience: e.target.value }))} placeholder="e.g. 5 yrs" /></Field>
//             <Field label="Status"><select style={SEL} value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}><option value="on-duty">On Duty</option><option value="off-duty">Off Duty</option></select></Field>
//             <Field label="Rating (1–5)"><input style={INP} type="number" min="1" max="5" step="0.1" value={form.rating} onChange={e => setForm(f => ({ ...f, rating: e.target.value }))} /></Field>
//             <Field label="Joining Date"><input style={INP} type="date" value={form.joinDate} onChange={e => setForm(f => ({ ...f, joinDate: e.target.value }))} /></Field>
//             <Field label="Assign Bus"><select style={SEL} value={form.busId || ""} onChange={e => setForm(f => ({ ...f, busId: e.target.value || null }))}>
//                 <option value="">— No Bus —</option>{buses.map(b => <option key={b.id} value={b.id}>{b.number}</option>)}
//             </select></Field>
//         </div>
//     );

//     return (
//         <div>
//             <div style={PG.hdr}>
//                 <div><h2 style={PG.title}>Driver Management</h2><p style={PG.sub}>{drivers.length} drivers · {drivers.filter(d => d.status === "on-duty").length} on duty</p></div>
//                 <button style={B.primary} onClick={() => { setForm(EMPTY_DRIVER); setModal("add"); }}>+ Add Driver</button>
//             </div>
//             <div style={PG.bar}>
//                 <input style={PG.srch} placeholder="🔍 Search by name or license..." value={search} onChange={e => setSearch(e.target.value)} />
//                 <div style={{ display: "flex", gap: 6 }}>
//                     {["All", "On Duty", "Off Duty"].map(f => (
//                         <button key={f} onClick={() => setFilter(f)} style={{ padding: "8px 16px", borderRadius: 8, border: "1.5px solid", borderColor: filter === f ? "#4f46e5" : "#e2e8f0", background: filter === f ? "#eef2ff" : "white", color: filter === f ? "#4f46e5" : "#64748b", fontWeight: filter === f ? 700 : 500, fontSize: 13, cursor: "pointer" }}>{f}</button>
//                     ))}
//                 </div>
//             </div>
//             <div style={TABLE.card}>
//                 <table style={TABLE.table}>
//                     <thead><tr>
//                         <th style={TABLE.th}>Name</th><th style={TABLE.th}>Phone</th><th style={TABLE.th}>License</th>
//                         <th style={TABLE.th}>Experience</th><th style={TABLE.th}>Assigned Bus</th>
//                         <th style={TABLE.th}>Rating</th><th style={TABLE.th}>Status</th><th style={TABLE.th}>Actions</th>
//                     </tr></thead>
//                     <tbody>
//                         {filtered.length === 0 && <tr><td colSpan={8} style={{ padding: 32, textAlign: "center", color: "#94a3b8" }}>No drivers found.</td></tr>}
//                         {filtered.map(d => (
//                             <tr key={d.id} onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"} onMouseLeave={e => e.currentTarget.style.background = ""}>
//                                 <td style={{ ...TABLE.td, fontWeight: 700 }}>
//                                     <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//                                         <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg,#4f46e5,#818cf8)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, flexShrink: 0 }}>{d.name[0]}</div>
//                                         {d.name}
//                                     </div>
//                                 </td>
//                                 <td style={TABLE.td}>{d.phone}</td>
//                                 <td style={TABLE.td}><code style={{ background: "#f1f5f9", padding: "2px 7px", borderRadius: 5, fontSize: 12 }}>{d.license}</code></td>
//                                 <td style={TABLE.td}>{d.experience}</td>
//                                 <td style={TABLE.td}>{busNum(d.busId)}</td>
//                                 <td style={TABLE.td}><span style={{ color: "#f59e0b", fontSize: 15 }}>{stars(d.rating)}</span> <span style={{ fontSize: 12, color: "#64748b" }}>{d.rating}</span></td>
//                                 <td style={TABLE.td}><Badge val={d.status} /></td>
//                                 <td style={TABLE.td}>
//                                     <div style={{ display: "flex", gap: 5 }}>
//                                         <button style={{ ...B.sm, background: "#f1f5f9", color: "#475569" }} onClick={() => { setSel(d); setModal("view") }}>👁</button>
//                                         <button style={{ ...B.sm, background: "#dbeafe", color: "#1e40af" }} onClick={() => { setSel(d); setForm({ ...d, busId: d.busId || "" }); setModal("edit") }}>✏</button>
//                                         <button style={{ ...B.sm, background: "#fee2e2", color: "#991b1b" }} onClick={() => { setSel(d); setModal("delete") }}>🗑</button>
//                                     </div>
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>

//             {(modal === "add" || modal === "edit") && <Modal title={modal === "add" ? "👤 Add Driver" : "✏ Edit Driver"} onClose={() => setModal(null)}><DForm /><div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}><button style={B.cancel} onClick={() => setModal(null)}>Cancel</button><button style={B.primary} onClick={save}>{modal === "add" ? "Add Driver" : "Save Changes"}</button></div></Modal>}
//             {modal === "view" && sel && <Modal title="👤 Driver Profile" onClose={() => setModal(null)}>
//                 <div style={{ textAlign: "center", marginBottom: 20 }}>
//                     <div style={{ width: 72, height: 72, borderRadius: "50%", background: "linear-gradient(135deg,#4f46e5,#8b5cf6)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, fontWeight: 800, margin: "0 auto 10px" }}>{sel.name[0]}</div>
//                     <div style={{ fontSize: 20, fontWeight: 800, color: "#0f172a" }}>{sel.name}</div>
//                     <div style={{ color: "#f59e0b", fontSize: 18, marginTop: 4 }}>{"★".repeat(Math.floor(sel.rating))}{"☆".repeat(5 - Math.floor(sel.rating))} <span style={{ fontSize: 13, color: "#64748b" }}>{sel.rating}</span></div>
//                 </div>
//                 <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
//                     {[["Phone", sel.phone], ["License", sel.license], ["Experience", sel.experience], ["Joining Date", sel.joinDate || "—"], ["Assigned Bus", busNum(sel.busId)], ["Status", sel.status]].map(([k, v]) => (
//                         <div key={k} style={{ background: "#f8fafc", padding: "11px 14px", borderRadius: 10 }}>
//                             <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 700, textTransform: "uppercase" }}>{k}</div>
//                             <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", marginTop: 3 }}>{v}</div>
//                         </div>
//                     ))}
//                 </div>
//                 <div style={{ display: "flex", justifyContent: "flex-end" }}><button style={B.primary} onClick={() => setModal(null)}>Close</button></div>
//             </Modal>}
//             {modal === "delete" && sel && <ConfirmDel name={sel.name} onConfirm={() => { setDrivers(p => p.filter(d => d.id !== sel.id)); setModal(null); showToast("Driver deleted.", "error"); }} onClose={() => setModal(null)} />}
//         </div>
//     );
// }

// // ═══════════════════════════════════════════════════════════
// // 4. ROUTE MANAGEMENT
// // ═══════════════════════════════════════════════════════════
// function RouteManagement({ routes, setRoutes, buses, showToast }) {
//     const [modal, setModal] = useState(null);
//     const [sel, setSel] = useState(null);
//     const [form, setForm] = useState(EMPTY_ROUTE);
//     const [search, setSearch] = useState("");

//     const filtered = routes.filter(r =>
//         r.name.toLowerCase().includes(search.toLowerCase()) ||
//         r.from.toLowerCase().includes(search.toLowerCase()) ||
//         r.to.toLowerCase().includes(search.toLowerCase())
//     );

//     const busOnRoute = routeId => buses.find(b => b.routeId === routeId)?.number || "—";

//     const save = () => {
//         if (!form.name || !form.from || !form.to) { showToast("Fill required fields.", "error"); return; }
//         const stopsArr = typeof form.stops === "string" ? form.stops.split(",").map(s => s.trim()).filter(Boolean) : form.stops;
//         if (modal === "add") {
//             const newId = "R-" + (Math.max(...routes.map(r => +r.id.split("-")[1] || 100), 100) + 1);
//             setRoutes(p => [...p, { ...form, id: newId, stops: stopsArr, fare: +form.fare || 0 }]);
//             showToast("Route added.");
//         } else {
//             setRoutes(p => p.map(r => r.id === sel.id ? { ...form, id: sel.id, stops: stopsArr, fare: +form.fare || 0 } : r));
//             showToast("Route updated.");
//         }
//         setModal(null);
//     };

//     const RForm = () => (
//         <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 24 }}>
//             <Field label="Route Name" required span><input style={INP} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="City Center → Airport" /></Field>
//             <Field label="From" required><input style={INP} value={form.from} onChange={e => setForm(f => ({ ...f, from: e.target.value }))} placeholder="Starting point" /></Field>
//             <Field label="To" required><input style={INP} value={form.to} onChange={e => setForm(f => ({ ...f, to: e.target.value }))} placeholder="Ending point" /></Field>
//             <Field label="Distance"><input style={INP} value={form.distance} onChange={e => setForm(f => ({ ...f, distance: e.target.value }))} placeholder="e.g. 25 km" /></Field>
//             <Field label="Duration"><input style={INP} value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} placeholder="e.g. 45 min" /></Field>
//             <Field label="Fare (₹)"><input style={INP} type="number" value={form.fare} onChange={e => setForm(f => ({ ...f, fare: e.target.value }))} /></Field>
//             <Field label="Status"><select style={SEL} value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}><option value="active">Active</option><option value="inactive">Inactive</option></select></Field>
//             <Field label="Stops (comma-separated)" span><input style={INP} value={Array.isArray(form.stops) ? form.stops.join(", ") : form.stops} onChange={e => setForm(f => ({ ...f, stops: e.target.value }))} placeholder="Stop 1, Stop 2, Stop 3" /></Field>
//         </div>
//     );

//     return (
//         <div>
//             <div style={PG.hdr}>
//                 <div><h2 style={PG.title}>Route Management</h2><p style={PG.sub}>{routes.length} routes configured</p></div>
//                 <button style={B.primary} onClick={() => { setForm(EMPTY_ROUTE); setModal("add"); }}>+ Add Route</button>
//             </div>
//             <div style={PG.bar}>
//                 <input style={PG.srch} placeholder="🔍 Search routes..." value={search} onChange={e => setSearch(e.target.value)} />
//             </div>
//             <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(340px,1fr))", gap: 16 }}>
//                 {filtered.length === 0 && <p style={{ color: "#94a3b8", padding: 32 }}>No routes found.</p>}
//                 {filtered.map(r => (
//                     <div key={r.id} style={{ background: "#fff", borderRadius: 18, padding: 22, boxShadow: "0 4px 20px rgba(0,0,0,.06)", borderTop: `4px solid ${r.status === "active" ? "#10b981" : "#e2e8f0"}` }}>
//                         <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
//                             <div>
//                                 <code style={{ background: "#eef2ff", color: "#4f46e5", padding: "2px 8px", borderRadius: 6, fontSize: 11, fontWeight: 700 }}>{r.id}</code>
//                                 <div style={{ fontSize: 16, fontWeight: 800, color: "#0f172a", marginTop: 5 }}>{r.name}</div>
//                             </div>
//                             <Badge val={r.status} />
//                         </div>
//                         <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
//                             {[["📍 From", r.from], ["🏁 To", r.to], ["📏 Distance", r.distance || "—"], ["⏱ Duration", r.duration || "—"], ["💰 Fare", `₹${r.fare}`], ["🚌 Bus", busOnRoute(r.id)]].map(([lbl, val]) => (
//                                 <div key={lbl} style={{ fontSize: 13 }}>
//                                     <span style={{ color: "#94a3b8" }}>{lbl}:</span> <strong style={{ color: "#334155" }}>{val}</strong>
//                                 </div>
//                             ))}
//                         </div>
//                         {/* Stops timeline */}
//                         <div style={{ marginBottom: 14 }}>
//                             <div style={{ fontSize: 12, color: "#94a3b8", fontWeight: 700, marginBottom: 6 }}>STOPS ({r.stops?.length})</div>
//                             <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 0 }}>
//                                 {(r.stops || []).map((s, i) => (
//                                     <React.Fragment key={i}>
//                                         <span style={{ fontSize: 12, background: "#f1f5f9", color: "#334155", padding: "3px 9px", borderRadius: 20, fontWeight: 600 }}>{s}</span>
//                                         {i < r.stops.length - 1 && <span style={{ color: "#cbd5e1", fontSize: 14, margin: "0 2px" }}>→</span>}
//                                     </React.Fragment>
//                                 ))}
//                             </div>
//                         </div>
//                         <div style={{ display: "flex", gap: 8 }}>
//                             <button style={{ ...B.sm, background: "#f1f5f9", color: "#475569", flex: 1 }} onClick={() => { setSel(r); setModal("view") }}>👁 View</button>
//                             <button style={{ ...B.sm, background: "#dbeafe", color: "#1e40af", flex: 1 }} onClick={() => { setSel(r); setForm({ ...r, stops: Array.isArray(r.stops) ? r.stops.join(", ") : r.stops }); setModal("edit") }}>✏ Edit</button>
//                             <button style={{ ...B.sm, background: "#fee2e2", color: "#991b1b", flex: 1 }} onClick={() => { setSel(r); setModal("delete") }}>🗑 Delete</button>
//                         </div>
//                     </div>
//                 ))}
//             </div>

//             {(modal === "add" || modal === "edit") && <Modal title={modal === "add" ? "🗺 Add Route" : "✏ Edit Route"} onClose={() => setModal(null)} wide><RForm /><div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}><button style={B.cancel} onClick={() => setModal(null)}>Cancel</button><button style={B.primary} onClick={save}>{modal === "add" ? "Add Route" : "Save Changes"}</button></div></Modal>}
//             {modal === "delete" && sel && <ConfirmDel name={sel.name} onConfirm={() => { setRoutes(p => p.filter(r => r.id !== sel.id)); setModal(null); showToast("Route deleted.", "error"); }} onClose={() => setModal(null)} />}
//         </div>
//     );
// }

// // ═══════════════════════════════════════════════════════════
// // 5. TRIP MANAGEMENT
// // ═══════════════════════════════════════════════════════════
// function TripManagement({ trips, setTrips, buses, drivers, routes, showToast }) {
//     const [modal, setModal] = useState(null);
//     const [sel, setSel] = useState(null);
//     const [form, setForm] = useState(EMPTY_TRIP);
//     const [filter, setFilter] = useState("All");
//     const [dateFilter, setDateFilter] = useState("");

//     const filtered = trips
//         .filter(t => filter === "All" || t.status === filter.toLowerCase().replace(" ", "-"))
//         .filter(t => !dateFilter || t.date === dateFilter);

//     const busNum = id => buses.find(b => b.id === +id)?.number || "—";
//     const drvName = id => drivers.find(d => d.id === +id)?.name || "—";
//     const rtName = id => routes.find(r => r.id === id)?.name || id;

//     const save = () => {
//         if (!form.routeId || !form.busId || !form.driverId || !form.date || !form.time) { showToast("Fill all required fields.", "error"); return; }
//         // Conflict check: same bus on same date+time
//         const conflict = trips.find(t => t.id !== sel?.id && t.busId === +form.busId && t.date === form.date && t.time === form.time);
//         if (conflict) { showToast(`Bus already has a trip at ${form.time} on ${form.date}!`, "error"); return; }
//         if (modal === "add") {
//             const newId = "T-" + (Math.max(...trips.map(t => +t.id.split("-")[1] || 2000), 2000) + 1);
//             setTrips(p => [...p, { ...form, id: newId, busId: +form.busId, driverId: +form.driverId, passengers: 0, revenue: 0 }]);
//             showToast("Trip scheduled.");
//         } else {
//             setTrips(p => p.map(t => t.id === sel.id ? { ...form, id: sel.id, busId: +form.busId, driverId: +form.driverId, passengers: +form.passengers || 0, revenue: +form.revenue || 0 } : t));
//             showToast("Trip updated.");
//         }
//         setModal(null);
//     };

//     const TForm = () => (
//         <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 24 }}>
//             <Field label="Route" required span><select style={SEL} value={form.routeId} onChange={e => setForm(f => ({ ...f, routeId: e.target.value }))}>
//                 <option value="">— Select Route —</option>{routes.map(r => <option key={r.id} value={r.id}>{r.id}: {r.name}</option>)}
//             </select></Field>
//             <Field label="Bus" required><select style={SEL} value={form.busId} onChange={e => setForm(f => ({ ...f, busId: e.target.value }))}>
//                 <option value="">— Select Bus —</option>{buses.map(b => <option key={b.id} value={b.id}>{b.number}</option>)}
//             </select></Field>
//             <Field label="Driver" required><select style={SEL} value={form.driverId} onChange={e => setForm(f => ({ ...f, driverId: e.target.value }))}>
//                 <option value="">— Select Driver —</option>{drivers.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
//             </select></Field>
//             <Field label="Date" required><input style={INP} type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} /></Field>
//             <Field label="Departure Time" required><input style={INP} type="time" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} /></Field>
//             <Field label="Status"><select style={SEL} value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
//                 {["scheduled", "in-progress", "completed", "cancelled"].map(s => <option key={s} value={s}>{s}</option>)}
//             </select></Field>
//             {modal === "edit" && <>
//                 <Field label="Passengers"><input style={INP} type="number" value={form.passengers || 0} onChange={e => setForm(f => ({ ...f, passengers: e.target.value }))} /></Field>
//                 <Field label="Revenue (₹)"><input style={INP} type="number" value={form.revenue || 0} onChange={e => setForm(f => ({ ...f, revenue: e.target.value }))} /></Field>
//             </>}
//         </div>
//     );

//     const statusColors = { scheduled: "#f59e0b", "in-progress": "#3b82f6", completed: "#10b981", cancelled: "#ef4444" };

//     return (
//         <div>
//             <div style={PG.hdr}>
//                 <div><h2 style={PG.title}>Trip Management</h2><p style={PG.sub}>{trips.length} total trips · {trips.filter(t => t.status === "in-progress").length} live now</p></div>
//                 <button style={B.primary} onClick={() => { setForm(EMPTY_TRIP); setModal("add") }}>+ Schedule Trip</button>
//             </div>

//             {/* Summary chips */}
//             <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
//                 {["scheduled", "in-progress", "completed", "cancelled"].map(s => {
//                     const cnt = trips.filter(t => t.status === s).length;
//                     return <div key={s} style={{ background: "white", borderRadius: 12, padding: "10px 18px", boxShadow: "0 2px 8px rgba(0,0,0,.06)", display: "flex", alignItems: "center", gap: 8 }}>
//                         <div style={{ width: 10, height: 10, borderRadius: "50%", background: statusColors[s] }} />
//                         <span style={{ fontSize: 13, color: "#64748b", textTransform: "capitalize" }}>{s}:</span>
//                         <strong style={{ color: "#0f172a" }}>{cnt}</strong>
//                     </div>;
//                 })}
//             </div>

//             <div style={PG.bar}>
//                 <div style={{ display: "flex", gap: 6 }}>
//                     {["All", "Scheduled", "In Progress", "Completed", "Cancelled"].map(f => (
//                         <button key={f} onClick={() => setFilter(f)} style={{ padding: "8px 14px", borderRadius: 8, border: "1.5px solid", borderColor: filter === f ? "#4f46e5" : "#e2e8f0", background: filter === f ? "#eef2ff" : "white", color: filter === f ? "#4f46e5" : "#64748b", fontWeight: filter === f ? 700 : 500, fontSize: 12, cursor: "pointer" }}>{f}</button>
//                     ))}
//                 </div>
//                 <input type="date" style={{ ...PG.srch, flex: "unset", width: 160 }} value={dateFilter} onChange={e => setDateFilter(e.target.value)} title="Filter by date" />
//                 {dateFilter && <button onClick={() => setDateFilter("")} style={{ ...B.sm, background: "#fee2e2", color: "#991b1b" }}>✕ Clear</button>}
//             </div>

//             <div style={TABLE.card}>
//                 <table style={TABLE.table}>
//                     <thead><tr>
//                         <th style={TABLE.th}>Trip ID</th><th style={TABLE.th}>Route</th><th style={TABLE.th}>Bus</th>
//                         <th style={TABLE.th}>Driver</th><th style={TABLE.th}>Date</th><th style={TABLE.th}>Time</th>
//                         <th style={TABLE.th}>Passengers</th><th style={TABLE.th}>Revenue</th><th style={TABLE.th}>Status</th><th style={TABLE.th}>Actions</th>
//                     </tr></thead>
//                     <tbody>
//                         {filtered.length === 0 && <tr><td colSpan={10} style={{ padding: 32, textAlign: "center", color: "#94a3b8" }}>No trips found.</td></tr>}
//                         {filtered.map(t => (
//                             <tr key={t.id} onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"} onMouseLeave={e => e.currentTarget.style.background = ""}>
//                                 <td style={TABLE.td}><code style={{ background: "#eef2ff", color: "#4f46e5", padding: "2px 8px", borderRadius: 6, fontSize: 12, fontWeight: 700 }}>{t.id}</code></td>
//                                 <td style={{ ...TABLE.td, maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{rtName(t.routeId)}</td>
//                                 <td style={TABLE.td}>{busNum(t.busId)}</td>
//                                 <td style={TABLE.td}>{drvName(t.driverId)}</td>
//                                 <td style={TABLE.td}>{t.date}</td>
//                                 <td style={TABLE.td}>{t.time}</td>
//                                 <td style={TABLE.td}>{t.passengers || "—"}</td>
//                                 <td style={TABLE.td}>{t.revenue ? `₹${t.revenue}` : "—"}</td>
//                                 <td style={TABLE.td}><Badge val={t.status} /></td>
//                                 <td style={TABLE.td}>
//                                     <div style={{ display: "flex", gap: 5 }}>
//                                         <button style={{ ...B.sm, background: "#dbeafe", color: "#1e40af" }} onClick={() => { setSel(t); setForm({ ...t }); setModal("edit") }}>✏</button>
//                                         <button style={{ ...B.sm, background: "#fee2e2", color: "#991b1b" }} onClick={() => { setSel(t); setModal("delete") }}>🗑</button>
//                                     </div>
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>

//             {(modal === "add" || modal === "edit") && <Modal title={modal === "add" ? "📋 Schedule Trip" : "✏ Edit Trip"} onClose={() => setModal(null)} wide><TForm /><div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}><button style={B.cancel} onClick={() => setModal(null)}>Cancel</button><button style={B.primary} onClick={save}>{modal === "add" ? "Schedule Trip" : "Save Changes"}</button></div></Modal>}
//             {modal === "delete" && sel && <ConfirmDel name={sel.id} onConfirm={() => { setTrips(p => p.filter(t => t.id !== sel.id)); setModal(null); showToast("Trip deleted.", "error"); }} onClose={() => setModal(null)} />}
//         </div>
//     );
// }

// // ═══════════════════════════════════════════════════════════
// // 6. LIVE TRACKING
// // ═══════════════════════════════════════════════════════════
// // ═══════════════════════════════════════════════════════════
// // PASTE THIS AT THE TOP OF CompanyAdmin.js (add to existing imports)
// // ═══════════════════════════════════════════════════════════
// // import { initializeApp, getApps, getApp } from "firebase/app";
// // import { getDatabase, ref, onValue } from "firebase/database";
// //
// // const firebaseConfig = {
// //   apiKey: "AIzaSyBRDCFSJl___6-r3l2FAUdqn0fQ9eVvjRU",
// //   databaseURL: "https://expo-projects-f6ba3-default-rtdb.firebaseio.com",
// //   projectId: "expo-projects-f6ba3",
// // };
// // const _app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
// // const _db  = getDatabase(_app);
// // ═══════════════════════════════════════════════════════════

// // ── REPLACE the entire LiveTracking function with this ──────

// import { initializeApp, getApps, getApp } from "firebase/app";
// import { getDatabase, ref, onValue } from "firebase/database";

// const firebaseConfig = {
//   apiKey: "AIzaSyBRDCFSJl___6-r3l2FAUdqn0fQ9eVvjRU",
//   databaseURL: "https://expo-projects-f6ba3-default-rtdb.firebaseio.com",
//   projectId: "expo-projects-f6ba3",
// };
// const _app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
// const _db  = getDatabase(_app);

// function LiveTracking({ buses, drivers }) {
//     const [liveBuses, setLiveBuses] = React.useState([]);
//     const [sel, setSel]             = React.useState(null);
//     const [lastTick, setLastTick]   = React.useState(new Date().toLocaleTimeString());

//     // ✅ REAL Firebase listener — reads trips/{tripCode}/drivers/{driverId}
//     React.useEffect(() => {
//         const tripsRef = ref(_db, "trips");

//         const unsubscribe = onValue(tripsRef, (snap) => {
//             const data = snap.val();
//             if (!data) { setLiveBuses([]); return; }

//             const active = [];

//             Object.entries(data).forEach(([tripCode, trip]) => {
//                 // Skip ended trips
//                 if (trip.status === "ended") return;
//                 if (!trip.drivers) return;

//                 Object.entries(trip.drivers).forEach(([driverId, driver]) => {
//                     if (!driver.latitude || !driver.longitude) return;

//                     // Skip stale data (older than 10 minutes)
//                     const ageMin = (Date.now() - (driver.updatedAt || 0)) / 60000;
//                     if (ageMin > 10) return;

//                     // Try to match with seed driver/bus data
//                     const matchedDriver = drivers.find(d => d.phone === driverId);
//                     const matchedBus    = matchedDriver ? buses.find(b => b.id === matchedDriver.busId) : null;

//                     active.push({
//                         tripCode,
//                         driverId,
//                         lat:        driver.latitude,
//                         lng:        driver.longitude,
//                         speed:      driver.speed || 0,
//                         ageMin:     ageMin.toFixed(1),
//                         updatedAt:  driver.updatedAt,
//                         from:       trip.from   || "—",
//                         to:         trip.to     || "—",
//                         busNo:      trip.busNo  || matchedBus?.number || "Unknown",
//                         driverName: matchedDriver?.name || driverId,
//                         status:     trip.status || "active",
//                     });
//                 });
//             });

//             setLiveBuses(active);
//             setLastTick(new Date().toLocaleTimeString());
//         });

//         return () => unsubscribe();
//     }, [buses, drivers]);

//     const selData = sel ? liveBuses.find(b => b.tripCode === sel) : null;

//     return (
//         <div>
//             {/* Header */}
//             <div style={PG.hdr}>
//                 <div>
//                     <h2 style={PG.title}>Live GPS Tracking</h2>
//                     <p style={PG.sub}>
//                         {liveBuses.length} bus{liveBuses.length !== 1 ? "es" : ""} transmitting live · last sync: {lastTick}
//                     </p>
//                 </div>
//                 <div style={{ display: "flex", alignItems: "center", gap: 8, background: liveBuses.length > 0 ? "#dcfce7" : "#fee2e2", padding: "8px 16px", borderRadius: 10 }}>
//                     <div style={{ width: 8, height: 8, borderRadius: "50%", background: liveBuses.length > 0 ? "#10b981" : "#ef4444" }} />
//                     <span style={{ fontSize: 13, fontWeight: 700, color: liveBuses.length > 0 ? "#065f46" : "#991b1b" }}>
//                         {liveBuses.length > 0 ? "LIVE" : "NO SIGNAL"}
//                     </span>
//                 </div>
//             </div>

//             {/* No buses state */}
//             {liveBuses.length === 0 && (
//                 <div style={{ textAlign: "center", background: "#fff", borderRadius: 18, padding: 60, color: "#94a3b8" }}>
//                     <div style={{ fontSize: 48, marginBottom: 16 }}>📡</div>
//                     <h3 style={{ color: "#374151", marginBottom: 8 }}>No Active Buses</h3>
//                     <p style={{ fontSize: 14 }}>Waiting for drivers to start trips in the Driver App...</p>
//                     <p style={{ fontSize: 12, marginTop: 8, color: "#cbd5e1" }}>Data auto-refreshes from Firebase in real time</p>
//                 </div>
//             )}

//             {liveBuses.length > 0 && (
//                 <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20 }}>

//                     {/* ── Simulated Map with Real Coordinates ── */}
//                     <div style={{ background: "#1e293b", borderRadius: 18, overflow: "hidden", position: "relative", minHeight: 480 }}>
//                         {/* Grid */}
//                         <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(148,163,184,.1) 1px,transparent 1px),linear-gradient(90deg,rgba(148,163,184,.1) 1px,transparent 1px)", backgroundSize: "40px 40px" }} />
//                         {/* Roads */}
//                         <div style={{ position: "absolute", top: "45%", left: 0, right: 0, height: 3, background: "rgba(148,163,184,.2)" }} />
//                         <div style={{ position: "absolute", top: 0, bottom: 0, left: "55%", width: 3, background: "rgba(148,163,184,.2)" }} />

//                         {/* Map label */}
//                         <div style={{ position: "absolute", top: 16, left: 16, background: "rgba(15,23,42,.75)", color: "white", padding: "6px 12px", borderRadius: 8, fontSize: 12, fontWeight: 600 }}>
//                             🗺 Tamil Nadu — Real GPS from Firebase
//                         </div>

//                         {/* Compass */}
//                         <div style={{ position: "absolute", top: 16, right: 16, background: "rgba(15,23,42,.75)", color: "white", padding: "8px 10px", borderRadius: 8, fontSize: 14, textAlign: "center" }}>
//                             N<br /><span style={{ fontSize: 8, color: "#94a3b8" }}>↑</span>
//                         </div>

//                         {/* Bus markers — position based on real lat/lng delta */}
//                         {liveBuses.map((g, i) => {
//                             const baseLat = liveBuses[0].lat;
//                             const baseLng = liveBuses[0].lng;
//                             const xPct = 50 + (g.lng - baseLng) * 800;
//                             const yPct = 50 - (g.lat - baseLat) * 800;
//                             const xClamped = Math.max(8, Math.min(90, xPct));
//                             const yClamped = Math.max(10, Math.min(85, yPct));
//                             const isSelected = sel === g.tripCode;

//                             return (
//                                 <div key={g.tripCode} onClick={() => setSel(isSelected ? null : g.tripCode)}
//                                     style={{ position: "absolute", left: `${xClamped}%`, top: `${yClamped}%`, cursor: "pointer", transform: "translate(-50%,-100%)", zIndex: isSelected ? 10 : 5, transition: "left 1s ease, top 1s ease" }}>
//                                     <div style={{
//                                         background: isSelected ? "#f59e0b" : "#4f46e5",
//                                         color: "white", borderRadius: "50% 50% 50% 0",
//                                         width: 42, height: 42, display: "flex", alignItems: "center", justifyContent: "center",
//                                         fontSize: 18, boxShadow: `0 4px 20px ${isSelected ? "rgba(245,158,11,.6)" : "rgba(79,70,229,.5)"}`,
//                                         border: `3px solid ${isSelected ? "#fde68a" : "white"}`,
//                                         transform: "rotate(-45deg)"
//                                     }}>
//                                         <span style={{ transform: "rotate(45deg)" }}>🚌</span>
//                                     </div>
//                                     <div style={{ textAlign: "center", marginTop: 4, background: "rgba(15,23,42,.85)", color: "white", padding: "3px 8px", borderRadius: 6, fontSize: 11, fontWeight: 700, whiteSpace: "nowrap" }}>
//                                         {g.busNo.slice(-8)}
//                                     </div>
//                                 </div>
//                             );
//                         })}

//                         {/* Speed tags bottom */}
//                         <div style={{ position: "absolute", bottom: 16, left: 16, display: "flex", gap: 8, flexWrap: "wrap" }}>
//                             {liveBuses.map(g => (
//                                 <div key={g.tripCode} style={{ background: "rgba(15,23,42,.85)", color: "white", padding: "5px 10px", borderRadius: 8, fontSize: 12 }}>
//                                     🚌 {g.speed > 0 ? `${(g.speed * 3.6).toFixed(0)} km/h` : "Stopped"}
//                                 </div>
//                             ))}
//                         </div>

//                         {/* Firebase badge */}
//                         <div style={{ position: "absolute", bottom: 16, right: 16, background: "rgba(16,185,129,.25)", color: "#10b981", padding: "5px 10px", borderRadius: 8, fontSize: 11, fontWeight: 700 }}>
//                             ✅ Firebase Live
//                         </div>
//                     </div>

//                     {/* ── Bus List Panel ── */}
//                     <div style={{ display: "flex", flexDirection: "column", gap: 12, maxHeight: 520, overflowY: "auto" }}>
//                         {liveBuses.map(g => (
//                             <div key={g.tripCode} onClick={() => setSel(sel === g.tripCode ? null : g.tripCode)}
//                                 style={{ background: "#fff", borderRadius: 14, padding: 16, boxShadow: "0 4px 16px rgba(0,0,0,.07)", cursor: "pointer", border: `2px solid ${sel === g.tripCode ? "#4f46e5" : "transparent"}`, transition: "border .2s" }}>
//                                 <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
//                                     <div style={{ fontWeight: 800, color: "#0f172a", fontSize: 14 }}>{g.busNo}</div>
//                                     <span style={{ fontSize: 11, fontWeight: 700, background: "#dcfce7", color: "#065f46", padding: "3px 10px", borderRadius: 20 }}>LIVE</span>
//                                 </div>
//                                 <div style={{ fontSize: 12, color: "#64748b", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
//                                     <span>👤 {g.driverName}</span>
//                                     <span>🚗 {g.speed > 0 ? `${(g.speed * 3.6).toFixed(0)} km/h` : "Stopped"}</span>
//                                     <span>📡 {g.ageMin}m ago</span>
//                                     <span>🎫 Trip #{g.tripCode}</span>
//                                     <span style={{ gridColumn: "1/-1", color: "#4f46e5", fontWeight: 600 }}>
//                                         📍 {g.from} → {g.to}
//                                     </span>
//                                     <span style={{ gridColumn: "1/-1", fontFamily: "monospace", fontSize: 11 }}>
//                                         {g.lat.toFixed(5)}, {g.lng.toFixed(5)}
//                                     </span>
//                                 </div>

//                                 {/* Expanded detail */}
//                                 {sel === g.tripCode && (
//                                     <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid #f1f5f9" }}>
//                                         <div style={{ fontSize: 12, color: "#4f46e5", fontWeight: 700, marginBottom: 8 }}>LIVE GPS INFO</div>
//                                         <div style={{ fontSize: 12, color: "#374151", display: "flex", flexDirection: "column", gap: 5 }}>
//                                             <div>🌐 Lat: <strong>{g.lat.toFixed(6)}</strong></div>
//                                             <div>🌐 Lng: <strong>{g.lng.toFixed(6)}</strong></div>
//                                             <div>⚡ Speed: <strong>{g.speed > 0 ? `${(g.speed * 3.6).toFixed(1)} km/h` : "Stopped"}</strong></div>
//                                             <div>🕐 Updated: <strong>{g.updatedAt ? new Date(g.updatedAt).toLocaleTimeString() : "—"}</strong></div>
//                                             <div>📶 Status: <strong style={{ color: "#10b981", textTransform: "capitalize" }}>{g.status}</strong></div>
//                                         </div>
//                                         <a
//                                             href={`https://www.google.com/maps?q=${g.lat},${g.lng}`}
//                                             target="_blank"
//                                             rel="noreferrer"
//                                             style={{ display: "block", marginTop: 10, background: "#4f46e5", color: "#fff", padding: "7px 12px", borderRadius: 8, fontSize: 12, fontWeight: 700, textAlign: "center", textDecoration: "none" }}
//                                         >
//                                             🗺 Open in Google Maps
//                                         </a>
//                                     </div>
//                                 )}
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }
// // ═══════════════════════════════════════════════════════════
// // 7. REPORTS
// // ═══════════════════════════════════════════════════════════
// function Reports({ trips, buses, drivers, routes }) {
//     const completed = trips.filter(t => t.status === "completed");
//     const totalRev = completed.reduce((s, t) => s + t.revenue, 0);
//     const totalPax = completed.reduce((s, t) => s + t.passengers, 0);
//     const avgPax = completed.length ? Math.round(totalPax / completed.length) : 0;

//     // Revenue by route
//     const routeRev = routes.map(r => {
//         const rTrips = completed.filter(t => t.routeId === r.id);
//         return { ...r, trips: rTrips.length, rev: rTrips.reduce((s, t) => s + t.revenue, 0), pax: rTrips.reduce((s, t) => s + t.passengers, 0) };
//     }).sort((a, b) => b.rev - a.rev);

//     const maxRev = Math.max(...routeRev.map(r => r.rev), 1);

//     // Driver performance
//     const driverPerf = drivers.map(d => {
//         const dTrips = completed.filter(t => t.driverId === d.id);
//         return { ...d, trips: dTrips.length, pax: dTrips.reduce((s, t) => s + t.passengers, 0), rev: dTrips.reduce((s, t) => s + t.revenue, 0) };
//     }).sort((a, b) => b.trips - a.trips);

//     return (
//         <div>
//             <div style={PG.hdr}>
//                 <div><h2 style={PG.title}>Reports & Analytics</h2><p style={PG.sub}>Based on completed trips</p></div>
//             </div>

//             {/* Summary */}
//             <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 16, marginBottom: 28 }}>
//                 <StatCard icon="💰" label="Total Revenue" value={`₹${totalRev.toLocaleString()}`} sub="All completed trips" color="#10b981" />
//                 <StatCard icon="✅" label="Trips Completed" value={completed.length} sub={`of ${trips.length} total`} color="#4f46e5" />
//                 <StatCard icon="👥" label="Total Passengers" value={totalPax.toLocaleString()} sub="Carried across routes" color="#f59e0b" />
//                 <StatCard icon="📊" label="Avg Passengers" value={avgPax} sub="Per completed trip" color="#06b6d4" />
//             </div>

//             <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

//                 {/* Revenue by route */}
//                 <div style={{ background: "#fff", borderRadius: 18, padding: 24, boxShadow: "0 4px 20px rgba(0,0,0,.06)" }}>
//                     <h3 style={{ margin: "0 0 20px", fontSize: 15, fontWeight: 800, color: "#0f172a" }}>Revenue by Route</h3>
//                     {routeRev.map(r => (
//                         <div key={r.id} style={{ marginBottom: 16 }}>
//                             <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5, fontSize: 13 }}>
//                                 <span style={{ fontWeight: 600, color: "#334155" }}>{r.name}</span>
//                                 <span style={{ fontWeight: 800, color: "#10b981" }}>₹{r.rev.toLocaleString()}</span>
//                             </div>
//                             <div style={{ height: 8, background: "#f1f5f9", borderRadius: 999 }}>
//                                 <div style={{ width: `${(r.rev / maxRev) * 100}%`, height: "100%", background: "linear-gradient(to right,#4f46e5,#818cf8)", borderRadius: 999, minWidth: r.rev ? 4 : 0, transition: "width .8s" }} />
//                             </div>
//                             <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 3 }}>{r.trips} trips · {r.pax} passengers</div>
//                         </div>
//                     ))}
//                 </div>

//                 {/* Driver performance */}
//                 <div style={{ background: "#fff", borderRadius: 18, padding: 24, boxShadow: "0 4px 20px rgba(0,0,0,.06)" }}>
//                     <h3 style={{ margin: "0 0 20px", fontSize: 15, fontWeight: 800, color: "#0f172a" }}>Driver Performance</h3>
//                     {driverPerf.map((d, i) => (
//                         <div key={d.id} style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16, padding: "12px 14px", borderRadius: 12, background: i === 0 ? "#eef2ff" : "#f8fafc" }}>
//                             <div style={{ width: 38, height: 38, borderRadius: "50%", background: `linear-gradient(135deg,${i === 0 ? "#4f46e5,#818cf8" : i === 1 ? "#10b981,#34d399" : "#f59e0b,#fbbf24"})`, color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 800 }}>{d.name[0]}</div>
//                             <div style={{ flex: 1 }}>
//                                 <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>{d.name} {i === 0 && <span style={{ fontSize: 11, background: "#4f46e5", color: "white", borderRadius: 20, padding: "1px 7px", marginLeft: 4 }}>Top</span>}</div>
//                                 <div style={{ fontSize: 12, color: "#64748b" }}>{d.trips} trips · {d.pax} pax · ₹{d.rev.toLocaleString()}</div>
//                             </div>
//                             <div style={{ fontSize: 13, color: "#f59e0b", fontWeight: 700 }}>{d.rating}★</div>
//                         </div>
//                     ))}
//                 </div>
//             </div>

//             {/* Trip log table */}
//             <div style={{ ...TABLE.card, marginTop: 20 }}>
//                 <div style={{ padding: "18px 20px 0" }}>
//                     <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: "#0f172a" }}>Complete Trip Log</h3>
//                 </div>
//                 <div style={{ overflowX: "auto" }}>
//                     <table style={{ ...TABLE.table, marginTop: 12 }}>
//                         <thead><tr>
//                             <th style={TABLE.th}>Trip ID</th><th style={TABLE.th}>Route</th><th style={TABLE.th}>Date</th>
//                             <th style={TABLE.th}>Driver</th><th style={TABLE.th}>Passengers</th><th style={TABLE.th}>Revenue</th><th style={TABLE.th}>Status</th>
//                         </tr></thead>
//                         <tbody>
//                             {trips.map(t => (
//                                 <tr key={t.id} onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"} onMouseLeave={e => e.currentTarget.style.background = ""}>
//                                     <td style={TABLE.td}><code style={{ background: "#eef2ff", color: "#4f46e5", padding: "2px 8px", borderRadius: 6, fontSize: 12 }}>{t.id}</code></td>
//                                     <td style={TABLE.td}>{routes.find(r => r.id === t.routeId)?.name || t.routeId}</td>
//                                     <td style={TABLE.td}>{t.date} {t.time}</td>
//                                     <td style={TABLE.td}>{drivers.find(d => d.id === t.driverId)?.name || "—"}</td>
//                                     <td style={TABLE.td}>{t.passengers || "—"}</td>
//                                     <td style={TABLE.td}>{t.revenue ? `₹${t.revenue}` : "—"}</td>
//                                     <td style={TABLE.td}><Badge val={t.status} /></td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>
//         </div>
//     );
// }

// // ═══════════════════════════════════════════════════════════
// // 8. COMPANY PROFILE
// // ═══════════════════════════════════════════════════════════
// function CompanyProfile({ company, setCompany, showToast }) {
//     const [edit, setEdit] = useState(false);
//     const [form, setForm] = useState(company);

//     const save = () => { setCompany(form); setEdit(false); showToast("Company profile updated."); };

//     return (
//         <div>
//             <div style={PG.hdr}>
//                 <div><h2 style={PG.title}>Company Profile</h2><p style={PG.sub}>Manage your company information</p></div>
//                 {!edit && <button style={B.primary} onClick={() => setEdit(true)}>✏ Edit Profile</button>}
//             </div>

//             <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
//                 {/* Info card */}
//                 <div style={{ background: "#fff", borderRadius: 18, padding: 28, boxShadow: "0 4px 20px rgba(0,0,0,.06)", gridColumn: "1/-1" }}>
//                     <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 28 }}>
//                         <div style={{ width: 80, height: 80, borderRadius: 20, background: "linear-gradient(135deg,#4f46e5,#818cf8)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36 }}>🏢</div>
//                         <div>
//                             <h3 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#0f172a" }}>{company.name}</h3>
//                             <div style={{ color: "#64748b", marginTop: 4 }}>{company.city}, {company.state}</div>
//                             <code style={{ fontSize: 12, background: "#eef2ff", color: "#4f46e5", padding: "2px 8px", borderRadius: 6, marginTop: 6, display: "inline-block" }}>{company.id}</code>
//                         </div>
//                     </div>

//                     {!edit ? (
//                         <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
//                             {[["📧 Email", company.email], ["📞 Contact", company.contact], ["🏙 City", company.city], ["🗺 State", company.state], ["📄 License", company.license], ["🆔 Company ID", company.id]].map(([k, v]) => (
//                                 <div key={k} style={{ background: "#f8fafc", borderRadius: 12, padding: "14px 16px" }}>
//                                     <div style={{ fontSize: 12, color: "#94a3b8", fontWeight: 700 }}>{k}</div>
//                                     <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", marginTop: 4 }}>{v}</div>
//                                 </div>
//                             ))}
//                         </div>
//                     ) : (
//                         <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
//                             <Field label="Company Name"><input style={INP} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></Field>
//                             <Field label="Email"><input style={INP} type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} /></Field>
//                             <Field label="Contact Phone"><input style={INP} value={form.contact} onChange={e => setForm(f => ({ ...f, contact: e.target.value }))} /></Field>
//                             <Field label="City"><input style={INP} value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} /></Field>
//                             <Field label="State"><input style={INP} value={form.state} onChange={e => setForm(f => ({ ...f, state: e.target.value }))} /></Field>
//                             <Field label="Transport License No."><input style={INP} value={form.license} onChange={e => setForm(f => ({ ...f, license: e.target.value }))} /></Field>
//                             <div style={{ gridColumn: "1/-1", display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
//                                 <button style={B.cancel} onClick={() => setEdit(false)}>Cancel</button>
//                                 <button style={B.primary} onClick={save}>Save Profile</button>
//                             </div>
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// }

// // ═══════════════════════════════════════════════════════════
// // MAIN: COMPANY ADMIN
// // ═══════════════════════════════════════════════════════════
// export default function CompanyAdmin({ onLogout }) {
//     const [page, setPage] = useState("dashboard");
//     const [buses, setBuses] = useState(SEED_BUSES);
//     const [drivers, setDrivers] = useState(SEED_DRIVERS);
//     const [routes, setRoutes] = useState(SEED_ROUTES);
//     const [trips, setTrips] = useState(SEED_TRIPS);
//     const [gpsData, setGpsData] = useState(GPS_POSITIONS);
//     const [company, setCompany] = useState(COMPANY);
//     const [toast, setToast] = useState(null);
//     const [sidebarOpen, setSidebar] = useState(true);

//     const showToast = (msg, type = "success") => {
//         setToast({ msg, type });
//         setTimeout(() => setToast(null), 3000);
//     };

//     const NAV = [
//         { key: "dashboard", icon: "⊞", label: "Dashboard" },
//         { key: "buses", icon: "🚌", label: "Buses" },
//         { key: "drivers", icon: "👤", label: "Drivers" },
//         { key: "routes", icon: "🗺", label: "Routes" },
//         { key: "trips", icon: "📋", label: "Trips" },
//         { key: "tracking", icon: "📡", label: "Live Tracking" },
//         { key: "reports", icon: "📊", label: "Reports" },
//         { key: "profile", icon: "🏢", label: "Profile" },
//     ];

//     const pageTitle = NAV.find(n => n.key === page)?.label || "Dashboard";
//     const liveCount = gpsData.length;

//     const renderPage = () => {
//         switch (page) {
//             case "dashboard": return <Dashboard buses={buses} drivers={drivers} routes={routes} trips={trips} company={company} setPage={setPage} />;
//             case "buses": return <BusManagement buses={buses} setBuses={setBuses} drivers={drivers} routes={routes} showToast={showToast} />;
//             case "drivers": return <DriverManagement drivers={drivers} setDrivers={setDrivers} buses={buses} showToast={showToast} />;
//             case "routes": return <RouteManagement routes={routes} setRoutes={setRoutes} buses={buses} showToast={showToast} />;
//             case "trips": return <TripManagement trips={trips} setTrips={setTrips} buses={buses} drivers={drivers} routes={routes} showToast={showToast} />;
//             case "tracking": return <LiveTracking buses={buses} drivers={drivers} gpsData={gpsData} setGpsData={setGpsData} />;
//             case "reports": return <Reports trips={trips} buses={buses} drivers={drivers} routes={routes} />;
//             case "profile": return <CompanyProfile company={company} setCompany={setCompany} showToast={showToast} />;
//             default: return <Dashboard buses={buses} drivers={drivers} routes={routes} trips={trips} company={company} setPage={setPage} />;
//         }
//     };

//     return (
//         <div style={{ display: "flex", height: "100vh", fontFamily: "'Segoe UI',Tahoma,Geneva,Verdana,sans-serif", background: "#f0f4f8" }}>
//             <style>{`
//         @keyframes caFade { from{opacity:0;transform:translateY(-10px)} to{opacity:1;transform:translateY(0)} }
//         @keyframes pulse  { 0%,100%{opacity:1} 50%{opacity:.4} }
//         * { box-sizing: border-box; }
//         ::-webkit-scrollbar { width:6px; height:6px; }
//         ::-webkit-scrollbar-track { background:#f1f5f9; }
//         ::-webkit-scrollbar-thumb { background:#cbd5e1; border-radius:3px; }
//       `}</style>

//             <Toast toast={toast} />

//             {/* ── SIDEBAR ── */}
//             <aside style={{ width: sidebarOpen ? 240 : 72, background: "linear-gradient(180deg,#4f46e5,#3b82f6)", color: "white", padding: "24px 0", display: "flex", flexDirection: "column", transition: "width .25s", overflow: "hidden", flexShrink: 0, position: "relative", zIndex: 10 }}>
//                 {/* Logo */}
//                 <div style={{ padding: "0 20px 28px", borderBottom: "1px solid rgba(255,255,255,.15)", marginBottom: 16 }}>
//                     <div style={{ fontSize: 22, fontWeight: 800, whiteSpace: "nowrap", overflow: "hidden" }}>
//                         {sidebarOpen ? "🚌 GoBus Admin" : "🚌"}
//                     </div>
//                     {sidebarOpen && <div style={{ fontSize: 11, color: "rgba(255,255,255,.7)", marginTop: 3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{company.name}</div>}
//                 </div>

//                 {/* Nav items */}
//                 <nav style={{ flex: 1, padding: "0 10px", display: "flex", flexDirection: "column", gap: 4 }}>
//                     {NAV.map(n => (
//                         <button key={n.key} onClick={() => setPage(n.key)} style={{
//                             display: "flex", alignItems: "center", gap: 12, padding: "11px 14px", borderRadius: 12,
//                             background: page === n.key ? "rgba(255,255,255,.25)" : "transparent",
//                             color: "white", border: "none", cursor: "pointer", textAlign: "left", whiteSpace: "nowrap",
//                             fontWeight: page === n.key ? 700 : 400, fontSize: 14, width: "100%",
//                             transition: "background .2s",
//                         }}
//                             onMouseEnter={e => { if (page !== n.key) e.currentTarget.style.background = "rgba(255,255,255,.12)"; }}
//                             onMouseLeave={e => { if (page !== n.key) e.currentTarget.style.background = "transparent"; }}>
//                             <span style={{ fontSize: 18, flexShrink: 0 }}>{n.icon}</span>
//                             {sidebarOpen && n.label}
//                             {sidebarOpen && n.key === "tracking" && liveCount > 0 && (
//                                 <span style={{ marginLeft: "auto", background: "#ef4444", borderRadius: 20, fontSize: 10, fontWeight: 800, padding: "1px 7px" }}>{liveCount}</span>
//                             )}
//                         </button>
//                     ))}
//                 </nav>

//                 {/* Bottom */}
//                 {sidebarOpen && (
//                     <div style={{ padding: "16px 20px", borderTop: "1px solid rgba(255,255,255,.15)", marginTop: 8 }}>
//                         <button onClick={onLogout} style={{ background: "rgba(255,255,255,.15)", border: "none", color: "white", padding: "10px 16px", borderRadius: 10, cursor: "pointer", width: "100%", fontSize: 13, fontWeight: 700 }}>
//                             ← Logout
//                         </button>
//                     </div>
//                 )}

//                 {/* Collapse toggle */}
//                 <button onClick={() => setSidebar(s => !s)} style={{ position: "absolute", top: 24, right: -12, background: "white", border: "none", borderRadius: "50%", width: 24, height: 24, boxShadow: "0 2px 8px rgba(0,0,0,.2)", cursor: "pointer", fontSize: 12, color: "#4f46e5", display: "flex", alignItems: "center", justifyContent: "center" }}>
//                     {sidebarOpen ? "‹" : "›"}
//                 </button>
//             </aside>

//             {/* ── MAIN ── */}
//             <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

//                 {/* Topbar */}
//                 <header style={{ background: "white", padding: "0 28px", height: 68, display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 2px 10px rgba(0,0,0,.06)", flexShrink: 0 }}>
//                     <div>
//                         <h1 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#0f172a" }}>{pageTitle}</h1>
//                         <p style={{ margin: 0, fontSize: 12, color: "#94a3b8" }}>Company Admin · {company.name}</p>
//                     </div>
//                     <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
//                         {/* Live indicator */}
//                         <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#dcfce7", padding: "6px 12px", borderRadius: 20 }}>
//                             <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#10b981", animation: "pulse 1.5s infinite" }} />
//                             <span style={{ fontSize: 12, fontWeight: 700, color: "#065f46" }}>{liveCount} Live</span>
//                         </div>
//                         {/* Alerts */}
//                         <div style={{ position: "relative" }}>
//                             <div style={{ background: "#f1f5f9", width: 38, height: 38, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 18 }}>🔔</div>
//                             {buses.filter(b => b.status === "maintenance").length > 0 && (
//                                 <div style={{ position: "absolute", top: -4, right: -4, background: "#ef4444", color: "white", borderRadius: "50%", width: 18, height: 18, fontSize: 10, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>
//                                     {buses.filter(b => b.status === "maintenance").length}
//                                 </div>
//                             )}
//                         </div>
//                         <div style={{ background: "linear-gradient(135deg,#4f46e5,#818cf8)", color: "white", padding: "8px 16px", borderRadius: 10, fontWeight: 700, fontSize: 13 }}>
//                             🏢 {company.name.split(" ")[0]}
//                         </div>
//                     </div>
//                 </header>

//                 {/* Page content */}
//                 <main style={{ flex: 1, overflowY: "auto", padding: 28 }}>
//                     {renderPage()}
//                 </main>
//             </div>
//         </div>
//     );
// }
import React, { useState, useEffect, useRef } from "react";
import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase, ref, onValue, set, get } from "firebase/database";

// ── Firebase setup (same project as Driver App) ─────────────
const _firebaseConfig = {
  apiKey: "AIzaSyBRDCFSJl___6-r3l2FAUdqn0fQ9eVvjRU",
  databaseURL: "https://expo-projects-f6ba3-default-rtdb.firebaseio.com",
  projectId: "expo-projects-f6ba3",
};
const _app = getApps().length === 0 ? initializeApp(_firebaseConfig) : getApp();
const _db  = getDatabase(_app);

// ═══════════════════════════════════════════════════════════
// SEED DATA
// ═══════════════════════════════════════════════════════════
const SEED_BUSES = [
    { id: 1, number: "TN-01-AB-1234", model: "Ashok Leyland", capacity: 52, fuel: "Diesel", status: "active", routeId: "R-101", driverId: 1, lastService: "2024-11-10", kmRun: 42300, year: 2020 },
    { id: 2, number: "TN-01-CD-5678", model: "Tata Starbus", capacity: 45, fuel: "CNG", status: "active", routeId: "R-102", driverId: 2, lastService: "2024-10-25", kmRun: 38100, year: 2021 },
    { id: 3, number: "TN-01-EF-9012", model: "Eicher Pro", capacity: 35, fuel: "Diesel", status: "maintenance", routeId: null, driverId: null, lastService: "2024-09-05", kmRun: 61500, year: 2018 },
    { id: 4, number: "TN-01-GH-3456", model: "Volvo 9400", capacity: 56, fuel: "Diesel", status: "idle", routeId: null, driverId: null, lastService: "2024-12-01", kmRun: 15200, year: 2023 },
];

const SEED_DRIVERS = [
    { id: 1, name: "Ramesh Kumar", phone: "9876543210", license: "TN-2023-12345", status: "on-duty", busId: 1, experience: "5 yrs", rating: 4.8, joinDate: "2023-01-15" },
    { id: 2, name: "Suresh Babu", phone: "9123456780", license: "TN-2022-98765", status: "on-duty", busId: 2, experience: "3 yrs", rating: 4.5, joinDate: "2022-06-20" },
    { id: 3, name: "Arjun Selvam", phone: "9988776655", license: "TN-2021-54321", status: "off-duty", busId: null, experience: "7 yrs", rating: 4.9, joinDate: "2021-03-10" },
    { id: 4, name: "Karthik Raj", phone: "9765432100", license: "TN-2020-11223", status: "off-duty", busId: null, experience: "2 yrs", rating: 4.2, joinDate: "2024-02-01" },
];

const SEED_ROUTES = [
    { id: "R-101", name: "City Center → Airport", from: "City Center", to: "Airport", stops: ["City Center", "Gandhi Nagar", "Anna Salai", "Airport"], distance: "28 km", duration: "55 min", fare: 35, status: "active" },
    { id: "R-102", name: "Central → Meenakshi", from: "Madurai Central", to: "Meenakshi Temple", stops: ["Madurai Central", "KK Nagar", "Goripalayam", "Meenakshi Temple"], distance: "12 km", duration: "30 min", fare: 15, status: "active" },
    { id: "R-103", name: "North → South Ring Road", from: "Bypass Jn", to: "Aavin Roundana", stops: ["Bypass Jn", "Arapalayam", "Mattuthavani", "Aavin Roundana"], distance: "18 km", duration: "40 min", fare: 20, status: "inactive" },
];

const SEED_TRIPS = [
    { id: "T-2001", routeId: "R-101", busId: 1, driverId: 1, date: "2025-02-21", time: "08:00", status: "completed", passengers: 41, revenue: 1435 },
    { id: "T-2002", routeId: "R-102", busId: 2, driverId: 2, date: "2025-02-21", time: "09:30", status: "in-progress", passengers: 33, revenue: 495 },
    { id: "T-2003", routeId: "R-101", busId: 1, driverId: 1, date: "2025-02-21", time: "13:00", status: "scheduled", passengers: 0, revenue: 0 },
    { id: "T-2004", routeId: "R-102", busId: 2, driverId: 2, date: "2025-02-22", time: "07:00", status: "scheduled", passengers: 0, revenue: 0 },
    { id: "T-2005", routeId: "R-101", busId: 1, driverId: 1, date: "2025-02-20", time: "08:00", status: "completed", passengers: 48, revenue: 1680 },
    { id: "T-2006", routeId: "R-102", busId: 2, driverId: 2, date: "2025-02-20", time: "10:00", status: "completed", passengers: 38, revenue: 570 },
];

// Simulated GPS locations for live tracking
const GPS_POSITIONS = [
    { busId: 1, lat: 9.9252, lng: 78.1198, speed: 42, heading: "North", lastUpdate: "just now", passengers: 33 },
    { busId: 2, lat: 9.9310, lng: 78.1250, speed: 28, heading: "East", lastUpdate: "30 sec ago", passengers: 21 },
];

const COMPANY = { name: "Sri Murugan Transport Co.", id: "COMP-001", city: "Madurai", state: "Tamil Nadu", contact: "9876500000", email: "admin@smt.in", license: "TN-TRANS-2020-001" };

const EMPTY_BUS = { number: "", model: "", capacity: "", fuel: "Diesel", status: "idle", routeId: "", driverId: "", lastService: "", kmRun: "", year: "" };
const EMPTY_DRIVER = { name: "", phone: "", license: "", experience: "", status: "off-duty", busId: "", rating: "5.0", joinDate: "" };
const EMPTY_ROUTE = { id: "", name: "", from: "", to: "", stops: "", distance: "", duration: "", fare: "", status: "active" };
const EMPTY_TRIP = { routeId: "", busId: "", driverId: "", date: "", time: "", status: "scheduled" };

// ═══════════════════════════════════════════════════════════
// SHARED SMALL COMPONENTS
// ═══════════════════════════════════════════════════════════
function Toast({ toast }) {
    if (!toast) return null;
    const isErr = toast.type === "error";
    return (
        <div style={{
            position: "fixed", top: 24, right: 24, zIndex: 9999, padding: "13px 22px",
            borderRadius: 14, fontWeight: 700, fontSize: 14, color: "white",
            background: isErr ? "#ef4444" : "#10b981",
            boxShadow: "0 8px 30px rgba(0,0,0,.2)", animation: "caFade .3s ease",
        }}>
            {isErr ? "✕ " : "✓ "}{toast.msg}
        </div>
    );
}

function Badge({ val }) {
    const map = {
        active: "#d1fae5,#065f46", idle: "#fef3c7,#92400e", maintenance: "#fee2e2,#991b1b",
        "on-duty": "#d1fae5,#065f46", "off-duty": "#f3f4f6,#374151",
        completed: "#d1fae5,#065f46", "in-progress": "#dbeafe,#1e40af",
        scheduled: "#fef3c7,#92400e", cancelled: "#fee2e2,#991b1b", inactive: "#f3f4f6,#374151",
    };
    const [bg, color] = (map[val] || "#f3f4f6,#374151").split(",");
    return (
        <span style={{ background: bg, color, padding: "3px 12px", borderRadius: 20, fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: .5 }}>
            {val}
        </span>
    );
}

function Modal({ title, onClose, wide, children }) {
    return (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,.55)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 16 }}
            onClick={onClose}>
            <div style={{ background: "#fff", borderRadius: 22, padding: 32, width: "100%", maxWidth: wide ? 700 : 560, boxShadow: "0 24px 80px rgba(0,0,0,.22)", maxHeight: "90vh", overflowY: "auto" }}
                onClick={e => e.stopPropagation()}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                    <span style={{ fontSize: 19, fontWeight: 800, color: "#0f172a" }}>{title}</span>
                    <button onClick={onClose} style={{ background: "#f1f5f9", border: "none", borderRadius: 8, width: 32, height: 32, cursor: "pointer", fontSize: 16, color: "#64748b" }}>✕</button>
                </div>
                {children}
            </div>
        </div>
    );
}

function Field({ label, required, children, span }) {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 5, gridColumn: span ? "1/-1" : undefined }}>
            <label style={{ fontSize: 12, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: .5 }}>
                {label}{required && <span style={{ color: "#ef4444" }}> *</span>}
            </label>
            {children}
        </div>
    );
}

function StatCard({ icon, label, value, sub, color }) {
    return (
        <div style={{ background: "#fff", borderRadius: 18, padding: "22px 24px", boxShadow: "0 4px 20px rgba(0,0,0,.06)", borderLeft: `4px solid ${color}`, display: "flex", gap: 18, alignItems: "center" }}>
            <div style={{ fontSize: 28, background: `${color}18`, width: 52, height: 52, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>{icon}</div>
            <div>
                <div style={{ fontSize: 26, fontWeight: 800, color: "#0f172a" }}>{value}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#334155" }}>{label}</div>
                {sub && <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>{sub}</div>}
            </div>
        </div>
    );
}

function ConfirmDel({ name, onConfirm, onClose }) {
    return (
        <Modal title="⚠️ Confirm Delete" onClose={onClose}>
            <p style={{ color: "#64748b", marginBottom: 24 }}>Delete <strong style={{ color: "#0f172a" }}>{name}</strong>? This cannot be undone.</p>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                <button style={B.cancel} onClick={onClose}>Cancel</button>
                <button style={B.danger} onClick={onConfirm}>Yes, Delete</button>
            </div>
        </Modal>
    );
}

// Shared styles
const B = {
    primary: { background: "#4f46e5", color: "#fff", border: "none", padding: "10px 22px", borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: "pointer" },
    cancel: { background: "#f1f5f9", color: "#475569", border: "none", padding: "10px 22px", borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: "pointer" },
    danger: { background: "#ef4444", color: "#fff", border: "none", padding: "10px 22px", borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: "pointer" },
    sm: { border: "none", padding: "6px 13px", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer" },
};
const INP = { padding: "10px 13px", borderRadius: 10, border: "1.5px solid #e2e8f0", fontSize: 14, outline: "none", color: "#1e293b", width: "100%", boxSizing: "border-box", background: "white" };
const SEL = { ...INP, appearance: "auto" };
const TABLE = {
    card: { background: "#fff", borderRadius: 18, boxShadow: "0 4px 20px rgba(0,0,0,.06)", overflow: "hidden" },
    table: { width: "100%", borderCollapse: "collapse" },
    th: { textAlign: "left", padding: "13px 16px", fontSize: 12, color: "#64748b", background: "#f8fafc", fontWeight: 700, textTransform: "uppercase", letterSpacing: .5, borderBottom: "1px solid #e2e8f0", whiteSpace: "nowrap" },
    td: { padding: "13px 16px", borderBottom: "1px solid #f1f5f9", fontSize: 14, color: "#374151", verticalAlign: "middle" },
};
const PG = {
    hdr: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 22 },
    title: { margin: 0, fontSize: 22, fontWeight: 800, color: "#0f172a" },
    sub: { margin: "4px 0 0", fontSize: 13, color: "#64748b" },
    bar: { display: "flex", gap: 12, marginBottom: 18, flexWrap: "wrap", alignItems: "center" },
    srch: { flex: 1, minWidth: 220, padding: "10px 14px", borderRadius: 10, border: "1.5px solid #e2e8f0", fontSize: 14, outline: "none", background: "white" },
};

// ═══════════════════════════════════════════════════════════
// 1. DASHBOARD
// ═══════════════════════════════════════════════════════════
function Dashboard({ buses, drivers, routes, trips, company, setPage }) {
    const today = "2025-02-21";
    const todayTrips = trips.filter(t => t.date === today);
    const activeBuses = buses.filter(b => b.status === "active").length;
    const onDuty = drivers.filter(d => d.status === "on-duty").length;
    const totalRev = trips.filter(t => t.status === "completed").reduce((s, t) => s + t.revenue, 0);
    const inProgress = trips.filter(t => t.status === "in-progress").length;

    // weekly bar chart data (fake)
    const weekData = [
        { day: "Mon", trips: 4, rev: 3200 }, { day: "Tue", trips: 6, rev: 4800 },
        { day: "Wed", trips: 5, rev: 4100 }, { day: "Thu", trips: 7, rev: 5600 },
        { day: "Fri", trips: 8, rev: 6200 }, { day: "Sat", trips: 3, rev: 2400 }, { day: "Sun", trips: 2, rev: 1600 },
    ];
    const maxTrips = Math.max(...weekData.map(d => d.trips));

    return (
        <div>
            <div style={PG.hdr}>
                <div>
                    <h2 style={PG.title}>Company Dashboard</h2>
                    <p style={PG.sub}>{company.name} · {today}</p>
                </div>
                <div style={{ background: "#eef2ff", padding: "8px 16px", borderRadius: 10, fontSize: 13, fontWeight: 600, color: "#4f46e5" }}>
                    🏢 {company.city}, {company.state}
                </div>
            </div>

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(210px,1fr))", gap: 16, marginBottom: 28 }}>
                <StatCard icon="🚌" label="Total Buses" value={buses.length} sub={`${activeBuses} active now`} color="#4f46e5" />
                <StatCard icon="👤" label="Total Drivers" value={drivers.length} sub={`${onDuty} on duty`} color="#8b5cf6" />
                <StatCard icon="🗺" label="Routes" value={routes.length} sub={`${routes.filter(r => r.status === "active").length} active`} color="#10b981" />
                <StatCard icon="📋" label="Today's Trips" value={todayTrips.length} sub={`${inProgress} in progress`} color="#f59e0b" />
                <StatCard icon="💰" label="Total Revenue" value={`₹${totalRev.toLocaleString()}`} sub="All time" color="#06b6d4" />
                <StatCard icon="📡" label="Live Buses" value={inProgress} sub="Transmitting GPS" color="#ef4444" />
            </div>

            {/* Fleet Status + Weekly Chart */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>

                {/* Fleet Status */}
                <div style={{ background: "#fff", borderRadius: 18, padding: 24, boxShadow: "0 4px 20px rgba(0,0,0,.06)" }}>
                    <h3 style={{ margin: "0 0 18px", fontSize: 15, fontWeight: 800, color: "#0f172a" }}>Fleet Health</h3>
                    {[["Active", "active", "#10b981"], ["Idle", "idle", "#f59e0b"], ["Maintenance", "maintenance", "#ef4444"]].map(([lbl, key, col]) => {
                        const cnt = buses.filter(b => b.status === key).length;
                        const pct = Math.round((cnt / buses.length) * 100) || 0;
                        return (
                            <div key={key} style={{ marginBottom: 14 }}>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5, fontSize: 13 }}>
                                    <span style={{ fontWeight: 600, color: "#334155" }}>{lbl}</span>
                                    <span style={{ color: col, fontWeight: 700 }}>{cnt} bus{cnt !== 1 ? "es" : ""} ({pct}%)</span>
                                </div>
                                <div style={{ height: 8, background: "#f1f5f9", borderRadius: 999 }}>
                                    <div style={{ width: `${pct}%`, height: "100%", background: col, borderRadius: 999, transition: "width .6s" }} />
                                </div>
                            </div>
                        );
                    })}
                    <button style={{ ...B.primary, marginTop: 12, width: "100%", fontSize: 13 }} onClick={() => setPage("buses")}>
                        Manage Fleet →
                    </button>
                </div>

                {/* Weekly Trips Bar Chart */}
                <div style={{ background: "#fff", borderRadius: 18, padding: 24, boxShadow: "0 4px 20px rgba(0,0,0,.06)" }}>
                    <h3 style={{ margin: "0 0 18px", fontSize: 15, fontWeight: 800, color: "#0f172a" }}>This Week's Trips</h3>
                    <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 120 }}>
                        {weekData.map(d => (
                            <div key={d.day} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                                <span style={{ fontSize: 10, color: "#94a3b8", fontWeight: 700 }}>{d.trips}</span>
                                <div style={{ width: "100%", height: `${(d.trips / maxTrips) * 100}px`, background: "linear-gradient(to top,#4f46e5,#818cf8)", borderRadius: "6px 6px 0 0", transition: "height .5s", minHeight: 6 }} />
                                <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600 }}>{d.day}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Today's Trips */}
            <div style={{ ...TABLE.card, padding: 24 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                    <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: "#0f172a" }}>Today's Trip Schedule</h3>
                    <button style={{ ...B.primary, fontSize: 13 }} onClick={() => setPage("trips")}>View All →</button>
                </div>
                <table style={TABLE.table}>
                    <thead><tr>
                        <th style={TABLE.th}>Trip ID</th><th style={TABLE.th}>Route</th>
                        <th style={TABLE.th}>Bus</th><th style={TABLE.th}>Time</th>
                        <th style={TABLE.th}>Passengers</th><th style={TABLE.th}>Revenue</th><th style={TABLE.th}>Status</th>
                    </tr></thead>
                    <tbody>
                        {todayTrips.length === 0 && <tr><td colSpan={7} style={{ padding: 24, textAlign: "center", color: "#94a3b8" }}>No trips today.</td></tr>}
                        {todayTrips.map(t => {
                            const bus = buses.find(b => b.id === t.busId);
                            const route = routes.find(r => r.id === t.routeId);
                            return (
                                <tr key={t.id} style={{ cursor: "default" }} onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"} onMouseLeave={e => e.currentTarget.style.background = ""}>
                                    <td style={TABLE.td}><code style={{ background: "#eef2ff", color: "#4f46e5", padding: "2px 8px", borderRadius: 6, fontSize: 12 }}>{t.id}</code></td>
                                    <td style={TABLE.td}>{route?.name || t.routeId}</td>
                                    <td style={TABLE.td}>{bus?.number || "—"}</td>
                                    <td style={TABLE.td}>{t.time}</td>
                                    <td style={TABLE.td}>{t.passengers || "—"}</td>
                                    <td style={TABLE.td}>{t.revenue ? `₹${t.revenue}` : "—"}</td>
                                    <td style={TABLE.td}><Badge val={t.status} /></td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════
// 2. BUS MANAGEMENT
// ═══════════════════════════════════════════════════════════
function BusManagement({ buses, setBuses, drivers, routes, showToast }) {
    const [modal, setModal] = useState(null);
    const [sel, setSel] = useState(null);
    const [form, setForm] = useState(EMPTY_BUS);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("All");

    const filtered = buses
        .filter(b => filter === "All" || b.status === filter.toLowerCase())
        .filter(b => b.number.toLowerCase().includes(search.toLowerCase()) || b.model.toLowerCase().includes(search.toLowerCase()));

    const driverName = id => drivers.find(d => d.id === id)?.name || "Unassigned";
    const routeName = id => routes.find(r => r.id === id)?.name || "—";

    const save = () => {
        if (!form.number || !form.model || !form.capacity) { showToast("Fill required fields.", "error"); return; }
        if (modal === "add") {
            setBuses(p => [...p, { ...form, id: Math.max(...p.map(x => x.id), 0) + 1, capacity: +form.capacity, kmRun: +form.kmRun || 0, driverId: form.driverId ? +form.driverId : null, routeId: form.routeId || null }]);
            showToast("Bus added successfully.");
        } else {
            setBuses(p => p.map(b => b.id === sel.id ? { ...form, id: sel.id, capacity: +form.capacity, kmRun: +form.kmRun || 0, driverId: form.driverId ? +form.driverId : null, routeId: form.routeId || null } : b));
            showToast("Bus updated.");
        }
        setModal(null);
    };

    const BusForm = () => (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 24 }}>
            <Field label="Bus Number" required><input style={INP} value={form.number} onChange={e => setForm(f => ({ ...f, number: e.target.value }))} placeholder="TN-01-XX-0000" /></Field>
            <Field label="Model" required><input style={INP} value={form.model} onChange={e => setForm(f => ({ ...f, model: e.target.value }))} placeholder="Ashok Leyland" /></Field>
            <Field label="Capacity (seats)" required><input style={INP} type="number" value={form.capacity} onChange={e => setForm(f => ({ ...f, capacity: e.target.value }))} /></Field>
            <Field label="Fuel Type"><select style={SEL} value={form.fuel} onChange={e => setForm(f => ({ ...f, fuel: e.target.value }))}>{["Diesel", "CNG", "Electric", "Petrol"].map(x => <option key={x}>{x}</option>)}</select></Field>
            <Field label="Status"><select style={SEL} value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>{["active", "idle", "maintenance"].map(x => <option key={x}>{x}</option>)}</select></Field>
            <Field label="Year of Manufacture"><input style={INP} type="number" value={form.year} onChange={e => setForm(f => ({ ...f, year: e.target.value }))} placeholder="2022" /></Field>
            <Field label="KM Run"><input style={INP} type="number" value={form.kmRun} onChange={e => setForm(f => ({ ...f, kmRun: e.target.value }))} /></Field>
            <Field label="Last Service Date"><input style={INP} type="date" value={form.lastService} onChange={e => setForm(f => ({ ...f, lastService: e.target.value }))} /></Field>
            <Field label="Assign Route" span><select style={SEL} value={form.routeId || ""} onChange={e => setForm(f => ({ ...f, routeId: e.target.value || null }))}>
                <option value="">— No Route —</option>{routes.map(r => <option key={r.id} value={r.id}>{r.id}: {r.name}</option>)}
            </select></Field>
            <Field label="Assign Driver" span><select style={SEL} value={form.driverId || ""} onChange={e => setForm(f => ({ ...f, driverId: e.target.value || null }))}>
                <option value="">— No Driver —</option>{drivers.map(d => <option key={d.id} value={d.id}>{d.name} ({d.status})</option>)}
            </select></Field>
        </div>
    );

    return (
        <div>
            <div style={PG.hdr}>
                <div><h2 style={PG.title}>Bus Management</h2><p style={PG.sub}>{buses.length} buses in your fleet</p></div>
                <button style={B.primary} onClick={() => { setForm(EMPTY_BUS); setModal("add"); }}>+ Add Bus</button>
            </div>
            <div style={PG.bar}>
                <input style={PG.srch} placeholder="🔍 Search by number or model..." value={search} onChange={e => setSearch(e.target.value)} />
                <div style={{ display: "flex", gap: 6 }}>
                    {["All", "Active", "Idle", "Maintenance"].map(f => (
                        <button key={f} onClick={() => setFilter(f)} style={{ padding: "8px 16px", borderRadius: 8, border: "1.5px solid", borderColor: filter === f ? "#4f46e5" : "#e2e8f0", background: filter === f ? "#eef2ff" : "white", color: filter === f ? "#4f46e5" : "#64748b", fontWeight: filter === f ? 700 : 500, fontSize: 13, cursor: "pointer" }}>{f}</button>
                    ))}
                </div>
            </div>
            <div style={TABLE.card}>
                <table style={TABLE.table}>
                    <thead><tr>
                        <th style={TABLE.th}>Bus No.</th><th style={TABLE.th}>Model</th><th style={TABLE.th}>Capacity</th>
                        <th style={TABLE.th}>Fuel</th><th style={TABLE.th}>Route</th><th style={TABLE.th}>Driver</th>
                        <th style={TABLE.th}>KM Run</th><th style={TABLE.th}>Status</th><th style={TABLE.th}>Actions</th>
                    </tr></thead>
                    <tbody>
                        {filtered.length === 0 && <tr><td colSpan={9} style={{ padding: 32, textAlign: "center", color: "#94a3b8" }}>No buses found.</td></tr>}
                        {filtered.map(b => (
                            <tr key={b.id} onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"} onMouseLeave={e => e.currentTarget.style.background = ""}>
                                <td style={TABLE.td}><code style={{ background: "#eef2ff", color: "#4f46e5", padding: "3px 8px", borderRadius: 6, fontSize: 12, fontWeight: 700 }}>{b.number}</code></td>
                                <td style={{ ...TABLE.td, fontWeight: 600 }}>{b.model}</td>
                                <td style={TABLE.td}>{b.capacity}</td>
                                <td style={TABLE.td}>{b.fuel}</td>
                                <td style={TABLE.td}>{routeName(b.routeId)}</td>
                                <td style={TABLE.td}>{driverName(b.driverId)}</td>
                                <td style={TABLE.td}>{(b.kmRun || 0).toLocaleString()} km</td>
                                <td style={TABLE.td}><Badge val={b.status} /></td>
                                <td style={TABLE.td}>
                                    <div style={{ display: "flex", gap: 5 }}>
                                        <button style={{ ...B.sm, background: "#f1f5f9", color: "#475569" }} onClick={() => { setSel(b); setModal("view") }}>👁</button>
                                        <button style={{ ...B.sm, background: "#dbeafe", color: "#1e40af" }} onClick={() => { setSel(b); setForm({ ...b, driverId: b.driverId || "", routeId: b.routeId || "" }); setModal("edit") }}>✏</button>
                                        <button style={{ ...B.sm, background: "#fee2e2", color: "#991b1b" }} onClick={() => { setSel(b); setModal("delete") }}>🗑</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {(modal === "add" || modal === "edit") && <Modal title={modal === "add" ? "🚌 Add New Bus" : "✏ Edit Bus"} onClose={() => setModal(null)}><BusForm /><div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}><button style={B.cancel} onClick={() => setModal(null)}>Cancel</button><button style={B.primary} onClick={save}>{modal === "add" ? "Add Bus" : "Save Changes"}</button></div></Modal>}
            {modal === "view" && sel && <Modal title="🚌 Bus Details" onClose={() => setModal(null)}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
                    {[["Bus Number", sel.number], ["Model", sel.model], ["Capacity", sel.capacity + " seats"], ["Fuel", sel.fuel], ["Year", sel.year || "—"], ["KM Run", (sel.kmRun || 0).toLocaleString() + " km"], ["Last Service", sel.lastService || "—"], ["Route", routeName(sel.routeId)], ["Driver", driverName(sel.driverId)], ["Status", sel.status]].map(([k, v]) => (
                        <div key={k} style={{ background: "#f8fafc", padding: "12px 14px", borderRadius: 10 }}>
                            <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 700, textTransform: "uppercase" }}>{k}</div>
                            <div style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", marginTop: 3 }}>{v}</div>
                        </div>
                    ))}
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end" }}><button style={B.primary} onClick={() => setModal(null)}>Close</button></div>
            </Modal>}
            {modal === "delete" && sel && <ConfirmDel name={sel.number} onConfirm={() => { setBuses(p => p.filter(b => b.id !== sel.id)); setModal(null); showToast("Bus deleted.", "error"); }} onClose={() => setModal(null)} />}
        </div>
    );
}

// ═══════════════════════════════════════════════════════════
// 3. DRIVER MANAGEMENT
// ═══════════════════════════════════════════════════════════
function DriverManagement({ drivers, setDrivers, buses, showToast }) {
    const [modal, setModal] = useState(null);
    const [sel, setSel] = useState(null);
    const [form, setForm] = useState(EMPTY_DRIVER);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("All");

    const filtered = drivers
        .filter(d => filter === "All" || d.status === filter.toLowerCase().replace(" ", "-"))
        .filter(d => d.name.toLowerCase().includes(search.toLowerCase()) || d.license.toLowerCase().includes(search.toLowerCase()));

    const busNum = id => buses.find(b => b.id === id)?.number || "Unassigned";
    const stars = r => "★".repeat(Math.floor(r)) + "☆".repeat(5 - Math.floor(r));

    const save = () => {
        if (!form.name || !form.phone || !form.license) { showToast("Fill required fields.", "error"); return; }
        if (modal === "add") {
            setDrivers(p => [...p, { ...form, id: Math.max(...p.map(x => x.id), 0) + 1, busId: form.busId ? +form.busId : null, rating: +form.rating }]);
            showToast("Driver added.");
        } else {
            setDrivers(p => p.map(d => d.id === sel.id ? { ...form, id: sel.id, busId: form.busId ? +form.busId : null, rating: +form.rating } : d));
            showToast("Driver updated.");
        }
        setModal(null);
    };

    const DForm = () => (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 24 }}>
            <Field label="Full Name" required><input style={INP} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></Field>
            <Field label="Phone" required><input style={INP} type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} /></Field>
            <Field label="License No." required><input style={INP} value={form.license} onChange={e => setForm(f => ({ ...f, license: e.target.value }))} /></Field>
            <Field label="Experience"><input style={INP} value={form.experience} onChange={e => setForm(f => ({ ...f, experience: e.target.value }))} placeholder="e.g. 5 yrs" /></Field>
            <Field label="Status"><select style={SEL} value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}><option value="on-duty">On Duty</option><option value="off-duty">Off Duty</option></select></Field>
            <Field label="Rating (1–5)"><input style={INP} type="number" min="1" max="5" step="0.1" value={form.rating} onChange={e => setForm(f => ({ ...f, rating: e.target.value }))} /></Field>
            <Field label="Joining Date"><input style={INP} type="date" value={form.joinDate} onChange={e => setForm(f => ({ ...f, joinDate: e.target.value }))} /></Field>
            <Field label="Assign Bus"><select style={SEL} value={form.busId || ""} onChange={e => setForm(f => ({ ...f, busId: e.target.value || null }))}>
                <option value="">— No Bus —</option>{buses.map(b => <option key={b.id} value={b.id}>{b.number}</option>)}
            </select></Field>
        </div>
    );

    return (
        <div>
            <div style={PG.hdr}>
                <div><h2 style={PG.title}>Driver Management</h2><p style={PG.sub}>{drivers.length} drivers · {drivers.filter(d => d.status === "on-duty").length} on duty</p></div>
                <button style={B.primary} onClick={() => { setForm(EMPTY_DRIVER); setModal("add"); }}>+ Add Driver</button>
            </div>
            <div style={PG.bar}>
                <input style={PG.srch} placeholder="🔍 Search by name or license..." value={search} onChange={e => setSearch(e.target.value)} />
                <div style={{ display: "flex", gap: 6 }}>
                    {["All", "On Duty", "Off Duty"].map(f => (
                        <button key={f} onClick={() => setFilter(f)} style={{ padding: "8px 16px", borderRadius: 8, border: "1.5px solid", borderColor: filter === f ? "#4f46e5" : "#e2e8f0", background: filter === f ? "#eef2ff" : "white", color: filter === f ? "#4f46e5" : "#64748b", fontWeight: filter === f ? 700 : 500, fontSize: 13, cursor: "pointer" }}>{f}</button>
                    ))}
                </div>
            </div>
            <div style={TABLE.card}>
                <table style={TABLE.table}>
                    <thead><tr>
                        <th style={TABLE.th}>Name</th><th style={TABLE.th}>Phone</th><th style={TABLE.th}>License</th>
                        <th style={TABLE.th}>Experience</th><th style={TABLE.th}>Assigned Bus</th>
                        <th style={TABLE.th}>Rating</th><th style={TABLE.th}>Status</th><th style={TABLE.th}>Actions</th>
                    </tr></thead>
                    <tbody>
                        {filtered.length === 0 && <tr><td colSpan={8} style={{ padding: 32, textAlign: "center", color: "#94a3b8" }}>No drivers found.</td></tr>}
                        {filtered.map(d => (
                            <tr key={d.id} onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"} onMouseLeave={e => e.currentTarget.style.background = ""}>
                                <td style={{ ...TABLE.td, fontWeight: 700 }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                        <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg,#4f46e5,#818cf8)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, flexShrink: 0 }}>{d.name[0]}</div>
                                        {d.name}
                                    </div>
                                </td>
                                <td style={TABLE.td}>{d.phone}</td>
                                <td style={TABLE.td}><code style={{ background: "#f1f5f9", padding: "2px 7px", borderRadius: 5, fontSize: 12 }}>{d.license}</code></td>
                                <td style={TABLE.td}>{d.experience}</td>
                                <td style={TABLE.td}>{busNum(d.busId)}</td>
                                <td style={TABLE.td}><span style={{ color: "#f59e0b", fontSize: 15 }}>{stars(d.rating)}</span> <span style={{ fontSize: 12, color: "#64748b" }}>{d.rating}</span></td>
                                <td style={TABLE.td}><Badge val={d.status} /></td>
                                <td style={TABLE.td}>
                                    <div style={{ display: "flex", gap: 5 }}>
                                        <button style={{ ...B.sm, background: "#f1f5f9", color: "#475569" }} onClick={() => { setSel(d); setModal("view") }}>👁</button>
                                        <button style={{ ...B.sm, background: "#dbeafe", color: "#1e40af" }} onClick={() => { setSel(d); setForm({ ...d, busId: d.busId || "" }); setModal("edit") }}>✏</button>
                                        <button style={{ ...B.sm, background: "#fee2e2", color: "#991b1b" }} onClick={() => { setSel(d); setModal("delete") }}>🗑</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {(modal === "add" || modal === "edit") && <Modal title={modal === "add" ? "👤 Add Driver" : "✏ Edit Driver"} onClose={() => setModal(null)}><DForm /><div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}><button style={B.cancel} onClick={() => setModal(null)}>Cancel</button><button style={B.primary} onClick={save}>{modal === "add" ? "Add Driver" : "Save Changes"}</button></div></Modal>}
            {modal === "view" && sel && <Modal title="👤 Driver Profile" onClose={() => setModal(null)}>
                <div style={{ textAlign: "center", marginBottom: 20 }}>
                    <div style={{ width: 72, height: 72, borderRadius: "50%", background: "linear-gradient(135deg,#4f46e5,#8b5cf6)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, fontWeight: 800, margin: "0 auto 10px" }}>{sel.name[0]}</div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: "#0f172a" }}>{sel.name}</div>
                    <div style={{ color: "#f59e0b", fontSize: 18, marginTop: 4 }}>{"★".repeat(Math.floor(sel.rating))}{"☆".repeat(5 - Math.floor(sel.rating))} <span style={{ fontSize: 13, color: "#64748b" }}>{sel.rating}</span></div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
                    {[["Phone", sel.phone], ["License", sel.license], ["Experience", sel.experience], ["Joining Date", sel.joinDate || "—"], ["Assigned Bus", busNum(sel.busId)], ["Status", sel.status]].map(([k, v]) => (
                        <div key={k} style={{ background: "#f8fafc", padding: "11px 14px", borderRadius: 10 }}>
                            <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 700, textTransform: "uppercase" }}>{k}</div>
                            <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", marginTop: 3 }}>{v}</div>
                        </div>
                    ))}
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end" }}><button style={B.primary} onClick={() => setModal(null)}>Close</button></div>
            </Modal>}
            {modal === "delete" && sel && <ConfirmDel name={sel.name} onConfirm={() => { setDrivers(p => p.filter(d => d.id !== sel.id)); setModal(null); showToast("Driver deleted.", "error"); }} onClose={() => setModal(null)} />}
        </div>
    );
}

// ═══════════════════════════════════════════════════════════
// 4. ROUTE MANAGEMENT
// ═══════════════════════════════════════════════════════════
function RouteManagement({ routes, setRoutes, buses, showToast }) {
    const [modal, setModal] = useState(null);
    const [sel, setSel] = useState(null);
    const [form, setForm] = useState(EMPTY_ROUTE);
    const [search, setSearch] = useState("");

    const filtered = routes.filter(r =>
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.from.toLowerCase().includes(search.toLowerCase()) ||
        r.to.toLowerCase().includes(search.toLowerCase())
    );

    const busOnRoute = routeId => buses.find(b => b.routeId === routeId)?.number || "—";

    const save = () => {
        if (!form.name || !form.from || !form.to) { showToast("Fill required fields.", "error"); return; }
        const stopsArr = typeof form.stops === "string" ? form.stops.split(",").map(s => s.trim()).filter(Boolean) : form.stops;
        if (modal === "add") {
            const newId = "R-" + (Math.max(...routes.map(r => +r.id.split("-")[1] || 100), 100) + 1);
            setRoutes(p => [...p, { ...form, id: newId, stops: stopsArr, fare: +form.fare || 0 }]);
            showToast("Route added.");
        } else {
            setRoutes(p => p.map(r => r.id === sel.id ? { ...form, id: sel.id, stops: stopsArr, fare: +form.fare || 0 } : r));
            showToast("Route updated.");
        }
        setModal(null);
    };

    const RForm = () => (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 24 }}>
            <Field label="Route Name" required span><input style={INP} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="City Center → Airport" /></Field>
            <Field label="From" required><input style={INP} value={form.from} onChange={e => setForm(f => ({ ...f, from: e.target.value }))} placeholder="Starting point" /></Field>
            <Field label="To" required><input style={INP} value={form.to} onChange={e => setForm(f => ({ ...f, to: e.target.value }))} placeholder="Ending point" /></Field>
            <Field label="Distance"><input style={INP} value={form.distance} onChange={e => setForm(f => ({ ...f, distance: e.target.value }))} placeholder="e.g. 25 km" /></Field>
            <Field label="Duration"><input style={INP} value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} placeholder="e.g. 45 min" /></Field>
            <Field label="Fare (₹)"><input style={INP} type="number" value={form.fare} onChange={e => setForm(f => ({ ...f, fare: e.target.value }))} /></Field>
            <Field label="Status"><select style={SEL} value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}><option value="active">Active</option><option value="inactive">Inactive</option></select></Field>
            <Field label="Stops (comma-separated)" span><input style={INP} value={Array.isArray(form.stops) ? form.stops.join(", ") : form.stops} onChange={e => setForm(f => ({ ...f, stops: e.target.value }))} placeholder="Stop 1, Stop 2, Stop 3" /></Field>
        </div>
    );

    return (
        <div>
            <div style={PG.hdr}>
                <div><h2 style={PG.title}>Route Management</h2><p style={PG.sub}>{routes.length} routes configured</p></div>
                <button style={B.primary} onClick={() => { setForm(EMPTY_ROUTE); setModal("add"); }}>+ Add Route</button>
            </div>
            <div style={PG.bar}>
                <input style={PG.srch} placeholder="🔍 Search routes..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(340px,1fr))", gap: 16 }}>
                {filtered.length === 0 && <p style={{ color: "#94a3b8", padding: 32 }}>No routes found.</p>}
                {filtered.map(r => (
                    <div key={r.id} style={{ background: "#fff", borderRadius: 18, padding: 22, boxShadow: "0 4px 20px rgba(0,0,0,.06)", borderTop: `4px solid ${r.status === "active" ? "#10b981" : "#e2e8f0"}` }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                            <div>
                                <code style={{ background: "#eef2ff", color: "#4f46e5", padding: "2px 8px", borderRadius: 6, fontSize: 11, fontWeight: 700 }}>{r.id}</code>
                                <div style={{ fontSize: 16, fontWeight: 800, color: "#0f172a", marginTop: 5 }}>{r.name}</div>
                            </div>
                            <Badge val={r.status} />
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
                            {[["📍 From", r.from], ["🏁 To", r.to], ["📏 Distance", r.distance || "—"], ["⏱ Duration", r.duration || "—"], ["💰 Fare", `₹${r.fare}`], ["🚌 Bus", busOnRoute(r.id)]].map(([lbl, val]) => (
                                <div key={lbl} style={{ fontSize: 13 }}>
                                    <span style={{ color: "#94a3b8" }}>{lbl}:</span> <strong style={{ color: "#334155" }}>{val}</strong>
                                </div>
                            ))}
                        </div>
                        {/* Stops timeline */}
                        <div style={{ marginBottom: 14 }}>
                            <div style={{ fontSize: 12, color: "#94a3b8", fontWeight: 700, marginBottom: 6 }}>STOPS ({r.stops?.length})</div>
                            <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 0 }}>
                                {(r.stops || []).map((s, i) => (
                                    <React.Fragment key={i}>
                                        <span style={{ fontSize: 12, background: "#f1f5f9", color: "#334155", padding: "3px 9px", borderRadius: 20, fontWeight: 600 }}>{s}</span>
                                        {i < r.stops.length - 1 && <span style={{ color: "#cbd5e1", fontSize: 14, margin: "0 2px" }}>→</span>}
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>
                        <div style={{ display: "flex", gap: 8 }}>
                            <button style={{ ...B.sm, background: "#f1f5f9", color: "#475569", flex: 1 }} onClick={() => { setSel(r); setModal("view") }}>👁 View</button>
                            <button style={{ ...B.sm, background: "#dbeafe", color: "#1e40af", flex: 1 }} onClick={() => { setSel(r); setForm({ ...r, stops: Array.isArray(r.stops) ? r.stops.join(", ") : r.stops }); setModal("edit") }}>✏ Edit</button>
                            <button style={{ ...B.sm, background: "#fee2e2", color: "#991b1b", flex: 1 }} onClick={() => { setSel(r); setModal("delete") }}>🗑 Delete</button>
                        </div>
                    </div>
                ))}
            </div>

            {(modal === "add" || modal === "edit") && <Modal title={modal === "add" ? "🗺 Add Route" : "✏ Edit Route"} onClose={() => setModal(null)} wide><RForm /><div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}><button style={B.cancel} onClick={() => setModal(null)}>Cancel</button><button style={B.primary} onClick={save}>{modal === "add" ? "Add Route" : "Save Changes"}</button></div></Modal>}
            {modal === "delete" && sel && <ConfirmDel name={sel.name} onConfirm={() => { setRoutes(p => p.filter(r => r.id !== sel.id)); setModal(null); showToast("Route deleted.", "error"); }} onClose={() => setModal(null)} />}
        </div>
    );
}

// ═══════════════════════════════════════════════════════════
// 5. TRIP MANAGEMENT
// ═══════════════════════════════════════════════════════════
function TripManagement({ trips, setTrips, buses, drivers, routes, showToast }) {
    const [modal, setModal] = useState(null);
    const [sel, setSel] = useState(null);
    const [form, setForm] = useState(EMPTY_TRIP);
    const [filter, setFilter] = useState("All");
    const [dateFilter, setDateFilter] = useState("");

    const filtered = trips
        .filter(t => filter === "All" || t.status === filter.toLowerCase().replace(" ", "-"))
        .filter(t => !dateFilter || t.date === dateFilter);

    const busNum = id => buses.find(b => b.id === +id)?.number || "—";
    const drvName = id => drivers.find(d => d.id === +id)?.name || "—";
    const rtName = id => routes.find(r => r.id === id)?.name || id;

    const save = () => {
        if (!form.routeId || !form.busId || !form.driverId || !form.date || !form.time) { showToast("Fill all required fields.", "error"); return; }
        // Conflict check: same bus on same date+time
        const conflict = trips.find(t => t.id !== sel?.id && t.busId === +form.busId && t.date === form.date && t.time === form.time);
        if (conflict) { showToast(`Bus already has a trip at ${form.time} on ${form.date}!`, "error"); return; }
        if (modal === "add") {
            const newId = "T-" + (Math.max(...trips.map(t => +t.id.split("-")[1] || 2000), 2000) + 1);
            setTrips(p => [...p, { ...form, id: newId, busId: +form.busId, driverId: +form.driverId, passengers: 0, revenue: 0 }]);
            showToast("Trip scheduled.");
        } else {
            setTrips(p => p.map(t => t.id === sel.id ? { ...form, id: sel.id, busId: +form.busId, driverId: +form.driverId, passengers: +form.passengers || 0, revenue: +form.revenue || 0 } : t));
            showToast("Trip updated.");
        }
        setModal(null);
    };

    const TForm = () => (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 24 }}>
            <Field label="Route" required span><select style={SEL} value={form.routeId} onChange={e => setForm(f => ({ ...f, routeId: e.target.value }))}>
                <option value="">— Select Route —</option>{routes.map(r => <option key={r.id} value={r.id}>{r.id}: {r.name}</option>)}
            </select></Field>
            <Field label="Bus" required><select style={SEL} value={form.busId} onChange={e => setForm(f => ({ ...f, busId: e.target.value }))}>
                <option value="">— Select Bus —</option>{buses.map(b => <option key={b.id} value={b.id}>{b.number}</option>)}
            </select></Field>
            <Field label="Driver" required><select style={SEL} value={form.driverId} onChange={e => setForm(f => ({ ...f, driverId: e.target.value }))}>
                <option value="">— Select Driver —</option>{drivers.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select></Field>
            <Field label="Date" required><input style={INP} type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} /></Field>
            <Field label="Departure Time" required><input style={INP} type="time" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} /></Field>
            <Field label="Status"><select style={SEL} value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                {["scheduled", "in-progress", "completed", "cancelled"].map(s => <option key={s} value={s}>{s}</option>)}
            </select></Field>
            {modal === "edit" && <>
                <Field label="Passengers"><input style={INP} type="number" value={form.passengers || 0} onChange={e => setForm(f => ({ ...f, passengers: e.target.value }))} /></Field>
                <Field label="Revenue (₹)"><input style={INP} type="number" value={form.revenue || 0} onChange={e => setForm(f => ({ ...f, revenue: e.target.value }))} /></Field>
            </>}
        </div>
    );

    const statusColors = { scheduled: "#f59e0b", "in-progress": "#3b82f6", completed: "#10b981", cancelled: "#ef4444" };

    return (
        <div>
            <div style={PG.hdr}>
                <div><h2 style={PG.title}>Trip Management</h2><p style={PG.sub}>{trips.length} total trips · {trips.filter(t => t.status === "in-progress").length} live now</p></div>
                <button style={B.primary} onClick={() => { setForm(EMPTY_TRIP); setModal("add") }}>+ Schedule Trip</button>
            </div>

            {/* Summary chips */}
            <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
                {["scheduled", "in-progress", "completed", "cancelled"].map(s => {
                    const cnt = trips.filter(t => t.status === s).length;
                    return <div key={s} style={{ background: "white", borderRadius: 12, padding: "10px 18px", boxShadow: "0 2px 8px rgba(0,0,0,.06)", display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 10, height: 10, borderRadius: "50%", background: statusColors[s] }} />
                        <span style={{ fontSize: 13, color: "#64748b", textTransform: "capitalize" }}>{s}:</span>
                        <strong style={{ color: "#0f172a" }}>{cnt}</strong>
                    </div>;
                })}
            </div>

            <div style={PG.bar}>
                <div style={{ display: "flex", gap: 6 }}>
                    {["All", "Scheduled", "In Progress", "Completed", "Cancelled"].map(f => (
                        <button key={f} onClick={() => setFilter(f)} style={{ padding: "8px 14px", borderRadius: 8, border: "1.5px solid", borderColor: filter === f ? "#4f46e5" : "#e2e8f0", background: filter === f ? "#eef2ff" : "white", color: filter === f ? "#4f46e5" : "#64748b", fontWeight: filter === f ? 700 : 500, fontSize: 12, cursor: "pointer" }}>{f}</button>
                    ))}
                </div>
                <input type="date" style={{ ...PG.srch, flex: "unset", width: 160 }} value={dateFilter} onChange={e => setDateFilter(e.target.value)} title="Filter by date" />
                {dateFilter && <button onClick={() => setDateFilter("")} style={{ ...B.sm, background: "#fee2e2", color: "#991b1b" }}>✕ Clear</button>}
            </div>

            <div style={TABLE.card}>
                <table style={TABLE.table}>
                    <thead><tr>
                        <th style={TABLE.th}>Trip ID</th><th style={TABLE.th}>Route</th><th style={TABLE.th}>Bus</th>
                        <th style={TABLE.th}>Driver</th><th style={TABLE.th}>Date</th><th style={TABLE.th}>Time</th>
                        <th style={TABLE.th}>Passengers</th><th style={TABLE.th}>Revenue</th><th style={TABLE.th}>Status</th><th style={TABLE.th}>Actions</th>
                    </tr></thead>
                    <tbody>
                        {filtered.length === 0 && <tr><td colSpan={10} style={{ padding: 32, textAlign: "center", color: "#94a3b8" }}>No trips found.</td></tr>}
                        {filtered.map(t => (
                            <tr key={t.id} onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"} onMouseLeave={e => e.currentTarget.style.background = ""}>
                                <td style={TABLE.td}><code style={{ background: "#eef2ff", color: "#4f46e5", padding: "2px 8px", borderRadius: 6, fontSize: 12, fontWeight: 700 }}>{t.id}</code></td>
                                <td style={{ ...TABLE.td, maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{rtName(t.routeId)}</td>
                                <td style={TABLE.td}>{busNum(t.busId)}</td>
                                <td style={TABLE.td}>{drvName(t.driverId)}</td>
                                <td style={TABLE.td}>{t.date}</td>
                                <td style={TABLE.td}>{t.time}</td>
                                <td style={TABLE.td}>{t.passengers || "—"}</td>
                                <td style={TABLE.td}>{t.revenue ? `₹${t.revenue}` : "—"}</td>
                                <td style={TABLE.td}><Badge val={t.status} /></td>
                                <td style={TABLE.td}>
                                    <div style={{ display: "flex", gap: 5 }}>
                                        <button style={{ ...B.sm, background: "#dbeafe", color: "#1e40af" }} onClick={() => { setSel(t); setForm({ ...t }); setModal("edit") }}>✏</button>
                                        <button style={{ ...B.sm, background: "#fee2e2", color: "#991b1b" }} onClick={() => { setSel(t); setModal("delete") }}>🗑</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {(modal === "add" || modal === "edit") && <Modal title={modal === "add" ? "📋 Schedule Trip" : "✏ Edit Trip"} onClose={() => setModal(null)} wide><TForm /><div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}><button style={B.cancel} onClick={() => setModal(null)}>Cancel</button><button style={B.primary} onClick={save}>{modal === "add" ? "Schedule Trip" : "Save Changes"}</button></div></Modal>}
            {modal === "delete" && sel && <ConfirmDel name={sel.id} onConfirm={() => { setTrips(p => p.filter(t => t.id !== sel.id)); setModal(null); showToast("Trip deleted.", "error"); }} onClose={() => setModal(null)} />}
        </div>
    );
}

// ═══════════════════════════════════════════════════════════
// 6. LIVE TRACKING — Real Firebase GPS
// ═══════════════════════════════════════════════════════════
function LiveTracking({ buses, drivers }) {
    const [liveBuses, setLiveBuses] = useState([]);
    const [sel, setSel]             = useState(null);
    const [lastTick, setLastTick]   = useState(new Date().toLocaleTimeString());

    // ✅ Real Firebase listener
    useEffect(() => {
        const tripsRef = ref(_db, "trips");
        const unsubscribe = onValue(tripsRef, (snap) => {
            const data = snap.val();
            if (!data) { setLiveBuses([]); return; }

            const active = [];
            Object.entries(data).forEach(([tripCode, trip]) => {
                if (trip.status === "ended" || !trip.drivers) return;
                Object.entries(trip.drivers).forEach(([driverId, driver]) => {
                    if (!driver.latitude || !driver.longitude) return;
                    const ageMin = (Date.now() - (driver.updatedAt || 0)) / 60000;
                    if (ageMin > 10) return;
                    const matchedDriver = drivers.find(d => d.phone === driverId);
                    const matchedBus    = matchedDriver ? buses.find(b => b.id === matchedDriver.busId) : null;
                    active.push({
                        tripCode, driverId,
                        lat:        driver.latitude,
                        lng:        driver.longitude,
                        speed:      driver.speed || 0,
                        ageMin:     ageMin.toFixed(1),
                        updatedAt:  driver.updatedAt,
                        from:       trip.from  || "—",
                        to:         trip.to    || "—",
                        busNo:      trip.busNo || matchedBus?.number || "Unknown",
                        driverName: matchedDriver?.name || driverId,
                        status:     trip.status || "active",
                    });
                });
            });

            setLiveBuses(active);
            setLastTick(new Date().toLocaleTimeString());
        });
        return () => unsubscribe();
    }, [buses, drivers]);

    return (
        <div>
            {/* Header */}
            <div style={PG.hdr}>
                <div>
                    <h2 style={PG.title}>Live GPS Tracking</h2>
                    <p style={PG.sub}>{liveBuses.length} bus{liveBuses.length !== 1 ? "es" : ""} transmitting · last sync: {lastTick}</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, background: liveBuses.length > 0 ? "#dcfce7" : "#fee2e2", padding: "8px 16px", borderRadius: 10 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: liveBuses.length > 0 ? "#10b981" : "#ef4444", animation: "pulse 1.5s infinite" }} />
                    <span style={{ fontSize: 13, fontWeight: 700, color: liveBuses.length > 0 ? "#065f46" : "#991b1b" }}>
                        {liveBuses.length > 0 ? "LIVE" : "NO SIGNAL"}
                    </span>
                </div>
            </div>

            {/* No buses */}
            {liveBuses.length === 0 && (
                <div style={{ textAlign: "center", background: "#fff", borderRadius: 18, padding: 60, color: "#94a3b8" }}>
                    <div style={{ fontSize: 48, marginBottom: 16 }}>📡</div>
                    <h3 style={{ color: "#374151", marginBottom: 8 }}>No Active Buses</h3>
                    <p style={{ fontSize: 14 }}>Waiting for drivers to start trips in the Driver App...</p>
                    <p style={{ fontSize: 12, marginTop: 8, color: "#cbd5e1" }}>Auto-refreshes from Firebase in real time</p>
                </div>
            )}

            {liveBuses.length > 0 && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20 }}>
                    {/* Simulated map with real coords */}
                    <div style={{ background: "#1e293b", borderRadius: 18, overflow: "hidden", position: "relative", minHeight: 480 }}>
                        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(148,163,184,.1) 1px,transparent 1px),linear-gradient(90deg,rgba(148,163,184,.1) 1px,transparent 1px)", backgroundSize: "40px 40px" }} />
                        <div style={{ position: "absolute", top: "45%", left: 0, right: 0, height: 3, background: "rgba(148,163,184,.2)" }} />
                        <div style={{ position: "absolute", top: 0, bottom: 0, left: "55%", width: 3, background: "rgba(148,163,184,.2)" }} />
                        <div style={{ position: "absolute", top: 16, left: 16, background: "rgba(15,23,42,.75)", color: "white", padding: "6px 12px", borderRadius: 8, fontSize: 12, fontWeight: 600 }}>
                            🗺 Tamil Nadu — Real GPS from Firebase
                        </div>
                        <div style={{ position: "absolute", top: 16, right: 16, background: "rgba(15,23,42,.75)", color: "white", padding: "8px 10px", borderRadius: 8, fontSize: 14, textAlign: "center" }}>
                            N<br /><span style={{ fontSize: 8, color: "#94a3b8" }}>↑</span>
                        </div>
                        {liveBuses.map((g) => {
                            const baseLat  = liveBuses[0].lat;
                            const baseLng  = liveBuses[0].lng;
                            const xClamped = Math.max(8, Math.min(90, 50 + (g.lng - baseLng) * 800));
                            const yClamped = Math.max(10, Math.min(85, 50 - (g.lat - baseLat) * 800));
                            const isSelected = sel === g.tripCode;
                            return (
                                <div key={g.tripCode} onClick={() => setSel(isSelected ? null : g.tripCode)}
                                    style={{ position: "absolute", left: `${xClamped}%`, top: `${yClamped}%`, cursor: "pointer", transform: "translate(-50%,-100%)", zIndex: isSelected ? 10 : 5, transition: "left 1s ease, top 1s ease" }}>
                                    <div style={{ background: isSelected ? "#f59e0b" : "#4f46e5", color: "white", borderRadius: "50% 50% 50% 0", width: 42, height: 42, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, boxShadow: `0 4px 20px ${isSelected ? "rgba(245,158,11,.6)" : "rgba(79,70,229,.5)"}`, border: `3px solid ${isSelected ? "#fde68a" : "white"}`, transform: "rotate(-45deg)" }}>
                                        <span style={{ transform: "rotate(45deg)" }}>🚌</span>
                                    </div>
                                    <div style={{ textAlign: "center", marginTop: 4, background: "rgba(15,23,42,.85)", color: "white", padding: "3px 8px", borderRadius: 6, fontSize: 11, fontWeight: 700, whiteSpace: "nowrap" }}>
                                        {g.busNo.slice(-8)}
                                    </div>
                                </div>
                            );
                        })}
                        <div style={{ position: "absolute", bottom: 16, left: 16, display: "flex", gap: 8, flexWrap: "wrap" }}>
                            {liveBuses.map(g => (
                                <div key={g.tripCode} style={{ background: "rgba(15,23,42,.85)", color: "white", padding: "5px 10px", borderRadius: 8, fontSize: 12 }}>
                                    🚌 {g.speed > 0 ? `${(g.speed * 3.6).toFixed(0)} km/h` : "Stopped"}
                                </div>
                            ))}
                        </div>
                        <div style={{ position: "absolute", bottom: 16, right: 16, background: "rgba(16,185,129,.25)", color: "#10b981", padding: "5px 10px", borderRadius: 8, fontSize: 11, fontWeight: 700 }}>
                            ✅ Firebase Live
                        </div>
                    </div>

                    {/* Bus list */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 12, maxHeight: 520, overflowY: "auto" }}>
                        {liveBuses.map(g => (
                            <div key={g.tripCode} onClick={() => setSel(sel === g.tripCode ? null : g.tripCode)}
                                style={{ background: "#fff", borderRadius: 14, padding: 16, boxShadow: "0 4px 16px rgba(0,0,0,.07)", cursor: "pointer", border: `2px solid ${sel === g.tripCode ? "#4f46e5" : "transparent"}`, transition: "border .2s" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                                    <div style={{ fontWeight: 800, color: "#0f172a", fontSize: 14 }}>{g.busNo}</div>
                                    <span style={{ fontSize: 11, fontWeight: 700, background: "#dcfce7", color: "#065f46", padding: "3px 10px", borderRadius: 20 }}>LIVE</span>
                                </div>
                                <div style={{ fontSize: 12, color: "#64748b", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                                    <span>👤 {g.driverName}</span>
                                    <span>🚗 {g.speed > 0 ? `${(g.speed * 3.6).toFixed(0)} km/h` : "Stopped"}</span>
                                    <span>📡 {g.ageMin}m ago</span>
                                    <span>🎫 Trip #{g.tripCode}</span>
                                    <span style={{ gridColumn: "1/-1", color: "#4f46e5", fontWeight: 600 }}>📍 {g.from} → {g.to}</span>
                                    <span style={{ gridColumn: "1/-1", fontFamily: "monospace", fontSize: 11 }}>{g.lat.toFixed(5)}, {g.lng.toFixed(5)}</span>
                                </div>
                                {sel === g.tripCode && (
                                    <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid #f1f5f9" }}>
                                        <div style={{ fontSize: 12, color: "#4f46e5", fontWeight: 700, marginBottom: 8 }}>LIVE GPS INFO</div>
                                        <div style={{ fontSize: 12, color: "#374151", display: "flex", flexDirection: "column", gap: 5 }}>
                                            <div>🌐 Lat: <strong>{g.lat.toFixed(6)}</strong></div>
                                            <div>🌐 Lng: <strong>{g.lng.toFixed(6)}</strong></div>
                                            <div>⚡ Speed: <strong>{g.speed > 0 ? `${(g.speed * 3.6).toFixed(1)} km/h` : "Stopped"}</strong></div>
                                            <div>🕐 Updated: <strong>{g.updatedAt ? new Date(g.updatedAt).toLocaleTimeString() : "—"}</strong></div>
                                        </div>
                                        <a href={`https://www.google.com/maps?q=${g.lat},${g.lng}`} target="_blank" rel="noreferrer"
                                            style={{ display: "block", marginTop: 10, background: "#4f46e5", color: "#fff", padding: "7px 12px", borderRadius: 8, fontSize: 12, fontWeight: 700, textAlign: "center", textDecoration: "none" }}>
                                            🗺 Open in Google Maps
                                        </a>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

// ═══════════════════════════════════════════════════════════
// 7. TRIP CODE MANAGER
// ═══════════════════════════════════════════════════════════
function TripCodeManager({ drivers, buses }) {
    const [form, setForm]       = useState({ driverPhone: "", busNo: "", from: "", to: "" });
    const [loading, setLoading] = useState(false);
    const [generated, setGenerated] = useState(null); // { tripCode, ... }
    const [allCodes, setAllCodes]   = useState([]);
    const [copied, setCopied]       = useState(false);

    // Load all trip codes from Firebase
    useEffect(() => {
        const unsub = onValue(ref(_db, "tripCodes"), (snap) => {
            const data = snap.val() || {};
            const list = Object.values(data).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
            setAllCodes(list);
        });
        return () => unsub();
    }, []);

    // Generate unique trip code: TC-XXXXXX
    async function generateCode() {
        const CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
        let code, exists;
        let tries = 0;
        do {
            let c = "TC-";
            for (let i = 0; i < 6; i++) c += CHARS[Math.floor(Math.random() * CHARS.length)];
            code = c;
            const snap = await get(ref(_db, `tripCodes/${code}`));
            exists = snap.exists();
            tries++;
            if (tries > 20) throw new Error("Could not generate unique code");
        } while (exists);
        return code;
    }

    async function createTripCode() {
        if (!form.driverPhone || !form.busNo || !form.from || !form.to) {
            alert("Please fill all fields.");
            return;
        }
        setLoading(true);
        setGenerated(null);
        try {
            const driver   = drivers.find(d => d.phone === form.driverPhone);
            if (!driver) { alert("Driver not found."); setLoading(false); return; }

            const tripCode = await generateCode();
            const now      = Date.now();
            const data     = {
                tripCode,
                driverPhone: form.driverPhone,
                driverName:  driver.name,
                busNo:       form.busNo,
                from:        form.from,
                to:          form.to,
                status:      "pending",
                createdAt:   now,
                expiresAt:   now + 24 * 60 * 60 * 1000, // 24 hours
            };
            await set(ref(_db, `tripCodes/${tripCode}`), data);
            setGenerated(data);
            setForm({ driverPhone: "", busNo: "", from: "", to: "" });
        } catch (err) {
            alert("Error: " + err.message);
        }
        setLoading(false);
    }

    function copyCode(code) {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    const statusColor = { pending: "#f59e0b", active: "#10b981", ended: "#6b7280", expired: "#ef4444" };
    const statusBg    = { pending: "#fef3c7", active: "#dcfce7", ended: "#f3f4f6", expired: "#fee2e2" };

    const TAMIL_DISTRICTS = [
        "Ariyalur","Chengalpattu","Chennai","Coimbatore","Cuddalore","Dharmapuri",
        "Dindigul","Erode","Kallakurichi","Kancheepuram","Kanyakumari","Karur",
        "Krishnagiri","Madurai","Mayiladuthurai","Nagapattinam","Namakkal",
        "Nilgiris","Perambalur","Pudukkottai","Ramanathapuram","Ranipet",
        "Salem","Sivaganga","Tenkasi","Thanjavur","Theni","Thoothukudi",
        "Tiruchirappalli","Tirunelveli","Tirupathur","Tiruppur","Tiruvallur",
        "Tiruvannamalai","Tiruvarur","Vellore","Villupuram","Virudhunagar",
    ];

    return (
        <div>
            {/* Header */}
            <div style={PG.hdr}>
                <div>
                    <h2 style={PG.title}>🎫 Trip Code Manager</h2>
                    <p style={PG.sub}>Generate & manage secure trip codes for drivers</p>
                </div>
                <div style={{ background: "#eef2ff", padding: "8px 16px", borderRadius: 10, fontSize: 13, fontWeight: 700, color: "#4f46e5" }}>
                    {allCodes.length} Codes Generated
                </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "400px 1fr", gap: 24 }}>

                {/* ── LEFT: Generate Form ── */}
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    <div style={{ background: "#fff", borderRadius: 20, padding: 24, boxShadow: "0 4px 20px rgba(0,0,0,.06)" }}>
                        <h3 style={{ margin: "0 0 18px", fontSize: 16, fontWeight: 800, color: "#0f172a" }}>
                            ➕ Create New Trip Code
                        </h3>

                        {/* Driver */}
                        <div style={{ marginBottom: 14 }}>
                            <label style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: .5, display: "block", marginBottom: 6 }}>
                                Assign Driver *
                            </label>
                            <select style={INP} value={form.driverPhone} onChange={e => {
                                const d = drivers.find(x => x.phone === e.target.value);
                                const b = d?.busId ? buses.find(b => b.id === d.busId)?.number || "" : "";
                                setForm(f => ({ ...f, driverPhone: e.target.value, busNo: b }));
                            }}>
                                <option value="">— Select Driver —</option>
                                {drivers.map(d => (
                                    <option key={d.id} value={d.phone}>
                                        {d.name} · {d.phone}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Bus */}
                        <div style={{ marginBottom: 14 }}>
                            <label style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: .5, display: "block", marginBottom: 6 }}>
                                Bus *
                            </label>
                            <select style={INP} value={form.busNo} onChange={e => setForm(f => ({ ...f, busNo: e.target.value }))}>
                                <option value="">— Select Bus —</option>
                                {buses.map(b => <option key={b.id} value={b.number}>{b.number} · {b.model}</option>)}
                            </select>
                        </div>

                        {/* From */}
                        <div style={{ marginBottom: 14 }}>
                            <label style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: .5, display: "block", marginBottom: 6 }}>
                                From District *
                            </label>
                            <select style={INP} value={form.from} onChange={e => setForm(f => ({ ...f, from: e.target.value }))}>
                                <option value="">— Select District —</option>
                                {TAMIL_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                        </div>

                        {/* To */}
                        <div style={{ marginBottom: 20 }}>
                            <label style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: .5, display: "block", marginBottom: 6 }}>
                                To District *
                            </label>
                            <select style={INP} value={form.to} onChange={e => setForm(f => ({ ...f, to: e.target.value }))}>
                                <option value="">— Select District —</option>
                                {TAMIL_DISTRICTS.filter(d => d !== form.from).map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                        </div>

                        <button
                            onClick={createTripCode}
                            disabled={loading}
                            style={{ width: "100%", background: loading ? "#94a3b8" : "#4f46e5", color: "#fff", border: "none", padding: "14px", fontSize: 15, fontWeight: 800, borderRadius: 12, cursor: loading ? "not-allowed" : "pointer" }}
                        >
                            {loading ? "⏳ Generating..." : "🎫 Generate Trip Code"}
                        </button>
                    </div>

                    {/* ── Generated Code Result ── */}
                    {generated && (
                        <div style={{ background: "#f0fdf4", border: "2px solid #86efac", borderRadius: 20, padding: 24, textAlign: "center" }}>
                            <div style={{ fontSize: 13, color: "#166534", fontWeight: 700, marginBottom: 10 }}>
                                ✅ Trip Code Generated!
                            </div>
                            <div style={{ fontSize: 40, fontWeight: 900, color: "#15803d", letterSpacing: 4, fontFamily: "monospace", marginBottom: 14 }}>
                                {generated.tripCode}
                            </div>
                            <button
                                onClick={() => copyCode(generated.tripCode)}
                                style={{ background: copied ? "#15803d" : "#4f46e5", color: "#fff", border: "none", padding: "9px 22px", borderRadius: 10, fontWeight: 700, fontSize: 13, cursor: "pointer", marginBottom: 14 }}
                            >
                                {copied ? "✅ Copied!" : "📋 Copy Code"}
                            </button>
                            <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.8, textAlign: "left", background: "#fff", borderRadius: 12, padding: "12px 16px" }}>
                                <div>👤 <strong>{generated.driverName}</strong></div>
                                <div>📞 {generated.driverPhone}</div>
                                <div>🚌 {generated.busNo}</div>
                                <div>📍 {generated.from} → {generated.to}</div>
                                <div>⏰ Valid for 24 hours</div>
                            </div>
                            <div style={{ marginTop: 12, background: "#fef3c7", borderRadius: 10, padding: "10px 14px", fontSize: 12, color: "#92400e", textAlign: "left" }}>
                                📲 Share this code with the driver via SMS or WhatsApp
                            </div>
                        </div>
                    )}
                </div>

                {/* ── RIGHT: All Trip Codes List ── */}
                <div style={{ background: "#fff", borderRadius: 20, padding: 24, boxShadow: "0 4px 20px rgba(0,0,0,.06)" }}>
                    <h3 style={{ margin: "0 0 18px", fontSize: 16, fontWeight: 800, color: "#0f172a" }}>
                        📋 All Generated Trip Codes
                    </h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10, maxHeight: 580, overflowY: "auto" }}>
                        {allCodes.length === 0 && (
                            <div style={{ textAlign: "center", color: "#94a3b8", padding: 60 }}>
                                <div style={{ fontSize: 40, marginBottom: 12 }}>🎫</div>
                                <p>No trip codes generated yet.</p>
                            </div>
                        )}
                        {allCodes.map(tc => (
                            <div key={tc.tripCode} style={{ border: "1.5px solid #e2e8f0", borderRadius: 14, padding: "14px 16px", display: "grid", gridTemplateColumns: "160px 1fr auto", gap: 12, alignItems: "center" }}>
                                {/* Code */}
                                <div>
                                    <div style={{ fontFamily: "monospace", fontSize: 20, fontWeight: 900, color: "#4f46e5", letterSpacing: 1 }}>
                                        {tc.tripCode}
                                    </div>
                                    <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 3 }}>
                                        {tc.createdAt ? new Date(tc.createdAt).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }) : "—"}
                                    </div>
                                </div>
                                {/* Details */}
                                <div style={{ fontSize: 13, color: "#374151", display: "flex", flexDirection: "column", gap: 3 }}>
                                    <div style={{ fontWeight: 700 }}>👤 {tc.driverName || "—"}</div>
                                    <div>📞 {tc.driverPhone}  ·  🚌 {tc.busNo}</div>
                                    <div style={{ color: "#4f46e5", fontWeight: 600 }}>📍 {tc.from} → {tc.to}</div>
                                </div>
                                {/* Status + Copy */}
                                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
                                    <span style={{ fontSize: 11, fontWeight: 800, background: statusBg[tc.status] || "#f3f4f6", color: statusColor[tc.status] || "#374151", padding: "4px 12px", borderRadius: 20, textTransform: "uppercase" }}>
                                        {tc.status}
                                    </span>
                                    {tc.status === "pending" && (
                                        <button onClick={() => copyCode(tc.tripCode)} style={{ background: "#eef2ff", border: "none", color: "#4f46e5", padding: "5px 12px", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                                            📋 Copy
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════
// 8. REPORTS
// ═══════════════════════════════════════════════════════════
function Reports({ trips, buses, drivers, routes }) {
    const completed = trips.filter(t => t.status === "completed");
    const totalRev = completed.reduce((s, t) => s + t.revenue, 0);
    const totalPax = completed.reduce((s, t) => s + t.passengers, 0);
    const avgPax = completed.length ? Math.round(totalPax / completed.length) : 0;

    // Revenue by route
    const routeRev = routes.map(r => {
        const rTrips = completed.filter(t => t.routeId === r.id);
        return { ...r, trips: rTrips.length, rev: rTrips.reduce((s, t) => s + t.revenue, 0), pax: rTrips.reduce((s, t) => s + t.passengers, 0) };
    }).sort((a, b) => b.rev - a.rev);

    const maxRev = Math.max(...routeRev.map(r => r.rev), 1);

    // Driver performance
    const driverPerf = drivers.map(d => {
        const dTrips = completed.filter(t => t.driverId === d.id);
        return { ...d, trips: dTrips.length, pax: dTrips.reduce((s, t) => s + t.passengers, 0), rev: dTrips.reduce((s, t) => s + t.revenue, 0) };
    }).sort((a, b) => b.trips - a.trips);

    return (
        <div>
            <div style={PG.hdr}>
                <div><h2 style={PG.title}>Reports & Analytics</h2><p style={PG.sub}>Based on completed trips</p></div>
            </div>

            {/* Summary */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 16, marginBottom: 28 }}>
                <StatCard icon="💰" label="Total Revenue" value={`₹${totalRev.toLocaleString()}`} sub="All completed trips" color="#10b981" />
                <StatCard icon="✅" label="Trips Completed" value={completed.length} sub={`of ${trips.length} total`} color="#4f46e5" />
                <StatCard icon="👥" label="Total Passengers" value={totalPax.toLocaleString()} sub="Carried across routes" color="#f59e0b" />
                <StatCard icon="📊" label="Avg Passengers" value={avgPax} sub="Per completed trip" color="#06b6d4" />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

                {/* Revenue by route */}
                <div style={{ background: "#fff", borderRadius: 18, padding: 24, boxShadow: "0 4px 20px rgba(0,0,0,.06)" }}>
                    <h3 style={{ margin: "0 0 20px", fontSize: 15, fontWeight: 800, color: "#0f172a" }}>Revenue by Route</h3>
                    {routeRev.map(r => (
                        <div key={r.id} style={{ marginBottom: 16 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5, fontSize: 13 }}>
                                <span style={{ fontWeight: 600, color: "#334155" }}>{r.name}</span>
                                <span style={{ fontWeight: 800, color: "#10b981" }}>₹{r.rev.toLocaleString()}</span>
                            </div>
                            <div style={{ height: 8, background: "#f1f5f9", borderRadius: 999 }}>
                                <div style={{ width: `${(r.rev / maxRev) * 100}%`, height: "100%", background: "linear-gradient(to right,#4f46e5,#818cf8)", borderRadius: 999, minWidth: r.rev ? 4 : 0, transition: "width .8s" }} />
                            </div>
                            <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 3 }}>{r.trips} trips · {r.pax} passengers</div>
                        </div>
                    ))}
                </div>

                {/* Driver performance */}
                <div style={{ background: "#fff", borderRadius: 18, padding: 24, boxShadow: "0 4px 20px rgba(0,0,0,.06)" }}>
                    <h3 style={{ margin: "0 0 20px", fontSize: 15, fontWeight: 800, color: "#0f172a" }}>Driver Performance</h3>
                    {driverPerf.map((d, i) => (
                        <div key={d.id} style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16, padding: "12px 14px", borderRadius: 12, background: i === 0 ? "#eef2ff" : "#f8fafc" }}>
                            <div style={{ width: 38, height: 38, borderRadius: "50%", background: `linear-gradient(135deg,${i === 0 ? "#4f46e5,#818cf8" : i === 1 ? "#10b981,#34d399" : "#f59e0b,#fbbf24"})`, color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 800 }}>{d.name[0]}</div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>{d.name} {i === 0 && <span style={{ fontSize: 11, background: "#4f46e5", color: "white", borderRadius: 20, padding: "1px 7px", marginLeft: 4 }}>Top</span>}</div>
                                <div style={{ fontSize: 12, color: "#64748b" }}>{d.trips} trips · {d.pax} pax · ₹{d.rev.toLocaleString()}</div>
                            </div>
                            <div style={{ fontSize: 13, color: "#f59e0b", fontWeight: 700 }}>{d.rating}★</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Trip log table */}
            <div style={{ ...TABLE.card, marginTop: 20 }}>
                <div style={{ padding: "18px 20px 0" }}>
                    <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: "#0f172a" }}>Complete Trip Log</h3>
                </div>
                <div style={{ overflowX: "auto" }}>
                    <table style={{ ...TABLE.table, marginTop: 12 }}>
                        <thead><tr>
                            <th style={TABLE.th}>Trip ID</th><th style={TABLE.th}>Route</th><th style={TABLE.th}>Date</th>
                            <th style={TABLE.th}>Driver</th><th style={TABLE.th}>Passengers</th><th style={TABLE.th}>Revenue</th><th style={TABLE.th}>Status</th>
                        </tr></thead>
                        <tbody>
                            {trips.map(t => (
                                <tr key={t.id} onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"} onMouseLeave={e => e.currentTarget.style.background = ""}>
                                    <td style={TABLE.td}><code style={{ background: "#eef2ff", color: "#4f46e5", padding: "2px 8px", borderRadius: 6, fontSize: 12 }}>{t.id}</code></td>
                                    <td style={TABLE.td}>{routes.find(r => r.id === t.routeId)?.name || t.routeId}</td>
                                    <td style={TABLE.td}>{t.date} {t.time}</td>
                                    <td style={TABLE.td}>{drivers.find(d => d.id === t.driverId)?.name || "—"}</td>
                                    <td style={TABLE.td}>{t.passengers || "—"}</td>
                                    <td style={TABLE.td}>{t.revenue ? `₹${t.revenue}` : "—"}</td>
                                    <td style={TABLE.td}><Badge val={t.status} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════
// 8. COMPANY PROFILE
// ═══════════════════════════════════════════════════════════
function CompanyProfile({ company, setCompany, showToast }) {
    const [edit, setEdit] = useState(false);
    const [form, setForm] = useState(company);

    const save = () => { setCompany(form); setEdit(false); showToast("Company profile updated."); };

    return (
        <div>
            <div style={PG.hdr}>
                <div><h2 style={PG.title}>Company Profile</h2><p style={PG.sub}>Manage your company information</p></div>
                {!edit && <button style={B.primary} onClick={() => setEdit(true)}>✏ Edit Profile</button>}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                {/* Info card */}
                <div style={{ background: "#fff", borderRadius: 18, padding: 28, boxShadow: "0 4px 20px rgba(0,0,0,.06)", gridColumn: "1/-1" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 28 }}>
                        <div style={{ width: 80, height: 80, borderRadius: 20, background: "linear-gradient(135deg,#4f46e5,#818cf8)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36 }}>🏢</div>
                        <div>
                            <h3 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#0f172a" }}>{company.name}</h3>
                            <div style={{ color: "#64748b", marginTop: 4 }}>{company.city}, {company.state}</div>
                            <code style={{ fontSize: 12, background: "#eef2ff", color: "#4f46e5", padding: "2px 8px", borderRadius: 6, marginTop: 6, display: "inline-block" }}>{company.id}</code>
                        </div>
                    </div>

                    {!edit ? (
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                            {[["📧 Email", company.email], ["📞 Contact", company.contact], ["🏙 City", company.city], ["🗺 State", company.state], ["📄 License", company.license], ["🆔 Company ID", company.id]].map(([k, v]) => (
                                <div key={k} style={{ background: "#f8fafc", borderRadius: 12, padding: "14px 16px" }}>
                                    <div style={{ fontSize: 12, color: "#94a3b8", fontWeight: 700 }}>{k}</div>
                                    <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", marginTop: 4 }}>{v}</div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                            <Field label="Company Name"><input style={INP} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></Field>
                            <Field label="Email"><input style={INP} type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} /></Field>
                            <Field label="Contact Phone"><input style={INP} value={form.contact} onChange={e => setForm(f => ({ ...f, contact: e.target.value }))} /></Field>
                            <Field label="City"><input style={INP} value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} /></Field>
                            <Field label="State"><input style={INP} value={form.state} onChange={e => setForm(f => ({ ...f, state: e.target.value }))} /></Field>
                            <Field label="Transport License No."><input style={INP} value={form.license} onChange={e => setForm(f => ({ ...f, license: e.target.value }))} /></Field>
                            <div style={{ gridColumn: "1/-1", display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
                                <button style={B.cancel} onClick={() => setEdit(false)}>Cancel</button>
                                <button style={B.primary} onClick={save}>Save Profile</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════
// MAIN: COMPANY ADMIN
// ═══════════════════════════════════════════════════════════
export default function CompanyAdmin({ onLogout }) {
    const [page, setPage] = useState("dashboard");
    const [buses, setBuses] = useState(SEED_BUSES);
    const [drivers, setDrivers] = useState(SEED_DRIVERS);
    const [routes, setRoutes] = useState(SEED_ROUTES);
    const [trips, setTrips] = useState(SEED_TRIPS);
    const [company, setCompany] = useState(COMPANY);
    const [toast, setToast] = useState(null);
    const [sidebarOpen, setSidebar] = useState(true);
    const [liveCount, setLiveCount] = useState(0);

    // ✅ Listen to Firebase trips to get live bus count for sidebar badge
    useEffect(() => {
        const tripsRef = ref(_db, "trips");
        const unsub = onValue(tripsRef, (snap) => {
            const data = snap.val();
            if (!data) { setLiveCount(0); return; }
            let count = 0;
            Object.values(data).forEach(trip => {
                if (trip.status !== "ended" && trip.drivers) {
                    Object.values(trip.drivers).forEach(d => {
                        const ageMin = (Date.now() - (d.updatedAt || 0)) / 60000;
                        if (d.latitude && ageMin <= 10) count++;
                    });
                }
            });
            setLiveCount(count);
        });
        return () => unsub();
    }, []);

    const showToast = (msg, type = "success") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    const NAV = [
        { key: "dashboard",  icon: "⊞",  label: "Dashboard" },
        { key: "buses",      icon: "🚌",  label: "Buses" },
        { key: "drivers",    icon: "👤",  label: "Drivers" },
        { key: "routes",     icon: "🗺",  label: "Routes" },
        { key: "trips",      icon: "📋",  label: "Trips" },
        { key: "tripcodes",  icon: "🎫",  label: "Trip Codes" },
        { key: "tracking",   icon: "📡",  label: "Live Tracking" },
        { key: "reports",    icon: "📊",  label: "Reports" },
        { key: "profile",    icon: "🏢",  label: "Profile" },
    ];

    const pageTitle = NAV.find(n => n.key === page)?.label || "Dashboard";

    const renderPage = () => {
        switch (page) {
            case "dashboard":  return <Dashboard buses={buses} drivers={drivers} routes={routes} trips={trips} company={company} setPage={setPage} />;
            case "buses":      return <BusManagement buses={buses} setBuses={setBuses} drivers={drivers} routes={routes} showToast={showToast} />;
            case "drivers":    return <DriverManagement drivers={drivers} setDrivers={setDrivers} buses={buses} showToast={showToast} />;
            case "routes":     return <RouteManagement routes={routes} setRoutes={setRoutes} buses={buses} showToast={showToast} />;
            case "trips":      return <TripManagement trips={trips} setTrips={setTrips} buses={buses} drivers={drivers} routes={routes} showToast={showToast} />;
            case "tripcodes":  return <TripCodeManager drivers={drivers} buses={buses} />;
            case "tracking":   return <LiveTracking buses={buses} drivers={drivers} />;
            case "reports":    return <Reports trips={trips} buses={buses} drivers={drivers} routes={routes} />;
            case "profile":    return <CompanyProfile company={company} setCompany={setCompany} showToast={showToast} />;
            default:           return <Dashboard buses={buses} drivers={drivers} routes={routes} trips={trips} company={company} setPage={setPage} />;
        }
    };

    return (
        <div style={{ display: "flex", height: "100vh", fontFamily: "'Segoe UI',Tahoma,Geneva,Verdana,sans-serif", background: "#f0f4f8" }}>
            <style>{`
        @keyframes caFade { from{opacity:0;transform:translateY(-10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse  { 0%,100%{opacity:1} 50%{opacity:.4} }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width:6px; height:6px; }
        ::-webkit-scrollbar-track { background:#f1f5f9; }
        ::-webkit-scrollbar-thumb { background:#cbd5e1; border-radius:3px; }
      `}</style>

            <Toast toast={toast} />

            {/* ── SIDEBAR ── */}
            <aside style={{ width: sidebarOpen ? 240 : 72, background: "linear-gradient(180deg,#4f46e5,#3b82f6)", color: "white", padding: "24px 0", display: "flex", flexDirection: "column", transition: "width .25s", overflow: "hidden", flexShrink: 0, position: "relative", zIndex: 10 }}>
                {/* Logo */}
                <div style={{ padding: "0 20px 28px", borderBottom: "1px solid rgba(255,255,255,.15)", marginBottom: 16 }}>
                    <div style={{ fontSize: 22, fontWeight: 800, whiteSpace: "nowrap", overflow: "hidden" }}>
                        {sidebarOpen ? "🚌 GoBus Admin" : "🚌"}
                    </div>
                    {sidebarOpen && <div style={{ fontSize: 11, color: "rgba(255,255,255,.7)", marginTop: 3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{company.name}</div>}
                </div>

                {/* Nav items */}
                <nav style={{ flex: 1, padding: "0 10px", display: "flex", flexDirection: "column", gap: 4 }}>
                    {NAV.map(n => (
                        <button key={n.key} onClick={() => setPage(n.key)} style={{
                            display: "flex", alignItems: "center", gap: 12, padding: "11px 14px", borderRadius: 12,
                            background: page === n.key ? "rgba(255,255,255,.25)" : "transparent",
                            color: "white", border: "none", cursor: "pointer", textAlign: "left", whiteSpace: "nowrap",
                            fontWeight: page === n.key ? 700 : 400, fontSize: 14, width: "100%",
                            transition: "background .2s",
                        }}
                            onMouseEnter={e => { if (page !== n.key) e.currentTarget.style.background = "rgba(255,255,255,.12)"; }}
                            onMouseLeave={e => { if (page !== n.key) e.currentTarget.style.background = "transparent"; }}>
                            <span style={{ fontSize: 18, flexShrink: 0 }}>{n.icon}</span>
                            {sidebarOpen && n.label}
                            {sidebarOpen && n.key === "tracking" && liveCount > 0 && (
                                <span style={{ marginLeft: "auto", background: "#ef4444", borderRadius: 20, fontSize: 10, fontWeight: 800, padding: "1px 7px" }}>{liveCount}</span>
                            )}
                        </button>
                    ))}
                </nav>

                {/* Bottom */}
                {sidebarOpen && (
                    <div style={{ padding: "16px 20px", borderTop: "1px solid rgba(255,255,255,.15)", marginTop: 8 }}>
                        <button onClick={onLogout} style={{ background: "rgba(255,255,255,.15)", border: "none", color: "white", padding: "10px 16px", borderRadius: 10, cursor: "pointer", width: "100%", fontSize: 13, fontWeight: 700 }}>
                            ← Logout
                        </button>
                    </div>
                )}

                {/* Collapse toggle */}
                <button onClick={() => setSidebar(s => !s)} style={{ position: "absolute", top: 24, right: -12, background: "white", border: "none", borderRadius: "50%", width: 24, height: 24, boxShadow: "0 2px 8px rgba(0,0,0,.2)", cursor: "pointer", fontSize: 12, color: "#4f46e5", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {sidebarOpen ? "‹" : "›"}
                </button>
            </aside>

            {/* ── MAIN ── */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

                {/* Topbar */}
                <header style={{ background: "white", padding: "0 28px", height: 68, display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 2px 10px rgba(0,0,0,.06)", flexShrink: 0 }}>
                    <div>
                        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#0f172a" }}>{pageTitle}</h1>
                        <p style={{ margin: 0, fontSize: 12, color: "#94a3b8" }}>Company Admin · {company.name}</p>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        {/* Live indicator */}
                        <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#dcfce7", padding: "6px 12px", borderRadius: 20 }}>
                            <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#10b981", animation: "pulse 1.5s infinite" }} />
                            <span style={{ fontSize: 12, fontWeight: 700, color: "#065f46" }}>{liveCount} Live</span>
                        </div>
                        {/* Alerts */}
                        <div style={{ position: "relative" }}>
                            <div style={{ background: "#f1f5f9", width: 38, height: 38, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 18 }}>🔔</div>
                            {buses.filter(b => b.status === "maintenance").length > 0 && (
                                <div style={{ position: "absolute", top: -4, right: -4, background: "#ef4444", color: "white", borderRadius: "50%", width: 18, height: 18, fontSize: 10, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    {buses.filter(b => b.status === "maintenance").length}
                                </div>
                            )}
                        </div>
                        <div style={{ background: "linear-gradient(135deg,#4f46e5,#818cf8)", color: "white", padding: "8px 16px", borderRadius: 10, fontWeight: 700, fontSize: 13 }}>
                            🏢 {company.name.split(" ")[0]}
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main style={{ flex: 1, overflowY: "auto", padding: 28 }}>
                    {renderPage()}
                </main>
            </div>
        </div>
    );
}