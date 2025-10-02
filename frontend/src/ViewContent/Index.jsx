import { useState, useEffect } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import api from "../api";
import { ImageViewer } from "./ImageViewer";
import { FileDownload } from "./FileDownload";
import { PdfViewer } from "./PdfViewer";
import { ErrorDisplay } from "./ErrorDisplay";
import Loader from "../Components/Loader";
import { VideoPlayer } from "./VideoPlayer";
import { AudioPlayer } from "./AudioPlayer";
import { FiShare2, FiUserPlus } from "react-icons/fi";
import { formatSize, getActualFileIcon } from "../utils/file-helper";
import Navbar from "../Components/Navbar";
import FileSkeletonLoader from "../Components/FileSkeletonLoader";
import { toast, ToastContainer } from "react-toastify";

// Lucide icons
import { Clipboard, Check, ChevronDown, ChevronUp } from "lucide-react";
import { TextDownload } from "./TextDownload";

export default function Index() {
  const { id } = useParams();
  const [qry, setQry] = useState("auto");
  const [searchParams] = useSearchParams();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fileType, setFileType] = useState("file");

  // copy + expand state
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const MAX_PREVIEW = 200;

  useEffect(() => {
    const query = searchParams.get("type");
    if (query === "text") {
      setQry("text");
    } else if (query === "file") {
      setQry("file");
    } else {
      setQry("auto");
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/view/${id}/?type=${qry}`);
        if (response.data) {
          setContent(response.data);
          setFileType(response.data.type || "file");
        } else {
          toast.error("Error in fetching Files");
        }
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load content");
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, [id, qry]);

  const handleCopy = async () => {
    if (!content?.content) return;
    try {
      await navigator.clipboard.writeText(content.content);
      setCopied(true);
      toast.success("Copied to clipboard ");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed", err);
      toast.error("Copy failed");
    }
  };

  const renderContent = () => {
    if (loading) return <FileSkeletonLoader fileType={fileType} />;
    if (error) return <ErrorDisplay message={error} />;
    if (!content) return <ErrorDisplay message="No content found" />;

    return (
      <div className="bg-slate-800 rounded-lg overflow-hidden border border-slate-700">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center mb-6">
            <div className="p-3 rounded-full bg-slate-700 mr-4">
              {getActualFileIcon(content.type)}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">
                {content.title || "Untitled"}
              </h2>
              <span className="text-red-400">size: {content.size}</span>
              <p className="text-slate-400 text-sm mt-1">
                {content.type} • {formatSize(content.size)} •{" "}
                {new Date(content.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* File Preview */}
          <div className="mb-6">
            {content.type === "image" && (
              <ImageViewer src={content.file_url} alt={content.name} />
            )}
            {content.type === "pdf" && (
              <PdfViewer url={content.file_url} title={content.name} />
            )}
            {content.type === "audio" && (
              <AudioPlayer src={content.file_url} title={content.name} />
            )}
            {content.type === "video" && (
              <VideoPlayer src={content.file_url} title={content.name} />
            )}
            {(content.type === "text" || content.type === "code") &&
              content.content && (
                <div className="relative bg-slate-700 p-4 rounded-lg">
                  {/* Copy Button */}
                  <button
                    onClick={handleCopy}
                    className="absolute top-2 right-2 flex items-center gap-1 bg-red-400 hover:bg-red-500 text-white text-sm font-medium px-3 py-1 rounded shadow"
                  >
                    {copied ? (
                      <>
                        <Check size={16} />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Clipboard size={16} />
                        Copy
                      </>
                    )}
                  </button>

                  {/* Text Content */}
                  <pre className="text-slate-200 whitespace-pre-wrap">
                    {expanded || content.content.length <= MAX_PREVIEW
                      ? content.content
                      : content.content.slice(0, MAX_PREVIEW) + " ..."}
                  </pre>

                  {/* Expand/Collapse Toggle */}
                  {content.content.length > MAX_PREVIEW && (
                    <button
                      onClick={() => setExpanded(!expanded)}
                      className="mt-2 flex cursor-pointer items-center gap-1 text-red-400 hover:text-red-300 text-sm"
                    >
                      {expanded ? (
                        <>
                          Show Less <ChevronUp size={14} />
                        </>
                      ) : (
                        <>
                          <span className="flex">
                            Show More <ChevronDown size={14} />
                          </span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
            {content.type === "text" || content.type === "code" ? (
              <TextDownload
                content={content.content}
                fileName={content.title}
                className="flex-1 bg-red-400 hover:bg-red-500 text-white py-2 px-4 rounded-lg flex items-center justify-center"
              />
            ) : (
              <FileDownload
                url={content.file_url}
                fileName={content.name}
                className="flex-1 bg-red-400 hover:bg-red-500 text-white py-2 px-4 rounded-lg flex items-center justify-center"
              />
            )}

            <button className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 px-4 rounded-lg flex items-center justify-center">
              <FiShare2 className="mr-2" /> Share
            </button>
          </div>

          {/* Views */}
          <div className="bg-slate-700 p-4 rounded-lg">
            <p className="text-slate-300 text-sm">
              This file has been viewed <strong>{content.views || 0}</strong>{" "}
              times.
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-900 px-4 sm:px-6 lg:px-8">
      <Navbar />
      <ToastContainer />
      <div className="py-12">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h1 className="text-3xl font-bold text-white mb-6">
              {" "}
              Preview Page
            </h1>
            {renderContent()}
          </div>

          {/* CTA Section */}
          <div className="text-center mt-12 p-8 bg-slate-800 rounded-lg border border-slate-700">
            <h2 className="text-2xl font-bold text-white mb-4">
              Ready to Share Your Own Files?
            </h2>
            <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
              Join now to upload, share, and manage your files with ease.
            </p>
            <Link
              to="/signup"
              className="inline-flex items-center px-6 py-3 bg-red-400 hover:bg-red-500 text-white font-semibold rounded-lg"
            >
              <FiUserPlus className="mr-2" /> Create Account
            </Link>
          </div>
        </div>
      </div>
      <footer />
    </div>
  );
}
