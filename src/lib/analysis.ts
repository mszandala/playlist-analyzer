import { getPlaylistWithFeatures, getTracksAudioFeatures } from './spotify';
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
        track.genres?.forEach((genre: string) => {
            genreMap.set(genre, (genreMap.get(genre) || 0) + 1);
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

    let audioFeaturesMap;
    try {
        audioFeaturesMap = await getTracksAudioFeatures(allTracks, accessToken);
        console.log('[getAnalysisForPlaylists] audioFeaturesMap size', audioFeaturesMap.size);
    } catch (err: any) {
        if (err.statusCode === 403) {
            console.error('Brak uprawnień do pobrania audio features. Użytkownik musi się zalogować ponownie.');
        }
        throw err;
    }

    // Statystyki
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
    //const topArtists = countArtists(allTracks);

    // Mood (przykład: średnia energy, danceability itd.)
    // const moodAnalysis = {
    //     energetic: average(audioFeaturesMap, 'energy'),
    //     danceable: average(audioFeaturesMap, 'danceability'),
    //     calm: average(audioFeaturesMap, 'acousticness'),
    //     happy: average(audioFeaturesMap, 'valence'),
    //     sad: 1 - average(audioFeaturesMap, 'valence'),
    // };

    // const years = yearDistribution(allTracks);
    // const topTracksList = topTracks(allTracks);

    console.log('[getAnalysisForPlaylists] genreDistribution', genreDistribution);

    return {
        playlistIds,
        statistics: {
            totalTracks,
            totalDuration,
            averagePopularity,
            mostCommonGenre: genreDistribution[0]?.genre || '',
            uniqueAlbums,
            avgTrackDuration,
            uniqueArtists,
        },
        //topArtists,
        //topTracks: topTracksList, // Możesz dodać analogicznie
        //moodAnalysis,
        //genreDistribution,
        //audioFeaturesAnalysis: {}, // Możesz dodać szczegóły
        //yearDistribution: years,
        //comparisons: [],
        //generatedAt: new Date(),
    };
}

// Pomocnicza funkcja do liczenia średniej
function average(featuresMap: Map<string, any>, key: string) {
    const values = Array.from(featuresMap.values()).map(f => f[key]).filter(v => typeof v === 'number');
    if (!values.length) return 0;
    return values.reduce((a, b) => a + b, 0) / values.length;
}