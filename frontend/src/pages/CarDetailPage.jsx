import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { carsAPI } from "../services/api";
import toast from "react-hot-toast";
import {
  FiHeart, FiPhone, FiMessageCircle, FiMapPin,
  FiCalendar, FiActivity, FiChevronLeft, FiChevronRight
} from "react-icons/fi";

export default function CarDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isFavourite, toggleFavourite } = useAuth();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => { fetchCar(); }, [id]);

  const fetchCar = async () => {
    try {
      const res = await carsAPI.getById(id);
      setCar(res.data);
    } catch {
      toast.error("Car not found!");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const handleFavourite = async () => {
    if (!user) { toast.error("Login பண்ணணும்!"); navigate("/login"); return; }
    try {
      const wasFav = isFavourite(car.id);
      await toggleFavourite(car.id);
      toast.success(wasFav ? "Removed from favourites" : "Added to favourites ❤️");
    } catch {
      toast.error("Error occurred!");
    }
  };

  const handleCall = () => { window.location.href = "tel:7339284804"; };

  const handleWhatsApp = () => {
    const msg = `Hi! I'm interested in ${car.name} (${car.year}) priced at ₹${Number(car.price).toLocaleString("en-IN")}`;
    window.open(`https://wa.me/917339284804?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const prevImage = () => setCurrentImage(p => p === 0 ? car.images.length - 1 : p - 1);
  const nextImage = () => setCurrentImage(p => p === car.images.length - 1 ? 0 : p + 1);

  if (loading) return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
      display: "flex", alignItems: "center", justifyContent: "center"
    }}>
      <div style={{ color: "white", fontSize: "1.5rem" }}>Loading...</div>
    </div>
  );

  if (!car) return null;

  const fav = isFavourite(car.id);

  return (
    <>
      <style>{`
        .detail-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
        }
        .detail-img-height { height: 350px; }
        .detail-title { font-size: 1.8rem; }
        .detail-price { font-size: 2rem; }

        @media (max-width: 768px) {
          .detail-grid {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
          .detail-img-height { height: 250px !important; }
          .detail-title { font-size: 1.4rem !important; }
          .detail-price { font-size: 1.6rem !important; }
          .detail-specs-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 10px !important;
          }
          .detail-spec-card { padding: 10px !important; }
        }

        @media (max-width: 480px) {
          .detail-img-height { height: 220px !important; }
          .detail-title { font-size: 1.2rem !important; }
          .detail-price { font-size: 1.4rem !important; }
          .detail-action-btn { padding: 12px !important; font-size: 0.9rem !important; }
        }
      `}</style>

      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
        paddingTop: "80px", paddingBottom: "40px"
      }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 16px" }}>

          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate("/")}
            style={{
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.2)",
              color: "white", padding: "10px 20px",
              borderRadius: "10px", cursor: "pointer",
              display: "flex", alignItems: "center", gap: "8px",
              marginBottom: "20px", fontSize: "0.95rem"
            }}
          >
            <FiChevronLeft /> Back to Listings
          </motion.button>

          {/* ✅ Responsive 2-col → 1-col */}
          <div className="detail-grid">

            {/* Left: Image Carousel */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              style={{
                background: "rgba(255,255,255,0.08)",
                backdropFilter: "blur(20px)",
                borderRadius: "20px",
                border: "1px solid rgba(255,255,255,0.15)",
                overflow: "hidden", position: "relative"
              }}
            >
              {car.is_sold && (
                <div style={{
                  position: "absolute", top: "16px", left: "16px", zIndex: 10,
                  background: "linear-gradient(135deg, #ef4444, #dc2626)",
                  color: "white", padding: "6px 16px",
                  borderRadius: "20px", fontWeight: "700", fontSize: "0.9rem"
                }}>SOLD</div>
              )}

              <div className="detail-img-height" style={{ position: "relative" }}>
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentImage}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    src={car.images?.length > 0 ? car.images[currentImage] : "https://via.placeholder.com/600x350?text=No+Image"}
                    alt={car.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </AnimatePresence>

                {car.images?.length > 1 && (
                  <>
                    <button onClick={prevImage} style={{
                      position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)",
                      background: "rgba(0,0,0,0.5)", border: "none", color: "white",
                      width: "36px", height: "36px", borderRadius: "50%", cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center"
                    }}><FiChevronLeft size={20} /></button>
                    <button onClick={nextImage} style={{
                      position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)",
                      background: "rgba(0,0,0,0.5)", border: "none", color: "white",
                      width: "36px", height: "36px", borderRadius: "50%", cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center"
                    }}><FiChevronRight size={20} /></button>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              {car.images?.length > 1 && (
                <div style={{ display: "flex", gap: "8px", padding: "10px", overflowX: "auto" }}>
                  {car.images.map((img, idx) => (
                    <img
                      key={idx} src={img} alt=""
                      onClick={() => setCurrentImage(idx)}
                      style={{
                        width: "65px", height: "46px", objectFit: "cover",
                        borderRadius: "8px", cursor: "pointer", flexShrink: 0,
                        border: currentImage === idx ? "2px solid #a78bfa" : "2px solid transparent",
                        opacity: currentImage === idx ? 1 : 0.6
                      }}
                    />
                  ))}
                </div>
              )}
            </motion.div>

            {/* Right: Car Details */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              {/* Title + Price */}
              <div style={{
                background: "rgba(255,255,255,0.08)",
                backdropFilter: "blur(20px)",
                borderRadius: "20px",
                border: "1px solid rgba(255,255,255,0.15)",
                padding: "20px"
              }}>
                <h1 className="detail-title" style={{
                  color: "white", fontWeight: "700", marginBottom: "8px"
                }}>
                  {car.name}
                </h1>
                <div className="detail-price" style={{
                  fontWeight: "800",
                  background: "linear-gradient(135deg, #a78bfa, #60a5fa)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
                }}>
                  ₹{Number(car.price).toLocaleString("en-IN")}
                </div>
              </div>

              {/* Specs Grid */}
              <div style={{
                background: "rgba(255,255,255,0.08)",
                backdropFilter: "blur(20px)",
                borderRadius: "20px",
                border: "1px solid rgba(255,255,255,0.15)",
                padding: "20px"
              }}>
                <h3 style={{ color: "white", marginBottom: "14px", fontSize: "1rem" }}>Car Details</h3>
                <div className="detail-specs-grid" style={{
                  display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px"
                }}>
                  {[
                    { icon: <FiCalendar />, label: "Year", value: car.year },
                    { icon: <FiActivity />, label: "Fuel", value: car.fuel_type?.toUpperCase() },
                    { icon: <FiActivity />, label: "KM Driven", value: `${Number(car.km_driven).toLocaleString()} km` },
                    { icon: <FiMapPin />, label: "Location", value: car.location },
                  ].map((spec, i) => (
                    <div key={i} className="detail-spec-card" style={{
                      background: "rgba(255,255,255,0.05)",
                      borderRadius: "12px", padding: "14px",
                      display: "flex", alignItems: "center", gap: "10px"
                    }}>
                      <span style={{ color: "#a78bfa", fontSize: "1.1rem", flexShrink: 0 }}>{spec.icon}</span>
                      <div>
                        <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.72rem" }}>{spec.label}</div>
                        <div style={{ color: "white", fontWeight: "600", fontSize: "0.9rem" }}>{spec.value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Description */}
              {car.description && (
                <div style={{
                  background: "rgba(255,255,255,0.08)",
                  backdropFilter: "blur(20px)",
                  borderRadius: "20px",
                  border: "1px solid rgba(255,255,255,0.15)",
                  padding: "20px"
                }}>
                  <h3 style={{ color: "white", marginBottom: "10px" }}>Description</h3>
                  <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: "1.7", margin: 0 }}>
                    {car.description}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={handleFavourite}
                  className="detail-action-btn"
                  style={{
                    padding: "14px",
                    background: fav ? "linear-gradient(135deg, #ec4899, #db2777)" : "rgba(255,255,255,0.1)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    borderRadius: "14px", color: "white", cursor: "pointer",
                    fontWeight: "600", display: "flex", alignItems: "center",
                    justifyContent: "center", gap: "8px", fontSize: "1rem",
                    transition: "background 0.3s ease"
                  }}
                >
                  <FiHeart fill={fav ? "white" : "none"} />
                  {fav ? "Remove from Favourites" : "Add to Favourites"}
                </motion.button>

                {!car.is_sold && (
                  <motion.button
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={handleCall}
                    className="detail-action-btn"
                    style={{
                      padding: "14px",
                      background: "linear-gradient(135deg, #10b981, #059669)",
                      border: "none", borderRadius: "14px", color: "white",
                      cursor: "pointer", fontWeight: "600", display: "flex",
                      alignItems: "center", justifyContent: "center", gap: "8px", fontSize: "1rem"
                    }}
                  >
                    <FiPhone /> Call: 7339284804
                  </motion.button>
                )}

                {!car.is_sold && (
                  <motion.button
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={handleWhatsApp}
                    className="detail-action-btn"
                    style={{
                      padding: "14px",
                      background: "linear-gradient(135deg, #25D366, #128C7E)",
                      border: "none", borderRadius: "14px", color: "white",
                      cursor: "pointer", fontWeight: "600", display: "flex",
                      alignItems: "center", justifyContent: "center", gap: "8px", fontSize: "1rem"
                    }}
                  >
                    <FiMessageCircle /> WhatsApp Enquiry
                  </motion.button>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}