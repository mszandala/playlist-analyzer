import { NextResponse } from 'next/server';
import { exchangeCodeForTokens } from '@/lib/spotify';
import type { AuthTokens } from '@/types/spotify.types';

export async function POST(request: Request) {
  try {
    const { code } = await request.json();
    
    if (!code) {
      return NextResponse.json({ error: 'No authorization code' }, { status: 400 });
    }

    const tokens: AuthTokens = await exchangeCodeForTokens(code);
    
    const response = NextResponse.json({ success: true });
    
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      path: '/'
    };

    response.cookies.set('spotify_access_token', tokens.accessToken, {
      ...cookieOptions,
      maxAge: tokens.expiresIn
    });
    
    response.cookies.set('spotify_refresh_token', tokens.refreshToken, {
      ...cookieOptions,
      maxAge: 30 * 24 * 60 * 60
    });

    response.cookies.set('spotify_token_expires_at', 
      (Date.now() + tokens.expiresIn * 1000).toString(), {
      ...cookieOptions,
      maxAge: tokens.expiresIn
    });
    
    return response;
  } catch (error) {
    console.error('Error during token exchange:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}