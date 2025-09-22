import { useState, useEffect } from "react";
import {
  AiOutlineCloudUpload,
  AiOutlineFile,
  AiOutlineFileText,
  AiOutlinePicture,
  AiOutlineAudio,
  AiOutlineVideoCamera,
  AiOutlineDelete,
  AiOutlineLink,
  AiOutlineEdit,
} from "react-icons/ai";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import useUploader from "../hooks/useUploader";
import Spinner from "./Spinner";
import { Code, Notebook } from "lucide-react";

// Mock user plan status (replace with actual logic)
const isFreePlan = true;

export function Dropzone() {
  const [uploadType, setUploadType] = useState("files");
  const [isDragOver, setIsDragOver] = useState(false);
  const [files, setFiles] = useState([]);
  const [textContent, setTextContent] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [expiresAt, setExpiresAt] = useState("");
  const [dayName, setDayName] = useState("");
  const [contentType, setContentType] = useState("text");
  const [isPublic, setIsPublic] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contentTitle, setContentTitle] = useState("");
  const [fileNames, setFileNames] = useState([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { uploading, error, success, uploadFile } = useUploader("/upload");

  // Block navigation if there are unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue =
          "You have unsaved changes. Are you sure you want to leave?";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Safe navigation function
  const safeNavigate = (to) => {
    if (hasUnsavedChanges) {
      const shouldNavigate = window.confirm(
        "You have unsaved changes. Are you sure you want to leave?"
      );
      if (shouldNavigate) {
        setHasUnsavedChanges(false);
        navigate(to);
      }
    } else {
      navigate(to);
    }
  };

  // File handling functions
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const uniqueFiles = selectedFiles.filter(
      (newFile) =>
        !files.some((existingFile) => existingFile.name === newFile.name)
    );
    const updatedFiles = [...files, ...uniqueFiles];
    setFiles(updatedFiles);
    setFileNames([...fileNames, ...uniqueFiles.map((file) => file.name)]);
    setHasUnsavedChanges(true);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    const uniqueFiles = droppedFiles.filter(
      (newFile) =>
        !files.some((existingFile) => existingFile.name === newFile.name)
    );
    setFiles([...files, ...uniqueFiles]);
    setFileNames([...fileNames, ...uniqueFiles.map((file) => file.name)]);
    setHasUnsavedChanges(true);
  };

  const removeFile = (index) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    const updatedFileNames = fileNames.filter((_, i) => i !== index);
    setFileNames(updatedFileNames);
    setHasUnsavedChanges(updatedFiles.length > 0);
  };

  const getFileIcon = (fileName) => {
    const ext = fileName.split(".").pop()?.toLowerCase();
    if (["jpg", "jpeg", "png", "gif", "svg", "webp"].includes(ext))
      return <AiOutlinePicture className="text-xl text-red-400" />;
    if (["mp3", "wav", "m4a", "aac", "flac"].includes(ext))
      return <AiOutlineAudio className="text-xl text-red-400" />;
    if (["mp4", "avi", "mov", "wmv", "flv"].includes(ext))
      return <AiOutlineVideoCamera className="text-xl text-red-400" />;
    return <AiOutlineFile className="text-xl text-red-400" />;
  };

  const handleFilenameEdit = (index) => {
    if (isFreePlan) {
      toast.error("Filename editing is only available for Pro users.");
      return;
    }
    const newName = window.prompt("Edit filename:", files[index].name);
    if (newName && newName.trim() !== "") {
      const updatedFiles = [...files];
      const updatedFile = new File([files[index]], newName, {
        type: files[index].type,
      });
      updatedFiles[index] = updatedFile;
      setFiles(updatedFiles);
      const updatedFileNames = [...fileNames];
      updatedFileNames[index] = newName;
      setFileNames(updatedFileNames);
      setHasUnsavedChanges(true);
    }
  };

  const resetForm = () => {
    setFiles([]);
    setTextContent("");
    setContentTitle("");
    setFileNames([]);
    setHasUnsavedChanges(false);
  };

  const handleProceed = () => {
    if (textContent === "" && files.length === 0) {
      toast.error("Please enter some text or select files to upload.");
      return;
    }
    setShowModal(true);
    setFileNames(files.map((file) => file.name));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (uploadType === "files" && files.length === 0) {
      toast.error("Please select files to upload.");
      setIsSubmitting(false);
      return;
    }
    if (uploadType === "text" && !textContent.trim()) {
      toast.error("Please enter some text.");
      setIsSubmitting(false);
      return;
    }
    try {
      let response = null;
      if (files.length > 0) {
        response = await uploadFile({
          files,
          fileNames,
          type: "file",
          expiresAt,
          isPublic,
          user_id: JSON.parse(localStorage.getItem("user")).uid,
        });
      } else {
        if (contentTitle == "") {
          toast.error(`Pls enter a title for your ${contentType} `);
          return;
        }

        response = await uploadFile({
          textContent,
          contentTitle,
          type: contentType,
          expiresAt,
          isPublic,
          user_id: JSON.parse(localStorage.getItem("user")).uid,
        });
      }
      toast.success("Upload successful! Link generated.");
      setIsSubmitting(false);
      setHasUnsavedChanges(false);
      setTimeout(() => {
        safeNavigate(`/files/${response.data.data.id}`);
      }, 4000);
    } catch (error) {
      console.error(error);
      const message =
        error?.response?.data?.error ||
        error?.message ||
        "Upload failed. Please try again.";
      toast.error(message);
      setIsSubmitting(false);
    }
  };

  // Set expiry date on component mount
  useEffect(() => {
    const now = new Date();
    const expiresDate = new Date(now.setDate(now.getDate() + 2));
    setExpiresAt(expiresDate.toISOString());
    const dayOfWeek = expiresDate.toLocaleDateString("en-US", {
      weekday: "long",
    });
    setDayName(dayOfWeek);
  }, []);

  // File list component
  const FileList = () => (
    <div className="border border-slate-700 rounded-xl bg-slate-900 overflow-hidden">
      <div className="border-b border-slate-700 bg-slate-800 px-6 py-4">
        <h4 className="font-bold text-white flex items-center gap-2">
          <AiOutlineFile className="text-red-400" />
          Selected Files ({files.length})
        </h4>
      </div>
      <div className="p-6 space-y-3 max-h-64 overflow-y-auto">
        {files.map((file, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 bg-slate-800 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors"
          >
            <div className="flex items-center gap-3">
              {getFileIcon(file.name)}
              <div>
                <div className="text-white font-medium">{file.name}</div>
                <div className="text-sm text-slate-400">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleFilenameEdit(index)}
                className="p-2 text-slate-400 hover:text-blue-400 transition-colors"
                title="Edit filename"
              >
                <AiOutlineEdit />
              </button>
              <button
                onClick={() => removeFile(index)}
                className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                title="Remove file"
              >
                <AiOutlineDelete />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (showModal) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <button
          className="underline text-red-400 px-4 py-2 mb-6"
          onClick={() => setShowModal(false)}
        >
          Back
        </button>
        <div className="bg-slate-800 rounded-xl p-6 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title Section */}
            <div>
              <label className="block text-white text-xl font-medium mb-2">
                {uploadType === "files"
                  ? `File Name${files.length > 1 ? "s" : ""}`
                  : "Save as (Title)"}
              </label>
              {uploadType === "files" ? (
                <div className="space-y-3 max-h-40 overflow-y-auto pr-2">
                  {files.map((file, index) => (
                    <div key={index} className="flex items-center gap-2">
                      {getFileIcon(file.name)}
                      <span className="text-white">{file.name}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <input
                  className="w-full text-xl p-2 bg-slate-900 text-white border-b-2 border-slate-600 focus:border-red-400 outline-none rounded"
                  type="text"
                  value={contentTitle}
                  onChange={(e) => setContentTitle(e.target.value)}
                  placeholder="Enter a title"
                />
              )}
            </div>

            {/* Expiry Section */}
            <div className="flex items-center justify-between p-4 bg-slate-900 rounded-lg">
              <p className="text-white">
                Will expire:{" "}
                <span className="font-bold text-red-400">
                  {dayName} (in 2 days)
                </span>
              </p>
              <button
                type="button"
                className="text-sm text-red-400 border border-red-400 px-3 py-1 rounded hover:bg-red-400 hover:text-white transition"
                onClick={() => {
                  isFreePlan
                    ? toast.error("Upgrade your Account to use this feature !")
                    : toast.info("Expiry change feature coming soon!");
                }}
              >
                Change Expiry
              </button>
            </div>

            {/* Visibility Section */}
            <div className="flex items-center gap-4 p-4 bg-slate-900 rounded-lg">
              <span className="text-white">Visibility:</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    isPublic
                      ? "bg-red-400 text-white"
                      : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                  }`}
                  onClick={() => setIsPublic(true)}
                >
                  Public
                </button>
                <button
                  type="button"
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    !isPublic
                      ? "bg-red-400 text-white"
                      : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                  }`}
                  onClick={() => setIsPublic(false)}
                >
                  Private
                </button>
              </div>
            </div>

            {/* Content Type Section */}
            {uploadType !== "files" && (
              <div className="p-4 bg-slate-900 rounded-lg">
                <label className="block text-white mb-2">Type:</label>
                <select
                  className="w-full bg-slate-800 p-2 rounded border border-slate-700 focus:border-red-400 outline-none"
                  value={contentType}
                  onChange={(e) => setContentType(e.target.value)}
                >
                  <option value="text">Text</option>
                  <option value="code">Code</option>
                </select>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all ${
                  isSubmitting
                    ? "bg-slate-700 text-slate-400 cursor-not-allowed"
                    : "bg-red-400 text-white hover:bg-red-500"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Spinner />
                    Generating Link...
                  </>
                ) : (
                  <>
                    <AiOutlineLink />
                    Generate Share Link
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto p-6">
      {/* Upload Type Toggle */}
      <div className="flex gap-3 mb-8">
        <button
          onClick={() => {
            setUploadType("files");
            resetForm();
          }}
          className={`flex items-center gap-3 px-6 py-3 rounded-lg border transition-all ${
            uploadType === "files"
              ? "border-red-400 bg-slate-800 text-red-400"
              : "border-slate-600 bg-slate-900 text-slate-300 hover:bg-slate-800"
          }`}
        >
          <AiOutlineFile />
          Upload Files
        </button>
        <button
          onClick={() => {
            setUploadType("text");
            resetForm();
          }}
          className={`flex items-center gap-3 px-6 py-3 rounded-lg border transition-all ${
            uploadType === "text"
              ? "border-red-400 bg-slate-800 text-red-400"
              : "border-slate-600 bg-slate-900 text-slate-300 hover:bg-slate-800"
          }`}
        >
          <AiOutlineFileText />
          Share Text
        </button>
      </div>

      {/* File Upload Section */}
      {uploadType === "files" ? (
        <div className="space-y-6">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-xl p-16 text-center transition-all ${
              isDragOver
                ? "border-red-400 bg-slate-800/50"
                : "border-slate-600 bg-slate-900 hover:border-red-400/50"
            }`}
          >
            <input
              type="file"
              multiple
              onChange={handleFileSelect}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="flex flex-col items-center gap-6">
              <AiOutlineCloudUpload className="text-5xl text-slate-400" />
              <div>
                <p className="text-2xl font-bold text-white mb-2">
                  Drop your files here
                </p>
                <p className="text-slate-400">or click to browse</p>
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                {["Images", "Documents", "Audio", "Video", "Archives"].map(
                  (type) => (
                    <span
                      key={type}
                      className="px-3 py-1 bg-slate-800 text-red-400 rounded-full text-xs border border-slate-700"
                    >
                      {type}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>
          {files.length > 0 && <FileList />}
        </div>
      ) : (
        // Text Upload Section
        <div className="border border-slate-700 rounded-xl overflow-hidden bg-slate-900">
          <div className="border-b border-slate-700 bg-slate-800 px-6 py-4">
            <h3 className="font-bold text-white flex items-center gap-2">
              <AiOutlineFileText className="h-5 w-5 text-red-400" /> Share Text
              or <Code className="h-5 w-5 text-red-400" /> Code snippets
            </h3>
          </div>
          <div className="relative">
            <textarea
              value={textContent}
              onChange={(e) => {
                setTextContent(e.target.value);
                setHasUnsavedChanges(true);
              }}
              placeholder="Type or paste your text here...
You can share:
• Notes and reminders
• Code snippets
• Messages
• Any text content"
              className="w-full h-80 p-6 bg-slate-900 text-white text-sm resize-none border-0 focus:outline-none focus:ring-2 focus:ring-red-400 placeholder-slate-500 leading-relaxed"
            />
            <div className="absolute bottom-4 right-4 text-xs text-slate-500">
              {textContent.length} characters
            </div>
          </div>
        </div>
      )}

      {/* Proceed Button */}
      <div className="mt-8 flex justify-center">
        <button
          onClick={handleProceed}
          className="flex items-center cursor-pointer gap-3 px-8 py-4 bg-red-400 text-white rounded-xl border-2 border-red-400 hover:bg-transparent hover:text-red-400 transition-all font-bold shadow-lg hover:shadow-red-400/40"
        >
          <AiOutlineLink className="text-xl" />
          Proceed
        </button>
      </div>
    </div>
  );
}
