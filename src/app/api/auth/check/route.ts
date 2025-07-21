import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const cookieStore = await cookies(); // dostęp do ciasteczek
    const accessToken = cookieStore.get('spotify_access_token'); // próbujemy wyciągnąć token
    
    if (!accessToken) {
      // Brak tokena – użytkownik niezalogowany
      return NextResponse.json({authenticated: false});
    }

    // Sprawdź czy token jest ważny
    const response = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: `Bearer ${accessToken.value}`,
      },
    });

    if (!response.ok) {
      // Token był, ale np. wygasł albo nie działa
      return NextResponse.json({authenticated: false});
    }

    // Parsowanie danych użytkownika
    const userData = await response.json();
    
    // Sukces – użytkownik zalogowany
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
    return NextResponse.json({authenticated: false});
  }
}