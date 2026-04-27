import { useEffect, useState } from "react";
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
  AiOutlineExclamationCircle,
} from "react-icons/ai";
import { useAuth } from "../context/Authcontext";
import { toast } from "react-toastify";
import { useDashboard } from "../context/DashboardContext";
import Loader, { Subloader } from "../Components/Loader";
import { BackendURL, FrontendURL, handleCopy } from "../utils/file-helper";
// import { handleDelete } from "../utils/Helper_Function";

import apiService from "../services/apiService";
import { handleApiError } from "../lib/hrlper";

export function HistoryPage() {
  const dashboard = useDashboard();
  const { getValue, setValue } = dashboard;
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const { user } = useAuth();
  const service = apiService(dashboard);

  const history = getValue(`user_uploads_all_${user?.id}`) || [];

  useEffect(() => {
    async function fetchHistory() {
      if (!history.length && user) {
        setLoading(true);
        try {
          const token = localStorage.getItem("token");
        const usrhistory =  await service.getUserAll(user.id, token);
        console.log(usrhistory);
        
        } catch (error) {
          handleApiError(error);
        } finally {
          setLoading(false);
        }
      }
    }
    fetchHistory();
  }, [user]);

  const handleDeleteItem = async () => {
    if (!itemToDelete || !user) return;

    setDeleting(true);
    try {
      const token = localStorage.getItem("token");
      await service.deleteUpload(itemToDelete.id, token);

      // Update local state is handled by apiService invalidation, but for immediate UI:
      const updatedHistory = history.filter(item => item.id !== itemToDelete.id);
      setValue(`user_uploads_all_${user.id}`, updatedHistory);

      toast.success(`${itemToDelete.type || "Item"} deleted successfully`);
    } catch (error) {
      handleApiError(error);
    } finally {
      setDeleting(false);
      setShowConfirm(false);
    }
  };

  return (
    <div className="p-3 md:p-8 w-full">
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
        <Subloader text={"Loading History...."} />
      ) : (
        <div className="grid gap-4">
          {Array.isArray(history) && history.length > 0 ? (
            history.map((item) => (
              <div
                key={item.id}
                className="bg-slate-900 border border-slate-700 rounded-lg p-2 md:p-6 hover:border-slate-600 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-7 md:w-12 md:h-12 bg-slate-800 border border-slate-600 rounded-lg flex items-center justify-center">
                      {getFileIcon(item.file_type)}
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">{item.title}</h3>
                      <div className="flex items-center gap-4 mt-1 text-sm text-slate-400">
                        <span className="flex items-center gap-1">
                          <AiOutlineEye className="h-3 w-3" />
                          {item.views} views
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors"
                      onClick={() => {
                        handleCopy(`${FrontendURL}/view/${item.id}`);
                      }}
                    >
                      <AiOutlineLink className="h-4 w-4" />
                    </button>
                    <button
                      className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors"
                      onClick={() => {
                        setItemToDelete(item);
                        setShowConfirm(true);
                      }}
                      disabled={deleting}
                    >
                      {deleting && itemToDelete?.id === item.id ? (
                        <span className="h-4 w-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></span>
                      ) : (
                        <AiOutlineDelete className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-slate-400 pt-6">
              <p className="mb-4">You have no files uploaded yet...</p>
              <button className="flex items-center gap-2 px-4 py-2 bg-red-400 text-white rounded-lg font-semibold hover:bg-red-300 transition-colors border border-slate-600 mx-auto">
                <AiOutlinePlus className="h-4 w-4" />
                Upload Your First File
              </button>
            </div>
          )}
        </div>
      )}

      {/* Confirmation Modal */}
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
                {itemToDelete?.title}
              </span>
              ?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600"
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteItem}
                className="px-4 py-2 bg-red-400 text-white rounded-lg hover:bg-red-500 flex items-center gap-2"
                disabled={deleting}
              >
                {deleting ? (
                  <>
                    <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Deleting...
                  </>
                ) : (
                  <>
                    <AiOutlineDelete /> Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
