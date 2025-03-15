import React, { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import '../styles/GalaxyEffects.css';

// Ícones personalizados para substituir os do react-icons
const SunIcon: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="12" 
    height="12" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <circle cx="12" cy="12" r="5"></circle>
    <line x1="12" y1="1" x2="12" y2="3"></line>
    <line x1="12" y1="21" x2="12" y2="23"></line>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
    <line x1="1" y1="12" x2="3" y2="12"></line>
    <line x1="21" y1="12" x2="23" y2="12"></line>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
  </svg>
);

const MoonIcon: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="12" 
    height="12" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
  </svg>
);

interface ThemeToggleProps {
  className?: string;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '' }) => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      className={`flex items-center justify-center p-2 rounded-full transition-all duration-300 neon-button ${className}`}
      aria-label={isDark ? 'Ativar modo claro' : 'Ativar modo escuro'}
    >
      <div className="relative w-10 h-5 bg-gray-300 dark:bg-gray-700 rounded-full shadow-inner overflow-hidden">
        <div
          className={`absolute top-0 left-0 w-5 h-5 rounded-full shadow-md transform transition-transform duration-300
            ${isDark ? 'translate-x-5 bg-indigo-500' : 'translate-x-0 bg-yellow-400'}`}
        />
        <div className="absolute inset-0 flex items-center justify-between px-1 pointer-events-none">
          <SunIcon className="text-yellow-500" />
          <MoonIcon className="text-indigo-500" />
        </div>
      </div>
      <span className={`ml-2 text-sm ${isDark ? 'neon-purple' : ''}`}>
        {isDark ? 'Modo Galáctico' : 'Modo Claro'}
      </span>
    </button>
  );
};

export default ThemeToggle; 