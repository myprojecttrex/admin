/*import { useState } from "react";
import "./App.css";

import Login from "./Login";
import Drivers from "./Driver";
import Buses from "./Buses";
import Routes from "./Route"; 

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activePage, setActivePage] = useState("dashboard");

  return (
    <>
      {isLoggedIn ? (
        <Dashboard
          activePage={activePage}
          setActivePage={setActivePage}
        />
      ) : (
        <Login onLogin={() => setIsLoggedIn(true)} />
      )}
    </>
  );
}

/* ===== Dashboard ===== */
/*
function Dashboard({ activePage, setActivePage }) {
  return (
    <div className="layout">
      {/* Sidebar *//*}
<aside className="sidebar">
<div className="logo">🚌 GoBus</div>

<ul className="menu">
<li
className={activePage === "dashboard" ? "active" : ""}
onClick={() => setActivePage("dashboard")}
>
Dashboard
</li>

<li
className={activePage === "drivers" ? "active" : ""}
onClick={() => setActivePage("drivers")}
>
Drivers
</li>

<li
className={activePage === "buses" ? "active" : ""}
onClick={() => setActivePage("buses")}
>
Buses
</li>

{/* ✅ ROUTES CONNECTED *//*}
<li
className={activePage === "routes" ? "active" : ""}
onClick={() => setActivePage("routes")}
>
Routes
</li>

<li>Tracking</li>
</ul>
</aside>

{/* Main *//*}
<div className="main-area">
  <header className="topbar">
    <h1>
      {activePage === "dashboard" && "Dashboard"}
      {activePage === "drivers" && "Manage Drivers"}
      {activePage === "buses" && "Manage Buses"}
      {activePage === "routes" && "Manage Routes"} {/* ✅ NEW *//*}
</h1>

<div className="profile">Admin</div>
</header>
/*
<main className="content">
{/* ===== Dashboard Page ===== *//*}
{activePage === "dashboard" && (
  <>
    <div className="cards">
      <div className="card">
        <span className="card-title">Total Drivers</span>
        <h2>12</h2>
      </div>

      <div className="card">
        <span className="card-title">Total Buses</span>
        <h2>8</h2>
      </div>

      <div className="card">
        <span className="card-title">Active Trips</span>
        <h2>5</h2>
      </div>
    </div>

    <div className="chart">
      <h3>Live Activity</h3>
      <p>Map / Graph later add pannalaam</p>
    </div>
  </>
)}

{/* ===== Other Pages ===== *//*}
{activePage === "drivers" && <Drivers />}
{activePage === "buses" && <Buses />}
{activePage === "routes" && <Routes />} {/* ✅ NEW *//*}
</main>
</div>
</div>
);
}

export default App;
*/
// import { useState } from "react";
// import "./App.css";
// import Login from "./Login";
// import Drivers from "./Driver";
// import Buses from "./Buses";
// import Routes from "./Route";
// import CompanyAdmin from "./CompanyAdmin";

// // Role credentials (in production, these come from your backend/Firebase)
// const CREDENTIALS = {
//   "admin@gobus.in": { password: "admin123", role: "main-admin", name: "Main Admin" },
//   "company@smt.in": { password: "company123", role: "company-admin", name: "Sri Murugan Transport" },
//   "driver@gobus.in": { password: "driver123", role: "driver", name: "Ramesh Kumar" },
// };

// export default function App() {
//   const [user, setUser] = useState(null); // { email, role, name }

//   const handleLogin = (email, password) => {
//     const found = CREDENTIALS[email.toLowerCase()];
//     if (found && found.password === password) {
//       setUser({ email, role: found.role, name: found.name });
//       return true;
//     }
//     return false;
//   };

//   const handleLogout = () => setUser(null);

//   if (!user) return <Login onLogin={handleLogin} />;

//   if (user.role === "company-admin") return <CompanyAdmin onLogout={handleLogout} user={user} />;
//   if (user.role === "main-admin") return <MainAdminDashboard user={user} onLogout={handleLogout} />;
//   if (user.role === "driver") return <DriverPortal user={user} onLogout={handleLogout} />;

//   return <Login onLogin={handleLogin} />;
// }

