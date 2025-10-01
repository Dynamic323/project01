import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import api from "../api";
import { ImageViewer } from "./ImageViewer";
import { FileDownload } from "./FileDownload";
import { PdfViewer } from "./PdfViewer";
import { ErrorDisplay } from "./ErrorDisplay";
import Loader from "../Components/Loader";
import { VideoPlayer } from "./VideoPlayer";

export default function Index() {
  const { id } = useParams();
  const [qry, setQry] = useState("auto");
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const query = searchParams.get("type");
    console.log(query);

    if (query === "text") {
      setQry("text");
    } else if (query === "file") {
      setQry("file");
    } else {
      setQry("auto");
    }
  }, [searchParams]);

  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/view/${id}/?type=${qry}`);

        console.log(response.data);

        if (response.data) {
          setContent(response.data);
        }
      } catch (err) {
        console.error("Error fetching content:", err);
        setError(err.response?.data?.message || "Failed to load content");
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [id, qry]);

  const renderContent = () => {
    if (loading) return <Loader />;
    if (error) return <ErrorDisplay message={error} />;
    if (!content) return <ErrorDisplay message="No content found" />;

    switch (content.type) {
      case "image":
        return (
          <div className="max-w-4xl mx-auto">
            <ImageViewer src={content.file_url} alt={content.name} />
            <FileDownload
              url={content.url}
              fileName={content.name}
              className="mt-4"
            />
          </div>
        );
      case "pdf":
        return (
          <div className="max-w-4xl mx-auto">
            <PdfViewer url={content.file_url} title={content.name} />
            <FileDownload
              url={content.url}
              fileName={content.name}
              className="mt-4"
            />
          </div>
        );
      case "audio":
        return (
          <div className="max-w-4xl mx-auto">
            <AudioPlayer src={content.url} title={content.name} />
          </div>
        );
      case "video":
        return (
          <div className="max-w-4xl mx-auto">
            <VideoPlayer src={content.file_url} title={content.name} />
          </div>
        );
      case "text":
      case "code":
        return (
          <div className="max-w-4xl mx-auto">
            <TextViewer
              content={content.content}
              type={content.type}
              title={content.title || content.name}
            />
            {content.originalType === "file" && (
              <FileDownload
                url={content.url}
                fileName={content.name}
                className="mt-4"
              />
            )}
          </div>
        );
      default:
        return (
          <div className="max-w-4xl mx-auto p-6 bg-gray-800 rounded-lg">
            <h2 className="text-xl font-bold text-white mb-4">
              {content.name || content.title || "File"}
            </h2>
            <FileDownload
              url={content.url}
              fileName={content.name}
              className="mt-4"
            />
            <div className="mt-6 p-4 bg-gray-700 rounded">
              <p className="text-gray-300">
                This file type ({content.type}) cannot be previewed in the
                browser. Please download it to view.
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {content && (
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-white">
              {content.title || content.name || "Untitled"}
            </h1>
            <div className="mt-2 flex items-center text-gray-400">
              <span className="mr-4">Views: {content.views || 0}</span>
              <span>{new Date(content.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        )}
        {renderContent()}
      </div>
    </div>
  );
}
