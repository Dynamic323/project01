import { useState, useRef, useEffect } from "react";
import {
  FaPlay,
  FaPause,
  FaVolumeUp,
  FaVolumeMute,
  FaExpand,
} from "react-icons/fa";
import { formatSize } from "../utils/file-helper";
import { Download } from "lucide-react";

export function VideoPlayer({ src, title, dwn_url, size }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;


    const updateTime = () => setCurrentTime(video.currentTime);
    const updateDuration = () => setDuration(video.duration);

    video.addEventListener("timeupdate", updateTime);
    video.addEventListener("loadedmetadata", updateDuration);

    return () => {
      video.removeEventListener("timeupdate", updateTime);
      video.removeEventListener("loadedmetadata", updateDuration);
    };
  }, []);

  const togglePlay = () => {
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    videoRef.current.volume = newVolume;
  };

  const toggleMute = () => {
    if (videoRef.current.volume === 0) {
      videoRef.current.volume = volume;
      setVolume(volume);
    } else {
      videoRef.current.volume = 0;
      setVolume(0);
    }
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = dwn_url;
    link.setAttribute("download", title || "video.mp4"); // suggest filename
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      } else if (videoRef.current.webkitRequestFullscreen) {
        videoRef.current.webkitRequestFullscreen();
      } else if (videoRef.current.msRequestFullscreen) {
        videoRef.current.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handleProgressChange = (e) => {
    const progress = parseFloat(e.target.value);
    videoRef.current.currentTime = (progress / 100) * duration;
    setCurrentTime((progress / 100) * duration);
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-700">
        {/* <h1 className="text-2xl font-bold text-white flex justify-between"> */}
        {/* <span>{title}</span>
          <span className="text-1xl text-gray-500">
            {" "}
            size: <span className="text-red-400">{formatSize(size)}</span>
          </span>
        </h1> */}
      </div>

      <div className="p-6 bg-black relative">
        <div className="relative pb-[56.25%]">
          {" "}
          {/* 16:9 aspect ratio */}
          <video
            ref={videoRef}
            src={src}
            className="absolute top-0 left-0 w-full h-full object-contain"
            controls={false}
          />
        </div>

        <div className="flex flex-col gap-4 mt-4">
          <div className="flex items-center gap-4">
            <button
              onClick={togglePlay}
              className="p-3 bg-gray-700 rounded-full text-white hover:bg-gray-600 transition"
            >
              {isPlaying ? <FaPause /> : <FaPlay />}
            </button>

            <div className="flex-1 flex items-center gap-2">
              <span className="text-sm text-gray-400">
                {formatTime(currentTime)}
              </span>
              <input
                type="range"
                min="0"
                max={duration || 100}
                value={(currentTime / (duration || 1)) * 100 || 0}
                onChange={handleProgressChange}
                className="flex-1 h-2 bg-gray-600 rounded-full appearance-none cursor-pointer"
              />
              <span className="text-sm text-gray-400">
                {formatTime(duration)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={toggleMute}
                className="p-2 text-white hover:text-gray-300"
              >
                {volume === 0 ? <FaVolumeMute /> : <FaVolumeUp />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                className="w-20 h-2 bg-gray-600 rounded-full appearance-none cursor-pointer"
              />
              <button
                onClick={toggleFullscreen}
                className="p-2 text-white hover:text-gray-300"
              >
                <FaExpand />
              </button>
            </div>
          </div>
          {/* Download Button */}
          {/* <button
            onClick={handleDownload}
            className="flex justify-center items-center cursor-pointer gap-3 px-8 py-4 bg-red-400 text-white rounded-xl border-2 border-red-400 hover:bg-transparent hover:text-red-400 transition-all font-bold shadow-lg hover:shadow-red-400/40"
          >
            <Download />
            Download
          </button> */}
        </div>
      </div>
    </div>
  );
}
