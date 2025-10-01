import { AiOutlineFile, AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
// import { getFileIcon } from "./Dropzone";

export function FileList({
  files,
  isFreePlan,
  handleFilenameEdit,
  getFileIcon,
  removeFile,
  FREE_PLAN_MAX_SIZE_MB,
}) {
  const calculateTotalSize = (fileList) => {
    return fileList.reduce((total, file) => total + file.size, 0);
  };

  return (
    <div className="border border-slate-700 rounded-xl bg-slate-900 overflow-hidden">
      <div className="border-b border-slate-700 bg-slate-800 px-6 py-4">
        <h4 className="font-bold text-white flex items-center gap-2">
          <AiOutlineFile className="text-red-400" />
          Selected Files ({files.length})
          {isFreePlan && (
            <span className="text-xs text-yellow-400 ml-2">
              (Max {FREE_PLAN_MAX_SIZE_MB}MB for free plan)
            </span>
          )}
        </h4>
      </div>
      <div className="p-6 space-y-3 max-h-64 overflow-y-auto">
        {files.map((file, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 bg-slate-800 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors"
          >
            <div className="flex items-center gap-3">
              {getFileIcon(file.name)}
              <div>
                <div className="text-white font-medium">{file.name}</div>
                <div className="text-sm text-slate-400">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleFilenameEdit(index)}
                className="p-2 text-slate-400 hover:text-blue-400 transition-colors"
                title="Edit filename"
                disabled={isFreePlan}
              >
                <AiOutlineEdit />
              </button>
              <button
                onClick={() => removeFile(index)}
                className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                title="Remove file"
              >
                <AiOutlineDelete />
              </button>
            </div>
          </div>
        ))}
        {isFreePlan && (
          <div className="text-xs text-yellow-400 mt-2">
            Total size: {(calculateTotalSize(files) / (1024 * 1024)).toFixed(2)}
            MB /{FREE_PLAN_MAX_SIZE_MB}MB
          </div>
        )}
      </div>
    </div>
  );
}
