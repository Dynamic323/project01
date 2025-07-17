import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../../context/Authcontext";
import Spinner from "../../../Components/Spinner";
import Navbar from "../../../Components/Navbar"; // if needed
import Loader from "../../../Components/Loader";

function Register() {
  const { register, googleSignin, githubSignIn } = useAuth();
  const navigate = useNavigate();

  const [formFildes, setFormfields] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setloading] = useState(false);

  function handelChange(e) {
    const { name, value } = e.target;
    setFormfields((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  const HandelSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password } = formFildes;

    if (!name || !email || !password) {
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
      await register(email, password);
      setloading(false);
      toast.success("Account created successfully! Welcome to Replico");

      navigate("/dashboard");
    } catch (error) {
      setloading(false);
      toast.error(`${error}`);
      console.error(error);
    }
  };

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

  return (
    <div className="mt-auto">
      <div className="max-w-md mx-auto border border-slate-700 p-5 rounded ">
        <form onSubmit={HandelSubmit} className="">
          <div className="text-3xl mb-6">Create an Account</div>

          <div className="flex flex-col gap-6 mb-6">
            <input
              className="border border-slate-400 p-3 rounded-xl"
              type="text"
              placeholder="User Name"
              name="name"
              onChange={handelChange}
              value={formFildes.name}
            />
            <input
              className="border border-slate-400 p-3 rounded-xl"
              type="email"
              name="email"
              placeholder="Email"
              onChange={handelChange}
              value={formFildes.email}
            />
            <input
              className="border border-slate-400 p-3 rounded-xl"
              type="password"
              placeholder="Password"
              name="password"
              value={formFildes.password}
              onChange={handelChange}
            />
          </div>

          <span>Or Continue with Google/GitHub to sign up</span>

          <div className="flex gap-4 items-center my-4">
            <button
              type="button"
              onClick={handleGoogle}
              className="w-[50%] py-2.5 cursor-pointer  bg-slate-700 hover:bg-slate-600 rounded-3xl flex justify-center items-center"
            >
              {/* Google SVG */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="25"
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

            {/* GitHub Button */}
            <button
              type="button"
              onClick={handleGithub}
              className="w-[50%] py-2.5 cursor-pointer bg-slate-400 hover:bg-slate-300 rounded-2xl flex justify-center items-center"
            >
              {/* GitHub SVG */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="25"
                viewBox="0 0 24 24"
                fill="black"
              >
                <path d="M12 0C5.37 0 0 5.373 0 12a12 12 0 0 0 8.207 11.385c.6.11.82-.26.82-.577 0-.285-.01-1.04-.015-2.04-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.334-1.756-1.334-1.756-1.09-.745.083-.73.083-.73 1.205.084 1.84 1.237 1.84 1.237 1.07 1.835 2.806 1.305 3.492.997.108-.775.418-1.305.762-1.605-2.665-.3-5.467-1.335-5.467-5.935 0-1.31.468-2.38 1.236-3.22-.124-.303-.536-1.522.117-3.176 0 0 1.008-.322 3.3 1.23A11.52 11.52 0 0 1 12 6.844c1.02.005 2.045.138 3.003.405 2.29-1.552 3.297-1.23 3.297-1.23.654 1.654.242 2.873.118 3.176.77.84 1.235 1.91 1.235 3.22 0 4.61-2.807 5.632-5.48 5.927.43.372.814 1.103.814 2.222 0 1.606-.014 2.903-.014 3.296 0 .32.216.694.825.576A12.005 12.005 0 0 0 24 12c0-6.627-5.373-12-12-12z" />
              </svg>
            </button>
          </div>

          <button
            type="submit"
            className="w-full mb-3 cursor-pointer py-3 rounded-2xl bg-red-400 text-gray-900 flex justify-center items-center"
            disabled={loading}
          >
            {loading ? <Spinner /> : "Create"}
          </button>

          <span className="text-slate-400">
            Already have an Account?{" "}
            <Link to="/login">
              <span className="text-red-400 underline">Login now</span>
            </Link>
          </span>
        </form>
      </div>
    </div>
  );
}

export default Register;
