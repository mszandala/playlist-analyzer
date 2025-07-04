import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import type { PlaylistData } from '@/types/spotify.types';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('spotify_access_token');

    if (!accessToken?.value) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    return NextResponse.json({ authenticated: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Auth check failed' }, { status: 500 });
  }
}