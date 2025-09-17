import React, { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import Loader from "../Components/Loader";
import { ToastContainer } from "react-toastify";
import {
  ChevronRight,
  ChevronLeft,
  Home,
  History,
  Settings,
  Terminal,
  GitBranch,
  Database,
} from "lucide-react";
import {
  AiOutlineDashboard,
  AiOutlineDatabase,
  AiOutlineFile,
  AiOutlineFolder,
  AiOutlineHistory,
  AiOutlineHome,
  AiOutlineSetting,
} from "react-icons/ai";

function User_Layout() {
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 600);
  }, [location]);

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const sidebarItems = [
    {
      title: "Dashboard",
      path: "/dashboard",
      icon: AiOutlineHome,
      label: "dashboard",
    },
    {
      title: "My Files",
      path: "/dashboard/files",
      icon: AiOutlineFile,
      label: "files",
    },
    {
      title: "History",
      path: "/dashboard/history",
      icon: AiOutlineHistory,
      label: "history",
    },
    {
      title: "Storage",
      path: "/dashboard/storage",
      icon: AiOutlineDatabase,
      label: "storage",
    },
    {
      title: "Settings",
      path: "/dashboard/settings",
      icon: AiOutlineSetting,
      label: "settings",
    },
  ];

  return (
    <>
      <ToastContainer />
      {/* {loading && <Loader />} */}

      {/* {!loading && ( */}
        <div className="h-fit  font-mono	bg-slate-900  text-white">
          <div className="flex  bg-slate-900">
            {/* Sidebar */}
            <div
              className={` h-screen  ${
                sidebarCollapsed ? "w-20" : "w-64"
              } bg-slate-800 border-r border-slate-700 transition-all duration-300 ease-in-out flex flex-col`}
            >
              {/* Sidebar Header */}
              <div className="p-4 border-b border-slate-700 flex items-center justify-between">
                {!sidebarCollapsed && (
                  <h1 className="text-xl font-bold text-red-400 font-mono">
                    DyshareX
                  </h1>
                )}
                <button
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  className="p-2 rounded-md hover:bg-slate-700 transition-colors"
                >
                  {sidebarCollapsed ? (
                    <ChevronRight className="w-5 h-5 text-slate-300" />
                  ) : (
                    <ChevronLeft className="w-5 h-5 text-slate-300" />
                  )}
                </button>
              </div>

              {/* Sidebar Navigation */}
              <nav className="flex-1 p-4">
                <ul className="space-y-7 ">
                  {sidebarItems.map((item, index) => (
                    <li key={index} className="">
                      <NavLink
                        to={item.path}
                        end
                        className={({ isActive }) =>
                          `flex items-center ${
                            sidebarCollapsed
                              ? "justify-center p-3"
                              : "justify-start p-3"
                          } rounded-md transition-colors group ${
                            isActive
                              ? "bg-slate-700 text-red-400"
                              : "hover:bg-slate-700 text-slate-300"
                          }`
                        }
                      >
                        <item.icon
                          className={`${
                            sidebarCollapsed ? "w-8 h-8" : "w-5 h-5"
                          } mr-0 ${
                            sidebarCollapsed ? "" : "group-hover:text-red-400"
                          } ${({ isActive }) =>
                            isActive ? "text-red-400" : "text-slate-300"}`}
                        />
                        {!sidebarCollapsed && (
                          <span
                            className={`ml-3 font-medium ${({ isActive }) =>
                              isActive ? "text-red-400" : "text-slate-300"}`}
                          >
                            {item.label}
                          </span>
                        )}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
            <div className="w-full">
              <Outlet />
            </div>
          </div>
        </div>
      {/* )} */}
    </>
  );
}

export default User_Layout;
