import React, { useEffect, useState } from "react";
import Navbar from "../../../Components/Navbar";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/Authcontext";
import { toast, ToastContainer } from "react-toastify";
import Spinner from "../../../Components/Spinner";
import { handleApiError } from "../../../lib/hrlper";

function Login() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);
  const [loading, setloading] = useState(false);
  const [formFildes, setFormfields] = useState({
    password: "",
    email: "",
  });

  const Handelchange = (e) => {
    const { name, value } = e.target;

    setFormfields((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const HandelSubmit = async (e) => {
    e.preventDefault();

    const { email, password } = formFildes;

    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    try {
      setloading(true);
      await login(email, password);
      setloading(false);
      toast.success("Logged in successfully! Welcome back 👋");
      navigate("/dashboard");
    } catch (error) {
      setloading(false);
      handleApiError(error);
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center p-4 sm:p-6">
        <ToastContainer />
        <div className="w-full max-w-md mx-auto border border-slate-700 p-5 sm:p-6 rounded-lg bg-slate-900/50 backdrop-blur-sm">
          <form
            action=""
            onSubmit={HandelSubmit}
            className="space-y-4 sm:space-y-6"
          >
            <div className="text-2xl sm:text-3xl font-semibold text-center mb-4 sm:mb-6 text-white ">
              {" "}
              Log in to your Account!{" "}
            </div>

            <div className="flex flex-col gap-4 sm:gap-5 mb-4 sm:mb-6">
              <input
                className="border border-slate-600 p-2.5 sm:p-3 rounded-lg bg-slate-800 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-400"
                onChange={Handelchange}
                type="email"
                placeholder="Email"
                value={formFildes.email}
                name="email"
              />
              <input
                className="border border-slate-600 p-2.5 sm:p-3 rounded-lg bg-slate-800 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-400"
                onChange={Handelchange}
                type="password"
                placeholder="Password"
                value={formFildes.password}
                name="password"
              />
            </div>


            <button
              type="submit"
              className="w-full mb-3 cursor-pointer py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-red-400 to-red-500 text-white font-medium flex justify-center items-center transition-all hover:from-red-500 hover:to-red-600"
              disabled={loading}
            >
              {loading ? <Spinner /> : "Create"}
            </button>

            <span className="block text-center text-slate-400 text-xs sm:text-sm">
              Don't have an Account ?
              <Link to="/register">
                <span>
                  <br />
                  <i className="text-red-400 mt-2 underline hover:text-red-300 transition-colors">
                    Create new account
                  </i>
                </span>
              </Link>
            </span>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
