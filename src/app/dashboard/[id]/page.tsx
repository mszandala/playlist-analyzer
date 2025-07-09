'use client';

import React from 'react';
import { useDashboard } from '@/hooks/useDashboard';
import {DashboardHeader} from '@/components/dashboard/DashboardHeader';
import {PlaylistSelector} from '@/components/dashboard/PlaylistSelector';
import {AnalysisNavigation} from '@/components/dashboard/AnalysisNavigation';
import { apiService } from '@/services/api'; 
import { usePlaylistAnalyzer } from '@/hooks/usePlaylistAnalyzer';
//import AnalysisContent from '@/components/dashboard/AnalysisContent';

const DashboardPage = () => {
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
    user,
    isDarkMode,
    toggleDarkMode,
    themeClasses,
    cardClasses,
    hoverClasses
  } = useDashboard();

  const {updateState} = usePlaylistAnalyzer();
   const handleLogout = async () => {
    try {
      await apiService.logout();
      updateState({ isLoggedIn: false, playlistUrl: '', error: undefined });
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  if (!user) return <div className="p-8">Ładowanie użytkownika...</div>;

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
        onSetSearchQuery={(query) => {}}            
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

        {/* <AnalysisContent
          selectedTab={selectedTab}
          selectedPlaylists={selectedPlaylists}
          playlists={playlists}
          cardClasses={cardClasses}
        /> */}
      </div>
    </div>
  );
};

export default DashboardPage;
