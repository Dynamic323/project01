import {
  AiOutlineLink,
  AiOutlineFile,
  AiOutlineFileText,
} from "react-icons/ai";
import { Code } from "lucide-react";
import Spinner from "./Spinner";

export function UploadModal({
  uploadType,
  files,
  contentTitle,
  setContentTitle,
  contentType,
  setContentType,
  isPublic,
  setIsPublic,
  dayName,
  handleSubmit,
  isSubmitting,
  handleCancelSubmit,
  isFreePlan,
  getFileIcon,
  onBack,
}) {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <button
        className="underline text-red-400 px-4 py-2 mb-6"
        onClick={onBack}
      >
        Back
      </button>
      <div className="bg-slate-800 rounded-xl p-6 shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title Section */}
          <div>
            <label className="block text-white text-xl font-medium mb-2">
              {uploadType === "files"
                ? `File Name${files.length > 1 ? "s" : ""}`
                : "Save as (Title)"}
            </label>
            {uploadType === "files" ? (
              <div className="space-y-3 max-h-40 overflow-y-auto pr-2">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center gap-2">
                    {getFileIcon(file.name)}
                    <span className="text-white">{file.name}</span>
                  </div>
                ))}
              </div>
            ) : (
              <input
                className="w-full text-xl p-2 bg-slate-900 text-white border-b-2 border-slate-600 focus:border-red-400 outline-none rounded"
                type="text"
                value={contentTitle}
                onChange={(e) => setContentTitle(e.target.value)}
                placeholder="Enter a title"
                required
              />
            )}
          </div>

          {/* Expiry Section */}
          <div className="flex items-center justify-between p-4 bg-slate-900 rounded-lg">
            <p className="text-white">
              Will expire:{" "}
              <span className="font-bold text-red-400">
                {dayName} (in 2 days)
              </span>
            </p>
            <button
              type="button"
              className="text-sm text-red-400 border border-red-400 px-3 py-1 rounded hover:bg-red-400 hover:text-white transition"
              onClick={() => {
                isFreePlan
                  ? toast.error("Upgrade your Account to use this feature!")
                  : toast.info("Expiry change feature coming soon!");
              }}
            >
              Change Expiry
            </button>
          </div>

          {/* Visibility Section */}
          <div className="flex items-center gap-4 p-4 bg-slate-900 rounded-lg">
            <span className="text-white">Visibility:</span>
            <div className="flex gap-2">
              <button
                type="button"
                className={`px-4 py-2 rounded-lg transition-colors ${
                  isPublic
                    ? "bg-red-400 text-white"
                    : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                }`}
                onClick={() => setIsPublic(true)}
              >
                Public
              </button>
              <button
                type="button"
                className={`px-4 py-2 rounded-lg transition-colors ${
                  !isPublic
                    ? "bg-red-400 text-white"
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
            <div className="p-4 bg-slate-900 rounded-lg">
              <label className="block text-white mb-2">Type:</label>
              <select
                className="w-full bg-slate-800 p-2 rounded border border-slate-700 focus:border-red-400 outline-none"
                value={contentType}
                onChange={(e) => setContentType(e.target.value)}
              >
                <option value="text">Text</option>
                <option value="code">Code</option>
              </select>
            </div>
          )}

          {/* Submit and Cancel Buttons */}
          <div className="flex justify-end gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all ${
                isSubmitting
                  ? "bg-slate-700 text-slate-400 cursor-not-allowed"
                  : "bg-red-400 text-white hover:bg-red-500"
              }`}
            >
              {isSubmitting ? (
                <>
                  <Spinner />
                  Generating Link...
                </>
              ) : (
                <>
                  <AiOutlineLink />
                  Generate Share Link
                </>
              )}
            </button>
            {isSubmitting && (
              <button
                type="button"
                onClick={handleCancelSubmit}
                className="flex items-center gap-2 px-6 py-3 bg-transparent text-red-400 border border-red-400 rounded-lg hover:bg-red-400/10 transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
