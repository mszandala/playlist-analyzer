'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function CallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code');
      const error = searchParams.get('error');
      
      if (error) {
        console.error('Spotify authorization error:', error);
        router.push('/?error=spotify_denied');
        return;
      }
      
      if (!code) {
        router.push('/?error=no_code');
        return;
      }

      try {
        const response = await fetch('/api/auth/callback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code }),
        });

        if (!response.ok) {
          throw new Error('Authentication failed');
        }

        // Przekieruj zna dashboard po pomyślnej autoryzacji
        router.push('/dashboard');
      } catch (error) {
        console.error('Error during authentication:', error);
        router.push('/?error=auth_failed');
      }
    };

    handleCallback();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-green-500 to-green-600 flex items-center justify-center">
      <div className="text-center text-white">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto mb-4"></div>
        <h2 className="text-2xl font-bold">Logowanie...</h2>
        <p className="text-lg opacity-80">Trwa autoryzacja z Spotify</p>
      </div>
    </div>
  );
}