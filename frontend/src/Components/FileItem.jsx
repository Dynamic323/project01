import {
  AiOutlineDelete,
  AiOutlineEdit,
} from "react-icons/ai";

// FileItem component
export default function FileItem({ file, index, removeFile, handleFilenameEdit, getFileIcon, isFreePlan }) {
  return (
    <div className="flex items-center justify-between p-4 bg-slate-800 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors">
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
        {/* {!isFreePlan && ( */}
          <button
            onClick={() => handleFilenameEdit(index)}
            className="p-2 text-slate-400 hover:text-blue-400 transition-colors"
            title="Edit filename"
          >
            <AiOutlineEdit />
          </button>
        {/* )} */}
        <button
          onClick={() => removeFile(index)}
          className="p-2 text-slate-400 hover:text-red-400 transition-colors"
          title="Remove file"
        >
          <AiOutlineDelete />
        </button>
      </div>
    </div>
  );
}