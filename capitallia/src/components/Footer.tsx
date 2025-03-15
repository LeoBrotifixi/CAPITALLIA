import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
import CapitalliaLogo from './CapitalliaLogo';

const Footer: React.FC = () => {
  const { isDark: isDarkTheme } = useContext(ThemeContext);
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#121218] text-white py-12 relative z-10 border-t border-gray-800">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="mb-4">
              <CapitalliaLogo width={220} height={60} />
            </div>
            <p className="text-gray-400 mb-4">
              Ferramentas financeiras para ajudar a planejar seu futuro com segurança e conhecimento.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-indigo-400 mb-4">Calculadoras</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/juros-compostos" className="text-gray-400 hover:text-indigo-400 transition-colors">
                  Juros Compostos
                </Link>
              </li>
              <li>
                <Link to="/juros-simples" className="text-gray-400 hover:text-indigo-400 transition-colors">
                  Juros Simples
                </Link>
              </li>
              <li>
                <Link to="/rentabilidade" className="text-gray-400 hover:text-indigo-400 transition-colors">
                  Rentabilidade
                </Link>
              </li>
              <li>
                <Link to="/comparacao-investimentos" className="text-gray-400 hover:text-indigo-400 transition-colors">
                  Comparação de Investimentos
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-pink-400 mb-4">Outras Ferramentas</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/conversao-taxas" className="text-gray-400 hover:text-pink-400 transition-colors">
                  Conversão de Taxas
                </Link>
              </li>
              <li>
                <Link to="/financiamento" className="text-gray-400 hover:text-pink-400 transition-colors">
                  Financiamento
                </Link>
              </li>
              <li>
                <Link to="/inflacao" className="text-gray-400 hover:text-pink-400 transition-colors">
                  Inflação
                </Link>
              </li>
              <li>
                <Link to="/calculadora" className="text-gray-400 hover:text-pink-400 transition-colors">
                  Todas as Calculadoras
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-purple-400 mb-4">Contato</h4>
            <p className="text-gray-400 mb-2">
              contato@capitallia.com.br
            </p>
            <div className="flex space-x-4 mt-4">
              <a 
                href="#" 
                aria-label="Facebook"
                className="text-gray-400 hover:text-indigo-400 transition-all"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a 
                href="#" 
                aria-label="Twitter"
                className="text-gray-400 hover:text-blue-400 transition-all"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a 
                href="#" 
                aria-label="LinkedIn"
                className="text-gray-400 hover:text-pink-400 transition-all"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-8 text-center text-gray-500">
          <p>&copy; {currentYear} Capitallia. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 