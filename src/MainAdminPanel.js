// ============================================================
// 👑 MAIN ADMIN PANEL  –  GoBus Fleet Management
// ============================================================
// Pages:  Dashboard | Companies | Company Admins | Trip Monitor
// Stack:  React hooks + inline styles + recharts + lucide-react
// ============================================================

import { useEffect, useState } from "react";
import {
    LayoutDashboard, Building2, Users, Radio,
    LogOut, Plus, Search, CheckCircle2,
    MapPin, AlertCircle, RefreshCw, Eye, Trash2, Edit3,
} from "lucide-react";
import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "dummy",
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "dummy",
    databaseURL: "https://bus-tracking-d0d62-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "bus-tracking-d0d62",
    storageBucket: "bus-tracking-d0d62.appspot.com",
    messagingSenderId: "dummy",
    appId: "dummy",
};

const _app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const _db = getDatabase(_app);

/* ─── Palette ──────────────────────────────────────────────── */
const C = {
    bg: "transparent",
    sidebar: "rgba(79, 70, 229, 0.8)",
    sidebarBorder: "rgba(255,255,255,.12)",
    accent: "#4f46e5",
    accentHover: "#4338ca",
    surface: "rgba(255, 255, 255, 0.85)",
    surfaceAlt: "#f8fafc",
    border: "#e2e8f0",
    text: "#0f172a",
    muted: "#64748b",
    green: "#10b981",
    red: "#ef4444",
    amber: "#f59e0b",
    blue: "#3b82f6",
    purple: "#8b5cf6",
};

/* ─── Shared style helpers ─────────────────────────────────── */
const card = (extra = {}) => ({
    background: C.surface,
    borderRadius: 18,
    boxShadow: "0 4px 24px rgba(0,0,0,.07)",
    border: `1px solid ${C.border}`,
    ...extra,
});

const btn = (bg = C.accent, extra = {}) => ({
    background: bg,
    color: "white",
    border: "none",
    borderRadius: 10,
    padding: "10px 18px",
    fontWeight: 700,
    fontSize: 13,
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    transition: "all .18s",
    ...extra,
});

/* ─── MAIN EXPORT ──────────────────────────────────────────── */
export default function MainAdminPanel({ user, onLogout }) {
    const [page, setPage] = useState("dashboard");

    return (
        <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'Inter','Segoe UI',sans-serif", background: "transparent" }}>
            <Sidebar page={page} setPage={setPage} user={user} onLogout={onLogout} />
            <main style={{ flex: 1, background: "rgba(241, 245, 249, 0.5)", overflowY: "auto" }}>
                <TopBar page={page} user={user} />
                <div style={{ padding: "28px 32px" }}>
                    {page === "dashboard" && <Dashboard />}
                    {page === "companies" && <Companies />}
                    {page === "admins" && <CompanyAdmins />}
                    {page === "trips" && <TripMonitor />}
                </div>
            </main>
        </div>
    );
}

/* ════════════════════════════════════════════════════════════
   🧭 SIDEBAR
════════════════════════════════════════════════════════════ */
const MENU = [
    { key: "dashboard", label: "Dashboard", Icon: LayoutDashboard },
    { key: "companies", label: "Companies", Icon: Building2 },
    { key: "admins", label: "Company Admins", Icon: Users },
    { key: "trips", label: "Trip Monitor", Icon: Radio },
];

function Sidebar({ page, setPage, user, onLogout }) {

    return (
        <aside style={{
            width: 240,
            background: C.sidebar,
            backdropFilter: "blur(12px)",
            borderRight: `1px solid ${C.sidebarBorder}`,
            display: "flex",
            flexDirection: "column",
            padding: "24px 0",
            position: "sticky",
            top: 0,
            height: "100vh",
            overflow: "hidden",
            flexShrink: 0,
        }}>
            {/* Logo */}
            <div style={{ padding: "0 20px 24px", borderBottom: "1px solid rgba(255,255,255,.15)", marginBottom: 16, cursor: "default" }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: "white", whiteSpace: "nowrap", cursor: "default", letterSpacing: -0.3 }}>GoBus Admin</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,.7)", marginTop: 3 }}>Main Admin Panel</div>
            </div>

            {/* User chip */}
            <div style={{
                background: "rgba(255,255,255,.12)", borderRadius: 10, padding: "10px 14px",
                display: "flex", alignItems: "center", gap: 10, marginBottom: 20,
                border: "1px solid rgba(255,255,255,.18)",
                margin: "0 10px 20px",
            }}>
                <div style={{
                    width: 30, height: 30, borderRadius: 8,
                    background: "rgba(255,255,255,.3)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 14, fontWeight: 800, color: "white",
                }}>
                    {(user?.name || "A").charAt(0).toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ color: "white", fontSize: 13, fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {user?.name || "Main Admin"}
                    </div>
                    <div style={{ color: "rgba(255,255,255,.65)", fontSize: 11 }}>Superadmin</div>
                </div>
            </div>

            {/* Menu items */}
            <nav style={{ flex: 1, padding: "0 10px", display: "flex", flexDirection: "column", gap: 4 }}>
                {MENU.map(({ key, label, Icon }) => {
                    const active = page === key;
                    return (
                        <button
                            key={key}
                            onClick={() => setPage(key)}
                            style={{
                                display: "flex", alignItems: "center", gap: 12,
                                padding: "11px 14px", borderRadius: 10,
                                background: active ? "rgba(255,255,255,.2)" : "transparent",
                                color: "white", border: "none", cursor: "pointer",
                                fontWeight: active ? 700 : 400, fontSize: 13, width: "100%",
                                textAlign: "left", transition: "all .2s",
                                transform: active ? "translateX(4px)" : "none",
                                boxShadow: active ? "0 2px 8px rgba(0,0,0,.15)" : "none",
                            }}
                            onMouseEnter={e => { if (!active) { e.currentTarget.style.background = "rgba(255,255,255,.1)"; e.currentTarget.style.transform = "translateX(4px)"; } }}
                            onMouseLeave={e => { if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.transform = "none"; } }}
                        >
                            <Icon size={17} />
                            {label}
                            {key === "trips" && (
                                <span style={{
                                    marginLeft: "auto", background: "#ef4444", color: "white",
                                    fontSize: 10, fontWeight: 800, padding: "1px 7px", borderRadius: 20,
                                }}>LIVE</span>
                            )}
                        </button>
                    );
                })}
            </nav>

            {/* Logout */}
            <div style={{ padding: "16px 20px", borderTop: "1px solid rgba(255,255,255,.15)", marginTop: 8 }}>
                <button
                    onClick={onLogout}
                    style={{
                        background: "rgba(255,255,255,.12)", border: "1px solid rgba(255,255,255,.15)", color: "white",
                        padding: "10px 16px", borderRadius: 10, cursor: "pointer",
                        width: "100%", fontSize: 13, fontWeight: 600,
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                        transition: "all .2s",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,.2)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,.12)"; e.currentTarget.style.transform = "none"; }}
                >
                    <LogOut size={15} /> Sign Out
                </button>
            </div>
        </aside>
    );
}

