interface LoginButtonProps {
  onClick: () => void;
}

export const LoginButton = ({ onClick }: LoginButtonProps) => (
  <div className="text-center py-8">
    <div className="mb-8">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500 rounded-full mb-4">
        <svg className="w-8 h-8 text-black" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.84-.179-.959-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.361 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
        </svg>
      </div>
      <h3 className="text-2xl font-bold text-white mb-3">
        Połącz się ze Spotify
      </h3>
      <p className="text-lg text-gray-300 leading-relaxed max-w-md mx-auto">
        Zaloguj się przez Spotify, aby analizować swoje playlisty i odkrywać nowe wzorce muzyczne
      </p>
    </div>
    
    <button
      onClick={onClick}
      className="group relative bg-green-500 hover:bg-green-400 text-black font-bold py-4 px-12 rounded-full transition-all duration-300 text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 hover:-translate-y-1"
    >
      <span className="flex items-center justify-center space-x-3">
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.84-.179-.959-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.361 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
        </svg>
        <span>Zaloguj się przez Spotify</span>
      </span>
      
      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-white/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </button>
  </div>
);