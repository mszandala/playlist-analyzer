import { NextResponse } from 'next/server';
import { spotifyApi } from '@/lib/spotify';
import { getUserSpotifyToken } from '@/lib/spotify-server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log('🎵 API called for playlist:', id);
    
    // Get user token instead of client credentials
    try {
      await getUserSpotifyToken();
      console.log('✅ User token obtained');
    } catch (error) {
      console.error('❌ Failed to get user token:', error);
      return NextResponse.json(
        { error: 'Authentication required', details: 'Please log in with Spotify first' },
        { status: 401 }
      );
    }
    
    // Test: sprawdź czy API w ogóle działa
    try {
      const me = await spotifyApi.getMe();
      console.log('✅ API connection works, user:', me.body.display_name);
    } catch (testError: unknown) {
      console.log('⚠️ getMe() failed:', testError instanceof Error ? testError.message : 'Unknown error');
    }
    
    // Pobierz playlist
    const playlist = await spotifyApi.getPlaylist(id);
    console.log('✅ Playlist fetched:', playlist.body.name);
    
    return NextResponse.json(playlist.body);
  } catch (error: unknown) {
    console.error('❌ API Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    // Check if it's an authentication error
    if (errorMessage.includes('token') || errorMessage.includes('auth')) {
      return NextResponse.json(
        { error: 'Authentication required', details: 'Please log in with Spotify first' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch playlist', details: errorMessage },
      { status: 500 }
    );
  }
}