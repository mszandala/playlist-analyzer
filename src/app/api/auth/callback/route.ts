import { NextRequest, NextResponse } from 'next/server';
import { spotifyApi } from '@/lib/spotify';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error) {
      console.error('❌ Spotify authorization error:', error);
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}?error=access_denied`);
    }

    if (!code) {
      console.error('❌ No authorization code received');
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}?error=no_code`);
    }

    // Set the redirect URI (must match the one used in login)
    const redirectUri = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/auth/callback`;
    spotifyApi.setRedirectURI(redirectUri);

    // Exchange authorization code for access token
    console.log('🔄 Exchanging authorization code for access token...');
    const data = await spotifyApi.authorizationCodeGrant(code);
    
    const { access_token, refresh_token, expires_in } = data.body;
    
    console.log('✅ Access token received, expires in:', expires_in, 'seconds');
    
    // Create response with redirect to home page
    const response = NextResponse.redirect(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}?auth=success`);
    
    // Set secure HTTP-only cookies for tokens
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      path: '/',
    };
    
    response.cookies.set('spotify_access_token', access_token, {
      ...cookieOptions,
      maxAge: expires_in,
    });
    
    if (refresh_token) {
      response.cookies.set('spotify_refresh_token', refresh_token, {
        ...cookieOptions,
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });
    }
    
    return response;
    
  } catch (error: unknown) {
    console.error('❌ Error in auth callback:', error);
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}?error=auth_failed`);
  }
}