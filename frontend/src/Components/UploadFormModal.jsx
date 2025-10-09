import { AiOutlineDelete, AiOutlineLink, AiOutlineEdit } from "react-icons/ai";
import Spinner from "./Spinner";
import { Code, StepBack } from "lucide-react";
import { toast } from "react-toastify";

export default function UploadFormModal({
  uploadType,
  files,
  contentTitle,
  setContentTitle,
  dayName,
  isPublic,
  setIsPublic,
  contentType,
  setContentType,
  removeFile,
  isSubmitting,
  handleSubmit,
  handleCancelSubmit,
  isFreePlan,
  handleFilenameEdit,
  getFileIcon,
  setShowmodal,
  fileNames,
}) {
  return (
    <div className="max-w-3xl mx-auto p-3  w-full">
      <button
        className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors mb-4 sm:mb-6"
        onClick={() => setShowmodal(false)}
      >
        <StepBack className="h-4 w-4 sm:h-5 sm:w-5" />
        <span className="text-sm sm:text-base">Back</span>
      </button>

      <div className="bg-slate-800 rounded-xl p-3 sm:p-6 shadow-xl border border-slate-700">
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Title Section */}
          <div>
            <label className="block text-white text-lg sm:text-xl font-medium mb-2">
              {uploadType === "files"
                ? `File Name${files.length > 1 ? "s" : ""}`
                : "Save as (Title)"}
            </label>
            {uploadType === "files" ? (
              <div className="space-y-2 sm:space-y-3 max-h-40 sm:max-h-56 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800 hover:scrollbar-thumb-slate-500">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 sm:p-3 bg-slate-700 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      {getFileIcon(file.name)}
                      <span className="text-xs sm:text-sm text-white">
                        {fileNames[index] || file.name}
                      </span>
                    </div>
                    <div className="flex">
                      <button
                        onClick={() => handleFilenameEdit(index)}
                        type="button"
                        className="p-1 text-slate-400 hover:text-blue-400 transition-colors"
                        title="Edit filename"
                      >
                        <AiOutlineEdit className="h-4 w-4 sm:h-5 sm:w-5" />
                      </button>
                      <button
                        onClick={() => {
                          removeFile(index);
                          setShowmodal(false);
                        }}
                        className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                        title="Remove file"
                      >
                        <AiOutlineDelete />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <input
                className="w-full text-base sm:text-xl p-2 sm:p-3 bg-slate-900 text-white border border-slate-700 focus:border-red-400 outline-none rounded-lg transition-colors"
                type="text"
                value={contentTitle}
                onChange={(e) => setContentTitle(e.target.value)}
                placeholder="Enter a title"
                required
              />
            )}
          </div>

          {/* Expiry Section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-slate-900 rounded-lg border border-slate-700">
            <p className="text-white text-sm sm:text-base mb-2 sm:mb-0">
              Will expire:{" "}
              <span className="font-bold text-red-400">
                {dayName} (in 2 days)
              </span>
            </p>
            <button
              type="button"
              className="text-xs sm:text-sm text-red-400 border border-red-400 px-2 sm:px-3 py-1 rounded-lg hover:bg-red-400 hover:text-white transition-colors w-full sm:w-auto"
              onClick={() => {
                if (isFreePlan) {
                  toast.error("Upgrade your Account to use this feature!");
                } else {
                  toast.info("Expiry change feature coming soon!");
                }
              }}
            >
              Change Expiry
            </button>
          </div>

          {/* Visibility Section */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-slate-900 rounded-lg border border-slate-700">
            <span className="text-white text-sm sm:text-base">Visibility:</span>
            <div className="flex gap-2">
              <button
                type="button"
                className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm rounded-lg transition-colors ${
                  isPublic
                    ? "bg-red-400 text-white shadow-md"
                    : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                }`}
                onClick={() => setIsPublic(true)}
              >
                Public
              </button>
              <button
                type="button"
                className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm rounded-lg transition-colors ${
                  !isPublic
                    ? "bg-red-400 text-white shadow-md"
                    : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                }`}
                onClick={() => setIsPublic(false)}
              >
                Private
              </button>
            </div>
          </div>

          {/* Content Type Section */}
          {uploadType !== "files" && (
            <div className="p-3 sm:p-4 bg-slate-900 rounded-lg border border-slate-700">
              <label className="block text-white text-sm sm:text-base mb-2">
                Type:
              </label>
              <select
                className="w-full bg-slate-800 p-2 sm:p-3 text-sm sm:text-base rounded-lg border border-slate-700 focus:border-red-400 outline-none transition-colors"
                value={contentType}
                onChange={(e) => setContentType(e.target.value)}
              >
                <option value="text">Text</option>
                <option value="code">Code</option>
              </select>
            </div>
          )}

          {/* Submit and Cancel Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4">
            <button
              type="submit"
              className={`flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium text-sm sm:text-base transition-all w-full sm:w-auto ${
                isSubmitting
                  ? "bg-slate-700 text-slate-400 cursor-not-allowed"
                  : "bg-red-400 text-white hover:bg-red-500 shadow-md hover:shadow-red-400/30"
              }`}
            >
              {isSubmitting ? (
                <>
                  <Spinner />
                  <span>Generating Link...</span>
                </>
              ) : (
                <>
                  <AiOutlineLink className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span>Generate Share Link</span>
                </>
              )}
            </button>
            {isSubmitting && (
              <button
                type="button"
                onClick={handleCancelSubmit}
                className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-transparent text-red-400 border border-red-400 rounded-lg hover:bg-red-400/10 transition-colors w-full sm:w-auto"
              >
                <AiOutlineDelete className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-sm sm:text-base">Cancel</span>
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
