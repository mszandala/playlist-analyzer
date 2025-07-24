import { AnalysisResult } from '@/types/analysis.types';
import { AnalysisData } from '@/types/dashboard.types';

export function convertAnalysisResult(result: AnalysisResult): AnalysisData {
    // Dane znajdują się w result.insights, nie bezpośrednio w result
    const insights = result.insights;
    const statistics = result.statistics;

    // Bezpieczne pobranie danych z insights
    const genreDistribution = insights?.genreDistribution || [];
    const artistDistribution = insights?.artistDistribution || [];

    // Znajdź najpopularniejszego artystę (pierwszego z listy)
    const topArtist = artistDistribution.length > 0 ? artistDistribution[0] : null;


    return {
        stats: {
            totalTracks: statistics.totalTracks || 0,
            totalDuration: statistics.totalDuration || 0,
            averagePopularity: statistics.averagePopularity || 0,
            topGenre: statistics.mostCommonGenre || 'Nieznany',
            topArtist: artistDistribution[0]?.name || 'Brak danych',
            uniqueArtists: statistics.uniqueArtists || 0,
        },
        mood: {
            // Ponieważ API już nie zwraca danych o nastroju, używamy wartości domyślnych
            energetic: 0.5,
            danceable: 0.5,
            calm: 0.5,
            happy: 0.5,
            sad: 0.5,
        },
        topArtists: artistDistribution.map((artist) => ({
            name: artist.name || 'Nieznany artysta',
            tracks: artist.trackCount || 0,
            popularity: 0, // Brak danych o popularności artysty w obecnym API
            image: undefined, // Brak zdjęć artystów w obecnym API
        })),
        genres: genreDistribution.map((genre) => ({
            name: genre.genre || 'Nieznany gatunek',
            count: genre.count || 0,
        })),
        yearDistribution: Array.isArray(statistics.yearDistribution)
            ? statistics.yearDistribution.map((year) => ({
                year: year.year || 0,
                count: year.count || 0,
            }))
            : [],
        tracks: result.tracks.map((track: { duration_ms: any; }) => ({
            duration_ms: track.duration_ms,
            // inne właściwości jeśli potrzebne
        })),
    };
}