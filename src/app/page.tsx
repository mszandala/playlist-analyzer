'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getPlaylistIdFromUrl } from '@/lib/spotify';
import SpotifyAuth from '@/components/SpotifyAuth';

export default function Home() {
  const [playlistUrl, setPlaylistUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const router = useRouter();

  // Check authentication status on component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/user');
        const data = await response.json();
        setIsAuthenticated(data.authenticated);
      } catch (error) {
        console.error('Error checking auth:', error);
        setIsAuthenticated(false);
      } finally {
        setAuthLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleAnalyze = async () => {
    setError('');
    
    if (!isAuthenticated) {
      setError('Musisz się zalogować przez Spotify aby analizować playlisty');
      return;
    }
    
    if (!playlistUrl.trim()) {
      setError('Proszę wpisać link do playlisty');
      return;
    }

    const playlistId = getPlaylistIdFromUrl(playlistUrl);
    
    if (!playlistId) {
      setError('Nieprawidłowy link do playlisty Spotify');
      return;
    }

    setLoading(true);
    
    try {
      // Test czy playlist istnieje
      const response = await fetch(`/api/playlist/${playlistId}`);
      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 401) {
          setError('Sesja wygasła. Proszę zalogować się ponownie.');
          setIsAuthenticated(false);
          return;
        }
        throw new Error(errorData.details || 'Playlist nie została znaleziona');
      }
      
      router.push(`/analysis/${playlistId}`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Nieznany błąd';
      setError(`Nie udało się załadować playlisty: ${errorMessage}`);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-green-500 to-green-600">
      <div className="container mx-auto px-4 py-16">
        {/* Auth Header */}
        <div className="flex justify-end mb-8">
          <SpotifyAuth />
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-white mb-4 drop-shadow-lg">
            🎵 Playlist Analyzer
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Odkryj ukryte wzorce w swojej muzyce. Zaloguj się przez Spotify, 
            wklej link do playlisty i zobacz szczegółową analizę swoich gustów muzycznych.
          </p>
        </div>

        {/* Input Section */}
        <div className="max-w-2xl mx-auto">
          {!authLoading && !isAuthenticated && (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-6">
              <div className="flex items-center">
                <span className="text-xl mr-2">⚠️</span>
                <div>
                  <strong>Wymagane logowanie</strong>
                  <p>Musisz zalogować się przez Spotify aby analizować playlisty. Kliknij przycisk &quot;Zaloguj się przez Spotify&quot; powyżej.</p>
                </div>
              </div>
            </div>
          )}
          
          <div className="bg-white/95 backdrop-blur rounded-xl shadow-2xl p-8">
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Link do playlisty Spotify
              </label>
              <input
                type="text"
                value={playlistUrl}
                onChange={(e) => setPlaylistUrl(e.target.value)}
                placeholder="https://open.spotify.com/playlist/37i9dQZF1DX..."
                className="w-full px-4 py-4 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-lg"
                disabled={loading || !isAuthenticated}
              />
              {error && (
                <p className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded">
                  {error}
                </p>
              )}
            </div>
            
            <button
              onClick={handleAnalyze}
              disabled={loading || !playlistUrl.trim() || !isAuthenticated}
              className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analizuję playlistę...
                </span>
              ) : (
                '🔍 Analizuj playlistę'
              )}
            </button>

            {/* Demo link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 mb-2">Lub spróbuj z przykładową playlistą:</p>
              <button
                onClick={() => setPlaylistUrl('https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M')}
                className="text-green-600 hover:text-green-700 text-sm underline"
                disabled={loading}
              >
                Today&apos;s Top Hits
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}