// import React, { useState } from "react";
// import { motion } from "framer-motion";
// import { Mail, Lock, Eye, EyeOff, Loader2, CheckCircle2 } from "lucide-react";
// import "./App.css";

// export default function Login({ onLogin }) {
//   const [form, setForm] = useState({
//     email: "",
//     password: "",
//   });

//   const [showPassword, setShowPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (form.email && form.password) {
//       setIsLoading(true);
//       // Simulate API call
//       setTimeout(() => {
//         setIsLoading(false);
//         onLogin?.();
//       }, 1500);
//     }
//   };

//   return (
//     <div className="login-wrapper">
//       <motion.div
//         className="login-card"
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5, ease: "easeOut" }}
//       >
//         <h1 className="login-title">Welcome Back</h1>
//         <p className="login-subtitle">Please enter your details to sign in</p>

//         <form onSubmit={handleSubmit} className="login-form">
//           {/* Email */}
//           <div className="input-group">
//             <Mail className="input-icon" size={18} />
//             <input
//               type="text"
//               name="email"
//               placeholder="Username or Email"
//               value={form.email}
//               onChange={handleChange}
//               required
//             />
//             {form.email && (
//               <motion.div
//                 className="input-feedback"
//                 initial={{ scale: 0 }}
//                 animate={{ scale: 1 }}
//               >
//                 <CheckCircle2 size={18} />
//               </motion.div>
//             )}
//           </div>

//           {/* Password */}
//           <div className="input-group">
//             <Lock className="input-icon" size={18} />
//             <input
//               type={showPassword ? "text" : "password"}
//               name="password"
//               placeholder="Password"
//               value={form.password}
//               onChange={handleChange}
//               required
//             />
//             <button
//               type="button"
//               onClick={() => setShowPassword((p) => !p)}
//               className="eye-btn"
//               tabIndex="-1"
//             >
//               {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//             </button>
//           </div>

//           {/* Options */}
//           <div className="login-options">
//             <label className="remember-me">
//               <input type="checkbox" />
//               <span>Remember me</span>
//             </label>
//             <button type="button" className="forgot-btn">
//               Forgot password?
//             </button>
//           </div>

//           <motion.button
//             type="submit"
//             className="login-btn"
//             disabled={isLoading}
//             whileHover={{ scale: 1.02 }}
//             whileTap={{ scale: 0.98 }}
//           >
//             {isLoading ? (
//               <Loader2 className="spinner" size={20} />
//             ) : (
//               "Login"
//             )}
//           </motion.button>

//           <p className="help-text">
//             Need help? <span>Contact Support</span>
//           </p>
//         </form>
//       </motion.div>
//     </div>
//   );
// }

// import React, { useState } from "react";
// import "./App.css";

// export default function Login({ onLogin }) {
//   const [form, setForm] = useState({ email: "", password: "" });
//   const [showPass, setShowPass] = useState(false);
//   const [isLoading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

//   const handleSubmit = async e => {
//     e.preventDefault();
//     setError("");
//     if (!form.email || !form.password) { setError("Please enter email and password."); return; }
//     setLoading(true);
//     setTimeout(() => {
//       const success = onLogin(form.email, form.password);
//       if (!success) setError("Invalid credentials. Check the hints below.");
//       setLoading(false);
//     }, 1000);
//   };

//   const quickFill = (email, pw) => setForm({ email, password: pw });

//   const hints = [
//     { role: "Main Admin", email: "admin@gobus.in", pw: "admin123", icon: "👑", color: "#4f46e5" },
//     { role: "Company Admin", email: "company@smt.in", pw: "company123", icon: "🏢", color: "#10b981" },
//     { role: "Driver", email: "driver@gobus.in", pw: "driver123", icon: "🚌", color: "#f59e0b" },
//   ];

//   return (
//     <div style={{ minHeight: "100vh", display: "flex", background: "linear-gradient(135deg,#4f46e5 0%,#3b82f6 100%)" }}>
//       {/* Left panel - branding */}
//       <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 48, color: "white" }}>
//         <div>
//           <div style={{ fontSize: 56, marginBottom: 16 }}>🚌</div>
//           <h1 style={{ fontSize: 40, fontWeight: 800, margin: "0 0 12px", letterSpacing: -1 }}>GoBus Admin</h1>
//           <p style={{ fontSize: 16, opacity: .8, maxWidth: 320, lineHeight: 1.6 }}>
//             Smart Real-Time Bus Tracking System — Monitor your fleet live, manage drivers, routes, and more.
//           </p>
//           <div style={{ marginTop: 40, display: "flex", flexDirection: "column", gap: 12 }}>
//             {[["📡", "Live GPS tracking via driver mobile"], ["🗺", "Route & trip management"], ["📊", "Real-time analytics & reports"]].map(([icon, text]) => (
//               <div key={text} style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 14, opacity: .85 }}>
//                 <span style={{ fontSize: 20 }}>{icon}</span>{text}
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Right panel - login */}
//       <div style={{ width: 480, background: "white", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 48 }}>
//         <div style={{ width: "100%", maxWidth: 380 }}>
//           <h2 style={{ fontSize: 28, fontWeight: 800, color: "#0f172a", margin: "0 0 6px" }}>Welcome Back</h2>
//           <p style={{ color: "#64748b", marginBottom: 32 }}>Sign in to your admin account</p>

