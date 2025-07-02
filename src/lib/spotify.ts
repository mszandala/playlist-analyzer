import SpotifyWebApi from 'spotify-web-api-node';

console.log('🔧 Initializing Spotify API with:', {
  clientId: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID,
  hasClientSecret: !!process.env.SPOTIFY_CLIENT_SECRET
});

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

// Funkcja do pobierania tokenu (Client Credentials Flow)
export const getSpotifyToken = async () => {
  try {
    console.log('🎫 Requesting access token...');
    const data = await spotifyApi.clientCredentialsGrant();
    console.log('✅ Token received, expires in:', data.body.expires_in, 'seconds');
    //console.log('🔍 Token scope:', data.body.scope || 'no scope specified');
    
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

// Funkcja do wyciągnięcia ID playlisty z URL
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

export { spotifyApi };
export default spotifyApi;

