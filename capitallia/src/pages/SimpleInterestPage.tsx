import React, { useState, useEffect, useContext } from 'react';
import { formatCurrency } from '../utils/financialCalculations';
import { ThemeContext } from '../context/ThemeContext';
import GraphCard from '../components/GraphCard';
import { PieChartIcon, LineChartIcon, BarChartIcon } from '../components/icons/GraphIcons';
import PieChartComponent from '../components/charts/PieChartComponent';
import PageHeader from '../components/PageHeader';
import '../styles/GalaxyEffects.css';

// Ícone personalizado para juros
const InterestIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6 text-white" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

interface FormValues {
  principal: number;
  interestRate: number;
  interestRateType: 'monthly' | 'yearly';
  conversionMethod: 'exact' | 'simple';
  period: number;
  periodType: 'months' | 'years';
}

const SimpleInterestPage: React.FC = () => {
  const { isDark } = useContext(ThemeContext);
  const [values, setValues] = useState<FormValues>({
    principal: 1000,
    interestRate: 1.0,
    interestRateType: 'monthly',
    conversionMethod: 'exact',
    period: 12,
    periodType: 'months'
  });

  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [totalInterest, setTotalInterest] = useState<number>(0);
  const [pieData, setPieData] = useState<{name: string; value: number}[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setValues(prev => ({
      ...prev,
      [name]: name === 'periodType' || name === 'interestRateType' || name === 'conversionMethod' ? value : parseFloat(value) || 0
    }));
  };

  const calculateSimpleInterest = () => {
    const { principal, interestRate, interestRateType, conversionMethod, period, periodType } = values;
    
    // Converter período para meses, se necessário
    const totalPeriod = periodType === 'years' ? period * 12 : period;
    
    // Converter taxa anual para mensal dependendo do método escolhido
    let monthlyRate;
    if (interestRateType === 'yearly') {
      if (conversionMethod === 'exact') {
        // Método exato (matemático): (1 + taxa anual)^(1/12) - 1
        monthlyRate = (interestRate / 100) / 12;
      } else {
        // Método simplificado (comercial): taxa anual / 12
        monthlyRate = (interestRate / 100) / 12;
      }
    } else {
      monthlyRate = interestRate / 100;
    }
    
    // Cálculo de juros simples (Principal * Taxa * Tempo)
    const interest = principal * monthlyRate * totalPeriod;
    const amount = principal + interest;
    
    setTotalAmount(amount);
    setTotalInterest(interest);
    
    // Atualizar dados para o gráfico de pizza
    setPieData([
      { name: 'Capital Inicial', value: principal },
      { name: 'Juros', value: interest }
    ]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    calculateSimpleInterest();
  };

  useEffect(() => {
    calculateSimpleInterest();
    
    // Atualizar título e meta tags para SEO
    document.title = "Calculadora de Juros Simples | Capitallia";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Calcule juros simples para seus empréstimos ou investimentos e visualize o crescimento linear ao longo do tempo.');
    }
  }, []);

  return (
    <div className="min-h-screen text-white flex flex-col items-center px-6 py-16 relative z-10">
      <PageHeader 
        title="Juros Simples" 
        subtitle="Calcule juros simples para seus empréstimos ou investimentos e visualize o crescimento linear ao longo do tempo."
      />

      <div className="w-full max-w-6xl mx-auto mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulário */}
        <div className="lg:col-span-1">
          <GraphCard title="Simular Juros Simples" icon={<InterestIcon />} description="Calcule os juros simples sobre um capital">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="principal" className="block text-sm font-medium text-gray-300 mb-1">Capital Inicial (R$)</label>
                <input
                  type="number"
                  id="principal"
                  name="principal"
                  value={values.principal === 0 ? '' : values.principal}
                  onChange={handleInputChange}
                  placeholder="Ex: 1000"
                  className="w-full bg-[#2a2a38] border border-gray-700 rounded-lg px-3 py-2 text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  min="0"
                  step="any"
                />
              </div>
              
              <div>
                <label htmlFor="interestRate" className="block text-sm font-medium text-gray-300 mb-1">Taxa de Juros (%)</label>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="number"
                    id="interestRate"
                    name="interestRate"
                    value={values.interestRate === 0 ? '' : values.interestRate}
                    onChange={handleInputChange}
                    placeholder="Ex: 1.0"
                    className="w-full bg-[#2a2a38] border border-gray-700 rounded-lg px-3 py-2 text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    min="0"
                    step="any"
                  />
                  <select
                    id="interestRateType"
                    name="interestRateType"
                    value={values.interestRateType}
                    onChange={handleInputChange}
                    className="w-full bg-[#2a2a38] border border-gray-700 rounded-lg px-3 py-2 text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="monthly">Mensal</option>
                    <option value="yearly">Anual</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label htmlFor="period" className="block text-sm font-medium text-gray-300 mb-1">Período</label>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="number"
                    id="period"
                    name="period"
                    value={values.period === 0 ? '' : values.period}
                    onChange={handleInputChange}
                    placeholder="Ex: 12"
                    className="w-full bg-[#2a2a38] border border-gray-700 rounded-lg px-3 py-2 text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    min="1"
                    step="1"
                  />
                  <select
                    id="periodType"
                    name="periodType"
                    value={values.periodType}
                    onChange={handleInputChange}
                    className="w-full bg-[#2a2a38] border border-gray-700 rounded-lg px-3 py-2 text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="months">Meses</option>
                    <option value="years">Anos</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label htmlFor="conversionMethod" className="block text-sm font-medium text-gray-300 mb-1">Método de Conversão</label>
                <select
                  id="conversionMethod"
                  name="conversionMethod"
                  value={values.conversionMethod}
                  onChange={handleInputChange}
                  className="w-full bg-[#2a2a38] border border-gray-700 rounded-lg px-3 py-2 text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="exact">Exato (Matemático)</option>
                  <option value="simple">Simplificado (Comercial)</option>
                </select>
              </div>
              
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full py-3 px-6 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 shadow-lg shadow-indigo-500/20"
                >
                  Calcular
                </button>
              </div>
            </form>
          </GraphCard>
        </div>

        {/* Resultados */}
        <div className="lg:col-span-2 space-y-6">
          {/* Resumo */}
          <GraphCard 
            title="Resultado da Simulação" 
            icon={<PieChartIcon />}
            description={`Juros simples após ${values.period} ${values.periodType === 'years' ? 'anos' : 'meses'}`}
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="text-center p-3 bg-indigo-900/20 rounded-lg border border-indigo-900/30">
                <p className="text-sm text-gray-400 mb-1">Capital Inicial</p>
                <p className="text-xl font-semibold text-indigo-400">
                  {formatCurrency(values.principal)}
                </p>
              </div>
              <div className="text-center p-3 bg-pink-900/20 rounded-lg border border-pink-900/30">
                <p className="text-sm text-gray-400 mb-1">Juros Acumulados</p>
                <p className="text-xl font-semibold text-pink-400">
                  {formatCurrency(totalInterest)}
                </p>
              </div>
              <div className="text-center p-3 bg-green-900/20 rounded-lg border border-green-900/30">
                <p className="text-sm text-gray-400 mb-1">Montante Final</p>
                <p className="text-xl font-semibold text-green-400">
                  {formatCurrency(totalAmount)}
                </p>
              </div>
            </div>
          </GraphCard>

          {/* Gráfico */}
          <GraphCard 
            title="Composição do Montante" 
            icon={<PieChartIcon />}
            description="Distribuição entre capital e juros"
          >
            <div className="h-72">
              <PieChartComponent
                data={pieData}
                height={280}
                formatter={(value) => [formatCurrency(value), '']}
                legendPosition="right"
              />
            </div>
          </GraphCard>

          {/* Informações */}
          <GraphCard 
            title="Sobre Juros Simples" 
            icon={<BarChartIcon />}
            description="Informações sobre o cálculo"
          >
            <div className="prose prose-sm max-w-none text-gray-300">
              <p>
                Juros simples são calculados apenas sobre o capital inicial, sem considerar os juros acumulados 
                em períodos anteriores.
              </p>
              <p>
                A fórmula utilizada é: <span className="font-medium">J = P × i × n</span>, onde:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>J</strong> = juros</li>
                <li><strong>P</strong> = principal (capital inicial)</li>
                <li><strong>i</strong> = taxa de juros (por período)</li>
                <li><strong>n</strong> = número de períodos</li>
              </ul>
              <blockquote className="italic border-l-4 pl-4 my-4 border-purple-700 bg-purple-900/10 p-3 rounded-r-lg text-gray-300">
                "Os juros simples são frequentemente utilizados em empréstimos de curto prazo ou em situações onde os juros são pagos periodicamente."
              </blockquote>
              <p>
                Para investimentos de longo prazo, os juros compostos geralmente oferecem retornos significativamente maiores.
              </p>
            </div>
          </GraphCard>
        </div>
      </div>
    </div>
  );
};

export default SimpleInterestPage; 