import { useEffect, useState } from "react";
import {
  AiOutlineSetting,
  AiOutlineUser,
  AiOutlineBell,
  AiOutlineEye,
  AiOutlineSave,
  AiOutlineEdit,
  AiOutlineCheckCircle,
  AiOutlineCloseCircle,
} from "react-icons/ai";
import { useAuth } from "../context/Authcontext";
import { toast } from "react-toastify";
import EditProfileModal from "../Components/EditProfileModal";

export function SettingsPage() {
  const {
    user,
    updateUserSettings,
    updateUserEmail,
    updateUserDisplayName,
  } = useAuth();

  const [settings, setSettings] = useState({
    isPublic: user?.isPublic ?? true,
    defaultType: user?.defaultType ?? "text",
    allowAnalytics: user?.allowAnalytics ?? true,
    emailNotifications: user?.emailNotifications ?? true,
    fileActivityAlerts: user?.fileActivityAlerts ?? false,
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      setSettings({
        isPublic: user.isPublic ?? true,
        defaultType: user.defaultType ?? "text",
        allowAnalytics: user.allowAnalytics ?? true,
        emailNotifications: user.emailNotifications ?? true,
        fileActivityAlerts: user.fileActivityAlerts ?? false,
      });
    }
  }, [user]);

  const saveSettings = async () => {
    try {
      await updateUserSettings(settings);
      toast.success(" Settings saved successfully!", {
        icon: <AiOutlineCheckCircle className="text-green-500" />,
      });
    } catch (error) {
      toast.error("Failed to save settings", {
        icon: <AiOutlineCloseCircle className="text-red-500" />,
      });
      console.error(error);
    }
  };

  const handleToggle = (key) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <AiOutlineSetting className="text-2xl text-red-400" />
          <h1 className="text-3xl font-bold">Settings</h1>
        </div>

        {/* Settings Card */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-lg overflow-hidden">
          {/* Profile Section */}
          <div className="p-6 border-b border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <AiOutlineUser className="text-xl text-red-400" />
                <h2 className="text-xl font-semibold">Profile</h2>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-slate-700 w-16 h-16 rounded-full flex items-center justify-center text-xl">
                {user?.displayName?.charAt(0) || "?"}
              </div>
              <div>
                <p className="font-medium">{user?.displayName || "No name"}</p>
                <p className="text-sm text-slate-400">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="mt-4 flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
            >
              <AiOutlineEdit />
              Edit Profile
            </button>
          </div>

          {/* Privacy Section */}
          <div className="p-6 border-b border-slate-700">
            <div className="flex items-center gap-3 mb-6">
              <AiOutlineEye className="text-xl text-red-400" />
              <h2 className="text-xl font-semibold">Privacy</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Public Profile</p>
                  <p className="text-sm text-slate-400">Allow others to see your profile</p>
                </div>
                <button
                  onClick={() => handleToggle("isPublic")}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.isPublic ? "bg-red-500" : "bg-slate-600"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.isPublic ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Notifications Section */}
          <div className="p-6 border-b border-slate-700">
            <div className="flex items-center gap-3 mb-6">
              <AiOutlineBell className="text-xl text-red-400" />
              <h2 className="text-xl font-semibold">Notifications</h2>
            </div>
            <div className="space-y-5">
              {[
                {
                  key: "emailNotifications",
                  title: "Email Notifications",
                  description: "Receive emails for updates and alerts",
                },
                {
                  key: "fileActivityAlerts",
                  title: "File Activity Alerts",
                  description: "Get notified when files are changed",
                },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-slate-400">{item.description}</p>
                  </div>
                  <button
                    onClick={() => handleToggle(item.key)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings[item.key] ? "bg-red-500" : "bg-slate-600"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings[item.key] ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <div className="p-6">
            <button
              onClick={saveSettings}
              className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-lg font-medium transition-colors"
            >
              <AiOutlineSave />
              Save Settings
            </button>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={user}
        updateUserEmail={updateUserEmail}
        updateUserDisplayName={updateUserDisplayName}
      />
    </div>
  );
}
