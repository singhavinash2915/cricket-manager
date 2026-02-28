interface CricMatesLogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
  textClassName?: string;
}

export function CricMatesLogo({ size = 32, className = '', showText = false, textClassName = '' }: CricMatesLogoProps) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" width={size} height={size} className="shrink-0">
        <circle cx="32" cy="32" r="32" fill="#10b981"/>
        <circle cx="32" cy="32" r="27" fill="#059669"/>
        <path d="M22 16 Q16 32 22 48" stroke="#fbbf24" strokeWidth="2" fill="none" strokeLinecap="round"/>
        <path d="M42 16 Q48 32 42 48" stroke="#fbbf24" strokeWidth="2" fill="none" strokeLinecap="round"/>
        <text x="32" y="38" textAnchor="middle" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="800" fontSize="20" fill="white" letterSpacing="-1">CM</text>
      </svg>
      {showText && (
        <span className={`font-bold ${textClassName}`}>CricMates</span>
      )}
    </span>
  );
}
