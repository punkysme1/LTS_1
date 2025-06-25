
import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center py-10">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-500 dark:border-primary-400"></div>
      <p className="ml-4 text-lg text-gray-700 dark:text-gray-300">Memuat...</p>
    </div>
  );
};

export default LoadingSpinner;
