import { FaArrowRight, FaExclamationTriangle } from 'react-icons/fa';

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
      {/* Logo Space - Replace with your actual logo component */}
      <div className="mb-12">
        <div className="w-24 h-24 bg-red-400 rounded-2xl flex items-center justify-center shadow-lg">
          <span className="text-slate-900 font-bold text-4xl font-mono">U</span>
        </div>
      </div>

      {/* Main 404 Content */}
      <div className="max-w-2xl text-center">
        {/* Animated Arrow Vector */}
        <div className="relative mb-8 flex justify-center">
          <div className="relative">
            {/* Arrow shaft */}
            <div className="w-64 h-2 bg-slate-700 rounded-full mx-auto mb-2">
              <div className="w-full h-full bg-gradient-to-r from-red-400 to-slate-600 rounded-full animate-pulse"></div>
            </div>

            {/* Arrow head - animated */}
            <div className="absolute -right-8 top-1/2 transform -translate-y-1/2">
              <div className="w-0 h-0 border-t-[16px] border-t-transparent
                              border-b-[16px] border-b-transparent
                              border-l-[24px] border-l-red-400
                              transition-all duration-500 hover:scale-110">
                <div className="absolute -left-2 top-1/2 transform -translate-y-1/2
                                w-4 h-4 bg-slate-900 rounded-full border-2 border-red-400"></div>
              </div>
            </div>

            {/* Broken arrow pieces */}
            <div className="absolute left-16 top-1/2 transform -translate-y-1/2 flex space-x-2">
              <div className="w-3 h-8 bg-slate-700 rounded-t-full transform -rotate-12"></div>
              <div className="w-3 h-6 bg-slate-700 rounded-t-full transform rotate-10"></div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-6">
          <div className="flex items-center justify-center mb-4">
            <FaExclamationTriangle className="text-red-400 text-3xl mr-2" />
            <h1 className="text-5xl font-bold text-slate-100 font-mono">404</h1>
          </div>
          <h2 className="text-2xl font-semibold text-slate-100 mb-2">
            Oops! You've taken a wrong turn.
          </h2>
          <p className="text-slate-400 text-lg">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/"
            className="px-6 py-3 bg-red-400 text-slate-900 font-bold rounded-lg
                      hover:bg-red-500 transition-all duration-300
                      flex items-center justify-center"
          >
            <FaArrowRight className="mr-2" />
            Return Home
          </a>
          <a
            href="/contact"
            className="px-6 py-3 border-2 border-slate-700 text-slate-100 font-bold rounded-lg
                      hover:bg-slate-800 transition-all duration-300
                      flex items-center justify-center"
          >
            Contact Support
          </a>
        </div>

        {/* Decorative Elements */}
        <div className="mt-12 flex justify-center space-x-8">
          <div className="w-3 h-3 bg-slate-700 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-slate-700 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-3 h-3 bg-slate-700 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-16 text-center text-slate-500 text-sm">
        <p>© {new Date().getFullYear()} Your App Name. All rights reserved.</p>
      </div>
    </div>
  );
}
