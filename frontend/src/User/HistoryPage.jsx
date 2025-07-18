"use client"

import {
  AiOutlineHistory,
  AiOutlineLink,
  AiOutlineEye,
  AiOutlineDelete,
  AiOutlineCalendar,
  AiOutlineFile,
  AiOutlinePicture,
  AiOutlineAudio,
} from "react-icons/ai"

export function HistoryPage() {
  const historyItems = [
    {
      id: 1,
      title: "vacation-photos.zip",
      type: "file",
      fileType: "archive",
      createdAt: "2024-01-15",
      views: 42,
      link: "https://dyshare.x/abc123",
      size: "24.8 MB",
    },
    {
      id: 2,
      title: "Meeting Notes",
      type: "text",
      fileType: "text",
      createdAt: "2024-01-14",
      views: 18,
      link: "https://dyshare.x/def456",
      size: "1.2 KB",
    },
    {
      id: 3,
      title: "presentation.pdf",
      type: "file",
      fileType: "document",
      createdAt: "2024-01-13",
      views: 67,
      link: "https://dyshare.x/ghi789",
      size: "3.2 MB",
    },
    {
      id: 4,
      title: "song-demo.mp3",
      type: "file",
      fileType: "audio",
      createdAt: "2024-01-12",
      views: 23,
      link: "https://dyshare.x/jkl012",
      size: "5.1 MB",
    },
  ]

  const getFileIcon = (fileType) => {
    switch (fileType) {
      case "image":
        return <AiOutlinePicture className="h-5 w-5 text-red-400" />
      case "audio":
        return <AiOutlineAudio className="h-5 w-5 text-red-400" />
      default:
        return <AiOutlineFile className="h-5 w-5 text-red-400" />
    }
  }

  return (
    <div className="p-8 w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3 mb-2">
          <AiOutlineHistory className="h-8 w-8 text-red-400" />
          Sharing History
        </h1>
        <p className="text-slate-400">View and manage all your shared files and text</p>
      </div>

      <div className="grid gap-4">
        {historyItems.map((item) => (
          <div
            key={item.id}
            className="bg-slate-900 border border-slate-700 rounded-lg p-6 hover:border-slate-600 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-800 border border-slate-600 rounded-lg flex items-center justify-center">
                  {getFileIcon(item.fileType)}
                </div>
                <div>
                  <h3 className="text-white font-semibold">{item.title}</h3>
                  <div className="flex items-center gap-4 mt-1 text-sm text-slate-400">
                    <span className="flex items-center gap-1">
                      <AiOutlineCalendar className="h-3 w-3" />
                      {item.createdAt}
                    </span>
                    <span>{item.size}</span>
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
        ))}
      </div>
    </div>
  )
}
