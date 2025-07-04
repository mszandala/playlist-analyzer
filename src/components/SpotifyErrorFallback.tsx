interface SpotifyErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void; // ZMIEŃ z resetError na resetErrorBoundary
}

export const SpotifyErrorFallback = ({ error, resetErrorBoundary }: SpotifyErrorFallbackProps) => {
  const isSpotifyError = error.message.includes('Spotify') || 
                        error.message.includes('token') || 
                        error.message.includes('Session') ||
                        error.message.includes('401');
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-400 via-red-500 to-red-600 flex items-center justify-center">
      <div className="text-center p-8 bg-white/95 backdrop-blur rounded-xl shadow-2xl max-w-md">
        <div className="text-6xl mb-4">🎵❌</div>
        <h2 className="text-2xl font-bold text-red-600 mb-4">
          {isSpotifyError ? 'Problem z Spotify' : 'Wystąpił błąd'}
        </h2>
        <p className="text-gray-600 mb-2 font-medium">
          {error.message}
        </p>
        <p className="text-gray-500 text-sm mb-6">
          {isSpotifyError 
            ? 'Spróbuj zalogować się ponownie do Spotify.'
            : 'Przepraszamy, coś poszło nie tak.'
          }
        </p>
        <div className="space-y-3">
          <button
            onClick={resetErrorBoundary} // ZMIEŃ z resetError
            className="w-full bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors font-medium"
          >
            Spróbuj ponownie
          </button>
          {isSpotifyError && (
            <button
              onClick={() => {
                // Wyczyść cookies i przekieruj
                document.cookie.split(";").forEach(cookie => {
                  const eqPos = cookie.indexOf("=");
                  const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
                  if (name.trim().includes('spotify')) {
                    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
                  }
                });
                window.location.href = '/';
              }}
              className="w-full bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors font-medium"
            >
              Wróć i zaloguj ponownie
            </button>
          )}
        </div>
      </div>
    </div>
  );
};