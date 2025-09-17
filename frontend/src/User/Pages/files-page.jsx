import { useEffect, useState } from "react";
import {
  AiOutlineFile,
  AiOutlinePlus,
  AiOutlineSearch,
  AiOutlineEye,
  AiOutlineCopy,
  AiOutlinePicture,
  AiOutlineAudio,
  AiOutlineVideoCamera,
} from "react-icons/ai";
import { useAuth } from "../../context/Authcontext";
import { toast } from "react-toastify";
import { useDashboard } from "../../context/DashboardContext ";

export function FilesPage() {
  const { user } = useAuth();
  const { getValue, setValue } = useDashboard();
  const files = getValue("files");
  const [loading, setLoading] = useState(false);
  const BaseURl = "http://localhost:3000";

  useEffect(() => {
    const fetchFiles = async () => {
      if (!files && user?.uid) {
        setLoading(true);
        try {
          const res = await fetch(`http://localhost:4000/api/user/${user.uid}`);
          const data = await res.json();
          setValue("files", Array.isArray(data) ? data : data.files || []);
        } catch (err) {
          console.error("Error fetching files:", err);
          setValue("files", []);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchFiles();
  }, [user]);

  const getFileIcon = (type) => {
    switch (type) {
      case "image":
        return <AiOutlinePicture className="h-5 w-5 text-red-400" />;
      case "audio":
        return <AiOutlineAudio className="h-5 w-5 text-red-400" />;
      case "video":
        return <AiOutlineVideoCamera className="h-5 w-5 text-red-400" />;
      default:
        return <AiOutlineFile className="h-5 w-5 text-red-400" />;
    }
  };

  const handleCopy = (link) => {
    navigator.clipboard.writeText(link);
    toast.success("Link copied to clipboard!");
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3 mb-2">
              <AiOutlineFile className="h-8 w-8 text-red-400" />
              My Files
            </h1>
            <p className="text-slate-400">Manage all your uploaded files</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-red-400 text-white rounded-lg font-semibold hover:bg-red-300 transition-colors border border-slate-600">
            <AiOutlinePlus className="h-4 w-4" />
            Upload New File
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <AiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search your files..."
            className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:border-red-400 focus:outline-none transition-colors"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center text-slate-400 pt-6">Loading files…</div>
      ) : (
        <div className="grid gap-6">
          {Array.isArray(files) && files.length > 0 ? (
            files.map((file) => (
              <div
                key={file.id}
                className="bg-slate-900 border border-slate-700 rounded-lg overflow-hidden hover:border-slate-600 transition-colors"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        {file.title}
                      </h3>
                      <p className="text-slate-400 text-sm mt-1">
                        {file.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getFileIcon(file.type)}
                      <span className="px-2 py-1 bg-slate-800 text-red-400 rounded text-xs border border-slate-600">
                        {file.type}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-slate-400">
                      <span>{file.size}</span>
                      <span className="flex items-center gap-1">
                        <AiOutlineEye className="h-3 w-3" />
                        {file.views} views
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {file.tags?.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-slate-800 text-slate-300 rounded text-xs border border-slate-700"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <button
                      onClick={() => handleCopy(`${BaseURl}/files/${file.id}`)}
                      className="flex items-center gap-1 px-3 py-1 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded border border-slate-700 hover:border-slate-600 transition-colors text-sm"
                    >
                      <AiOutlineCopy className="h-3 w-3" />
                      Copy Link
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-slate-400 pt-6">
              <p className="mb-4">You have no files uploaded yet…</p>
              <button className="flex items-center gap-2 px-4 py-2 bg-red-400 text-white rounded-lg font-semibold hover:bg-red-300 transition-colors border border-slate-600 mx-auto">
                <AiOutlinePlus className="h-4 w-4" />
                Upload Your First File
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
