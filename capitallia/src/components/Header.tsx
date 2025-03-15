import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
import CapitalliaLogo from './CapitalliaLogo';

const Header: React.FC = () => {
  const { isDark: isDarkTheme } = useContext(ThemeContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-[#121218]/90 backdrop-blur-md shadow-lg' : 'bg-[#121218]'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <CapitalliaLogo width={180} height={40} />
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/destaques" 
              className={`text-sm font-medium transition-colors flex items-center ${
                isActive('/destaques') ? 'text-indigo-400' : 'text-gray-300 hover:text-indigo-400'
              }`}
            >
              Destaques
            </Link>
            <Link 
              to="/juros-compostos" 
              className={`text-sm font-medium transition-colors ${
                isActive('/juros-compostos') ? 'text-indigo-400' : 'text-gray-300 hover:text-indigo-400'
              }`}
            >
              Juros Compostos
            </Link>
            <Link 
              to="/juros-simples" 
              className={`text-sm font-medium transition-colors ${
                isActive('/juros-simples') ? 'text-indigo-400' : 'text-gray-300 hover:text-indigo-400'
              }`}
            >
              Juros Simples
            </Link>
            <Link 
              to="/rentabilidade" 
              className={`text-sm font-medium transition-colors ${
                isActive('/rentabilidade') ? 'text-purple-400' : 'text-gray-300 hover:text-purple-400'
              }`}
            >
              Rentabilidade
            </Link>
            <Link 
              to="/conversao-taxas" 
              className={`text-sm font-medium transition-colors ${
                isActive('/conversao-taxas') ? 'text-purple-400' : 'text-gray-300 hover:text-purple-400'
              }`}
            >
              Conversão de Taxas
            </Link>
            <Link 
              to="/financiamento" 
              className={`text-sm font-medium transition-colors ${
                isActive('/financiamento') ? 'text-pink-400' : 'text-gray-300 hover:text-pink-400'
              }`}
            >
              Financiamento
            </Link>
            <Link 
              to="/inflacao" 
              className={`text-sm font-medium transition-colors ${
                isActive('/inflacao') ? 'text-pink-400' : 'text-gray-300 hover:text-pink-400'
              }`}
            >
              Inflação
            </Link>
            <Link 
              to="/calculadora" 
              className={`text-sm font-medium transition-colors ${
                isActive('/calculadora') ? 'text-green-400' : 'text-gray-300 hover:text-green-400'
              }`}
            >
              Calculadoras
            </Link>
          </nav>

          <div className="flex items-center md:hidden">
            {/* Mobile Menu Button */}
            <button 
              className="text-gray-300 focus:outline-none"
              onClick={toggleMenu}
              aria-label={isMenuOpen ? 'Fechar menu' : 'Abrir menu'}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-gray-800 animate-fadeIn">
            <nav className="space-y-4">
              <Link 
                to="/destaques" 
                className={`block text-sm font-medium transition-colors flex items-center ${
                  isActive('/destaques') ? 'text-indigo-400' : 'text-gray-300 hover:text-indigo-400'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Destaques
              </Link>
              <Link 
                to="/juros-compostos" 
                className={`block text-sm font-medium transition-colors ${isActive('/juros-compostos') ? 'text-indigo-400' : 'text-gray-300 hover:text-indigo-400'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Juros Compostos
              </Link>
              <Link 
                to="/juros-simples" 
                className={`block text-sm font-medium transition-colors ${isActive('/juros-simples') ? 'text-indigo-400' : 'text-gray-300 hover:text-indigo-400'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Juros Simples
              </Link>
              <Link 
                to="/rentabilidade" 
                className={`block text-sm font-medium transition-colors ${isActive('/rentabilidade') ? 'text-purple-400' : 'text-gray-300 hover:text-purple-400'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Rentabilidade
              </Link>
              <Link 
                to="/conversao-taxas" 
                className={`block text-sm font-medium transition-colors ${isActive('/conversao-taxas') ? 'text-purple-400' : 'text-gray-300 hover:text-purple-400'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Conversão de Taxas
              </Link>
              <Link 
                to="/financiamento" 
                className={`block text-sm font-medium transition-colors ${isActive('/financiamento') ? 'text-pink-400' : 'text-gray-300 hover:text-pink-400'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Financiamento
              </Link>
              <Link 
                to="/inflacao" 
                className={`block text-sm font-medium transition-colors ${isActive('/inflacao') ? 'text-pink-400' : 'text-gray-300 hover:text-pink-400'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Inflação
              </Link>
              <Link 
                to="/calculadora" 
                className={`block text-sm font-medium transition-colors ${isActive('/calculadora') ? 'text-green-400' : 'text-gray-300 hover:text-green-400'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Calculadoras
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header; 