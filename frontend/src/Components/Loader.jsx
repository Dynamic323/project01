import "./Loader.css";
export default function Loader({ text }) {
  return (
    <div className="fixed inset-0 bg-slate-900 flex items-center justify-center z-50">
      <div className="flex justify-between flex-col gap-2.5 items-center">
        <div className="custom-loader"></div>
        <span className="text-white font-bold">
          {" "}
          {text ? text : "Loadin..."}
        </span>
      </div>
    </div>
  );
}
