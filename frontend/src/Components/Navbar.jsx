import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div>
      <nav className="flex items-center">
        <ul className=" w-full flex items-center justify-between px-8">
          <li className="font-mono text-4xl py-2.5">
            <Link to="/"> ShareX</Link>
          </li>
          {/* <li>About</li> */}

          <div className="flex gap-3.5">
            <Link to="/register">
              <button className="text-[1rem] underline decoration-2 decoration-orange-600">
                Create an account
              </button>
            </Link>
          </div>
        </ul>
      </nav>
    </div>
  );
}

export default Navbar;
