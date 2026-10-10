import React from 'react';
import { Star } from 'lucide-react';

export const StarRating = ({ rating = 0, totalReviews, interactive = false, onRatingChange }) => {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
      {stars.map((star) => {
        const isFilled = star <= Math.round(rating);
        return (
          <Star
            key={star}
            size={18}
            fill={isFilled ? '#f59e0b' : 'none'}
            color={isFilled ? '#f59e0b' : '#64748b'}
            style={{ cursor: interactive ? 'pointer' : 'default', transition: 'transform 0.15s' }}
            onClick={() => interactive && onRatingChange && onRatingChange(star)}
          />
        );
      })}
      {totalReviews !== undefined && (
        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginLeft: '0.35rem' }}>
          {rating.toFixed(1)} ({totalReviews})
        </span>
      )}
    </div>
  );
};
