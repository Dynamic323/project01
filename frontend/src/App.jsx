"use client";

import * as React from "react";
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
} from "react-icons/ai";
import Navbar from "./Components/Navbar";
import Hero from "./Components/Hero";

function App() {
  const [isDragOver, setIsDragOver] = React.useState(false);
  const [demoFiles, setDemoFiles] = React.useState([]);
  const [uploadType, setUploadType] = React.useState("files");
  const [textContent, setTextContent] = React.useState("");

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    setDemoFiles(droppedFiles.slice(0, 3)); // Limit to 3 files for demo
  };

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setDemoFiles(selectedFiles.slice(0, 3));
  };

  const removeFile = (index) => {
    setDemoFiles(demoFiles.filter((_, i) => i !== index));
  };

  const getFileIcon = (fileName) => {
    const ext = fileName.split(".").pop()?.toLowerCase();
    if (["jpg", "jpeg", "png", "gif", "svg", "webp"].includes(ext))
      return <AiOutlinePicture className="h-4 w-4 text-red-400" />;
    if (["mp3", "wav", "m4a", "aac", "flac"].includes(ext))
      return <AiOutlineAudio className="h-4 w-4 text-red-400" />;
    if (["mp4", "avi", "mov", "wmv", "flv"].includes(ext))
      return <AiOutlineVideoCamera className="h-4 w-4 text-red-400" />;
    return <AiOutlineFile className="h-4 w-4 text-red-400" />;
  };

  const features = [
    {
      icon: AiOutlineCloudUpload,
      title: "Easy Upload",
      description: "Drag & drop any file or paste text - it's that simple",
    },
    {
      icon: AiOutlineLink,
      title: "Instant Sharing",
      description: "Get a shareable link in seconds, no account required",
    },
    {
      icon: AiOutlineHistory,
      title: "Keep Track",
      description: "View your sharing history and manage all your files",
    },
    {
      icon: AiOutlineTeam,
      title: "Share Anywhere",
      description:
        "Send your files to anyone via email, social media, or messaging",
    },
  ];

  const pricingPlans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      features: [
        "10 GB Storage",
        "Unlimited public shares",
        "Basic file management",
        "Email support",
      ],
      popular: false,
    },
    {
      name: "Pro",
      price: "$9.99",
      period: "month",
      features: [
        "100 GB Storage",
        "Private sharing",
        "Advanced analytics",
        "Priority support",
        "Custom links",
      ],
      popular: true,
    },
    {
      name: "Business",
      price: "$29.99",
      period: "month",
      features: [
        "500 GB Storage",
        "Team collaboration",
        "Admin controls",
        "Brand customization",
        "24/7 support",
      ],
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Hero Section */}
      <Hero />

      {/* Interactive Demo Section */}
      <section
        id="demo"
        className="py-24 bg-gradient-to-b from-slate-800 to-slate-900"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Try It Right Now
            </h2>
            <p className="text-xl text-slate-400">
              See how easy it is to share files with DyshareX
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Toggle Buttons */}
            <div className="flex gap-3 mb-8 justify-center">
              <button
                onClick={() => setUploadType("files")}
                className={`flex items-center gap-3 px-6 py-3 rounded-lg border transition-all duration-200 ${
                  uploadType === "files"
                    ? "border-red-400 bg-slate-800 text-red-400 shadow-lg shadow-red-400/20"
                    : "border-slate-600 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:border-slate-500"
                }`}
              >
                <AiOutlineFile className="h-5 w-5" />
                <span>Upload Files</span>
              </button>
              <button
                onClick={() => setUploadType("text")}
                className={`flex items-center gap-3 px-6 py-3 rounded-lg border transition-all duration-200 ${
                  uploadType === "text"
                    ? "border-red-400 bg-slate-800 text-red-400 shadow-lg shadow-red-400/20"
                    : "border-slate-600 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:border-slate-500"
                }`}
              >
                <AiOutlineFileText className="h-5 w-5" />
                <span>Share Text</span>
              </button>
            </div>

            {uploadType === "files" ? (
              <div className="space-y-6">
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`relative border-2 border-dashed rounded-xl p-16 text-center transition-all duration-300 ${
                    isDragOver
                      ? "border-red-400 bg-slate-800/50 shadow-lg shadow-red-400/10 scale-105"
                      : "border-slate-600 bg-slate-900 hover:border-red-400/50 hover:bg-slate-800/30"
                  }`}
                >
                  <input
                    type="file"
                    multiple
                    onChange={handleFileSelect}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />

                  <div className="flex flex-col items-center gap-6">
                    <div className="relative">
                      <AiOutlineCloudUpload
                        className={`h-16 w-16 text-slate-400 transition-all duration-300 ${
                          isDragOver ? "scale-110 text-red-400" : ""
                        }`}
                      />
                      <div className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-400 flex items-center justify-center animate-pulse">
                        <AiOutlineFile className="h-3 w-3 text-white" />
                      </div>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white mb-2">
                        {isDragOver
                          ? "Drop your files now!"
                          : "Drop your files here"}
                      </p>
                      <p className="text-slate-400">
                        or click to browse and select files
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {[
                        "Images",
                        "Documents",
                        "Audio",
                        "Video",
                        "Archives",
                        "Any file type",
                      ].map((type) => (
                        <span
                          key={type}
                          className="px-3 py-1 bg-slate-800 text-red-400 rounded-full text-xs border border-slate-700 hover:border-red-400 transition-colors"
                        >
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {demoFiles.length > 0 && (
                  <div className="border border-slate-700 rounded-xl bg-slate-900 overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
                    <div className="border-b border-slate-700 bg-slate-800 px-6 py-4">
                      <h4 className="font-bold text-white flex items-center gap-2">
                        <AiOutlineFile className="h-5 w-5 text-red-400" />
                        Demo Files ({demoFiles.length})
                      </h4>
                    </div>
                    <div className="p-6 space-y-3">
                      {demoFiles.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 bg-slate-800 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors animate-in slide-in-from-left-4 duration-300"
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <div className="flex items-center gap-3">
                            {getFileIcon(file.name)}
                            <div>
                              <div className="text-white">{file.name}</div>
                              <div className="text-sm text-slate-400">
                                {(file.size / 1024).toFixed(1)} KB
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => removeFile(index)}
                            className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded-lg transition-colors"
                          >
                            <AiOutlineDelete className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="border border-slate-700 rounded-xl overflow-hidden bg-slate-900">
                <div className="border-b border-slate-700 bg-slate-800 px-6 py-4">
                  <h3 className="font-bold text-white flex items-center gap-2">
                    <AiOutlineFileText className="h-5 w-5 text-red-400" />
                    Demo Text Sharing
                  </h3>
                </div>
                <div className="relative">
                  <textarea
                    value={textContent}
                    onChange={(e) => setTextContent(e.target.value)}
                    placeholder="Type or paste your text here to try it out...

You can share:
• Notes and reminders
• Code snippets  
• Messages
• Any text content

This is just a demo - try typing something!"
                    className="w-full h-80 p-6 bg-slate-900 text-white text-sm resize-none border-0 focus:outline-none focus:ring-2 focus:ring-red-400 placeholder-slate-500 leading-relaxed transition-all duration-200"
                  />
                  <div className="absolute bottom-4 right-4 text-xs text-slate-500">
                    {textContent.length} characters
                  </div>
                </div>
              </div>
            )}

            {/* Demo Share Button */}
            <div className="mt-8 flex justify-center">
              <button className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-red-400 to-red-500 text-white rounded-xl border-2 border-red-400 hover:from-red-300 hover:to-red-400 transition-all duration-300 font-bold text-lg shadow-lg shadow-red-400/20 hover:shadow-red-400/40 hover:scale-105">
                <AiOutlineLink className="h-6 w-6 group-hover:rotate-12 transition-transform duration-300" />
                Generate Demo Link
              </button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-slate-400 text-sm">
                This is a demo - no files are actually uploaded. Sign up to
                start sharing for real!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="py-24 bg-gradient-to-b from-slate-900 to-slate-800"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Why Choose DyshareX?
            </h2>
            <p className="text-xl text-slate-400">
              Everything you need for hassle-free file sharing
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-slate-900 border border-slate-700 rounded-xl p-6 hover:border-slate-600 hover:bg-slate-800/50 transition-all duration-200 group"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-red-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-400 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-xl text-slate-400">
              Three simple steps to share any file
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Upload",
                desc: "Drag & drop your file or paste text",
                icon: AiOutlineCloudUpload,
              },
              {
                step: "2",
                title: "Generate",
                desc: "Get your shareable link instantly",
                icon: AiOutlineLink,
              },
              {
                step: "3",
                title: "Share",
                desc: "Send the link to anyone, anywhere",
                icon: AiOutlineTeam,
              },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <item.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section
        id="pricing"
        className="py-24 bg-gradient-to-b from-slate-800 to-slate-900"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Simple Pricing
            </h2>
            <p className="text-xl text-slate-400">
              Choose the perfect plan for your sharing needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`relative bg-slate-900 border rounded-xl p-8 ${
                  plan.popular
                    ? "border-red-400 shadow-lg shadow-red-400/20"
                    : "border-slate-700 hover:border-slate-600"
                } transition-all duration-200`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-red-400 to-red-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold text-white">
                      {plan.price}
                    </span>
                    <span className="text-slate-400">/{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3">
                      <AiOutlineCheck className="h-5 w-5 text-red-400 flex-shrink-0" />
                      <span className="text-slate-300 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 ${
                    plan.popular
                      ? "bg-gradient-to-r from-red-400 to-red-500 text-white hover:from-red-300 hover:to-red-400 shadow-lg shadow-red-400/20"
                      : "bg-slate-800 border border-slate-600 text-white hover:bg-slate-700 hover:border-slate-500"
                  }`}
                >
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-700 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-red-400 to-red-500 text-white font-bold text-lg">
                  <AiOutlineCloudUpload className="h-5 w-5" />
                </div>
                <span className="font-bold text-xl text-white">DyshareX</span>
              </div>
              <p className="text-slate-400 text-sm mb-4">
                The easiest way to share files with anyone, anywhere. Upload
                once, share everywhere.
              </p>
              <div className="flex items-center gap-4">
                <a
                  href="#"
                  className="text-slate-400 hover:text-red-400 transition-colors"
                >
                  <AiOutlineGithub className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="text-slate-400 hover:text-red-400 transition-colors"
                >
                  <AiOutlineTwitter className="h-5 w-5" />
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-slate-400 hover:text-red-400 text-sm transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-slate-400 hover:text-red-400 text-sm transition-colors"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-slate-400 hover:text-red-400 text-sm transition-colors"
                  >
                    API
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-slate-400 hover:text-red-400 text-sm transition-colors"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-slate-400 hover:text-red-400 text-sm transition-colors"
                  >
                    Contact Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-slate-400 hover:text-red-400 text-sm transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-700 mt-8 pt-8 text-center">
            <p className="text-slate-400 text-sm">
              © 2024 DyshareX. Built with care for seamless file sharing.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
