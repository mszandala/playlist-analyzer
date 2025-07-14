// src/services/dashboardApi.ts
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
  private baseUrl = '/api';
  private accessToken: string | null = null;
  private requestCache = new Map<string, Promise<any>>();

  setAccessToken(token: string) {
    this.accessToken = token;
  }

  hasAccessToken(): boolean {
    return !!this.accessToken;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    // Dodaj cache dla GET requestów żeby uniknąć duplikatów
    const cacheKey = `${options.method || 'GET'}-${endpoint}`;
    if (!options.method || options.method === 'GET') {
      if (this.requestCache.has(cacheKey)) {
        return this.requestCache.get(cacheKey);
      }
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    }

    const requestPromise = fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      credentials: 'include',
      headers,
    }).then(async (response) => {
      // Usuń z cache po zakończeniu
      this.requestCache.delete(cacheKey);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Request failed: ${response.status}`);
      }
      return response.json();
    });

    // Cachuj tylko GET requesty
    if (!options.method || options.method === 'GET') {
      this.requestCache.set(cacheKey, requestPromise);
    }

    return requestPromise;
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
    }>(`/dashboard/playlists?offset=${offset}&limit=${limit}`);
  }

  async searchPlaylists(query: string): Promise<{
    playlists: SpotifyPlaylist[];
    total: number;
    hasMore: boolean;
  }> {
    return this.request<{
      playlists: SpotifyPlaylist[];
      total: number;
      hasMore: boolean;
    }>('/dashboard/playlists', {
      method: 'POST',
      body: JSON.stringify({ searchQuery: query }),
    });
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

  // NAPRAWIONA metoda exportAnalysis - używa cookies zamiast localStorage
  async exportAnalysis(analysisId: string, format: 'json' | 'csv' | 'pdf' = 'json'): Promise<Blob> {
    const response = await fetch(`${this.baseUrl}/analyses/${analysisId}/export?format=${format}`, {
      credentials: 'include', // Używa cookies zamiast localStorage
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