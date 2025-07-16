import React from "react";
import { useAuth } from "../context/Authcontext";

function ProtectedRoute({ children }) {
  const { user } = useAuth();

  console.log(user);

  return <div>{children}</div>;
}

export default ProtectedRoute;
