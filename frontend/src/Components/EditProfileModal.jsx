import { useState } from "react";
import { toast } from "react-toastify";

export default function EditProfileModal({
  isOpen,
  onClose,
  user,
  updateUserEmail,
  updateUserDisplayName,
}) {
  const [email, setEmail] = useState(user?.email || "");
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    console.log(user);
    
    try {
      if (email !== user.email) {
        await updateUserEmail(email);
      }
      if (displayName !== user.displayName) {
        await updateUserDisplayName(displayName);
      }
      toast.success("Profile updated successfully!");
      onClose();
    } catch (error) {
      toast.error(error.message);
      console.log(error);
      
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-md bg-black/30 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-slate-900 border border-slate-700 rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold text-white mb-4">Edit Profile</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm text-slate-300 mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm text-slate-300 mb-2">Display Name</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full p-3 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none"
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-red-400 text-white rounded-lg hover:bg-red-300 disabled:opacity-50"
            >
              {isLoading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
