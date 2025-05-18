import React, { useEffect, useRef, useState } from "react";
import { Play, Pause } from "lucide-react";

type Props = {
  audioUrl: string;
  thumbnailUrl: string;
};

export default function PodcastPlayer({ audioUrl, thumbnailUrl }: Props) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [hoverX, setHoverX] = useState<number | null>(null);

  const formatTime = (s: number) =>
    `${Math.floor(s / 60)}:${("0" + Math.floor(s % 60)).slice(-2)}`;

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play();
    } else {
      audio.pause();
    }
    setIsPlaying(!audio.paused);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    const progressBar = progressRef.current;
    if (!audio || !progressBar || duration === 0) return;

    const rect = progressBar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    audio.currentTime = percent * duration;
    setCurrentTime(audio.currentTime);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const progressBar = progressRef.current;
    if (!progressBar || duration === 0) return;

    const rect = progressBar.getBoundingClientRect();
    const percent = Math.min(Math.max(0, e.clientX - rect.left), rect.width) / rect.width;
    setHoverTime(percent * duration);
    setHoverX(e.clientX - rect.left);
  };

  const handleMouseLeave = () => {
    setHoverTime(null);
    setHoverX(null);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
    };
  }, []);

  return (
    <div className="max-w-2xl mx-auto rounded-lg shadow-md bg-black text-white overflow-hidden">
      <audio ref={audioRef} src={audioUrl} preload="metadata" />

      <img
        src={thumbnailUrl}
        alt="Podcast thumbnail"
        className="w-full object-cover max-h-96"
      />

      {/* Seek Bar */}
      <div
        ref={progressRef}
        className="relative h-4 bg-gray-700 cursor-pointer"
        onClick={handleSeek}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Progress */}
        <div
          className="h-full bg-blue-500"
          style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
        />
        
        {/* Hover Preview */}
        {hoverTime !== null && hoverX !== null && (
          <div
            className="absolute -top-8 transform -translate-x-1/2 text-xs bg-gray-800 px-2 py-1 rounded shadow-md"
            style={{ left: hoverX }}
          >
            {formatTime(hoverTime)}
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="p-4 flex items-center justify-between bg-black/80">
        <button
          onClick={togglePlay}
          className="bg-gray-800 hover:bg-gray-700 p-2 rounded-full"
        >
          {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
        </button>
        <div className="text-sm">
          {formatTime(currentTime)} / {formatTime(duration || 0)}
        </div>
      </div>
    </div>
  );
}
