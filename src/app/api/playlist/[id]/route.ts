import { NextResponse } from 'next/server';
import { getSpotifyToken, spotifyApi } from '@/lib/spotify';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log('🎵 API called for playlist:', id);
    
    // Pobierz token
    await getSpotifyToken();
    
    // Test: sprawdź czy API w ogóle działa
    try {
      const me = await spotifyApi.getMe();
      console.log('✅ API connection works, user:', me.body);
    } catch (testError: any) {
      console.log('⚠️ getMe() failed:', testError.message);
    }
    
    // Pobierz playlist
    const playlist = await spotifyApi.getPlaylist(id);
    console.log('✅ Playlist fetched:', playlist.body.name);
    
    return NextResponse.json(playlist.body);
  } catch (error: any) {
    console.error('❌ API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch playlist', details: error.message },
      { status: 500 }
    );
  }
}