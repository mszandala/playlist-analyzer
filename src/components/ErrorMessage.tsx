interface ErrorMessageProps {
  message: string;
}

export const ErrorMessage = ({ message }: ErrorMessageProps) => (
  <p className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded">
    {message}
  </p>
);