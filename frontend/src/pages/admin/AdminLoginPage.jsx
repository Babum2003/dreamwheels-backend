
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";
import { FiLock, FiUser, FiEye, FiEyeOff } from "react-icons/fi";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8000/api/users/admin-login/", form);
      localStorage.setItem("adminToken", res.data.tokens.access);
      localStorage.setItem("adminRefresh", res.data.tokens.refresh);
      toast.success("Welcome Admin! 👋");
      navigate("/admin/dashboard");
    } catch {
      toast.error("Invalid credentials!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "20px"
    }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          width: "100%", maxWidth: "420px",
          background: "rgba(255,255,255,0.08)",
          backdropFilter: "blur(20px)",
          borderRadius: "24px",
          border: "1px solid rgba(255,255,255,0.15)",
          padding: "40px"
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{
            width: "70px", height: "70px", borderRadius: "20px",
            background: "linear-gradient(135deg, #a78bfa, #60a5fa)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 16px"
          }}>
            <FiLock size={32} color="white" />
          </div>
          <h1 style={{
            color: "white", fontSize: "1.8rem", fontWeight: "800"
          }}>
            Admin Panel
          </h1>
          <p style={{ color: "rgba(255,255,255,0.5)", marginTop: "8px" }}>
            carkart
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin}>
          {/* Username */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{
              color: "rgba(255,255,255,0.7)",
              fontSize: "0.85rem", marginBottom: "8px", display: "block"
            }}>
              Username
            </label>
            <div style={{ position: "relative" }}>
              <FiUser style={{
                position: "absolute", left: "14px",
                top: "50%", transform: "translateY(-50%)",
                color: "rgba(255,255,255,0.4)"
              }} />
              <input
                type="text"
                value={form.username}
                onChange={e => setForm({ ...form, username: e.target.value })}
                placeholder="Enter username"
                required
                style={{
                  width: "100%", padding: "14px 14px 14px 42px",
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  borderRadius: "12px", color: "white",
                  fontSize: "1rem", outline: "none",
                  boxSizing: "border-box"
                }}
              />
            </div>
          </div>

          {/* Password */}
          <div style={{ marginBottom: "28px" }}>
            <label style={{
              color: "rgba(255,255,255,0.7)",
              fontSize: "0.85rem", marginBottom: "8px", display: "block"
            }}>
              Password
            </label>
            <div style={{ position: "relative" }}>
              <FiLock style={{
                position: "absolute", left: "14px",
                top: "50%", transform: "translateY(-50%)",
                color: "rgba(255,255,255,0.4)"
              }} />
              <input
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                placeholder="Enter password"
                required
                style={{
                  width: "100%", padding: "14px 42px 14px 42px",
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  borderRadius: "12px", color: "white",
                  fontSize: "1rem", outline: "none",
                  boxSizing: "border-box"
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute", right: "14px",
                  top: "50%", transform: "translateY(-50%)",
                  background: "none", border: "none",
                  color: "rgba(255,255,255,0.4)", cursor: "pointer"
                }}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            style={{
              width: "100%", padding: "14px",
              background: loading
                ? "rgba(255,255,255,0.1)"
                : "linear-gradient(135deg, #a78bfa, #60a5fa)",
              border: "none", borderRadius: "12px",
              color: "white", fontSize: "1rem",
              fontWeight: "700", cursor: loading ? "not-allowed" : "pointer"
            }}
          >
            {loading ? "Logging in..." : "Login to Admin Panel"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}