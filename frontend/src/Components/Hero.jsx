import React from "react";

function Hero() {
  return (
    <div className="container mx-auto max-w-4xl text-center font-sans ">
      <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
        Paste code. Share files.{" "}
        <span className="text-orange-500">Instantly.</span>
      </h1>

      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <button
          size="lg"
          className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 text-lg font-semibold"
          onClick={() => setActiveTab("paste")}
        >
          {/* <Code className="mr-2 h-5 w-5" /> */}
          Paste Code
        </button>
        <button
          size="lg"
          className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 text-lg font-semibold"
          onClick={() => setActiveTab("upload")}
        >
          {/* <Upload className="mr-2 h-5 w-5" /> */}
          Upload File
        </button>
      </div>
      <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-2xl mx-auto">
        Get a link you can share with anyone.
      </p>
    </div>
  );
}

export default Hero;
