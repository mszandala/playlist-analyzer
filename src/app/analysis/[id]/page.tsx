'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { apiService } from '@/services/api';
import type { PlaylistData } from '@/types/spotify.types';

export default function AnalysisPage() {
  const params = useParams();
  const [playlistData, setPlaylistData] = useState<PlaylistData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    const loadPlaylist = async () => {
      if (!params.id) return;
      
      const { data, error } = await apiService.getPlaylist(params.id as string);
      
      if (error) {
        setError(error);
      } else {
        setPlaylistData(data || null);
      }
      setLoading(false);
    };

    loadPlaylist();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-400 via-green-500 to-green-600 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold">Ładowanie analizy...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-400 via-red-500 to-red-600 flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Błąd</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!playlistData) {
    return <div>Brak danych playlisty</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-green-500 to-green-600">
      <div className="container mx-auto px-4 py-16">
        <div className="bg-white/95 backdrop-blur rounded-xl shadow-2xl p-8">
          <h1 className="text-3xl font-bold mb-6">{playlistData.playlist.name}</h1>
          <p className="text-gray-600 mb-4">Liczba utworów: {playlistData.tracks.length}</p>
          
          {/* Add your analysis components here */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {playlistData.tracks.map((item, index) => {
              if (!item.track) return null; // Skip if track is null
              
              return (
                <div key={index} className="bg-white p-4 rounded-lg shadow">
                  <h3 className="font-semibold">{item.track.name}</h3>
                  <p className="text-gray-600">
                    {item.track.artists?.map(artist => artist.name).join(', ') || 'Unknown Artist'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {(item.track as any).album?.name || 'Unknown Album'}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}