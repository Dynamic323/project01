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
import { useNavigate } from "react-router-dom";
import useUploader from "../hooks/useUploader";
import Spinner from "./Spinner";
import { Code, StepBack } from "lucide-react";
import UploadSuccessModal from "./UploadSuccessModal ";

const isFreePlan = false;
const FREE_PLAN_MAX_SIZE_MB = 50;

export function Dropzone() {
  // State variables
  const [uploadType, setUploadType] = useState("files");
  const [isDragOver, setIsDragOver] = useState(false);
  const [files, setFiles] = useState([]);
  const [textContent, setTextContent] = useState("");
  const [Showmodal, setShowmodal] = useState(false);
  const [expiresAt, setExpiresAt] = useState("");
  const [dayName, setDayName] = useState("");
  const [contentType, setContentType] = useState("text");
  const [isPublic, setIsPublic] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [uploadData, setUploadData] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contentTitle, setContentTitle] = useState("");
  const [fileNames, setFileNames] = useState([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [abortController, setAbortController] = useState(null);
  const navigate = useNavigate();
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

  // Calculate total file size
  const calculateTotalSize = (fileList) => {
    return fileList.reduce((total, file) => total + file.size, 0);
  };

  // Check if files exceed free plan limit
  const checkFileSizeLimit = (fileList) => {
    const totalSizeMB = calculateTotalSize(fileList) / (1024 * 1024);
    return totalSizeMB <= FREE_PLAN_MAX_SIZE_MB;
  };

  // Validate files
  const validateFiles = (fileList) => {
    if (isFreePlan && !checkFileSizeLimit(fileList)) {
      toast.error(
        `Free plan limit exceeded. Maximum allowed size is ${FREE_PLAN_MAX_SIZE_MB}MB.`
      );
      return false;
    }
    return true;
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    const allFiles = [...files, ...droppedFiles];
    if (!validateFiles(allFiles)) {
      return;
    }
    const uniqueFiles = droppedFiles.filter(
      (newFile) =>
        !files.some((existingFile) => existingFile.name === newFile.name)
    );
    setFiles([...files, ...uniqueFiles]);
    setFileNames([...fileNames, ...uniqueFiles.map((file) => file.name)]);
    setHasUnsavedChanges(true);
  };

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const allFiles = [...files, ...selectedFiles];
    if (!validateFiles(allFiles)) {
      return;
    }
    const uniqueFiles = selectedFiles.filter(
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
    if (abortController) {
      abortController.abort();
      setAbortController(null);
    }
  };

  const handleProceed = () => {
    if (textContent === "" && files.length === 0) {
      toast.error("Please enter some text or select files to upload.");
      return;
    }
    setShowmodal(true);
    setFileNames(files.map((file) => file.name));
  };

  const handleCancelSubmit = () => {
    if (abortController) {
      abortController.abort();
    }
    setIsSubmitting(false);
    setAbortController(null);
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
      const controller = new AbortController();
      setAbortController(controller);
      let response = null;
      if (files.length != 0) {
        response = await uploadFile(
          {
            files: files,
            fileName: fileNames,
            type: "file",
            expiresAt,
            isPublic,
            user_id: JSON.parse(localStorage.getItem("user")).uid,
          },
          { signal: controller.signal }
        );
      } else {
        response = await uploadFile(
          {
            textContent,
            textTitle: contentTitle,
            type: contentType,
            expiresAt,
            isPublic,
            user_id: JSON.parse(localStorage.getItem("user")).uid,
          },
          { signal: controller.signal }
        );
      }

      console.log(response);

      toast.success("Upload successful! Link generated.", 2000);
      setHasUnsavedChanges(false);
      resetForm();
      setIsSubmitting(false);
      setShowmodal(false);

      // Show the success modal
      const data = Array.isArray(response.data)
        ? response.data
        : [response.data];
      setUploadData(data);
      setShowSuccessModal(true);
    } catch (error) {
      if (error.name !== "AbortError") {
        toast.error(error?.message || "Upload failed. Please try again.");
      }
      setIsSubmitting(false);
      setAbortController(null);
    }
  };

  useEffect(() => {
    const now = new Date();
    const expiresDate = new Date(now.setDate(now.getDate() + 2));
    setExpiresAt(expiresDate.toISOString());
    const dayOfWeek = expiresDate.toLocaleDateString("en-US", {
      weekday: "long",
    });
    setDayName(dayOfWeek);
  }, []);

  if (Showmodal) {
    return (
      <div className="max-w-3xl mx-auto p-6 space-y-6">
        <button
          className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors"
          onClick={() => setShowmodal(false)}
        >
          <StepBack /> Back
        </button>
        <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title Section */}
            <div>
              <label className="block text-white text-xl font-medium mb-2">
                {uploadType === "files"
                  ? `File Name${files.length > 1 ? "s" : ""}`
                  : "Save as (Title)"}
              </label>
              {uploadType === "files" ? (
                <div className="space-y-3 max-h-40 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800 hover:scrollbar-thumb-slate-500">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-slate-700 rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        {getFileIcon(file.name)}
                        <span className="text-white">{file.name}</span>
                      </div>
                      {!isFreePlan && (
                        <button
                          onClick={() => handleFilenameEdit(index)}
                          type="button"
                          className="p-1 text-slate-400 hover:text-blue-400 transition-colors"
                          title="Edit filename"
                        >
                          <AiOutlineEdit />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <input
                  className="w-full text-xl p-3 bg-slate-900 text-white border border-slate-700 focus:border-red-400 outline-none rounded-lg transition-colors"
                  type="text"
                  value={contentTitle}
                  onChange={(e) => setContentTitle(e.target.value)}
                  placeholder="Enter a title"
                  required
                />
              )}
            </div>

            {/* Expiry Section */}
            <div className="flex items-center justify-between p-4 bg-slate-900 rounded-lg border border-slate-700">
              <p className="text-white">
                Will expire:{" "}
                <span className="font-bold text-red-400">
                  {dayName} (in 2 days)
                </span>
              </p>
              <button
                type="button"
                className="text-sm text-red-400 border border-red-400 px-3 py-1 rounded-lg hover:bg-red-400 hover:text-white transition-colors"
                onClick={() => {
                  if (isFreePlan) {
                    toast.error("Upgrade your Account to use this feature!");
                  } else {
                    toast.info("Expiry change feature coming soon!");
                  }
                }}
              >
                Change Expiry
              </button>
            </div>

            {/* Visibility Section */}
            <div className="flex items-center gap-4 p-4 bg-slate-900 rounded-lg border border-slate-700">
              <span className="text-white">Visibility:</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    isPublic
                      ? "bg-red-400 text-white shadow-md"
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
                      ? "bg-red-400 text-white shadow-md"
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
              <div className="p-4 bg-slate-900 rounded-lg border border-slate-700">
                <label className="block text-white mb-2">Type:</label>
                <select
                  className="w-full bg-slate-800 p-3 rounded-lg border border-slate-700 focus:border-red-400 outline-none transition-colors"
                  value={contentType}
                  onChange={(e) => setContentType(e.target.value)}
                >
                  <option value="text">Text</option>
                  <option value="code">Code</option>
                </select>
              </div>
            )}

            {/* Submit and Cancel Buttons */}
            <div className="flex justify-end gap-4">
              <button
                type="submit"
                // disabled={isSubmitting}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all ${
                  isSubmitting
                    ? "bg-slate-700 text-slate-400 cursor-not-allowed"
                    : "bg-red-400 text-white hover:bg-red-500 shadow-md hover:shadow-red-400/30"
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
              {isSubmitting && (
                <button
                  type="button"
                  onClick={handleCancelSubmit}
                  className="flex items-center gap-2 px-6 py-3 bg-transparent text-red-400 border border-red-400 rounded-lg hover:bg-red-400/10 transition-colors"
                >
                  <AiOutlineDelete />
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto p-6 space-y-8">
      {/* Toggle Buttons */}
      <div className="flex gap-3 mb-8">
        <button
          onClick={() => {
            setUploadType("files");
            resetForm();
          }}
          className={`flex items-center gap-3 px-6 py-3 rounded-lg border-2 transition-all ${
            uploadType === "files"
              ? "border-red-400 bg-slate-800 text-red-400 shadow-md"
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
          className={`flex items-center gap-3 px-6 py-3 rounded-lg border-2 transition-all ${
            uploadType === "text"
              ? "border-red-400 bg-slate-800 text-red-400 shadow-md"
              : "border-slate-600 bg-slate-900 text-slate-300 hover:bg-slate-800"
          }`}
        >
          <AiOutlineFileText />
          Share Text
        </button>
      </div>

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
                {isFreePlan && (
                  <p className="text-yellow-400 text-sm mt-2">
                    Free plan limit: {FREE_PLAN_MAX_SIZE_MB}MB max
                  </p>
                )}
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                {["Images", "Documents", "Audio", "Video", "Archives"].map(
                  (type) => (
                    <span
                      key={type}
                      className="px-4 py-2 bg-slate-800 text-red-400 rounded-full text-xs border border-slate-700"
                    >
                      {type}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>

          {files.length > 0 && (
            <div className="border border-slate-700 rounded-xl bg-slate-900 overflow-hidden">
              <div className="border-b border-slate-700 bg-slate-800 px-6 py-4">
                <h4 className="font-bold text-white flex items-center gap-2">
                  <AiOutlineFile className="text-red-400" />
                  Selected Files ({files.length})
                  <span className="text-xs text-yellow-400 ml-2">
                    (Max 50MB for free plan)
                  </span>
                </h4>
              </div>
              <div className="p-6 space-y-3">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-slate-800 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {getFileIcon(file.name)}
                      <div>
                        <div className="text-white font-medium">
                          {file.name}
                        </div>
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
                <div className="text-xs text-yellow-400 mt-2">
                  Total size:{" "}
                  {(calculateTotalSize(files) / (1024 * 1024)).toFixed(2)} MB
                  /50MB
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
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
              placeholder="Type or paste your text here..."
              className="w-full h-80 p-6 bg-slate-900 text-white text-sm resize-none border-0 focus:outline-none focus:ring-2 focus:ring-red-400 placeholder-slate-500 leading-relaxed"
            />
            <div className="absolute bottom-4 right-4 text-xs text-slate-500">
              {textContent.length} characters
            </div>
          </div>
        </div>
      )}

      {/* Share Button */}
      <div className="mt-8 flex justify-center">
        <button
          onClick={handleProceed}
          className="flex items-center cursor-pointer gap-3 px-8 py-4 bg-red-400 text-white rounded-xl border-2 border-red-400 hover:bg-transparent hover:text-red-400 transition-all font-bold shadow-lg hover:shadow-red-400/40"
        >
          <AiOutlineLink className="text-xl" />
          Proceed
        </button>
      </div>

      {showSuccessModal && (
        <UploadSuccessModal
          data={uploadData}
          onClose={() => setShowSuccessModal(false)}
        />
      )}
    </div>
  );
}
