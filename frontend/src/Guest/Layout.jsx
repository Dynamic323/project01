import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Loader from "../Components/Loader";
import { ToastContainer } from "react-toastify";
function Layout() {
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  console.log(location);
  console.log("loading" + loading);

  useEffect(() => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [location]);

  return (
    <>
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
    </>
  );
}

export default Layout;
