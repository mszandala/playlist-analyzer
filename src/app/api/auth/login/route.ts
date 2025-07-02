import { NextResponse } from 'next/server';
import { spotifyApi } from '@/lib/spotify';

export async function GET() {
  try {
    // Define the scopes we need
    const scopes = [
      'playlist-read-private',
      'playlist-read-collaborative', 
      'user-read-private'
    ];

    // Set the redirect URI
    const redirectUri = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/auth/callback`;
    spotifyApi.setRedirectURI(redirectUri);

    // Create the authorization URL
    const authorizeURL = spotifyApi.createAuthorizeURL(scopes, 'state');
    
    console.log('🔐 Redirecting to Spotify authorization:', authorizeURL);
    
    // Redirect to Spotify authorization
    return NextResponse.redirect(authorizeURL);
    
  } catch (error: unknown) {
    console.error('❌ Error creating authorization URL:', error);
    return NextResponse.json(
      { error: 'Failed to create authorization URL' },
      { status: 500 }
    );
  }
}