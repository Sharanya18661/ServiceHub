import React from 'react';

export const Badge = ({ status }) => {
  if (!status) return null;
  const statusLower = status.toString().toLowerCase();

  return (
    <span className={`badge badge-${statusLower}`}>
      {status.replace(/_/g, ' ')}
    </span>
  );
};
