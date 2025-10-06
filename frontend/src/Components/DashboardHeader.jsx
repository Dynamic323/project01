import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/Authcontext";
import { Link } from "react-router-dom";
import {
  AiOutlineUser,
  AiOutlineSetting,
  AiOutlineLogout,
  AiOutlineDown,
  AiOutlineUp
} from "react-icons/ai";

const DashboardHeader = () => {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Get initials for avatar
  const getInitials = () => {
    if (!user) return "U";

    const displayName = user.displayName || user.name || "";
    const names = displayName.split(" ");
    if (names.length > 1) {
      return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
    }
    return displayName.charAt(0).toUpperCase();
  };

  return (
    <header className="bg-slate-800 border-b border-slate-700 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left Side - App Info */}
        <div>
          <h2 className="text-2xl font-semibold text-slate-100 font-mono">
            Dashboard
          </h2>
          <p className="text-slate-400 mt-1 font-mono text-sm">
            Share your code and text files instantly
          </p>
        </div>

        {/* Right Side - User Info & Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center space-x-2 focus:outline-none"
          >
            {/* Welcome Message */}
            <span className="hidden md:inline text-slate-200 font-medium">
              Welcome, {user?.displayName || user?.name || "User"}
            </span>

            {/* User Avatar with Initials */}
            <div className="w-9 h-9 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
              {getInitials()}
            </div>

            {/* Dropdown Arrow */}
            {isDropdownOpen ? (
              <AiOutlineUp className="text-slate-300" />
            ) : (
              <AiOutlineDown className="text-slate-300" />
            )}
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-slate-700 border border-slate-600 rounded-md shadow-lg z-50">
              <div className="py-1">
                {/* <Link
                  to="/profile"
                  className="flex items-center px-4 py-2 text-slate-200 hover:bg-slate-600 transition-colors"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <AiOutlineUser className="mr-2" />
                  Profile
                </Link> */}
                <Link
                  to="/dashboard/settings"
                  className="flex items-center px-4 py-2 text-slate-200 hover:bg-slate-600 transition-colors"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <AiOutlineSetting className="mr-2" />
                  Settings
                </Link>
                <hr className="border-slate-600 my-1" />
                <button
                  onClick={() => {
                    logout();
                    setIsDropdownOpen(false);
                  }}
                  className="w-full flex items-center px-4 py-2 text-slate-200 hover:bg-slate-600 transition-colors"
                >
                  <AiOutlineLogout className="mr-2" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
