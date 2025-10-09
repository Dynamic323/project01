import { toast } from "react-toastify";
import { BackendURL } from "./file-helper";

export const handleDelete = async (id, type) => {
  try {
    const res = await fetch(`${BackendURL}/api/delete/${id}?type=${type}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error(`Failed to delete ${type}`);
    toast.success(`${type} deleted successfully`);
    return true; // Return success status
  } catch (err) {
    toast.error(`Failed to delete ${type}`);
    console.error(err);
    return false; // Return failure status
  }
};
