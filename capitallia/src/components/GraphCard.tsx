import React, { ReactNode } from 'react';

interface GraphCardProps {
  title: string;
  description?: string;
  icon: ReactNode;
  children: ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

const GraphCard: React.FC<GraphCardProps> = ({ 
  title, 
  description, 
  icon, 
  children, 
  className = '',
  hoverEffect = false
}) => {
  return (
    <div 
      className={`
        bg-[#1b1b27]/90 backdrop-blur-sm rounded-2xl overflow-hidden 
        border border-gray-800/70 
        transition-all duration-300 
        ${hoverEffect ? 'hover:border-[#8B5CF6]/50 hover:shadow-lg hover:shadow-[#8B5CF6]/10' : 'hover:border-gray-700'} 
        ${className}
      `}
    >
      <div className="p-6 relative">
        <div className="flex items-start mb-4">
          <div className="h-12 w-12 rounded-full bg-[#2a2a38] flex items-center justify-center flex-shrink-0">
            {icon}
          </div>
          <div className="ml-4">
            <h3 className="text-white text-xl font-semibold">
              {title}
            </h3>
            {description && (
              <p className="text-gray-400 mt-1">{description}</p>
            )}
          </div>
        </div>
        <div className="mt-6 relative">
          {children}
        </div>
      </div>
    </div>
  );
};

export default GraphCard; 