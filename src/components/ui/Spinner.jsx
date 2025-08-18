import React from 'react';
import PropTypes from 'prop-types';

const Spinner = ({ size = 'md', color = 'text-blue-600', className = '' }) => {
  const sizeClasses = {
    xs: 'h-4 w-4',
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10',
    xl: 'h-12 w-12',
  };

  return (
    <div className={`inline-block animate-spin rounded-full border-2 border-solid border-current border-r-transparent ${sizeClasses[size]} ${color} ${className}`}
      role="status">
      <span className="sr-only">Loading...</span>
    </div>
  );
};

Spinner.propTypes = {
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  color: PropTypes.string,
  className: PropTypes.string,
};

export default Spinner;