// components/Loader.js
import React from 'react';

export const Loader = ({ size = 4, color = 'white' }) => {
  const loaderClasses = {
    white: 'border-white border-t-transparent',
    blue: 'border-blue-600 border-t-transparent',
    gray: 'border-gray-400 border-t-transparent'
  };

  return (
    <div className={`inline-block h-${size} w-${size} animate-spin rounded-full border-2 ${loaderClasses[color]}`} />
  );
};