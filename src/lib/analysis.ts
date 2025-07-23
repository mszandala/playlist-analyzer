
import { getPlaylistWithFeatures } from './spotify';
import type { AnalysisResult } from '@/types/analysis.types';
import type { SpotifyTrack } from '@/types/spotify.types';

// Liczba unikalnych albumów
function countUniqueAlbums(tracks: any[]): number {
    const albumSet = new Set<string>();
    tracks.forEach(track => {
        if (track.album?.id) albumSet.add(track.album.id);
    });
    return albumSet.size;
}

// Liczba unikalnych artystów
function countUniqueArtists(tracks: any[]): number {
    const artistSet = new Set<string>();
    tracks.forEach(track => {
        track.artists?.forEach((artist: any) => {
            artistSet.add(artist.id || artist.name);
        });
    });
    return artistSet.size;
}

// Średni czas trwania utworu (w sekundach)
function averageTrackDuration(tracks: any[]): number {
    if (!tracks.length) return 0;
    const totalDuration = tracks.reduce((sum, t) => sum + (t.duration_ms || 0), 0);
    return Math.round(totalDuration / tracks.length / 1000);
}

// Rozkład lat wydania
function yearDistribution(tracks: any[]): { year: number, count: number }[] {
    const yearMap = new Map<number, number>();
    tracks.forEach(track => {
        const year = parseInt(track.album?.release_date?.slice(0, 4));
        if (year) yearMap.set(year, (yearMap.get(year) || 0) + 1);
    });
    return Array.from(yearMap.entries())
        .map(([year, count]) => ({ year, count }))
        .sort((a, b) => a.year - b.year);
}

// Najpopularniejsze utwory
function topTracks(tracks: any[], limit: number = 10) {
    return tracks
        .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
        .slice(0, limit)
        .map(track => ({
            name: track.name,
            artists: track.artists?.map((a: any) => a.name).join(', '),
            popularity: track.popularity,
            duration_ms: track.duration_ms,
            album: track.album?.name,
            id: track.id
        }));
}

function countGenres(tracks: any[]) {
    const genreMap = new Map<string, number>();
    tracks.forEach(track => {
        // Pobieramy gatunki z artystów (jeśli są dostępne)
        track.artists?.forEach((artist: any) => {
            artist.genres?.forEach((genre: string) => {
                genreMap.set(genre, (genreMap.get(genre) || 0) + 1);
            });
        });
    });
    return Array.from(genreMap.entries()).map(([genre, count]) => ({ genre, count }));
}

function countArtists(tracks: any[]) {
    const artistMap = new Map<string, number>();
    tracks.forEach(track => {
        track.artists?.forEach((artist: any) => {
            artistMap.set(artist.name, (artistMap.get(artist.name) || 0) + 1);
        });
    });
    return Array.from(artistMap.entries())
        .map(([name, count]) => ({ name, trackCount: count }))
        .sort((a, b) => b.trackCount - a.trackCount);
}

// Analiza na podstawie popularności utworów (zamiast audio features)
function getPopularityInsights(tracks: any[]) {
    if (!tracks.length) return {
        averagePopularity: 0,
        popularityDistribution: [],
        trendingTracks: [],
        vintageTracks: []
    };

    const totalPopularity = tracks.reduce((sum, track) => sum + (track.popularity || 0), 0);
    const averagePopularity = totalPopularity / tracks.length;

    // Rozkład popularności
    const popularityRanges = [
        { range: '0-20', min: 0, max: 20, count: 0 },
        { range: '21-40', min: 21, max: 40, count: 0 },
        { range: '41-60', min: 41, max: 60, count: 0 },
        { range: '61-80', min: 61, max: 80, count: 0 },
        { range: '81-100', min: 81, max: 100, count: 0 }
    ];

    tracks.forEach(track => {
        const popularity = track.popularity || 0;
        const range = popularityRanges.find(r => popularity >= r.min && popularity <= r.max);
        if (range) range.count++;
    });

    // Trending tracks (wysokiej popularności)
    const trendingTracks = tracks
        .filter(track => (track.popularity || 0) >= 70)
        .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
        .slice(0, 10);

    // Vintage tracks (niskiej popularności ale potencjalnie starsze)
    const vintageTracks = tracks
        .filter(track => (track.popularity || 0) <= 30)
        .sort((a, b) => {
            const yearA = parseInt(a.album?.release_date?.slice(0, 4) || '0');
            const yearB = parseInt(b.album?.release_date?.slice(0, 4) || '0');
            return yearA - yearB;
        })
        .slice(0, 10);

    return {
        averagePopularity,
        popularityDistribution: popularityRanges,
        trendingTracks,
        vintageTracks
    };
}

export async function getAnalysisForPlaylists(
    playlistIds: string[],
    options: any = {},
    accessToken: string
): Promise<AnalysisResult> {
    console.log('getAnalysisForPlaylists: playlistIds', playlistIds);
    console.log('getAnalysisForPlaylists: accessToken', !!accessToken);

    let playlistsData;
    try {
        playlistsData = await Promise.all(
            playlistIds.map(id => getPlaylistWithFeatures(id, accessToken))
        );
        console.log('[getAnalysisForPlaylists] playlistsData', playlistsData);
    } catch (err) {
        console.error('[getAnalysisForPlaylists] Error fetching playlists:', err);
        throw err;
    }

    let allTracks;
    try {
        allTracks = playlistsData
            .flatMap(pl => pl.tracks.map(t => t.track))
            .filter((track): track is SpotifyTrack => track !== null && track !== undefined);
        console.log('[getAnalysisForPlaylists] allTracks', allTracks.length);
    } catch (err) {
        console.error('[getAnalysisForPlaylists] Error processing tracks:', err);
        throw err;
    }

    // USUNIĘTO: pobieranie audio features - to powoduje błąd 403
    console.log('[getAnalysisForPlaylists] Skipping audio features due to API deprecation');

    // Statystyki podstawowe
    const totalTracks = allTracks.length;
    const totalDuration = allTracks.reduce((sum, t) => sum + (t.duration_ms || 0), 0);
    const averagePopularity = allTracks.length
        ? Math.round(allTracks.reduce((sum, t) => sum + (t.popularity || 0), 0) / allTracks.length)
        : 0;
    const uniqueAlbums = countUniqueAlbums(allTracks);
    const uniqueArtists = countUniqueArtists(allTracks);
    const avgTrackDuration = averageTrackDuration(allTracks);

    // Gatunki i artyści
    const genreDistribution = countGenres(allTracks);
    const artistDistribution = countArtists(allTracks);

    // Rozkład lat
    const yearsDistribution = yearDistribution(allTracks);

    // Najpopularniejsze utwory
    const topTracksList = topTracks(allTracks, 10);

    // Insights na podstawie popularności
    const popularityInsights = getPopularityInsights(allTracks);

    console.log('[getAnalysisForPlaylists] Analysis completed');


    return {
        playlistIds,
        statistics: {
            yearDistribution: yearsDistribution,
            totalTracks,
            totalDuration,
            averagePopularity,
            mostCommonGenre: genreDistribution[0]?.genre || 'Nieznany',
            uniqueAlbums,
            avgTrackDuration,
            uniqueArtists,
        },
        insights: {
            genreDistribution,
            artistDistribution: artistDistribution.slice(0, 20),
            yearsDistribution,
            topTracks: topTracksList,
            popularityInsights
        }
    };
}