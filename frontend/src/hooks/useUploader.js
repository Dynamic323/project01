import { useState } from "react";
import api from "../api";

export default function useUploader(uploadUrl) {
  const [uploading, setUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
console.log("lol");

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
      user_id,
    },
    options = {}
  ) => {
    console.log("UserID" + user_id);
    
    setUploading(true);
    setError(null);
    setSuccess(false);
    const formData = new FormData();

    if (type === "file" && files.length > 0) {
      // Append all files with the field name "file"
      files.forEach((file) => {
        formData.append("file", file);
      });
      // Append the title as a comma-separated string of file names
      formData.append(
        "title",
        Array.isArray(fileName) ? fileName.join(", ") : fileName || ""
      );
      formData.append("expiresAt", expiresAt || "");
      formData.append("user_id", user_id || "");
      formData.append("isPublic", isPublic);
      formData.append("type", type);
    } else if (type === "text" || type === "code") {
      formData.append("type", Texttype || type);
      formData.append("user_id", user_id || "");
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
      const response = await api.post(uploadUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        ...options,
      });
      setSuccess(true);
      return response.data;
    } catch (err) {
      setError(err.response ? err.response.data.error : "Upload failed");
      throw err;
    } finally {
      setUploading(false);
    }
  };

  return { uploading, isLoading, error, success, uploadFile };
}
