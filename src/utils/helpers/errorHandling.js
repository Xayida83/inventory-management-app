import { useState } from 'react';

export default function errorHandling() {
  const [error, setError] = useState(null);

  const handleError = (response, defaultErrorMessage) => {
    if (!response.ok) {
      return response.json().then((data) => {
        const message = data.message || defaultErrorMessage;
        setError(message);
        throw new Error(message);
      });
    }
    return response.json();
  };

  const clearError = () => setError(null);

  return { error, setError, handleError, clearError };
}