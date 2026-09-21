import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  maxStars?: number;
  size?: 'sm' | 'md' | 'lg';
  showNumber?: boolean;
  reviewCount?: number;
  interactive?: boolean;
  onChange?: (rating: number) => void;
}

export function StarRating({
  rating,
  maxStars = 5,
  size = 'md',
  showNumber = true,
  reviewCount,
  interactive = false,
  onChange,
}: StarRatingProps) {
  const sizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-6 h-6',
  };

  return (
    <div className="inline-flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: maxStars }).map((_, idx) => {
          const starValue = idx + 1;
          const isFilled = rating >= starValue;
          const isHalf = !isFilled && rating >= starValue - 0.5;

          return (
            <button
              type="button"
              key={idx}
              disabled={!interactive}
              onClick={() => interactive && onChange?.(starValue)}
              className={interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}
            >
              <Star
                className={`${sizes[size]} ${
                  isFilled
                    ? 'fill-amber-400 text-amber-400'
                    : isHalf
                    ? 'fill-amber-200 text-amber-400'
                    : 'text-slate-300 fill-slate-100'
                }`}
              />
            </button>
          );
        })}
      </div>
      {showNumber && (
        <span className="font-semibold text-slate-900 text-xs sm:text-sm">
          {rating > 0 ? rating.toFixed(1) : 'New'}
        </span>
      )}
      {reviewCount !== undefined && (
        <span className="text-slate-500 text-xs sm:text-sm">({reviewCount})</span>
      )}
    </div>
  );
}
