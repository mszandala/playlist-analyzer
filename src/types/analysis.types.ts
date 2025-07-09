export interface AnalysisTab {
  id: string;
  label: string;
  icon: any;
}

export interface ArtistAnalysis {
  id: string;
  name: string;
  trackCount: number;
  popularity: number;
  genres: string[];
  image?: string;
}

export interface TrackAnalysis {
  id: string;
  name: string;
  artist: string;
  album: string;
  popularity: number;
  duration: number;
  audioFeatures: {
    danceability: number;
    energy: number;
    valence: number;
    tempo: number;
    acousticness: number;
    instrumentalness: number;
    speechiness: number;
  };
}

export interface PlaylistStatistics {
  totalTracks: number;
  totalDuration: number;
  averagePopularity: number;
  mostCommonGenre: string;
  uniqueArtists: number;
  duplicateTracks: number;
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

export interface PlaylistComparison {
  playlistId: string;
  playlistName: string;
  commonTracks: TrackAnalysis[];
  commonArtists: ArtistAnalysis[];
  similarities: {
    genreOverlap: number;
    moodSimilarity: number;
    audioFeaturesSimilarity: number;
  };
}

export interface AnalysisResult {
  playlistIds: string[];
  statistics: PlaylistStatistics;
  topArtists: ArtistAnalysis[];
  topTracks: TrackAnalysis[];
  moodAnalysis: MoodAnalysis;
  genreDistribution: GenreDistribution[];
  audioFeaturesAnalysis: AudioFeaturesAnalysis;
  comparisons?: PlaylistComparison[];
  generatedAt: Date;
}

export interface AnalysisOptions {
  includeAudioFeatures: boolean;
  includeMoodAnalysis: boolean;
  includeGenreAnalysis: boolean;
  includeComparisons: boolean;
  timeRange?: 'short_term' | 'medium_term' | 'long_term';
}