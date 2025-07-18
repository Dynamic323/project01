import React from "react";
import {
  AiOutlineCloudUpload,
  AiOutlineLink,
  AiOutlineGithub,
  AiOutlineTwitter,
  AiOutlineCheck,
  AiOutlineHistory,
  AiOutlineTeam,
  AiOutlineFile,
  AiOutlinePicture,
  AiOutlineAudio,
  AiOutlineVideoCamera,
  AiOutlineFileText,
  AiOutlineDelete,
  AiOutlineArrowRight,
} from "react-icons/ai"
function Hero() {

    const fileTypes = [
    { icon: AiOutlineFile, name: "Documents", types: "PDF, DOC, TXT, etc." },
    { icon: AiOutlinePicture, name: "Images", types: "JPG, PNG, GIF, etc." },
    { icon: AiOutlineAudio, name: "Audio", types: "MP3, WAV, M4A, etc." },
    { icon: AiOutlineVideoCamera, name: "Videos", types: "MP4, AVI, MOV, etc." },
  ]

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-red-400/5 to-transparent"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <div className="mb-8">
            <span className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-full text-red-400 text-sm">
              Share Any File, Anywhere
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            DyshareX
            <br />
            <span className="text-3xl md:text-5xl text-slate-400">
              Share Files Instantly
            </span>
          </h1>

          <p className="text-xl text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed">
            Upload any file - documents, images, audio, videos, or text - and
            get a shareable link instantly. No complicated setup, no waiting.
            Just drag, drop, and share.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-red-400 to-red-500 text-white rounded-xl font-bold text-lg shadow-lg shadow-red-400/20 hover:shadow-red-400/40 hover:from-red-300 hover:to-red-400 transition-all duration-300">
              <AiOutlineCloudUpload className="h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
              Start Sharing Now
              <AiOutlineArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
            </button>

            <a
              href="#demo"
              className="flex items-center gap-3 px-8 py-4 bg-slate-800 border border-slate-600 text-white rounded-xl font-semibold hover:bg-slate-700 hover:border-slate-500 transition-all duration-200"
            >
              <AiOutlineLink className="h-5 w-5" />
              Try Demo Below
            </a>
          </div>

          {/* File Types Preview */}
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {fileTypes.map((type, index) => (
                <div
                  key={index}
                  className="bg-slate-800 border border-slate-700 rounded-lg p-4 hover:border-slate-600 transition-colors"
                >
                  <type.icon className="h-8 w-8 text-red-400 mx-auto mb-2" />
                  <h3 className="text-white font-semibold text-sm mb-1">
                    {type.name}
                  </h3>
                  <p className="text-slate-400 text-xs">{type.types}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
