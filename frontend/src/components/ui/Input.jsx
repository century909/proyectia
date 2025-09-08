import React from 'react';
import '../../index.scss'; // Importar variables de estilo

const Input = ({ 
  label, 
  id, 
  error, 
  className = '', 
  ...props 
}) => {
  const baseClass = 'input';
  const errorClass = error ? 'input--error' : '';
  const classes = `${baseClass} ${errorClass} ${className}`;
  
  return (
    <div className="input-container">
      {label && (
        <label htmlFor={id} className="input-label">
          {label}
        </label>
      )}
      <input
        id={id}
        className={classes}
        {...props}
      />
      {error && (
        <p className="input-error">{error}</p>
      )}
    </div>
  );
};

export default Input;