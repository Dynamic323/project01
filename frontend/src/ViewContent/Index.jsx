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
import { FiDownload, FiShare2, FiUserPlus } from "react-icons/fi";
import { formatSize, getActualFileIcon } from "../utils/file-helper";
import Navbar from "../Components/Navbar";
import FileSkeletonLoader from "../Components/FileSkeletonLoader";
import { toast } from "react-toastify";

export default function Index() {
  const { id } = useParams();
  const [qry, setQry] = useState("auto");
  const [searchParams] = useSearchParams();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fileType, setFileType] = useState("file"); // Initialize with a default value

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
          console.log(response.data);
          
          setFileType(response.data.type || "file"); // Ensure fileType is set
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

  const renderContent = () => {
    if (loading) {
      return <FileSkeletonLoader fileType={fileType} />;
    }
    if (error) return <ErrorDisplay message={error} />;
    if (!content) return <ErrorDisplay message="No content found" />;

    return (
      <div className="bg-slate-800 rounded-lg overflow-hidden border border-slate-700">
        <div className="p-6">
          <div className="flex items-center mb-6">
            <div className="p-3 rounded-full bg-slate-700 mr-4">
              {getActualFileIcon(content.type)}
            </div>
            <div>
              <div className="">
                <h2 className="text-2xl font-bold flex justify-between text-white w-fit ">
                  <span>{content.title || "Untitled"} </span>
                </h2>
                <span>
                  size:
                  <span className="text-red-400">
                    {formatSize(content.size)}
                  </span>
                </span>
              </div>
              <p className="text-slate-400 text-sm mt-1">
                {content.type} • {formatSize(content.size)} •
                {new Date(content.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
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
            {(content.type === "text" || content.type === "code") && (
              <div className="bg-slate-700 p-4 rounded-lg">
                <pre className="text-slate-200 whitespace-pre-wrap">
                  {content.content}
                </pre>
              </div>
            )}
          </div>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
            <FileDownload
              url={content.file_url}
              fileName={content.name}
              className="flex-1 bg-red-400 hover:bg-red-500 text-white py-2 px-4 rounded-lg flex items-center justify-center"
            />
            <button className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 px-4 rounded-lg flex items-center justify-center">
              <FiShare2 className="mr-2" /> Share
            </button>
          </div>
          <div className="bg-slate-700 p-4 rounded-lg">
            <p className="text-slate-300 text-sm">
              This file has been viewed <strong>{content.views || 0}</strong>
              times.
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-900  px-4 sm:px-6 lg:px-8">
      <Navbar />
      <div className="py-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            {/* <h1 className="text-4xl font-bold text-white mb-4">
            Welcome to Our File Sharing Platform
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Upload, share, and manage your files effortlessly. Join thousands of
            users who trust us with their content.
          </p> */}
            {/* <Link
            to="/signup"
            className="mt-6 inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg"
          >
            <FiUserPlus className="mr-2" /> Create Your Free Account
          </Link> */}
          </div>
          <div className="mb-12">
            <h1 className="text-3xl font-bold text-white mb-6">File Preview</h1>
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
