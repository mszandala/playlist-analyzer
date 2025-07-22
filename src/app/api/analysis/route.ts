import { NextRequest, NextResponse } from 'next/server';
import { getAnalysisForPlaylists } from '@/lib/analysis';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get('spotify_access_token')?.value;
        console.log('[ANALYSIS API] accessToken:', accessToken);

        if (!accessToken) {
            return NextResponse.json({ error: 'Brak tokena Spotify' }, { status: 401 });
        }

        const { playlistIds, options } = await request.json();

        if (!playlistIds || !Array.isArray(playlistIds) || playlistIds.length === 0) {
            return NextResponse.json({ error: 'Brak playlist do analizy' }, { status: 400 });
        }

        // Tu wywołujesz własną logikę analizy playlist
        const analysisResult = await getAnalysisForPlaylists(playlistIds, options, accessToken);

        return NextResponse.json(analysisResult);
    } catch (error) {
        console.error('Błąd analizy playlist:', error);
        let message = 'Nieznany błąd';
        if (typeof error === 'object' && error !== null && 'message' in error) {
            message = (error as { message: string }).message;
        } else {
            message = String(error);
        }
        return NextResponse.json(
            { error: 'Błąd serwera analizy', message },
            { status: 500 }
        );
    }
}