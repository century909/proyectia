import React from 'react';

export default function Loader({ label = 'Loading...' }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
      <span
        className="loader-spinner"
        aria-hidden
        style={{
          width: 20,
          height: 20,
          borderRadius: '9999px',
          border: '3px solid rgba(0,0,0,0.1)',
          borderLeftColor: 'rgba(0,0,0,0.6)',
          animation: 'spin 1s linear infinite',
        }}
      />
      <span aria-live="polite">{label}</span>
    </div>
  );
}



