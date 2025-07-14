import React from 'react';
import { Check, Music, Users, Lock, Globe } from 'lucide-react';
import { Playlist } from '@/types/dashboard.types';

interface PlaylistCardProps {
  playlist: Playlist;
  isSelected: boolean;
  viewMode: 'grid' | 'list';
  isDarkMode: boolean;
  onToggle: (playlistId: string) => void;
}

export function PlaylistCard({
  playlist,
  isSelected,
  viewMode,
  isDarkMode,
 onToggle
  }: PlaylistCardProps) {
    const cardClasses = isDarkMode 
      ? 'bg-gray-800 border-gray-700 text-white hover:bg-gray-700' 
      : 'bg-white border-gray-200 text-gray-900 hover:bg-gray-50';

    const selectedClasses = isSelected 
      ? 'border-green-500 bg-green-500/10' 
      : '';

    if (viewMode === 'list') {
      return (
        <div
          onClick={() => onToggle(playlist.id)}
          className={`
            ${cardClasses} ${selectedClasses}
            flex items-center p-4 border rounded-lg cursor-pointer
            transition-all duration-200 hover:shadow-md
          `}
        >
          <div className="flex items-center flex-1">
            <div className="relative mr-4">
              {playlist.imageUrl ? (
                <img
                  src={playlist.imageUrl}
                  alt={playlist.name}
                  className="w-8 h-8 rounded-lg object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = 'none';
                    const fallback = document.createElement('div');
                    fallback.className = "w-8 h-8 rounded-lg bg-gray-300 flex items-center justify-center";
                    fallback.innerHTML = `<svg class="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 19V6h13M9 6l-7 7 7 7" /></svg>`;
                    e.currentTarget.parentNode?.appendChild(fallback);
                  }}
                />
              ) : (
                <div className="w-8 h-8 rounded-lg bg-gray-300 flex items-center justify-center">
                  <Music className="w-6 h-6 text-gray-500" />
                </div>
              )}
              
              {isSelected && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg mb-1 truncate">{playlist.name}</h3>
              <p className="text-sm opacity-70 mb-2 truncate">{playlist.description || 'Brak opisu'}</p>
              <div className="flex items-center space-x-4 text-sm opacity-60">
                <span className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  {playlist.owner}
                </span>
                <span className="flex items-center">
                  <Music className="w-4 h-4 mr-1" />
                  {playlist.tracksCount} utworów
                </span>
                <span className="flex items-center">
                  {playlist.isPublic ? (
                    <Globe className="w-4 h-4 mr-1" />
                  ) : (
                    <Lock className="w-4 h-4 mr-1" />
                  )}
                  {playlist.isPublic ? 'Publiczna' : 'Prywatna'}
                </span>
              </div>
            </div>
          </div>
        </div>
      );
    }

return (
    <div
      onClick={() => onToggle(playlist.id)}
      className={`
        ${cardClasses} ${selectedClasses}
        p-4 border rounded-lg cursor-pointer
        transition-all duration-200 hover:shadow-md
        aspect-square flex flex-col
      `}
    >
      <div className="relative mb-3">
        {playlist.imageUrl ? (
          <img
            src={playlist.imageUrl}
            alt={playlist.name}
            className="w-full h-full rounded-lg object-cover"
          />
        ) : (
          <div className="w-full h-full rounded-lg bg-gray-300 flex items-center justify-center">
            <Music className="w-1/3 h-1/3 text-gray-500" />
          </div>
        )}
        
        {isSelected && (
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
            <Check className="w-4 h-4 text-white" />
          </div>
        )}
      </div>
      
      <div className="flex-1 flex flex-col">
        <h3 className="font-semibold text-lg mb-1 truncate">{playlist.name}</h3>
        <p className="text-sm opacity-70 mb-2 line-clamp-2 flex-1">{playlist.description || 'Brak opisu'}</p>
        
        <div className="mt-auto space-y-1 text-xs opacity-60">
          <div className="flex items-center justify-between">
            <span className="flex items-center">
              <Users className="w-3 h-3 mr-1" />
              {playlist.owner}
            </span>
            <span className="flex items-center">
              {playlist.isPublic ? (
                <Globe className="w-3 h-3" />
              ) : (
                <Lock className="w-3 h-3" />
              )}
            </span>
          </div>
          <div className="flex items-center">
            <Music className="w-3 h-3 mr-1" />
            {playlist.tracksCount} utworów
          </div>
        </div>
      </div>
    </div>
  );
}