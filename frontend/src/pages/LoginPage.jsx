import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { authAPI } from "../services/api";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { FiUser, FiPhone, FiArrowRight, FiShield } from "react-icons/fi";

export default function LoginPage() {
  const navigate = useNavigate();
  const { loginUser } = useAuth();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("பேரு போடுங்க!");
      return;
    }
    if (phone.length !== 10) {
      toast.error("சரியான 10 digit number போடுங்க!");
      return;
    }

    setLoading(true);
    try {
      const res = await authAPI.login({
        name: name.trim(),
        phone_number: `+91${phone}`
      });
      const { user, tokens } = res.data;
      loginUser(user, tokens.access);
      toast.success(`Welcome, ${user.name}! 🎉`);
      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error("Login failed! Try again.");
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
          <div style={{ fontSize: "3rem", marginBottom: "8px" }}>🚗</div>
          <h1 style={{ color: "white", fontSize: "1.5rem", fontWeight: "800" }}>
            carkart
          </h1>
          <p style={{ color: "rgba(255,255,255,0.5)", marginTop: "4px" }}>
            Arni, Tamil Nadu
          </p>
        </div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleLogin}
        >
          <h2 style={{
            color: "white", fontSize: "1.3rem",
            fontWeight: "700", marginBottom: "6px"
          }}>
            Welcome! 👋
          </h2>
          <p style={{
            color: "rgba(255,255,255,0.5)",
            marginBottom: "24px", fontSize: "0.9rem"
          }}>
            LETS GO !
          </p>

          {/* Name */}
          <div style={{ marginBottom: "16px" }}>
            <label style={{
              color: "rgba(255,255,255,0.7)",
              fontSize: "0.85rem", marginBottom: "8px", display: "block"
            }}>
              NAME
            </label>
            <div style={{ position: "relative" }}>
              <FiUser style={{
                position: "absolute", left: "14px", top: "50%",
                transform: "translateY(-50%)",
                color: "rgba(255,255,255,0.4)"
              }} />
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="ENTER YOUR NAME"
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

          {/* Phone */}
          <div style={{ marginBottom: "28px" }}>
            <label style={{
              color: "rgba(255,255,255,0.7)",
              fontSize: "0.85rem", marginBottom: "8px", display: "block"
            }}>
              WhatsApp Number
            </label>
            <div style={{ display: "flex", gap: "8px" }}>
              <div style={{
                padding: "14px",
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: "12px", color: "rgba(255,255,255,0.7)",
                fontSize: "1rem", whiteSpace: "nowrap",
                display: "flex", alignItems: "center", gap: "6px"
              }}>
                <FiPhone size={14} /> +91
              </div>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="9876543210"
                required
                maxLength={10}
                style={{
                  flex: 1, padding: "14px",
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  borderRadius: "12px", color: "white",
                  fontSize: "1rem", outline: "none"
                }}
              />
            </div>
          </div>

          {/* User Login Button */}
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
              fontWeight: "700",
              cursor: loading ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center",
              justifyContent: "center", gap: "8px"
            }}
          >
            {loading ? "Logging in..." : <>Login <FiArrowRight /></>}
          </motion.button>

          {/* Divider */}
          <div style={{
            display: "flex", alignItems: "center", gap: "12px",
            margin: "20px 0"
          }}>
            <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.1)" }} />
            <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.8rem" }}>or</span>
            <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.1)" }} />
          </div>

          {/* ✅ Admin Login Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={() => navigate("/admin")}
            style={{
              width: "100%", padding: "14px",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(167,139,250,0.3)",
              borderRadius: "12px",
              color: "rgba(167,139,250,0.9)",
              fontSize: "0.95rem", fontWeight: "700",
              cursor: "pointer",
              display: "flex", alignItems: "center",
              justifyContent: "center", gap: "8px",
              transition: "all 0.2s ease"
            }}
          >
            <FiShield size={16} /> Admin Login
          </motion.button>

          <p style={{
            color: "rgba(255,255,255,0.4)", fontSize: "0.8rem",
            textAlign: "center", marginTop: "16px"
          }}>
            By continuing, you agree to our Terms & Privacy Policy
          </p>
        </motion.form>
      </motion.div>
    </div>
  );
}