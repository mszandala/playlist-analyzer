import React from 'react';
import { Heart, Play, Clock } from 'lucide-react';
import { Playlist } from '@/types/dashboard.types';

interface PlaylistCardProps {
  playlist: Playlist;
  isSelected: boolean;
  viewMode: 'grid' | 'list';
  isDarkMode: boolean;
  onToggle: (playlistId: string) => void;
  onPlay?: (playlistId: string) => void;
  onFavorite?: (playlistId: string) => void;
}

export function PlaylistCard({
  playlist,
  isSelected,
  viewMode,
  isDarkMode,
  onToggle,
  onPlay,
  onFavorite
}: PlaylistCardProps) {
  const cardClasses = isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';
  const hoverClasses = isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100';

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <div
      onClick={() => onToggle(playlist.id)}
      className={`
        ${cardClasses} border-2 rounded-lg p-4 cursor-pointer transition-all duration-200
        ${isSelected 
          ? 'border-green-500 bg-green-500/10 ring-2 ring-green-500/20' 
          : 'border-transparent hover:border-gray-400'
        }
        ${hoverClasses}
      `}
    >
      <div className={`flex ${viewMode === 'grid' ? 'flex-col' : 'flex-row'} items-center space-x-0 ${viewMode === 'list' ? 'space-x-4' : 'space-y-3'}`}>
        <div className="relative">
          <img
            src={playlist.image}
            alt={playlist.name}
            className={`${viewMode === 'grid' ? 'w-20 h-20' : 'w-16 h-16'} rounded-lg object-cover`}
          />
          {isSelected && (
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">✓</span>
            </div>
          )}
          
          {/* Overlay na hover */}
          <div className={`
            absolute inset-0 bg-black/50 rounded-lg opacity-0 hover:opacity-100 transition-opacity
            flex items-center justify-center
          `}>
            <Play className="w-6 h-6 text-white" />
          </div>
        </div>
        
        <div className={`${viewMode === 'grid' ? 'text-center' : 'text-left flex-1'}`}>
          <h3 className="font-semibold text-sm mb-1 truncate" title={playlist.name}>
            {playlist.name}
          </h3>
          <p className="text-xs opacity-70 mb-1">
            {playlist.tracks} utworów • {playlist.owner}
          </p>
          {playlist.description && (
            <p className="text-xs opacity-50 truncate" title={playlist.description}>
              {playlist.description}
            </p>
          )}
        </div>
        
        {viewMode === 'list' && (
          <div className="flex items-center space-x-2">
            <div className="text-xs opacity-70 flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>{formatDuration(playlist.tracks * 3)}</span>
            </div>
            
            <div className="flex items-center space-x-1">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onFavorite?.(playlist.id);
                }}
                className={`p-1 rounded ${hoverClasses} transition-colors`}
                aria-label="Dodaj do ulubionych"
              >
                <Heart className="w-4 h-4 opacity-50 hover:opacity-100" />
              </button>
              
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onPlay?.(playlist.id);
                }}
                className={`p-1 rounded ${hoverClasses} transition-colors`}
                aria-label="Odtwórz playlistę"
              >
                <Play className="w-4 h-4 opacity-50 hover:opacity-100" />
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Status badge */}
      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center space-x-2">
          {playlist.isPublic && (
            <span className="text-xs bg-green-500/20 text-green-500 px-2 py-1 rounded">
              Publiczna
            </span>
          )}
        </div>
        
        {isSelected && (
          <span className="text-xs text-green-500 font-semibold">
            Wybrana
          </span>
        )}
      </div>
    </div>
  );
}
