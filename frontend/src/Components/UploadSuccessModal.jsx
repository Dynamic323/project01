import { AiOutlineClose, AiOutlineCheckCircle, AiOutlineLink } from "react-icons/ai";

export default function UploadSuccessModal({ uploadData, onClose }) {
  if (!uploadData || uploadData.length === 0) return null;

  const copyToClipboard = (link) => {
    navigator.clipboard.writeText(link);
    alert("Link copied to clipboard!");
  };

//   const handlePreview = (id) => navigate(`/view/${id}/?type=file`);
     

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-lg w-full p-6 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-red-500"
        >
          <AiOutlineClose size={22} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <AiOutlineCheckCircle className="text-green-500" size={28} />
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            Upload Successful 🎉
          </h2>
        </div>

        {/* Links */}
        <div className="space-y-3">
          {uploadData.map((item, index) => {
          

            const link = item?.link || item?.url || "";
            return (
              <div
                key={index}
                className="flex items-center justify-between bg-gray-100 dark:bg-slate-800 rounded-lg p-3"
              >
                <span className="truncate text-sm text-gray-700 dark:text-gray-300">
                  {link}


                  
                </span>
                <button
                  onClick={() => copyToClipboard(link)}
                  className="ml-3 p-1 text-blue-500 hover:text-blue-700"
                >
                  <AiOutlineLink size={20} />
                </button>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
