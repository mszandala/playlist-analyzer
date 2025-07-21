import { AnalysisResult } from '@/types/analysis.types';
import { AnalysisData } from '@/types/dashboard.types';

export function convertAnalysisResult(result: AnalysisResult): AnalysisData {
    return {
        stats: {
            totalTracks: result.statistics.totalTracks,
            totalDuration: result.statistics.totalDuration,
            averagePopularity: result.statistics.averagePopularity,
            topGenre: result.statistics.mostCommonGenre,
            topArtist: result.topArtists[0]?.name || '',
        },
        mood: {
            energetic: result.moodAnalysis.energetic,
            danceable: result.moodAnalysis.danceable,
            calm: result.moodAnalysis.calm,
            happy: result.moodAnalysis.happy,
            sad: result.moodAnalysis.sad,
        },
        topArtists: result.topArtists.map(a => ({
            name: a.name,
            tracks: a.trackCount,
            popularity: a.popularity,
            image: a.image,
        })),
        genres: result.genreDistribution.map(g => ({
            name: g.genre,
            count: g.count,
        })),
    };
}