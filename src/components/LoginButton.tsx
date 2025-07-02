interface LoginButtonProps {
  onClick: () => void;
}

export const LoginButton = ({ onClick }: LoginButtonProps) => (
  <div className="text-center">
    <p className="text-lg text-gray-700 mb-6">
      Zaloguj się przez Spotify, aby analizować playlisty
    </p>
    <button
      onClick={onClick}
      className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-lg transition-all duration-200 text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
    >
      Zaloguj się przez Spotify
    </button>
  </div>
);