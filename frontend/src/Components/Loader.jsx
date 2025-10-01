import "./Loader.css";

export default function Loader({ text, isdashboard }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Background overlay */}
      <div
        className={`absolute inset-0 ${
          isdashboard ? "backdrop-blur-md bg-black/30" : "bg-slate-900" // solid background
        }`}
      ></div>

      {/* Loader content */}
      <div className="relative flex flex-col gap-2.5 items-center">
        <div className="custom-loader"></div>
        <span className="text-white font-bold">
          {text ? text : "Loading..."}
        </span>
      </div>
    </div>
  );
}
