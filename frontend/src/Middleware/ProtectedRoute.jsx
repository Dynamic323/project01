import React from "react";
import { useAuth } from "../context/Authcontext";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  console.log(user);
  

  return <>{children}</>;
}

export default ProtectedRoute;
