import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('spotify_access_token');
    
    if (!accessToken) {
      return NextResponse.json({ 
        authenticated: false 
      });
    }

    // Sprawdź czy token jest ważny
    const response = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: `Bearer ${accessToken.value}`,
      },
    });

    if (!response.ok) {
      return NextResponse.json({ 
        authenticated: false 
      });
    }

    const userData = await response.json();
    
    return NextResponse.json({
      authenticated: true,
      user: {
        id: userData.id,
        name: userData.display_name,
        email: userData.email,
        image: userData.images?.[0]?.url ?? '',
        spotifyId: userData.id,
      }
    });
  } catch (error) {
    console.error('Error checking auth:', error);
    return NextResponse.json({ 
      authenticated: false 
    });
  }
}