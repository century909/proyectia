import React from 'react';
import '../../index.scss'; // Importar variables de estilo

const Card = ({ 
  children, 
  className = '', 
  ...props 
}) => {
  const baseClass = 'card';
  const classes = `${baseClass} ${className}`;
  
  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

export default Card;