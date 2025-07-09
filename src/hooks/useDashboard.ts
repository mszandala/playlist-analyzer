import { useState, useEffect, useCallback } from 'react';
import { DashboardState, Playlist, AnalysisData } from '@/types/dashboard.types';
import { User } from '@/types/dashboard.types';

const initialState: DashboardState = {
  selectedPlaylists: [],
  selectedTab: 'overview',
  isDarkMode: true,
  viewMode: 'grid',
  searchQuery: '',
  isLoading: false,
  error: null,
};

export function useDashboard() {
  const [state, setState] = useState<DashboardState>(initialState);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/user', { 
          credentials: 'include'
        });
        
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          console.log('User not authenticated in dashboard');
          // NIE PRZEKIEROWUJ TUTAJ - zostaw to stronie głównej
        }
      } catch (err) {
        console.error('Błąd przy pobieraniu użytkownika:', err);
      } finally {
        setLoadingUser(false);
      }
    }

    fetchUser();
  }, []);

  // Save theme to localStorage
  useEffect(() => {
    localStorage.setItem('theme', state.isDarkMode ? 'dark' : 'light');
  }, [state.isDarkMode]);

  const updateState = useCallback((updates: Partial<DashboardState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const togglePlaylist = useCallback((playlistId: string) => {
    setState(prev => ({
      ...prev,
      selectedPlaylists: prev.selectedPlaylists.includes(playlistId)
        ? prev.selectedPlaylists.filter(id => id !== playlistId)
        : [...prev.selectedPlaylists, playlistId]
    }));
  }, []);

  const toggleTheme = useCallback(() => {
    setState(prev => ({ ...prev, isDarkMode: !prev.isDarkMode }));
  }, []);

  const setSelectedTab = useCallback((tab: string) => {
    setState(prev => ({ ...prev, selectedTab: tab }));
  }, []);

  const setViewMode = useCallback((mode: 'grid' | 'list') => {
    setState(prev => ({ ...prev, viewMode: mode }));
  }, []);

  const setSearchQuery = useCallback((query: string) => {
    setState(prev => ({ ...prev, searchQuery: query }));
  }, []);

  const clearSelection = useCallback(() => {
    setState(prev => ({ ...prev, selectedPlaylists: [] }));
  }, []);

  const selectAllPlaylists = useCallback(() => {
    setState(prev => ({ 
      ...prev, 
      selectedPlaylists: playlists.map(p => p.id) 
    }));
  }, [playlists]);

  // Filter playlists based on search
  const filteredPlaylists = playlists.filter(playlist =>
    playlist.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
    playlist.owner.toLowerCase().includes(state.searchQuery.toLowerCase())
  );

  // Get selected playlists data
  const selectedPlaylistsData = playlists.filter(playlist =>
    state.selectedPlaylists.includes(playlist.id)
  );

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  const cardClasses = isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';
  const themeClasses = isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-black';
  const hoverClasses = isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100';

  return {
    state,
    playlists: filteredPlaylists,
    selectedPlaylistsData,
    analysisData,
    setPlaylists,
    setAnalysisData,
    updateState,
    togglePlaylist,
    toggleTheme,
    setSelectedTab,
    setViewMode,
    setSearchQuery,
    clearSelection,
    selectAllPlaylists,
    user,
    loadingUser,
    isDarkMode,
    toggleDarkMode,
    cardClasses,
    themeClasses,
    hoverClasses,
  };
}