import { useEffect, useState, useCallback, useMemo } from "react";
import {
  AiOutlineFileText,
  AiOutlinePlus,
  AiOutlineSearch,
  AiOutlineCopy,
  AiOutlineEye,
  AiOutlineDelete,
  AiOutlineArrowLeft,
  AiOutlineArrowRight,
  AiOutlineExclamationCircle,
} from "react-icons/ai";
import { useAuth } from "../../context/Authcontext";
import { useDashboard } from "../../context/DashboardContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import Loader, { Subloader } from "../../Components/Loader";
import {BackendURL} from "../../utils/file-helper"
export default function TextPage() {
  const { getValue, setValue } = useDashboard();
  const [loading, setLoading] = useState(false);
  const [texts, setTexts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(15);
  const [searchTerm, setSearchTerm] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [textToDelete, setTextToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();
  
  // Memoized data fetching
  // Text-page.jsx
  const { user } = useAuth();
  const cachedText = getValue("texts")

  const fetchTexts = useCallback(async () => {
   
    if (!cachedText) {
      setLoading(true)

       try {
        const res = await fetch(
          `${BackendURL}/api/user/text/${user.authUser.uid}?page=1&limit=${itemsPerPage}&search=`
        );
        const data = await res.json();

        const textData = Array.isArray(data) ? data : data.texts || [];
        setTexts(textData);
        setValue("texts", textData);
      } catch (err) {
        toast.error("Error fetching texts");
        console.error(err);
        setTexts([]);
        setValue("texts", []);
      } finally {
        setLoading(false);
      }

    }
  }, [user, BackendURL, getValue, setValue, itemsPerPage]);

  useEffect(() => {
    fetchTexts();
  }, [fetchTexts]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Filter texts based on search term
  const filteredTexts = useMemo(() => {
    return texts.filter(
      (txt) =>
        txt.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        txt.content?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [texts, searchTerm]);

  // Pagination logic
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentTexts = filteredTexts.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredTexts.length / itemsPerPage);

  const formatDate = (dateString) =>    
    new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const handleCopy = (content) => {
    navigator.clipboard.writeText(content);
    toast.success("Text copied to clipboard!");
  };

  const handleDelete = async (id) => {
    setIsDeleting(true);
    try {
      const res = await fetch(`${BackendURL}/api/text/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        const updated = texts.filter((t) => t.id !== id);
        setTexts(updated);
        setValue("texts", updated);
        toast.success("Text deleted");
        setShowConfirm(false);
      } else throw new Error();
    } catch (err) {
      toast.error("Error deleting text");
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  const paginate = (num) => setCurrentPage(num);

  // Syntax highlighting theme
  const theme = {
    plain: {
      color: "#e2e8f0",
      backgroundColor: "#2d3748",
    },
    styles: [
      {
        types: ["comment", "prolog", "doctype", "cdata"],
        style: {
          color: "#636e7b",
        },
      },
      {
        types: ["punctuation"],
        style: {
          color: "#e2e8f0",
        },
      },
      {
        types: ["namespace"],
        style: {
          opacity: 0.7,
        },
      },
      {
        types: ["tag", "operator", "number"],
        style: {
          color: "#fbbf24",
        },
      },
      {
        types: ["property", "function"],
        style: {
          color: "#f472b6",
        },
      },
      {
        types: ["tag-id", "selector", "atrule-id"],
        style: {
          color: "#60a5fa",
        },
      },
      {
        types: ["attr-name"],
        style: {
          color: "#a78bfa",
        },
      },
      {
        types: ["attr-value", "string", "entity", "url", "keyword"],
        style: {
          color: "#34d399",
        },
      },
      {
        types: ["regex", "symbol"],
        style: {
          color: "#fbbf24",
        },
      },
      {
        types: ["boolean"],
        style: {
          color: "#fbbf24",
        },
      },
    ],
  };

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3 mb-2">
              <AiOutlineFileText className="h-8 w-8 text-red-400" />
              My Texts
            </h1>
            <p className="text-slate-400">
              View and manage all your saved text snippets
            </p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-red-400 text-white rounded-lg font-semibold hover:bg-red-500 transition-colors">
            <AiOutlinePlus className="h-4 w-4" />
            Create New Text
          </button>
        </div>
        {/* Search */}
        <div className="relative mb-6">
          <AiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search your texts..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:border-red-400 focus:outline-none"
          />
        </div>
      </div>
      {/* Text List */}
      {loading ? (
       <Subloader text={"Loading Text...."} />

      ) : currentTexts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentTexts.map((txt) => (
            <div
              key={txt.id}
              className="bg-slate-800 border border-slate-700 rounded-lg p-4 hover:border-slate-600 transition-all duration-200 hover:shadow-lg hover:shadow-slate-800/50"
            >
              <h3 className="text-lg font-bold text-white mb-2 truncate">
                {txt.title || "Untitled"}
              </h3>
              <div className="text-slate-300 text-sm mb-4">
                {txt.type === "code" ? (
                  <SyntaxHighlighter
                    language="javascript"
                    style={theme}
                    customStyle={{
                      backgroundColor: "#2d3748",
                      padding: "1rem",
                      borderRadius: "0.5rem",
                      display: "-webkit-box",
                      WebkitLineClamp: 6,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {txt.content}
                  </SyntaxHighlighter>
                ) : (
                  <p className="line-clamp-6">{txt.content || "No content"}</p>
                )}
              </div>
              <div className="flex items-center justify-between text-sm mb-4">
                <span className="text-slate-400">Created</span>
                <span className="text-white">{formatDate(txt.created_at)}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/view/${txt.id}/?type=text`)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
                >
                  <AiOutlineEye className="h-3 w-3" />
                  View
                </button>
                <button
                  onClick={() => handleCopy(txt.content)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
                >
                  <AiOutlineCopy className="h-3 w-3" />
                  Copy
                </button>
                <button
                  onClick={() => {
                    setTextToDelete(txt);
                    setShowConfirm(true);
                  }}
                  className="p-2 text-red-400 hover:text-red-300 hover:bg-slate-700 rounded-lg transition-colors"
                  title="Delete text"
                >
                  <AiOutlineDelete className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-slate-400 py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-slate-700 rounded-full flex items-center justify-center">
            <AiOutlineFileText className="h-8 w-8 text-slate-400" />
          </div>
          <p className="mb-4">
            No texts found{searchTerm ? ` matching "${searchTerm}"` : ""}.
          </p>
          <button className="flex items-center gap-2 px-4 py-2 bg-red-400 text-white rounded-lg font-semibold hover:bg-red-500 transition-colors mx-auto">
            <AiOutlinePlus className="h-4 w-4" />
            Create Your First Text
          </button>
        </div>
      )}
      {/* Pagination */}
      {filteredTexts.length > itemsPerPage && (
        <div className="flex justify-center mt-8">
          <nav className="inline-flex items-center gap-1">
            <button
              onClick={() => paginate(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg bg-slate-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <AiOutlineArrowLeft />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                onClick={() => paginate(num)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === num
                    ? "bg-red-400 text-white"
                    : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                }`}
              >
                {num}
              </button>
            ))}
            <button
              onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg bg-slate-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <AiOutlineArrowRight />
            </button>
          </nav>
        </div>
      )}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-lg p-6 max-w-md w-full border border-slate-700">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-full bg-red-400/20">
                <AiOutlineExclamationCircle className="h-6 w-6 text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Delete Text</h3>
            </div>
            <p className="text-slate-300 mb-6">
              Are you sure you want to delete{" "}
              <span className="font-medium text-white">
                {textToDelete?.title}
              </span>
              ? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(textToDelete.id)}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-400 text-white rounded-lg hover:bg-red-500 flex items-center gap-2 disabled:opacity-50"
              >
                {isDeleting ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
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
