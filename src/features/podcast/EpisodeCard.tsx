import type { Episode } from "@/utills/types";
import { Calendar, Clock, ChevronRight, Play } from "lucide-react";

type EpisodeCardProps = {
  episode: Episode;
  isActive: boolean;
  onSelect: (episode: Episode) => void;
};

export default function EpisodeCard({ episode, isActive, onSelect }: EpisodeCardProps) {
  return (
    <div 
      onClick={() => onSelect(episode)}
      className={`bg-gray-900 rounded-xl p-4 hover:bg-gray-800 transition-colors cursor-pointer flex items-center ${
        isActive ? "border border-purple-600" : ""
      }`}
    >
      <div className="relative flex-shrink-0 group">
        <div className="w-20 h-20 md:w-24 md:h-24 rounded-md overflow-hidden">
          <img 
            src={episode.thumbnailUrl} 
            alt={episode.title}
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
            <Play className="w-8 h-8" />
          </div>
        </div>
        <div className="absolute -top-2 -right-2 bg-purple-600 text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
          {episode.number}
        </div>
      </div>
      
      <div className="ml-4 flex-grow">
        <h3 className="font-medium">
          {episode.title}
        </h3>
        <p className="text-sm text-gray-400 line-clamp-1 mt-1">{episode.description}</p>
        
        <div className="flex items-center gap-3 text-xs text-gray-500 mt-2">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{episode.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{episode.date}</span>
          </div>
        </div>
      </div>
      
      <ChevronRight className="w-5 h-5 text-gray-500 ml-2" />
    </div>
  );
}