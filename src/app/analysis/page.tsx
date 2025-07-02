'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface Track {
  track: {
    id: string;
    name: string;
    artists: Array<{ name: string }>;
    duration_ms: number;
    popularity: number;
  };
}

interface AudioFeatures {
  energy: number;
  valence: number;
  danceability: number;
  acousticness: number;
  instrumentalness: number;
  speechiness: number;
  tempo: number;
}

interface PlaylistData {
  playlist: {
    name: string;
    description: string;
    followers: { total: number };
    images: Array<{ url: string }>;
  };
  tracks: Track[];
  audioFeatures: AudioFeatures[];
  totalTracks: number;
}

export default function AnalysisPage() {
  const params = useParams();
  const router = useRouter();
  const [data, setData] = useState<PlaylistData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPlaylistData = async () => {
      try {
        const response = await fetch(`/api/playlist/${params.id}`);
        if (!response.ok) {
          throw new Error('Nie udało się pobrać danych playlisty');
        }
        const playlistData = await response.json();
        setData(playlistData);
      } catch (err) {
        setError('Błąd podczas ładowania playlisty. Sprawdź czy jest publiczna.');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchPlaylistData();
    }
  }, [params.id]);

  // Oblicz średnie wartości audio features
  const calculateAverages = () => {
    if (!data?.audioFeatures || data.audioFeatures.length === 0) return null;

    const validFeatures = data.audioFeatures.filter(f => f !== null);
    const totals = validFeatures.reduce(
      (acc, features) => ({
        energy: acc.energy + features.energy,
        valence: acc.valence + features.valence,
        danceability: acc.danceability + features.danceability,
        acousticness: acc.acousticness + features.acousticness,
        speechiness: acc.speechiness + features.speechiness,
        tempo: acc.tempo + features.tempo,
      }),
      { energy: 0, valence: 0, danceability: 0, acousticness: 0, speechiness: 0, tempo: 0 }
    );

    const count = validFeatures.length;
    return {
      energy: (totals.energy / count * 100).toFixed(1),
      valence: (totals.valence / count * 100).toFixed(1),
      danceability: (totals.danceability / count * 100).toFixed(1),
      acousticness: (totals.acousticness / count * 100).toFixed(1),
      speechiness: (totals.speechiness / count * 100).toFixed(1),
      tempo: (totals.tempo / count).toFixed(0),
    };
  };

  // Znajdź najpopularniejszych artystów
  const getTopArtists = () => {
    if (!data?.tracks) return [];

    const artistCounts: { [key: string]: number } = {};
    data.tracks.forEach(item => {
      if (item.track?.artists) {
        item.track.artists.forEach(artist => {
          artistCounts[artist.name] = (artistCounts[artist.name] || 0) + 1;
        });
      }
    });

    return Object.entries(artistCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([name, count]) => ({ name, count }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-400 via-green-500 to-green-600 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold">Analizuję playlistę...</h2>
          <p className="text-lg opacity-80">Pobieram dane z Spotify API</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-400 via-red-500 to-red-600 flex items-center justify-center">
        <div className="text-center text-white max-w-md">
          <h2 className="text-3xl font-bold mb-4">Błąd</h2>
          <p className="text-lg mb-6">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="bg-white text-red-500 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors"
          >
            Wróć do strony głównej
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const averages = calculateAverages();
  const topArtists = getTopArtists();
  const totalDuration = data.tracks.reduce((sum, item) => sum + (item.track?.duration_ms || 0), 0);
  const avgDuration = totalDuration / data.tracks.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-green-500 to-green-600">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <button
            onClick={() => router.push('/')}
            className="mb-4 text-white hover:text-green-200 transition-colors"
          >
            ← Wróć do strony głównej
          </button>
          <h1 className="text-4xl font-bold text-white mb-2">📊 Analiza Playlisty</h1>
          <h2 className="text-2xl text-white/90">{data.playlist.name}</h2>
        </div>

        {/* Playlist Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/95 backdrop-blur rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-gray-800 mb-4">🎵 Podstawowe Info</h3>
            <div className="space-y-2">
              <p><strong>Liczba utworów:</strong> {data.tracks.length}</p>
              <p><strong>Łączny czas:</strong> {Math.round(totalDuration / 60000)} minut</p>
              <p><strong>Średni czas utworu:</strong> {Math.round(avgDuration / 1000)} sekund</p>
              <p><strong>Obserwujący:</strong> {data.playlist.followers?.total || 0}</p>
            </div>
          </div>

          {averages && (
            <div className="bg-white/95 backdrop-blur rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-4">🎭 Cechy Muzyczne</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Energia:</span>
                  <span className="font-bold">{averages.energy}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Pozytywność:</span>
                  <span className="font-bold">{averages.valence}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Taneczność:</span>
                  <span className="font-bold">{averages.danceability}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Akustyczność:</span>
                  <span className="font-bold">{averages.acousticness}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Tempo:</span>
                  <span className="font-bold">{averages.tempo} BPM</span>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white/95 backdrop-blur rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-gray-800 mb-4">🎤 Top Wykonawcy</h3>
            <div className="space-y-2">
              {topArtists.slice(0, 5).map((artist, index) => (
                <div key={artist.name} className="flex justify-between">
                  <span className="truncate">{index + 1}. {artist.name}</span>
                  <span className="font-bold ml-2">{artist.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Track List */}
        <div className="bg-white/95 backdrop-blur rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-800 mb-4">🎶 Lista Utworów</h3>
          <div className="max-h-96 overflow-y-auto">
            {data.tracks.slice(0, 20).map((item, index) => (
              <div key={item.track?.id || index} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                <div className="flex-1">
                  <p className="font-medium truncate">{item.track?.name}</p>
                  <p className="text-sm text-gray-600 truncate">
                    {item.track?.artists?.map(a => a.name).join(', ')}
                  </p>
                </div>
                <div className="text-right ml-4">
                  <p className="text-sm text-gray-600">
                    {Math.floor((item.track?.duration_ms || 0) / 60000)}:
                    {String(Math.floor(((item.track?.duration_ms || 0) % 60000) / 1000)).padStart(2, '0')}
                  </p>
                </div>
              </div>
            ))}
            {data.tracks.length > 20 && (
              <p className="text-center text-gray-600 py-4">
                ... i {data.tracks.length - 20} więcej utworów
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}