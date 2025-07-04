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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="playlist-url" className="block text-sm font-medium text-gray-700 mb-2">
          Link do playlisty Spotify
        </label>
        <input
          id="playlist-url"
          type="url"
          value={playlistUrl}
          onChange={(e) => onUrlChange(e.target.value)}
          placeholder="https://open.spotify.com/playlist/..."
          disabled={loading}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed text-lg"
          autoComplete="url"
        />
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700 text-center">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={loading || !playlistUrl.trim()}
        className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none disabled:shadow-lg"
      >
        {loading ? (
          <LoadingSpinner size="sm" text="Analizuję..." />
        ) : (
          '🔍 Analizuj playlistę'
        )}
      </button>
    </form>
  );
};