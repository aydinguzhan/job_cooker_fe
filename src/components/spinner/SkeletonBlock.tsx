type SkeletonBlockProps = {
  className?: string;
};

export default function SkeletonBlock({
  className = "",
}: SkeletonBlockProps) {
  return (
    <div
      className={`animate-pulse rounded-2xl bg-[linear-gradient(90deg,rgba(148,163,184,0.16)_0%,rgba(148,163,184,0.28)_50%,rgba(148,163,184,0.16)_100%)] ${className}`}
    />
  );
}