// // ─── MAIN ADMIN DASHBOARD ────────────────────────────────────────────────────
// function MainAdminDashboard({ user, onLogout }) {
//   const [activePage, setActivePage] = useState("dashboard");

//   return (
//     <div className="layout">
//       <aside className="sidebar">
//         <div className="logo">🚌 GoBus</div>
//         <ul className="menu">
//           {[["dashboard", "Dashboard"], ["drivers", "Drivers"], ["buses", "Buses"], ["routes", "Routes"], ["companies", "Companies"]].map(([key, label]) => (
//             <li key={key} className={activePage === key ? "active" : ""} onClick={() => setActivePage(key)}>{label}</li>
//           ))}
//         </ul>
//         <div style={{ position: "absolute", bottom: 24, left: 24, right: 24 }}>
//           <button onClick={onLogout} style={{ background: "rgba(255,255,255,.15)", border: "none", color: "white", padding: "10px", borderRadius: 10, cursor: "pointer", width: "100%", fontSize: 13, fontWeight: 700 }}>
//             ← Logout
//           </button>
//         </div>
//       </aside>

//       <div className="main-area">
//         <header className="topbar">
//           <h1>
//             {activePage === "dashboard" && "Dashboard"}
//             {activePage === "drivers" && "Manage Drivers"}
//             {activePage === "buses" && "Manage Buses"}
//             {activePage === "routes" && "Manage Routes"}
//             {activePage === "companies" && "Manage Companies"}
//           </h1>
//           <div className="profile">👑 {user.name}</div>
//         </header>

//         <main className="content">
//           {activePage === "dashboard" && (
//             <>
//               <div className="cards">
//                 <div className="card"><span className="card-title">Total Drivers</span><h2>12</h2></div>
//                 <div className="card"><span className="card-title">Total Buses</span><h2>8</h2></div>
//                 <div className="card"><span className="card-title">Active Trips</span><h2>5</h2></div>
//                 <div className="card"><span className="card-title">Companies</span><h2>3</h2></div>
//               </div>
//               <div className="chart">
//                 <h3>System Overview</h3>
//                 <p style={{ color: "#94a3b8", marginTop: 8 }}>Live activity map will appear here (integrate Google Maps / Leaflet API)</p>
//                 <div style={{ marginTop: 20, display: "flex", gap: 16 }}>
//                   {[["company@smt.in", "Sri Murugan Transport", "4 buses", "Active"], ["company2@abc.in", "ABC Travels", "2 buses", "Active"], ["company3@xyz.in", "XYZ Express", "2 buses", "Inactive"]].map(([, name, buses, status]) => (
//                     <div key={name} style={{ flex: 1, background: "#f8fafc", borderRadius: 12, padding: 16 }}>
//                       <div style={{ fontWeight: 700, color: "#0f172a" }}>{name}</div>
//                       <div style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>{buses} · {status}</div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </>
//           )}
//           {activePage === "drivers" && <Drivers />}
//           {activePage === "buses" && <Buses />}
//           {activePage === "routes" && <Routes />}
//           {activePage === "companies" && <CompaniesPage />}
//         </main>
//       </div>
//     </div>
//   );
// }

