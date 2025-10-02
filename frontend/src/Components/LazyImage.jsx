import React, { useState } from "react";

export function LazyImage({ src, alt }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="h-32 bg-slate-900 overflow-hidden">
      {!loaded && (
        <img
          src="/placeholder.png"
          alt="placeholder"
          className="w-full h-full object-cover animate-pulse"
        />
      )}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className={`w-full h-full object-cover transition-opacity duration-500 ${
          loaded ? "opacity-100" : "opacity-0 absolute"
        }`}
      />
    </div>
  );
}
