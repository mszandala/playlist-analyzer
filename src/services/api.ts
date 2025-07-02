interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export const apiService = {
  checkAuth: async (): Promise<ApiResponse<boolean>> => {
    try {
      const response = await fetch('/api/auth/check');
      return { data: response.ok };
    } catch (error) {
      return { error: 'Błąd podczas sprawdzania autoryzacji' };
    }
  },

  getPlaylist: async (playlistId: string): Promise<ApiResponse<any>> => {
    try {
      const response = await fetch(`/api/playlist/${playlistId}`);
      if (!response.ok) {
        throw new Error('Playlist nie została znaleziona');
      }
      const data = await response.json();
      return { data };
    } catch (error) {
      return { 
        error: 'Nie udało się załadować playlisty. Sprawdź czy jest publiczna.'
      };
    }
  }
};