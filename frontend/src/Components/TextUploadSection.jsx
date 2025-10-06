import { Code } from "lucide-react";
import {
  AiOutlineFileText,
} from "react-icons/ai";


// TextUploadSection component
export default function TextUploadSection({ textContent, setTextContent, setHasUnsavedChanges }) {
  return (
    <div className="border border-slate-700 rounded-xl overflow-hidden bg-slate-900">
      <div className="border-b border-slate-700 bg-slate-800 px-6 py-4">
        <h3 className="font-bold text-white flex items-center gap-2">
          <AiOutlineFileText className="h-5 w-5 text-red-400" /> Share Text
          or <Code className="h-5 w-5 text-red-400" /> Code snippets
        </h3>
      </div>
      <div className="relative">
        <textarea
          value={textContent}
          onChange={(e) => {
            setTextContent(e.target.value);
            setHasUnsavedChanges(true);
          }}
          placeholder="Type or paste your text here..."
          className="w-full h-80 p-6 bg-slate-900 text-white text-sm resize-none border-0 focus:outline-none focus:ring-2 focus:ring-red-400 placeholder-slate-500 leading-relaxed"
        />
        <div className="absolute bottom-4 right-4 text-xs text-slate-500">
          {textContent.length} characters
        </div>
      </div>
    </div>
  );
}