// // Simple Companies listing for Main Admin
// function CompaniesPage() {
//   const [companies] = useState([
//     { id: "COMP-001", name: "Sri Murugan Transport Co.", city: "Madurai", buses: 4, drivers: 4, status: "active", contact: "9876500000" },
//     { id: "COMP-002", name: "ABC Travels", city: "Chennai", buses: 2, drivers: 2, status: "active", contact: "9123400000" },
//     { id: "COMP-003", name: "XYZ Express", city: "Coimbatore", buses: 2, drivers: 1, status: "inactive", contact: "9988800000" },
//   ]);
//   return (
//     <div style={{ background: "white", borderRadius: 16, padding: 24, boxShadow: "0 4px 20px rgba(0,0,0,.06)" }}>
//       <h2 style={{ margin: "0 0 20px", fontSize: 18, fontWeight: 800, color: "#0f172a" }}>Registered Companies</h2>
//       <table style={{ width: "100%", borderCollapse: "collapse" }}>
//         <thead><tr style={{ borderBottom: "1px solid #e2e8f0" }}>
//           {["Company ID", "Name", "City", "Buses", "Drivers", "Contact", "Status"].map(h => (
//             <th key={h} style={{ textAlign: "left", padding: "10px 14px", fontSize: 12, color: "#64748b", fontWeight: 700, textTransform: "uppercase" }}>{h}</th>
//           ))}
//         </tr></thead>
//         <tbody>
//           {companies.map(c => (
//             <tr key={c.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
//               <td style={{ padding: "14px", fontSize: 13 }}><code style={{ background: "#eef2ff", color: "#4f46e5", padding: "2px 8px", borderRadius: 6 }}>{c.id}</code></td>
//               <td style={{ padding: "14px", fontWeight: 700, color: "#0f172a" }}>{c.name}</td>
//               <td style={{ padding: "14px", color: "#64748b" }}>{c.city}</td>
//               <td style={{ padding: "14px" }}>{c.buses}</td>
//               <td style={{ padding: "14px" }}>{c.drivers}</td>
//               <td style={{ padding: "14px", color: "#64748b" }}>{c.contact}</td>
//               <td style={{ padding: "14px" }}>
//                 <span style={{ background: c.status === "active" ? "#dcfce7" : "#fee2e2", color: c.status === "active" ? "#166534" : "#991b1b", padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 700 }}>{c.status}</span>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// // ─── DRIVER PORTAL (placeholder — you already built this) ────────────────────
// function DriverPortal({ user, onLogout }) {
//   return (
//     <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: "#f0f4f8", flexDirection: "column", gap: 20 }}>
//       <div style={{ background: "white", padding: 40, borderRadius: 20, boxShadow: "0 8px 30px rgba(0,0,0,.1)", textAlign: "center" }}>
//         <div style={{ fontSize: 64 }}>🚌</div>
//         <h2 style={{ margin: "16px 0 8px", color: "#0f172a" }}>Driver Portal</h2>
//         <p style={{ color: "#64748b", marginBottom: 24 }}>Welcome, {user.name}! Your driver module is loaded here.</p>
//         <button onClick={onLogout} style={{ background: "#4f46e5", color: "white", border: "none", padding: "12px 28px", borderRadius: 10, fontWeight: 700, cursor: "pointer" }}>← Logout</button>
//       </div>
//     </div>
//   );
// }
import { useState } from "react";
import "./App.css";
import Login from "./Login";
import Drivers from "./Driver";
import Buses from "./Buses";
import Routes from "./Route";
import CompanyAdmin from "./CompanyAdmin";

// ✅ USERNAME-based credentials (no email needed)
const CREDENTIALS = {
  "mainadmin": { password: "admin123", role: "main-admin", name: "Main Admin" },
  "companyadmin": { password: "company123", role: "company-admin", name: "Sri Murugan Transport" },
  "driver1": { password: "driver123", role: "driver", name: "Ramesh Kumar" },
};

export default function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (username, password) => {
    const found = CREDENTIALS[username.toLowerCase()];
    if (found && found.password === password) {
      setUser({ username, role: found.role, name: found.name });
      return true;
    }
    return false;
  };

  const handleLogout = () => setUser(null);

  if (!user) return <Login onLogin={handleLogin} />;
  if (user.role === "company-admin") return <CompanyAdmin onLogout={handleLogout} user={user} />;
  if (user.role === "main-admin") return <MainAdminDashboard user={user} onLogout={handleLogout} />;
  if (user.role === "driver") return <DriverPortal user={user} onLogout={handleLogout} />;

  return <Login onLogin={handleLogin} />;
}

