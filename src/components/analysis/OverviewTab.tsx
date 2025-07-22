import React from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Tooltip, Legend } from 'chart.js';
import { AnalysisData } from '@/types/dashboard.types';

Chart.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Tooltip, Legend, ArcElement);

interface OverviewTabProps {
    analysis: AnalysisData;
}

export function OverviewTab({ analysis }: OverviewTabProps) {
    // Przykładowe dane do wykresów
    const genreData = {
        labels: analysis.genres.map(g => g.name),
        datasets: [{
            label: 'Gatunki',
            data: analysis.genres.map(g => g.count),
            backgroundColor: ['#1db954', '#ff6384', '#36a2eb', '#ffce56', '#a259a2'],
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

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-2 gap-6">
                <div className="bg-gray-800 rounded-xl p-6 text-white">
                    <h3 className="font-bold text-lg mb-2">Całkowity czas trwania</h3>
                    <p className="text-3xl">{Math.round(analysis.stats.totalDuration / 1000 / 60)} min</p>
                </div>
                <div className="bg-gray-800 rounded-xl p-6 text-white">
                    <h3 className="font-bold text-lg mb-2">Unikalni artyści</h3>
                    <p className="text-3xl">{analysis.stats.uniqueArtists}</p>
                </div>
                <div className="bg-gray-800 rounded-xl p-6 text-white">
                    <h3 className="font-bold text-lg mb-2">Średni czas utworu</h3>
                    <p className="text-3xl">{Math.round(analysis.stats.totalDuration / analysis.stats.totalTracks / 1000)} sek</p>
                </div>
                <div className="bg-gray-800 rounded-xl p-6 text-white">
                    <h3 className="font-bold text-lg mb-2">Najpopularniejszy gatunek</h3>
                    <p className="text-3xl">{analysis.stats.topGenre}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h4 className="font-semibold mb-2">Rozkład gatunków</h4>
                    <Pie data={genreData} />
                </div>
                <div>
                    <h4 className="font-semibold mb-2">Top artyści</h4>
                    <Bar data={artistData} />
                </div>
            </div>

            <div>
                <h4 className="font-semibold mb-2">Rozkład lat wydania</h4>
                <Bar data={yearDistribution} />
            </div>
        </div>
    );
}