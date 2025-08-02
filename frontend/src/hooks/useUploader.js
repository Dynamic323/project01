import { useState } from "react";
import api from "../api";

export default function useUploader(uploadUrl) {
  const [uploading, setUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const uploadFile = async ({
    files,
    type,
    textTitle,
    expiresAt,
    isPublic,
    textContent,
    fileName,
    Texttype,
  }) => {
    setUploading(true);
    setError(null);
    setSuccess(false);
    const formData = new FormData();

    if (type === "file" && files.length > 0) {
      files.forEach((file) => {
        formData.append("file", file || []);
      });
      formData.append("title", fileName || "");
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

    // for (let pair of formData.entries()) {
    //   if (pair[1] instanceof File) {
    //     console.log("File:", pair[1]);
    //     console.log("File details:", {
    //       name: pair[1].name,
    //       size: pair[1].size,
    //       type: pair[1].type,
    //       lastModified: pair[1].lastModified,
    //     });
    //   } else {
    //     console.log(pair[0] + ":", pair[1]);
    //   }
    // }

    try {
      const response = await api.post(uploadUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
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
