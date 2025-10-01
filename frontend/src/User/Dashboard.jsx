import React, { useState } from "react";
import { useAuth } from "../context/Authcontext";
import { toast } from "react-toastify";
import { Dropzone } from "../Components/Dropzone";
import { useNavigate } from "react-router-dom";
import { Upload, User, Code, File, Terminal } from "lucide-react";
import Recent_files from "../Components/Recent_files";
function Dashboard() {
  const { logout } = useAuth();

  const navigate = useNavigate();
  const HandelLogout = async () => {
    try {
      await logout();
      toast.success("Log out succesful");
      navigate("/");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const [uploadMode, setuploadMode] = useState("files"); // 'files' or 'text'
  const [dragActive, setDragActive] = useState(false);
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      // Handle file upload
      console.log("Files dropped:", e.dataTransfer.files);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      console.log("Files selected:", e.target.files);
    }
  };

  //   const getPageTitle = () => {
  //   const titles = {
  //     dashboard: "Dashboard",
  //     history: "History",
  //     settings: "Settings",
  //     files: "My Files",
  //     folders: "Folders",
  //     storage: "Storage",
  //   };
  //   return titles[activeTab] || "Dashboard";
  // };

  return (
    <div className="flex-1  flex flex-col">
      {/* Main Content */}
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-100 font-mono">
              Dashboard
            </h2>
            <p className="text-slate-400 mt-1 font-mono text-sm">
              Share your code and text files instantly
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-red-400 rounded-full flex items-center justify-center">
              <span className="text-slate-900 font-bold">U</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-6 bg-slate-900">
        <div className="max-w-4xl mx-auto">
          {/* Upload Mode Toggle */}
          <div className="flex items-center gap-4">
            <div className="text-sm text-slate-400">Welcome back!</div>
            <div className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-full">
              {/* <span className="text-red-400 text-sm">{getPageTitle()}</span> */}
            </div>
          </div>

          {/* <div className="mb-12 text-center">
            <h2 className="text-4xl font-bold text-white mb-4">
              Welcome to DyshareX
            </h2>
            <p className="text-slate-400 text-lg">
              Share your files with the world
            </p>
            <div className="mt-4 flex justify-center">
              <div className="px-4 py-2 bg-slate-800 rounded-full border border-slate-700">
                <span className="text-red-400 text-sm">Ready to share</span>
              </div>
            </div>
          </div> */}
          {/* Upload Area */}
          {/* {uploadMode === "files" ? (
            <div
              className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive
                  ? "border-red-400 bg-red-950/20"
                  : "border-slate-600 hover:border-slate-500 bg-slate-800"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                multiple
                onChange={handleFileInput}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center">
                  <Upload className="w-8 h-8 text-slate-300" />
                </div>
                <div>
                  <p className="text-lg font-medium text-slate-100 font-mono">
                    Drag and drop your files here
                  </p>
                  <p className="text-slate-400 mt-1 font-mono text-sm">
                    or click to browse your files
                  </p>
                </div>
                <button className="px-6 py-2 bg-red-400 text-slate-900 rounded-md hover:bg-red-500 transition-colors font-mono font-medium">
                  Choose Files
                </button>
              </div>
            </div>
          ) : (
            <div className="border border-slate-600 rounded-lg overflow-hidden bg-slate-800">
              <div className="bg-slate-700 border-b border-slate-600 px-4 py-2">
                <div className="flex items-center space-x-2">
                  <Terminal className="w-4 h-4 text-slate-300" />
                  <span className="text-sm font-medium text-slate-300 font-mono">
                    Code Editor
                  </span>
                </div>
              </div>
              <textarea
                className="w-full h-64 p-4 font-mono text-sm resize-none border-0 focus:outline-none focus:ring-0 bg-slate-900 text-slate-100 placeholder-slate-500"
                placeholder="// Paste your code or text here...
function helloWorld() {
  console.log('Hello, DyshareX!');
}"
              ></textarea>
              <div className="bg-slate-700 border-t border-slate-600 px-4 py-2 flex justify-end">
                <button className="px-4 py-2 bg-red-400 text-slate-900 rounded-md hover:bg-red-500 transition-colors text-sm font-mono font-medium">
                  Generate Link
                </button>
              </div>
            </div>
          )} */}

          <Dropzone />

          {/* Recent Files */}
          <Recent_files />
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
