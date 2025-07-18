
import { AiOutlineDatabase, AiOutlineCloudUpload, AiOutlinePieChart, AiOutlineFile } from "react-icons/ai"

export function StoragePage() {
  const storageData = {
    used: 2.4,
    total: 10,
    files: 156,
    folders: 12,
  }

  const fileTypes = [
    { type: "Images", size: 1.2, count: 45, color: "bg-blue-500" },
    { type: "Documents", size: 0.8, count: 32, color: "bg-green-500" },
    { type: "Audio", size: 0.3, count: 28, color: "bg-purple-500" },
    { type: "Videos", size: 0.1, count: 51, color: "bg-orange-500" },
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3 mb-2">
          <AiOutlineDatabase className="h-8 w-8 text-red-400" />
          Storage Overview
        </h1>
        <p className="text-slate-400">Monitor your storage usage and manage your files</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Storage Overview */}
        <div className="lg:col-span-2">
          <div className="bg-slate-900 border border-slate-700 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
              <AiOutlinePieChart className="h-5 w-5 text-red-400" />
              Storage Usage
            </h2>

            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-300">Space Used</span>
                <span className="text-white">
                  {storageData.used} GB of {storageData.total} GB
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-3 border border-slate-600">
                <div
                  className="bg-red-400 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${(storageData.used / storageData.total) * 100}%` }}
                ></div>
              </div>
              <div className="text-sm text-slate-400 mt-1">
                {((storageData.used / storageData.total) * 100).toFixed(1)}% of your storage is used
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-800 border border-slate-600 rounded-lg p-4">
                <div className="text-2xl font-bold text-white">{storageData.files}</div>
                <div className="text-slate-400 text-sm">Total Files</div>
              </div>
              <div className="bg-slate-800 border border-slate-600 rounded-lg p-4">
                <div className="text-2xl font-bold text-white">{storageData.folders}</div>
                <div className="text-slate-400 text-sm">Folders</div>
              </div>
            </div>
          </div>

          {/* File Types Breakdown */}
          <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
              <AiOutlineFile className="h-5 w-5 text-red-400" />
              File Types
            </h2>

            <div className="space-y-4">
              {fileTypes.map((fileType) => (
                <div key={fileType.type} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded ${fileType.color}`}></div>
                    <span className="text-white">{fileType.type}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-slate-400">{fileType.count} files</span>
                    <span className="text-white">{fileType.size} GB</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Storage Actions */}
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
                <div className="text-sm text-slate-400">10 GB Storage</div>
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
  )
}
