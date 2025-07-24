export interface AnalysisTab {
  id: string;
  label: string;
  icon: any;
}

export interface ArtistAnalysis {
  id: string;
  name: string;
  popularity: number;
  followers: number;
  genres: string[];
  trackCount: number;
  averagePopularity: number;
}

export interface TrackAnalysis {
  id: string;
  name: string;
  artists: Array<{
    id: string;
    name: string;
  }>;
  album: {
    id: string;
    name: string;
    release_date: string;
  };
  popularity: number;
  duration_ms: number;
  preview_url?: string;
}

export interface PlaylistStatistics {
  totalTracks: number;
  totalDuration: number;
  averagePopularity: number;
  mostCommonGenre: string;
  uniqueArtists: number;
  uniqueAlbums: number;
  avgTrackDuration: number;
}

export interface MoodAnalysis {
  energetic: number;
  danceable: number;
  calm: number;
  happy: number;
  sad: number;
  acoustic: number;
}

export interface GenreDistribution {
  genre: string;
  count: number;
  percentage: number;
}

export interface AudioFeaturesAnalysis {
  averages: {
    danceability: number;
    energy: number;
    valence: number;
    tempo: number;
    acousticness: number;
    instrumentalness: number;
    speechiness: number;
  };
  distributions: {
    [key: string]: number[];
  };
}

// src/types/analysis.types.ts - Zaktualizowane typy
export interface AnalysisResult {
  tracks: any;
  playlistIds: string[];
  statistics: {
    yearDistribution: any;
    totalTracks: number;
    totalDuration: number;
    averagePopularity: number;
    mostCommonGenre: string;
    uniqueAlbums: number;
    avgTrackDuration: number;
    uniqueArtists: number;
  };
  insights?: {
    genreDistribution: Array<{
      genre: string;
      count: number;
    }>;
    artistDistribution: Array<{
      name: string;
      trackCount: number;
    }>;
    yearsDistribution: Array<{
      year: number;
      count: number;
    }>;
    topTracks: Array<{
      name: string;
      artists: string;
      popularity: number;
      duration_ms: number;
      album: string;
      id: string;
    }>;
    popularityInsights: {
      averagePopularity: number;
      popularityDistribution: Array<{
        range: string;
        min: number;
        max: number;
        count: number;
      }>;
      trendingTracks: any[];
      vintageTracks: any[];
    };
  };
}

export interface AnalysisOptions {
  includeAudioFeatures?: boolean; // Deprecated - zawsze false
  includeMoodAnalysis?: boolean;   // Deprecated - zawsze false  
  includeGenreAnalysis?: boolean;
  includeComparisons?: boolean;
}

export interface TrackAnalysis {
  id: string;
  name: string;
  artists: Array<{
    id: string;
    name: string;
  }>;
  album: {
    id: string;
    name: string;
    release_date: string;
  };
  popularity: number;
  duration_ms: number;
  preview_url?: string;
}

export interface ArtistAnalysis {
  id: string;
  name: string;
  popularity: number;
  followers: number;
  genres: string[];
  trackCount: number;
  averagePopularity: number;
}

export interface PlaylistComparison {
  playlist1Id: string;
  playlist2Id: string;
  similarity: number;
  commonTracks: number;
  commonArtists: number;
  differences: {
    genre: string[];
    era: string[];
    popularity: string[];
  };
}


export interface AnalysisOptions {
  includeAudioFeatures?: boolean; // Deprecated - zawsze false
  includeMoodAnalysis?: boolean;   // Deprecated - zawsze false  
  includeGenreAnalysis?: boolean;
  includeComparisons?: boolean;
}