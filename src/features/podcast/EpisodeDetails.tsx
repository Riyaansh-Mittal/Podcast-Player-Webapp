import { Calendar, Clock, Play, SkipForward } from "lucide-react";
import { podcastSeries } from "../../data/podcasts";
import type { Episode } from "@/utills/types";

type EpisodeDetailsProps = {
  episode: Episode;
  onPlayClick: () => void;
  onNextEpisodeClick: () => void;
};

export default function EpisodeDetails({ episode, onPlayClick, onNextEpisodeClick }: EpisodeDetailsProps) {
  return (
    <div className="bg-gray-900 rounded-xl p-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-shrink-0">
          <img 
            src={episode.thumbnailUrl} 
            alt={episode.title}
            className="w-36 h-36 rounded-lg object-cover" 
          />
        </div>
        
        <div className="flex-grow">
          <div className="text-sm text-purple-400 font-medium mb-1">{podcastSeries.title}</div>
          <h2 className="text-2xl font-bold mb-2">
            {episode.number}. {episode.title}
          </h2>
          
          <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{episode.date}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{episode.duration}</span>
            </div>
          </div>
          
          <p className="text-gray-300">{episode.description}</p>
          
          <div className="flex items-center gap-3 mt-4">
            <button 
              onClick={onPlayClick}
              className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-full flex items-center gap-2 font-medium transition-colors"
            >
              <Play className="w-4 h-4" /> Play
            </button>
            <button 
              onClick={onNextEpisodeClick}
              className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-full flex items-center gap-2 font-medium transition-colors"
            >
              <SkipForward className="w-4 h-4" /> Next Episode
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}