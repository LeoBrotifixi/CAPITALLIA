import React from 'react';

export const LineChartIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6 text-white" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M3 12L7.5 7.5L13 13L17 9L21 13" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M3 18H21" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round"
    />
  </svg>
);

export const BarChartIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6 text-white" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M18 20V10M12 20V4M6 20V14" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

export const PieChartIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6 text-white" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M21.21 15.89C20.5738 17.3945 19.5788 18.7202 18.3119 19.7513C17.0449 20.7824 15.5447 21.4874 13.9424 21.8048C12.3401 22.1221 10.6844 22.0421 9.12012 21.5718C7.55585 21.1015 6.1306 20.2551 4.969 19.1005C3.80739 17.9459 2.94479 16.5264 2.45661 14.9652C1.96843 13.404 1.86954 11.7489 2.16857 10.1448C2.4676 8.54062 3.15547 7.0361 4.17202 5.76115C5.18857 4.48621 6.50286 3.48051 8.00001 2.83"
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M22 12C22 10.6868 21.7413 9.38642 21.2388 8.17317C20.7362 6.95991 19.9997 5.85752 19.0711 4.92893C18.1425 4.00035 17.0401 3.26375 15.8268 2.7612C14.6136 2.25866 13.3132 2 12 2V12H22Z"
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

export const CompositeChartIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6 text-white" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M3 18H21"
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round"
    />
    <path 
      d="M9 9.5L13 13.5L17 9.5"
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <rect x="4" y="10" width="3" height="5" rx="0.5" stroke="currentColor" strokeWidth="2" />
    <rect x="16.5" y="13" width="3" height="2" rx="0.5" stroke="currentColor" strokeWidth="2" />
    <rect x="10.5" y="11" width="3" height="4" rx="0.5" stroke="currentColor" strokeWidth="2" />
  </svg>
);

export const GrowthChartIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6 text-white" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M3 17L9 11L13 15L21 7" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M14 7H21V14" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

export const CurrencyIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6 text-white" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" 
      fill="currentColor"
    />
    <path 
      d="M12.5 7H10.5V11.99L7.75 14.74L9.16 16.15L12.5 12.81V7Z" 
      fill="currentColor"
    />
  </svg>
); 