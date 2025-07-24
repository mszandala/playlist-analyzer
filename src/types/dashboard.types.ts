export interface Playlist {
  id: string;
  name: string;
  description: string;
  owner: string;
  imageUrl: string;
  tracksCount: number;
  isPublic: boolean;
  collaborative: boolean;
  externalUrl: string;
  createdAt: Date;
  lastModified: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  image: string;
  accessToken?: string;
}


export interface DashboardState {
  selectedPlaylists: string[];
  selectedTab: string;
  isDarkMode: boolean;
  viewMode: 'grid' | 'list';
  searchQuery: string;
  isLoading: boolean;
  error: string | null;
}

export interface AnalysisTab {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
}

export interface PlaylistStats {
  totalTracks: number;
  totalDuration: number;
  averagePopularity: number;
  topGenre: string;
  topArtist: string;
  uniqueArtists: number;
}

export interface MoodAnalysis {
  energetic: number;
  danceable: number;
  calm: number;
  happy: number;
  sad: number;
}

export interface ArtistStat {
  name: string;
  tracks: number;
  popularity: number;
  image?: string;
}


export interface AnalysisData {
  stats: PlaylistStats;
  mood: MoodAnalysis;
  topArtists: ArtistStat[];
  genres: { name: string; count: number }[];
  yearDistribution: { year: number; count: number }[];
  tracks: { duration_ms: number }[];
}