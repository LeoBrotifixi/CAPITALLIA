import React, { ReactNode } from 'react';
import '../styles/GalaxyEffects.css';

interface GlowCardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  hoverEffect?: boolean;
}

const GlowCard: React.FC<GlowCardProps> = ({ 
  children, 
  className = '', 
  title,
  hoverEffect = false
}) => {
  return (
    <div className={`glow-border backdrop-blur-sm transition-all duration-300 ${hoverEffect ? 'hover:scale-[1.02] hover:shadow-xl' : ''} ${className}`}>
      <div className="p-6">
        {title && (
          <h2 className="text-xl font-medium mb-4 text-gray-100 relative">
            <div className="relative inline-block">
              <div className="absolute top-0 left-0 w-full h-full bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-blue-500 blur-sm">
                {title}
              </div>
              <div className="relative bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-blue-500">
                {title}
              </div>
            </div>
          </h2>
        )}
        {children}
      </div>
    </div>
  );
};

export default GlowCard; 