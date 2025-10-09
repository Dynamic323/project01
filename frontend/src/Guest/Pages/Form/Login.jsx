import React, { useEffect, useState } from "react";
import Navbar from "../../../Components/Navbar";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/Authcontext";
import { toast, ToastContainer } from "react-toastify";
import Spinner from "../../../Components/Spinner";

function Login() {
  const { login, googleSignin, githubSignIn ,user} = useAuth();
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
  const handleGoogle = async () => {
    try {
      await googleSignin();

      toast.success("Logged in with Google!");
      navigate("/dashboard");
    } catch (err) {
      toast.error("Google login failed");
    }
  };

  const handleGithub = async () => {
    try {
      await githubSignIn();
      toast.success("Logged in with GitHub!");
      navigate("/dashboard");
    } catch (err) {
      toast.error("GitHub login failed");
    }
  };

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
      toast.error(`${error}`);
      console.error(error);
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

            <span className="block text-center text-slate-300 text-sm mb-3 sm:mb-4">
              Or Continue with Google/GitHub to sign up
            </span>

            <div className="flex gap-3 sm:gap-4 items-center my-3 sm:my-4">
              <button
                type="button"
                onClick={handleGoogle}
                className="w-[50%] py-2 cursor-pointer bg-slate-700 hover:bg-slate-600 rounded-xl flex justify-center items-center transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 48 48"
                >
                  <path
                    fill="#fbc02d"
                    d="M43.6 20.5H42V20H24v8h11.3C33.2 32.4 29 35 24 35c-6.1 0-11-4.9-11-11s4.9-11 11-11c2.8 0 5.4 1.1 7.4 2.9l5.7-5.7C33.7 7.1 29.1 5 24 5 13.5 5 5 13.5 5 24s8.5 19 19 19c9.8 0 18-7.1 18-19 0-1.3-.1-2.4-.4-3.5z"
                  />
                  <path
                    fill="#e53935"
                    d="M6.3 14.7l6.6 4.8C14.5 15.2 18.9 12 24 12c2.8 0 5.4 1.1 7.4 2.9l5.7-5.7C33.7 7.1 29.1 5 24 5c-7.2 0-13.4 3.6-17.1 9.2l-.6.5z"
                  />
                  <path
                    fill="#4caf50"
                    d="M24 43c5.2 0 9.9-2 13.4-5.2l-6.2-5.1C29.4 34.4 26.8 35 24 35c-5.1 0-9.4-2.6-11.6-6.5l-6.5 5c3.7 5.7 10 9.5 17.1 9.5z"
                  />
                  <path
                    fill="#1565c0"
                    d="M43.6 20.5H42V20H24v8h11.3C34.5 31.7 29.7 35 24 35c-5.1 0-9.4-2.6-11.6-6.5l-6.5 5C9.5 38.3 16.2 43 24 43c9.8 0 18-7.1 18-19 0-1.3-.1-2.4-.4-3.5z"
                  />
                </svg>
              </button>
              <button
                type="button"
                onClick={handleGithub}
                className="w-[50%] py-2 cursor-pointer bg-slate-700 hover:bg-slate-600 rounded-xl flex justify-center items-center transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="white"
                >
                  <path d="M12 0C5.37 0 0 5.373 0 12a12 12 0 0 0 8.207 11.385c.6.11.82-.26.82-.577 0-.285-.01-1.04-.015-2.04-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.334-1.756-1.334-1.756-1.09-.745.083-.73.083-.73 1.205.084 1.84 1.237 1.84 1.237 1.07 1.835 2.806 1.305 3.492.997.108-.775.418-1.305.762-1.605-2.665-.3-5.467-1.335-5.467-5.935 0-1.31.468-2.38 1.236-3.22-.124-.303-.536-1.522.117-3.176 0 0 1.008-.322 3.3 1.23A11.52 11.52 0 0 1 12 6.844c1.02.005 2.045.138 3.003.405 2.29-1.552 3.297-1.23 3.297-1.23.654 1.654.242 2.873.118 3.176.77.84 1.235 1.91 1.235 3.22 0 4.61-2.807 5.632-5.48 5.927.43.372.814 1.103.814 2.222 0 1.606-.014 2.903-.014 3.296 0 .32.216.694.825.576A12.005 12.005 0 0 0 24 12c0-6.627-5.373-12-12-12z" />
                </svg>
              </button>
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
                <span><br />
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
