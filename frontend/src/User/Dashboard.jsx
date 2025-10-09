import React, { useState } from "react";
import { useAuth } from "../context/Authcontext";
import { toast } from "react-toastify";
import { Dropzone } from "../Components/Dropzone";
import { useNavigate } from "react-router-dom";
import { Upload, User, Code, File, Terminal } from "lucide-react";
import Recent_files from "../Components/Recent_files";
import DashboardHeader from "../Components/DashboardHeader";
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

  
  return (
    <div className="flex-1  flex flex-col">
      {/* Main Content */}
      {/* Header */}
    <DashboardHeader/>

      {/* Main Content Area */}
      <main className="">
        <div className="max-w-4xl p-2 mx-auto">
          {/* Upload Mode Toggle */}
          <div className="flex items-center gap-4">
            <div className="text-sm text-slate-400">Welcome back!</div>
            <div className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-full">
            
            </div>
          </div>


          <Dropzone />

          {/* Recent Files */}
          <Recent_files />
        </div>
      </main>
    </div>
  );
}

export default Dashboard;


