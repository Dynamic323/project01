import { useState } from "react";
import apiService from "../services/apiService";
import { useDashboard } from "../context/DashboardContext";

export default function useUploader() {
  const [uploading, setUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const dashboard = useDashboard();
  const service = apiService(dashboard);

  const uploadFile = async (
    {
      files,
      type,
      textTitle,
      expiresAt,
      isPublic,
      textContent,
      fileName, // This is an array of file names
      Texttype,
    },
    options = {}
  ) => {
    setUploading(true);
    setError(null);
    setSuccess(false);
    const formData = new FormData();
    const token = localStorage.getItem("token");

    if (type === "file" && files.length > 0) {
      files.forEach((file) => {
        formData.append("file", file);
      });
      formData.append(
        "title",
        Array.isArray(fileName) ? fileName.join(", ") : fileName || ""
      );
      formData.append("expiresAt", expiresAt || "");
      formData.append("isPublic", isPublic);
      formData.append("type", type);
    } else if (type === "text" || type === "code") {
      formData.append("type", Texttype || type);
      formData.append("title", textTitle || "");
      formData.append("text", textContent);
      formData.append("expiresAt", expiresAt || "");
      formData.append("isPublic", isPublic);
    } else {
      setError("Invalid type specified");
      setUploading(false);
      return;
    }

    try {
      const data = await service.upload(formData, token);
      setSuccess(true);
      return data;
    } catch (err) {
      setError(err.response ? err.response.data.error : "Upload failed");
      throw err;
    } finally {
      setUploading(false);
    }
  };

  return { uploading, isLoading, error, success, uploadFile };
}
