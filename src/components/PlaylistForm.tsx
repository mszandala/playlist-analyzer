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
}: PlaylistFormProps) => (
  <div>
    <div className="mb-6">
      <label className="block text-sm font-semibold text-gray-700 mb-3">
        Link do playlisty Spotify
      </label>
      <input
        type="text"
        value={playlistUrl}
        onChange={(e) => onUrlChange(e.target.value)}
        placeholder="https://open.spotify.com/playlist/37i9dQZF1DX..."
        className="w-full px-4 py-4 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-lg"
        disabled={loading}
      />
      {error && <ErrorMessage message={error} />}
    </div>
    
    <button
      onClick={onAnalyze}
      disabled={loading || !playlistUrl.trim()}
      className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
    >
      {loading ? <LoadingSpinner /> : '🔍 Analizuj playlistę'}
    </button>
  </div>
);