import { useState, useEffect } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import apiService from "../services/apiService";
import { handleApiError } from "../lib/hrlper";
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
  const service = apiService(); // Public view doesn't necessarily need dashboard context

  // copy + expand state
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
        const data = await service.viewUpload(id, qry);
        setContent(data);
        setFileType(data.type || "file");
      } catch (err) {
        handleApiError(err);
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
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
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
                    className="absolute top-2 right-2 flex items-center gap-1 bg-red-400 hover:bg-red-500 text-white text-sm font-medium px-3 py-1 rounded brutalist-btn brutalist-red"
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
                className="flex-1 bg-red-400 hover:bg-red-500 text-white py-2 px-4 rounded-lg flex items-center justify-center brutalist-btn brutalist-red"
              />
            ) : (
              <FileDownload
                url={content.file_url}
                fileName={content.name}
                className="flex-1 bg-red-400 hover:bg-red-500 text-white py-2 px-4 rounded-lg flex items-center justify-center brutalist-btn brutalist-red"
              />
            )}
            <button
              onClick={toggleModal}
              className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 px-4 rounded-lg flex items-center justify-center brutalist-btn brutalist-card"
            >
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
              to="/register"
              className="inline-flex items-center px-6 py-3 bg-red-400 hover:bg-red-500 text-white font-semibold rounded-lg brutalist-btn brutalist-red"
            >
              <FiUserPlus className="mr-2" /> Create Account
            </Link>
          </div>
        </div>
      </div>
      <footer />
      {/* Modal */}
      <div
        onClick={toggleModal}
        className={`fixed inset-0 z-50 transition-all duration-300 ease-in-out ${
          isModalOpen
            ? "bg-black/60 pointer-events-auto"
            : "bg-black/0 pointer-events-none"
        }`}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className={`fixed bottom-0 left-0 right-0 z-50 transform transition-all duration-400 ease-[cubic-bezier(0.23,1,0.32,1)] ${
            isModalOpen ? "translate-y-0" : "translate-y-full"
          }`}
        >
          {/* Sharp top curve */}
          <div className="bg-slate-800 rounded-t-[32px] border-t border-x border-slate-700 px-6 pt-5 pb-10">
            {/* Drag handle */}
            <div className="w-10 h-1 bg-slate-600 rounded-full mx-auto mb-6" />

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-white">
                  Share this file
                </h3>
                <p className="text-slate-400 text-sm mt-0.5">
                  Pick a platform to share on
                </p>
              </div>
              <button
                onClick={toggleModal}
                className="w-8 h-8 rounded-full bg-slate-700 hover:bg-slate-600 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Copy Link Row */}
            <div className="flex items-center gap-3 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 mb-6">
              <span className="text-slate-400 text-sm truncate flex-1 font-mono">
                {`${window.location.origin}/view/${id}/?type=${qry}`}
              </span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(
                    `${window.location.origin}/view/${id}/?type=${qry}`,
                  );
                  toast.success("Link copied!");
                }}
                className="text-xs font-semibold text-red-400 hover:text-red-300 whitespace-nowrap transition-colors"
              >
                Copy link
              </button>
            </div>

            {/* Platform Buttons */}
            <div className="grid grid-cols-3 gap-3">
              {/* Facebook */}
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${window.location.origin}/view/${id}/?type=${qry}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-2 p-4 bg-slate-900 border border-slate-700 rounded-xl hover:border-slate-500 hover:bg-slate-800 transition-all duration-200 brutalist-btn brutalist-card"
              >
                <svg
                  className="w-6 h-6 text-blue-500"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fillRule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-xs text-slate-400 font-medium">
                  Facebook
                </span>
              </a>

              {/* Twitter/X */}
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(`${window.location.origin}/view/${id}/?type=${qry}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-2 p-4 bg-slate-900 border border-slate-700 rounded-xl hover:border-slate-500 hover:bg-slate-800 transition-all duration-200 brutalist-btn brutalist-card"
              >
                <svg
                  className="w-6 h-6 text-sky-400"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
                <span className="text-xs text-slate-400 font-medium">
                  Twitter
                </span>
              </a>

              {/* LinkedIn */}
              <a
                href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(`${window.location.origin}/view/${id}/?type=${qry}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-2 p-4 bg-slate-900 border border-slate-700 rounded-xl hover:border-slate-500 hover:bg-slate-800 transition-all duration-200 brutalist-btn brutalist-card"
              >
                <svg
                  className="w-6 h-6 text-blue-400"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
                <span className="text-xs text-slate-400 font-medium">
                  LinkedIn
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
