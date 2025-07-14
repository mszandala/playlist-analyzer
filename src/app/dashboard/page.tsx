'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDashboard } from '@/hooks/useDashboard';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { PlaylistSelector } from '@/components/dashboard/PlaylistSelector';
import { AnalysisNavigation } from '@/components/dashboard/AnalysisNavigation';
import { RefreshCw } from 'lucide-react';

const DashboardPage = () => {
  const router = useRouter();

  const {
    state: {
      selectedTab,
      searchQuery,
      viewMode,
      selectedPlaylists,
      isLoading,
      error,
    },
    setSelectedTab,
    playlists,
    togglePlaylist,
    setViewMode,
    setSearchQuery,
    clearSelection,
    selectAllPlaylists,
    refreshPlaylists,
    isDarkMode,
    toggleTheme,
    themeClasses,
    cardClasses,
    hoverClasses,
    loadingPlaylists,
    user,
    loadingUser
  } = useDashboard();

  useEffect(() => {
    // Jeśli nie ma użytkownika i skończyło się ładowanie, przekieruj
    if (!loadingUser && !user) {
      router.replace('/');
    }
  }, [user, loadingUser, router]);

  const handleLogout = async () => {
    try {
      // Usuń token z cookies
      await fetch('/api/auth/logout', { method: 'POST' });
      router.replace('/');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  if (loadingUser) {
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
        onToggleTheme={toggleTheme}
        onLogout={handleLogout}
      />

      <div className="relative">
        {/* Error banner */}
        {error && (
          <div className="mx-6 mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-red-500">Błąd</h4>
                <p className="text-sm text-red-400">{error}</p>
              </div>
              <button
                onClick={refreshPlaylists}
                className="flex items-center space-x-2 px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Spróbuj ponownie</span>
              </button>
            </div>
          </div>
        )}

        {/* Loading overlay */}
        {loadingPlaylists && (
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center z-10">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500"></div>
                <span className="text-lg font-semibold">Ładowanie playlist...</span>
              </div>
            </div>
          </div>
        )}

        <PlaylistSelector
          playlists={playlists} // Użyj playlists z useDashboard (już przefiltrowane)
          selectedPlaylists={selectedPlaylists}
          onTogglePlaylist={togglePlaylist}
          viewMode={viewMode}
          onSetViewMode={setViewMode}
          isDarkMode={isDarkMode}
          cardClasses={cardClasses}
          hoverClasses={hoverClasses}
          searchQuery={searchQuery}                   
          onSetSearchQuery={setSearchQuery}            
          onClearSelection={clearSelection}                 
          onSelectAll={selectAllPlaylists} 
        />
      </div>

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