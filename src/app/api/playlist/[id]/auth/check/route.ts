import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = cookies();
  const accessToken = cookieStore.get('spotify_access_token');
  
  if (!accessToken) {
    return new NextResponse(null, { status: 401 });
  }
  
  return new NextResponse(null, { status: 200 });
}