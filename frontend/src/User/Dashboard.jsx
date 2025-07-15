import React from "react";
import { useAuth } from "../context/Authcontext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const { logout } = useAuth();

  const navigate = useNavigate();
  const HandelLogout = async () => {
    try {
      await logout();
      toast.success("Log out succesful");

      navigate("/dashboard");
    } catch (error) {
      toast.error(error.message);
    }
  };
  return (
    <div>
      <h1>welcome </h1>
      <button onClick={HandelLogout}> Logout</button>
    </div>
  );
}

export default Dashboard;
