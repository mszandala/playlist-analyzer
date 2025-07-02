import { NextRequest, NextResponse } from 'next/server';
import { spotifyApi } from '@/lib/spotify';

export async function GET(request: NextRequest) {
  try {
    const accessToken = request.cookies.get('spotify_access_token')?.value;
    const refreshToken = request.cookies.get('spotify_refresh_token')?.value;

    if (!accessToken) {
      return NextResponse.json({ authenticated: false });
    }

    // Set the access token and try to get user info
    spotifyApi.setAccessToken(accessToken);
    
    try {
      const me = await spotifyApi.getMe();
      return NextResponse.json({
        authenticated: true,
        user: {
          id: me.body.id,
          display_name: me.body.display_name,
          email: me.body.email,
          images: me.body.images,
          country: me.body.country,
          followers: me.body.followers,
        }
      });
    } catch (tokenError: unknown) {
      // Token might be expired, try to refresh if we have a refresh token
      console.log('⚠️ Token validation failed:', tokenError instanceof Error ? tokenError.message : 'Unknown error');
      if (refreshToken) {
        try {
          console.log('🔄 Access token expired, attempting refresh...');
          spotifyApi.setRefreshToken(refreshToken);
          const data = await spotifyApi.refreshAccessToken();
          
          const newAccessToken = data.body.access_token;
          const expiresIn = data.body.expires_in;
          
          spotifyApi.setAccessToken(newAccessToken);
          
          // Get user info with new token
          const me = await spotifyApi.getMe();
          
          // Create response with updated token
          const response = NextResponse.json({
            authenticated: true,
            user: {
              id: me.body.id,
              display_name: me.body.display_name,
              email: me.body.email,
              images: me.body.images,
              country: me.body.country,
              followers: me.body.followers,
            }
          });
          
          // Update the access token cookie
          response.cookies.set('spotify_access_token', newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: expiresIn,
          });
          
          return response;
          
        } catch (refreshError) {
          console.error('❌ Token refresh failed:', refreshError);
          
          // Clear invalid tokens
          const response = NextResponse.json({ authenticated: false });
          response.cookies.delete('spotify_access_token');
          response.cookies.delete('spotify_refresh_token');
          return response;
        }
      }
      
      return NextResponse.json({ authenticated: false });
    }
    
  } catch (error: unknown) {
    console.error('❌ Error checking user authentication:', error);
    return NextResponse.json({ authenticated: false });
  }
}

export async function DELETE() {
  // Logout endpoint - clear cookies
  const response = NextResponse.json({ success: true });
  response.cookies.delete('spotify_access_token');
  response.cookies.delete('spotify_refresh_token');
  return response;
}