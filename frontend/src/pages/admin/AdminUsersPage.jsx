import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { FiPhone, FiHeart, FiChevronDown, FiChevronUp } from "react-icons/fi";
import { adminAPI } from "../../services/api";

// 🚗 Car Wheel SVG Component
function CarWheelIcon({ spinning }) {
  return (
    <motion.svg
      width="22" height="22" viewBox="0 0 100 100"
      animate={{ rotate: spinning ? 360 : 0 }}
      transition={spinning
        ? { duration: 0.5, repeat: Infinity, ease: "linear" }
        : { duration: 0.3 }
      }
    >
      {/* Outer tyre */}
      <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="8" />
      {/* Hub */}
      <circle cx="50" cy="50" r="10" fill="currentColor" />
      {/* Spokes */}
      {[0, 60, 120, 180, 240, 300].map((angle) => (
        <line
          key={angle}
          x1="50" y1="50"
          x2={50 + 36 * Math.cos((angle * Math.PI) / 180)}
          y2={50 + 36 * Math.sin((angle * Math.PI) / 180)}
          stroke="currentColor" strokeWidth="6" strokeLinecap="round"
        />
      ))}
    </motion.svg>
  );
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedUser, setExpandedUser] = useState(null);
  const [userFavourites, setUserFavourites] = useState({});
  const [favLoadingIds, setFavLoadingIds] = useState({});
  const [contactedLoadingIds, setContactedLoadingIds] = useState({});

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      const res = await adminAPI.getUsers();
      setUsers(res.data);
    } catch {
      toast.error("Error loading users");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserFavourites = async (userId) => {
    if (userFavourites[userId]) return;
    setFavLoadingIds(prev => ({ ...prev, [userId]: true }));
    try {
      const res = await adminAPI.getUserFavourites(userId);
      setUserFavourites(prev => ({ ...prev, [userId]: res.data }));
    } catch {
      toast.error("Error loading favourites");
    } finally {
      setFavLoadingIds(prev => ({ ...prev, [userId]: false }));
    }
  };

  const handleExpand = (userId) => {
    if (expandedUser === userId) {
      setExpandedUser(null);
    } else {
      setExpandedUser(userId);
      fetchUserFavourites(userId);
    }
  };

  const handleToggleContacted = async (e, userId) => {
    e.stopPropagation(); // row expand aagaama
    setContactedLoadingIds(prev => ({ ...prev, [userId]: true }));
    try {
      const res = await adminAPI.toggleContacted(userId);
      setUsers(prev =>
        prev.map(u => u.id === userId ? { ...u, is_contacted: res.data.is_contacted } : u)
      );
      toast.success(res.data.is_contacted ? "✅ Marked as Contacted!" : "🔴 Marked as Not Contacted");
    } catch {
      toast.error("Error updating status");
    } finally {
      setTimeout(() => {
        setContactedLoadingIds(prev => ({ ...prev, [userId]: false }));
      }, 600);
    }
  };

  return (
    <div>
      <h2 style={{
        color: "white", fontSize: "1.5rem",
        fontWeight: "800", marginBottom: "24px"
      }}>
        👥 User Management
      </h2>

      {loading ? (
        <div style={{ color: "rgba(255,255,255,0.5)", textAlign: "center", padding: "60px" }}>
          Loading...
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {users.map((user, i) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              style={{
                background: "rgba(255,255,255,0.06)",
                borderRadius: "16px",
                border: user.is_contacted
                  ? "1px solid rgba(34,197,94,0.35)"
                  : "1px solid rgba(255,255,255,0.1)",
                overflow: "hidden",
                transition: "border 0.4s ease"
              }}
            >
              {/* User Row */}
              <div
                style={{
                  padding: "20px",
                  display: "flex", alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap", gap: "12px",
                  cursor: "pointer"
                }}
                onClick={() => handleExpand(user.id)}
              >
                {/* Left: Avatar + Info */}
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <div style={{
                    width: "48px", height: "48px", borderRadius: "50%",
                    background: "linear-gradient(135deg, #a78bfa, #60a5fa)",
                    display: "flex", alignItems: "center",
                    justifyContent: "center", flexShrink: 0,
                    fontSize: "1.2rem", fontWeight: "800", color: "white"
                  }}>
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ color: "white", fontWeight: "700", fontSize: "1rem" }}>
                      {user.name}
                    </div>
                    <div style={{
                      color: "rgba(255,255,255,0.5)", fontSize: "0.85rem",
                      display: "flex", alignItems: "center", gap: "4px", marginTop: "4px"
                    }}>
                      <FiPhone size={12} /> {user.phone_number}
                    </div>
                  </div>
                </div>

                {/* Right: Stats + Toggle + Expand */}
                <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>

                  {/* Favourites Count */}
                  <div style={{ textAlign: "center" }}>
                    <div style={{
                      color: "#ec4899", fontWeight: "700", fontSize: "1.3rem",
                      display: "flex", alignItems: "center", gap: "4px"
                    }}>
                      <FiHeart size={16} fill="#ec4899" />
                      {user.favourites_count}
                    </div>
                    <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.75rem" }}>Favourites</div>
                  </div>

                  {/* Login Count */}
                  <div style={{ textAlign: "center" }}>
                    <div style={{ color: "#60a5fa", fontWeight: "700", fontSize: "1.3rem" }}>
                      {user.login_count}
                    </div>
                    <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.75rem" }}>Logins</div>
                  </div>

                  {/* Last Login */}
                  <div style={{ textAlign: "center" }}>
                    <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.85rem", fontWeight: "600" }}>
                      {user.last_login
                        ? new Date(user.last_login).toLocaleDateString("en-IN")
                        : "Never"}
                    </div>
                    <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.75rem" }}>Last Login</div>
                  </div>

                  {/* ✅ Contacted Toggle Button with Car Wheel */}
                  <motion.button
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={(e) => handleToggleContacted(e, user.id)}
                    style={{
                      display: "flex", alignItems: "center", gap: "8px",
                      padding: "8px 16px", borderRadius: "30px", border: "none",
                      cursor: "pointer", fontWeight: "700", fontSize: "0.8rem",
                      background: user.is_contacted
                        ? "linear-gradient(135deg, #16a34a, #22c55e)"
                        : "linear-gradient(135deg, #dc2626, #ef4444)",
                      color: "white",
                      boxShadow: user.is_contacted
                        ? "0 0 14px rgba(34,197,94,0.45)"
                        : "0 0 14px rgba(239,68,68,0.45)",
                      transition: "background 0.4s ease, box-shadow 0.4s ease",
                      whiteSpace: "nowrap"
                    }}
                  >
                    <CarWheelIcon spinning={!!contactedLoadingIds[user.id]} />
                    {user.is_contacted ? "Contacted" : "Not Contacted"}
                  </motion.button>

                  {/* Expand Arrow */}
                  <div style={{ color: "rgba(255,255,255,0.5)" }}>
                    {expandedUser === user.id
                      ? <FiChevronUp size={20} />
                      : <FiChevronDown size={20} />
                    }
                  </div>
                </div>
              </div>

              {/* Expanded Favourites */}
              <AnimatePresence>
                {expandedUser === user.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{
                      borderTop: "1px solid rgba(255,255,255,0.08)",
                      overflow: "hidden"
                    }}
                  >
                    <div style={{ padding: "20px" }}>
                      <h4 style={{
                        color: "rgba(255,255,255,0.7)",
                        marginBottom: "16px", fontSize: "0.9rem",
                        display: "flex", alignItems: "center", gap: "8px"
                      }}>
                        <FiHeart color="#ec4899" size={14} />
                        {user.name}-ன் Favourite Cars
                      </h4>

                      {favLoadingIds[user.id] ? (
                        <div style={{ color: "rgba(255,255,255,0.4)", padding: "20px", textAlign: "center" }}>
                          Loading favourites...
                        </div>
                      ) : userFavourites[user.id]?.length === 0 ? (
                        <div style={{
                          color: "rgba(255,255,255,0.3)", padding: "20px",
                          textAlign: "center", fontSize: "0.9rem"
                        }}>
                          No favourites yet 😔
                        </div>
                      ) : (
                        <div style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                          gap: "12px"
                        }}>
                          {userFavourites[user.id]?.map(fav => (
                            <div key={fav.id} style={{
                              background: "rgba(255,255,255,0.05)",
                              borderRadius: "12px",
                              border: "1px solid rgba(255,255,255,0.08)",
                              overflow: "hidden"
                            }}>
                              <img
                                src={fav.car.images?.[0] || "https://placehold.co/200x120?text=No+Image"}
                                alt={fav.car.name}
                                style={{ width: "100%", height: "120px", objectFit: "cover" }}
                              />
                              <div style={{ padding: "12px" }}>
                                <div style={{
                                  color: "white", fontWeight: "700",
                                  fontSize: "0.9rem", marginBottom: "4px"
                                }}>
                                  {fav.car.name}
                                </div>
                                <div style={{
                                  color: "#a78bfa", fontWeight: "700",
                                  fontSize: "0.95rem", marginBottom: "6px"
                                }}>
                                  ₹{Number(fav.car.price).toLocaleString("en-IN")}
                                </div>
                                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                                  <span style={{
                                    background: "rgba(167,139,250,0.15)",
                                    color: "#a78bfa", padding: "2px 8px",
                                    borderRadius: "10px", fontSize: "0.75rem"
                                  }}>
                                    {fav.car.fuel_type}
                                  </span>
                                  <span style={{
                                    background: "rgba(96,165,250,0.15)",
                                    color: "#60a5fa", padding: "2px 8px",
                                    borderRadius: "10px", fontSize: "0.75rem"
                                  }}>
                                    {fav.car.year}
                                  </span>
                                  {(fav.car.is_sold === true || fav.car.is_sold === "true") && (
                                    <span style={{
                                      background: "rgba(239,68,68,0.15)",
                                      color: "#ef4444", padding: "2px 8px",
                                      borderRadius: "10px", fontSize: "0.75rem"
                                    }}>
                                      SOLD
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}

          {users.length === 0 && (
            <div style={{
              textAlign: "center", padding: "60px",
              color: "rgba(255,255,255,0.4)"
            }}>
              No users registered yet!
            </div>
          )}
        </div>
      )}
    </div>
  );
}