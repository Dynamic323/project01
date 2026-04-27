import { createContext, useContext, useEffect, useState } from "react";
import apiService from "../services/apiService";
import { useDashboard } from "./DashboardContext";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const dashboard = useDashboard();
  const service = apiService(dashboard);

  // Restore session on refresh
  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const userData = await service.getMe(token);
        if (userData) {
          setUser(userData);
        }
      } catch (err) {
        console.error("Auth init error:", err);
        setUser(null);
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  // Register
  const register = async (email, password, name) => {
    const data = await service.register(email, name, password);
    const { token, user: newUser } = data;

    setUser(newUser);
    localStorage.setItem("token", token);
    return data;
  };

  // Login
  const login = async (email, password) => {
    const data = await service.login(email, password);
    const { token, user: loggedInUser } = data;

    setUser(loggedInUser);
    localStorage.setItem("token", token);
    return data;
  };

  // Logout
  const logout = async () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  // Update profile
  const updateUserSettings = async (updates) => {
    if (!user) throw new Error("No user logged in");
    const token = localStorage.getItem("token");
    const data = await service.updateProfile(updates, token);
    setUser(data.user);
    return data;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateUserSettings,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
