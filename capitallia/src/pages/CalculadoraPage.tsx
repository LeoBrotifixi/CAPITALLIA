import React, { useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
import GraphCard from '../components/GraphCard';
import PageHeader from '../components/PageHeader';
import PieChartComponent from '../components/charts/PieChartComponent';
import '../styles/GalaxyEffects.css';

// Ícones
import { MoneyIcon, ChartIcon, PiggyBankIcon, InflationIcon, CalcIcon, HomeIcon } from '../components/icons/FinancialIcons';
import { PieChartIcon } from '../components/icons/GraphIcons';

// Dados para os gráficos de pizza
const tipoDados = [
  { name: 'Juros Compostos', value: 30 },
  { name: 'Juros Simples', value: 15 },
  { name: 'Rentabilidade', value: 20 },
  { name: 'Conversão de Taxas', value: 10 },
  { name: 'Financiamento', value: 15 },
  { name: 'Inflação', value: 10 }
];

const CalculadoraPage: React.FC = () => {
  const { isDark } = useContext(ThemeContext);
  
  // Atualizar o título da página para SEO
  useEffect(() => {
    document.title = "Calculadoras Financeiras | Capitallia";
    
    // Atualizar meta tags para SEO
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Acesse calculadoras financeiras para simular investimentos, financiamentos e tomar decisões financeiras mais inteligentes.');
    }
  }, []);

  // Estilo personalizado para garantir altura uniforme dos cartões
  const cardStyle = {
    height: '100%',
    display: 'flex',
    flexDirection: 'column' as const
  };

  // Estilo para o conteúdo interno do cartão que deve ser flexível
  const cardContentStyle = {
    flex: '1',
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'space-between'
  };

  return (
    <div className="min-h-screen text-white flex flex-col items-center px-6 py-16 relative z-10">
      <PageHeader 
        title="Calculadoras Financeiras" 
        subtitle="Utilize nossas calculadoras financeiras para simular diferentes cenários e tomar decisões financeiras informadas."
      />

      {/* Gráfico de Distribuição */}
      <GraphCard 
        title="Categorias de Calculadoras" 
        icon={<PieChartIcon />}
        description="Distribuição das ferramentas disponíveis para planejamento financeiro"
        className="max-w-6xl w-full mx-auto mb-10"
      >
        <div className="md:grid md:grid-cols-2 gap-8 items-center">
          <div className="h-[280px]">
            <PieChartComponent 
              data={tipoDados}
              height={280}
              legendPosition="right"
            />
          </div>
          <div className="text-gray-300 mt-6 md:mt-0">
            <h3 className="text-xl font-medium mb-3 text-white">Planeje seu futuro financeiro</h3>
            <p className="mb-4">
              Nossa plataforma disponibiliza diversas calculadoras financeiras para ajudar você a tomar decisões de investimento mais inteligentes.
            </p>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 mr-2"></span>
                <span><strong className="text-indigo-400">Juros Compostos:</strong> Calcule o crescimento exponencial do seu dinheiro ao longo do tempo.</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 mr-2"></span>
                <span><strong className="text-purple-400">Rentabilidade:</strong> Compare a rentabilidade real de diferentes investimentos.</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-pink-400 mt-2 mr-2"></span>
                <span><strong className="text-pink-400">Financiamento:</strong> Simule parcelas e juros em diferentes modelos de financiamento.</span>
              </li>
            </ul>
          </div>
        </div>
      </GraphCard>

      {/* Grid de calculadoras */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mt-12">
        <Link to="/juros-compostos" className="no-underline text-white h-full">
          <div style={cardStyle}>
            <GraphCard title="Juros Compostos" icon={<MoneyIcon />} description="Calcule o crescimento exponencial do seu dinheiro" className="h-full">
              <div style={cardContentStyle}>
                <p className="text-gray-400">
                  Descubra como seus investimentos crescem ao longo do tempo com o poder dos juros compostos.
                </p>
                <div className="mt-4 text-indigo-400 font-medium">
                  Acessar calculadora →
                </div>
              </div>
            </GraphCard>
          </div>
        </Link>
        
        <Link to="/juros-simples" className="no-underline text-white h-full">
          <div style={cardStyle}>
            <GraphCard title="Juros Simples" icon={<CalcIcon />} description="Calcule rendimentos lineares" className="h-full">
              <div style={cardContentStyle}>
                <p className="text-gray-400">
                  Calcule juros que incidem apenas sobre o valor principal em operações de curto prazo.
                </p>
                <div className="mt-4 text-indigo-400 font-medium">
                  Acessar calculadora →
                </div>
              </div>
            </GraphCard>
          </div>
        </Link>
        
        <Link to="/rentabilidade" className="no-underline text-white h-full">
          <div style={cardStyle}>
            <GraphCard title="Rentabilidade Real" icon={<ChartIcon />} description="Rentabilidade descontando a inflação" className="h-full">
              <div style={cardContentStyle}>
                <p className="text-gray-400">
                  Descubra o valor real dos seus ganhos após o impacto da inflação nos seus rendimentos.
                </p>
                <div className="mt-4 text-purple-400 font-medium">
                  Acessar calculadora →
                </div>
              </div>
            </GraphCard>
          </div>
        </Link>
        
        <Link to="/conversao-taxas" className="no-underline text-white h-full">
          <div style={cardStyle}>
            <GraphCard title="Conversão de Taxas" icon={<PiggyBankIcon />} description="Converta entre diferentes períodos" className="h-full">
              <div style={cardContentStyle}>
                <p className="text-gray-400">
                  Transforme taxas entre diferentes períodos (diária, mensal, anual) para comparar investimentos.
                </p>
                <div className="mt-4 text-purple-400 font-medium">
                  Acessar calculadora →
                </div>
              </div>
            </GraphCard>
          </div>
        </Link>
        
        <Link to="/financiamento" className="no-underline text-white h-full">
          <div style={cardStyle}>
            <GraphCard title="Financiamento" icon={<HomeIcon />} description="Simule prestações e juros" className="h-full">
              <div style={cardContentStyle}>
                <p className="text-gray-400">
                  Planeje suas finanças calculando valores de prestações e juros em diferentes modelos de financiamento.
                </p>
                <div className="mt-4 text-pink-400 font-medium">
                  Acessar calculadora →
                </div>
              </div>
            </GraphCard>
          </div>
        </Link>
        
        <Link to="/inflacao" className="no-underline text-white h-full">
          <div style={cardStyle}>
            <GraphCard title="Inflação" icon={<InflationIcon />} description="Impacto da inflação no seu dinheiro" className="h-full">
              <div style={cardContentStyle}>
                <p className="text-gray-400">
                  Entenda como a inflação reduz o poder de compra do seu dinheiro ao longo do tempo.
                </p>
                <div className="mt-4 text-pink-400 font-medium">
                  Acessar calculadora →
                </div>
              </div>
            </GraphCard>
          </div>
        </Link>
      </div>

      {/* Call to action */}
      <div className="mt-20 text-center">
        <h2 className="text-2xl font-semibold mb-4">Comece a planejar seu futuro financeiro hoje</h2>
        <p className="text-gray-400 max-w-2xl mx-auto mb-6">
          Nossas calculadoras são desenvolvidas para ajudar você a tomar decisões financeiras mais inteligentes e visualizar cenários complexos de forma simples.
        </p>
        <Link 
          to="/destaques" 
          className="bg-gradient-to-r from-pink-500 to-purple-500 px-8 py-3 rounded-xl shadow-lg hover:opacity-90 font-medium transition-all"
        >
          Explorar mais recursos
        </Link>
      </div>
    </div>
  );
};

export default CalculadoraPage; 