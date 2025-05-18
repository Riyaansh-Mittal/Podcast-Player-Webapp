import type { Episode } from "@/utills/types";
import EpisodeCard from "./EpisodeCard";

type EpisodeListProps = {
  episodes: Episode[];
  currentEpisode: Episode;
  onEpisodeSelect: (episode: Episode) => void;
};

export default function EpisodeList({ episodes, currentEpisode, onEpisodeSelect }: EpisodeListProps) {
  return (
    <div className="space-y-4">
      {episodes.map((episode) => (
        <EpisodeCard
          key={episode.id}
          episode={episode}
          isActive={currentEpisode.id === episode.id}
          onSelect={onEpisodeSelect}
        />
      ))}
    </div>
  );
}