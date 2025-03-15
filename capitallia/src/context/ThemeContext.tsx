import React, { createContext, useState, useEffect, ReactNode } from 'react';

type ThemeType = 'dark';

interface ThemeContextType {
  theme: ThemeType;
  isDark: boolean;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  isDark: true,
  toggleTheme: () => {},
});

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Sempre definido como dark
  const [theme] = useState<ThemeType>('dark');
  const isDark = true;
  
  // Função dummy para toggleTheme (não faz nada já que sempre usamos dark mode)
  const toggleTheme = () => {
    // Mantém sempre o dark mode
    console.log('O modo escuro está ativado permanentemente');
  };

  // Aplica a classe dark-mode ao body
  useEffect(() => {
    document.body.classList.add('dark-mode');
    
    // Aplica estilos globais para scrollbar
    const style = document.createElement('style');
    style.textContent = `
      body {
        background-color: #121212;
      }
      
      ::-webkit-scrollbar {
        width: 10px;
        height: 10px;
      }
      
      ::-webkit-scrollbar-track {
        background: rgba(10, 10, 30, 0.1);
      }
      
      ::-webkit-scrollbar-thumb {
        background: #424242;
        border-radius: 5px;
      }
      
      ::-webkit-scrollbar-thumb:hover {
        background: #555;
      }
    `;
    document.head.appendChild(style);
    
    // Salva o tema no localStorage
    localStorage.setItem('theme', theme);
    
    return () => {
      document.head.removeChild(style);
    };
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider; 