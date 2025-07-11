import React, { useState } from "react";
import Navbar from "../../../Components/Navbar";
import { Link } from "react-router-dom";

function Register() {
  const [formFildes, setFormfields] = useState({
    name: "",
    email: "",
    password: "",
  });

  //   const handelChange = (e)=>
  //   {
  //     const {name , value} = e.target
  //     setFormfields((prev)=>({
  //         ...prev,
  //         {
  //             [name]:value
  //         }
  //     }))
  //   }

  function handelChange(e) {
    const { name, value } = e.target;

    setFormfields((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  const HandelSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <>
      <div className="mt-auto " onSubmit={HandelSubmit}>
        <div className=" max-w-md mx-auto ">
          <form action=" " onSubmit={HandelSubmit}>
            <div className=" text-3xl "> create an Account </div>

            <div className="flex flex-col my-5 gap-7">
              <input
                className="border border-slate-400 p-3 rounded-s-2xl"
                type="text"
                placeholder="User Name"
                name="name"
                onChange={handelChange}
                value={formFildes.name}
              />

              <input
                className="border border-slate-400 p-3 rounded-s-2xl"
                type="email"
                name="email"
                placeholder="Email"
                onChange={handelChange}
                value={formFildes.email}
              />
              <input
                className="border border-slate-400 p-3 rounded-s-2xl"
                type="password"
                placeholder="Password"
                name="Password"
                value={formFildes.password}
                onChange={handelChange}
              />
            </div>

            <span> or sign in with </span>

            <div className="">
              <button>
                <i class="fa-brands fa-google"> </i>
              </button>
              <button></button>
            </div>

            <button
              type="submit"
              className="w-full mb-3  py-3 rounded-2xl bg-orange-600"
            >
              Create
            </button>
            <span className="text-slate-400  ">
              Already have an Account ?
              <Link to="/login">
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
