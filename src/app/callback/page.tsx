'use client';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function CallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      
      if (!code) {
        console.error('No code received from Spotify');
        router.push('/?error=no_code');
        return;
      }

      try {
        // Wymiana kodu na tokeny
        const response = await fetch('/api/auth/callback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code }),
        });

        if (!response.ok) {
          throw new Error('Failed to exchange code for tokens');
        }

        // Przekieruj z powrotem na stronę główną
        router.push('/');
      } catch (error) {
        console.error('Error during callback:', error);
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