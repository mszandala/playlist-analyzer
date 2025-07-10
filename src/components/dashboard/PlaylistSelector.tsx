import React from 'react';
import { Search, Grid3x3, List, X, CheckSquare, Square } from 'lucide-react';
import { Playlist } from '@/types/dashboard.types';
import { PlaylistCard } from './PlaylistCard';

interface PlaylistSelectorProps {
  playlists: Playlist[];
  selectedPlaylists: string[];
  viewMode: 'grid' | 'list';
  searchQuery: string;
  isDarkMode: boolean;
  cardClasses: string;
  hoverClasses: string; 
  onTogglePlaylist: (playlistId: string) => void;
  onSetViewMode: (mode: 'grid' | 'list') => void;
  onSetSearchQuery: (query: string) => void;
  onClearSelection: () => void;
  onSelectAll: () => void;
}

export function PlaylistSelector({
  playlists,
  selectedPlaylists,
  viewMode,
  searchQuery,
  isDarkMode,
  cardClasses, 
  hoverClasses,
  onTogglePlaylist,
  onSetViewMode,
  onSetSearchQuery,
  onClearSelection,
  onSelectAll
}: PlaylistSelectorProps) {
  // NAPRAWIONA LOGIKA: isDarkMode true = ciemny motyw
  const inputClasses = isDarkMode 
    ? 'bg-gray-700 border-gray-600 text-white' 
    : 'bg-white border-gray-300 text-gray-900';
  
  const isAllSelected = playlists.length > 0 && selectedPlaylists.length === playlists.length;
  const isSomeSelected = selectedPlaylists.length > 0 && selectedPlaylists.length < playlists.length;

  return (
    <div className={`${cardClasses} border-b px-6 py-6`}>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div>
            <h2 className="text-lg font-semibold mb-1">Wybierz playlisty do analizy</h2>
            <p className="text-sm opacity-70">
              Zaznacz jedną lub więcej playlist ({selectedPlaylists.length} z {playlists.length} wybrane)
            </p>
          </div>
          
          {/* Selection controls */}
          <div className="flex items-center space-x-2 ml-4">
            <button
              onClick={isAllSelected ? onClearSelection : onSelectAll}
              className="flex items-center space-x-2 px-3 py-1 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors text-sm"
            >
              {isAllSelected ? (
                <>
                  <CheckSquare className="w-4 h-4" />
                  <span>Odznacz wszystkie</span>
                </>
              ) : (
                <>
                  <Square className="w-4 h-4" />
                  <span>Zaznacz wszystkie</span>
                </>
              )}
            </button>
            
            {selectedPlaylists.length > 0 && (
              <button
                onClick={onClearSelection}
                className="flex items-center space-x-1 px-2 py-1 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors text-sm"
              >
                <X className="w-4 h-4" />
                <span>Wyczyść</span>
              </button>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2 mt-4 lg:mt-0">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 opacity-50" />
            <input
              type="text"
              placeholder="Szukaj playlist..."
              value={searchQuery}
              onChange={(e) => onSetSearchQuery(e.target.value)}
              className={`pl-10 pr-4 py-2 rounded-lg border ${inputClasses} focus:outline-none focus:ring-2 focus:ring-green-500`}
            />
            {searchQuery && (
              <button
                onClick={() => onSetSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 opacity-50 hover:opacity-100"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          
          {/* View mode toggle */}
          <div className={`flex border rounded-lg p-1 ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`}>
            <button
              onClick={() => onSetViewMode('grid')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-green-500 text-white' 
                  : 'opacity-50 hover:opacity-100'
              }`}
              aria-label="Widok siatki"
            >
              <Grid3x3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onSetViewMode('list')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'list' 
                  ? 'bg-green-500 text-white' 
                  : 'opacity-50 hover:opacity-100'
              }`}
              aria-label="Widok listy"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Playlists grid/list */}
      {playlists.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">🎵</div>
          <h3 className="text-lg font-semibold mb-2">Brak playlist</h3>
          <p className="text-sm opacity-70">
            {searchQuery ? 'Nie znaleziono playlist pasujących do wyszukiwania' : 'Nie znaleziono żadnych playlist'}
          </p>
        </div>
      ) : (
        <div className={`grid ${
          viewMode === 'grid' 
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
            : 'grid-cols-1'
        } gap-4`}>
          {playlists.map(playlist => (
            <PlaylistCard
              key={playlist.id}
              playlist={playlist}
              isSelected={selectedPlaylists.includes(playlist.id)}
              viewMode={viewMode}
              isDarkMode={isDarkMode}
              onToggle={onTogglePlaylist}
            />
          ))}
        </div>
      )}
      
      {/* Selected playlists summary */}
      {selectedPlaylists.length > 0 && (
        <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
          <h4 className="font-semibold text-green-500 mb-2">Wybrane playlisty:</h4>
          <div className="flex flex-wrap gap-2">
            {selectedPlaylists.slice(0, 5).map(id => {
              const playlist = playlists.find(p => p.id === id);
              return playlist ? (
                <span key={id} className="text-xs bg-green-500/20 text-green-500 px-2 py-1 rounded">
                  {playlist.name}
                </span>
              ) : null;
            })}
            {selectedPlaylists.length > 5 && (
              <span className="text-xs bg-green-500/20 text-green-500 px-2 py-1 rounded">
                +{selectedPlaylists.length - 5} więcej
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}