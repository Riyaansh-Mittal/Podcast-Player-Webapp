import { useEffect, useRef, useState } from "react";
import { Play, Pause } from "lucide-react";

type Props = {
  audioUrl: string;
  thumbnailUrl: string;
};

export default function PodcastPlayer({ audioUrl, thumbnailUrl }: Props) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

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
