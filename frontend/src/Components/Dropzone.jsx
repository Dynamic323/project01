import { useState, useEffect } from "react";
import {
  AiOutlineCloudUpload,
  AiOutlineFile,
  AiOutlineFileText,
  AiOutlinePicture,
  AiOutlineAudio,
  AiOutlineVideoCamera,
  AiOutlineDelete,
  AiOutlineEdit,
  AiOutlineLink,
} from "react-icons/ai";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import useUploader from "../hooks/useUploader";
import UploadSuccessModal from "./UploadSuccessModal ";
import { useAuth } from "../context/Authcontext";
import ToggleButtons from "./ToggleButtons";
import FileUploadSection from "./FileUploadSection";
import TextUploadSection from "./TextUploadSection";
import UploadFormModal from "./UploadFormModal";

const FREE_PLAN_MAX_SIZE_MB = 50;

// Main Dropzone component
export function Dropzone() {
  const {user} = useAuth()
  const UserPlan = user?.UserPlan || "free"
  const isFreePlan = UserPlan === "free" ? true : false;

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
      toast.info("Filename editing is only available for Pro users.");
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
      <UploadFormModal
        uploadType={uploadType}
        files={files}
        contentTitle={contentTitle}
        setContentTitle={setContentTitle}
        dayName={dayName}
        isPublic={isPublic}
        setIsPublic={setIsPublic}
        contentType={contentType}
        setContentType={setContentType}
        isSubmitting={isSubmitting}
        handleSubmit={handleSubmit}
        handleCancelSubmit={handleCancelSubmit}
        isFreePlan={isFreePlan}
        handleFilenameEdit={handleFilenameEdit}
        getFileIcon={getFileIcon}
        setShowmodal={setShowmodal}
        fileNames={fileNames}
      />
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto p-6 space-y-8">
      <ToggleButtons
        uploadType={uploadType}
        setUploadType={setUploadType}
        resetForm={resetForm}
      />

      {uploadType === "files" ? (
        <FileUploadSection
          isDragOver={isDragOver}
          files={files}
          isFreePlan={isFreePlan}
          handleDragOver={handleDragOver}
          handleDragLeave={handleDragLeave}
          handleDrop={handleDrop}
          handleFileSelect={handleFileSelect}
          removeFile={removeFile}
          handleFilenameEdit={handleFilenameEdit}
          getFileIcon={getFileIcon}
          calculateTotalSize={calculateTotalSize}
          FREE_PLAN_MAX_SIZE_MB={FREE_PLAN_MAX_SIZE_MB}
        />
      ) : (
        <TextUploadSection
          textContent={textContent}
          setTextContent={setTextContent}
          setHasUnsavedChanges={setHasUnsavedChanges}
        />
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





