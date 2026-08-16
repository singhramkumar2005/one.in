import React from 'react';
import { Link } from 'react-router-dom';

const BrandLogo = ({
  className = '',
  size = 'md', // 'sm' | 'md' | 'lg'
  to = '/',
  showTagline = false
}) => {
  // Height configurations
  const heightClasses = {
    sm: 'h-6 sm:h-7',
    md: 'h-8 sm:h-9',
    lg: 'h-10 sm:h-12'
  };

  const textClasses = {
    sm: 'text-base sm:text-lg',
    md: 'text-xl sm:text-2xl',
    lg: 'text-2xl sm:text-3xl'
  };

  const dotInClasses = {
    sm: 'text-xs sm:text-sm',
    md: 'text-sm sm:text-base',
    lg: 'text-base sm:text-lg'
  };

  const logoContent = (
    <div className={`inline-flex items-center gap-1.5 group select-none ${className}`}>
      {/* Logo Image with Light/Dark support */}
      <div className="relative flex items-center">
        <img
          src="/logo.png"
          alt="ONE"
          className={`${heightClasses[size] || heightClasses.md} w-auto object-contain transition-transform group-hover:scale-105 block dark:hidden`}
        />
        <img
          src="/logo_white.png"
          alt="ONE"
          className={`${heightClasses[size] || heightClasses.md} w-auto object-contain transition-transform group-hover:scale-105 hidden dark:block`}
        />
      </div>

      {/* Right side .in Text */}
      <div className="flex flex-col justify-center">
        <div className="flex items-baseline">
          <span className={`font-black tracking-tight text-[#8E4CF6] dark:text-[#C49CFF] ${dotInClasses[size] || dotInClasses.md} -ml-0.5 font-sans leading-none`}>
            .in
          </span>
        </div>
        {showTagline && (
          <span className="text-[10px] font-semibold text-[#6B7082] dark:text-[#A9A2BA] tracking-wider uppercase -mt-0.5">
            Exam Workspace
          </span>
        )}
      </div>
    </div>
  );

  if (!to) {
    return logoContent;
  }

  return (
    <Link to={to} className="inline-flex items-center focus:outline-none">
      {logoContent}
    </Link>
  );
};

export default BrandLogo;
