import { useState } from "react";
import { allEpisodes, podcastSeries } from "../data/podcasts";
import type { Episode } from "@/utills/types";
import EpisodeDetails from "@/features/podcast/EpisodeDetails";
import EpisodeList from "@/features/podcast/EpisodeList";
import AboutSection from "@/features/podcast/AboutSection";
import PodcastPlayer from "@/features/podcast-player/PodcastPlayer";

export default function PodcastPage() {
  const [currentEpisode, setCurrentEpisode] = useState<Episode>(allEpisodes[0]);
  const [view, setView] = useState<"episodes" | "about">("episodes");
  const [isPlaying, setIsPlaying] = useState(false);

  const handleEpisodeSelect = (episode: Episode) => {
    if (currentEpisode.id !== episode.id) {
      setCurrentEpisode(episode);
      setIsPlaying(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePlayClick = () => {
    setIsPlaying((prev) => !prev);
  };

  const handleNextEpisodeClick = () => {
    const currentIndex = allEpisodes.findIndex(
      (ep) => ep.id === currentEpisode.id
    );
    const nextIndex = (currentIndex + 1) % allEpisodes.length;
    handleEpisodeSelect(allEpisodes[nextIndex]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-8/12 space-y-6">
          <EpisodeDetails
            episode={currentEpisode}
            onPlayClick={handlePlayClick}
            onNextEpisodeClick={handleNextEpisodeClick}
            isPlaying={isPlaying}
          />

          <div className="border-b border-gray-800">
            <div className="flex gap-6">
              <button
                onClick={() => setView("episodes")}
                className={`py-3 font-medium text-sm relative ${
                  view === "episodes"
                    ? "text-white"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                Episodes ({allEpisodes.length})
                {view === "episodes" && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-purple-600 rounded-t-full"></div>
                )}
              </button>
              <button
                onClick={() => setView("about")}
                className={`py-3 font-medium text-sm relative ${
                  view === "about"
                    ? "text-white"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                About
                {view === "about" && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-purple-600 rounded-t-full"></div>
                )}
              </button>
            </div>
          </div>

          {view === "episodes" && (
            <EpisodeList
              episodes={allEpisodes}
              currentEpisode={currentEpisode}
              onEpisodeSelect={handleEpisodeSelect}
            />
          )}

          {view === "about" && <AboutSection podcastSeries={podcastSeries} />}
        </div>

        <div className="w-full lg:w-4/12 space-y-6">
          <div className="lg:sticky lg:top-24">
            <PodcastPlayer
              audioUrl={currentEpisode.audioUrl}
              thumbnailUrl={currentEpisode.thumbnailUrl}
              chapters={currentEpisode.chapters}
              isPlaying={isPlaying}
              setIsPlaying={setIsPlaying}
            />

            <div className="bg-gray-900 rounded-xl p-4 mt-6">
              <h3 className="font-medium text-sm mb-3">Up Next</h3>
              <div className="space-y-3">
                {allEpisodes
                  .filter((ep) => ep.id !== currentEpisode.id)
                  .slice(0, 3)
                  .map((episode) => (
                    <div
                      key={episode.id}
                      onClick={() => handleEpisodeSelect(episode)}
                      className="flex items-center gap-3 cursor-pointer hover:bg-gray-800 p-2 rounded-lg transition-colors"
                    >
                      <div className="relative w-12 h-12 flex-shrink-0">
                        <img
                          src={episode.thumbnailUrl}
                          alt={episode.title}
                          className="w-full h-full object-cover rounded"
                        />
                        <div className="absolute -top-1 -right-1 bg-purple-600 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                          {episode.number}
                        </div>
                      </div>
                      <div className="flex-grow min-w-0">
                        <div className="font-medium text-sm truncate">
                          {episode.title}
                        </div>
                        <div className="text-xs text-gray-400">
                          {episode.duration}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
