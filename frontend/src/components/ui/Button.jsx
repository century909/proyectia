import React from 'react';
import '../../index.scss'; // Importar variables de estilo

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  disabled = false, 
  className = '', 
  ...props 
}) => {
  // Las clases ahora se aplican a través de Sass
  const baseClass = 'btn';
  
  const classes = `${baseClass} ${baseClass}--${variant} ${baseClass}--${size} ${disabled ? `${baseClass}--disabled` : ''} ${className}`;
  
  return (
    <button 
      className={classes} 
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;