//           <form onSubmit={handleSubmit}>
//             {/* Email */}
//             <div style={{ marginBottom: 16 }}>
//               <label style={{ fontSize: 13, fontWeight: 700, color: "#374151", display: "block", marginBottom: 6 }}>Email Address</label>
//               <div style={{ position: "relative" }}>
//                 <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 16 }}>✉</span>
//                 <input name="email" type="text" value={form.email} onChange={handleChange} placeholder="your@email.com"
//                   style={{ width: "100%", padding: "12px 14px 12px 40px", borderRadius: 12, border: "1.5px solid #e5e7eb", fontSize: 14, outline: "none", boxSizing: "border-box", transition: "border .2s" }}
//                   onFocus={e => e.target.style.borderColor = "#4f46e5"} onBlur={e => e.target.style.borderColor = "#e5e7eb"} />
//               </div>
//             </div>

//             {/* Password */}
//             <div style={{ marginBottom: 20 }}>
//               <label style={{ fontSize: 13, fontWeight: 700, color: "#374151", display: "block", marginBottom: 6 }}>Password</label>
//               <div style={{ position: "relative" }}>
//                 <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 16 }}>🔒</span>
//                 <input name="password" type={showPass ? "text" : "password"} value={form.password} onChange={handleChange} placeholder="••••••••"
//                   style={{ width: "100%", padding: "12px 44px 12px 40px", borderRadius: 12, border: "1.5px solid #e5e7eb", fontSize: 14, outline: "none", boxSizing: "border-box", transition: "border .2s" }}
//                   onFocus={e => e.target.style.borderColor = "#4f46e5"} onBlur={e => e.target.style.borderColor = "#e5e7eb"} />
//                 <button type="button" onClick={() => setShowPass(p => !p)} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: 16, color: "#9ca3af" }}>
//                   {showPass ? "🙈" : "👁"}
//                 </button>
//               </div>
//             </div>

//             {/* Error */}
//             {error && (
//               <div style={{ background: "#fee2e2", color: "#991b1b", padding: "10px 14px", borderRadius: 10, fontSize: 13, fontWeight: 600, marginBottom: 16 }}>
//                 ✕ {error}
//               </div>
//             )}

//             {/* Submit */}
//             <button type="submit" disabled={isLoading} style={{ width: "100%", background: "#4f46e5", color: "white", border: "none", padding: "14px", borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: isLoading ? "not-allowed" : "pointer", opacity: isLoading ? .7 : 1, transition: "background .2s" }}
//               onMouseEnter={e => { if (!isLoading) e.target.style.background = "#4338ca"; }}
//               onMouseLeave={e => e.target.style.background = "#4f46e5"}>
//               {isLoading ? "Signing in..." : "Sign In →"}
//             </button>
//           </form>

//           {/* Demo credential hints */}
//           <div style={{ marginTop: 28 }}>
//             <div style={{ fontSize: 12, color: "#94a3b8", textAlign: "center", marginBottom: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: .5 }}>
//               — Demo Credentials —
//             </div>
//             {hints.map(h => (
//               <button key={h.role} onClick={() => quickFill(h.email, h.pw)}
//                 style={{ width: "100%", background: "#f8fafc", border: `1.5px solid #e2e8f0`, borderRadius: 12, padding: "10px 14px", marginBottom: 8, cursor: "pointer", display: "flex", alignItems: "center", gap: 10, transition: "all .2s" }}
//                 onMouseEnter={e => { e.currentTarget.style.borderColor = h.color; e.currentTarget.style.background = `${h.color}08`; }}
//                 onMouseLeave={e => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.background = "#f8fafc"; }}>
//                 <span style={{ fontSize: 20 }}>{h.icon}</span>
//                 <div style={{ textAlign: "left" }}>
//                   <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{h.role}</div>
//                   <div style={{ fontSize: 11, color: "#94a3b8" }}>{h.email} · {h.pw}</div>
//                 </div>
//                 <span style={{ marginLeft: "auto", fontSize: 11, color: h.color, fontWeight: 700 }}>Click to fill →</span>
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
import React, { useState } from "react";
import "./App.css";

