export interface SpotifyTrack {
  id: string;
  name: string;
  artists: Array<{
    id: string;
    name: string;
  }>;
  duration_ms: number;
  audio_features?: AudioFeatures;
  popularity?: number;
}

export interface AudioFeatures {
  energy: number;
  valence: number;
  danceability: number;
  acousticness: number;
  speechiness: number;
  tempo: number;
}

export interface PlaylistData {
  playlist: {
    id: string;
    name: string;
    description?: string;
    followers?: { total: number };
  };
  tracks: Array<{
    track: SpotifyTrack | null;
  }>;
}


export interface AudioAverages {
  energy: string;
  valence: string;
  danceability: string;
  acousticness: string;
  speechiness: string;
  tempo: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  expiresAt?: number;
}

export interface ArtistCount {
  name: string;
  count: number;
}