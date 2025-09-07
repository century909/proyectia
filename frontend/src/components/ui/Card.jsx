import React from 'react';

const Card = ({ 
  children, 
  className = '', 
  ...props 
}) => {
  const baseClasses = 'bg-white overflow-hidden shadow rounded-lg';
  const classes = `${baseClasses} ${className}`;
  
  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

export default Card;