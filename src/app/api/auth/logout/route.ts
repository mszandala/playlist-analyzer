import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    const cookieStore = await cookies();
    
    // Clear all Spotify-related cookies
    const response = NextResponse.json({ success: true }, { status: 200 });
    
    response.cookies.delete('spotify_access_token');
    response.cookies.delete('spotify_refresh_token');
    response.cookies.delete('spotify_token_expires_at');
    
    return response;
  } catch (error) {
    console.error('Error during logout:', error);
    return NextResponse.json({ error: 'Logout failed' }, { status: 500 });
  }
}