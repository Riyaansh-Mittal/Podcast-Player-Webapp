import React, { useEffect, useRef, useState } from "react";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { Play, Pause, Volume2, VolumeX, FastForward } from "lucide-react";

type Chapter = {
  title: string;
  time: string;
};

type Props = {
  audioUrl: string;
  thumbnailUrl: string;
  chapters: Chapter[];
  isPlaying: boolean;
  setIsPlaying: (val: boolean) => void;
};

export default function PodcastPlayer({
  audioUrl,
  thumbnailUrl,
  chapters,
  isPlaying,
  setIsPlaying,
}: Props) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isHoveringControls, setIsHoveringControls] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [hoveredChapter, setHoveredChapter] =
    useState<ChapterWithSeconds | null>(null);
  const [bufferPercent, setBufferPercent] = useState(0);
  const [hoverTimePosition, setHoverTimePosition] = useState<{
    time: number;
    x: number;
  } | null>(null);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  type ChapterWithSeconds = Chapter & { seconds: number };

  const enrichedChapters: ChapterWithSeconds[] = chapters.map((ch) => ({
    ...ch,
    seconds: getSeconds(ch.time),
  }));

  function getSeconds(timeStr: string): number {
    const parts = timeStr.split(":").map(Number);
    return parts.reduce((acc, val) => acc * 60 + val, 0);
  }

  const formatTime = (s: number) =>
    `${Math.floor(s / 60)}:${("0" + Math.floor(s % 60)).slice(-2)}`;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const update = () => setCurrentTime(audio.currentTime);
    const onLoad = () => setDuration(audio.duration);

    const updateBuffer = () => {
      if (audio.buffered.length > 0) {
        setBufferPercent(
          (audio.buffered.end(audio.buffered.length - 1) / audio.duration) * 100
        );
      }
    };

    audio.addEventListener("timeupdate", update);
    audio.addEventListener("loadedmetadata", onLoad);
    audio.addEventListener("progress", updateBuffer);

    audio.volume = volume;
    audio.playbackRate = playbackSpeed;

    return () => {
      audio.removeEventListener("timeupdate", update);
      audio.removeEventListener("loadedmetadata", onLoad);
      audio.removeEventListener("progress", updateBuffer);
    };
  }, [volume, playbackSpeed]);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    if (!isHoveringControls && isPlaying) {
      timeout = setTimeout(() => {
        setControlsVisible(false);
      }, 2000);
    } else {
      setControlsVisible(true);
    }

    return () => clearTimeout(timeout);
  }, [isHoveringControls, isPlaying]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        togglePlay();
      } else if (e.code === "ArrowRight") {
        audioRef.current!.currentTime = Math.min(
          duration,
          audioRef.current!.currentTime + 5
        );
      } else if (e.code === "ArrowLeft") {
        audioRef.current!.currentTime = Math.max(
          0,
          audioRef.current!.currentTime - 5
        );
      } else if (e.code === "KeyM") {
        toggleMute();
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [duration]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying && audio.paused) {
      audio.play();
    } else if (!isPlaying && !audio.paused) {
      audio.pause();
    }
  }, [isPlaying]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      audio.play();
      setIsPlaying(true); 
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    const newMutedState = !isMuted;
    audio.muted = newMutedState;
    setIsMuted(newMutedState);
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    if (!audioRef.current) return;

    audioRef.current.volume = newVolume;
    setVolume(newVolume);

    if (newVolume === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  };

  const handleSeek = (time: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = time;
  };

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || !audioRef.current) return;

    const rect = progressBarRef.current.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const seekTime = percent * duration;
    handleSeek(seekTime);
  };

  const changePlaybackSpeed = () => {
    const speeds = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
    const currentIndex = speeds.indexOf(playbackSpeed);
    const nextIndex = (currentIndex + 1) % speeds.length;
    const newSpeed = speeds[nextIndex];
    
    if (audioRef.current) {
      audioRef.current.playbackRate = newSpeed;
    }
    setPlaybackSpeed(newSpeed);
  };

  const currentChapterIndex = enrichedChapters.findIndex(
    (ch, idx) =>
      currentTime >= ch.seconds &&
      (idx === enrichedChapters.length - 1 ||
        currentTime < enrichedChapters[idx + 1].seconds)
  );

  const currentChapter = enrichedChapters[currentChapterIndex];

  return (
    <div
      className="max-w-4xl mx-auto rounded-xl shadow-md bg-black text-white overflow-hidden"
      ref={containerRef}
      onMouseEnter={() => setIsHoveringControls(true)}
      onMouseLeave={() => setIsHoveringControls(false)}
    >
      <audio src={audioUrl} ref={audioRef} preload="metadata" />
      <div className="relative w-full">
        <img
          src={thumbnailUrl}
          alt="Podcast thumbnail"
          className="w-full object-cover max-h-[500px]"
        />

        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-t from-black/80 to-transparent transition-opacity duration-300",
            controlsVisible ? "opacity-100" : "opacity-0"
          )}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              onClick={togglePlay}
              className="bg-black/50 hover:bg-black/70 p-4 rounded-full transition-all transform hover:scale-110"
            >
              {isPlaying ? (
                <Pause className="w-10 h-10" />
              ) : (
                <Play className="w-10 h-10 ml-1" />
              )}
            </button>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div
              className="relative w-full h-6 group cursor-pointer"
              ref={progressBarRef}
              onClick={handleProgressBarClick}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const percent = (e.clientX - rect.left) / rect.width;
                const hoverTime = Math.min(
                  duration,
                  Math.max(0, percent * duration)
                );

                const chapter = enrichedChapters.find(
                  (ch, idx) =>
                    hoverTime >= ch.seconds &&
                    (idx === enrichedChapters.length - 1 ||
                      hoverTime < enrichedChapters[idx + 1].seconds)
                );

                if (chapter) {
                  setHoveredChapter(chapter);
                }

                setHoverTimePosition({
                  time: hoverTime,
                  x: e.clientX - rect.left,
                });
              }}
              onMouseLeave={() => {
                setHoveredChapter(null);
                setHoverTimePosition(null);
              }}
            >
              <div className="absolute top-2 h-2 w-full bg-gray-700 rounded-full" />

              <div
                className="absolute top-2 h-2 bg-gray-500 rounded-full"
                style={{ width: `${bufferPercent}%` }}
              />

              <div
                className="absolute top-2 h-2 bg-red-600 rounded-full"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              />

              <div 
                className="absolute top-0.5 h-5 w-5 bg-white rounded-full shadow-md transform -translate-x-1/2 hover:scale-110 transition-transform"
                style={{ left: `${(currentTime / duration) * 100}%` }}
              />

              {enrichedChapters.map((ch, i) => (
                <div
                  key={i}
                  className="absolute top-2 h-2 w-1 bg-white rounded-full z-10"
                  style={{
                    left: `${(ch.seconds / duration) * 100}%`,
                  }}
                />
              ))}

              {hoverTimePosition && (
                <div
                  className="absolute top-0 bottom-0 w-px bg-white"
                  style={{
                    left: `${(hoverTimePosition.time / duration) * 100}%`,
                  }}
                />
              )}

              {hoverTimePosition && (
                <div
                  className="absolute bottom-8 bg-black/80 p-2 rounded text-xs z-10 transform -translate-x-1/2"
                  style={{
                    left: `${(hoverTimePosition.time / duration) * 100}%`,
                  }}
                >
                  {formatTime(hoverTimePosition.time)}
                  {hoveredChapter && (
                    <div className="text-gray-300 font-medium mt-1">
                      {hoveredChapter.title}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={togglePlay}
                  className="text-white hover:text-gray-300"
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6" />
                  ) : (
                    <Play className="w-6 h-6" />
                  )}
                </button>

                <div className="text-sm font-mono">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </div>
              </div>

              <div className="flex-1 mx-4 text-center overflow-hidden">
                <p className="truncate text-sm">
                  {currentChapter?.title || ""}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={changePlaybackSpeed}
                  className="flex items-center gap-1 bg-gray-800 px-2 py-1 rounded hover:bg-gray-700 transition-colors"
                  title="Change playback speed"
                >
                  <FastForward className="w-4 h-4" />
                  <span className="text-xs font-medium">{playbackSpeed}x</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleMute}
                    className="text-white hover:text-gray-300"
                  >
                    {isMuted ? (
                      <VolumeX className="w-5 h-5" />
                    ) : (
                      <Volume2 className="w-5 h-5" />
                    )}
                  </button>
                  <div className="w-24 relative h-6 flex items-center">
                    {/* Volume background track */}
                    <div className="absolute h-1 w-full bg-gray-700 rounded-full" />
                    
                    {/* Volume level track */}
                    <div
                      className="absolute h-1 rounded-full"
                      style={{
                        width: `${(isMuted ? 0 : volume) * 100}%`,
                        maxWidth: "100%",
                        background: "linear-gradient(to right, #9ca3af, #f9fafb)"
                      }}
                    />
                    
                    {/* Volume thumb */}
                    <div 
                      className="absolute h-3 w-3 bg-white rounded-full shadow-md transform -translate-x-1/2"
                      style={{ left: `${(isMuted ? 0 : volume) * 100}%` }}
                    />
                    
                    {/* Hidden slider for functionality */}
                    <Slider
                      value={[isMuted ? 0 : volume]}
                      min={0}
                      max={1}
                      step={0.01}
                      onValueChange={handleVolumeChange}
                      className="opacity-0 z-10 h-6"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-900 p-4">
        <h3 className="text-lg font-semibold mb-3">Chapters</h3>
        <div className="flex flex-wrap gap-2 p-4">
          {enrichedChapters.map((chapter, index) => (
            <button
              key={index}
              onClick={() => handleSeek(chapter.seconds)}
              className={cn(
                "px-3 py-1 text-sm rounded transition-all",
                currentChapterIndex === index
                  ? "bg-red-600 text-white"
                  : "bg-gray-700 text-gray-200 hover:bg-gray-600"
              )}
            >
              {chapter.title}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}