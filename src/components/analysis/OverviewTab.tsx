import React from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Tooltip, Legend } from 'chart.js';
import { AnalysisData } from '@/types/dashboard.types';

Chart.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Tooltip, Legend, ArcElement);

interface OverviewTabProps {
    analysis: AnalysisData;
}

export function OverviewTab({ analysis }: OverviewTabProps) {


    function formatDuration(ms: number) {
        const totalSeconds = Math.round(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes} min ${seconds} sek`;
    }
    // Oblicz sumę wszystkich utworów
    const total = analysis.genres.reduce((sum, g) => sum + g.count, 0);

    // Podziel gatunki na te powyżej 1% i resztę
    const mainGenres = [];
    let otherCount = 0;
    for (const g of analysis.genres) {
        if (total > 0 && g.count / total > 0.01) {
            mainGenres.push(g);
        } else {
            otherCount += g.count;
        }
    }

    // Dodaj kategorię "Inne" jeśli są jakieś rzadkie gatunki
    if (otherCount > 0) {
        mainGenres.push({ name: "Inne", count: otherCount });
    }

    // Kolory dla głównych gatunków
    const baseColors = ['#1db954', '#ff6384', '#36a2eb', '#ffce56', '#a259a2', '#f39c12', '#e74c3c', '#8e44ad', '#16a085'];
    const genreColors = mainGenres.map((g, i) =>
        g.name === "Inne" ? "#737373ff" : baseColors[i % baseColors.length]
    );

    const genreData = {
        labels: mainGenres.map(g => g.name),
        datasets: [{
            label: 'Gatunki',
            data: mainGenres.map(g => g.count),
            backgroundColor: genreColors,
        }]
    };


    const artistData = {
        labels: analysis.topArtists.map(a => a.name),
        datasets: [{
            label: 'Top artyści',
            data: analysis.topArtists.map(a => a.tracks),
            backgroundColor: '#36a2eb',
        }]
    };

    // Przykład rozkładu lat wydania (musisz mieć te dane w analysis)
    const yearDistribution = {
        labels: analysis.yearDistribution.map(y => y.year),
        datasets: [{
            label: 'Utwory wg roku',
            data: analysis.yearDistribution.map(y => y.count),
            backgroundColor: '#1db954',
        }]
    };

    // Oblicz medianę czasu trwania utworów
    let medianDuration = null;
    const tracks = analysis.tracks || [];
    if (Array.isArray(tracks) && tracks.length > 0) {
        const durations = tracks
            .map(track => track.duration_ms)
            .filter(ms => typeof ms === 'number' && !isNaN(ms));
        if (durations.length > 0) {
            const sorted = durations.sort((a, b) => a - b);
            const mid = Math.floor(sorted.length / 2);
            medianDuration = sorted.length % 2 !== 0
                ? sorted[mid]
                : (sorted[mid - 1] + sorted[mid]) / 2;
        }
    }

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Podstawowe informacje</h2>
            <div className="space-y-8">
                <div className="grid grid-cols-2 gap-6">
                    <div className="bg-gray-800 rounded-xl p-6 text-white">
                        <h3 className="font-bold text-lg mb-2">Całkowity czas trwania</h3>
                        <p className="text-3xl">
                            {(() => {
                                const totalMinutes = Math.round(analysis.stats.totalDuration / 1000 / 60);
                                if (totalMinutes >= 60) {
                                    const hours = Math.floor(totalMinutes / 60);
                                    const minutes = totalMinutes % 60;
                                    return `${hours} godz. ${minutes} min`;
                                }
                                return `${totalMinutes} min`;
                            })()}
                        </p>
                    </div>
                    <div className="bg-gray-800 rounded-xl p-6 text-white">
                        <h3 className="font-bold text-lg mb-2">Liczba utworów</h3>
                        <p className="text-3xl">{analysis.stats.totalTracks}</p>
                    </div>
                    <div className="bg-gray-800 rounded-xl p-6 text-white">
                        <h3 className="font-bold text-lg mb-2">Średni czas utworu</h3>
                        <p className="text-3xl">
                            {isFinite(analysis.stats.totalDuration / analysis.stats.totalTracks)
                                ? formatDuration(analysis.stats.totalDuration / analysis.stats.totalTracks)
                                : 'Brak danych'}
                        </p>
                    </div>
                    <div className="bg-gray-800 rounded-xl p-6 text-white">
                        <h3 className="font-bold text-lg mb-2">Mediana czasu utworu</h3>
                        <p className="text-3xl">
                            {medianDuration !== null
                                ? formatDuration(medianDuration)
                                : 'Brak danych'}
                        </p>
                    </div>
                    <div className="bg-gray-800 rounded-xl p-6 text-white">
                        <h3 className="font-bold text-lg mb-2">Unikalni artyści</h3>
                        <p className="text-3xl">{analysis.stats.uniqueArtists}</p>
                    </div>
                    <div className="bg-gray-800 rounded-xl p-6 text-white">
                        <h3 className="font-bold text-lg mb-2">Najpopularniejszy gatunek</h3>
                        <p className="text-3xl">
                            {mainGenres.length > 0
                                ? (() => {
                                    const filtered = mainGenres.filter(g => g.name !== "Inne");
                                    if (filtered.length === 0) return "Brak danych";
                                    const max = Math.max(...filtered.map(g => g.count));
                                    return filtered
                                        .filter(g => g.count === max)
                                        .map(g => g.name)
                                        .join(", ");
                                })()
                                : "Brak danych"}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h4 className="font-semibold mb-2">Rozkład lat wydania</h4>
                        <Bar data={yearDistribution} />
                    </div>
                    <div>
                        <h4 className="font-semibold mb-2">Top artyści</h4>
                        <Bar data={artistData} />
                        <div>
                            <h4 className="font-semibold mb-2">Rozkład gatunków</h4>
                            <Pie data={genreData} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}