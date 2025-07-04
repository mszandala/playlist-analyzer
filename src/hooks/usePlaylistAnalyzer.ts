import { useState, useCallback } from 'react';
import { ApiResponse } from '@/types/spotify.types';

interface PlaylistAnalyzerState {
  playlistUrl: string;
  loading: boolean;
  error: string;
  isLoggedIn: boolean;
}

export const usePlaylistAnalyzer = () => {
  const [state, setState] = useState<PlaylistAnalyzerState>({
    playlistUrl: '',
    loading: false,
    error: '',
    isLoggedIn: false,
  });

  const updateState = useCallback((updates: Partial<PlaylistAnalyzerState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const resetError = useCallback(() => {
    setState(prev => ({ ...prev, error: '' }));
  }, []);

  const handleApiResponse = useCallback(<T,>(response: ApiResponse<T>) => {
    if (response.error) {
      setState(prev => ({ ...prev, error: response.error!, loading: false }));
      return null;
    }
    return response.data || null;
  }, []);

  return {
    state,
    updateState,
    resetError,
    handleApiResponse,
  };
};