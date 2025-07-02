'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getPlaylistIdFromUrl, getSpotifyAuthUrl } from '@/lib/spotify';

export default function Home() {
  const [playlistUrl, setPlaylistUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Dodaj ten stan
  const router = useRouter();

  // Dodaj useEffect do sprawdzania stanu logowania
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/check');
        setIsLoggedIn(response.ok);
      } catch (err) {
        setIsLoggedIn(false);
      }
    };
    checkAuth();
  }, []);

  // Dodaj w komponencie obsługę parametru error
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const errorParam = params.get('error');
    
    if (errorParam === 'auth_failed') {
      setError('Błąd autoryzacji ze Spotify. Spróbuj ponownie.');
    } else if (errorParam === 'no_code') {
      setError('Nie otrzymano kodu autoryzacji od Spotify.');
    }
  }, []);

  // Dodaj funkcję logowania
  const handleLogin = async () => {
    try {
      const authUrl = getSpotifyAuthUrl();
      window.location.href = authUrl;
    } catch (error) {
      console.error('Error during login:', error);
      setError('Wystąpił błąd podczas próby logowania do Spotify');
    }
  };

  // Reszta Twojego istniejącego kodu handleAnalyze pozostaje bez zmian
  const handleAnalyze = async () => {
    setError('');
    
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
        throw new Error('Playlist nie została znaleziona');
      }
      
      router.push(`/analysis/${playlistId}`);
    } catch (err) {
      setError('Nie udało się załadować playlisty. Sprawdź czy jest publiczna.');
      setLoading(false);
    }
  };

  

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-green-500 to-green-600">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-white mb-4 drop-shadow-lg">
            🎵 Playlist Analyzer
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Odkryj ukryte wzorce w swojej muzyce. Wklej link do playlisty Spotify 
            i zobacz szczegółową analizę swoich gustów muzycznych.
          </p>
        </div>

        {/* Input Section */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white/95 backdrop-blur rounded-xl shadow-2xl p-8">
            {!isLoggedIn ? (
              // Sekcja logowania
              <div className="text-center">
                <p className="text-lg text-gray-700 mb-6">
                  Zaloguj się przez Spotify, aby analizować playlisty
                </p>
                <button
                  onClick={handleLogin}
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-lg transition-all duration-200 text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Zaloguj się przez Spotify
                </button>
              </div>
            ) : (
              // Sekcja analizy playlisty (Twój istniejący kod formularza)
              <div>
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
                    disabled={loading}
                  />
                  {error && (
                    <p className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded">
                      {error}
                    </p>
                  )}
                </div>
                
                <button
                  onClick={handleAnalyze}
                  disabled={loading || !playlistUrl.trim()}
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
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}