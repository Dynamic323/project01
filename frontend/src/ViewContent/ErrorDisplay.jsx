import { FaExclamationTriangle } from 'react-icons/fa';

export function ErrorDisplay({ message }) {
  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-8 text-center">
      <div className="flex justify-center mb-4">
        <FaExclamationTriangle className="text-red-500 text-4xl" />
      </div>
      <h2 className="text-xl font-bold text-white mb-2">Error</h2>
      <p className="text-gray-300">{message}</p>
    </div>
  );
}
