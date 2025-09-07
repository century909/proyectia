import React from 'react';

const Input = ({ 
  label, 
  id, 
  error, 
  className = '', 
  ...props 
}) => {
  const baseClasses = 'block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm';
  const errorClasses = error ? 'border-accent-300 focus:border-accent-500 focus:ring-accent-500' : '';
  const classes = `${baseClasses} ${errorClasses} ${className}`;
  
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        id={id}
        className={classes}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-accent-600">{error}</p>
      )}
    </div>
  );
};

export default Input;