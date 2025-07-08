interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

export const LoadingSpinner = ({ 
  size = 'md', 
  text, 
  className = '' 
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <div className={`flex flex-col items-center justify-center space-y-3 ${className}`}>
      {/* Spotify-style spinning circle */}
      <div className="relative">
        <div 
          className={`${sizeClasses[size]} border-2 border-gray-600 border-t-green-400 rounded-full animate-spin`}
          style={{ animationDuration: '1s' }}
        />
        {/* Inner glow effect */}
        <div 
          className={`absolute inset-0 ${sizeClasses[size]} border-2 border-transparent border-t-green-400/50 rounded-full animate-spin`}
          style={{ animationDuration: '1s', filter: 'blur(1px)' }}
        />
      </div>

      {text && (
        <div className="text-center">
          <p className="text-sm text-gray-300 font-medium tracking-wide">
            {text}
          </p>
          {/* Progress dots */}
          <div className="flex justify-center space-x-1 mt-2">
            <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse opacity-100"></div>
            <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse opacity-75" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse opacity-50" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      )}
    </div>
  );
};