import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { carsAPI } from "../services/api";
import toast from "react-hot-toast";
import {
  FiSearch, FiHeart, FiPhone, FiMessageCircle,
  FiMapPin, FiCalendar, FiActivity, FiChevronLeft, FiChevronRight
} from "react-icons/fi";

const FUEL_FILTERS = ["all", "Petrol", "Diesel", "CNG", "Electric", "Hybrid"];

function CarCard({ car, navigate }) {
  const { user, isFavourite, toggleFavourite } = useAuth();
  const [currentImage, setCurrentImage] = useState(0);

  const handleWhatsApp = (e) => {
    e.stopPropagation();
    const msg = `Hi! I'm interested in ${car.name} (${car.year}) priced at ₹${Number(car.price).toLocaleString("en-IN")}`;
    window.open(`https://wa.me/917339284804?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const handleCall = (e) => {
    e.stopPropagation();
    window.location.href = "tel:7339284804";
  };

  const prevImg = (e) => {
    e.stopPropagation();
    setCurrentImage(p => p === 0 ? (car.images?.length - 1 || 0) : p - 1);
  };

  const nextImg = (e) => {
    e.stopPropagation();
    setCurrentImage(p => p === (car.images?.length - 1 || 0) ? 0 : p + 1);
  };

  const handleFavourite = async (e) => {
    e.stopPropagation();
    if (!user) { toast.error("Login பண்ணணும்!"); return; }
    try {
      const wasFav = isFavourite(car.id);
      await toggleFavourite(car.id);
      toast.success(wasFav ? "Removed from favourites" : "Added to favourites ❤️");
    } catch {
      toast.error("Error occurred!");
    }
  };

  const fav = isFavourite(car.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      onClick={() => navigate(`/car/${car.id}`)}
      style={{
        background: "rgba(255,255,255,0.08)",
        backdropFilter: "blur(20px)",
        borderRadius: "20px",
        border: "1px solid rgba(255,255,255,0.15)",
        overflow: "hidden", cursor: "pointer",
        transition: "all 0.3s ease"
      }}
    >
      <div style={{ position: "relative", height: "200px", background: "#1a1a2e" }}>
        <img
          src={car.images?.[currentImage] || "https://via.placeholder.com/400x200?text=No+Image"}
          alt={car.name}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        {car.is_sold && (
          <div style={{
            position: "absolute", top: "12px", left: "12px",
            background: "linear-gradient(135deg, #ef4444, #dc2626)",
            color: "white", padding: "4px 12px",
            borderRadius: "20px", fontWeight: "700", fontSize: "0.8rem"
          }}>SOLD</div>
        )}
        <button onClick={handleFavourite} style={{
          position: "absolute", top: "12px", right: "12px",
          background: fav ? "rgba(236,72,153,0.9)" : "rgba(0,0,0,0.5)",
          border: "none", borderRadius: "50%",
          width: "36px", height: "36px",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", color: "white", transition: "background 0.3s ease"
        }}>
          <FiHeart fill={fav ? "white" : "none"} size={16} />
        </button>
        {car.images?.length > 1 && (
          <>
            <button onClick={prevImg} style={{
              position: "absolute", left: "8px", top: "50%", transform: "translateY(-50%)",
              background: "rgba(0,0,0,0.5)", border: "none", color: "white",
              width: "28px", height: "28px", borderRadius: "50%", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center"
            }}><FiChevronLeft size={14} /></button>
            <button onClick={nextImg} style={{
              position: "absolute", right: "8px", top: "50%", transform: "translateY(-50%)",
              background: "rgba(0,0,0,0.5)", border: "none", color: "white",
              width: "28px", height: "28px", borderRadius: "50%", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center"
            }}><FiChevronRight size={14} /></button>
            <div style={{
              position: "absolute", bottom: "8px", left: "50%",
              transform: "translateX(-50%)", display: "flex", gap: "4px"
            }}>
              {car.images.map((_, i) => (
                <div key={i} style={{
                  width: i === currentImage ? "16px" : "6px", height: "6px",
                  borderRadius: "3px",
                  background: i === currentImage ? "white" : "rgba(255,255,255,0.5)",
                  transition: "all 0.3s"
                }} />
              ))}
            </div>
          </>
        )}
      </div>

      <div style={{ padding: "16px" }}>
        <h3 style={{ color: "white", fontWeight: "700", fontSize: "1.05rem", margin: "0 0 8px 0" }}>
          {car.name}
        </h3>
        <div style={{
          fontSize: "1.3rem", fontWeight: "800",
          background: "linear-gradient(135deg, #a78bfa, #60a5fa)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          marginBottom: "12px"
        }}>
          ₹{Number(car.price).toLocaleString("en-IN")}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "14px" }}>
          {[
            { icon: <FiCalendar size={12} />, text: car.year },
            { icon: <FiActivity size={12} />, text: `${Number(car.km_driven).toLocaleString()} km` },
            { icon: <FiActivity size={12} />, text: car.fuel_type?.toUpperCase() },
            { icon: <FiMapPin size={12} />, text: car.location },
          ].map((spec, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: "4px",
              color: "rgba(255,255,255,0.6)", fontSize: "0.8rem"
            }}>
              <span style={{ color: "#a78bfa" }}>{spec.icon}</span>{spec.text}
            </div>
          ))}
        </div>
        {!car.is_sold ? (
          <div style={{ display: "flex", gap: "8px" }}>
            <button onClick={handleCall} style={{
              flex: 1, padding: "10px",
              background: "linear-gradient(135deg, #10b981, #059669)",
              border: "none", borderRadius: "10px", color: "white",
              cursor: "pointer", fontWeight: "600", fontSize: "0.85rem",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "6px"
            }}><FiPhone size={14} /> Call</button>
            <button onClick={handleWhatsApp} style={{
              flex: 1, padding: "10px",
              background: "linear-gradient(135deg, #25D366, #128C7E)",
              border: "none", borderRadius: "10px", color: "white",
              cursor: "pointer", fontWeight: "600", fontSize: "0.85rem",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "6px"
            }}><FiMessageCircle size={14} /> WhatsApp</button>
          </div>
        ) : (
          <div style={{
            textAlign: "center", padding: "10px",
            background: "rgba(239,68,68,0.15)",
            borderRadius: "10px", color: "#ef4444", fontWeight: "700"
          }}>This car is SOLD</div>
        )}
      </div>
    </motion.div>
  );
}

export default function HomePage() {
  const navigate = useNavigate();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [fuelFilter, setFuelFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => { fetchCars(); }, [search, fuelFilter, page]);

  const fetchCars = async () => {
    setLoading(true);
    try {
      const params = { page };
      if (search) params.search = search;
      if (fuelFilter !== "all") params.fuel_type = fuelFilter.toLowerCase();
      const res = await carsAPI.getAll(params);
      const data = res.data;
      setCars(data.results || data);
      if (data.count) setTotalPages(Math.ceil(data.count / 12));
    } catch {
      toast.error("Error loading cars");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .home-hero-title { font-size: 2.5rem; }
        .home-hero-sub { font-size: 1.1rem; }
        .home-cars-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 24px;
        }
        .home-fuel-btn { padding: 8px 20px; font-size: 0.85rem; }

        @media (max-width: 480px) {
          .home-hero-title { font-size: 1.8rem !important; }
          .home-hero-sub { font-size: 0.88rem !important; }
          .home-cars-grid {
            grid-template-columns: 1fr !important;
            gap: 14px !important;
          }
          .home-fuel-btn { padding: 6px 12px !important; font-size: 0.78rem !important; }
          .home-pagination { flex-wrap: wrap; gap: 8px !important; }
          .home-pagination button, .home-pagination span {
            padding: 8px 12px !important; font-size: 0.82rem !important;
          }
        }

        @media (min-width: 481px) and (max-width: 768px) {
          .home-hero-title { font-size: 2rem !important; }
          .home-cars-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 16px !important;
          }
        }

        @media (min-width: 769px) and (max-width: 1024px) {
          .home-cars-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>

      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
        paddingTop: "80px", paddingBottom: "60px"
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 16px" }}>

          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ textAlign: "center", marginBottom: "32px", paddingTop: "20px" }}
          >
            <h1 className="home-hero-title" style={{
              fontWeight: "900", color: "white",
              marginBottom: "12px", lineHeight: "1.2"
            }}>
              Find Your{" "}
              <span style={{
                background: "linear-gradient(135deg, #a78bfa, #60a5fa)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
              }}>
                Perfect Drive
              </span>
            </h1>
            <p className="home-hero-sub" style={{
              color: "rgba(255,255,255,0.6)",
              maxWidth: "480px", margin: "0 auto", lineHeight: "1.6"
            }}>
              Welcome To carkart — Your Trusted Destination for Quality Used Cars in ARNI, Tamil Nadu
            </p>
          </motion.div>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{ marginBottom: "20px", position: "relative" }}
          >
            <FiSearch style={{
              position: "absolute", left: "16px", top: "50%",
              transform: "translateY(-50%)", color: "rgba(255,255,255,0.4)", fontSize: "1.1rem"
            }} />
            <input
              type="text"
              placeholder="Search cars by name..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              style={{
                width: "100%", padding: "14px 14px 14px 48px",
                background: "rgba(255,255,255,0.08)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: "16px", color: "white",
                fontSize: "1rem", outline: "none", boxSizing: "border-box"
              }}
            />
          </motion.div>

          {/* Fuel Filters */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "28px" }}
          >
            {FUEL_FILTERS.map(fuel => (
              <button
                key={fuel}
                className="home-fuel-btn"
                onClick={() => { setFuelFilter(fuel); setPage(1); }}
                style={{
                  borderRadius: "20px", border: "1px solid",
                  borderColor: fuelFilter === fuel ? "transparent" : "rgba(255,255,255,0.2)",
                  background: fuelFilter === fuel
                    ? "linear-gradient(135deg, #a78bfa, #60a5fa)"
                    : "rgba(255,255,255,0.05)",
                  color: fuelFilter === fuel ? "white" : "rgba(255,255,255,0.6)",
                  cursor: "pointer", fontWeight: "600", transition: "all 0.2s"
                }}
              >
                {fuel.charAt(0).toUpperCase() + fuel.slice(1)}
              </button>
            ))}
          </motion.div>

          {/* Cars Grid */}
          {loading ? (
            <div className="home-cars-grid">
              {[...Array(6)].map((_, i) => (
                <div key={i} style={{
                  height: "380px", borderRadius: "20px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)"
                }} />
              ))}
            </div>
          ) : cars.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 20px", color: "rgba(255,255,255,0.4)" }}>
              <div style={{ fontSize: "4rem", marginBottom: "16px" }}>🚗</div>
              <p style={{ fontSize: "1.2rem" }}>No cars found!</p>
            </div>
          ) : (
            <div className="home-cars-grid">
              {cars.map(car => <CarCard key={car.id} car={car} navigate={navigate} />)}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="home-pagination" style={{
              display: "flex", justifyContent: "center",
              gap: "12px", marginTop: "40px"
            }}>
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                style={{
                  padding: "10px 20px",
                  background: page === 1 ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  borderRadius: "10px", color: "white",
                  cursor: page === 1 ? "not-allowed" : "pointer",
                  opacity: page === 1 ? 0.5 : 1
                }}
              >Previous</button>
              <span style={{ padding: "10px 20px", color: "rgba(255,255,255,0.7)" }}>
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                style={{
                  padding: "10px 20px",
                  background: page === totalPages ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  borderRadius: "10px", color: "white",
                  cursor: page === totalPages ? "not-allowed" : "pointer",
                  opacity: page === totalPages ? 0.5 : 1
                }}
              >Next</button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}