import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { FiTruck, FiUsers, FiTrendingUp, FiCheckCircle } from "react-icons/fi";
import axios from "axios";

export default function AdminAnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchAnalytics(); }, []);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await axios.get("http://localhost:8000/api/analytics/", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setData(res.data);
    } catch {
      toast.error("Error loading analytics");
    } finally {
      setLoading(false);
    }
  };

  const stats = data ? [
    {
      label: "Total Cars", value: data.total_cars,
      icon: <FiTruck />, color: "#a78bfa"
    },
    {
      label: "Cars Sold", value: data.sold_cars,
      icon: <FiCheckCircle />, color: "#ef4444"
    },
    {
      label: "Available", value: data.available_cars,
      icon: <FiTrendingUp />, color: "#10b981"
    },
    {
      label: "Total Users", value: data.total_users,
      icon: <FiUsers />, color: "#60a5fa"
    },
    {
      label: "Monthly Visitors", value: data.monthly_visitors,
      icon: <FiTrendingUp />, color: "#f59e0b"
    },
  ] : [];

  return (
    <div>
      <h2 style={{ color: "white", fontSize: "1.5rem", fontWeight: "800", marginBottom: "24px" }}>
        📊 Analytics
      </h2>

      {loading ? (
        <div style={{ color: "rgba(255,255,255,0.5)", textAlign: "center", padding: "60px" }}>
          Loading...
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "16px", marginBottom: "32px"
          }}>
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                style={{
                  background: "rgba(255,255,255,0.06)",
                  borderRadius: "16px",
                  border: "1px solid rgba(255,255,255,0.1)",
                  padding: "24px", textAlign: "center"
                }}
              >
                <div style={{ fontSize: "2rem", color: stat.color, marginBottom: "8px" }}>
                  {stat.icon}
                </div>
                <div style={{ fontSize: "2.5rem", fontWeight: "800", color: stat.color }}>
                  {stat.value}
                </div>
                <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.85rem", marginTop: "4px" }}>
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Daily Logins Chart */}
          {data?.daily_logins?.length > 0 && (
            <div style={{
              background: "rgba(255,255,255,0.06)",
              borderRadius: "16px",
              border: "1px solid rgba(255,255,255,0.1)",
              padding: "24px"
            }}>
              <h3 style={{ color: "white", marginBottom: "20px", fontWeight: "700" }}>
                📈 Daily Logins (Last 7 Days)
              </h3>
              <div style={{
                display: "flex", gap: "12px",
                alignItems: "flex-end", height: "120px"
              }}>
                {data.daily_logins.map((day, i) => {
                  const max = Math.max(...data.daily_logins.map(d => d.count));
                  const height = max > 0 ? (day.count / max) * 100 : 0;
                  return (
                    <div key={i} style={{
                      flex: 1, display: "flex",
                      flexDirection: "column", alignItems: "center", gap: "6px"
                    }}>
                      <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.75rem" }}>
                        {day.count}
                      </div>
                      <div style={{
                        width: "100%",
                        height: `${height}%`,
                        background: "linear-gradient(180deg, #a78bfa, #60a5fa)",
                        borderRadius: "6px 6px 0 0",
                        minHeight: "4px"
                      }} />
                      <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.7rem" }}>
                        {new Date(day.date).toLocaleDateString("en-IN", {
                          day: "numeric", month: "short"
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}