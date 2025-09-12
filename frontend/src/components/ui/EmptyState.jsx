import React from 'react';
import Button from './Button';

export default function EmptyState({ 
  icon = '📭', 
  title = 'No hay elementos', 
  description = 'No se encontraron elementos para mostrar.',
  actionLabel,
  onAction,
  className = ''
}) {
  return (
    <div className={`empty-state ${className}`}>
      <div className="empty-state__icon">{icon}</div>
      <h3 className="empty-state__title">{title}</h3>
      <p className="empty-state__description">{description}</p>
      {actionLabel && onAction && (
        <Button 
          variant="primary" 
          onClick={onAction}
          className="empty-state__action"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

