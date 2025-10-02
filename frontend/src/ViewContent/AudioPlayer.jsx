import { useState, useRef, useEffect } from "react";
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute } from "react-icons/fa";

export function AudioPlayer({ src, title, dwn_url }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
    };
  }, []);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    audioRef.current.volume = newVolume;
  };

  const toggleMute = () => {
    if (audioRef.current.volume === 0) {
      audioRef.current.volume = volume;
      setVolume(volume);
    } else {
      audioRef.current.volume = 0;
      setVolume(0);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handleProgressChange = (e) => {
    const progress = parseFloat(e.target.value);
    audioRef.current.currentTime = (progress / 100) * duration;
    setCurrentTime((progress / 100) * duration);
  };

  // ✅ Download handler
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = dwn_url;
    link.setAttribute("download", title || "audio.mp3");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="bg-gray-900 rounded-2xl shadow-lg overflow-hidden border border-gray-700 w-full max-w-2xl mx-auto">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-700 flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">{title}</h1>
        {/* Download button */}
        {/* <button
          onClick={handleDownload}
          className="flex items-center cursor-pointer gap-3 px-8 py-4 bg-red-400 text-white rounded-xl border-2 border-red-400 hover:bg-transparent hover:text-red-400 transition-all font-bold shadow-lg hover:shadow-red-400/40"
        >
          Download
        </button> */}
      </div>

      {/* Player Controls */}
      <div className="p-6 bg-gray-800">
        <audio ref={audioRef} src={src} />

        <div className="flex flex-col items-center gap-6">
          {/* Main controls row */}
          <div className="flex items-center gap-6 w-full max-w-lg">
            {/* Play/Pause */}
            <button
              onClick={togglePlay}
              className="p-4 bg-red-400 rounded-full text-white hover:bg-red-500 transition shadow-md hover:shadow-red-400/40"
            >
              {isPlaying ? <FaPause size={20} /> : <FaPlay size={20} />}
            </button>

            {/* Progress Bar */}
            <div className="flex-1 flex items-center gap-2">
              <span className="text-sm text-gray-400 w-12 text-right">
                {formatTime(currentTime)}
              </span>
              <input
                type="range"
                min="0"
                max={duration || 100}
                value={(currentTime / (duration || 1)) * 100 || 0}
                onChange={handleProgressChange}
                className="flex-1 h-2 bg-gray-600 rounded-full appearance-none cursor-pointer accent-red-400"
              />
              <span className="text-sm text-gray-400 w-12">
                {formatTime(duration)}
              </span>
            </div>
          </div>

          {/* Volume */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleMute}
              className="p-2 text-white hover:text-red-400 transition"
            >
              {volume === 0 ? (
                <FaVolumeMute size={18} />
              ) : (
                <FaVolumeUp size={18} />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="w-28 h-2 bg-gray-600 rounded-full appearance-none cursor-pointer accent-red-400"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
