
import {
  AiOutlineSetting,
  AiOutlineUser,
  AiOutlineKey,
  AiOutlineBell,
  AiOutlineEye,
  AiOutlineSave,
} from "react-icons/ai";

export function SettingsPage() {
  return (
    <div className="p-8 w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3 mb-2">
          <AiOutlineSetting className="h-8 w-8 text-red-400" />
          Account Settings
        </h1>
        <p className="text-slate-400">
          Manage your DyshareX account and preferences
        </p>
      </div>

      <div className="grid gap-8">
        {/* Profile Settings */}
        <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
            <AiOutlineUser className="h-5 w-5 text-red-400" />
            Profile Information
          </h2>
          <div className="grid gap-4">
            <div>
              <label className="block text-sm text-slate-300 mb-2">
                Display Name
              </label>
              <input
                type="text"
                defaultValue="John Doe"
                className="w-full p-3 bg-slate-800 border border-slate-600 rounded-lg text-white focus:border-red-400 focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                defaultValue="john@example.com"
                className="w-full p-3 bg-slate-800 border border-slate-600 rounded-lg text-white focus:border-red-400 focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-300 mb-2">
                About Me
              </label>
              <textarea
                defaultValue="I love sharing files and staying organized!"
                className="w-full p-3 bg-slate-800 border border-slate-600 rounded-lg text-white focus:border-red-400 focus:outline-none transition-colors h-24 resize-none"
              />
            </div>
          </div>
        </div>

        {/* Account Settings */}
        <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
            <AiOutlineKey className="h-5 w-5 text-red-400" />
            Account Security
          </h2>
          <div className="grid gap-4">
            <div>
              <label className="block text-sm text-slate-300 mb-2">
                Change Password
              </label>
              <div className="flex gap-2">
                <input
                  type="password"
                  placeholder="Enter new password"
                  className="flex-1 p-3 bg-slate-800 border border-slate-600 rounded-lg text-white focus:border-red-400 focus:outline-none transition-colors"
                />
                <button className="px-4 py-3 bg-red-400 text-white rounded-lg font-semibold hover:bg-red-300 transition-colors border border-slate-600">
                  Update
                </button>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="two-factor"
                className="w-4 h-4 text-red-400 bg-slate-800 border-slate-600 rounded focus:ring-red-400"
              />
              <label htmlFor="two-factor" className="text-sm text-slate-300">
                Enable two-factor authentication for extra security
              </label>
            </div>
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
            <AiOutlineEye className="h-5 w-5 text-red-400" />
            Privacy & Sharing
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-slate-800 border border-slate-600 rounded-lg">
              <div>
                <div className="text-white">Default File Visibility</div>
                <div className="text-sm text-slate-400">
                  Choose who can see your files by default
                </div>
              </div>
              <select className="p-2 bg-slate-700 border border-slate-600 rounded text-white focus:border-red-400 focus:outline-none">
                <option>Public - Anyone with link</option>
                <option>Private - Only me</option>
                <option>Friends - People I choose</option>
              </select>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-800 border border-slate-600 rounded-lg">
              <div>
                <div className="text-white">Allow File Analytics</div>
                <div className="text-sm text-slate-400">
                  Let us track views and downloads for insights
                </div>
              </div>
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 text-red-400 bg-slate-800 border-slate-600 rounded focus:ring-red-400"
              />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
            <AiOutlineBell className="h-5 w-5 text-red-400" />
            Notifications
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-slate-800 border border-slate-600 rounded-lg">
              <div>
                <div className="text-white">Email Notifications</div>
                <div className="text-sm text-slate-400">
                  Get updates about your files via email
                </div>
              </div>
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 text-red-400 bg-slate-800 border-slate-600 rounded focus:ring-red-400"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-800 border border-slate-600 rounded-lg">
              <div>
                <div className="text-white">File Activity Alerts</div>
                <div className="text-sm text-slate-400">
                  Notify me when someone views or downloads my files
                </div>
              </div>
              <input
                type="checkbox"
                className="w-4 h-4 text-red-400 bg-slate-800 border-slate-600 rounded focus:ring-red-400"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button className="flex items-center gap-2 px-6 py-3 bg-red-400 text-white rounded-lg font-semibold hover:bg-red-300 transition-colors border border-slate-600">
            <AiOutlineSave className="h-4 w-4" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
