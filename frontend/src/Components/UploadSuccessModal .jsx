import { useState, useEffect } from "react";
import {
  AiOutlineFile,
  AiOutlineFileText,
  AiOutlinePicture,
  AiOutlineAudio,
  AiOutlineVideoCamera,
  AiOutlineCode,
  AiOutlineCopy,
  AiOutlineLink,
  AiOutlineDownload,
  AiOutlineClose,
  AiOutlineCheck,
  AiOutlineCloudDownload,
  AiOutlineEye,
  AiOutlineCheckCircle,
  AiOutlineSmile,
} from "react-icons/ai";
import { toast, ToastContainer } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { FrontendURL, handleCopy } from "../utils/file-helper";
import { Copy } from "lucide-react";

const UploadSuccessModal = ({ data, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Determine if the data is text/code or files
  const isTextUpload = data.some(
    (item) => item.type === "text" || item.type === "code"
  );
  const isFileUpload = data.some((item) => item.file_url);

  // Get file icon based on file type
  const getFileIcon = (fileName) => {
    const ext = fileName.split(".").pop()?.toLowerCase();
    if (["jpg", "jpeg", "png", "gif", "svg", "webp"].includes(ext))
      return <AiOutlinePicture className="text-xl text-red-400" />;
    if (["mp3", "wav", "m4a", "aac", "flac"].includes(ext))
      return <AiOutlineAudio className="text-xl text-red-400" />;
    if (["mp4", "avi", "mov", "wmv", "flv"].includes(ext))
      return <AiOutlineVideoCamera className="text-xl text-red-400" />;
    if (["js", "html", "css", "py", "java", "c", "cpp", "json"].includes(ext))
      return <AiOutlineCode className="text-xl text-red-400" />;
    return <AiOutlineFile className="text-xl text-red-400" />;
  };

  // Copy to clipboard function
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Copied to clipboard!");
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Get file preview URL (for images)
  const getFilePreview = (fileName, fileUrl) => {
    const ext = fileName.split(".").pop()?.toLowerCase();
    if (["jpg", "jpeg", "png", "gif", "svg", "webp"].includes(ext))
      return fileUrl;
    return null;
  };

  
  return (
    <>
      <ToastContainer />
      <AnimatePresence>
        {isMounted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="bg-slate-800/95 rounded-xl p-6 max-w-3xl w-full mx-2 md:mx-4 max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800 border border-slate-700 shadow-2xl"
            >
              {/* Success Header */}
              <div className="flex flex-col items-center mb-6 text-center">
                <div className="w-16 h-16 rounded-full bg-green-400/20 flex items-center justify-center mb-4">
                  <AiOutlineCheckCircle className="w-8 h-8 text-green-400" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-1">
                  {isTextUpload ? "Text Uploaded!" : "Files Uploaded!"}
                </h2>
                <p className="text-green-400 font-medium">
                  {data.length} {data.length === 1 ? "item" : "items"}{" "}
                  successfully uploaded
                </p>
              </div>

              {/* Content */}
              <div className="space-y-6">
                {/* File Upload Layout */}
                {isFileUpload && (
                  <>
                    {data.map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-slate-700/50 rounded-lg p-4 border border-slate-600"
                      >
                        <div className="flex flex-col md:flex-row gap-4">
                          {/* File preview */}
                          {getFilePreview(item.file_name, item.file_url) && (
                            <div className="w-full md:w-40 h-32 rounded-lg overflow-hidden border border-slate-600">
                              <img
                                src={item.file_url}
                                alt={item.file_name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          {/* File info */}
                          <div className="flex-1 space-y-3">
                            <div className="flex items-start gap-3">
                              <div className="mt-1">
                                {getFileIcon(item.file_name)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="text-white font-medium text-lg truncate">
                                  {item.title || item.file_name}
                                </h3>
                                <div className="grid grid-cols-2 gap-2 mt-2">
                                  <div>
                                    <p className="text-xs text-slate-400">Type</p>
                                    <p className="text-sm text-white truncate">
                                      {item.file_type}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-slate-400">Size</p>
                                    <p className="text-sm text-white">
                                      {formatFileSize(item.file_size)}
                                    </p>
                                  </div>
                                </div>
                                {/* URL with copy */}
                                <div className="mt-3">
                                  <div className="flex items-center gap-1">
                                    <span className="text-xs text-slate-400">
                                      Copy ID:
                                    </span>
                                    <div className="relative flex-1">
                                      <input
                                        type="text"
                                        value={item.id}
                                        readOnly
                                        className="w-full bg-slate-800 text-white text-xs px-3 py-1.5 rounded-lg pr-9 focus:outline-none focus:ring-2 focus:ring-green-400"
                                      />
                                      <button
                                        onClick={() =>
                                          handleCopy(`${item.id}`, "ID copied")
                                        }
                                        className="absolute right-2 inset-y-0 p-1 text-slate-400 hover:text-white"
                                        title="Copy ID"
                                      >
                                        {copied ? (
                                          <AiOutlineCheck className="text-green-400" />
                                        ) : (
                                          <AiOutlineCopy />
                                        )}
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            {/* Action buttons */}
                            <div className="flex gap-2 mt-4">
                              <button
                                onClick={() =>
                                  window.open(`${FrontendURL}/view/${item.id}`, "_blank")
                                }
                                className="flex-1 flex items-center justify-center gap-2 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-all"
                              >
                                <AiOutlineEye />
                                <span>Preview</span>
                              </button>
                              <button
                                onClick={() =>
                                  handleCopy(
                                    `${FrontendURL}/view/${item.id}`,
                                    "Link copied"
                                  )
                                }
                                className="flex-1 flex items-center justify-center gap-2 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-all"
                              >
                                <Copy className="w-4 h-4 " />
                                <span>Copy Link</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </>
                )}

                {/* Text Upload Layout */}
                {isTextUpload && (
                  
                  <>
                    {data.map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-slate-700/50 rounded-lg p-4 border border-slate-600"
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <AiOutlineFileText className="text-green-400" />
                          <h3 className="text-white font-medium text-lg">
                            {item.title || `Text Snippet ${index + 1}`}
                          </h3>
                        </div>
                        <div className="relative bg-slate-900 rounded-lg p-4 mb-4 overflow-x-auto">
                        <pre className="text-sm text-slate-300 whitespace-pre-wrap">
  {item.content.length > 30
    ? item.content.slice(0, 21) + "..."
    : item.content}
</pre>


 <div className="mt-3">
                                  <div className="flex items-center gap-1">
                                    <span className="text-xs text-slate-400">
                                      Copy ID:
                                    </span>
                                    <div className="relative flex-1">
                                      <input
                                        type="text"
                                        value={item.id}
                                        readOnly
                                        className="w-full bg-slate-800 text-white text-xs px-3 py-1.5 rounded-lg pr-9 focus:outline-none focus:ring-2 focus:ring-green-400"
                                      />
                                      <button
                                        onClick={() =>
                                          handleCopy(`${item.id}`, "ID copied")
                                        }
                                        className="absolute right-2 inset-y-0 p-1 text-slate-400 hover:text-white"
                                        title="Copy ID"
                                      >
                                        {copied ? (
                                          <AiOutlineCheck className="text-green-400" />
                                        ) : (
                                          <AiOutlineCopy />
                                        )}
                                      </button>
                                    </div>
                                  </div>
                                </div>
                          {/* <button
                            onClick={() => copyToClipboard(item.content)}
                            className="absolute top-2 right-2 p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-full transition-all"
                            title="Copy to clipboard"
                          >
                            {copied ? (
                              <AiOutlineCheck className="text-green-400" />
                            ) : (
                              <AiOutlineCopy />
                            )}
                          </button> */}
                        </div>
                        {/* Action buttons */}
                        <div className="flex gap-2 mt-4">
                              <button
                                onClick={() =>
                                  window.open(`${FrontendURL}/view/${item.id}`, "_blank")
                                }
                                className="flex-1 flex items-center justify-center gap-2 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-all"
                              >
                                <AiOutlineEye />
                                <span>Preview</span>
                              </button>
                              <button
                                onClick={() =>
                                  handleCopy(
                                    `${FrontendURL}/view/${item.id}`,
                                    "Link copied"
                                  )
                                }
                                className="flex-1 flex items-center justify-center gap-2 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-all"
                              >
                                <Copy className="w-4 h-4 " />
                                <span>Copy Link</span>
                              </button>
                            </div>
                      </motion.div>
                      
                    ))}
                  </>
                )}
              </div>

              {/* Footer */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-8 flex justify-center"
              >
                <button
                  onClick={onClose}
                  className="px-8 py-3 bg-red-400 text-white rounded-lg hover:bg-red-500 transition-all flex items-center gap-2 shadow-md shadow-red-400/30 hover:shadow-red-400/50"
                >
                  <AiOutlineCheck />
                  <span>Finish</span>
                </button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default UploadSuccessModal;
