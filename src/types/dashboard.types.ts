export interface User {
  id: string;
  name: string;
  email: string;
  image: string;
  spotifyId: string;
}

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  tracks: number;
  image: string;
  owner: string;
  isPublic: boolean;
  spotifyId: string;
}

export interface AnalysisTab {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
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

export interface PlaylistStats {
  totalTracks: number;
  totalDuration: number;
  averagePopularity: number;
  topGenre: string;
  topArtist: string;
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
}