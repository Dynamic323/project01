import {
  AiOutlineAudio,
  AiOutlineFile,
  AiOutlinePicture,
  AiOutlineVideoCamera,
} from "react-icons/ai";

import {
  FiFile,
  FiImage,
  FiVideo,
  FiMusic,
  FiCode,
  FiDownload,
} from "react-icons/fi";
export const formatSize = (b) => {
  const sizes = ["B", "KB", "MB", "GB"];
  if (!b) return "0 B";
  const i = Math.floor(Math.log(b) / Math.log(1024));
  return `${(b / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
};

export const formatDate = (date) =>
  new Date(date).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

export const handleCopy = (link ) => {
  navigator.clipboard.writeText(link);
  toast.success("Link copied!");
};

export const getFileIcon = (type) => {
  if (!type) return <AiOutlineFile className="h-5 w-5 text-red-400" />;
  if (type.startsWith("image/"))
    return <AiOutlinePicture className="h-5 w-5 text-red-400" />;
  if (type.startsWith("audio/"))
    return <AiOutlineAudio className="h-5 w-5 text-red-400" />;
  if (type.startsWith("video/"))
    return <AiOutlineVideoCamera className="h-5 w-5 text-red-400" />;
  return <AiOutlineFile className="h-5 w-5 text-red-400" />;
};

export const getActualFileIcon = (type) => {
  switch (type) {
    case "image":
      return <FiImage className="text-red-400" />;
    case "video":
      return <FiVideo className="text-red-400" />;
    case "audio":
      return <FiMusic className="text-red-400" />;
    case "pdf":
      return <FiFile className="text-red-400" />;
    case "text":
    case "code":
      return <FiCode className="text-red-400" />;
    default:
      return <FiFile className="text-slate-400" />;
  }
};
