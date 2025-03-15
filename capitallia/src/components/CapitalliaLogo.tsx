import React from 'react';

interface CapitalliaLogoProps {
  className?: string;
  textColor?: string;
  width?: number;
  height?: number;
}

const CapitalliaLogo: React.FC<CapitalliaLogoProps> = ({ 
  className = '', 
  textColor = 'text-white', 
  width = 200, 
  height = 50 
}) => {
  return (
    <div className={`flex items-center ${className}`} style={{ width, height }}>
      {/* Ícone/Símbolo do logo */}
      <div className="mr-2">
        <svg 
          viewBox="0 0 40 40" 
          width="40" 
          height="40" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d="M10 30L20 20L30 30M10 20L20 10L30 20" 
            stroke="url(#logo-gradient)" 
            strokeWidth="3" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
          <defs>
            <linearGradient id="logo-gradient" x1="10" y1="30" x2="30" y2="10" gradientUnits="userSpaceOnUse">
              <stop stopColor="#ec4899" />
              <stop offset="1" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      
      {/* Nome Capitallia */}
      <div className={`font-bold text-2xl tracking-wide ${textColor}`}>
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500">
          CAPITALLIA
        </span>
      </div>
    </div>
  );
};

export default CapitalliaLogo; 