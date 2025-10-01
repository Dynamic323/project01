// FileDownload.jsx
import { FaDownload } from "react-icons/fa";
import api from "../api";

export function FileDownload({ url, fileName, className = "" }) {
  const handleDownload = async () => {
    // try {
    //   const response = await api.download(url);
    //   const blob = new Blob([response.data]);
    //   const downloadUrl = window.URL.createObjectURL(blob);
    //   const link = document.createElement("a");
    //   link.href = downloadUrl;
    //   link.download = fileName;
    //   document.body.appendChild(link);
    //   link.click();
    //   document.body.removeChild(link);
    //   window.URL.revokeObjectURL(downloadUrl);
    // } catch (err) {
    //   console.error("Error downloading file:", err);
    //   // Fallback to simple navigation if download fails
    //   window.location.href = url;
    // }

    console.log(url);

    let downloadUrl = url;
    if (url.includes("res.cloudinary.com")) {
      downloadUrl = url.replace(/\/upload\//, "/upload/fl_attachment/");
    }

    const link = document.createElement("a");
    link.href = downloadUrl;
    link.setAttribute("download", fileName || "download");
    document.body.appendChild(link);
    link.click();
    link.remove();
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