export default function Login({ onLogin }) {
  const [form, setForm] = useState({ username: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    if (!form.username || !form.password) { setError("Please enter username and password."); return; }
    setLoading(true);
    setTimeout(() => {
      const success = onLogin(form.username, form.password);
      if (!success) setError("Invalid username or password. Try the hints below.");
      setLoading(false);
    }, 1000);
  };

  const quickFill = (username, pw) => setForm({ username, password: pw });

  const hints = [
    { role: "Main Admin", username: "mainadmin", pw: "admin123", icon: "👑", color: "#4f46e5" },
    { role: "Company Admin", username: "companyadmin", pw: "company123", icon: "🏢", color: "#10b981" },
    { role: "Driver", username: "driver1", pw: "driver123", icon: "🚌", color: "#f59e0b" },
  ];

  return (
    <div style={{ minHeight: "100vh", display: "flex", background: "linear-gradient(135deg,#4f46e5 0%,#3b82f6 100%)" }}>

      {/* Left branding panel */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 48, color: "white" }}>
        <div>
          <div style={{ fontSize: 60, marginBottom: 16 }}>🚌</div>
          <h1 style={{ fontSize: 40, fontWeight: 800, margin: "0 0 12px", letterSpacing: -1 }}>GoBus Admin</h1>
          <p style={{ fontSize: 16, opacity: .8, maxWidth: 320, lineHeight: 1.7 }}>
            Smart Real-Time Bus Tracking System — Monitor your fleet live, manage drivers, routes, and more.
          </p>
          <div style={{ marginTop: 40, display: "flex", flexDirection: "column", gap: 14 }}>
            {[["📡", "Live GPS tracking via driver mobile"],
            ["🗺", "Route & trip management"],
            ["📊", "Real-time analytics & reports"]].map(([icon, text]) => (
              <div key={text} style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 14, opacity: .85 }}>
                <span style={{ fontSize: 22 }}>{icon}</span>{text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right login panel */}
      <div style={{ width: 480, background: "white", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 48 }}>
        <div style={{ width: "100%", maxWidth: 380 }}>

          <h2 style={{ fontSize: 28, fontWeight: 800, color: "#0f172a", margin: "0 0 6px" }}>Welcome Back 👋</h2>
          <p style={{ color: "#64748b", marginBottom: 32, fontSize: 14 }}>Sign in with your username and password</p>

          <form onSubmit={handleSubmit}>

            {/* Username field */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 700, color: "#374151", display: "block", marginBottom: 6 }}>
                Username
              </label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 16 }}>👤</span>
                <input
                  name="username"
                  type="text"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="Enter your username"
                  autoComplete="off"
                  style={{ width: "100%", padding: "13px 14px 13px 42px", borderRadius: 12, border: "1.5px solid #e5e7eb", fontSize: 14, outline: "none", boxSizing: "border-box", color: "#0f172a" }}
                  onFocus={e => e.target.style.borderColor = "#4f46e5"}
                  onBlur={e => e.target.style.borderColor = "#e5e7eb"}
                />
              </div>
            </div>

            {/* Password field */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 13, fontWeight: 700, color: "#374151", display: "block", marginBottom: 6 }}>
                Password
              </label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 16 }}>🔒</span>
                <input
                  name="password"
                  type={showPass ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  style={{ width: "100%", padding: "13px 44px 13px 42px", borderRadius: 12, border: "1.5px solid #e5e7eb", fontSize: 14, outline: "none", boxSizing: "border-box", color: "#0f172a" }}
                  onFocus={e => e.target.style.borderColor = "#4f46e5"}
                  onBlur={e => e.target.style.borderColor = "#e5e7eb"}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(p => !p)}
                  style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: 16, color: "#9ca3af" }}>
                  {showPass ? "🙈" : "👁"}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div style={{ background: "#fee2e2", color: "#991b1b", padding: "10px 14px", borderRadius: 10, fontSize: 13, fontWeight: 600, marginBottom: 16 }}>
                ✕ {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              style={{ width: "100%", background: "#4f46e5", color: "white", border: "none", padding: "14px", borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: isLoading ? "not-allowed" : "pointer", opacity: isLoading ? .7 : 1 }}
              onMouseEnter={e => { if (!isLoading) e.target.style.background = "#4338ca"; }}
              onMouseLeave={e => e.target.style.background = "#4f46e5"}>
              {isLoading ? "⏳ Signing in..." : "Sign In →"}
            </button>
          </form>

          {/* Demo credential hints */}
          <div style={{ marginTop: 28 }}>
            <div style={{ fontSize: 12, color: "#94a3b8", textAlign: "center", marginBottom: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: .5 }}>
              — Demo Accounts —
            </div>
            {hints.map(h => (
              <button
                key={h.role}
                onClick={() => quickFill(h.username, h.pw)}
                style={{ width: "100%", background: "#f8fafc", border: "1.5px solid #e2e8f0", borderRadius: 12, padding: "11px 14px", marginBottom: 8, cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = h.color; e.currentTarget.style.background = `${h.color}10`; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.background = "#f8fafc"; }}>
                <span style={{ fontSize: 22 }}>{h.icon}</span>
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{h.role}</div>
                  <div style={{ fontSize: 11, color: "#94a3b8" }}>
                    Username: <strong>{h.username}</strong> · Password: <strong>{h.pw}</strong>
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