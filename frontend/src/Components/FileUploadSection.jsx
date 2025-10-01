import { AiOutlineCloudUpload } from "react-icons/ai";

export function FileUploadSection({
  isDragOver,
  handleDragOver,
  handleDragLeave,
  handleDrop,
  handleFileSelect,
  isFreePlan,
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
                  className="px-3 py-1 bg-slate-800 text-red-400 rounded-full text-xs border border-slate-700"
                >
                  {type}
                </span>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
