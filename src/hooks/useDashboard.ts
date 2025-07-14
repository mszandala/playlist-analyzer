// src/hooks/useDashboard.ts
import { useState, useEffect, useCallback, useRef } from 'react';
import { DashboardState, Playlist, AnalysisData } from '@/types/dashboard.types';
import { User } from '@/types/dashboard.types';
import { dashboardApi } from '@/services/dashboardApi';

const getInitialDarkMode = (): boolean => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('theme');
    if (stored === 'dark') return true;
    if (stored === 'light') return false;
    
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
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
  const [allPlaylists, setAllPlaylists] = useState<Playlist[]>([]);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingPlaylists, setLoadingPlaylists] = useState(false);
  const [searchDebounceTimer, setSearchDebounceTimer] = useState<NodeJS.Timeout | null>(null);

useEffect(() => {
  const fetchUser = async () => {
    try {
      const res = await fetch('/api/user', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();

        if (data.accessToken) {
          dashboardApi.setAccessToken(data.accessToken); // ✅ to dodaj
        }

        // Ustaw user z accessToken
        setUser({
          ...data,
          accessToken: data.accessToken // Dodaj to
        });
      } else {
        console.log('User not authenticated in dashboard');
      }
    } catch (err) {
      console.error('Błąd przy pobieraniu użytkownika:', err);
    } finally {
      setLoadingUser(false);
    }
  };

  fetchUser();
}, []);


const fetchPlaylists = useCallback(async () => {
  console.log('📥 Fetching playlists...');
  if (loadingPlaylists) return;

  setLoadingPlaylists(true);
  setState(prev => ({ ...prev, isLoading: true, error: null }));

  try {
        // Sprawdź czy API ma token, a nie user
    if (!dashboardApi.hasAccessToken()) {
      throw new Error('No access token available');
    }

    // Pobierz playlisty
    const response = await dashboardApi.getUserPlaylists();

    const convertedPlaylists: Playlist[] = response.playlists.map(playlist => ({
      id: playlist.id,
      name: playlist.name,
      description: playlist.description || '',
      owner: playlist.owner.display_name || playlist.owner.id,
      imageUrl: playlist.images[0]?.url || '',
      tracksCount: playlist.tracks.total,
      isPublic: playlist.public,
      collaborative: playlist.collaborative,
      externalUrl: playlist.external_urls.spotify,
      createdAt: new Date(),
      lastModified: new Date()
    }));

    setAllPlaylists(convertedPlaylists);
    setPlaylists(convertedPlaylists);

  } catch (error) {
    console.error('Błąd przy pobieraniu playlist:', error);
    setState(prev => ({
      ...prev,
      error: 'Nie udało się załadować playlist. Spróbuj ponownie.'
    }));
  } finally {
    setLoadingPlaylists(false);
    setState(prev => ({ ...prev, isLoading: false }));
  }
}, [loadingPlaylists]);


  useEffect(() => {
    if (!loadingUser && user) {
      fetchPlaylists();
    }
  }, [loadingUser, user]);

  // NAPRAWIONE wyszukiwanie z debouncing i API
  const performSearch = useCallback(async (query: string) => {
    if (loadingPlaylists) return;
    
    setLoadingPlaylists(true);
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      if (query.trim() === '') {
        setPlaylists(allPlaylistsRef.current);
      } else {
        // Wyszukaj przez API
        const response = await dashboardApi.searchPlaylists(query);
        
        const convertedPlaylists: Playlist[] = response.playlists.map(playlist => ({
          id: playlist.id,
          name: playlist.name,
          description: playlist.description || '',
          owner: playlist.owner.display_name || playlist.owner.id,
          imageUrl: playlist.images[0]?.url || '',
          tracksCount: playlist.tracks.total,
          isPublic: playlist.public,
          collaborative: playlist.collaborative,
          externalUrl: playlist.external_urls.spotify,
          createdAt: new Date(),
          lastModified: new Date()
        }));
        
        setPlaylists(convertedPlaylists);
      }
      
    } catch (error) {
      console.error('Błąd przy wyszukiwaniu:', error);
      setState(prev => ({ 
        ...prev, 
        error: 'Nie udało się wyszukać playlist. Spróbuj ponownie.' 
      }));
    } finally {
      setLoadingPlaylists(false);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [loadingPlaylists]);

  const allPlaylistsRef = useRef<Playlist[]>([]);
  
  useEffect(() => {
    allPlaylistsRef.current = allPlaylists;
  }, [allPlaylists]);

  // Debounced search effect
  useEffect(() => {
    if (searchDebounceTimer) {
      clearTimeout(searchDebounceTimer);
    }

    const timer = setTimeout(() => {
      performSearch(state.searchQuery);
    }, 500); // 500ms delay

    setSearchDebounceTimer(timer);

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [state.searchQuery]);

  // Inicjalizacja motywu przy starcie
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    
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

  const refreshPlaylists = useCallback(() => {
    fetchPlaylists();
  }, [fetchPlaylists]);

  const selectedPlaylistsData = playlists.filter(playlist =>
    state.selectedPlaylists.includes(playlist.id)
  );

  const cardClasses = state.isDarkMode 
    ? 'bg-gray-800 border-gray-700 text-white'
    : 'bg-white border-gray-200 text-gray-900';

  const themeClasses = state.isDarkMode 
    ? 'bg-gray-900 text-white'
    : 'bg-gray-50 text-gray-900';

  const hoverClasses = state.isDarkMode 
    ? 'hover:bg-gray-700'
    : 'hover:bg-gray-100';

  return {
    state,
    playlists,
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
    refreshPlaylists,
    user,
    loadingUser,
    loadingPlaylists,
    cardClasses,
    themeClasses,
    hoverClasses,
    isDarkMode: state.isDarkMode,
  };
}