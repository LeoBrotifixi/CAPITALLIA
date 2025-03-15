import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle: string;
  gradient?: boolean;
}

const PageHeader: React.FC<PageHeaderProps> = ({ 
  title, 
  subtitle,
  gradient = true 
}) => {
  // Divide o título em duas partes se contiver um espaço
  const titleParts = title.split(' ');
  const firstPart = titleParts.slice(0, -1).join(' ');
  const lastPart = titleParts.slice(-1)[0];

  return (
    <div className="text-center max-w-4xl mx-auto mb-16">
      <h1 className="text-5xl md:text-6xl font-bold mt-6 mb-6 text-white leading-tight">
        {firstPart && `${firstPart} `}
        <br />
        {gradient ? (
          <span className="bg-gradient-to-r from-pink-500 to-purple-500 text-transparent bg-clip-text">
            {lastPart}
          </span>
        ) : (
          <span>{lastPart}</span>
        )}
      </h1>
      
      <p className="text-gray-400 text-xl md:text-2xl max-w-2xl mx-auto mt-6">
        {subtitle}
      </p>
    </div>
  );
};

export default PageHeader; 