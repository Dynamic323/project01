
import {
  AiOutlineFile,
  AiOutlinePlus,
  AiOutlineSearch,
  AiOutlineEye,
  AiOutlineCopy,
  AiOutlinePicture,
  AiOutlineAudio,
  AiOutlineVideoCamera,
} from "react-icons/ai"

export function FilesPage() {
  const files = [
    {
      id: 1,
      title: "family-vacation.jpg",
      type: "image",
      description: "Beach vacation photos from last summer",
      size: "2.4 MB",
      views: 156,
      tags: ["photos", "vacation", "family"],
    },
    {
      id: 2,
      title: "project-proposal.pdf",
      type: "document",
      description: "Business proposal for new client",
      size: "1.8 MB",
      views: 89,
      tags: ["business", "proposal", "document"],
    },
    {
      id: 3,
      title: "demo-song.mp3",
      type: "audio",
      description: "Music demo recording",
      size: "5.2 MB",
      views: 203,
      tags: ["music", "demo", "audio"],
    },
  ]

  const getFileIcon = (type) => {
    switch (type) {
      case "image":
        return <AiOutlinePicture className="h-5 w-5 text-red-400" />
      case "audio":
        return <AiOutlineAudio className="h-5 w-5 text-red-400" />
      case "video":
        return <AiOutlineVideoCamera className="h-5 w-5 text-red-400" />
      default:
        return <AiOutlineFile className="h-5 w-5 text-red-400" />
    }
  }

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

      <div className="grid gap-6">
        {files.map((file) => (
          <div
            key={file.id}
            className="bg-slate-900 border border-slate-700 rounded-lg overflow-hidden hover:border-slate-600 transition-colors"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white">{file.title}</h3>
                  <p className="text-slate-400 text-sm mt-1">{file.description}</p>
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
                  {file.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-slate-800 text-slate-300 rounded text-xs border border-slate-700"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
                <button className="flex items-center gap-1 px-3 py-1 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded border border-slate-700 hover:border-slate-600 transition-colors text-sm">
                  <AiOutlineCopy className="h-3 w-3" />
                  Copy Link
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
