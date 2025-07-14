import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {

  const cookieStore = await cookies();
  const accessToken = cookieStore.get('spotify_access_token');
    

  if (!accessToken) {
    // Brak tokena = brak autoryzacji
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const res = await fetch('https://api.spotify.com/v1/me', {
    headers: {
      Authorization: `Bearer ${accessToken.value}`,
    },
  });

  if (!res.ok) {
    // Coś poszło nie tak z API Spotify
    return NextResponse.json({ error: 'Failed to fetch user data' }, { status: 500 });
  }

  const data = await res.json();

  return NextResponse.json({
    id: data.id,
    name: data.display_name,
    email: data.email,
    image: data.images?.[0]?.url ?? '',
    spotifyId: data.id,
    accessToken: accessToken.value,
  });
}