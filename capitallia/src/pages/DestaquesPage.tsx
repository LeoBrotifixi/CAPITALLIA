import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/GalaxyEffects.css";
import GraphCard from "../components/GraphCard";

// Ícones para os cards
const MoneyIcon: React.FC<{ className?: string }> = ({ className = "w-7 h-7 text-white" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ChartIcon: React.FC<{ className?: string }> = ({ className = "w-7 h-7 text-white" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const PieChartIcon: React.FC<{ className?: string }> = ({ className = "w-7 h-7 text-white" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
  </svg>
);

const CalcIcon: React.FC<{ className?: string }> = ({ className = "w-7 h-7 text-white" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
  </svg>
);

const PiggyBankIcon: React.FC<{ className?: string }> = ({ className = "w-7 h-7 text-white" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const InflationIcon: React.FC<{ className?: string }> = ({ className = "w-7 h-7 text-white" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

const DestaquesPage: React.FC = () => {
  // Atualizar o título da página para SEO
  useEffect(() => {
    document.title = "Destaques | Capitallia - Calculadoras Financeiras Inteligentes";
    
    // Atualizar meta tags para SEO
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Descubra os destaques das ferramentas financeiras avançadas do Capitallia para melhorar suas decisões de investimento.');
    }
  }, []);

  return (
    <div className="min-h-screen text-white flex flex-col items-center px-6 py-16 relative z-10">
      <div className="text-center max-w-4xl mx-auto mb-16">
        <h1 className="text-5xl md:text-6xl font-bold mt-6 mb-6 text-white leading-tight">
          Destaques 
          <br />
          <span className="bg-gradient-to-r from-pink-500 to-purple-500 text-transparent bg-clip-text">
            Financeiros
          </span>
        </h1>
        
        <p className="text-gray-400 text-xl md:text-2xl max-w-2xl mx-auto mt-6">
          Explore nossos conteúdos financeiros mais populares e ferramentas que vão ajudar você a tomar decisões de investimento inteligentes.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-4 mt-8">
        <Link 
          to="/calculadora" 
          className="bg-gradient-to-r from-pink-500 to-purple-500 px-8 py-4 text-lg rounded-xl shadow-lg hover:opacity-90 font-medium transition-all"
        >
          Começar agora
        </Link>
        <Link 
          to="/juros-compostos" 
          className="bg-gray-800 px-8 py-4 text-lg rounded-xl shadow-lg hover:bg-gray-700 font-medium transition-all"
        >
          Explorar recursos
        </Link>
      </div>

      {/* Cards de recursos usando GraphCard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mt-24">
        <GraphCard 
          title="Juros Compostos" 
          description="Crie simulações precisas para visualizar o crescimento exponencial do seu dinheiro ao longo do tempo."
          icon={<MoneyIcon />}
        >
          <div className="mt-2">
            <Link 
              to="/juros-compostos" 
              className="text-[#8B5CF6] hover:text-[#A78BFA] flex items-center font-medium"
            >
              Saiba mais
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </GraphCard>
        
        <GraphCard 
          title="Comparação de Investimentos" 
          description="Compare diferentes opções de investimentos lado a lado para tomar decisões mais inteligentes."
          icon={<ChartIcon />}
        >
          <div className="mt-2">
            <Link 
              to="/comparacao-investimentos" 
              className="text-[#8B5CF6] hover:text-[#A78BFA] flex items-center font-medium"
            >
              Saiba mais
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </GraphCard>
        
        <GraphCard 
          title="Rentabilidade" 
          description="Visualize o impacto a longo prazo das suas decisões financeiras e acompanhe o crescimento dos seus investimentos."
          icon={<PieChartIcon />}
        >
          <div className="mt-2">
            <Link 
              to="/rentabilidade" 
              className="text-[#8B5CF6] hover:text-[#A78BFA] flex items-center font-medium"
            >
              Saiba mais
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </GraphCard>
        
        <GraphCard 
          title="Calculadora Financeira" 
          description="Realize cálculos financeiros complexos de forma simples e rápida, com visualização intuitiva dos resultados."
          icon={<CalcIcon />}
        >
          <div className="mt-2">
            <Link 
              to="/calculadora" 
              className="text-[#8B5CF6] hover:text-[#A78BFA] flex items-center font-medium"
            >
              Saiba mais
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </GraphCard>
        
        <GraphCard 
          title="Financiamentos" 
          description="Simule e compare diferentes tipos de financiamentos para encontrar a melhor opção para seu perfil."
          icon={<PiggyBankIcon />}
        >
          <div className="mt-2">
            <Link 
              to="/financiamento" 
              className="text-[#8B5CF6] hover:text-[#A78BFA] flex items-center font-medium"
            >
              Saiba mais
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </GraphCard>
        
        <GraphCard 
          title="Inflação" 
          description="Calcule o impacto da inflação no seu poder de compra ao longo do tempo e planeje seus investimentos."
          icon={<InflationIcon />}
        >
          <div className="mt-2">
            <Link 
              to="/inflacao" 
              className="text-[#8B5CF6] hover:text-[#A78BFA] flex items-center font-medium"
            >
              Saiba mais
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </GraphCard>
      </div>
    </div>
  );
};

export default DestaquesPage; 