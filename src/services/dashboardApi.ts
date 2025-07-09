import { SpotifyPlaylist } from '@/types/spotify.types';

export interface DashboardStats {
  totalPlaylists: number;
  totalTracks: number;
  totalArtists: number;
  totalGenres: number;
  listeningTime: number;
  topGenres: Array<{
    name: string;
    count: number;
    percentage: number;
  }>;
  recentActivity: Array<{
    id: string;
    type: 'playlist_created' | 'track_added' | 'analysis_completed';
    description: string;
    timestamp: Date;
  }>;
}

export interface SavedAnalysis {
  id: string;
  name: string;
  playlistIds: string[];
  createdAt: Date;
  updatedAt: Date;
  isPublic: boolean;
  shareUrl?: string;
}

class DashboardApi {
  private baseUrl = '/api/dashboard';

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = localStorage.getItem('spotify_access_token');
    
    if (!token) {
      throw new Error('No access token available');
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Request failed: ${response.status}`);
    }

    return response.json();
  }

  async getDashboardStats(): Promise<DashboardStats> {
    return this.request<DashboardStats>('/stats');
  }

  async getUserPlaylists(offset = 0, limit = 50): Promise<{
    playlists: SpotifyPlaylist[];
    total: number;
    hasMore: boolean;
  }> {
    return this.request<{
      playlists: SpotifyPlaylist[];
      total: number;
      hasMore: boolean;
    }>(`/playlists?offset=${offset}&limit=${limit}`);
  }

  async searchPlaylists(query: string): Promise<SpotifyPlaylist[]> {
    return this.request<SpotifyPlaylist[]>(`/playlists/search?q=${encodeURIComponent(query)}`);
  }

  async getPlaylistDetails(playlistId: string): Promise<SpotifyPlaylist> {
    return this.request<SpotifyPlaylist>(`/playlists/${playlistId}`);
  }

  async getMultiplePlaylistDetails(playlistIds: string[]): Promise<SpotifyPlaylist[]> {
    return this.request<SpotifyPlaylist[]>('/playlists/batch', {
      method: 'POST',
      body: JSON.stringify({ playlistIds }),
    });
  }

  async saveAnalysis(analysis: {
    name: string;
    playlistIds: string[];
    data: any;
    isPublic?: boolean;
  }): Promise<SavedAnalysis> {
    return this.request<SavedAnalysis>('/analyses', {
      method: 'POST',
      body: JSON.stringify(analysis),
    });
  }

  async getSavedAnalyses(): Promise<SavedAnalysis[]> {
    return this.request<SavedAnalysis[]>('/analyses');
  }

  async getSavedAnalysis(analysisId: string): Promise<SavedAnalysis & { data: any }> {
    return this.request<SavedAnalysis & { data: any }>(`/analyses/${analysisId}`);
  }

  async updateSavedAnalysis(
    analysisId: string,
    updates: Partial<Pick<SavedAnalysis, 'name' | 'isPublic'>>
  ): Promise<SavedAnalysis> {
    return this.request<SavedAnalysis>(`/analyses/${analysisId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  async deleteSavedAnalysis(analysisId: string): Promise<void> {
    return this.request<void>(`/analyses/${analysisId}`, {
      method: 'DELETE',
    });
  }

  async shareAnalysis(analysisId: string): Promise<{ shareUrl: string }> {
    return this.request<{ shareUrl: string }>(`/analyses/${analysisId}/share`, {
      method: 'POST',
    });
  }

  async exportAnalysis(analysisId: string, format: 'json' | 'csv' | 'pdf' = 'json'): Promise<Blob> {
    const token = localStorage.getItem('spotify_access_token');
    
    if (!token) {
      throw new Error('No access token available');
    }

    const response = await fetch(`${this.baseUrl}/analyses/${analysisId}/export?format=${format}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Export failed: ${response.status}`);
    }

    return response.blob();
  }

  async getUserPreferences(): Promise<{
    defaultAnalysisOptions: {
      includeAudioFeatures: boolean;
      includeMoodAnalysis: boolean;
      includeGenreAnalysis: boolean;
      includeComparisons: boolean;
    };
    theme: 'light' | 'dark';
    defaultViewMode: 'grid' | 'list';
  }> {
    return this.request<{
      defaultAnalysisOptions: {
        includeAudioFeatures: boolean;
        includeMoodAnalysis: boolean;
        includeGenreAnalysis: boolean;
        includeComparisons: boolean;
      };
      theme: 'light' | 'dark';
      defaultViewMode: 'grid' | 'list';
    }>('/preferences');
  }

  async updateUserPreferences(preferences: {
    defaultAnalysisOptions?: {
      includeAudioFeatures?: boolean;
      includeMoodAnalysis?: boolean;
      includeGenreAnalysis?: boolean;
      includeComparisons?: boolean;
    };
    theme?: 'light' | 'dark';
    defaultViewMode?: 'grid' | 'list';
  }): Promise<void> {
    return this.request<void>('/preferences', {
      method: 'PATCH',
      body: JSON.stringify(preferences),
    });
  }
}

export const dashboardApi = new DashboardApi();