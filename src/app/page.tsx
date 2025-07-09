'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LoginButton } from '@/components/LoginButton';
import { getSpotifyAuthUrl } from '@/lib/spotify';
import { useAuth } from '@/contexts/AuthContext';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Jeśli user jest zalogowany, przekieruj na dashboard
    if (user) {
      router.replace('/dashboard');
    }
  }, [user, router]);

  const handleLogin = async () => {
    try {
      const authUrl = getSpotifyAuthUrl();
      window.location.href = authUrl;
    } catch (error) {
      console.error('❌ Error during login:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold">Sprawdzanie autoryzacji...</h2>
        </div>
      </div>
    );
  }

  // Jeśli user jest zalogowany, nie pokazuj strony logowania
  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-white mb-4 drop-shadow-lg">
            Playlist Analyzer
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Odkryj ukryte wzorce w swojej muzyce. Wklej link do playlisty Spotify 
            i zobacz szczegółową analizę swoich gustów muzycznych.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="bg-gray-900/95 backdrop-blur rounded-2xl shadow-2xl p-8 border border-green-500/30 hover:border-green-400/50 transition-all duration-300">
            <LoginButton onClick={handleLogin} />
          </div>
        </div>

        <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-green-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-green-400/5 rounded-full blur-3xl"></div>
        </div>
      </div>
    </div>
  );
}