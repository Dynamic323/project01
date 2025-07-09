import React from "react";
import Navbar from "../../../Components/Navbar";
import { Link } from "react-router-dom";

function Register() {
  return (
    <>
      <div className="mt-auto ">
        <div className=" max-w-md mx-auto ">
          <form action=" ">
            <div className=" text-3xl "> create an Account </div>

            <div className="flex flex-col my-5 gap-7">
              <input
                className="border border-slate-400 p-3 rounded-s-2xl"
                type="text"
                placeholder="User Name"
              />
              <input
                className="border border-slate-400 p-3 rounded-s-2xl"
                type="email"
                placeholder="Email"
              />
              <input
                className="border border-slate-400 p-3 rounded-s-2xl"
                type="password"
                placeholder="Password"
              />
            </div>

            <button
              type="submit"
              className="w-full mb-3  py-3 rounded-2xl bg-orange-600"
            >
              {" "}
              Create
            </button>
            <span className="text-slate-400  ">
              Already have an Account ?{" "}
              <Link to="/login">
                {" "}
                <span>
                  <i className="text-orange-500 underline">Login in now</i>
                </span>
              </Link>
            </span>
          </form>
        </div>
      </div>
    </>
  );
}

export default Register;
