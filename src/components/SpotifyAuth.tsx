'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';

interface User {
  id: string;
  display_name: string;
  email?: string;
  images?: Array<{ url: string }>;
  country?: string;
  followers?: { total: number };
}

interface AuthState {
  authenticated: boolean;
  user?: User;
  loading: boolean;
}

export default function SpotifyAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    authenticated: false,
    loading: true,
  });

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/auth/user');
      const data = await response.json();
      setAuthState({
        authenticated: data.authenticated,
        user: data.user,
        loading: false,
      });
    } catch (error) {
      console.error('Error checking auth status:', error);
      setAuthState({
        authenticated: false,
        loading: false,
      });
    }
  };

  const handleLogin = () => {
    window.location.href = '/api/auth/login';
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/user', { method: 'DELETE' });
      setAuthState({
        authenticated: false,
        loading: false,
      });
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  if (authState.loading) {
    return (
      <div className="flex items-center space-x-2">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
        <span className="text-white/80">Sprawdzanie logowania...</span>
      </div>
    );
  }

  if (!authState.authenticated) {
    return (
      <button
        onClick={handleLogin}
        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-all duration-200 flex items-center space-x-2"
      >
        <span>🎵</span>
        <span>Zaloguj się przez Spotify</span>
      </button>
    );
  }

  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-2">
        {authState.user?.images?.[0] && (
          <Image
            src={authState.user.images[0].url}
            alt="Profile"
            width={32}
            height={32}
            className="rounded-full"
          />
        )}
        <div className="text-white">
          <span className="text-sm">Zalogowany jako </span>
          <span className="font-semibold">{authState.user?.display_name}</span>
        </div>
      </div>
      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded text-sm transition-all duration-200"
      >
        Wyloguj
      </button>
    </div>
  );
}