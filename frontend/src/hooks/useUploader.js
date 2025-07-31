import { useState } from "react";
import api from "../api";

export default function useUploader(uploadUrl) {
  const [uploading, setUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const uploadFile = async (formData) => {
    setUploading(true);
    setError(null);
    setSuccess(false);

    console.log(formData);

    // try {
    //   const response = await api.post(uploadUrl, formData, {
    //     headers: {
    //       "Content-Type": "multipart/form-data",
    //     },
    //   });
    //   setSuccess(true);
    //   return response.data;
    // } catch (err) {
    //   setError(err.response ? err.response.data.error : "Upload failed");
    //   throw err;
    // } finally {
    //   setUploading(false);
    // }
  };

  return { uploading, isLoading, error, success, uploadFile };
}
