import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  GithubAuthProvider,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateEmail,
  updateProfile,
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "../firebase/config";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const userRef = doc(db, "users", currentUser.uid);
          const userSnap = await getDoc(userRef);
          let userData = {};
          if (userSnap.exists()) {
            userData = userSnap.data();
          }

          setUser({
            authUser: currentUser, 
            ...userData,            
          });

          const token = await currentUser.getIdToken();
          localStorage.setItem(
            "user",
            JSON.stringify({
              uid: currentUser.uid,
              email: currentUser.email,
              displayName: currentUser.displayName,
              token,
            })
          );
        } catch (err) {
          console.error("Error fetching user:", err);
        }
      } else {
        localStorage.removeItem("user");
        setUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const register = async (email, password, name) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const authUser = userCredential.user;
    await updateProfile(authUser, { displayName: name });

    await setDoc(doc(db, "users", authUser.uid), {
      name,
      email: authUser.email,
      UserPlan: "free",
      isPublic: true,
      defaultType: "text",
      allowAnalytics: true,
      emailNotifications: true,
      fileActivityAlerts: false,
      profileImage: "",
      createdAt: serverTimestamp(),
    });

    setUser({
      authUser,
      name,
      email: authUser.email,
      UserPlan: "free",
      isPublic: true,
      defaultType: "text",
      allowAnalytics: true,
      emailNotifications: true,
      fileActivityAlerts: false,
      profileImage: "",
    });

    return authUser;
  };

  const login = (email, password) => signInWithEmailAndPassword(auth, email, password);

  const logout = () => {
    localStorage.removeItem("user");
    return signOut(auth);
  };

  const googleSignin = () => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  };

  const githubSignIn = () => {
    const provider = new GithubAuthProvider();
    return signInWithPopup(auth, provider);
  };

  const updateUserEmail = async (newEmail) => {
    if (!user?.authUser) throw new Error("No user logged in");

    await updateEmail(user.authUser, newEmail);
    await updateDoc(doc(db, "users", user.authUser.uid), { email: newEmail });
    setUser((prev) => ({ ...prev, email: newEmail }));
  };

  const updateUserDisplayName = async (newDisplayName) => {
    if (!user?.authUser) throw new Error("No user logged in");

    await updateProfile(user.authUser, { displayName: newDisplayName });
    await updateDoc(doc(db, "users", user.authUser.uid), { name: newDisplayName });
    setUser((prev) => ({ ...prev, displayName: newDisplayName, name: newDisplayName }));
  };

  const updateUserSettings = async (updates) => {
    if (!user?.authUser) throw new Error("No user logged in");

    const userRef = doc(db, "users", user.authUser.uid);
    await updateDoc(userRef, updates);
    setUser((prev) => ({ ...prev, ...updates }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        googleSignin,
        githubSignIn,
        updateUserEmail,
        updateUserDisplayName,
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
