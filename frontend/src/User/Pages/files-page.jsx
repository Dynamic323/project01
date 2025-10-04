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
  AiOutlineDelete,
  AiOutlineExclamationCircle,
} from "react-icons/ai";
import { useAuth } from "../../context/Authcontext";
import { useDashboard } from "../../context/DashboardContext";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import {
  BackendURL,
  FrontendURL,
  formatDate,
  formatSize,
  getFileIcon,
  handleCopy,
} from "../../utils/file-helper";
import { LazyImage } from "../../Components/LazyImage";
import { Pagination } from "../../Components/Pagination";
import { Subloader } from "../../Components/Loader";

export function FilesPage() {
  const { user } = useAuth();
  const { getValue, setValue } = useDashboard();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(15);
  const [totalPages, setTotalPages] = useState(1);
  const [showConfirm, setShowConfirm] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);

  const navigate = useNavigate();

  const fetchFiles = async (page = 1, search = "") => {
    if (!user?.uid) return;

    const cachedFiles = getValue("files");

    // Use cached files if available and no search term
    if (cachedFiles && !search && page === 1) {
      setFiles(cachedFiles);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `${BackendURL}api/user/files/${
          user.uid
        }?page=${page}&limit=${itemsPerPage}&search=${encodeURIComponent(
          search
        )}`
      );

      console.log(res);
      
      if (!res.ok) throw new Error("Failed to fetch files");
      const data = await res.json();
      setFiles(data.files || []);
      setTotalPages(data.pagination?.totalPages || 1);
      setValue("files", data.files);
    } catch (err) {
      toast.error("Error fetching files");
      console.error(err);
      setFiles([]);
      setValue("files", []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles(currentPage, searchTerm);
    // console.log("Working");
    
  }, [currentPage, searchTerm, user]);

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${BackendURL}/api/files/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete file");
      toast.success("File deleted");
      setShowConfirm(false);
      fetchFiles(currentPage, searchTerm);
    } catch (err) {
      toast.error("Failed to delete file");
      console.error(err);
    }
  };

  const handlePreview = (id) => navigate(`/view/${id}/?type=file`);

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-2 mb-2">
            <AiOutlineFile className="h-8 w-8 text-red-400" /> My Files
          </h1>
          <p className="text-slate-400">Manage all your uploaded files</p>
        </div>
        <Link to={"/dashboard/dropzone"} className="flex items-center gap-2 px-4 py-2 bg-red-400 text-white rounded-lg font-semibold hover:bg-red-500">
          <AiOutlinePlus className="h-4 w-4" /> Upload New File
        </Link>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <AiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search your files..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:border-red-400 focus:outline-none"
        />
      </div>

      {/* Files Grid */}
      {loading ? (
       <Subloader />
      ) : files.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {files.map((file) => (
            <div
              key={file.id}
              className="bg-slate-800  border border-slate-700 rounded-lg overflow-hidden hover:border-slate-600 transition-all"
            >
              {file.file_type?.startsWith("image/") && (
                <LazyImage src={file.file_url} alt={file.title || "image"} />
              )}
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-bold text-white truncate">
                    {file.title || "Untitled"}
                  </h3>
                  <div className="flex items-center gap-2">
                    {getFileIcon(file.file_type)}
                    <span className="px-2 py-1 bg-slate-700 text-red-300 rounded text-xs">
                      {file.file_type?.split("/")[1] || "file"}
                    </span>
                  </div>
                </div>
                <div className="space-y-1 mb-4 text-sm">
                  <div className="flex justify-between text-slate-400">
                    <span>Size</span>{" "}
                    <span className="text-white">
                      {formatSize(file.file_size)}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Uploaded</span>{" "}
                    <span className="text-white">
                      {formatDate(file.created_at)}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Expires</span>{" "}
                    <span className="text-white">
                      {formatDate(file.expires_at)}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Views</span>
                    <span className="text-white flex items-center gap-1">
                      <AiOutlineEye className="h-3 w-3" /> {file.views}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePreview(file.id)}
                    className="flex-1 px-3 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600"
                  >
                    <AiOutlineEye className="inline h-3 w-3" /> Preview
                  </button>
                  <button
                    onClick={() => handleCopy(`${FrontendURL}/view/${file.id}`)}
                    className="flex-1 px-3 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600"
                  >
                    <AiOutlineCopy className="inline h-3 w-3" /> Copy
                  </button>
                  <button
                    onClick={() => {
                      setFileToDelete(file);
                      setShowConfirm(true);
                    }}
                    className="p-2 text-red-400 hover:text-red-300 hover:bg-slate-700 rounded-lg"
                  >
                    <AiOutlineDelete className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-slate-400 py-16">
          <AiOutlineFile className="mx-auto h-10 w-10 mb-4" />
          No files found {searchTerm && `matching "${searchTerm}"`}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Delete Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-lg p-6 max-w-md w-full border border-slate-700">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-full bg-red-400/20">
                <AiOutlineExclamationCircle className="h-6 w-6 text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Delete File</h3>
            </div>
            <p className="text-slate-300 mb-6">
              Are you sure you want to delete{" "}
              <span className="font-medium text-white">
                {fileToDelete?.title}
              </span>
              ?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(fileToDelete.id)}
                className="px-4 py-2 bg-red-400 text-white rounded-lg hover:bg-red-500 flex items-center gap-2"
              >
                <AiOutlineDelete /> Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
