import { NextResponse } from 'next/server';
import { exchangeCodeForTokens } from '@/lib/spotify';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { code } = await request.json();
    
    if (!code) {
      return NextResponse.json({ error: 'No authorization code' }, { status: 400 });
    }

    const tokens = await exchangeCodeForTokens(code);
    
    // Utwórz odpowiedź z tokenami w ciasteczkach
    const response = NextResponse.json({ success: true });
    
    // Ustaw ciasteczka z tokenami
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
      maxAge: 30 * 24 * 60 * 60 // 30 dni
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