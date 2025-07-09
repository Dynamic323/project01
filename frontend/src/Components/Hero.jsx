import React from "react";

function Hero() {
  return (
    <div className=" p-4 h-[500px]   flex flex-col items-center justify-center  gap-4 font-mono text-shadow-2xs border">
      <h1 className="text-3xl text-slate-300">
        Welcome to <span className="text-orange-500">Share-X</span> Share files
        , text and code snippet seemlessly to your friends
      </h1>

      <div className=" text-2xl flex gap-3.5">
        <button className="inline-flex  min-w-0 border border-orange-500 px-6 py-3 rounded-2xl  text-orange-500 font-semibold shadow hover:bg-orange-50 transition cursor-pointer">
          Upload
        </button>
        <button className="bg-orange-500 px-6 py-3 rounded-2xl  text-white font-semibold shadow hover:bg-orange-600 transition cursor-pointer">
          Share
        </button>
      </div>
    </div>
  );
}

export default Hero;
