import React from 'react';
import { LoadingSpinner } from './components/shared/LoadingSpinner';

const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <LoadingSpinner />
      <span className="ml-2">Loading...</span>
    </div>
  );
};

export default Loading;