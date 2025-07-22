import {
  AnalysisResult,
  AnalysisOptions,
  ArtistAnalysis,
  TrackAnalysis,
  PlaylistComparison
} from '@/types/analysis.types';

export interface AnalysisProgress {
  step: 'fetching_tracks' | 'analyzing_audio' | 'processing_data' | 'generating_insights' | 'completed';
  progress: number;
  message: string;
}

class AnalysisApi {
  private baseUrl = '/api/analysis';

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
      console.error('API error response:', errorData, 'Status:', response.status);
      throw new Error(errorData.message || `Analysis request failed: ${response.status}`);
    }

    return response.json();
  }

  async analyzePlaylist(
    playlistId: string,
    options: AnalysisOptions = {
      includeAudioFeatures: true,
      includeMoodAnalysis: true,
      includeGenreAnalysis: true,
      includeComparisons: false,
    }
  ): Promise<AnalysisResult> {
    return this.request<AnalysisResult>('', {
      method: 'POST',
      body: JSON.stringify(options),
    });
  }

  async analyzeMultiplePlaylists(
    playlistIds: string[],
    options: AnalysisOptions = {
      includeAudioFeatures: true,
      includeMoodAnalysis: true,
      includeGenreAnalysis: true,
      includeComparisons: true,
    }
  ): Promise<AnalysisResult> {
    return this.request<AnalysisResult>('', {
      method: 'POST',
      body: JSON.stringify({ playlistIds, options }),
    });
  }

  async startAnalysisJob(
    playlistIds: string[],
    options: AnalysisOptions
  ): Promise<{ jobId: string }> {
    return this.request<{ jobId: string }>('/jobs', {
      method: 'POST',
      body: JSON.stringify({ playlistIds, options }),
    });
  }

  async getAnalysisJobStatus(jobId: string): Promise<{
    status: 'pending' | 'running' | 'completed' | 'failed';
    progress?: AnalysisProgress;
    result?: AnalysisResult;
    error?: string;
  }> {
    return this.request<{
      status: 'pending' | 'running' | 'completed' | 'failed';
      progress?: AnalysisProgress;
      result?: AnalysisResult;
      error?: string;
    }>(`/jobs/${jobId}`);
  }

  async getTopArtists(
    playlistIds: string[],
    limit: number = 20
  ): Promise<ArtistAnalysis[]> {
    return this.request<ArtistAnalysis[]>('/artists/top', {
      method: 'POST',
      body: JSON.stringify({ playlistIds, limit }),
    });
  }

  async getTopTracks(
    playlistIds: string[],
    limit: number = 20
  ): Promise<TrackAnalysis[]> {
    return this.request<TrackAnalysis[]>('/tracks/top', {
      method: 'POST',
      body: JSON.stringify({ playlistIds, limit }),
    });
  }

  async getArtistDetails(
    artistId: string,
    playlistIds: string[]
  ): Promise<ArtistAnalysis & {
    tracksInPlaylists: TrackAnalysis[];
    relatedArtists: ArtistAnalysis[];
    topTracks: TrackAnalysis[];
  }> {
    return this.request<ArtistAnalysis & {
      tracksInPlaylists: TrackAnalysis[];
      relatedArtists: ArtistAnalysis[];
      topTracks: TrackAnalysis[];
    }>(`/artists/${artistId}`, {
      method: 'POST',
      body: JSON.stringify({ playlistIds }),
    });
  }

  async getTrackDetails(
    trackId: string,
    playlistIds: string[]
  ): Promise<TrackAnalysis & {
    appearsInPlaylists: string[];
    similarTracks: TrackAnalysis[];
    recommendations: TrackAnalysis[];
  }> {
    return this.request<TrackAnalysis & {
      appearsInPlaylists: string[];
      similarTracks: TrackAnalysis[];
      recommendations: TrackAnalysis[];
    }>(`/tracks/${trackId}`, {
      method: 'POST',
      body: JSON.stringify({ playlistIds }),
    });
  }

  async comparePlaylists(
    playlistIds: string[]
  ): Promise<PlaylistComparison[]> {
    return this.request<PlaylistComparison[]>('/compare', {
      method: 'POST',
      body: JSON.stringify({ playlistIds }),
    });
  }

  async getGenreAnalysis(
    playlistIds: string[]
  ): Promise<{
    distribution: Array<{
      genre: string;
      count: number;
      percentage: number;
    }>;
    evolution: Array<{
      genre: string;
      timeframes: Array<{
        period: string;
        count: number;
      }>;
    }>;
    recommendations: Array<{
      genre: string;
      reason: string;
      confidence: number;
    }>;
  }> {
    return this.request<{
      distribution: Array<{
        genre: string;
        count: number;
        percentage: number;
      }>;
      evolution: Array<{
        genre: string;
        timeframes: Array<{
          period: string;
          count: number;
        }>;
      }>;
      recommendations: Array<{
        genre: string;
        reason: string;
        confidence: number;
      }>;
    }>('/genres', {
      method: 'POST',
      body: JSON.stringify({ playlistIds }),
    });
  }

  async getMoodAnalysis(
    playlistIds: string[]
  ): Promise<{
    overall: {
      danceability: number;
      energy: number;
      valence: number;
      tempo: number;
    };
    byPlaylist: Array<{
      playlistId: string;
      mood: {
        danceability: number;
        energy: number;
        valence: number;
        tempo: number;
      };
    }>;
    timeline: Array<{
      period: string;
      mood: {
        danceability: number;
        energy: number;
        valence: number;
        tempo: number;
      };
    }>;
    recommendations: Array<{
      type: 'workout' | 'chill' | 'party' | 'focus' | 'sleep';
      confidence: number;
      reason: string;
    }>;
  }> {
    return this.request<{
      overall: {
        danceability: number;
        energy: number;
        valence: number;
        tempo: number;
      };
      byPlaylist: Array<{
        playlistId: string;
        mood: {
          danceability: number;
          energy: number;
          valence: number;
          tempo: number;
        };
      }>;
      timeline: Array<{
        period: string;
        mood: {
          danceability: number;
          energy: number;
          valence: number;
          tempo: number;
        };
      }>;
      recommendations: Array<{
        type: 'workout' | 'chill' | 'party' | 'focus' | 'sleep';
        confidence: number;
        reason: string;
      }>;
    }>('/mood', {
      method: 'POST',
      body: JSON.stringify({ playlistIds }),
    });
  }

  async getRecommendations(
    playlistIds: string[],
    options: {
      limit?: number;
      seedGenres?: string[];
      targetAudioFeatures?: {
        danceability?: number;
        energy?: number;
        valence?: number;
        tempo?: number;
      };
    } = {}
  ): Promise<{
    tracks: TrackAnalysis[];
    explanation: string;
    confidence: number;
  }> {
    return this.request<{
      tracks: TrackAnalysis[];
      explanation: string;
      confidence: number;
    }>('/recommendations', {
      method: 'POST',
      body: JSON.stringify({ playlistIds, ...options }),
    });
  }

  async detectDuplicates(
    playlistIds: string[]
  ): Promise<{
    exactDuplicates: Array<{
      track: TrackAnalysis;
      playlists: string[];
    }>;
    similarTracks: Array<{
      tracks: TrackAnalysis[];
      similarity: number;
      reason: string;
    }>;
  }> {
    return this.request<{
      exactDuplicates: Array<{
        track: TrackAnalysis;
        playlists: string[];
      }>;
      similarTracks: Array<{
        tracks: TrackAnalysis[];
        similarity: number;
        reason: string;
      }>;
    }>('/duplicates', {
      method: 'POST',
      body: JSON.stringify({ playlistIds }),
    });
  }
}

export const analysisApi = new AnalysisApi();