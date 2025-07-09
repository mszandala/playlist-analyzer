import { useState, useEffect, useCallback } from 'react';
import { User } from '@/types/dashboard.types';

interface UseSpotifyAuthReturn {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: () => void;
  logout: () => void;
  refreshToken: () => Promise<void>;
}

export const useSpotifyAuth = (): UseSpotifyAuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getStoredTokens = useCallback(() => {
    if (typeof window === 'undefined') return null;
    
    const accessToken = localStorage.getItem('spotify_access_token');
    const refreshToken = localStorage.getItem('spotify_refresh_token');
    const expiresAt = localStorage.getItem('spotify_expires_at');
    
    if (!accessToken || !expiresAt) return null;
    
    return {
      accessToken,
      refreshToken,
      expiresAt: parseInt(expiresAt),
    };
  }, []);

  const storeTokens = useCallback((tokens: {
    accessToken: string;
    refreshToken?: string;
    expiresIn: number;
  }) => {
    if (typeof window === 'undefined') return;
    
    const expiresAt = Date.now() + tokens.expiresIn * 1000;
    
    localStorage.setItem('spotify_access_token', tokens.accessToken);
    localStorage.setItem('spotify_expires_at', expiresAt.toString());
    
    if (tokens.refreshToken) {
      localStorage.setItem('spotify_refresh_token', tokens.refreshToken);
    }
  }, []);

  const clearTokens = useCallback(() => {
    if (typeof window === 'undefined') return;
    
    localStorage.removeItem('spotify_access_token');
    localStorage.removeItem('spotify_refresh_token');
    localStorage.removeItem('spotify_expires_at');
  }, []);

  const fetchUserProfile = useCallback(async (accessToken: string): Promise<User> => {
    const response = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user profile');
    }

    return response.json();
  }, []);

  const refreshToken = useCallback(async () => {
    const tokens = getStoredTokens();
    if (!tokens || !tokens.refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refreshToken: tokens.refreshToken,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }

    const data = await response.json();
    storeTokens(data);
    
    return data.accessToken;
  }, [getStoredTokens, storeTokens]);

  const login = useCallback(() => {
    const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
    const redirectUri = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI;
    
    if (!clientId || !redirectUri) {
      setError('Spotify configuration missing');
      return;
    }

    const scopes = [
      'user-read-private',
      'user-read-email',
      'playlist-read-private',
      'playlist-read-collaborative',
      'user-library-read',
      'user-top-read',
    ];

    const authUrl = new URL('https://accounts.spotify.com/authorize');
    authUrl.searchParams.append('client_id', clientId);
    authUrl.searchParams.append('response_type', 'code');
    authUrl.searchParams.append('redirect_uri', redirectUri);
    authUrl.searchParams.append('scope', scopes.join(' '));
    authUrl.searchParams.append('state', Math.random().toString(36).substring(7));

    window.location.href = authUrl.toString();
  }, []);

  const logout = useCallback(() => {
    clearTokens();
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
  }, [clearTokens]);

  const checkAuthStatus = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const tokens = getStoredTokens();
      if (!tokens) {
        setIsAuthenticated(false);
        return;
      }

      let accessToken = tokens.accessToken;

      // Check if token is expired
      if (Date.now() >= tokens.expiresAt) {
        if (tokens.refreshToken) {
          try {
            accessToken = await refreshToken();
          } catch (error) {
            console.error('Failed to refresh token:', error);
            logout();
            return;
          }
        } else {
          logout();
          return;
        }
      }

      // Fetch user profile
      const userProfile = await fetchUserProfile(accessToken);
      setUser(userProfile);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Auth check failed:', error);
      setError('Authentication failed');
      logout();
    } finally {
      setIsLoading(false);
    }
  }, [getStoredTokens, refreshToken, fetchUserProfile, logout]);

  // Handle OAuth callback
  useEffect(() => {
    const handleCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const error = urlParams.get('error');

      if (error) {
        setError(`Spotify authentication error: ${error}`);
        setIsLoading(false);
        return;
      }

      if (code) {
        try {
          const response = await fetch('/api/auth/callback', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code }),
          });

          if (!response.ok) {
            throw new Error('Failed to exchange code for token');
          }

          const tokens = await response.json();
          storeTokens(tokens);
          
          // Clear URL parameters
          window.history.replaceState({}, document.title, window.location.pathname);
          
          // Check auth status
          await checkAuthStatus();
        } catch (error) {
          console.error('Callback handling failed:', error);
          setError('Failed to complete authentication');
          setIsLoading(false);
        }
      } else {
        await checkAuthStatus();
      }
    };

    handleCallback();
  }, [checkAuthStatus, storeTokens]);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    refreshToken,
  };
};