import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Loader from "../Components/Loader";
import Navbar from "../Components/Navbar";

function User_Layout() {
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [location]);
  return (
    <div>
      <ToastContainer />
      {loading && <Loader />}

      {!loading && (
        <div className="h-[100vh]  font-mono	bg-slate-900 text-white">
          <Navbar />

          <div className="pt-20">
            <Outlet />
          </div>
        </div>
      )}
    </div>
  );
}

export default User_Layout;
