import {
  AiOutlineHistory,
  AiOutlineLink,
  AiOutlineEye,
  AiOutlineDelete,
  AiOutlineCalendar,
  AiOutlineFile,
  AiOutlinePicture,
  AiOutlineAudio,
  AiOutlinePlus,
} from "react-icons/ai";
import { useEffect, useState } from "react";
import { useAuth } from "../context/Authcontext";
import { toast } from "react-toastify";
import { useDashboard } from "../context/DashboardContext";
import Loader from "../Components/Loader";

export function HistoryPage() {
  const { getValue, setValue } = useDashboard();
  const [loading, setloading] = useState(false);
  const { user } = useAuth();
  const history = getValue("user-history");

  useEffect(() => {
    async function fetchHistory() {
      if (!history) {
        setloading(true);
        try {
          const res = await fetch(
            `http://localhost:4000/api/user-history/${user.uid}`
          );
          const data = await res.json();
          setValue(
            "user-history",
            Array.isArray(data) ? data : data.files || []
          );
        } catch (error) {
          toast.error("Error in getting History...");
          console.log(error);
          setValue("user-history", []);
        } finally {
          setloading(false);
        }
      }
    }
    fetchHistory();
  }, [user]);

  const getFileIcon = (fileType) => {
    if (!fileType) return <AiOutlineFile className="h-5 w-5 text-red-400" />;

    if (fileType.startsWith("image"))
      return <AiOutlinePicture className="h-5 w-5 text-red-400" />;
    if (fileType.startsWith("audio"))
      return <AiOutlineAudio className="h-5 w-5 text-red-400" />;

    return <AiOutlineFile className="h-5 w-5 text-red-400" />;
  };

  const formatSize = (bytes) => {
    const b = Number(bytes);
    if (!b) return "0 B";
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(b) / Math.log(1024));
    return `${(b / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
  };

  return (
    <div className="p-8 w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3 mb-2">
          <AiOutlineHistory className="h-8 w-8 text-red-400" />
          Sharing History
        </h1>
        <p className="text-slate-400">
          View and manage all your shared files and text
        </p>
      </div>

      {loading ? (
        <Loader isdashboard={true} text={"Please Wait,  Loading Text...."} />
      ) : (
        // <div className="text-center text-slate-400 pt-6">Loading files…</div>
        <div className="grid gap-4">
          {Array.isArray(history) && history.length > 0 ? (
            history.map((item) => (
              <div
                key={item.id}
                className="bg-slate-900 border border-slate-700 rounded-lg p-6 hover:border-slate-600 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-800 border border-slate-600 rounded-lg flex items-center justify-center">
                      {getFileIcon(item.file_type)}
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">{item.title}</h3>
                      <div className="flex items-center gap-4 mt-1 text-sm text-slate-400">
                        <span className="flex items-center gap-1">
                          <AiOutlineCalendar className="h-3 w-3" />
                          {new Date(item.created_at).toLocaleString()}
                        </span>
                        <span>{formatSize(item.file_size)}</span>
                        <span className="flex items-center gap-1">
                          <AiOutlineEye className="h-3 w-3" />
                          {item.views} views
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors">
                      <AiOutlineLink className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors">
                      <AiOutlineEye className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors">
                      <AiOutlineDelete className="h-4 w-4" />
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
