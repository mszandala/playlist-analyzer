import SpotifyWebApi from 'spotify-web-api-node';

console.log('Environment variables:', {
  clientId: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID ? 'SET' : 'NOT SET',
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET ? 'SET' : 'NOT SET',
  redirectUri: process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI
});

// Sprawdź czy wszystkie wymagane zmienne środowiskowe są dostępne
if (!process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID) {
  throw new Error('Missing NEXT_PUBLIC_SPOTIFY_CLIENT_ID');
}

if (!process.env.SPOTIFY_CLIENT_SECRET) {
  throw new Error('Missing SPOTIFY_CLIENT_SECRET');
}

if (!process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI) {
  throw new Error('Missing NEXT_PUBLIC_SPOTIFY_REDIRECT_URI');
}

// Konfiguracja głównej instancji Spotify API
export const spotifyApi = new SpotifyWebApi({
  clientId: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI
});

// Scopes potrzebne dla aplikacji
export const SPOTIFY_SCOPES = [
  'playlist-read-private',
  'playlist-read-collaborative',
  'user-read-private',
  'user-read-email'
];

// ==========================================
// AUTHORIZATION CODE FLOW FUNCTIONS
// ==========================================

/**
 * Generuje URL do autoryzacji Spotify OAuth
 */
export const getSpotifyAuthUrl = (): string => {
  const state = generateRandomString(16);
  
  // Tworzymy URL autoryzacji ręcznie
  const params = new URLSearchParams({
    client_id: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID!,
    response_type: 'code',
    redirect_uri: process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI!,
    state: state,
    scope: SPOTIFY_SCOPES.join(' '),
    show_dialog: 'true'
  });

  const authUrl = `https://accounts.spotify.com/authorize?${params.toString()}`;
  console.log('🔗 Generated Spotify auth URL:', authUrl);
  return authUrl;
};

/**
 * Wymienia kod autoryzacyjny na tokeny dostępu
 */
export const exchangeCodeForTokens = async (code: string) => {
  try {
    console.log('🔄 Exchanging authorization code for tokens...');
    const data = await spotifyApi.authorizationCodeGrant(code);
    
    console.log('✅ Tokens received:', {
      access_token: '***',
      refresh_token: '***', 
      expires_in: data.body.expires_in,
      scope: data.body.scope
    });

    return {
      accessToken: data.body.access_token,
      refreshToken: data.body.refresh_token,
      expiresIn: data.body.expires_in,
      scope: data.body.scope
    };
  } catch (error: any) {
    console.error('❌ Error exchanging code for tokens:', {
      message: error.message,
      status: error.statusCode,
      body: error.body
    });
    throw error;
  }
};

/**
 * Odświeża token dostępu używając refresh token
 */
export const refreshAccessToken = async (refreshToken: string) => {
  try {
    console.log('🔄 Refreshing access token...');
    
    // Ustaw refresh token na instancji API
    spotifyApi.setRefreshToken(refreshToken);
    
    const data = await spotifyApi.refreshAccessToken();
    
    console.log('✅ Token refreshed, expires in:', data.body.expires_in, 'seconds');
    
    return {
      accessToken: data.body.access_token,
      expiresIn: data.body.expires_in,
      // Spotify czasami zwraca nowy refresh token
      refreshToken: data.body.refresh_token || refreshToken
    };
  } catch (error: any) {
    console.error('❌ Error refreshing token:', {
      message: error.message,
      status: error.statusCode,
      body: error.body
    });
    throw error;
  }
};

/**
 * Tworzy nową instancję Spotify API z tokenem użytkownika
 */
export const createUserSpotifyApi = (accessToken: string, refreshToken?: string): SpotifyWebApi => {
  const userSpotifyApi = new SpotifyWebApi({
    clientId: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI || 'http://127.0.0.1:3000/callback'
  });
  
  userSpotifyApi.setAccessToken(accessToken);
  if (refreshToken) {
    userSpotifyApi.setRefreshToken(refreshToken);
  }
  
  return userSpotifyApi;
};

// ==========================================
// USER SESSION MANAGEMENT
// ==========================================

/**
 * Sprawdza czy token jest ważny i odświeża go jeśli potrzeba
 */
export const ensureValidToken = async (
  accessToken: string, 
  refreshToken: string, 
  expiresAt: number
): Promise<{ accessToken: string; refreshToken: string; expiresAt: number }> => {
  const now = Date.now();
  const buffer = 5 * 60 * 1000; // 5 minut buforu
  
  // Jeśli token jest nadal ważny
  if (expiresAt > now + buffer) {
    return { accessToken, refreshToken, expiresAt };
  }
  
  // Token wygasł, odśwież go
  console.log('🔄 Token expired, refreshing...');
  try {
    const refreshedTokens = await refreshAccessToken(refreshToken);
    const newExpiresAt = now + (refreshedTokens.expiresIn * 1000);
    
    return {
      accessToken: refreshedTokens.accessToken,
      refreshToken: refreshedTokens.refreshToken,
      expiresAt: newExpiresAt
    };
  } catch (error) {
    console.error('❌ Failed to refresh token:', error);
    throw new Error('Session expired. Please log in again.');
  }
};

/**
 * Pobiera informacje o użytkowniku
 */
export const getUserInfo = async (accessToken: string) => {
  try {
    const userApi = createUserSpotifyApi(accessToken);
    const userInfo = await userApi.getMe();
    
    console.log('✅ User info retrieved:', {
      id: userInfo.body.id,
      display_name: userInfo.body.display_name,
      followers: userInfo.body.followers?.total
    });
    
    return userInfo.body;
  } catch (error: any) {
    console.error('❌ Error fetching user info:', error);
    throw error;
  }
};

// ==========================================
// LEGACY SUPPORT (dla kompatybilności)
// ==========================================

/**
 * @deprecated Używaj Authorization Code Flow zamiast tego
 * Stara funkcja do Client Credentials Flow - zostaje dla kompatybilności
 */
export const getSpotifyToken = async () => {
  console.warn('⚠️ getSpotifyToken is deprecated. Use Authorization Code Flow instead.');
  
  try {
    console.log('🎫 Requesting access token (Client Credentials)...');
    const data = await spotifyApi.clientCredentialsGrant();
    console.log('✅ Token received, expires in:', data.body.expires_in, 'seconds');
    
    spotifyApi.setAccessToken(data.body.access_token);
    return data.body.access_token;
  } catch (error: any) {
    console.error('❌ Error getting Spotify token:', {
      message: error.message,
      status: error.statusCode,
      body: error.body
    });
    throw error;
  }
};

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

/**
 * Generuje losowy string dla state parameter
 */
export const generateRandomString = (length: number): string => {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let text = '';
  
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  
  return text;
};

/**
 * Funkcja do wyciągnięcia ID playlisty z URL - bez zmian
 */
export const getPlaylistIdFromUrl = (url: string): string | null => {
  if (!url) return null;
  
  try {
    const patterns = [
      /playlist[\/:]([a-zA-Z0-9]+)/,
      /\/playlist\/([a-zA-Z0-9]+)/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        console.log('✅ Extracted playlist ID:', match[1], 'from URL:', url);
        return match[1];
      }
    }
    
    console.log('❌ Could not extract playlist ID from URL:', url);
    return null;
  } catch (error) {
    console.error('❌ Error parsing playlist URL:', error);
    return null;
  }
};

export default spotifyApi;