import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getPlaylistWithFeatures, ensureValidToken } from '@/lib/spotify';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('spotify_access_token')?.value;
    const refreshToken = cookieStore.get('spotify_refresh_token')?.value;
    const expiresAt = cookieStore.get('spotify_token_expires_at')?.value;
    
    if (!accessToken || !refreshToken || !expiresAt) {
      return NextResponse.json(
        { error: 'Brak autoryzacji. Zaloguj się ponownie.' },
        { status: 401 }
      );
    }

    // Sprawdź i odśwież token jeśli potrzeba
    const tokens = await ensureValidToken(
      accessToken,
      refreshToken,
      parseInt(expiresAt)
    );

    // Pobierz dane playlisty
    const playlistData = await getPlaylistWithFeatures(params.id, tokens.accessToken);
    
    const response = NextResponse.json(playlistData);
    
    // Update cookies if tokens were refreshed
    if (tokens.accessToken !== accessToken) {
      response.cookies.set('spotify_access_token', tokens.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 // 1 hour
      });
      response.cookies.set('spotify_token_expires_at', tokens.expiresAt.toString(), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 // 1 hour
      });
    }
    
    return response;
  } catch (error: any) {
    console.error('Error fetching playlist:', error);
    
    if (error.message.includes('Session expired')) {
      return NextResponse.json(
        { error: 'Sesja wygasła. Zaloguj się ponownie.' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { error: 'Nie udało się pobrać playlisty' },
      { status: 500 }
    );
  }
}