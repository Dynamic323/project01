import FileItem from "./FileItem";
import {
  AiOutlineCloudUpload,
  AiOutlineFile,
} from "react-icons/ai";
// FileUploadSection component
export default function FileUploadSection({
  isDragOver,
  files,
  isFreePlan,
  handleDragOver,
  handleDragLeave,
  handleDrop,
  handleFileSelect,
  removeFile,
  handleFilenameEdit,
  getFileIcon,
  calculateTotalSize,
  FREE_PLAN_MAX_SIZE_MB
}) {
  return (
    <div className="space-y-6">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-xl p-16 text-center transition-all ${
          isDragOver
            ? "border-red-400 bg-slate-800/50"
            : "border-slate-600 bg-slate-900 hover:border-red-400/50"
        }`}
      >
        <input
          type="file"
          multiple
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div className="flex flex-col items-center gap-6">
          <AiOutlineCloudUpload className="text-5xl text-slate-400" />
          <div>
            <p className="text-2xl font-bold text-white mb-2">
              Drop your files here
            </p>
            <p className="text-slate-400">or click to browse</p>
            {isFreePlan && (
              <p className="text-yellow-400 text-sm mt-2">
                Free plan limit: {FREE_PLAN_MAX_SIZE_MB}MB max
              </p>
            )}
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            {["Images", "Documents", "Audio", "Video", "Archives"].map(
              (type) => (
                <span
                  key={type}
                  className="px-4 py-2 bg-slate-800 text-red-400 rounded-full text-xs border border-slate-700"
                >
                  {type}
                </span>
              )
            )}
          </div>
        </div>
      </div>

      {files.length > 0 && (
        <div className="border border-slate-700 rounded-xl bg-slate-900 overflow-hidden">
          <div className="border-b border-slate-700 bg-slate-800 px-6 py-4">
            <h4 className="font-bold text-white flex items-center gap-2">
              <AiOutlineFile className="text-red-400" />
              Selected Files ({files.length})
              <span className="text-xs text-yellow-400 ml-2">
                (Max {FREE_PLAN_MAX_SIZE_MB}MB for free plan)
              </span>
            </h4>
          </div>
          <div className="p-6 space-y-3">
            {files.map((file, index) => (
              <FileItem
                key={index}
                file={file}
                index={index}
                removeFile={removeFile}
                handleFilenameEdit={handleFilenameEdit}
                getFileIcon={getFileIcon}
                isFreePlan={isFreePlan}
              />
            ))}
            <div className="text-xs text-yellow-400 mt-2">
              Total size:{" "}
              {(calculateTotalSize(files) / (1024 * 1024)).toFixed(2)} MB
              /{FREE_PLAN_MAX_SIZE_MB}MB
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
