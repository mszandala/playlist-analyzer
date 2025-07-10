import React from 'react';
import { 
  BarChart3, 
  Users, 
  Music, 
  TrendingUp, 
  GitCompare,
  Download,
  Save,
  Share2,
  History
} from 'lucide-react';
import { AnalysisTab } from '@/types/dashboard.types';

interface AnalysisNavigationProps {
  selectedTab: string;
  isDarkMode: boolean;
  hasSelectedPlaylists: boolean;
  onTabChange: (tabId: string) => void;
  onExport?: () => void;
  onSave?: () => void;
  onShare?: () => void;
}

export function AnalysisNavigation({
  selectedTab,
  isDarkMode,
  hasSelectedPlaylists,
  onTabChange,
  onExport,
  onSave,
  onShare
}: AnalysisNavigationProps) {
  // NAPRAWIONA LOGIKA: isDarkMode true = ciemny motyw
  const cardClasses = isDarkMode 
    ? 'bg-gray-800 border-gray-700 text-white' 
    : 'bg-white border-gray-200 text-gray-900';
  const hoverClasses = isDarkMode 
    ? 'hover:bg-gray-700' 
    : 'hover:bg-gray-100';

  const tabs: AnalysisTab[] = [
    { id: 'overview', label: 'Przegląd', icon: BarChart3 },
    { id: 'artists', label: 'Wykonawcy', icon: Users },
    { id: 'tracks', label: 'Utwory', icon: Music },
    { id: 'statistics', label: 'Statystyki', icon: TrendingUp },
    { id: 'compare', label: 'Porównanie', icon: GitCompare, disabled: !hasSelectedPlaylists }
  ];

  return (
    <div className={`${cardClasses} border-r lg:w-64 p-4`}>
      <div className="mb-6">
        <h3 className="font-semibold mb-4">Analizy</h3>
        <nav className="space-y-2">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isDisabled = tab.disabled || !hasSelectedPlaylists;
            
            return (
              <button
                key={tab.id}
                onClick={() => !isDisabled && onTabChange(tab.id)}
                disabled={isDisabled}
                className={`
                  w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors
                  ${selectedTab === tab.id 
                    ? 'bg-green-500 text-white' 
                    : isDisabled 
                      ? 'opacity-40 cursor-not-allowed' 
                      : `${hoverClasses} opacity-70 hover:opacity-100`
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>
                {tab.id === 'compare' && hasSelectedPlaylists && (
                  <span className="text-xs bg-green-600 text-white px-1 rounded">
                    NEW
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Quick Actions */}
      <div className="mb-6">
        <h4 className="font-semibold mb-3">Szybkie akcje</h4>
        <div className="space-y-2">
          <button 
            onClick={onExport}
            disabled={!hasSelectedPlaylists}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left text-sm transition-colors ${
              hasSelectedPlaylists 
                ? `${hoverClasses} opacity-70 hover:opacity-100` 
                : 'opacity-40 cursor-not-allowed'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>Eksportuj dane</span>
          </button>
          
          <button 
            onClick={onSave}
            disabled={!hasSelectedPlaylists}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left text-sm transition-colors ${
              hasSelectedPlaylists 
                ? `${hoverClasses} opacity-70 hover:opacity-100` 
                : 'opacity-40 cursor-not-allowed'
            }`}
          >
            <Save className="w-4 h-4" />
            <span>Zapisz analizę</span>
          </button>
          
          <button 
            onClick={onShare}
            disabled={!hasSelectedPlaylists}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left text-sm transition-colors ${
              hasSelectedPlaylists 
                ? `${hoverClasses} opacity-70 hover:opacity-100` 
                : 'opacity-40 cursor-not-allowed'
            }`}
          >
            <Share2 className="w-4 h-4" />
            <span>Udostępnij</span>
          </button>
        </div>
      </div>

      {/* Recent Analyses */}
      <div>
        <h4 className="font-semibold mb-3 flex items-center space-x-2">
          <History className="w-4 h-4" />
          <span>Ostatnie analizy</span>
        </h4>
        <div className="space-y-2">
          <button className={`w-full px-3 py-2 rounded-lg text-left text-sm ${hoverClasses} opacity-70 hover:opacity-100`}>
            <div className="font-medium">Workout Mix</div>
            <div className="text-xs opacity-50">2 dni temu</div>
          </button>
          <button className={`w-full px-3 py-2 rounded-lg text-left text-sm ${hoverClasses} opacity-70 hover:opacity-100`}>
            <div className="font-medium">Chill Vibes</div>
            <div className="text-xs opacity-50">1 tydzień temu</div>
          </button>
          <button className={`w-full px-3 py-2 rounded-lg text-left text-sm ${hoverClasses} opacity-70 hover:opacity-100`}>
            <div className="font-medium">Polish Hits</div>
            <div className="text-xs opacity-50">2 tygodnie temu</div>
          </button>
        </div>
      </div>
    </div>
  );
}