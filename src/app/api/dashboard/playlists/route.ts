// src/app/dashboard/playlists/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('spotify_access_token')?.value;
    
    if (!accessToken) {
      return NextResponse.json(
        { error: 'Nie jesteś zalogowany' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const offset = parseInt(searchParams.get('offset') || '0');
    const limit = parseInt(searchParams.get('limit') || '50');

    console.log(`Fetching playlists: offset=${offset}, limit=${limit}`);

    const spotifyResponse = await fetch(
      `https://api.spotify.com/v1/me/playlists?offset=${offset}&limit=${limit}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!spotifyResponse.ok) {
      console.error('Spotify API error:', spotifyResponse.status, spotifyResponse.statusText);
      
      if (spotifyResponse.status === 401) {
        return NextResponse.json(
          { error: 'Token wygasł' },
          { status: 401 }
        );
      }
      
      const errorText = await spotifyResponse.text();
      console.error('Spotify API error details:', errorText);
      
      return NextResponse.json(
        { error: `Błąd Spotify API: ${spotifyResponse.status}` },
        { status: spotifyResponse.status }
      );
    }

    const data = await spotifyResponse.json();
    
    console.log(`Successfully fetched ${data.items.length} playlists`);
    
    return NextResponse.json({
      playlists: data.items,
      total: data.total,
      hasMore: data.next !== null,
    });

  } catch (error) {
    console.error('Error fetching playlists:', error);
    return NextResponse.json(
      { error: 'Błąd podczas pobierania playlist' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('spotify_access_token')?.value;
    
    if (!accessToken) {
      return NextResponse.json(
        { error: 'Nie jesteś zalogowany' },
        { status: 401 }
      );
    }

    const { searchQuery } = await request.json();
    
    console.log(`Searching playlists with query: "${searchQuery}"`);

    // Pobierz wszystkie playlisty użytkownika
    const spotifyResponse = await fetch(
      `https://api.spotify.com/v1/me/playlists?limit=50`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!spotifyResponse.ok) {
      console.error('Spotify API error:', spotifyResponse.status, spotifyResponse.statusText);
      
      if (spotifyResponse.status === 401) {
        return NextResponse.json(
          { error: 'Token wygasł' },
          { status: 401 }
        );
      }
      
      return NextResponse.json(
        { error: `Błąd Spotify API: ${spotifyResponse.status}` },
        { status: spotifyResponse.status }
      );
    }

    const data = await spotifyResponse.json();
    
    // Jeśli brak zapytania wyszukiwania, zwróć wszystkie playlisty
    if (!searchQuery || searchQuery.trim() === '') {
      console.log(`Returning all ${data.items.length} playlists`);
      return NextResponse.json({ 
        playlists: data.items,
        total: data.total,
        hasMore: data.next !== null
      });
    }

    // Filtruj playlisty lokalnie
    const filteredPlaylists = data.items.filter((playlist: any) => {
      const matchesName = playlist.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDescription = playlist.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesOwner = playlist.owner.display_name?.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesName || matchesDescription || matchesOwner;
    });
    
    console.log(`Found ${filteredPlaylists.length} playlists matching "${searchQuery}"`);
    
    return NextResponse.json({ 
      playlists: filteredPlaylists,
      total: filteredPlaylists.length,
      hasMore: false
    });

  } catch (error) {
    console.error('Error searching playlists:', error);
    return NextResponse.json(
      { error: 'Błąd podczas wyszukiwania playlist' },
      { status: 500 }
    );
  }
}