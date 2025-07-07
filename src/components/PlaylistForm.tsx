import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';

interface PlaylistFormProps {
  playlistUrl: string;
  loading: boolean;
  error: string;
  onUrlChange: (url: string) => void;
  onAnalyze: () => void;
}

export const PlaylistForm = ({
  playlistUrl,
  loading,
  error,
  onUrlChange,
  onAnalyze
}: PlaylistFormProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loading) {
      onAnalyze();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-3">
        <label 
          htmlFor="playlist-url" 
          className="flex items-center space-x-2 text-sm font-semibold text-gray-200 uppercase tracking-wide"
        >
          <span>🎵</span>
          <span>Link do playlisty Spotify</span>
        </label>
        
        <div className="relative">
          <input
            id="playlist-url"
            type="url"
            value={playlistUrl}
            onChange={(e) => onUrlChange(e.target.value)}
            placeholder="https://open.spotify.com/playlist/..."
            disabled={loading}
            className="w-full px-6 py-4 bg-gray-800/80 border-2 border-gray-600 rounded-xl text-white placeholder-gray-400 text-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:bg-gray-800 disabled:bg-gray-700/50 disabled:cursor-not-allowed disabled:text-gray-400 transition-all duration-200 backdrop-blur"
            autoComplete="url"
          />
          
          {/* Input decoration */}
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            {playlistUrl.trim() && !loading && (
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            )}
          </div>
        </div>
        
        <p className="text-xs text-gray-400 flex items-center space-x-1">
          <span>💡</span>
          <span>Wklej link skopiowany z aplikacji Spotify</span>
        </p>
      </div>
      
      {error && (
        <div className="bg-red-900/30 border border-red-500/50 rounded-xl p-4 backdrop-blur">
          <div className="flex items-center space-x-3">
            <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">!</span>
            </div>
            <p className="text-red-200">{error}</p>
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={loading || !playlistUrl.trim()}
        className="group relative w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 disabled:from-gray-600 disabled:to-gray-700 text-black font-bold py-5 px-8 rounded-xl transition-all duration-300 text-lg shadow-xl hover:shadow-2xl transform hover:scale-[1.02] hover:-translate-y-1 disabled:transform-none disabled:shadow-lg disabled:text-gray-400 overflow-hidden"
      >
        {/* Background animation */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        <span className="relative flex items-center justify-center space-x-3">
          {loading ? (
            <>
              <LoadingSpinner size="sm" text="" />
              <span>Analizuję playlistę...</span>
            </>
          ) : (
            <>
              <span className="text-2xl">🔍</span>
              <span>Analizuj playlistę</span>
              <span className="text-xl group-hover:translate-x-1 transition-transform duration-200">→</span>
            </>
          )}
        </span>
      </button>
      
      {/* Progress indicator */}
      {loading && (
        <div className="space-y-2">
          <div className="w-full bg-gray-700 rounded-full h-1 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full animate-pulse"></div>
          </div>
          <p className="text-center text-sm text-gray-400">Łączę się z API Spotify...</p>
        </div>
      )}
    </form>
  );
};