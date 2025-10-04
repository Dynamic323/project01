import { useEffect, useState } from "react";
import {
  AiOutlineDatabase,
  AiOutlineCloudUpload,
  AiOutlinePieChart,
  AiOutlineFile,
} from "react-icons/ai";
import { useAuth } from "../../context/Authcontext";
import { toast } from "react-toastify";
import Loader, { Subloader } from "../../Components/Loader";
import { useDashboard } from "../../context/DashboardContext";
import { BackendURL } from "../../utils/file-helper";

const typeColors = {
  Images: "bg-blue-500",
  Documents: "bg-green-500",
  Audio: "bg-purple-500",
  Videos: "bg-orange-500",
};

function formatMB(mb) {
  if (mb === null || mb === undefined) return "0 MB";
  const n = Number(mb);
  if (n >= 1024) return `${(n / 1024).toFixed(2)} GB`;
  return `${n.toFixed(2)} MB`;
}

export function StoragePage() {
  const { user } = useAuth();

  const { getValue, setValue } = useDashboard();

  const initialData = getValue("user-storageData");
  const [loading, setLoading] = useState(!initialData);
  const storageData = initialData || null;
  useEffect(() => {
    async function fetchStorage() {
      if (!initialData) {
        try {
          const res = await fetch(
            `${BackendURL}/api/storage-info/${user.uid}`
          );
          const data = await res.json();
          setValue("user-storageData", data);
          console.log(data);
        } catch (err) {
          toast.error("Failed to fetch storage details");
          console.error("Failed to fetch storage:", err);
          setValue("user-storageData", {});
        } finally {
          setLoading(false);
        }
      }
    }
    fetchStorage();
  }, [user.uid, setValue, initialData]);

  if (loading)
    return (
      <Subloader
        text={"Loading Storage info...."}
      />
    );
  if (!storageData)
    return <div className="p-8 text-red-400">Failed to load storage.</div>;

  const { used, total, files, text, types, remaining } = storageData;
  const pct = total > 0 ? Math.min(100, (used / total) * 100) : 0;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3 mb-2">
          <AiOutlineDatabase className="h-8 w-8 text-red-400" />
          Storage Overview
        </h1>
        <p className="text-slate-400">
          Monitor your storage usage and manage your files & texts
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main */}
        <div className="lg:col-span-2">
          <div className="bg-slate-900 border border-slate-700 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
              <AiOutlinePieChart className="h-5 w-5 text-red-400" />
              Storage Usage
            </h2>

            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-300">Space Used</span>
                <span className="text-white">
                  {formatMB(used)} of {formatMB(total)}
                </span>
              </div>

              <div className="w-full bg-slate-800 rounded-full h-3 border border-slate-600">
                <div
                  className="bg-red-400 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <div className="text-sm text-slate-400 mt-1">
                {pct.toFixed(1)}% used • {formatMB(remaining)} remaining
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-800 border border-slate-600 rounded-lg p-4">
                <div className="text-2xl font-bold text-white">{files}</div>
                <div className="text-slate-400 text-sm">Total Files</div>
              </div>
              <div className="bg-slate-800 border border-slate-600 rounded-lg p-4">
                <div className="text-2xl font-bold text-white">{text}</div>
                <div className="text-slate-400 text-sm">
                  Text uploads (text + code)
                </div>
              </div>
            </div>
          </div>

          {/* File Types */}
          <div className="bg-slate-900 border border-slate-700 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
              <AiOutlineFile className="h-5 w-5 text-red-400" />
              File Types
            </h2>

            <div className="space-y-4">
              {Array.isArray(types?.file) &&
                types.file.map((ft) => (
                  <div
                    key={ft.type}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 rounded ${
                          typeColors[ft.type] || "bg-gray-500"
                        }`}
                      />
                      <span className="text-white">{ft.type}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-slate-400">{ft.count} files</span>
                      <span className="text-white">{formatMB(ft.size)}</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Text Types - similar style to File Types */}
          <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
              <AiOutlineFile className="h-5 w-5 text-red-400" />
              Text / Code Usage
            </h2>

            <div className="space-y-4">
              {types?.text ? (
                <>
                  {Object.entries(types.text).map(([k, v]) => (
                    <div key={k} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded bg-slate-600" />
                        <span className="text-white">{k}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-slate-400">{v.count} items</span>
                        <span className="text-white">
                          {formatMB(v.amountUsed)}
                        </span>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <div className="text-slate-400">No text data</div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
            <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center gap-2 p-3 bg-red-400 text-white rounded-lg font-semibold hover:bg-red-300 transition-colors border border-slate-600">
                <AiOutlineCloudUpload className="h-4 w-4" />
                Upgrade Storage
              </button>
              <button className="w-full flex items-center gap-2 p-3 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors border border-slate-600">
                <AiOutlineDatabase className="h-4 w-4" />
                Clean Up Files
              </button>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
            <h3 className="text-lg font-bold text-white mb-4">Storage Plans</h3>
            <div className="space-y-4">
              <div className="p-3 bg-slate-800 border border-slate-600 rounded-lg">
                <div className="text-white font-semibold">Free Plan</div>
                <div className="text-sm text-slate-400">500 MB Storage</div>
                <div className="text-xs text-red-400 mt-1">Current Plan</div>
              </div>
              <div className="p-3 bg-slate-800 border border-slate-600 rounded-lg">
                <div className="text-white font-semibold">Pro Plan</div>
                <div className="text-sm text-slate-400">100 GB Storage</div>
                <div className="text-xs text-slate-400 mt-1">$9.99/month</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
