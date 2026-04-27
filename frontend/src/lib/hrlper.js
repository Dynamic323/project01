import { toast } from "react-toastify";

export const handleApiError = (error) => {
  const message = error.response?.data?.error || error.message || "An unexpected error occurred";
  console.log("API Error:", message);
  toast.error(message);
};
