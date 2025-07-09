import React from 'react';
import { Music, Sun, Moon, LogOut } from 'lucide-react';
import { User } from '@/types/dashboard.types';

interface DashboardHeaderProps {
  user: User;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onLogout: () => void;
}

export function DashboardHeader({ 
  user, 
  isDarkMode, 
  onToggleTheme, 
  onLogout 
}: DashboardHeaderProps) {
  const cardClasses = isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';
  const hoverClasses = isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100';

  return (
    <header className={`${cardClasses} border-b px-6 py-4`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
            <Music className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Spotify Analyzer</h1>
            <p className="text-sm opacity-70">Analiza Twoich playlist</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={onToggleTheme}
            className={`p-2 rounded-lg ${hoverClasses} transition-colors`}
            aria-label={isDarkMode ? 'Przełącz na jasny motyw' : 'Przełącz na ciemny motyw'}
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          
          <div className="flex items-center space-x-3">
            <img 
              src={user.image} 
              alt={user.name}
              className="w-8 h-8 rounded-full"
            />
            <div className="hidden sm:block">
              <p className="font-medium text-sm">{user.name}</p>
              <p className="text-xs opacity-70">{user.email}</p>
            </div>
          </div>
          
          <button 
            onClick={onLogout}
            className={`p-2 rounded-lg ${hoverClasses} transition-colors text-red-500`}
            aria-label="Wyloguj się"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}