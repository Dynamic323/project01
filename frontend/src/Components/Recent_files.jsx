import React, { useEffect, useState } from "react";
import { useDashboard } from "../context/DashboardContext";
import { toast } from "react-toastify";
import { useAuth } from "../context/Authcontext";
import {
  AiOutlineAudio,
  AiOutlineFile,
  AiOutlinePicture,
} from "react-icons/ai";
import { Code, Text } from "lucide-react";
import { BackendURL } from "../utils/file-helper";

function Recent_files() {
  const { getValue, setValue } = useDashboard();
  const [loading, setloading] = useState(false);
  const history = getValue("user-mini-history") || [];
  const { user } = useAuth();

  useEffect(() => {
    async function FetchHistory_mini() {
      if (!history.length) {
        setloading(true);

        try {
          const res = await fetch(
            `${BackendURL}api/user/all/${user.authUser.uid}`
          );
          const response = await res.json();

          const data = response.uploads.slice(1, 4);
          setValue(
            "user-mini-history",
            Array.isArray(data) ? data : data.files || []
          );
        } catch (err) {
          toast.error("Error in getting History....");
          setValue("user-mini-history", []);
        } finally {
          setloading(false);
        }
      }
    }
    FetchHistory_mini();
  }, []);

  const getFileIcon = (fileType) => {
    if (!fileType) return <AiOutlineFile className="h-5 w-5 text-red-400" />;

    if (fileType.startsWith("image"))
      return <AiOutlinePicture className="h-5 w-5 text-red-400" />;
    if (fileType.startsWith("audio"))
      return <AiOutlineAudio className="h-5 w-5 text-red-400" />;
    if (fileType.startsWith("text")) {
      return <Text className="h-5 w-5 text-red-400" />;
    }
    return <AiOutlineFile className="h-5 w-5 text-red-400" />;
  };

  function timeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) {
      return `${seconds} sec${seconds !== 1 ? "s" : ""} ago`;
    }

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
      return `${minutes} min${minutes !== 1 ? "s" : ""} ago`;
    }

    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
      return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
    }

    const days = Math.floor(hours / 24);
    if (days < 30) {
      return `${days} day${days !== 1 ? "s" : ""} ago`;
    }

    const months = Math.floor(days / 30);
    if (months < 12) {
      return `${months} month${months !== 1 ? "s" : ""} ago`;
    }

    const years = Math.floor(months / 12);
    return `${years} year${years !== 1 ? "s" : ""} ago`;
  }

  return (
    <div>
      <div className="mt-8">
        <h3 className="text-lg font-medium text-slate-100 mb-4 font-mono">
          Recent Files
        </h3>
        <div className="bg-slate-800 border border-slate-600 rounded-lg">
          <div className="px-4 py-3 border-b border-slate-600">
            <div className="flex items-center justify-between text-sm text-slate-400 font-mono">
              <span>Name</span>
              <span>Date</span>
            </div>
          </div>
          {loading ? (
            "Loading"
          ) : (
            <div className="divide-y divide-slate-600">
              {history.map((item, index) => (
                <div
                  key={index}
                  className="px-4 py-3 hover:bg-slate-700 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Code className="w-4 h-4 text-red-400" />
                      <span className="text-sm text-slate-300 font-mono">
                        {item.title}
                      </span>
                      <div className="w-5 h-3   rounded-lg flex items-center justify-center">
                        {getFileIcon(item.file_type)}
                      </div>
                    </div>
                    <span className="text-xs text-slate-500 font-mono">
                      {timeAgo(item.created_at)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Recent_files;
