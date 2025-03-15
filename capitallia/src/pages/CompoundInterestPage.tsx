import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
import GraphCard from '../components/GraphCard';
import PageHeader from '../components/PageHeader';
import { formatCurrency, formatPercent } from '../utils/financialCalculations';
import '../styles/GalaxyEffects.css';
import LineChartComponent from '../components/charts/LineChartComponent';
import PieChartComponent from '../components/charts/PieChartComponent';
import { LineChartIcon, GrowthChartIcon, PieChartIcon } from '../components/icons/GraphIcons';

// Ícone de calculadora
const CalcIcon = () => (
  <div className="p-2 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full">
    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
    </svg>
  </div>
);

interface FormValues {
  initialCapital: number;
  monthlyContribution: number;
  interestRate: number;
  interestRateType: 'monthly' | 'yearly';
  period: number;
  periodType: 'months' | 'years';
  conversionMethod: 'exact' | 'simple';
}

interface ResultItem {
  period: number;
  capital: number;
  contributions: number;
  interest: number;
  balance: number;
}

const CompoundInterestPage: React.FC = () => {
  const { isDark } = useContext(ThemeContext);
  const [values, setValues] = useState<FormValues>({
    initialCapital: 1000,
    monthlyContribution: 100,
    interestRate: 1.0,
    interestRateType: 'yearly',
    period: 10,
    periodType: 'years',
    conversionMethod: 'exact'
  });
  const [results, setResults] = useState<ResultItem[]>([]);
  const [finalValues, setFinalValues] = useState({
    totalInvested: 0,
    totalInterest: 0,
    finalBalance: 0,
    interestPercentage: 0,
  });

  // Função para calcular juros compostos
  const calculateCompoundInterest = () => {
    // Converter taxa de juros anual para mensal se necessário
    let monthlyRate = values.interestRate;
    
    if (values.interestRateType === 'yearly') {
      if (values.conversionMethod === 'exact') {
        // Método exato (matemático): (1 + i)^(1/12) - 1
        monthlyRate = Math.pow(1 + values.interestRate / 100, 1 / 12) - 1;
        monthlyRate *= 100;
      } else {
        // Método simplificado (comercial): i / 12
        monthlyRate = values.interestRate / 12;
      }
    }
    
    // Converter taxa para decimal
    monthlyRate = monthlyRate / 100;
    
    // Converter período para meses se necessário
    const totalMonths = values.periodType === 'years' ? values.period * 12 : values.period;
    
    // Inicializar resultados
    const results: ResultItem[] = [];
    let balance = values.initialCapital;
    let totalContributions = 0;
    let interestEarned = 0;
    
    // Calcular para cada período
    let yearlyResults: ResultItem[] = [];
    
    for (let month = 1; month <= totalMonths; month++) {
      // Capital atual
      const currentCapital = balance;
      
      // Juros deste mês
      const monthlyInterest = currentCapital * monthlyRate;
      
      // Adicionar aporte mensal
      balance += values.monthlyContribution;
      
      // Adicionar juros
      balance += monthlyInterest;
      
      // Atualizar totais
      totalContributions += values.monthlyContribution;
      interestEarned += monthlyInterest;
      
      // Registrar resultados
      if (values.periodType === 'years' && month % 12 === 0) {
        yearlyResults.push({
          period: month / 12,
          capital: values.initialCapital,
          contributions: totalContributions,
          interest: interestEarned,
          balance: balance
        });
      } else if (values.periodType === 'months') {
        results.push({
          period: month,
          capital: values.initialCapital,
          contributions: totalContributions,
          interest: interestEarned,
          balance: balance
        });
      }
    }
    
    // Usar resultados anuais ou mensais dependendo da seleção
    const finalResults = values.periodType === 'years' ? yearlyResults : results;
    
    // Atualizar estados
    setResults(finalResults);
    
    // Valores finais para exibição
    setFinalValues({
      totalInvested: values.initialCapital + totalContributions,
      totalInterest: interestEarned,
      finalBalance: balance,
      interestPercentage: (interestEarned / balance) * 100,
    });
  };

  // Função para lidar com o envio do formulário
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    calculateCompoundInterest();
  };

  // Função para lidar com mudanças nos campos
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Convertendo para o tipo correto
    if (name === 'initialCapital' || name === 'monthlyContribution' || name === 'interestRate' || name === 'period') {
      setValues({
        ...values,
        [name]: parseFloat(value) || 0
      });
    } else {
      setValues({
        ...values,
        [name]: value
      });
    }
  };

  // Atualizar o título da página para SEO
  useEffect(() => {
    document.title = "Calculadora de Juros Compostos | Capitallia";
    
    // Atualizar meta tags para SEO
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Calcule o crescimento exponencial dos seus investimentos com nossa calculadora de juros compostos avançada.');
    }
  }, []);

  return (
    <div className="min-h-screen text-white flex flex-col items-center px-6 py-16 relative z-10">
      <PageHeader 
        title="Juros Compostos" 
        subtitle="Simule o crescimento dos seus investimentos com o poder dos juros compostos e visualize projeções detalhadas."
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl w-full mx-auto">
        {/* Formulário */}
        <div className="lg:col-span-1">
          <GraphCard 
            title="Simulação de Investimento" 
            icon={<LineChartIcon />}
            description="Configure os parâmetros para calcular os resultados"
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="initialCapital" className="block text-sm font-medium text-gray-300 mb-1">Capital Inicial (R$)</label>
                <input
                  type="number"
                  id="initialCapital"
                  name="initialCapital"
                  value={values.initialCapital === 0 ? '' : values.initialCapital}
                  onChange={handleChange}
                  placeholder="Ex: 1000"
                  className="w-full bg-[#2a2a38] border border-gray-700 rounded-lg px-3 py-2 text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  min="0"
                  step="any"
                />
              </div>
              
              <div>
                <label htmlFor="monthlyContribution" className="block text-sm font-medium text-gray-300 mb-1">Aporte Mensal (R$)</label>
                <input
                  type="number"
                  id="monthlyContribution"
                  name="monthlyContribution"
                  value={values.monthlyContribution === 0 ? '' : values.monthlyContribution}
                  onChange={handleChange}
                  placeholder="Ex: 100"
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
                    onChange={handleChange}
                    placeholder="Ex: 1.0"
                    className="w-full bg-[#2a2a38] border border-gray-700 rounded-lg px-3 py-2 text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    min="0"
                    step="any"
                  />
                  <select
                    id="interestRateType"
                    name="interestRateType"
                    value={values.interestRateType}
                    onChange={handleChange}
                    className="w-full bg-[#2a2a38] border border-gray-700 rounded-lg px-3 py-2 text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="yearly">Anual</option>
                    <option value="monthly">Mensal</option>
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
                    onChange={handleChange}
                    placeholder="Ex: 10"
                    className="w-full bg-[#2a2a38] border border-gray-700 rounded-lg px-3 py-2 text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    min="1"
                    step="1"
                  />
                  <select
                    id="periodType"
                    name="periodType"
                    value={values.periodType}
                    onChange={handleChange}
                    className="w-full bg-[#2a2a38] border border-gray-700 rounded-lg px-3 py-2 text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="years">Anos</option>
                    <option value="months">Meses</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label htmlFor="conversionMethod" className="block text-sm font-medium text-gray-300 mb-1">Método de Conversão</label>
                <select
                  id="conversionMethod"
                  name="conversionMethod"
                  value={values.conversionMethod}
                  onChange={handleChange}
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
            title="Resumo do Investimento" 
            icon={<PieChartIcon />}
            description={`Após ${values.period} ${values.periodType === 'years' ? 'anos' : 'meses'}`}
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="text-center p-3 bg-indigo-900/20 rounded-lg border border-indigo-900/30">
                <p className="text-sm text-gray-400 mb-1">Total Investido</p>
                <p className="text-xl font-semibold text-indigo-400">
                  {formatCurrency(finalValues.totalInvested)}
                </p>
              </div>
              <div className="text-center p-3 bg-green-900/20 rounded-lg border border-green-900/30">
                <p className="text-sm text-gray-400 mb-1">Juros Totais</p>
                <p className="text-xl font-semibold text-green-400">
                  {formatCurrency(finalValues.totalInterest)}
                </p>
              </div>
              <div className="text-center p-3 bg-purple-900/20 rounded-lg border border-purple-900/30">
                <p className="text-sm text-gray-400 mb-1">Montante Final</p>
                <p className="text-xl font-semibold text-purple-400">
                  {formatCurrency(finalValues.finalBalance)}
                </p>
              </div>
            </div>

            {/* Gráfico de pizza para mostrar distribuição */}
            {results.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-medium text-white mb-3">Distribuição do Montante Final</h3>
                <div className="mt-2 h-72">
                  <PieChartComponent 
                    data={[
                      { name: 'Capital Inicial', value: values.initialCapital },
                      { name: 'Aportes Mensais', value: finalValues.totalInvested - values.initialCapital },
                      { name: 'Juros', value: finalValues.totalInterest }
                    ]}
                    height={280}
                    formatter={(value) => [formatCurrency(value), '']}
                    legendPosition="right"
                  />
                </div>
                <div className="mt-3 grid grid-cols-3 gap-3">
                  <div className="flex items-center">
                    <span className="w-3 h-3 rounded-full bg-indigo-500 mr-2"></span>
                    <span className="text-sm text-gray-300">
                      Capital: {((values.initialCapital / finalValues.finalBalance) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-3 h-3 rounded-full bg-purple-500 mr-2"></span>
                    <span className="text-sm text-gray-300">
                      Aportes: {(((finalValues.totalInvested - values.initialCapital) / finalValues.finalBalance) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-3 h-3 rounded-full bg-pink-500 mr-2"></span>
                    <span className="text-sm text-gray-300">
                      Juros: {((finalValues.totalInterest / finalValues.finalBalance) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            )}
          </GraphCard>

          {/* Gráfico */}
          <GraphCard 
            title="Evolução do Investimento" 
            icon={<LineChartIcon />}
            description="Visualização do crescimento ao longo do tempo"
          >
            <div className="h-80">
              {results.length > 0 && (
                <LineChartComponent
                  data={results}
                  xAxisDataKey="period"
                  xAxisLabel={values.periodType === 'years' ? 'Anos' : 'Meses'}
                  yAxisLabel="Valor (R$)"
                  series={[
                    {
                      dataKey: 'balance',
                      name: 'Montante',
                      strokeWidth: 3,
                      color: '#6366F1',
                      activeDotSize: 6
                    },
                    {
                      dataKey: 'contributions',
                      name: 'Aportes',
                      color: '#10B981'
                    },
                    {
                      dataKey: 'interest',
                      name: 'Juros',
                      color: '#EC4899'
                    }
                  ]}
                  tooltipFormatter={(value) => [formatCurrency(value), '']}
                  tooltipLabelFormatter={(label) => `${values.periodType === 'years' ? 'Ano' : 'Mês'} ${label}`}
                  height={320}
                />
              )}
            </div>
          </GraphCard>

          {/* Crescimento */}
          <GraphCard 
            title="Análise de Crescimento" 
            icon={<GrowthChartIcon />}
            description="Fator de multiplicação do capital inicial"
          >
            <div className="prose prose-sm max-w-none text-gray-300">
              <p>
                Os juros compostos são uma das forças mais poderosas no universo financeiro. Albert Einstein chegou a chamá-los de "a oitava maravilha do mundo".
              </p>
              <blockquote className="italic border-l-4 pl-4 my-4 border-purple-700 bg-purple-900/10 p-3 rounded-r-lg text-gray-300">
                "Aquele que entende os juros compostos, ganha; aquele que não entende, paga." — Albert Einstein
              </blockquote>
              <p>
                A magia dos juros compostos está no efeito de crescimento exponencial, onde não apenas o capital inicial rende juros, mas também os juros anteriormente acumulados.
              </p>
            </div>
          </GraphCard>
        </div>
      </div>

      {/* CTA Final */}
      <div className="text-center max-w-3xl mx-auto mt-24 mb-12">
        <h2 className="text-3xl md:text-4xl font-semibold mb-6 text-white">Comece a planejar seu futuro financeiro hoje</h2>
        <p className="text-xl max-w-3xl mx-auto mb-10 text-gray-400">
          Use nossas calculadoras gratuitas para tomar decisões financeiras mais inteligentes e construir um futuro próspero.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link 
            to="/calculadora" 
            className="bg-gradient-to-r from-pink-500 to-purple-500 px-8 py-4 text-lg rounded-xl shadow-lg hover:opacity-90 font-medium transition-all"
          >
            Explorar calculadoras
          </Link>
          <Link 
            to="/comparacao-investimentos" 
            className="bg-gray-800 px-8 py-4 text-lg rounded-xl shadow-lg hover:bg-gray-700 font-medium transition-all"
          >
            Comparar investimentos
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CompoundInterestPage; 