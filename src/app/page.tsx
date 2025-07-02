'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getPlaylistIdFromUrl, getSpotifyAuthUrl } from '@/lib/spotify';
import { LoginButton } from '@/components/LoginButton';
import { PlaylistForm } from '@/components/PlaylistForm';
import { apiService } from '@/services/api';

// Dodaj interfejs dla stanu
interface PlaylistAnalyzerState {
  playlistUrl: string;
  loading: boolean;
  error: string;
  isLoggedIn: boolean;
}

const ErrorMessage = ({ message }: { message: string }) => (
  <p className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded">
    {message}
  </p>
);


const LoadingSpinner = () => (
  <span className="flex items-center justify-center">
    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    Analizuję playlistę...
  </span>
);

export default function Home() {
  const [state, setState] = useState<PlaylistAnalyzerState>({
    playlistUrl: '',
    loading: false,
    error: '',
    isLoggedIn: false
  });
  const router = useRouter();

  const updateState = (newState: Partial<PlaylistAnalyzerState>) => {
    setState(prevState => ({ ...prevState, ...newState }));
  };

  useEffect(() => {
    const checkAuth = async () => {
      const { data, error } = await apiService.checkAuth();
      updateState({ isLoggedIn: !!data });
    };
    checkAuth();
  }, []);

  const handleLogin = async () => {
    try {
      const authUrl = getSpotifyAuthUrl();
      window.location.href = authUrl;
    } catch (error) {
      console.error('Error during login:', error);
      updateState({ error: 'Wystąpił błąd podczas próby logowania do Spotify' });
    }
  };

  const handleAnalyze = async () => {
    updateState({ error: '', loading: true });
    
    if (!state.playlistUrl.trim()) {
      updateState({ error: 'Proszę wpisać link do playlisty' });
      return;
    }

    const playlistId = getPlaylistIdFromUrl(state.playlistUrl);
    
    if (!playlistId) {
      updateState({ error: 'Nieprawidłowy link do playlisty Spotify' });
      return;
    }
    
    const { data, error } = await apiService.getPlaylist(playlistId);
    
    if (error) {
      updateState({ error, loading: false });
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
              <PlaylistForm
                playlistUrl={state.playlistUrl}
                loading={state.loading}
                error={state.error}
                onUrlChange={(url) => updateState({ playlistUrl: url })}
                onAnalyze={handleAnalyze}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}