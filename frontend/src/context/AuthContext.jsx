import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { favouritesAPI } from "../services/api";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Global favourites state
  const [favouriteIds, setFavouriteIds] = useState(new Set()); // car id set — quick lookup
  const [favourites, setFavourites] = useState([]);            // full objects — dashboard use

  // ✅ App load aana udane saved user restore + favourites fetch
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("token");
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
    }
    setLoading(false);
  }, []);

  // ✅ Token ready aana udane favourites fetch pannuvom
  useEffect(() => {
    if (token) {
      fetchFavourites();
    } else {
      // Logout aana clear pannuvom
      setFavourites([]);
      setFavouriteIds(new Set());
    }
  }, [token]);

  const fetchFavourites = useCallback(async () => {
    try {
      const res = await favouritesAPI.getAll();
      const favList = res.data;
      setFavourites(favList);
      setFavouriteIds(new Set(favList.map(f => f.car.id)));
    } catch {
      // Silent fail — user not logged in
    }
  }, []);

  // ✅ Toggle — everywhere call pannalaam, everywhere update aagum
  const toggleFavourite = useCallback(async (carId) => {
    try {
      await favouritesAPI.toggle(carId);
      // Optimistic update
      setFavouriteIds(prev => {
        const next = new Set(prev);
        if (next.has(carId)) {
          next.delete(carId);
        } else {
          next.add(carId);
        }
        return next;
      });
      // Full list refresh — dashboard correct-a show aaganum
      fetchFavourites();
    } catch (err) {
      throw err; // caller handle pannum
    }
  }, [fetchFavourites]);

  // ✅ Quick check — isFavourite(carId) → true/false
  const isFavourite = useCallback((carId) => {
    return favouriteIds.has(carId);
  }, [favouriteIds]);

  const loginUser = (userData, accessToken) => {
    setUser(userData);
    setToken(accessToken);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", accessToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setFavourites([]);
    setFavouriteIds(new Set());
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{
      user, token, loading,
      loginUser, logout,
      favourites, favouriteIds,
      toggleFavourite, isFavourite,
      fetchFavourites,
    }}>
      {children}
    </AuthContext.Provider>
  );
}