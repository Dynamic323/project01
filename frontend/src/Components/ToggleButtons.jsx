import {
  AiOutlineFile,
  AiOutlineFileText,
} from "react-icons/ai";// ToggleButtons component
export default function ToggleButtons({ uploadType, setUploadType, resetForm }) {
  return (
    <div className="flex gap-3 mb-8">
      <button
        onClick={() => {
          setUploadType("files");
          resetForm();
        }}
        className={`flex items-center gap-3 px-2.5 py-1 md:px-6 md:py-3 text-sm  rounded-lg border-2 transition-all ${
          uploadType === "files"
            ? "border-red-400 bg-slate-800 text-red-400 shadow-md"
            : "border-slate-600 bg-slate-900 text-slate-300 hover:bg-slate-800"
        }`}
      >
        {/* <AiOutlineFile /> */}
        Upload Files
      </button>
      <button
        onClick={() => {
          setUploadType("text");
          resetForm();
        }}
        className={`flex items-center gap-3 px-2.5 py-1 md:px-6 md:py-3rounded-lg border-2 transition-all ${
          uploadType === "text"
            ? "border-red-400 bg-slate-800 text-red-400 shadow-md"
            : "border-slate-600 bg-slate-900 text-slate-300 hover:bg-slate-800"
        }`}
      >
        <AiOutlineFileText />
        Share Text
      </button>
    </div>
  );
}
