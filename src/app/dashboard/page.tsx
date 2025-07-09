'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDashboard } from '@/hooks/useDashboard';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { PlaylistSelector } from '@/components/dashboard/PlaylistSelector';
import { AnalysisNavigation } from '@/components/dashboard/AnalysisNavigation';
import { apiService } from '@/services/api'; 
import { useAuth } from '@/contexts/AuthContext';

const DashboardPage = () => {
  const { user, loading } = useAuth();
  const router = useRouter();

  const {
    state: {
      selectedTab,
      searchQuery,
      viewMode,
      selectedPlaylists,
    },
    setSelectedTab,
    playlists,
    togglePlaylist,
    setViewMode,
    isDarkMode,
    toggleDarkMode,
    themeClasses,
    cardClasses,
    hoverClasses
  } = useDashboard();

  useEffect(() => {
    // Jeśli nie ma użytkownika i skończyło się ładowanie, przekieruj
    if (!loading && !user) {
      router.replace('/');
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    try {
      await apiService.logout();
      router.replace('/');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-400 via-green-500 to-green-600 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold">Ładowanie...</h2>
          <p className="text-lg opacity-80">Pobieranie danych użytkownika</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className={`min-h-screen ${themeClasses} transition-colors duration-300`}>
      <DashboardHeader
        user={user}
        isDarkMode={isDarkMode}
        onToggleTheme={toggleDarkMode}
        onLogout={handleLogout}
      />

      <PlaylistSelector
        playlists={playlists}
        selectedPlaylists={selectedPlaylists}
        onTogglePlaylist={togglePlaylist}
        viewMode={viewMode}
        onSetViewMode={setViewMode}
        isDarkMode={isDarkMode}
        cardClasses={cardClasses}
        hoverClasses={hoverClasses}
        searchQuery={searchQuery}                   
        onSetSearchQuery={(_) => {}}            
        onClearSelection={() => {}}                 
        onSelectAll={() => {}} 
      />

      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-200px)]">
        <AnalysisNavigation
          selectedTab={selectedTab}
          onTabChange={setSelectedTab} 
          isDarkMode={isDarkMode} 
          hasSelectedPlaylists={selectedPlaylists.length > 0} 
        />
      </div>
    </div>
  );
};

export default DashboardPage;