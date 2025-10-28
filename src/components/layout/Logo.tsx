interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function Logo({ size = 'md', className = '' }: LogoProps) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
  };

  return (
    <div
      className={`flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm border border-white/20 ${sizeClasses[size]} ${className}`}
    >
      <img
        src="./logo.webp"
        alt="Father's Home Church Logo"
        className="w-full h-full object-contain rounded-full"
      />
    </div>
  );
}
