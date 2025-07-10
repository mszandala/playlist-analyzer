import { useState, useEffect, useCallback } from 'react';
import { DashboardState, Playlist, AnalysisData } from '@/types/dashboard.types';
import { User } from '@/types/dashboard.types';

const getInitialDarkMode = (): boolean => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('theme');
    if (stored === 'dark') return true;
    if (stored === 'light') return false;
    
    // Sprawdź preferencje systemowe
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Domyślnie ciemny motyw (można zmienić na systemPrefersDark jeśli chcesz)
    return true;
  }
  return true;
};

const initialState: DashboardState = {
  selectedPlaylists: [],
  selectedTab: 'overview',
  isDarkMode: getInitialDarkMode(),
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
        }
      } catch (err) {
        console.error('Błąd przy pobieraniu użytkownika:', err);
      } finally {
        setLoadingUser(false);
      }
    }

    fetchUser();
  }, []);

  // Inicjalizacja motywu przy starcie
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    
    // Upewnij się, że początkowy stan jest poprawny
    if (state.isDarkMode) {
      root.classList.add('dark');
      root.classList.remove('light');
      body.classList.add('dark');
      body.classList.remove('light');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
      body.classList.add('light');
      body.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [state.isDarkMode]);

  // Obsługa zmiany preferencji systemowych
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      // Tylko jeśli użytkownik nie ustawił własnej preferencji
      if (!localStorage.getItem('theme')) {
        setState(prev => ({ ...prev, isDarkMode: e.matches }));
      }
    };

    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
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
    setState(prev => {
      const newDarkMode = !prev.isDarkMode;
      console.log('Przełączanie motywu:', prev.isDarkMode, '->', newDarkMode);
      return { ...prev, isDarkMode: newDarkMode };
    });
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

  const cardClasses = state.isDarkMode 
    ? 'bg-gray-800 border-gray-700 text-white'      // teraz: "ciemny", dawniej jasny
    : 'bg-white border-gray-200 text-gray-900';     // teraz: "jasny", dawniej ciemny

  const themeClasses = state.isDarkMode 
    ? 'bg-gray-900 text-white'                      // teraz: ciemne tło
    : 'bg-gray-50 text-gray-900';                   // teraz: jasne tło

  const hoverClasses = state.isDarkMode 
    ? 'hover:bg-gray-700'                           // ciemny hover
    : 'hover:bg-gray-100';                          // jasny hover


  return {
    state,
    playlists: filteredPlaylists,
    selectedPlaylistsData,
    analysisData,
    setPlaylists,
    setAnalysisData,
    togglePlaylist,
    toggleTheme,
    setSelectedTab,
    setViewMode,
    setSearchQuery,
    clearSelection,
    selectAllPlaylists,
    user,
    loadingUser,
    cardClasses,
    themeClasses,
    hoverClasses,
    isDarkMode: state.isDarkMode,
  };
}