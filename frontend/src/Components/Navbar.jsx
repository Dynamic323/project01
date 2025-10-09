import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { AiOutlineCloudUpload, AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { useAuth } from "../context/Authcontext";

function Navbar() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
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

            {/* Desktop Menu */}
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

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center gap-4">
              {user ? (
                <NavLink
                  to="/dashboard"
                  className="px-6 py-2 bg-gradient-to-r from-red-400 to-red-500 text-white rounded-lg font-semibold hover:from-red-300 hover:to-red-400 transition-all duration-200 shadow-lg shadow-red-400/20"
                >
                  Dashboard
                </NavLink>
              ) : (
                <>
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
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-slate-300 hover:text-white focus:outline-none"
              >
                <AiOutlineMenu size={24} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay (Blurred Background) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Menu (Slide-in) */}
      <div
        className={`fixed top-0 right-0 w-64 h-full bg-slate-900/90 backdrop-blur-sm transform transition-transform duration-300 ease-in-out z-50 md:hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full p-4">
          <div className="flex justify-end mb-6">
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-300 hover:text-white focus:outline-none"
            >
              <AiOutlineClose size={24} />
            </button>
          </div>
          <div className="flex flex-col space-y-3">
            <a
              href="#demo"
              className="px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-red-400 hover:bg-slate-700 transition-colors"
            >
              Try It
            </a>
            <a
              href="#features"
              className="px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-red-400 hover:bg-slate-700 transition-colors"
            >
              Features
            </a>
            <a
              href="#pricing"
              className="px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-red-400 hover:bg-slate-700 transition-colors"
            >
              Pricing
            </a>
            {user ? (
              <NavLink
                to="/dashboard"
                className="px-3 py-2 rounded-md text-base font-medium bg-gradient-to-r from-red-400 to-red-500 text-white hover:from-red-300 hover:to-red-400 transition-all duration-200 text-center"
              >
                Dashboard
              </NavLink>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className="px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                >
                  Sign In
                </NavLink>
                <NavLink
                  to="/register"
                  className="px-3 py-2 rounded-md text-base font-medium bg-gradient-to-r from-red-400 to-red-500 text-white hover:from-red-300 hover:to-red-400 transition-all duration-200 text-center"
                >
                  Get Started
                </NavLink>
              </>
            )}
          </div>
        </div>


        </div>
      </>
    );
}

export default Navbar;
