import { createContext, useContext, useEffect, useState } from "react";
import { db } from "../lib/cocobase";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  //  Restore session on refresh
  useEffect(() => {
    const init = async () => {
      try {
        await db.auth.initAuth();
        try {
          const currentUser = await db.auth.getCurrentUser();
          if (currentUser) {
            setUser(currentUser);
            localStorage.setItem(
              "user",
              JSON.stringify({
                uid: currentUser.id,
                email: currentUser.email,
                displayName: currentUser.displayName,
              }),
            );
          }
        } catch {
          // No active session, that's fine
          setUser(null);
          localStorage.removeItem("user");
        }
      } catch (err) {
        console.error("Auth init error:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  //  Register
  const register = async (email, password, name) => {
    const res = await db.auth.register({
      email,
      password,
      displayName: name,
    });

    const currentUser = await db.auth.getCurrentUser();

    const newUser = {
      ...currentUser,
      UserPlan: "free",
      isPublic: true,
      defaultType: "text",
      allowAnalytics: true,
      emailNotifications: true,
      fileActivityAlerts: false,
      profileImage: "",
    };

    setUser(newUser);

    localStorage.setItem(
      "user",
      JSON.stringify({
        uid: currentUser.id,
        email: currentUser.email,
        displayName: currentUser.displayName,
      }),
    );

    return res;
  };

  // Login
  const login = async (email, password) => {
    const res = await db.auth.login({ email, password });

    const currentUser = await db.auth.getCurrentUser();

    setUser(currentUser);

    localStorage.setItem(
      "user",
      JSON.stringify({
        uid: currentUser.id,
        email: currentUser.email,
        displayName: currentUser.displayName,
      }),
    );

    return res;
  };

  // Logout
  const logout = async () => {
    await db.auth.logout();
    setUser(null);
    localStorage.removeItem("user");
  };

  //  Update profile (email/name/settings)
  const updateUserSettings = async (updates) => {
    if (!user) throw new Error("No user logged in");

    const updatedUser = await db.auth.updateUser(updates);

    setUser((prev) => ({
      ...prev,
      ...updatedUser,
    }));
  };

  const googleSignin = async (id_token) => {
    console.log("See the ID toeken ooo", id_token);

    if (!id_token) throw new Error("No Google token received");

    const res = await db.auth.loginWithGoogle({
      idToken: id_token,
      platform: "web",
    });

    const currentUser = await db.auth.getCurrentUser();

    setUser(currentUser);

    return res;
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
        googleSignin,
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