/* ─── Top Bar ───────────────────────────────────────────────── */
const PAGE_LABELS = {
    dashboard: "Dashboard Overview",
    companies: "Manage Companies",
    admins: "Company Admins",
    trips: "Live Trip Monitor",
};
const PAGE_ICONS = {
    dashboard: <LayoutDashboard size={20} color={C.accent} />,
    companies: <Building2 size={20} color={C.accent} />,
    admins: <Users size={20} color={C.accent} />,
    trips: <Radio size={20} color={C.accent} />,
};

function TopBar({ page, user }) {
    const now = new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
    return (
        <div style={{
            background: "rgba(255, 255, 255, 0.8)", borderBottom: `1px solid ${C.border}`,
            padding: "16px 32px", display: "flex", alignItems: "center",
            justifyContent: "space-between", position: "sticky", top: 0, zIndex: 10,
            backdropFilter: "blur(10px)",
        }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, cursor: "default" }}>
                {PAGE_ICONS[page]}
                <div>
                    <div style={{ fontWeight: 800, fontSize: 18, color: C.text, cursor: "default" }}>{PAGE_LABELS[page]}</div>
                    <div style={{ fontSize: 12, color: C.muted, cursor: "default" }}>{now}</div>
                </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                    background: "#eef2ff", color: C.accent, padding: "6px 14px",
                    borderRadius: 20, fontSize: 13, fontWeight: 700,
                    display: "flex", alignItems: "center", gap: 6,
                }}>
                    👑 {user?.name || "Main Admin"}
                </div>
            </div>
        </div>
    );
}

/* ════════════════════════════════════════════════════════════
   📊 DASHBOARD
════════════════════════════════════════════════════════════ */

const RECENT_ACTIVITY = [
    { id: 1, action: "New company registered", detail: "Sri Murugan Transport", time: "2 min ago", icon: "🏢", color: C.green },
    { id: 2, action: "Trip completed", detail: "Route: Madurai → Chennai", time: "14 min ago", icon: "✅", color: C.blue },
    { id: 3, action: "Admin account created", detail: "Kumar – SMT Co.", time: "1 hr ago", icon: "👤", color: C.accent },
    { id: 4, action: "Company suspended", detail: "XYZ Express", time: "3 hr ago", icon: "⚠️", color: C.amber },
    { id: 5, action: "Driver enrolled", detail: "Rajan – ABC Travels", time: "5 hr ago", icon: "🚌", color: C.purple },
];

const WEEK_SUMMARY = [
    { day: "Monday", trips: 8 },
    { day: "Tuesday", trips: 12 },
    { day: "Wednesday", trips: 15 },
    { day: "Thursday", trips: 9 },
    { day: "Friday", trips: 18 },
    { day: "Saturday", trips: 22 },
    { day: "Sunday", trips: 11 },
];

function StatCard({ title, value, sub, emoji }) {
    return (
        <div style={card({ padding: "20px 22px", flex: 1, minWidth: 160 })}>
            <div style={{ fontSize: 30, marginBottom: 8 }}>{emoji}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: C.text, lineHeight: 1 }}>{value}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginTop: 4 }}>{title}</div>
            {sub && <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{sub}</div>}
        </div>
    );
}

