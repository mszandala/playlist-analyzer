import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClientErrorBoundary } from "@/components/ClientErrorBoundary";
import { AuthProvider } from "@/contexts/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap", // Lepsze ładowanie czcionek
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Playlist Analyzer - Odkryj swoje muzyczne wzorce",
    template: "%s | Playlist Analyzer"
  },
  description: "Analizuj swoje playlisty Spotify i odkryj ukryte wzorce w swojej muzyce. Darmowe narzędzie do analizy gustów muzycznych.",
  keywords: [
    "Spotify",
    "playlist analyzer",
    "analiza muzyki",
    "spotify tools",
    "music analysis",
    "playlista",
    "muzyka"
  ],
  authors: [{ name: "mszandala" }],
  creator: "mszandala",
  openGraph: {
    type: "website",
    locale: "pl_PL",
    url: "https://your-domain.com", // Zmień na swoją domenę
    title: "Playlist Analyzer - Odkryj swoje muzyczne wzorce",
    description: "Analizuj swoje playlisty Spotify i odkryj ukryte wzorce w swojej muzyce",
    siteName: "Playlist Analyzer",
    images: [
      {
        url: "/og-image.png", // Dodaj obraz Open Graph
        width: 1200,
        height: 630,
        alt: "Playlist Analyzer - Spotify Music Analysis Tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Playlist Analyzer - Odkryj swoje muzyczne wzorce",
    description: "Analizuj swoje playlisty Spotify i odkryj ukryte wzorce w swojej muzyce",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // google: "your-google-verification-code", // Dodaj gdy będziesz miał domenę
  },
  manifest: "/manifest.json", // PWA manifest
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
        color: "#1db954", // Spotify green
      },
    ],
  },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#1db954" },
    { media: "(prefers-color-scheme: dark)", color: "#191414" },
  ],
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl" className="dark">{/* Domyślnie ciemny motyw */}
      <head>
        {/* Preconnect do Spotify API dla lepszej wydajności */}
        <link rel="preconnect" href="https://api.spotify.com" />
        <link rel="preconnect" href="https://accounts.spotify.com" />
        
        {/* DNS prefetch dla Google Fonts */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        
        {/* Spotify brand color */}
        <meta name="msapplication-TileColor" content="#1db954" />
        <meta name="theme-color" content="#191414" />
      </head>
      <body
        className={`
          ${geistSans.variable} 
          ${geistMono.variable} 
          antialiased 
          bg-black 
          text-white 
          min-h-screen
          selection:bg-green-400 
          selection:text-black
          scrollbar-thin 
          scrollbar-track-gray-900 
          scrollbar-thumb-green-500
        `}
      >
        <AuthProvider>
          <ClientErrorBoundary>
            <div className="relative min-h-screen">
              {children}
            </div>
          </ClientErrorBoundary>
        </AuthProvider>
      </body>
    </html>
  );
}