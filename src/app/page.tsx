'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getPlaylistIdFromUrl, getSpotifyAuthUrl } from '@/lib/spotify';
import { LoginButton } from '@/components/LoginButton';
import { PlaylistForm } from '@/components/PlaylistForm';
import { usePlaylistAnalyzer } from '@/hooks/usePlaylistAnalyzer';
import { apiService } from '@/services/api'; 


export default function Home() {
  const { state, updateState, resetError } = usePlaylistAnalyzer();
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const { data, error } = await apiService.checkAuth();
      updateState({ isLoggedIn: !!data?.authenticated });
    };
    checkAuth();
  }, [updateState]);

  const handleLogin = async () => {
    try {
      const authUrl = getSpotifyAuthUrl();
      window.location.href = authUrl;
    } catch (error) {
      console.error('Error during login:', error);
      updateState({ error: 'Wystąpił błąd podczas próby logowania do Spotify' });
    }
  };

  const handleLogout = async () => {
    try {
      await apiService.logout();
      updateState({ isLoggedIn: false, playlistUrl: '', error: undefined });
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const handleAnalyze = async () => {
    resetError();
    updateState({ loading: true });

    if (!state.playlistUrl.trim()) {
      updateState({ error: 'Proszę wpisać link do playlisty', loading: false });
      return;
    }

    const playlistId = getPlaylistIdFromUrl(state.playlistUrl);
    
    if (!playlistId) {
      updateState({ error: 'Nieprawidłowy link do playlisty Spotify', loading: false });
      return;
    }
    
    const { data, error } = await apiService.getPlaylist(playlistId);
    
    if (error) {
      // If it's an auth error, log out the user
      if (error.includes('Sesja wygasła') || error.includes('Brak autoryzacji')) {
        await handleLogout();
        updateState({ error: 'Sesja wygasła. Zaloguj się ponownie.', loading: false });
      } else {
        updateState({ error, loading: false });
      }
      return;
    }

    router.push(`/analysis/${playlistId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="container mx-auto px-4 py-16">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-white mb-4 drop-shadow-lg">
            🎵 Playlist Analyzer
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Odkryj ukryte wzorce w swojej muzyce. Wklej link do playlisty Spotify 
            i zobacz szczegółową analizę swoich gustów muzycznych.
          </p>
        </div>

        {/* Main Card */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-gray-900/95 backdrop-blur rounded-2xl shadow-2xl p-8 border border-green-500/30 hover:border-green-400/50 transition-all duration-300">
            {!state.isLoggedIn ? (
              <LoginButton onClick={handleLogin} />
            ) : (
              <>
                {/* Logged in Header */}
                <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <h2 className="text-xl font-semibold text-white">
                      Połączono ze Spotify
                    </h2>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="px-6 py-2 text-sm bg-transparent text-gray-300 hover:text-white border border-gray-600 hover:border-gray-400 transition-all duration-200 rounded-full font-medium"
                  >
                    Wyloguj
                  </button>
                </div>

                {/* Spotify-style divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent mb-8"></div>

                <PlaylistForm
                  playlistUrl={state.playlistUrl}
                  loading={state.loading}
                  error={state.error}
                  onUrlChange={(url) => updateState({ playlistUrl: url })}
                  onAnalyze={handleAnalyze}
                />
              </>
            )}
          </div>
        </div>

        {/* Optional: Spotify-style background elements */}
        <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-green-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-green-400/5 rounded-full blur-3xl"></div>
        </div>
      </div>
    </div>
  );
}