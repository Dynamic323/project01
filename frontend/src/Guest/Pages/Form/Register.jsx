import { useState } from "react";
import { useAuth } from "../../../context/Authcontext";
import { handleApiError } from "../../../lib/hrlper";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Spinner from "../../../Components/Spinner";
function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formFields, setFormFields] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormFields((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password } = formFields;
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
      setLoading(true);
      await register(email, password, name);
      setLoading(false);
      toast.success("Account created successfully! Welcome to Replico");
      navigate("/dashboard");
    } catch (error) {
      setLoading(false);
      handleApiError(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6">
      <ToastContainer />
      <div className="w-full max-w-md mx-auto border border-slate-700 p-5 sm:p-6 rounded-lg bg-slate-900/50 backdrop-blur-sm">
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div className="text-2xl sm:text-3xl font-semibold text-center mb-4 sm:mb-6 text-white">
            Create an Account
          </div>

          <div className="flex flex-col gap-4 sm:gap-5 mb-4 sm:mb-6">
            <input
              className="border border-slate-600 p-2.5 sm:p-3 rounded-lg bg-slate-800 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-400"
              type="text"
              placeholder="User Name"
              name="name"
              onChange={handleChange}
              value={formFields.name}
            />
            <input
              className="border border-slate-600 p-2.5 sm:p-3 rounded-lg bg-slate-800 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-400"
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              value={formFields.email}
            />
            <input
              className="border border-slate-600 p-2.5 sm:p-3 rounded-lg bg-slate-800 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-400"
              type="password"
              placeholder="Password"
              name="password"
              value={formFields.password}
              onChange={handleChange}
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
            <span className="py-1">Already have an Account? </span>
            <br />
            <Link to="/login">
              <span className="text-red-400 underline hover:text-red-300 transition-colors">
                Login now
              </span>
            </Link>
          </span>
        </form>
      </div>
    </div>
  );
}

export default Register;
