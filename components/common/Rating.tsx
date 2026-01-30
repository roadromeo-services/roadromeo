import { Star } from 'lucide-react';

interface RatingProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
}

export const Rating = ({
  value,
  max = 5,
  size = 'md',
  showValue = false,
}: RatingProps) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  return (
    <div className="flex items-center gap-1">
      {[...Array(max)].map((_, index) => (
        <Star
          key={index}
          className={`
            ${sizes[size]}
            ${index < Math.round(value)
              ? 'text-yellow-400 fill-yellow-400'
              : 'text-gray-300'
            }
          `}
        />
      ))}
      {showValue && (
        <span className={`ml-1 font-medium text-text-primary ${textSizes[size]}`}>
          {value.toFixed(1)}
        </span>
      )}
    </div>
  );
};
