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
import Hero from "./Components/Hero";
import { Dropzone } from "./Components/Dropzone";

function App() {
  const [demoFiles, setDemoFiles] = React.useState([]);

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
        "500 MB Storage",
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
      <section id="demo" className="py-16 md:py-24 bg-gradient-to-b from-slate-800 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 md:mb-4">
              Try It Right Now
            </h2>
            <p className="text-lg md:text-xl text-slate-400">
              See how easy it is to share files with DyshareX
            </p>
          </div>
          <Dropzone />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 md:py-24 bg-gradient-to-b from-slate-900 to-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 md:mb-4">
              Why Choose DyshareX?
            </h2>
            <p className="text-lg md:text-xl text-slate-400">
              Everything you need for hassle-free file sharing
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-slate-900 border border-slate-700 rounded-xl p-5 md:p-6 hover:border-slate-600 hover:bg-slate-800/50 transition-all duration-200 group"
              >
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-red-400 to-red-500 rounded-lg flex items-center justify-center mb-3 md:mb-4 group-hover:scale-110 transition-transform duration-200">
                  <feature.icon className="h-5 w-5 md:h-6 md:w-6 text-white" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-400 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 md:mb-4">
              How It Works
            </h2>
            <p className="text-lg md:text-xl text-slate-400">
              Three simple steps to share any file
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
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
              <div key={index} className="text-center p-4 md:p-0">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-red-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                  <item.icon className="h-6 w-6 md:h-8 md:w-8 text-white" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-slate-400 text-sm md:text-base">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      {/* <section id="pricing" className="py-16 md:py-24 bg-gradient-to-b from-slate-800 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 md:mb-4">
              Simple Pricing
            </h2>
            <p className="text-lg md:text-xl text-slate-400">
              Choose the perfect plan for your sharing needs
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`relative bg-slate-900 border rounded-xl p-6 md:p-8 ${
                  plan.popular
                    ? "border-red-400 shadow-lg shadow-red-400/20"
                    : "border-slate-700 hover:border-slate-600"
                } transition-all duration-200`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 md:-top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-red-400 to-red-500 text-white px-3 md:px-4 py-1 rounded-full text-xs md:text-sm font-bold">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="text-center mb-6 md:mb-8">
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-3xl md:text-4xl font-bold text-white">
                      {plan.price}
                    </span>
                    <span className="text-slate-400">/{plan.period}</span>
                  </div>
                </div>
                <ul className="space-y-3 md:space-y-4 mb-6 md:mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-2 md:gap-3">
                      <AiOutlineCheck className="h-4 w-4 md:h-5 md:w-5 text-red-400 flex-shrink-0" />
                      <span className="text-slate-300 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full py-2 md:py-3 rounded-lg font-semibold text-sm md:text-base transition-all duration-200 ${
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
      </section> */}

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-700 py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8">
            <div className="col-span-1 md:col-span-2 mb-6 md:mb-0">
              <div className="flex items-center gap-3 mb-3 md:mb-4">
                <div className="flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-lg bg-gradient-to-br from-red-400 to-red-500 text-white font-bold text-sm md:text-lg">
                  <AiOutlineCloudUpload className="h-4 w-4 md:h-5 md:w-5" />
                </div>
                <span className="font-bold text-lg md:text-xl text-white">DyshareX</span>
              </div>
              <p className="text-slate-400 text-sm mb-3 md:mb-4">
                The easiest way to share files with anyone, anywhere. Upload once, share everywhere.
              </p>
              <div className="flex items-center gap-3 md:gap-4">
                <a href="#" className="text-slate-400 hover:text-red-400 transition-colors">
                  <AiOutlineGithub className="h-5 w-5" />
                </a>
                <a href="#" className="text-slate-400 hover:text-red-400 transition-colors">
                  <AiOutlineTwitter className="h-5 w-5" />
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-3 md:mb-4">Product</h3>
              <ul className="space-y-1.5 md:space-y-2">
                <li>
                  <a href="#" className="text-slate-400 hover:text-red-400 text-sm transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="text-slate-400 hover:text-red-400 text-sm transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="text-slate-400 hover:text-red-400 text-sm transition-colors">
                    API
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-3 md:mb-4">Support</h3>
              <ul className="space-y-1.5 md:space-y-2">
                <li>
                  <a href="#" className="text-slate-400 hover:text-red-400 text-sm transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="text-slate-400 hover:text-red-400 text-sm transition-colors">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-slate-400 hover:text-red-400 text-sm transition-colors">
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-700 mt-6 md:mt-8 pt-6 md:pt-8 text-center">
            <p className="text-slate-400 text-xs md:text-sm">
              © 2024 DyshareX. Built with care for seamless file sharing.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
