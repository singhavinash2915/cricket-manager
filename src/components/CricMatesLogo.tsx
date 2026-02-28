interface CricMatesLogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
  textClassName?: string;
}

export function CricMatesLogo({ size = 32, className = '', showText = false, textClassName = '' }: CricMatesLogoProps) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <img
        src={`${import.meta.env.BASE_URL}cricmates-logo.jpeg`}
        alt="CricMates"
        width={size}
        height={size}
        className="shrink-0 object-contain"
      />
      {showText && (
        <span className={`font-bold ${textClassName}`}>CricMates</span>
      )}
    </span>
  );
}
