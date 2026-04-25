import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { FiHeart, FiUser, FiPhone, FiLogOut, FiTrash2 } from "react-icons/fi";

export default function DashboardPage() {
  const { user, logout, favourites, toggleFavourite } = useAuth(); // ✅ global
  const navigate = useNavigate();

  // ✅ No local state, no fetchFavourites — AuthContext handles everything

  const handleRemoveFavourite = async (carId) => {
    try {
      await toggleFavourite(carId); // ✅ global toggle — HomePage, CarDetailPage ellam sync aagum
      toast.success("Removed from favourites");
    } catch {
      toast.error("Error occurred");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    toast.success("Logged out successfully!");
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
      paddingTop: "80px", paddingBottom: "40px"
    }}>
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "0 20px" }}>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: "rgba(255,255,255,0.08)",
            backdropFilter: "blur(20px)",
            borderRadius: "20px",
            border: "1px solid rgba(255,255,255,0.15)",
            padding: "32px", marginBottom: "30px"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
              <div style={{
                width: "70px", height: "70px", borderRadius: "50%",
                background: "linear-gradient(135deg, #a78bfa, #60a5fa)",
                display: "flex", alignItems: "center", justifyContent: "center"
              }}>
                <FiUser size={32} color="white" />
              </div>
              <div>
                <h2 style={{ color: "white", fontSize: "1.5rem", fontWeight: "700" }}>
                  {user?.name}
                </h2>
                <div style={{
                  color: "rgba(255,255,255,0.6)",
                  display: "flex", alignItems: "center", gap: "6px", marginTop: "4px"
                }}>
                  <FiPhone size={14} /> {user?.phone_number}
                </div>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              style={{
                background: "linear-gradient(135deg, #ef4444, #dc2626)",
                border: "none", borderRadius: "12px",
                color: "white", padding: "10px 20px",
                cursor: "pointer", fontWeight: "600",
                display: "flex", alignItems: "center", gap: "8px"
              }}
            >
              <FiLogOut /> Logout
            </motion.button>
          </div>
        </motion.div>

        {/* Favourites Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h3 style={{
            color: "white", fontSize: "1.3rem",
            fontWeight: "700", marginBottom: "20px",
            display: "flex", alignItems: "center", gap: "8px"
          }}>
            <FiHeart color="#ec4899" /> My Favourites ({favourites.length})
          </h3>

          {favourites.length === 0 ? (
            <div style={{
              background: "rgba(255,255,255,0.05)",
              borderRadius: "20px", padding: "60px",
              textAlign: "center",
              border: "1px solid rgba(255,255,255,0.1)"
            }}>
              <FiHeart size={48} color="rgba(255,255,255,0.2)" style={{ marginBottom: "16px" }} />
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "1.1rem" }}>
                No favourites yet! Browse cars and add some ❤️
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => navigate("/")}
                style={{
                  marginTop: "20px",
                  background: "linear-gradient(135deg, #a78bfa, #60a5fa)",
                  border: "none", borderRadius: "12px",
                  color: "white", padding: "12px 24px",
                  cursor: "pointer", fontWeight: "600"
                }}
              >
                Browse Cars
              </motion.button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {favourites.map((fav, i) => (
                <motion.div
                  key={fav.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    backdropFilter: "blur(20px)",
                    borderRadius: "16px",
                    border: "1px solid rgba(255,255,255,0.15)",
                    padding: "16px",
                    display: "flex", alignItems: "center", gap: "16px"
                  }}
                >
                  <img
                    src={fav.car.images?.[0] || "https://via.placeholder.com/100x70?text=Car"}
                    alt={fav.car.name}
                    style={{
                      width: "100px", height: "70px",
                      objectFit: "cover", borderRadius: "10px", flexShrink: 0
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ color: "white", fontWeight: "700", fontSize: "1rem" }}>
                      {fav.car.name}
                    </div>
                    <div style={{
                      color: "#a78bfa", fontWeight: "700",
                      fontSize: "1.1rem", marginTop: "4px"
                    }}>
                      ₹{Number(fav.car.price).toLocaleString("en-IN")}
                    </div>
                    <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.85rem", marginTop: "4px" }}>
                      {fav.car.year} • {fav.car.fuel_type} • {fav.car.km_driven?.toLocaleString()} km
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      onClick={() => navigate(`/car/${fav.car.id}`)}
                      style={{
                        background: "rgba(255,255,255,0.1)",
                        border: "1px solid rgba(255,255,255,0.2)",
                        borderRadius: "10px", color: "white",
                        padding: "8px 16px", cursor: "pointer", fontSize: "0.85rem"
                      }}
                    >
                      View
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      onClick={() => handleRemoveFavourite(fav.car.id)}
                      style={{
                        background: "rgba(239,68,68,0.2)",
                        border: "1px solid rgba(239,68,68,0.3)",
                        borderRadius: "10px", color: "#ef4444",
                        padding: "8px 12px", cursor: "pointer"
                      }}
                    >
                      <FiTrash2 />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}