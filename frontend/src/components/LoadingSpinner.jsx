import React from 'react';

export const LoadingSpinner = ({ fullScreen = false, message = "Loading ServiceHub..." }) => {
  const spinnerStyle = {
    width: '40px',
    height: '40px',
    border: '3px solid rgba(99, 102, 241, 0.2)',
    borderTop: '3px solid var(--accent-primary)',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  };

  const containerStyle = fullScreen
    ? {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        gap: '1rem',
      }
    : {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        gap: '1rem',
      };

  return (
    <div style={containerStyle}>
      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      <div style={spinnerStyle}></div>
      <span style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{message}</span>
    </div>
  );
};
