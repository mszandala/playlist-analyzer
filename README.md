This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

# Playlist Analyzer

A web application that analyzes Spotify playlists using the Spotify Web API. Users can log in with their Spotify account and analyze both public and private playlists to discover patterns in their music preferences.

## Features

- **Spotify Authentication**: Secure login via Spotify OAuth 2.0 Authorization Code Flow
- **Playlist Analysis**: Analyze both public and private Spotify playlists
- **Audio Feature Analysis**: Detailed breakdown of musical characteristics (energy, valence, danceability, etc.)
- **User-Friendly Interface**: Clean, responsive design with real-time authentication status

## Prerequisites

1. **Spotify Developer Account**: Create a Spotify app at [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. **Environment Variables**: Configure the required environment variables (see setup below)

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory with your Spotify app credentials:
   ```env
   NEXT_PUBLIC_SPOTIFY_CLIENT_ID=your_spotify_client_id_here
   SPOTIFY_CLIENT_SECRET=your_spotify_client_secret_here
   NEXTAUTH_URL=http://localhost:3000
   ```

4. **Configure Spotify App Redirect URI**: 
   - Go to your Spotify app settings in the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
   - Add `http://localhost:3000/api/auth/callback` to the Redirect URIs
   - For production, use your domain: `https://yourdomain.com/api/auth/callback`

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## How to Use

1. **Login**: Click "Zaloguj się przez Spotify" to authenticate with your Spotify account
2. **Enter Playlist URL**: Paste a Spotify playlist URL in the input field
3. **Analyze**: Click "Analizuj playlistę" to view detailed analysis
4. **View Results**: See audio features, track information, and musical patterns

## API Endpoints

- `GET /api/auth/login` - Redirects to Spotify OAuth login
- `GET /api/auth/callback` - Handles OAuth callback and sets session cookies
- `GET /api/auth/user` - Returns current user authentication status
- `DELETE /api/auth/user` - Logs out user (clears session cookies)
- `GET /api/playlist/[id]` - Fetches playlist data (requires authentication)

## Required Spotify Scopes

The application requests the following permissions:
- `playlist-read-private` - Access to user's private playlists
- `playlist-read-collaborative` - Access to collaborative playlists
- `user-read-private` - Basic user profile information

## Technology Stack

- **Framework**: Next.js 15 with App Router
- **Authentication**: Spotify OAuth 2.0 Authorization Code Flow
- **Styling**: Tailwind CSS
- **Spotify API**: spotify-web-api-node
- **Session Management**: HTTP-only cookies with automatic token refresh

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
