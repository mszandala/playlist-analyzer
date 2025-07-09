import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    const response = NextResponse.json({ success: true });

    const cookieOptions = {
      path: '/',
      maxAge: 0,
    };

    response.cookies.set('spotify_access_token', '', cookieOptions);
    response.cookies.set('spotify_refresh_token', '', cookieOptions);
    response.cookies.set('spotify_token_expires_at', '', cookieOptions);

    return response;
  } catch (error) {
    console.error('Error during logout:', error);
    return NextResponse.json({ error: 'Logout failed' }, { status: 500 });
  }
}