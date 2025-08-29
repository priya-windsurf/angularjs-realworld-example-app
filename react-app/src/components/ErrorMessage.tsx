import React from 'react';

interface ErrorMessageProps {
  errors: string[] | string;
  className?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ errors, className = 'error-messages' }) => {
  const errorList = Array.isArray(errors) ? errors : [errors];
  
  if (errorList.length === 0) {
    return null;
  }

  return (
    <ul className={className}>
      {errorList.map((error, index) => (
        <li key={index}>{error}</li>
      ))}
    </ul>
  );
};
