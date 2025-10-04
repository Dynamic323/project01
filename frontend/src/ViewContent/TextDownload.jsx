// TextDownload.jsx
import { FaDownload } from "react-icons/fa";
import api from "../api";

export function TextDownload({ content, fileName, className }) {
  const handleDownload = () => {
    if (!content) return;
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = (`DyshareX_${fileName}` || "DyshareX_untitled") + ".txt";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <button 

      onClick={handleDownload}
      className={`flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition ${className}`}
    >
      <FaDownload />
      Download {fileName}
    </button>
  );
}
