import React, { useState, useEffect, useMemo } from 'react';
import { Search, Grid3x3, List, X, CheckSquare, Square, ChevronDown } from 'lucide-react';
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
  const inputClasses = isDarkMode
    ? 'bg-gray-700 border-gray-600 text-white'
    : 'bg-white border-gray-300 text-gray-900';

  const isAllSelected = playlists.length > 0 && selectedPlaylists.length === playlists.length;
  const isSomeSelected = selectedPlaylists.length > 0 && selectedPlaylists.length < playlists.length;

  const [visibleRows, setVisibleRows] = useState(2);
  const [screenSize, setScreenSize] = useState<'sm' | 'lg' | 'xl'>('lg');

  // Detect screen size
  useEffect(() => {
    const updateScreenSize = () => {
      if (window.innerWidth >= 1280) setScreenSize('xl');
      else if (window.innerWidth >= 1024) setScreenSize('lg');
      else setScreenSize('sm');
    };

    updateScreenSize();
    window.addEventListener('resize', updateScreenSize);
    return () => window.removeEventListener('resize', updateScreenSize);
  }, []);

  const playlistsPerRow = useMemo(() => {
    if (viewMode === 'list') return 1;

    switch (screenSize) {
      case 'xl': return 7;
      case 'lg': return 3;
      case 'sm': return 2;
      default: return 3;
    }
  }, [viewMode, screenSize]);

  const maxVisible = visibleRows * playlistsPerRow;
  const visiblePlaylists = playlists.slice(0, maxVisible);
  const hasMore = playlists.length > maxVisible;

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
              className={`p-2 rounded transition-colors ${viewMode === 'grid'
                  ? 'bg-green-500 text-white'
                  : 'opacity-50 hover:opacity-100'
                }`}
              aria-label="Widok siatki"
            >
              <Grid3x3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onSetViewMode('list')}
              className={`p-2 rounded transition-colors ${viewMode === 'list'
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
        <div className={`grid ${viewMode === 'grid'
            ? 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7'
            : 'grid-cols-1'
          } gap-4`}>
          {visiblePlaylists.map(playlist => (
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

      {/* Load More Bar */}
      {hasMore && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => setVisibleRows(prev => prev + 2)}
            className={`
              flex items-center gap-2 px-6 py-2 rounded-full font-medium transition-colors duration-200
              ${isDarkMode
                ? 'bg-white/10 text-white hover:bg-white/20'
                : 'bg-black text-white hover:bg-neutral-800'
              }
            `}
          >
            <ChevronDown className="w-5 h-5" />
            Pokaż więcej playlist ({playlists.length - maxVisible} pozostałych)
          </button>
        </div>
      )}


      {/* Stats */}
      <div className={`mt-4 text-center text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        {visiblePlaylists.length} z {playlists.length} playlist
      </div>
    </div>
  );
}