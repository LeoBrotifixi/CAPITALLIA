import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { ThemeContext } from '../context/ThemeContext';
import { formatCurrency, formatPercent } from '../utils/financialCalculations';
import GraphCard from '../components/GraphCard';
import { LineChartIcon, BarChartIcon, PieChartIcon } from '../components/icons/GraphIcons';
import PageHeader from '../components/PageHeader';
import '../styles/GalaxyEffects.css';

// Ícone de inflação customizado
const InflationIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6 text-white" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

interface FormValues {
  currentValue: number;
  inflationRate: number;
  years: number;
}

interface InflationResult {
  year: number;
  nominalValue: number;
  realValue: number;
  lossPercentage: number;
}

const COLORS = ['#6366F1', '#EC4899'];

const InflationPage: React.FC = () => {
  const { isDark } = useContext(ThemeContext);
  
  const [values, setValues] = useState<FormValues>({
    currentValue: 1000,
    inflationRate: 4.5,
    years: 10
  });

  const [results, setResults] = useState<InflationResult[]>([]);
  const [futureValue, setFutureValue] = useState<number>(0);
  const [purchasingPower, setPurchasingPower] = useState<number>(0);
  const [pieData, setPieData] = useState<{name: string; value: number}[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setValues(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }));
  };

  const calculateInflation = () => {
    const { currentValue, inflationRate, years } = values;
    const inflationMultiplier = 1 + (inflationRate / 100);
    
    const resultData: InflationResult[] = [];
    
    // Valor necessário no futuro para manter o mesmo poder de compra
    const futureVal = currentValue * Math.pow(inflationMultiplier, years);
    setFutureValue(futureVal);
    
    // Poder de compra do valor atual no futuro
    const powerValue = (currentValue / futureVal) * 100;
    setPurchasingPower(powerValue);
    
    // Dados para o gráfico de pizza
    setPieData([
      { name: 'Valor Real', value: currentValue / Math.pow(inflationMultiplier, years) },
      { name: 'Perda por Inflação', value: currentValue - (currentValue / Math.pow(inflationMultiplier, years)) }
    ]);
    
    // Gerar dados para cada ano
    for (let year = 0; year <= years; year++) {
      const nominalValue = currentValue;
      const realValue = currentValue / Math.pow(inflationMultiplier, year);
      const lossPercentage = ((nominalValue - realValue) / nominalValue) * 100;
      
      resultData.push({
        year,
        nominalValue,
        realValue,
        lossPercentage
      });
    }
    
    setResults(resultData);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    calculateInflation();
  };

  useEffect(() => {
    calculateInflation();
    
    // Atualizar título e meta tags para SEO
    document.title = "Calculadora de Inflação | Capitallia";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Calcule o impacto da inflação no seu poder de compra ao longo do tempo e veja quanto valerá seu dinheiro no futuro.');
    }
  }, []);

  return (
    <div className="min-h-screen text-white flex flex-col items-center px-6 py-16 relative z-10">
      <PageHeader 
        title="Calculadora de Inflação" 
        subtitle="Calcule o impacto da inflação no seu poder de compra ao longo do tempo e visualize quanto valerá seu dinheiro no futuro."
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl w-full mx-auto">
        {/* Formulário */}
        <div className="lg:col-span-1">
          <GraphCard title="Simular Inflação" icon={<InflationIcon />} description="Calcule o impacto da inflação">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="currentValue" className="block text-sm font-medium text-gray-300 mb-1">Valor Atual (R$)</label>
                <input
                  type="number"
                  id="currentValue"
                  name="currentValue"
                  value={values.currentValue === 0 ? '' : values.currentValue}
                  onChange={handleInputChange}
                  placeholder="Ex: 1000"
                  className="w-full bg-[#2a2a38] border border-gray-700 rounded-lg px-3 py-2 text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  min="0"
                  step="any"
                />
              </div>
              
              <div>
                <label htmlFor="inflationRate" className="block text-sm font-medium text-gray-300 mb-1">Taxa de Inflação Anual (%)</label>
                <input
                  type="number"
                  id="inflationRate"
                  name="inflationRate"
                  value={values.inflationRate === 0 ? '' : values.inflationRate}
                  onChange={handleInputChange}
                  placeholder="Ex: 5"
                  className="w-full bg-[#2a2a38] border border-gray-700 rounded-lg px-3 py-2 text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  min="0"
                  max="100"
                  step="0.1"
                />
              </div>
              
              <div>
                <label htmlFor="years" className="block text-sm font-medium text-gray-300 mb-1">Período (Anos)</label>
                <input
                  type="number"
                  id="years"
                  name="years"
                  value={values.years === 0 ? '' : values.years}
                  onChange={handleInputChange}
                  placeholder="Ex: 10"
                  className="w-full bg-[#2a2a38] border border-gray-700 rounded-lg px-3 py-2 text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  min="1"
                  max="50"
                  step="1"
                />
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
            title="Impacto da Inflação" 
            icon={<PieChartIcon />}
            description={`Efeito após ${values.years} anos`}
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="text-center p-3 bg-indigo-900/20 rounded-lg border border-indigo-900/30">
                <p className="text-sm text-gray-400 mb-1">Valor Atual</p>
                <p className="text-xl font-semibold text-indigo-400">
                  {formatCurrency(values.currentValue)}
                </p>
              </div>
              <div className="text-center p-3 bg-green-900/20 rounded-lg border border-green-900/30">
                <p className="text-sm text-gray-400 mb-1">Valor Necessário no Futuro</p>
                <p className="text-xl font-semibold text-green-400">
                  {formatCurrency(futureValue)}
                </p>
              </div>
              <div className="text-center p-3 bg-pink-900/20 rounded-lg border border-pink-900/30">
                <p className="text-sm text-gray-400 mb-1">Poder de Compra Restante</p>
                <p className="text-xl font-semibold text-pink-400">
                  {purchasingPower.toFixed(1)}%
                </p>
              </div>
            </div>
          </GraphCard>

          {/* Gráfico */}
          <GraphCard 
            title="Perda de Poder de Compra" 
            icon={<LineChartIcon />}
            description={`Valor real ao longo do tempo com inflação de ${values.inflationRate}% a.a.`}
          >
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={results}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <defs>
                    <linearGradient id="nominalGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366F1" stopOpacity={0.6}/>
                      <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="realGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.6}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.5} />
                  <XAxis 
                    dataKey="year" 
                    label={{
                      value: 'Anos',
                      position: 'insideBottomRight',
                      offset: -10,
                      fill: "#A0A0A0"
                    }}
                    tick={{fill: "#A0A0A0"}}
                  />
                  <YAxis 
                    tickFormatter={(value) => `${formatCurrency(value)}`}
                    label={{
                      value: 'Valor (R$)',
                      angle: -90,
                      position: 'insideLeft',
                      fill: "#A0A0A0"
                    }}
                    tick={{fill: "#A0A0A0"}}
                  />
                  <Tooltip
                    formatter={(value: number) => [formatCurrency(value), '']}
                    labelFormatter={(label) => `Ano ${label}`}
                    contentStyle={{
                      backgroundColor: '#2a2a38', 
                      border: '1px solid #444', 
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)'
                    }}
                    itemStyle={{padding: '4px 0'}}
                  />
                  <Legend 
                    wrapperStyle={{
                      paddingTop: '10px',
                      fontSize: '12px'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="nominalValue"
                    name="Valor Nominal"
                    stroke="#6366F1"
                    fill="url(#nominalGradient)"
                    fillOpacity={1}
                    strokeWidth={2}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="realValue"
                    name="Valor Real"
                    stroke="#10B981"
                    fill="url(#realGradient)"
                    fillOpacity={1}
                    strokeWidth={2}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GraphCard>

          {/* Tabela de Dados */}
          <GraphCard 
            title="Tabela de Valores Detalhados" 
            icon={<BarChartIcon />}
            description="Evolução do valor real do dinheiro ao longo dos anos"
          >
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-800 border-b border-gray-700">
                    <th className="px-4 py-2 text-left text-gray-300">Ano</th>
                    <th className="px-4 py-2 text-right text-gray-300">Valor Nominal (R$)</th>
                    <th className="px-4 py-2 text-right text-gray-300">Valor Real (R$)</th>
                    <th className="px-4 py-2 text-right text-gray-300">Perda de Valor (%)</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result, index) => (
                    <tr key={index} className="border-b border-gray-700 hover:bg-gray-800">
                      <td className="px-4 py-3 text-gray-300">{result.year}</td>
                      <td className="px-4 py-3 text-right text-indigo-400">{formatCurrency(result.nominalValue)}</td>
                      <td className="px-4 py-3 text-right text-green-400">{formatCurrency(result.realValue)}</td>
                      <td className="px-4 py-3 text-right text-pink-400">{result.lossPercentage.toFixed(2)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GraphCard>

          {/* Informações adicionais */}
          <GraphCard 
            title="Sobre a Inflação" 
            icon={<BarChartIcon />}
            description="Como a inflação afeta seu dinheiro"
          >
            <div className="prose prose-sm max-w-none text-gray-300">
              <p>
                A inflação é o aumento geral nos preços de bens e serviços ao longo do tempo, reduzindo o poder de compra da moeda.
              </p>
              <blockquote className="italic border-l-4 pl-4 my-4 border-purple-700 bg-purple-900/10 p-3 rounded-r-lg text-gray-300">
                "A inflação é o imposto que não precisa ser legislado." — Milton Friedman
              </blockquote>
              <p>
                É importante considerar o efeito da inflação em qualquer planejamento financeiro de longo prazo, especialmente para metas como aposentadoria.
              </p>
              <p>
                Para proteger seu dinheiro da inflação, considere investimentos que tradicionalmente oferecem retornos acima da inflação, como ações, imóveis e títulos indexados à inflação.
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
            to="/juros-compostos" 
            className="bg-gray-800 px-8 py-4 text-lg rounded-xl shadow-lg hover:bg-gray-700 font-medium transition-all"
          >
            Calcular juros compostos
          </Link>
        </div>
      </div>
    </div>
  );
};

export default InflationPage; 