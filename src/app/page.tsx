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
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-green-500 to-green-600">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-white mb-4 drop-shadow-lg">
            🎵 Playlist Analyzer
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Odkryj ukryte wzorce w swojej muzyce. Wklej link do playlisty Spotify 
            i zobacz szczegółową analizę swoich gustów muzycznych.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="bg-white/95 backdrop-blur rounded-xl shadow-2xl p-8">
            {!state.isLoggedIn ? (
              <LoginButton onClick={handleLogin} />
            ) : (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">Zalogowano do Spotify</h2>
                  <button
                    onClick={handleLogout}
                    className="text-sm text-gray-600 hover:text-red-600 transition-colors"
                  >
                    Wyloguj
                  </button>
                </div>
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
      </div>
    </div>
  );
}