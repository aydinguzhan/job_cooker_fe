type StarIconProps = {
  className?: string;
  size?: number;
  filled: boolean;
};

type RatingStarsProps = {
  level: number;
};

function StarIcon({ className = "", size = 16, filled }: StarIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      className={className}
    >
      <path d="M11.48 3.5l2.1 5.11 5.52.44-4.2 3.6 1.28 5.39-4.73-2.89-4.73 2.89 1.28-5.39-4.2-3.6 5.52-.44z" />
    </svg>
  );
}
export default function RatingStars({ level }: RatingStarsProps) {
  return (
    <div className="flex gap-1 shrink-0">
      {Array.from({ length: 5 }).map((_, i) => (
        <StarIcon
          key={i}
          filled={i < level}
          className={i < level ? "text-yellow-400" : "text-gray-300"}
        />
      ))}
    </div>
  );
}