/* ─── MAIN ADMIN DASHBOARD ─────────────────────────────── */
function MainAdminDashboard({ user, onLogout }) {
  const [activePage, setActivePage] = useState("dashboard");

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="logo">🚌 GoBus</div>
        <ul className="menu">
          {[["dashboard", "Dashboard"], ["drivers", "Drivers"], ["buses", "Buses"], ["routes", "Routes"], ["companies", "Companies"]].map(([key, label]) => (
            <li key={key} className={activePage === key ? "active" : ""} onClick={() => setActivePage(key)}>{label}</li>
          ))}
        </ul>
        <div style={{ position: "absolute", bottom: 24, left: 24, right: 24 }}>
          <button onClick={onLogout} style={{ background: "rgba(255,255,255,.15)", border: "none", color: "white", padding: "10px", borderRadius: 10, cursor: "pointer", width: "100%", fontSize: 13, fontWeight: 700 }}>
            ← Logout
          </button>
        </div>
      </aside>

      <div className="main-area">
        <header className="topbar">
          <h1>
            {activePage === "dashboard" && "Dashboard"}
            {activePage === "drivers" && "Manage Drivers"}
            {activePage === "buses" && "Manage Buses"}
            {activePage === "routes" && "Manage Routes"}
            {activePage === "companies" && "Manage Companies"}
          </h1>
          <div className="profile">👑 {user.name}</div>
        </header>

        <main className="content">
          {activePage === "dashboard" && (
            <>
              <div className="cards">
                <div className="card"><span className="card-title">Total Drivers</span><h2>12</h2></div>
                <div className="card"><span className="card-title">Total Buses</span><h2>8</h2></div>
                <div className="card"><span className="card-title">Active Trips</span><h2>5</h2></div>
                <div className="card"><span className="card-title">Companies</span><h2>3</h2></div>
              </div>
              <div className="chart">
                <h3>Live Activity</h3>
                <p style={{ color: "#94a3b8", marginTop: 8 }}>Integrate Google Maps / Leaflet here</p>
              </div>
            </>
          )}
          {activePage === "drivers" && <Drivers />}
          {activePage === "buses" && <Buses />}
          {activePage === "routes" && <Routes />}
          {activePage === "companies" && <CompaniesPage />}
        </main>
      </div>
    </div>
  );
}

function CompaniesPage() {
  const companies = [
    { id: "COMP-001", name: "Sri Murugan Transport Co.", city: "Madurai", buses: 4, drivers: 4, status: "active" },
    { id: "COMP-002", name: "ABC Travels", city: "Chennai", buses: 2, drivers: 2, status: "active" },
    { id: "COMP-003", name: "XYZ Express", city: "Coimbatore", buses: 2, drivers: 1, status: "inactive" },
  ];
  return (
    <div style={{ background: "white", borderRadius: 16, padding: 24, boxShadow: "0 4px 20px rgba(0,0,0,.06)" }}>
      <h2 style={{ margin: "0 0 20px", fontSize: 18, fontWeight: 800, color: "#0f172a" }}>Registered Companies</h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead><tr>
          {["Company ID", "Name", "City", "Buses", "Drivers", "Status"].map(h => (
            <th key={h} style={{ textAlign: "left", padding: "10px 14px", fontSize: 12, color: "#64748b", fontWeight: 700, textTransform: "uppercase", borderBottom: "1px solid #e2e8f0" }}>{h}</th>
          ))}
        </tr></thead>
        <tbody>
          {companies.map(c => (
            <tr key={c.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
              <td style={{ padding: "14px" }}><code style={{ background: "#eef2ff", color: "#4f46e5", padding: "2px 8px", borderRadius: 6, fontSize: 12 }}>{c.id}</code></td>
              <td style={{ padding: "14px", fontWeight: 700, color: "#0f172a" }}>{c.name}</td>
              <td style={{ padding: "14px", color: "#64748b" }}>{c.city}</td>
              <td style={{ padding: "14px" }}>{c.buses}</td>
              <td style={{ padding: "14px" }}>{c.drivers}</td>
              <td style={{ padding: "14px" }}>
                <span style={{ background: c.status === "active" ? "#dcfce7" : "#fee2e2", color: c.status === "active" ? "#166534" : "#991b1b", padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 700 }}>{c.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DriverPortal({ user, onLogout }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: "#f0f4f8" }}>
      <div style={{ background: "white", padding: 40, borderRadius: 20, boxShadow: "0 8px 30px rgba(0,0,0,.1)", textAlign: "center" }}>
        <div style={{ fontSize: 64 }}>🚌</div>
        <h2 style={{ margin: "16px 0 8px", color: "#0f172a" }}>Driver Portal</h2>
        <p style={{ color: "#64748b", marginBottom: 24 }}>Welcome, {user.name}! Your driver module loads here.</p>
        <button onClick={onLogout} style={{ background: "#4f46e5", color: "white", border: "none", padding: "12px 28px", borderRadius: 10, fontWeight: 700, cursor: "pointer" }}>← Logout</button>
      </div>
    </div>
  );
}