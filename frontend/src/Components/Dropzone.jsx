import * as React from "react";
import {
  AiOutlineCloudUpload,
  AiOutlineFile,
  AiOutlineFileText,
  AiOutlinePicture,
  AiOutlineAudio,
  AiOutlineVideoCamera,
  AiOutlineDelete,
  AiOutlineLink,
} from "react-icons/ai";

export function Dropzone() {
  const [uploadType, setUploadType] = React.useState("files");
  const [isDragOver, setIsDragOver] = React.useState(false);
  const [files, setFiles] = React.useState([]);
  const [textContent, setTextContent] = React.useState("");

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles(droppedFiles);
  };

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const getFileIcon = (fileName) => {
    const ext = fileName.split(".").pop()?.toLowerCase();
    if (["jpg", "jpeg", "png", "gif", "svg", "webp"].includes(ext))
      return <AiOutlinePicture className="h-4 w-4 text-red-400" />;
    if (["mp3", "wav", "m4a", "aac", "flac"].includes(ext))
      return <AiOutlineAudio className="h-4 w-4 text-red-400" />;
    if (["mp4", "avi", "mov", "wmv", "flv"].includes(ext))
      return <AiOutlineVideoCamera className="h-4 w-4 text-red-400" />;
    return <AiOutlineFile className="h-4 w-4 text-red-400" />;
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-6">
      {/* Toggle Buttons */}
      <div className="flex gap-3 mb-8">
        <button
          onClick={() => setUploadType("files")}
          className={`flex items-center gap-3 px-6 py-3 rounded-lg border transition-all duration-200 ${
            uploadType === "files"
              ? "border-red-400 bg-slate-800 text-red-400 shadow-lg shadow-red-400/20"
              : "border-slate-600 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:border-slate-500"
          }`}
        >
          <AiOutlineFile className="h-5 w-5" />
          <span>Upload Files</span>
        </button>
        <button
          onClick={() => setUploadType("text")}
          className={`flex items-center gap-3 px-6 py-3 rounded-lg border transition-all duration-200 ${
            uploadType === "text"
              ? "border-red-400 bg-slate-800 text-red-400 shadow-lg shadow-red-400/20"
              : "border-slate-600 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:border-slate-500"
          }`}
        >
          <AiOutlineFileText className="h-5 w-5" />
          <span>Share Text</span>
        </button>
      </div>

      {uploadType === "files" ? (
        <div className="space-y-6">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-xl p-16 text-center transition-all duration-300 ${
              isDragOver
                ? "border-red-400 bg-slate-800/50 shadow-lg shadow-red-400/10"
                : "border-slate-600 bg-slate-900 hover:border-red-400/50 hover:bg-slate-800/30"
            }`}
          >
            <input
              type="file"
              multiple
              onChange={handleFileSelect}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />

            <div className="flex flex-col items-center gap-6">
              <div className="relative">
                <AiOutlineCloudUpload className="h-16 w-16 text-slate-400" />
                <div className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-400 flex items-center justify-center">
                  <AiOutlineFile className="h-3 w-3 text-white" />
                </div>
              </div>
              <div>
                <p className="text-2xl font-bold text-white mb-2">
                  Drop your files here
                </p>
                <p className="text-slate-400">
                  or click to browse and select files
                </p>
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                {[
                  "Images",
                  "Documents",
                  "Audio",
                  "Video",
                  "Archives",
                  "Any file type",
                ].map((type) => (
                  <span
                    key={type}
                    className="px-3 py-1 bg-slate-800 text-red-400 rounded-full text-xs border border-slate-700"
                  >
                    {type}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {files.length > 0 && (
            <div className="border border-slate-700 rounded-xl bg-slate-900 overflow-hidden">
              <div className="border-b border-slate-700 bg-slate-800 px-6 py-4">
                <h4 className="font-bold text-white flex items-center gap-2">
                  <AiOutlineFile className="h-5 w-5 text-red-400" />
                  Selected Files ({files.length})
                </h4>
              </div>
              <div className="p-6 space-y-3">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-slate-800 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {getFileIcon(file.name)}
                      <div>
                        <div className="text-white">{file.name}</div>
                        <div className="text-sm text-slate-400">
                          {(file.size / 1024).toFixed(1)} KB
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded-lg transition-colors"
                    >
                      <AiOutlineDelete className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="border border-slate-700 rounded-xl overflow-hidden bg-slate-900">
          <div className="border-b border-slate-700 bg-slate-800 px-6 py-4">
            <h3 className="font-bold text-white flex items-center gap-2">
              <AiOutlineFileText className="h-5 w-5 text-red-400" />
              Share Text or Notes
            </h3>
          </div>
          <div className="relative">
            <textarea
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              placeholder="Type or paste your text here...

You can share:
• Notes and reminders
• Code snippets
• Messages
• Any text content"
              className="w-full h-80 p-6 bg-slate-900 text-white text-sm resize-none border-0 focus:outline-none focus:ring-2 focus:ring-red-400 placeholder-slate-500 leading-relaxed"
            />
            <div className="absolute bottom-4 right-4 text-xs text-slate-500">
              {textContent.length} characters
            </div>
          </div>
        </div>
      )}

      {/* Share Button */}
      <div className="mt-8 flex justify-center">
        <button className="group flex items-center gap-3 px-8 py-4 bg-red-400 text-white rounded-xl border-2 border-red-400 hover:bg-transparent hover:text-red-400 transition-all duration-300 font-bold text-lg shadow-lg shadow-red-400/20 hover:shadow-red-400/40">
          <AiOutlineLink className="h-6 w-6 group-hover:rotate-12 transition-transform duration-300" />
          Generate Share Link
        </button>
      </div>
    </div>
  );
}
