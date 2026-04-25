import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { adminAPI, carsAPI } from "../../services/api";
import toast from "react-hot-toast";
import {
  FiPlus, FiEdit2, FiTrash2, FiCheck,
  FiX, FiUpload, FiTag
} from "react-icons/fi";

const emptyForm = {
  name: "", price: "", fuel_type: "petrol",
  year: "", km_driven: "", location: "",
  description: "", images: [], is_sold: false
};

export default function AdminCarsPage() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editCar, setEditCar] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const fileRef = useRef();

  useEffect(() => {
    fetchCars();
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchCars = async () => {
    try {
      const res = await carsAPI.getAll();
      setCars(res.data.results || res.data);
    } catch {
      toast.error("Error loading cars");
    } finally {
      setLoading(false);
    }
  };

  const openAdd = () => {
    setEditCar(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (car) => {
    setEditCar(car);
    setForm({
      name: car.name, price: car.price,
      fuel_type: car.fuel_type, year: car.year,
      km_driven: car.km_driven, location: car.location,
      description: car.description || "",
      images: car.images || [], is_sold: car.is_sold
    });
    setShowModal(true);
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true);
    try {
      const uploadedUrls = [];
      for (const file of files) {
        const formData = new FormData();
        formData.append("image", file);
        const res = await fetch(
          `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`,
          { method: "POST", body: formData }
        );
        const json = await res.json();
        if (json.success) {
          uploadedUrls.push(json.data.url);
        } else {
          toast.error(`Failed to upload: ${file.name}`);
        }
      }
      if (uploadedUrls.length > 0) {
        setForm(prev => ({ ...prev, images: [...prev.images, ...uploadedUrls] }));
        toast.success(`${uploadedUrls.length} image(s) uploaded! ✅`);
      }
    } catch {
      toast.error("Image upload failed!");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (idx) => {
    setForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== idx)
    }));
  };

  const handleSave = async () => {
    if (!form.name || !form.price || !form.year || !form.km_driven || !form.location) {
      toast.error("All fields required!");
      return;
    }
    setSaving(true);
    try {
      if (editCar) {
        await adminAPI.updateCar(editCar.id, form);
        toast.success("Car updated! ✅");
      } else {
        await adminAPI.createCar(form);
        toast.success("Car added! 🚗");
      }
      setShowModal(false);
      fetchCars();
    } catch {
      toast.error("Error saving car!");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this car?")) return;
    try {
      await adminAPI.deleteCar(id);
      toast.success("Car deleted!");
      fetchCars();
    } catch {
      toast.error("Error deleting car!");
    }
  };

  const handleMarkSold = async (id) => {
    try {
      const res = await adminAPI.markSold(id);
      toast.success(res.data.message);
      fetchCars();
    } catch {
      toast.error("Error!");
    }
  };

  /* ── Action Buttons (reused in both table & card) ── */
  const ActionButtons = ({ car }) => (
    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
      <button
        onClick={() => handleMarkSold(car.id)}
        title={car.is_sold ? "Mark Available" : "Mark Sold"}
        style={{
          background: car.is_sold ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.2)",
          border: "none", borderRadius: "8px",
          color: car.is_sold ? "#10b981" : "#ef4444",
          padding: "8px 10px", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center"
        }}
      >
        <FiTag size={15} />
      </button>
      <button
        onClick={() => openEdit(car)}
        style={{
          background: "rgba(96,165,250,0.2)", border: "none",
          borderRadius: "8px", color: "#60a5fa",
          padding: "8px 10px", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center"
        }}
      >
        <FiEdit2 size={15} />
      </button>
      <button
        onClick={() => handleDelete(car.id)}
        style={{
          background: "rgba(239,68,68,0.2)", border: "none",
          borderRadius: "8px", color: "#ef4444",
          padding: "8px 10px", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center"
        }}
      >
        <FiTrash2 size={15} />
      </button>
    </div>
  );

  return (
    <div>
      {/* Header */}
      <div style={{
        display: "flex", justifyContent: "space-between",
        alignItems: isMobile ? "flex-start" : "center",
        marginBottom: "24px",
        flexDirection: isMobile ? "row" : "row",
        gap: "12px"
      }}>
        <h2 style={{
          color: "white",
          fontSize: isMobile ? "1.2rem" : "1.5rem",
          fontWeight: "800"
        }}>
          🚗 Car Management
        </h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={openAdd}
          style={{
            background: "linear-gradient(135deg, #a78bfa, #60a5fa)",
            border: "none", borderRadius: "12px",
            color: "white",
            padding: isMobile ? "10px 14px" : "12px 20px",
            cursor: "pointer", fontWeight: "700",
            display: "flex", alignItems: "center", gap: "8px",
            fontSize: isMobile ? "0.85rem" : "0.95rem",
            whiteSpace: "nowrap", flexShrink: 0
          }}
        >
          <FiPlus /> Add Car
        </motion.button>
      </div>

      {/* Loading */}
      {loading ? (
        <div style={{ color: "rgba(255,255,255,0.5)", textAlign: "center", padding: "60px" }}>
          Loading...
        </div>
      ) : cars.length === 0 ? (
        <div style={{
          textAlign: "center", padding: "60px",
          color: "rgba(255,255,255,0.4)",
          background: "rgba(255,255,255,0.06)",
          borderRadius: "16px",
          border: "1px solid rgba(255,255,255,0.1)"
        }}>
          No cars added yet. Click "Add Car" to start!
        </div>
      ) : isMobile ? (

        /* ── MOBILE: Card Layout ── */
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {cars.map((car) => (
            <div key={car.id} style={{
              background: "rgba(255,255,255,0.06)",
              borderRadius: "16px",
              border: "1px solid rgba(255,255,255,0.1)",
              padding: "14px",
              display: "flex", flexDirection: "column", gap: "12px"
            }}>
              {/* Top row: image + info */}
              <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                <img
                  src={car.images?.[0] || "https://placehold.co/70x50?text=No+Img"}
                  alt=""
                  style={{
                    width: "70px", height: "52px",
                    objectFit: "cover", borderRadius: "10px",
                    flexShrink: 0
                  }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    color: "white", fontWeight: "700",
                    fontSize: "1rem", marginBottom: "4px"
                  }}>
                    {car.name}
                  </div>
                  <div style={{ color: "#a78bfa", fontWeight: "700", fontSize: "0.95rem" }}>
                    ₹{Number(car.price).toLocaleString("en-IN")}
                  </div>
                </div>
                {/* Status badge top right */}
                <span style={{
                  background: car.is_sold ? "rgba(239,68,68,0.2)" : "rgba(16,185,129,0.2)",
                  color: car.is_sold ? "#ef4444" : "#10b981",
                  padding: "4px 10px", borderRadius: "20px",
                  fontSize: "0.75rem", fontWeight: "600",
                  flexShrink: 0
                }}>
                  {car.is_sold ? "SOLD" : "Available"}
                </span>
              </div>

              {/* Meta row: year + fuel */}
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.85rem" }}>
                  📅 {car.year}
                </span>
                <span style={{
                  background: "rgba(167,139,250,0.2)",
                  color: "#a78bfa", padding: "3px 10px",
                  borderRadius: "20px", fontSize: "0.78rem", fontWeight: "600"
                }}>
                  {car.fuel_type}
                </span>
                <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.82rem" }}>
                  🛣 {Number(car.km_driven).toLocaleString("en-IN")} km
                </span>
              </div>

              {/* Actions row */}
              <div style={{
                borderTop: "1px solid rgba(255,255,255,0.08)",
                paddingTop: "10px",
                display: "flex", alignItems: "center",
                justifyContent: "space-between"
              }}>
                <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.78rem" }}>
                  Actions
                </span>
                <ActionButtons car={car} />
              </div>
            </div>
          ))}
        </div>

      ) : (

        /* ── DESKTOP: Table Layout ── */
        <div style={{
          background: "rgba(255,255,255,0.06)",
          borderRadius: "16px",
          border: "1px solid rgba(255,255,255,0.1)",
          overflow: "hidden"
        }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "rgba(255,255,255,0.05)" }}>
                {["Image", "Name", "Price", "Year", "Fuel", "Status", "Actions"].map(h => (
                  <th key={h} style={{
                    color: "rgba(255,255,255,0.6)", padding: "14px 16px",
                    textAlign: "left", fontSize: "0.85rem", fontWeight: "600"
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cars.map((car, i) => (
                <tr key={car.id} style={{
                  borderTop: "1px solid rgba(255,255,255,0.05)",
                  background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.02)"
                }}>
                  <td style={{ padding: "12px 16px" }}>
                    <img
                      src={car.images?.[0] || "https://placehold.co/60x40?text=No+Img"}
                      alt=""
                      style={{ width: "60px", height: "40px", objectFit: "cover", borderRadius: "8px" }}
                    />
                  </td>
                  <td style={{ padding: "12px 16px", color: "white", fontWeight: "600" }}>
                    {car.name}
                  </td>
                  <td style={{ padding: "12px 16px", color: "#a78bfa", fontWeight: "700" }}>
                    ₹{Number(car.price).toLocaleString("en-IN")}
                  </td>
                  <td style={{ padding: "12px 16px", color: "rgba(255,255,255,0.7)" }}>
                    {car.year}
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{
                      background: "rgba(167,139,250,0.2)",
                      color: "#a78bfa", padding: "4px 10px",
                      borderRadius: "20px", fontSize: "0.8rem", fontWeight: "600"
                    }}>
                      {car.fuel_type}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{
                      background: car.is_sold ? "rgba(239,68,68,0.2)" : "rgba(16,185,129,0.2)",
                      color: car.is_sold ? "#ef4444" : "#10b981",
                      padding: "4px 10px", borderRadius: "20px",
                      fontSize: "0.8rem", fontWeight: "600"
                    }}>
                      {car.is_sold ? "SOLD" : "Available"}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <ActionButtons car={car} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed", inset: 0, zIndex: 1000,
              background: "rgba(0,0,0,0.7)",
              display: "flex", alignItems: "center",
              justifyContent: "center", padding: "20px"
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{
                background: "linear-gradient(135deg, #1a1a2e, #16213e)",
                borderRadius: "20px",
                border: "1px solid rgba(255,255,255,0.15)",
                padding: isMobile ? "20px 16px" : "32px",
                width: "100%", maxWidth: "600px",
                maxHeight: "85vh", overflowY: "auto"
              }}
            >
              {/* Modal Header */}
              <div style={{
                display: "flex", justifyContent: "space-between",
                alignItems: "center", marginBottom: "24px"
              }}>
                <h3 style={{ color: "white", fontSize: "1.3rem", fontWeight: "700" }}>
                  {editCar ? "✏️ Edit Car" : "➕ Add New Car"}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  style={{
                    background: "rgba(255,255,255,0.1)", border: "none",
                    color: "white", cursor: "pointer",
                    width: "32px", height: "32px", borderRadius: "8px",
                    display: "flex", alignItems: "center", justifyContent: "center"
                  }}
                >
                  <FiX />
                </button>
              </div>

              {/* Text Fields */}
              {[
                { label: "Car Name *", key: "name", type: "text", placeholder: "e.g. Maruti Swift VXI" },
                { label: "Price (₹) *", key: "price", type: "number", placeholder: "e.g. 450000" },
                { label: "Year *", key: "year", type: "number", placeholder: "e.g. 2020" },
                { label: "KM Driven *", key: "km_driven", type: "number", placeholder: "e.g. 45000" },
                { label: "Location *", key: "location", type: "text", placeholder: "e.g. Arni, Tamil Nadu" },
              ].map(field => (
                <div key={field.key} style={{ marginBottom: "16px" }}>
                  <label style={{
                    color: "rgba(255,255,255,0.7)", fontSize: "0.85rem",
                    marginBottom: "6px", display: "block"
                  }}>
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    value={form[field.key]}
                    onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                    placeholder={field.placeholder}
                    style={{
                      width: "100%", padding: "12px 14px",
                      background: "rgba(255,255,255,0.08)",
                      border: "1px solid rgba(255,255,255,0.15)",
                      borderRadius: "10px", color: "white",
                      fontSize: "0.95rem", outline: "none",
                      boxSizing: "border-box"
                    }}
                  />
                </div>
              ))}

              {/* Fuel Type */}
              <div style={{ marginBottom: "16px" }}>
                <label style={{
                  color: "rgba(255,255,255,0.7)", fontSize: "0.85rem",
                  marginBottom: "6px", display: "block"
                }}>
                  Fuel Type
                </label>
                <select
                  value={form.fuel_type}
                  onChange={e => setForm({ ...form, fuel_type: e.target.value })}
                  style={{
                    width: "100%", padding: "12px 14px",
                    background: "#1a1a2e",
                    border: "1px solid rgba(255,255,255,0.15)",
                    borderRadius: "10px", color: "white",
                    fontSize: "0.95rem", outline: "none"
                  }}
                >
                  {["petrol", "diesel", "electric", "hybrid", "cng"].map(f => (
                    <option key={f} value={f} style={{ background: "#1a1a2e" }}>
                      {f.charAt(0).toUpperCase() + f.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div style={{ marginBottom: "16px" }}>
                <label style={{
                  color: "rgba(255,255,255,0.7)", fontSize: "0.85rem",
                  marginBottom: "6px", display: "block"
                }}>
                  Description (Optional)
                </label>
                <textarea
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="Car description, features, condition..."
                  rows={3}
                  style={{
                    width: "100%", padding: "12px 14px",
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    borderRadius: "10px", color: "white",
                    fontSize: "0.95rem", outline: "none",
                    resize: "vertical", boxSizing: "border-box"
                  }}
                />
              </div>

              {/* Image Upload */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{
                  color: "rgba(255,255,255,0.7)", fontSize: "0.85rem",
                  marginBottom: "6px", display: "block"
                }}>
                  Images (ImgBB Upload)
                </label>
                <input
                  type="file" ref={fileRef} multiple accept="image/*"
                  onChange={handleImageUpload} style={{ display: "none" }}
                />
                <button
                  onClick={() => fileRef.current.click()}
                  disabled={uploading}
                  style={{
                    width: "100%", padding: "16px",
                    background: "rgba(255,255,255,0.05)",
                    border: "2px dashed rgba(167,139,250,0.4)",
                    borderRadius: "12px", color: "rgba(255,255,255,0.6)",
                    cursor: uploading ? "not-allowed" : "pointer",
                    display: "flex", alignItems: "center",
                    justifyContent: "center", gap: "8px",
                    fontSize: "0.95rem"
                  }}
                >
                  <FiUpload />
                  {uploading ? "⏳ Uploading to ImgBB..." : "📸 Click to upload images"}
                </button>

                {uploading && (
                  <div style={{
                    marginTop: "8px", padding: "8px 12px",
                    background: "rgba(167,139,250,0.1)",
                    borderRadius: "8px",
                    color: "#a78bfa", fontSize: "0.85rem", textAlign: "center"
                  }}>
                    Uploading to ImgBB... Please wait ⏳
                  </div>
                )}

                {form.images.length > 0 && (
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "12px" }}>
                    {form.images.map((url, idx) => (
                      <div key={idx} style={{ position: "relative" }}>
                        <img src={url} alt="" style={{
                          width: "80px", height: "60px",
                          objectFit: "cover", borderRadius: "8px",
                          border: "2px solid rgba(167,139,250,0.3)"
                        }} />
                        <button onClick={() => removeImage(idx)} style={{
                          position: "absolute", top: "-6px", right: "-6px",
                          background: "#ef4444", border: "none",
                          borderRadius: "50%", color: "white",
                          width: "20px", height: "20px",
                          cursor: "pointer", fontSize: "10px",
                          display: "flex", alignItems: "center", justifyContent: "center"
                        }}>
                          <FiX size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Save Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSave}
                disabled={saving || uploading}
                style={{
                  width: "100%", padding: "14px",
                  background: (saving || uploading)
                    ? "rgba(255,255,255,0.1)"
                    : "linear-gradient(135deg, #a78bfa, #60a5fa)",
                  border: "none", borderRadius: "12px",
                  color: "white", fontWeight: "700",
                  cursor: (saving || uploading) ? "not-allowed" : "pointer",
                  fontSize: "1rem", display: "flex",
                  alignItems: "center", justifyContent: "center", gap: "8px"
                }}
              >
                <FiCheck />
                {saving ? "Saving..." : editCar ? "Update Car" : "Add Car"}
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}