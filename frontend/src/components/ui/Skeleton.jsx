import React from 'react';

export default function Skeleton({ 
  width = '100%', 
  height = '1rem', 
  className = '',
  variant = 'text' 
}) {
  const baseClass = 'skeleton';
  const variantClass = `skeleton--${variant}`;
  
  return (
    <div 
      className={`${baseClass} ${variantClass} ${className}`}
      style={{ width, height }}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <Skeleton variant="avatar" width="60px" height="60px" className="skeleton-card__avatar" />
      <div className="skeleton-card__content">
        <Skeleton height="1.25rem" width="70%" className="skeleton-card__title" />
        <Skeleton height="0.875rem" width="90%" className="skeleton-card__description" />
      </div>
    </div>
  );
}

export function SkeletonList({ count = 3 }) {
  return (
    <div className="skeleton-list">
      {Array.from({ length: count }, (_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

