import { useNavigate, Outlet, Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  FiHome, FiTruck, FiUsers, FiBarChart2,
  FiLogOut, FiMenu, FiX
} from "react-icons/fi";
import { useState, useEffect } from "react";

const navItems = [
  { path: "/admin/dashboard", label: "Dashboard", icon: <FiHome /> },
  { path: "/admin/cars", label: "Cars", icon: <FiTruck /> },
  { path: "/admin/users", label: "Users", icon: <FiUsers /> },
  { path: "/admin/analytics", label: "Analytics", icon: <FiBarChart2 /> },
];

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setDrawerOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminRefresh");
    toast.success("Admin logged out!");
    navigate("/admin");
  };

  const SidebarContent = ({ onClose }) => (
    <div style={{
      display: "flex", flexDirection: "column", height: "100%"
    }}>
      {/* Header */}
      <div style={{
        padding: "24px 16px",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
        display: "flex", alignItems: "center",
        justifyContent: "space-between"
      }}>
        <div>
          <div style={{ color: "white", fontWeight: "800", fontSize: "1rem" }}>
            🚗 carkart
          </div>
          <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.75rem" }}>
            Admin Panel
          </div>
        </div>
        {isMobile ? (
          <button onClick={onClose} style={{
            background: "none", border: "none",
            color: "white", cursor: "pointer", fontSize: "1.2rem"
          }}>
            <FiX />
          </button>
        ) : (
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{
            background: "none", border: "none",
            color: "white", cursor: "pointer", fontSize: "1.2rem"
          }}>
            {sidebarOpen ? <FiX /> : <FiMenu />}
          </button>
        )}
      </div>

      {/* Nav Items */}
      <div style={{ flex: 1, padding: "16px 8px" }}>
        {navItems.map((item) => (
          <Link key={item.path} to={item.path}
            onClick={() => isMobile && onClose()}
            style={{ textDecoration: "none" }}>
            <div style={{
              display: "flex", alignItems: "center",
              gap: "12px", padding: "12px 16px",
              borderRadius: "12px", marginBottom: "4px",
              background: location.pathname === item.path
                ? "linear-gradient(135deg, rgba(167,139,250,0.3), rgba(96,165,250,0.3))"
                : "transparent",
              border: location.pathname === item.path
                ? "1px solid rgba(167,139,250,0.3)"
                : "1px solid transparent",
              color: location.pathname === item.path
                ? "white" : "rgba(255,255,255,0.5)",
              cursor: "pointer", transition: "all 0.2s"
            }}>
              <span style={{ fontSize: "1.1rem", flexShrink: 0 }}>{item.icon}</span>
              {(sidebarOpen || isMobile) && (
                <span style={{ fontWeight: "600", fontSize: "0.9rem" }}>
                  {item.label}
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>

      {/* Logout */}
      <div style={{ padding: "16px 8px", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
        <button onClick={handleLogout} style={{
          width: "100%", display: "flex",
          alignItems: "center", gap: "12px",
          padding: "12px 16px", borderRadius: "12px",
          background: "rgba(239,68,68,0.15)",
          border: "1px solid rgba(239,68,68,0.2)",
          color: "#ef4444", cursor: "pointer"
        }}>
          <FiLogOut style={{ flexShrink: 0 }} />
          {(sidebarOpen || isMobile) && (
            <span style={{ fontWeight: "600", fontSize: "0.9rem" }}>Logout</span>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
      display: "flex"
    }}>

      {/* ── DESKTOP Sidebar ── */}
      {!isMobile && (
        <motion.div
          initial={{ x: -250 }}
          animate={{ x: 0 }}
          style={{
            width: sidebarOpen ? "250px" : "70px",
            background: "rgba(255,255,255,0.06)",
            backdropFilter: "blur(20px)",
            borderRight: "1px solid rgba(255,255,255,0.1)",
            transition: "width 0.3s ease",
            flexShrink: 0, minHeight: "100vh"
          }}
        >
          <SidebarContent onClose={() => {}} />
        </motion.div>
      )}

      {/* ── MOBILE Top Bar ── */}
      {isMobile && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0,
          height: "56px", zIndex: 1000,
          background: "rgba(15,12,41,0.97)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          display: "flex", alignItems: "center",
          justifyContent: "space-between",
          padding: "0 16px"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "1.3rem" }}>🚗</span>
            <div>
              <div style={{ color: "white", fontWeight: "800", fontSize: "0.9rem", lineHeight: 1.1 }}>
                carkart
              </div>
              <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.6rem" }}>Admin Panel</div>
            </div>
          </div>
          <button
            onClick={() => setDrawerOpen(true)}
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: "10px", color: "white",
              width: "38px", height: "38px",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer"
            }}
          >
            <FiMenu size={18} />
          </button>
        </div>
      )}

      {/* ── MOBILE Drawer Overlay ── */}
      <AnimatePresence>
        {isMobile && drawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
              style={{
                position: "fixed", inset: 0,
                background: "rgba(0,0,0,0.55)",
                zIndex: 1001
              }}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.25 }}
              style={{
                position: "fixed", top: 0, left: 0,
                width: "260px", height: "100vh",
                background: "rgba(15,12,41,0.98)",
                backdropFilter: "blur(20px)",
                borderRight: "1px solid rgba(255,255,255,0.1)",
                zIndex: 1002
              }}
            >
              <SidebarContent onClose={() => setDrawerOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Main Content ── */}
      <div style={{
        flex: 1,
        overflow: "auto",
        padding: isMobile ? "72px 16px 80px" : "30px",
        minWidth: 0
      }}>
        <Outlet />
      </div>

      {/* ── MOBILE Bottom Nav ── */}
      {isMobile && (
        <div style={{
          position: "fixed", bottom: 0, left: 0, right: 0,
          height: "60px", zIndex: 1000,
          background: "rgba(15,12,41,0.97)",
          backdropFilter: "blur(20px)",
          borderTop: "1px solid rgba(255,255,255,0.1)",
          display: "flex", alignItems: "center",
          justifyContent: "space-around"
        }}>
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path} style={{ textDecoration: "none" }}>
                <div style={{
                  display: "flex", flexDirection: "column",
                  alignItems: "center", gap: "3px",
                  padding: "6px 14px", borderRadius: "10px",
                  color: active ? "#a78bfa" : "rgba(255,255,255,0.4)",
                  background: active ? "rgba(167,139,250,0.12)" : "transparent",
                  transition: "all 0.2s"
                }}>
                  <span style={{ fontSize: "1.1rem" }}>{item.icon}</span>
                  <span style={{ fontSize: "0.6rem", fontWeight: "600" }}>{item.label}</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}