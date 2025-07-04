'use client';

import { ErrorBoundary } from 'react-error-boundary';
import { SpotifyErrorFallback } from '@/components/SpotifyErrorFallback';

interface ClientErrorBoundaryProps {
  children: React.ReactNode;
}

export function ClientErrorBoundary({ children }: ClientErrorBoundaryProps) {
  return (
    <ErrorBoundary 
      FallbackComponent={SpotifyErrorFallback}
      onError={(error) => console.error('Error caught:', error)}
    >
      {children}
    </ErrorBoundary>
  );
}