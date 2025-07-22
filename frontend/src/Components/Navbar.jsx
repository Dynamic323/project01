import React from "react";
import { Link, NavLink } from "react-router-dom";
import { AiOutlineCloudUpload } from "react-icons/ai";
function Navbar() {
  return (
    <nav className="border-b border-slate-700 bg-slate-900/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-red-400 to-red-500 text-white font-bold text-lg shadow-lg">
              <AiOutlineCloudUpload className="h-5 w-5" />
            </div>
            <Link to="/" className="flex flex-col">
              <span className="font-bold text-xl text-white tracking-tight">
                DyshareX
              </span>
              <span className="text-xs text-slate-400">
                File Sharing Made Simple
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a
              href="#demo"
              className="text-slate-300 hover:text-red-400 transition-colors"
            >
              Try It
            </a>
            <a
              href="#features"
              className="text-slate-300 hover:text-red-400 transition-colors"
            >
              Features
            </a>
            <a
              href="#pricing"
              className="text-slate-300 hover:text-red-400 transition-colors"
            >
              Pricing
            </a>
          </div>

          <div className="flex items-center gap-4">
            <NavLink
              to="/login"
              className="px-4 py-2 text-slate-300 hover:text-white transition-colors"
            >
              Sign In
            </NavLink>
            <NavLink
              to="/register"
              className="px-6 py-2 bg-gradient-to-r from-red-400 to-red-500 text-white rounded-lg font-semibold hover:from-red-300 hover:to-red-400 transition-all duration-200 shadow-lg shadow-red-400/20"
            >
              Get Started
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
