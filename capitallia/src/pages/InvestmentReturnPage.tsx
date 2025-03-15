import React, { useState, useEffect, useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { formatCurrency, formatPercent } from '../utils/financialCalculations';
import GraphCard from '../components/GraphCard';
import { LineChartIcon, BarChartIcon, PieChartIcon } from '../components/icons/GraphIcons';
import '../styles/GalaxyEffects.css';

// Ícone personalizado para retorno de investimentos
const ReturnIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6 text-white" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

interface Investment {
  id: string;
  name: string;
  initialValue: number;
  monthlyReturn: number;
  color: string;
}

interface ComparisonData {
  month: number;
  [key: string]: number;
}

const InvestmentReturnPage: React.FC = () => {
  const { isDark } = useContext(ThemeContext);
  const [investments, setInvestments] = useState<Investment[]>([
    { id: '1', name: 'Poupança', initialValue: 1000, monthlyReturn: 0.3, color: '#64748b' },
    { id: '2', name: 'Tesouro Selic', initialValue: 1000, monthlyReturn: 0.8, color: '#6366F1' },
    { id: '3', name: 'CDB', initialValue: 1000, monthlyReturn: 0.9, color: '#8b5cf6' }
  ]);

  const [period, setPeriod] = useState<number>(24); // em meses
  const [comparisonData, setComparisonData] = useState<ComparisonData[]>([]);

  const [values, setValues] = useState({
    initialAmount: 10000,
    monthlySavings: 500,
    initialDate: '2023-01',
    finalDate: '2028-01',
    annualReturnRate: 10
  });
  
  const [results, setResults] = useState({
    totalInvested: 0,
    finalBalance: 0,
    totalReturn: 0,
    returnPercentage: 0,
    monthlyData: []
  });

  // Atualizar o título da página para SEO
  useEffect(() => {
    document.title = "Calculadora de Retorno de Investimentos | Capitallia";
    
    // Atualizar meta tags para SEO
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Calcule o retorno dos seus investimentos com diferentes taxas anuais e compare diferentes estratégias de investimento.');
    }
  }, []);

  // Função para adicionar um novo investimento
  const addInvestment = () => {
    const newId = String(investments.length + 1);
    setInvestments([
      ...investments,
      { 
        id: newId, 
        name: `Investimento ${newId}`, 
        initialValue: 1000, 
        monthlyReturn: 0.5, 
        color: getRandomColor() 
      }
    ]);
  };

  // Função para remover um investimento
  const removeInvestment = (id: string) => {
    if (investments.length > 1) {
      setInvestments(investments.filter(inv => inv.id !== id));
    }
  };

  // Função para atualizar os dados de um investimento
  const updateInvestment = (id: string, field: keyof Investment, value: string | number) => {
    setInvestments(
      investments.map(inv => 
        inv.id === id 
          ? { ...inv, [field]: typeof value === 'string' ? value : parseFloat(String(value)) || 0 } 
          : inv
      )
    );
  };

  // Função para calcular a rentabilidade dos investimentos ao longo do tempo
  const calculateReturns = () => {
    const data: ComparisonData[] = [];
    
    for (let month = 0; month <= period; month++) {
      const monthData: ComparisonData = { month };
      
      investments.forEach(inv => {
        // Calculando valor com juros compostos: P * (1 + i)^n
        const value = inv.initialValue * Math.pow(1 + inv.monthlyReturn / 100, month);
        monthData[inv.id] = value;
      });
      
      data.push(monthData);
    }
    
    setComparisonData(data);
  };

  // Gerar uma cor aleatória para novos investimentos
  const getRandomColor = () => {
    const colors = ['#ef4444', '#f97316', '#eab308', '#14b8a6', '#3b82f6', '#a855f7', '#ec4899'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // Calcular retornos quando os valores mudarem
  React.useEffect(() => {
    calculateReturns();
  }, [investments, period]);

  return (
    <div className="min-h-screen text-white flex flex-col items-center px-6 py-16 relative z-10">
      <div className="text-center max-w-4xl mx-auto">
        
        
        <h1 className="text-5xl md:text-6xl font-bold mt-6 mb-6 text-white leading-tight">
          Retorno de 
          <br />
          <span className="bg-gradient-to-r from-pink-500 to-purple-500 text-transparent bg-clip-text">
            Investimentos
          </span>
        </h1>
        
        <p className="text-gray-400 text-xl md:text-2xl max-w-2xl mx-auto mt-6 mb-10">
          Calcule e visualize o retorno dos seus investimentos com diferentes taxas anuais e prazos.
        </p>
      </div>

      <div className="w-full max-w-6xl mx-auto mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulário */}
        <div className="lg:col-span-1 space-y-6">
          <GraphCard 
            title="Configurar Investimentos" 
            icon={<ReturnIcon />}
            description="Adicione e configure seus investimentos"
          >
            <div className="flex justify-between items-center mb-4">
              <div></div>
              <button 
                onClick={addInvestment}
                className="py-2 px-3 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition duration-300"
                disabled={investments.length >= 5}
              >
                Adicionar Investimento
              </button>
            </div>
            
            {investments.map(inv => (
              <div key={inv.id} className="border-t border-gray-700 pt-4 mt-4 first:border-0 first:pt-0 first:mt-0">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center">
                    <div 
                      className="w-4 h-4 rounded-full mr-2" 
                      style={{ backgroundColor: inv.color }}
                    ></div>
                    <input
                      type="text"
                      value={inv.name}
                      onChange={e => updateInvestment(inv.id, 'name', e.target.value)}
                      className="font-medium text-gray-300 bg-transparent border-b border-transparent hover:border-gray-600 focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                  {investments.length > 1 && (
                    <button 
                      onClick={() => removeInvestment(inv.id)}
                      className="text-gray-400 hover:text-red-500"
                      aria-label="Remover investimento"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-3 mb-2">
                  <div>
                    <label htmlFor={`initialValue-${inv.id}`} className="block text-sm font-medium text-gray-400 mb-1">Capital (R$)</label>
                    <input
                      type="number"
                      id={`initialValue-${inv.id}`}
                      value={inv.initialValue}
                      onChange={e => updateInvestment(inv.id, 'initialValue', e.target.value)}
                      className="w-full bg-[#2a2a38] border border-gray-700 rounded-lg px-3 py-2 text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      min="0"
                      step="100"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor={`monthlyReturn-${inv.id}`} className="block text-sm font-medium text-gray-400 mb-1">Rendimento Mensal (%)</label>
                    <input
                      type="number"
                      id={`monthlyReturn-${inv.id}`}
                      value={inv.monthlyReturn}
                      onChange={e => updateInvestment(inv.id, 'monthlyReturn', e.target.value)}
                      className="w-full bg-[#2a2a38] border border-gray-700 rounded-lg px-3 py-2 text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      min="0"
                      step="0.1"
                    />
                  </div>
                </div>
              </div>
            ))}
            
            <div className="mt-6 pt-6 border-t border-gray-700">
              <label htmlFor="period" className="block text-sm font-medium text-gray-400 mb-2">Período (meses)</label>
              <input
                type="range"
                id="period"
                value={period}
                onChange={e => setPeriod(parseInt(e.target.value))}
                className="w-full accent-indigo-600"
                min="6"
                max="120"
                step="6"
              />
              <div className="flex justify-between text-sm text-gray-400 mt-1">
                <span>6 meses</span>
                <span>{period} meses</span>
                <span>10 anos</span>
              </div>
            </div>
          </GraphCard>

          {/* Resumo */}
          <GraphCard 
            title="Comparação Final" 
            icon={<PieChartIcon />}
            description="Resumo dos resultados finais"
          >
            <div className="space-y-3">
              {investments.map(inv => {
                const finalValue = comparisonData.length > 0 
                  ? comparisonData[comparisonData.length - 1][inv.id] 
                  : 0;
                
                const profit = finalValue - inv.initialValue;
                const profitPercentage = (profit / inv.initialValue) * 100;
                
                return (
                  <div key={inv.id} className="border-b border-gray-700 pb-3 last:border-0">
                    <div className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-2" 
                        style={{ backgroundColor: inv.color }}
                      ></div>
                      <p className="font-medium text-gray-300">{inv.name}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      <div>
                        <p className="text-sm text-gray-400">Valor Final</p>
                        <p className="font-semibold text-indigo-400">{formatCurrency(finalValue)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Rendimento</p>
                        <p className="font-semibold text-green-400">
                          +{formatCurrency(profit)} ({profitPercentage.toFixed(2)}%)
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </GraphCard>
        </div>
        
        {/* Gráficos */}
        <div className="lg:col-span-2 space-y-6">
          {/* Gráfico de Linha */}
          <GraphCard 
            title="Evolução do Investimento" 
            icon={<LineChartIcon />}
            description="Visualização do crescimento ao longo do tempo"
          >
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={comparisonData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.5} />
                  <XAxis 
                    dataKey="month" 
                    label={{ 
                      value: 'Meses', 
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
                    labelFormatter={(label) => `Mês ${label}`}
                    contentStyle={{
                      backgroundColor: '#2a2a38', 
                      border: '1px solid #444', 
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)'
                    }}
                  />
                  <Legend 
                    wrapperStyle={{
                      paddingTop: '10px',
                      fontSize: '12px'
                    }}
                  />
                  
                  {investments.map(inv => (
                    <Line 
                      key={inv.id}
                      type="monotone" 
                      dataKey={inv.id} 
                      name={inv.name} 
                      stroke={inv.color} 
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 6 }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </GraphCard>
          
          {/* Gráfico de Barras */}
          <GraphCard 
            title="Comparação Final" 
            icon={<BarChartIcon />}
            description="Valores finais lado a lado"
          >
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={[
                    investments.reduce((obj, inv) => {
                      const finalValue = comparisonData.length > 0 
                        ? comparisonData[comparisonData.length - 1][inv.id] 
                        : 0;
                        
                      return {
                        ...obj,
                        [inv.id]: finalValue,
                        [`${inv.id}_name`]: inv.name
                      };
                    }, {})
                  ]}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.5} />
                  <XAxis dataKey="name" tick={{fill: "#A0A0A0"}} />
                  <YAxis 
                    tickFormatter={(value) => `${formatCurrency(value)}`}
                    tick={{fill: "#A0A0A0"}}
                  />
                  <Tooltip 
                    formatter={(value: number) => [formatCurrency(value), '']}
                    contentStyle={{
                      backgroundColor: '#2a2a38', 
                      border: '1px solid #444', 
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)'
                    }}
                  />
                  <Legend 
                    wrapperStyle={{
                      paddingTop: '10px',
                      fontSize: '12px'
                    }}
                  />
                  
                  {investments.map(inv => (
                    <Bar 
                      key={inv.id}
                      dataKey={inv.id} 
                      name={inv.name} 
                      fill={inv.color} 
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GraphCard>
          
          {/* Tabela de Dados */}
          <GraphCard 
            title="Dados Detalhados" 
            icon={<BarChartIcon />}
            description="Valores em períodos específicos"
          >
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-800 border-b border-gray-700">
                    <th className="px-4 py-2 text-left text-gray-300">Mês</th>
                    {investments.map(inv => (
                      <th key={inv.id} className="px-4 py-2 text-right text-gray-300">
                        <div className="flex items-center justify-end">
                          <div 
                            className="w-3 h-3 rounded-full mr-2" 
                            style={{ backgroundColor: inv.color }}
                          ></div>
                          {inv.name}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comparisonData
                    .filter((_, index) => index % 6 === 0 || index === comparisonData.length - 1)
                    .map(data => (
                      <tr key={data.month} className="border-b border-gray-700 hover:bg-gray-800">
                        <td className="px-4 py-3 text-gray-300">{data.month}</td>
                        {investments.map(inv => (
                          <td key={inv.id} className="px-4 py-3 text-right font-medium text-gray-300">
                            {formatCurrency(data[inv.id])}
                          </td>
                        ))}
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          </GraphCard>
        </div>
      </div>
    </div>
  );
};

export default InvestmentReturnPage; 