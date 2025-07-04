import type { ApiResponse, PlaylistData } from '@/types/spotify.types';

const createApiResponse = async <T>(
  fetchPromise: Promise<Response>,
  errorMessage: string
): Promise<ApiResponse<T>> => {
  try {
    const response = await fetchPromise;
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Sesja wygasła. Zaloguj się ponownie.');
      }
      if (response.status === 404) {
        throw new Error('Playlista nie została znaleziona.');
      }
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    return { data };
  } catch (error) {
    return { error: error instanceof Error ? error.message : errorMessage };
  }
};

export const apiService = {
  checkAuth: (): Promise<ApiResponse<{ authenticated: boolean }>> => 
    createApiResponse(
      fetch('/api/auth/check', {
        credentials: 'include'
      }),
      'Błąd podczas sprawdzania autoryzacji'
    ),

  logout: (): Promise<ApiResponse<{ success: boolean }>> =>
    createApiResponse(
      fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      }),
      'Błąd podczas wylogowywania'
    ),

  getPlaylist: (playlistId: string): Promise<ApiResponse<PlaylistData>> =>
    createApiResponse(
      fetch(`/api/playlist/${playlistId}`, {
        credentials: 'include'
      }),
      'Nie udało się załadować playlisty. Sprawdź czy jest publiczna.'
    )
};