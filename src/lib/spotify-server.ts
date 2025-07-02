import { cookies } from 'next/headers';
import { spotifyApi } from './spotify';

// Server-side function to get user token from cookies
export const getUserSpotifyToken = async () => {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('spotify_access_token')?.value;
    const refreshToken = cookieStore.get('spotify_refresh_token')?.value;

    if (!accessToken) {
      throw new Error('No user access token found');
    }

    // Set the access token
    spotifyApi.setAccessToken(accessToken);
    
    // Test if token is valid by making a simple API call
    try {
      await spotifyApi.getMe();
      return accessToken;
    } catch (authError: unknown) {
      // Token might be expired, try to refresh
      console.log('⚠️ Token validation failed:', authError instanceof Error ? authError.message : 'Unknown error');
      if (refreshToken) {
        console.log('🔄 Access token expired, refreshing...');
        spotifyApi.setRefreshToken(refreshToken);
        const data = await spotifyApi.refreshAccessToken();
        
        const newAccessToken = data.body.access_token;
        spotifyApi.setAccessToken(newAccessToken);
        
        return newAccessToken;
      }
      
      throw new Error('Access token expired and no refresh token available');
    }
  } catch (error: unknown) {
    console.error('❌ Error getting user Spotify token:', error);
    throw error;
  }
};