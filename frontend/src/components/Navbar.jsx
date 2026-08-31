import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { FiHome, FiHeart, FiUser, FiLogOut, FiX, FiMenu } from "react-icons/fi";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setProfileOpen(false);
    setMenuOpen(false);
  };

  return (
    <>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
        background: "rgba(15,12,41,0.95)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
        padding: "0 16px", height: "64px",
        display: "flex", alignItems: "center", justifyContent: "space-between"
      }}>

        {/* Logo */}
        <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "10px" }}
          onClick={() => setMenuOpen(false)}>
          <div style={{
            width: "38px", height: "38px", borderRadius: "12px",
            background: "linear-gradient(135deg, #a78bfa, #60a5fa)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1.2rem", flexShrink: 0,
            boxShadow: "0 0 16px rgba(167,139,250,0.5)"
          }}>🚗</div>
          <div>
            <div style={{
              fontWeight: "800", fontSize: "1.05rem",
              lineHeight: "1.15", whiteSpace: "nowrap",
              background: "linear-gradient(135deg, #ffffff, #a78bfa, #60a5fa)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
            }}>
              carkart
            </div>
            <div style={{
              fontSize: "0.62rem", fontWeight: "600", letterSpacing: "1.5px",
              textTransform: "uppercase",
              background: "linear-gradient(135deg, #a78bfa, #60a5fa)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
            }}>ARNI, TN</div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}
          className="desktop-nav">

          <Link to="/" style={{ textDecoration: "none" }}>
            <div style={{
              display: "flex", alignItems: "center", gap: "6px",
              color: "rgba(255,255,255,0.7)", padding: "8px 14px",
              borderRadius: "10px", cursor: "pointer", fontSize: "0.9rem", fontWeight: "500"
            }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              <FiHome size={16} /> Home
            </div>
          </Link>

          {user && (
            <Link to="/dashboard" style={{ textDecoration: "none" }}>
              <div style={{
                display: "flex", alignItems: "center", gap: "6px",
                color: "rgba(255,255,255,0.7)", padding: "8px 14px",
                borderRadius: "10px", cursor: "pointer", fontSize: "0.9rem", fontWeight: "500"
              }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                <FiHeart size={16} /> Favourites
              </div>
            </Link>
          )}

          {!user && (
            <button
              onClick={() => navigate("/login")}
              style={{
                background: "linear-gradient(135deg, #a78bfa, #60a5fa)",
                border: "none", borderRadius: "12px",
                color: "white", padding: "8px 20px",
                cursor: "pointer", fontWeight: "700", fontSize: "0.9rem"
              }}
            >
              Login
            </button>
          )}
        </div>

        {/* Right Side — avatar/login + hamburger */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", position: "relative" }}>

          {user ? (
            <>
              <div
                onClick={() => { setProfileOpen(!profileOpen); setMenuOpen(false); }}
                style={{
                  width: "34px", height: "34px", borderRadius: "50%",
                  background: "linear-gradient(135deg, #a78bfa, #60a5fa)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "0.85rem", fontWeight: "700", color: "white",
                  flexShrink: 0, cursor: "pointer"
                }}
              >
                {user.name?.charAt(0).toUpperCase()}
              </div>

              {/* Profile Dropdown */}
              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    style={{
                      position: "absolute", top: "calc(100% + 12px)", right: 0,
                      background: "rgba(15,12,41,0.98)",
                      backdropFilter: "blur(20px)",
                      border: "1px solid rgba(255,255,255,0.15)",
                      borderRadius: "16px", padding: "8px",
                      minWidth: "200px", zIndex: 100
                    }}
                  >
                    <div style={{ padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.1)", marginBottom: "4px" }}>
                      <div style={{ color: "white", fontWeight: "700" }}>{user.name}</div>
                      <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.8rem" }}>{user.phone_number}</div>
                    </div>
                    <Link to="/dashboard" onClick={() => setProfileOpen(false)} style={{ textDecoration: "none" }}>
                      <div style={{
                        display: "flex", alignItems: "center", gap: "10px",
                        padding: "10px 16px", borderRadius: "10px",
                        color: "rgba(255,255,255,0.7)", cursor: "pointer"
                      }}
                        onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                      >
                        <FiUser size={15} /> My Dashboard
                      </div>
                    </Link>
                    <div onClick={handleLogout} style={{
                      display: "flex", alignItems: "center", gap: "10px",
                      padding: "10px 16px", borderRadius: "10px",
                      color: "#ef4444", cursor: "pointer"
                    }}
                      onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.1)"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >
                      <FiLogOut size={15} /> Logout
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          ) : (
            <button
              onClick={() => navigate("/login")}
              style={{
                background: "linear-gradient(135deg, #a78bfa, #60a5fa)",
                border: "none", borderRadius: "10px",
                color: "white", padding: "7px 14px",
                cursor: "pointer", fontWeight: "700", fontSize: "0.85rem"
              }}
            >
              Login
            </button>
          )}

          {/* Hamburger */}
          <button
            onClick={() => { setMenuOpen(!menuOpen); setProfileOpen(false); }}
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: "10px", color: "white",
              width: "38px", height: "38px",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", flexShrink: 0
            }}
          >
            {menuOpen ? <FiX size={18} /> : <FiMenu size={18} />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "tween", duration: 0.25 }}
            style={{
              position: "fixed", top: "64px", right: 0,
              width: "75%", maxWidth: "300px",
              height: "calc(100vh - 64px)",
              background: "rgba(15,12,41,0.98)",
              backdropFilter: "blur(20px)",
              borderLeft: "1px solid rgba(255,255,255,0.1)",
              zIndex: 999, padding: "24px 16px",
              display: "flex", flexDirection: "column", gap: "8px"
            }}
          >
            {user && (
              <div style={{
                padding: "16px",
                background: "rgba(167,139,250,0.1)",
                borderRadius: "14px",
                border: "1px solid rgba(167,139,250,0.2)",
                marginBottom: "8px"
              }}>
                <div style={{ color: "white", fontWeight: "700", fontSize: "1rem" }}>{user.name}</div>
                <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.8rem", marginTop: "2px" }}>{user.phone_number}</div>
              </div>
            )}

            <Link to="/" onClick={() => setMenuOpen(false)} style={{ textDecoration: "none" }}>
              <div style={{
                display: "flex", alignItems: "center", gap: "12px",
                padding: "14px 16px", borderRadius: "12px",
                color: "white", fontWeight: "600", fontSize: "1rem",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)"
              }}>
                <FiHome size={18} color="#a78bfa" /> Home
              </div>
            </Link>

            {user && (
              <Link to="/dashboard" onClick={() => setMenuOpen(false)} style={{ textDecoration: "none" }}>
                <div style={{
                  display: "flex", alignItems: "center", gap: "12px",
                  padding: "14px 16px", borderRadius: "12px",
                  color: "white", fontWeight: "600", fontSize: "1rem",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)"
                }}>
                  <FiHeart size={18} color="#ec4899" /> Favourites
                </div>
              </Link>
            )}

            {user && (
              <Link to="/dashboard" onClick={() => setMenuOpen(false)} style={{ textDecoration: "none" }}>
                <div style={{
                  display: "flex", alignItems: "center", gap: "12px",
                  padding: "14px 16px", borderRadius: "12px",
                  color: "white", fontWeight: "600", fontSize: "1rem",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)"
                }}>
                  <FiUser size={18} color="#60a5fa" /> My Dashboard
                </div>
              </Link>
            )}

            {user && (
              <div onClick={handleLogout} style={{
                display: "flex", alignItems: "center", gap: "12px",
                padding: "14px 16px", borderRadius: "12px",
                color: "#ef4444", fontWeight: "600", fontSize: "1rem",
                background: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.15)",
                cursor: "pointer", marginTop: "auto"
              }}>
                <FiLogOut size={18} /> Logout
              </div>
            )}

            {!user && (
              <button onClick={() => { navigate("/login"); setMenuOpen(false); }} style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: "12px",
                padding: "14px 16px", borderRadius: "12px",
                color: "white", fontWeight: "700", fontSize: "1rem",
                background: "linear-gradient(135deg, #a78bfa, #60a5fa)",
                border: "none", cursor: "pointer", marginTop: "8px"
              }}>
                Login
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMenuOpen(false)}
            style={{
              position: "fixed", inset: 0, top: "64px",
              background: "rgba(0,0,0,0.5)",
              zIndex: 998
            }}
          />
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
        }
        @media (min-width: 769px) {
          .desktop-nav { display: flex !important; }
        }
      `}</style>
    </>
  );
}