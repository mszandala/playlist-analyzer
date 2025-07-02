import { NextResponse } from 'next/server';
import { createUserSpotifyApi } from '@/lib/spotify';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Pobierz token z ciasteczka
    const accessToken = request.cookies.get('spotify_access_token')?.value;
    const refreshToken = request.cookies.get('spotify_refresh_token')?.value;
    
    if (!accessToken || !refreshToken) {
      return NextResponse.json(
        { error: 'Unauthorized - please log in' },
        { status: 401 }
      );
    }

    // Stwórz instancję API z tokenem użytkownika
    const spotifyApi = createUserSpotifyApi(accessToken, refreshToken);
    
    // Pobierz playlist
    const playlist = await spotifyApi.getPlaylist(id);
    
    return NextResponse.json(playlist.body);
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch playlist', details: error.message },
      { status: 500 }
    );
  }
}