function Dashboard() {
    return (
        <div>
            {/* Welcome Banner with Bus Image */}
            <div style={{
                ...card({ padding: 0, marginBottom: 24, overflow: "hidden" }),
                background: "linear-gradient(120deg,#4f46e5 0%,#3b82f6 60%,#60a5fa 100%)",
                position: "relative",
                minHeight: 140,
                display: "flex",
                alignItems: "center",
            }}>
                <div style={{ padding: "28px 32px", flex: 1, zIndex: 2 }}>
                    <div style={{ fontSize: 22, fontWeight: 800, color: "white" }}>Welcome, Main Admin 👋</div>
                    <div style={{ fontSize: 13, color: "rgba(255,255,255,.8)", marginTop: 6 }}>
                        GoBus Fleet Management System &nbsp;·&nbsp; {new Date().toDateString()}
                    </div>
                    <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
                        {["5 Companies", "3 Live Trips", "25 Drivers"].map(tag => (
                            <span key={tag} style={{
                                background: "rgba(255,255,255,.2)", color: "white",
                                padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600,
                            }}>{tag}</span>
                        ))}
                    </div>
                </div>
                <img
                    src="/bus-bg.png"
                    alt="Bus"
                    style={{
                        position: "absolute", right: 0, bottom: 0,
                        height: "100%", maxWidth: 320,
                        objectFit: "contain",
                        opacity: 0.25,
                    }}
                />
            </div>

            {/* Stat Cards */}
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 24 }}>
                <StatCard emoji="🏢" title="Total Companies" value={5} sub="4 active, 1 inactive" />
                <StatCard emoji="🚌" title="Live Trips" value={3} sub="Running right now" />
                <StatCard emoji="📅" title="Trips Today" value={12} sub="10 done, 2 active" />
                <StatCard emoji="👤" title="Total Drivers" value={25} sub="18 on duty" />
                <StatCard emoji="⏱️" title="Avg Duration" value="47m" sub="Per trip" />
            </div>

            {/* Two-column section */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

                {/* Weekly Trip Table */}
                <div style={card({ padding: 22 })}>
                    <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 700, color: C.text }}>📊 This Week's Trips</h3>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                        <thead>
                            <tr style={{ background: C.surfaceAlt }}>
                                <th style={{ padding: "8px 12px", textAlign: "left", fontWeight: 700, color: C.muted, fontSize: 12, borderBottom: `1px solid ${C.border}` }}>Day</th>
                                <th style={{ padding: "8px 12px", textAlign: "center", fontWeight: 700, color: C.muted, fontSize: 12, borderBottom: `1px solid ${C.border}` }}>Trips</th>
                                <th style={{ padding: "8px 12px", textAlign: "center", fontWeight: 700, color: C.muted, fontSize: 12, borderBottom: `1px solid ${C.border}` }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {WEEK_SUMMARY.map((w, i) => (
                                <tr key={w.day} style={{ borderBottom: i < WEEK_SUMMARY.length - 1 ? `1px solid ${C.border}` : "none" }}>
                                    <td style={{ padding: "9px 12px", color: C.text, fontWeight: 600 }}>{w.day}</td>
                                    <td style={{ padding: "9px 12px", textAlign: "center", fontWeight: 700 }}>{w.trips}</td>
                                    <td style={{ padding: "9px 12px", textAlign: "center" }}>
                                        <span style={{
                                            background: w.trips > 15 ? "#dcfce7" : "#eff6ff",
                                            color: w.trips > 15 ? "#166534" : "#1d4ed8",
                                            padding: "2px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700,
                                        }}>{w.trips > 15 ? "Busy" : "Normal"}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Recent Activity */}
                <div style={card({ padding: 22 })}>
                    <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 700, color: C.text }}>🕐 Recent Activity</h3>
                    {RECENT_ACTIVITY.map((a, i) => (
                        <div key={a.id} style={{
                            display: "flex", alignItems: "flex-start", gap: 12, padding: "10px 0",
                            borderBottom: i < RECENT_ACTIVITY.length - 1 ? `1px solid ${C.border}` : "none",
                        }}>
                            <span style={{ fontSize: 20 }}>{a.icon}</span>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{a.action}</div>
                                <div style={{ fontSize: 12, color: C.muted }}>{a.detail}</div>
                            </div>
                            <div style={{ fontSize: 11, color: C.muted, whiteSpace: "nowrap" }}>{a.time}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

/* ════════════════════════════════════════════════════════════
   🏢 COMPANIES
════════════════════════════════════════════════════════════ */
const INITIAL_COMPANIES = [
    { id: "COMP-001", name: "Sri Murugan Transport", city: "Madurai", contact: "9876500000", buses: 4, drivers: 4, status: "active", joinedOn: "Jan 2024" },
    { id: "COMP-002", name: "ABC Travels", city: "Chennai", contact: "9123400000", buses: 2, drivers: 2, status: "active", joinedOn: "Mar 2024" },
    { id: "COMP-003", name: "XYZ Express", city: "Coimbatore", contact: "9988800000", buses: 2, drivers: 1, status: "inactive", joinedOn: "Jun 2024" },
    { id: "COMP-004", name: "Star Line Travels", city: "Trichy", contact: "9444500000", buses: 3, drivers: 3, status: "active", joinedOn: "Aug 2024" },
    { id: "COMP-005", name: "Royal Transports", city: "Salem", contact: "9655500000", buses: 1, drivers: 1, status: "active", joinedOn: "Nov 2024" },
];

function Companies() {
    const [companies, setCompanies] = useState(INITIAL_COMPANIES);
    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ name: "", city: "", contact: "" });
    const [editId, setEditId] = useState(null);
    const [deleteId, setDeleteId] = useState(null);

    const filtered = companies.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.city.toLowerCase().includes(search.toLowerCase())
    );

    const openAdd = () => { setForm({ name: "", city: "", contact: "" }); setEditId(null); setShowModal(true); };
    const openEdit = (c) => { setForm({ name: c.name, city: c.city, contact: c.contact }); setEditId(c.id); setShowModal(true); };

    const save = () => {
        if (!form.name.trim()) return;
        if (editId) {
            setCompanies(p => p.map(c => c.id === editId ? { ...c, ...form } : c));
        } else {
            const newC = {
                id: `COMP-${String(companies.length + 1).padStart(3, "0")}`,
                ...form, buses: 0, drivers: 0, status: "active",
                joinedOn: new Date().toLocaleDateString("en-IN", { month: "short", year: "numeric" }),
            };
            setCompanies(p => [...p, newC]);
        }
        setShowModal(false);
    };

    const remove = (id) => { setCompanies(p => p.filter(c => c.id !== id)); setDeleteId(null); };
    const toggle = (id) => setCompanies(p => p.map(c => c.id === id ? { ...c, status: c.status === "active" ? "inactive" : "active" } : c));

    return (
        <div>
            {/* Header row */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{
                        display: "flex", alignItems: "center", gap: 8,
                        background: "white", border: `1px solid ${C.border}`, borderRadius: 10, padding: "9px 14px",
                    }}>
                        <Search size={14} color={C.muted} />
                        <input
                            placeholder="Search companies…"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            style={{ border: "none", outline: "none", fontSize: 13, width: 200, color: C.text }}
                        />
                    </div>
                    <span style={{ fontSize: 13, color: C.muted, fontWeight: 600 }}>{filtered.length} results</span>
                </div>
                <button style={btn(C.accent)} onClick={openAdd}
                    onMouseEnter={e => e.currentTarget.style.background = C.accentHover}
                    onMouseLeave={e => e.currentTarget.style.background = C.accent}>
                    <Plus size={15} /> Add Company
                </button>
            </div>

            {/* Table */}
            <div style={card({ overflow: "hidden" })}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr style={{ background: C.surfaceAlt }}>
                            {["Company ID", "Company Name", "City", "Buses", "Drivers", "Joined", "Status", "Actions"].map(h => (
                                <th key={h} style={{ padding: "13px 16px", textAlign: "left", fontSize: 11, fontWeight: 800, color: C.muted, textTransform: "uppercase", letterSpacing: .8, borderBottom: `1px solid ${C.border}` }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((c, i) => (
                            <tr key={c.id} style={{ borderBottom: i < filtered.length - 1 ? `1px solid ${C.border}` : "none" }}
                                onMouseEnter={e => e.currentTarget.style.background = "#fafbfd"}
                                onMouseLeave={e => e.currentTarget.style.background = "white"}>
                                <td style={{ padding: "14px 16px" }}>
                                    <code style={{ background: "#eef2ff", color: C.accent, padding: "3px 9px", borderRadius: 6, fontSize: 12, fontWeight: 700 }}>{c.id}</code>
                                </td>
                                <td style={{ padding: "14px 16px", fontWeight: 700, color: C.text, fontSize: 14 }}>{c.name}</td>
                                <td style={{ padding: "14px 16px", color: C.muted, fontSize: 13, display: "flex", alignItems: "center", gap: 4 }}>
                                    <MapPin size={12} /> {c.city}
                                </td>
                                <td style={{ padding: "14px 16px", fontWeight: 700 }}>{c.buses}</td>
                                <td style={{ padding: "14px 16px", fontWeight: 700 }}>{c.drivers}</td>
                                <td style={{ padding: "14px 16px", color: C.muted, fontSize: 12 }}>{c.joinedOn}</td>
                                <td style={{ padding: "14px 16px" }}><StatusBadge status={c.status} /></td>
                                <td style={{ padding: "14px 16px" }}>
                                    <div style={{ display: "flex", gap: 6 }}>
                                        <ActionBtn icon={<Edit3 size={13} />} color="#3b82f6" title="Edit" onClick={() => openEdit(c)} />
                                        <ActionBtn icon={c.status === "active" ? <AlertCircle size={13} /> : <CheckCircle2 size={13} />} color={C.amber} title="Toggle" onClick={() => toggle(c.id)} />
                                        <ActionBtn icon={<Trash2 size={13} />} color={C.red} title="Delete" onClick={() => setDeleteId(c.id)} />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add/Edit Modal */}
            {showModal && (
                <Modal title={editId ? "Edit Company" : "Add New Company"} onClose={() => setShowModal(false)} onSave={save}>
                    <FormField label="Company Name" value={form.name} onChange={v => setForm(p => ({ ...p, name: v }))} placeholder="e.g. Sri Lakshmi Travels" />
                    <FormField label="City" value={form.city} onChange={v => setForm(p => ({ ...p, city: v }))} placeholder="e.g. Chennai" />
                    <FormField label="Contact No." value={form.contact} onChange={v => setForm(p => ({ ...p, contact: v }))} placeholder="10-digit number" />
                </Modal>
            )}

            {/* Delete Confirm */}
            {deleteId && (
                <ConfirmDialog
                    message={`Delete "${companies.find(c => c.id === deleteId)?.name}"? This cannot be undone.`}
                    onConfirm={() => remove(deleteId)}
                    onCancel={() => setDeleteId(null)}
                />
            )}
        </div>
    );
}

/* ════════════════════════════════════════════════════════════
   👨‍💼 COMPANY ADMINS
════════════════════════════════════════════════════════════ */
const INITIAL_ADMINS = [
    { id: "ADM-001", name: "Kumar", email: "kumar@smt.in", company: "Sri Murugan Transport", phone: "9876543210", status: "active", since: "Jan 2024" },
    { id: "ADM-002", name: "Priya", email: "priya@abc.in", company: "ABC Travels", phone: "9123456789", status: "active", since: "Mar 2024" },
    { id: "ADM-003", name: "Rajan", email: "rajan@xyz.in", company: "XYZ Express", phone: "9988712345", status: "inactive", since: "Jun 2024" },
    { id: "ADM-004", name: "Suresh", email: "suresh@star.in", company: "Star Line Travels", phone: "9444556677", status: "active", since: "Aug 2024" },
    { id: "ADM-005", name: "Meenakshi", email: "meen@royal.in", company: "Royal Transports", phone: "9655611223", status: "active", since: "Nov 2024" },
];

function CompanyAdmins() {
    const [admins, setAdmins] = useState(INITIAL_ADMINS);
    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ name: "", email: "", company: "", phone: "" });
    const [editId, setEditId] = useState(null);
    const [deleteId, setDeleteId] = useState(null);

    const filtered = admins.filter(a =>
        a.name.toLowerCase().includes(search.toLowerCase()) ||
        a.company.toLowerCase().includes(search.toLowerCase()) ||
        a.email.toLowerCase().includes(search.toLowerCase())
    );

    const openAdd = () => { setForm({ name: "", email: "", company: "", phone: "" }); setEditId(null); setShowModal(true); };
    const openEdit = (a) => { setForm({ name: a.name, email: a.email, company: a.company, phone: a.phone }); setEditId(a.id); setShowModal(true); };

    const save = () => {
        if (!form.name.trim()) return;
        if (editId) {
            setAdmins(p => p.map(a => a.id === editId ? { ...a, ...form } : a));
        } else {
            setAdmins(p => [...p, {
                id: `ADM-${String(p.length + 1).padStart(3, "0")}`,
                ...form, status: "active",
                since: new Date().toLocaleDateString("en-IN", { month: "short", year: "numeric" }),
            }]);
        }
        setShowModal(false);
    };

    const remove = (id) => { setAdmins(p => p.filter(a => a.id !== id)); setDeleteId(null); };
    const toggle = (id) => setAdmins(p => p.map(a => a.id === id ? { ...a, status: a.status === "active" ? "inactive" : "active" } : a));

    return (
        <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, background: "white", border: `1px solid ${C.border}`, borderRadius: 10, padding: "9px 14px" }}>
                        <Search size={14} color={C.muted} />
                        <input placeholder="Search admins…" value={search} onChange={e => setSearch(e.target.value)}
                            style={{ border: "none", outline: "none", fontSize: 13, width: 200, color: C.text }} />
                    </div>
                    <span style={{ fontSize: 13, color: C.muted, fontWeight: 600 }}>{filtered.length} results</span>
                </div>
                <button style={btn(C.accent)} onClick={openAdd}
                    onMouseEnter={e => e.currentTarget.style.background = C.accentHover}
                    onMouseLeave={e => e.currentTarget.style.background = C.accent}>
                    <Plus size={15} /> Add Admin
                </button>
            </div>

            <div style={card({ overflow: "hidden" })}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr style={{ background: C.surfaceAlt }}>
                            {["Admin ID", "Name", "Email", "Company", "Phone", "Since", "Status", "Actions"].map(h => (
                                <th key={h} style={{ padding: "13px 16px", textAlign: "left", fontSize: 11, fontWeight: 800, color: C.muted, textTransform: "uppercase", letterSpacing: .8, borderBottom: `1px solid ${C.border}` }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((a, i) => (
                            <tr key={a.id} style={{ borderBottom: i < filtered.length - 1 ? `1px solid ${C.border}` : "none" }}
                                onMouseEnter={e => e.currentTarget.style.background = "#fafbfd"}
                                onMouseLeave={e => e.currentTarget.style.background = "white"}>
                                <td style={{ padding: "14px 16px" }}>
                                    <code style={{ background: "#f0fdf4", color: C.green, padding: "3px 9px", borderRadius: 6, fontSize: 12, fontWeight: 700 }}>{a.id}</code>
                                </td>
                                <td style={{ padding: "14px 16px" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                        <div style={{ width: 32, height: 32, borderRadius: 8, background: `hsl(${a.name.charCodeAt(0) * 5},70%,90%)`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 13, color: `hsl(${a.name.charCodeAt(0) * 5},60%,40%)` }}>
                                            {a.name.charAt(0)}
                                        </div>
                                        <span style={{ fontWeight: 700, color: C.text, fontSize: 14 }}>{a.name}</span>
                                    </div>
                                </td>
                                <td style={{ padding: "14px 16px", color: C.muted, fontSize: 13 }}>{a.email}</td>
                                <td style={{ padding: "14px 16px", fontSize: 13, fontWeight: 600, color: C.text }}>{a.company}</td>
                                <td style={{ padding: "14px 16px", color: C.muted, fontSize: 13 }}>{a.phone}</td>
                                <td style={{ padding: "14px 16px", color: C.muted, fontSize: 12 }}>{a.since}</td>
                                <td style={{ padding: "14px 16px" }}><StatusBadge status={a.status} /></td>
                                <td style={{ padding: "14px 16px" }}>
                                    <div style={{ display: "flex", gap: 6 }}>
                                        <ActionBtn icon={<Edit3 size={13} />} color="#3b82f6" title="Edit" onClick={() => openEdit(a)} />
                                        <ActionBtn icon={a.status === "active" ? <AlertCircle size={13} /> : <CheckCircle2 size={13} />} color={C.amber} title="Toggle" onClick={() => toggle(a.id)} />
                                        <ActionBtn icon={<Trash2 size={13} />} color={C.red} title="Delete" onClick={() => setDeleteId(a.id)} />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <Modal title={editId ? "Edit Admin" : "Add Company Admin"} onClose={() => setShowModal(false)} onSave={save}>
                    <FormField label="Full Name" value={form.name} onChange={v => setForm(p => ({ ...p, name: v }))} placeholder="e.g. Arun Kumar" />
                    <FormField label="Email" value={form.email} onChange={v => setForm(p => ({ ...p, email: v }))} placeholder="admin@company.in" />
                    <FormField label="Company" value={form.company} onChange={v => setForm(p => ({ ...p, company: v }))} placeholder="Company name" />
                    <FormField label="Phone" value={form.phone} onChange={v => setForm(p => ({ ...p, phone: v }))} placeholder="10-digit number" />
                </Modal>
            )}

            {deleteId && (
                <ConfirmDialog
                    message={`Remove admin "${admins.find(a => a.id === deleteId)?.name}"? This cannot be undone.`}
                    onConfirm={() => remove(deleteId)}
                    onCancel={() => setDeleteId(null)}
                />
            )}
        </div>
    );
}

/* ════════════════════════════════════════════════════════════
   🛰 TRIP MONITOR
════════════════════════════════════════════════════════════ */
const LIVE_TRIPS = [
    { id: "TRP-001", route: "Madurai → Chennai", driver: "Ramesh Kumar", bus: "TN-58-AB-1234", status: "running", eta: "2h 14m", progress: 62, company: "Sri Murugan Transport", pax: 32, speed: 74 },
    { id: "TRP-002", route: "Chennai → Coimbatore", driver: "Vijay Anand", bus: "TN-01-CD-5678", status: "running", eta: "1h 42m", progress: 44, company: "ABC Travels", pax: 28, speed: 81 },
    { id: "TRP-003", route: "Trichy → Salem", driver: "Suresh Babu", bus: "TN-45-EF-9012", status: "delayed", eta: "3h 05m", progress: 28, company: "Star Line Travels", pax: 19, speed: 52 },
    { id: "TRP-004", route: "Salem → Madurai", driver: "Karthik S.", bus: "TN-33-GH-3456", status: "completed", eta: "Arrived", progress: 100, company: "Royal Transports", pax: 24, speed: 0 },
    { id: "TRP-005", route: "Coimbatore → Trichy", driver: "Murugan P.", bus: "TN-22-IJ-7890", status: "running", eta: "58m", progress: 79, company: "Sri Murugan Transport", pax: 36, speed: 68 },
];

const TRIP_STATUS_COLOR = {
    running: { bg: "#dcfce7", text: "#166534", dot: C.green },
    delayed: { bg: "#fef9c3", text: "#854d0e", dot: C.amber },
    completed: { bg: "#e0e7ff", text: "#3730a3", dot: C.accent },
};

function TripMonitor() {
    const [trips, setTrips] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [selected, setSelected] = useState(null);

    const fetchTrips = async () => {
        setRefreshing(true);
        try {
            const token = localStorage.getItem("admin_token");
            if (!token) return;
            const res = await fetch("http://localhost:5000/api/admin/trips", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                // Map DB row to UI format
                const mapped = data.trips.map(t => ({
                    id: t.trip_code,
                    route: `${t.from_location} → ${t.to_location}`,
                    driver: t.driver_name || "Unknown",
                    bus: t.bus_number || "Unknown",
                    company: t.company_name || "Unknown",
                    status: t.status === "active" ? "running" : t.status,
                    eta: "Calculating...",
                    progress: 0,
                    pax: 0,
                    speed: 0,
                    _raw: t
                }));
                setTrips(mapped);
            }
        } catch (err) {
            console.error("Error fetching admin trips:", err);
        } finally {
            setTimeout(() => setRefreshing(false), 500);
        }
    };

    useEffect(() => {
        fetchTrips();
        const t = setInterval(fetchTrips, 8000);
        return () => clearInterval(t);
    }, []);

    // Firebase listener for real-time speed & progress
    useEffect(() => {
        const tripsRef = ref(_db, "trips");
        const unsub = onValue(tripsRef, (snap) => {
            const liveData = snap.val();
            if (!liveData) return;

            setTrips(prev => prev.map(trip => {
                if (trip.status !== "running") return trip;
                const fbTrip = liveData[trip.id];
                if (!fbTrip || !fbTrip.drivers) return trip;

                // Get the latest driver update
                const driverVals = Object.values(fbTrip.drivers);
                if (!driverVals.length) return trip;

                const latest = driverVals.reduce((prev, current) =>
                    (prev.updatedAt > current.updatedAt) ? prev : current
                );

                // Simple simulated progress based on time for demo if no real progress exists
                const demoProgress = Math.min(100, Math.floor((Date.now() - new Date(trip._raw.created_at).getTime()) / 60000));

                return {
                    ...trip,
                    speed: Math.round(latest.speed || 0),
                    progress: fbTrip.progress || demoProgress,
                    eta: latest.speed > 0 ? "On Time" : "Stationary"
                };
            }));
        });
        return () => unsub();
    }, []);

    const activeCount = trips.filter(t => t.status === "running" || t.status === "active").length;
    const delayedCount = trips.filter(t => t.status === "delayed").length;
    const completedCount = trips.filter(t => t.status === "ended" || t.status === "completed").length;

    return (
        <div>
            {/* Summary pills */}
            <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
                {[
                    { label: "Active", count: activeCount, color: C.green },
                    { label: "Delayed", count: delayedCount, color: C.amber },
                    { label: "Done", count: completedCount, color: C.accent },
                ].map(s => (
                    <div key={s.label} style={{
                        ...card({ padding: "12px 20px", flex: 1 }),
                        display: "flex", alignItems: "center", gap: 10,
                    }}>
                        <div style={{ width: 10, height: 10, borderRadius: "50%", background: s.color, boxShadow: `0 0 0 3px ${s.color}33` }} />
                        <span style={{ fontWeight: 800, fontSize: 22, color: C.text }}>{s.count}</span>
                        <span style={{ color: C.muted, fontSize: 13, fontWeight: 600 }}>{s.label}</span>
                    </div>
                ))}
                <button onClick={fetchTrips} style={{ ...btn(C.accent, { padding: "12px 20px" }) }}
                    onMouseEnter={e => e.currentTarget.style.background = C.accentHover}
                    onMouseLeave={e => e.currentTarget.style.background = C.accent}>
                    <RefreshCw size={14} style={{ animation: refreshing ? "spin 1s linear infinite" : "none" }} />
                    {refreshing ? "Refreshing…" : "Refresh"}
                </button>
            </div>

            {/* Trips table */}
            <div style={card({ overflow: "hidden", marginBottom: 20 })}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr style={{ background: C.surfaceAlt }}>
                            {["Trip ID", "Route", "Driver", "Bus No.", "Company", "Pax", "Speed", "Progress", "Status", "Detail"].map(h => (
                                <th key={h} style={{ padding: "13px 14px", textAlign: "left", fontSize: 11, fontWeight: 800, color: C.muted, textTransform: "uppercase", letterSpacing: .8, borderBottom: `1px solid ${C.border}` }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {trips.length === 0 ? (
                            <tr>
                                <td colSpan="10" style={{ padding: "40px", textAlign: "center", color: C.muted, fontSize: 14 }}>
                                    {refreshing ? "Loading trips..." : "No active trips found."}
                                </td>
                            </tr>
                        ) : trips.map((t, i) => {
                            const sc = TRIP_STATUS_COLOR[t.status] || TRIP_STATUS_COLOR.completed;
                            return (
                                <tr key={t.id} style={{ borderBottom: i < trips.length - 1 ? `1px solid ${C.border}` : "none" }}
                                    onMouseEnter={e => e.currentTarget.style.background = "#fafbfd"}
                                    onMouseLeave={e => e.currentTarget.style.background = "white"}>
                                    <td style={{ padding: "13px 14px" }}>
                                        <code style={{ background: "#f8fafc", color: C.muted, padding: "3px 8px", borderRadius: 6, fontSize: 11, fontWeight: 700, border: `1px solid ${C.border}` }}>{t.id}</code>
                                    </td>
                                    <td style={{ padding: "13px 14px", fontWeight: 700, fontSize: 13, color: C.text }}>{t.route}</td>
                                    <td style={{ padding: "13px 14px", fontSize: 13, color: C.muted }}>{t.driver}</td>
                                    <td style={{ padding: "13px 14px" }}>
                                        <code style={{ background: "#eef2ff", color: C.accent, padding: "3px 8px", borderRadius: 6, fontSize: 11, fontWeight: 700 }}>{t.bus}</code>
                                    </td>
                                    <td style={{ padding: "13px 14px", fontSize: 12, color: C.muted }}>{t.company}</td>
                                    <td style={{ padding: "13px 14px", fontWeight: 700, fontSize: 13 }}>{t.pax}</td>
                                    <td style={{ padding: "13px 14px", fontSize: 13, fontWeight: 700, color: t.speed > 70 ? C.green : t.speed === 0 ? C.muted : C.text }}>
                                        {t.speed > 0 ? `${t.speed} km/h` : "—"}
                                    </td>
                                    <td style={{ padding: "13px 14px", minWidth: 120 }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                            <div style={{ flex: 1, background: "#f1f5f9", borderRadius: 4, height: 6, overflow: "hidden" }}>
                                                <div style={{
                                                    height: "100%", borderRadius: 4, width: `${t.progress}%`,
                                                    background: t.status === "delayed" ? C.amber : t.status === "completed" ? C.accent : C.green,
                                                    transition: "width 1s ease",
                                                }} />
                                            </div>
                                            <span style={{ fontSize: 11, fontWeight: 700, color: C.muted, minWidth: 32 }}>{t.progress}%</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: "13px 14px" }}>
                                        <span style={{
                                            background: sc.bg, color: sc.text, padding: "4px 10px",
                                            borderRadius: 20, fontSize: 11, fontWeight: 700,
                                            display: "inline-flex", alignItems: "center", gap: 5,
                                        }}>
                                            <span style={{ width: 6, height: 6, borderRadius: "50%", background: sc.dot, display: "inline-block" }} />
                                            {t.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: "13px 14px" }}>
                                        <ActionBtn icon={<Eye size={13} />} color={C.accent} title="View" onClick={() => setSelected(t)} />
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Trip Detail Panel */}
            {selected && (
                <TripDetailPanel trip={selected} onClose={() => setSelected(null)} />
            )}

            {/* Spin keyframes injection */}
            <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
        </div>
    );
}

function TripDetailPanel({ trip, onClose }) {
    const sc = TRIP_STATUS_COLOR[trip.status] || TRIP_STATUS_COLOR.completed;
    return (
        <div style={card({ padding: 28 })}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                <h3 style={{ margin: 0, fontWeight: 800, color: C.text, fontSize: 16 }}>
                    Trip Detail — <code style={{ color: C.accent, fontSize: 14 }}>{trip.id}</code>
                </h3>
                <button onClick={onClose} style={{ background: "#f1f5f9", border: "none", borderRadius: 8, padding: "6px 10px", cursor: "pointer" }}>
                    ✕
                </button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
                {[
                    ["Route", trip.route],
                    ["Driver", trip.driver],
                    ["Bus No.", trip.bus],
                    ["Company", trip.company],
                    ["Passengers", trip.pax],
                    ["Speed", trip.speed ? `${trip.speed} km/h` : "Parked"],
                    ["ETA", trip.eta],
                    ["Progress", `${trip.progress}%`],
                    ["Status", trip.status.toUpperCase()],
                ].map(([k, v]) => (
                    <div key={k} style={{ background: C.surfaceAlt, borderRadius: 12, padding: "14px 16px", border: `1px solid ${C.border}` }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: .8, marginBottom: 6 }}>{k}</div>
                        <div style={{ fontWeight: 800, color: C.text, fontSize: 15 }}>{v}</div>
                    </div>
                ))}
            </div>
            <div style={{ marginTop: 18 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.muted, marginBottom: 8 }}>JOURNEY PROGRESS</div>
                <div style={{ background: "#f1f5f9", borderRadius: 8, height: 12, overflow: "hidden" }}>
                    <div style={{
                        height: "100%", width: `${trip.progress}%`,
                        background: trip.status === "delayed" ? C.amber : trip.status === "completed" ? C.accent : C.green,
                        borderRadius: 8, transition: "width 1s ease",
                    }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: C.muted, marginTop: 4 }}>
                    <span>Start</span>
                    <span style={{ fontWeight: 700, color: sc.text }}>{trip.progress}% complete</span>
                    <span>Destination</span>
                </div>
            </div>
        </div>
    );
}

/* ════════════════════════════════════════════════════════════
   🧩 SHARED MINI-COMPONENTS
════════════════════════════════════════════════════════════ */
function StatusBadge({ status }) {
    const active = status === "active";
    return (
        <span style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 700,
            background: active ? "#dcfce7" : "#fee2e2",
            color: active ? "#166534" : "#991b1b",
        }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: active ? C.green : C.red }} />
            {status}
        </span>
    );
}

function ActionBtn({ icon, color, title, onClick }) {
    const [hov, setHov] = useState(false);
    return (
        <button
            title={title}
            onClick={onClick}
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            style={{
                width: 30, height: 30, borderRadius: 8, border: "none",
                background: hov ? color + "20" : "#f8fafc",
                color: color, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all .15s",
            }}
        >
            {icon}
        </button>
    );
}

function Modal({ title, onClose, onSave, children }) {
    return (
        <div style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,.45)", backdropFilter: "blur(4px)",
            display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000,
        }}>
            <div style={{ ...card({ padding: 32, minWidth: 420, maxWidth: 520, width: "100%" }), animation: "fadeUp .2s ease" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
                    <h3 style={{ margin: 0, fontWeight: 800, color: C.text, fontSize: 18 }}>{title}</h3>
                    <button onClick={onClose} style={{ background: "#f1f5f9", border: "none", borderRadius: 8, padding: "6px 10px", cursor: "pointer" }}>
                        ✕
                    </button>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>{children}</div>
                <div style={{ display: "flex", gap: 10, marginTop: 24, justifyContent: "flex-end" }}>
                    <button onClick={onClose} style={{ ...btn("#f1f5f9", { color: C.text }) }}
                        onMouseEnter={e => e.currentTarget.style.background = "#e2e8f0"}
                        onMouseLeave={e => e.currentTarget.style.background = "#f1f5f9"}>Cancel</button>
                    <button onClick={onSave} style={btn(C.accent)}
                        onMouseEnter={e => e.currentTarget.style.background = C.accentHover}
                        onMouseLeave={e => e.currentTarget.style.background = C.accent}>Save</button>
                </div>
            </div>
            <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}`}</style>
        </div>
    );
}

function ConfirmDialog({ message, onConfirm, onCancel }) {
    return (
        <div style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", backdropFilter: "blur(4px)",
            display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000,
        }}>
            <div style={card({ padding: 28, maxWidth: 400, width: "90%", textAlign: "center" })}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>⚠️</div>
                <p style={{ color: C.text, fontWeight: 700, fontSize: 15, margin: "0 0 20px" }}>{message}</p>
                <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                    <button onClick={onCancel} style={{ ...btn("#f1f5f9", { color: C.text, padding: "10px 22px" }) }}>Cancel</button>
                    <button onClick={onConfirm} style={{ ...btn(C.red, { padding: "10px 22px" }) }}>Delete</button>
                </div>
            </div>
        </div>
    );
}

function FormField({ label, value, onChange, placeholder }) {
    return (
        <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: C.muted, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: .7 }}>{label}</label>
            <input
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder={placeholder}
                style={{
                    width: "100%", padding: "11px 14px", borderRadius: 10,
                    border: `1.5px solid ${C.border}`, fontSize: 14, outline: "none",
                    color: C.text, boxSizing: "border-box", transition: "border .2s",
                }}
                onFocus={e => e.target.style.borderColor = C.accent}
                onBlur={e => e.target.style.borderColor = C.border}
            />
        </div>
    );
}
