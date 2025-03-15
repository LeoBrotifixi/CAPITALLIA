import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { ThemeContext } from '../context/ThemeContext';
import GraphCard from '../components/GraphCard';
import { LineChartIcon, PieChartIcon } from '../components/icons/GraphIcons';
import { formatCurrency, formatPercent } from '../utils/financialCalculations';
import '../styles/GalaxyEffects.css';

interface Investment {
  id: string;
  name: string;
  returnRate: number;
  returnRateType: 'monthly' | 'yearly';
  conversionMethod: 'exact' | 'simple';  // Novo campo para método de conversão
  riskLevel: number; // 1-5
  liquidityLevel: number; // 1-5
  taxEfficiency: number; // 1-5
  color: string;
}

interface FormValues {
  initialAmount: number;
  monthlyContribution: number;
  years: number;
}

interface ComparisonResult {
  year: number;
  [key: string]: number;
}

const DEFAULT_INVESTMENTS: Investment[] = [
  { 
    id: 'poupanca', 
    name: 'Poupança', 
    returnRate: 4.2,
    returnRateType: 'yearly',
    conversionMethod: 'exact',
    riskLevel: 1, 
    liquidityLevel: 5, 
    taxEfficiency: 4,
    color: '#4ade80'
  },
  { 
    id: 'cdb', 
    name: 'CDB (110% CDI)', 
    returnRate: 8.3,
    returnRateType: 'yearly',
    conversionMethod: 'exact',
    riskLevel: 2, 
    liquidityLevel: 3, 
    taxEfficiency: 2,
    color: '#60a5fa'
  },
  { 
    id: 'tesouroDireto', 
    name: 'Tesouro IPCA+', 
    returnRate: 6.5,
    returnRateType: 'yearly',
    conversionMethod: 'exact',
    riskLevel: 2, 
    liquidityLevel: 4, 
    taxEfficiency: 3,
    color: '#f97316'
  },
  { 
    id: 'fundoImobiliario', 
    name: 'Fundos Imobiliários', 
    returnRate: 10.5,
    returnRateType: 'yearly',
    conversionMethod: 'exact',
    riskLevel: 3, 
    liquidityLevel: 3, 
    taxEfficiency: 5,
    color: '#c084fc'
  },
  { 
    id: 'acoes', 
    name: 'Ações', 
    returnRate: 12.0,
    returnRateType: 'yearly',
    conversionMethod: 'exact',
    riskLevel: 4, 
    liquidityLevel: 5, 
    taxEfficiency: 3,
    color: '#f43f5e'
  }
];

// Ícone de comparação
const CompareIcon: React.FC<{ className?: string }> = ({ className = "w-7 h-7 text-white" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

// Ícone de radar/análise
const RadarIcon: React.FC<{ className?: string }> = ({ className = "w-7 h-7 text-white" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19l-7-7 7-7m8 14l-7-7 7-7" />
  </svg>
);

const InvestmentComparisonPage: React.FC = () => {
  const { isDark } = useContext(ThemeContext);
  const [investments, setInvestments] = useState<Investment[]>(DEFAULT_INVESTMENTS);
  const [activeInvestments, setActiveInvestments] = useState<{ [key: string]: boolean }>({
    poupanca: true,
    cdb: true,
    tesouroDireto: true,
    fundoImobiliario: true,
    acoes: true
  });
  const [formValues, setFormValues] = useState<FormValues>({
    initialAmount: 10000,
    monthlyContribution: 500,
    years: 10
  });
  const [results, setResults] = useState<ComparisonResult[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newInvestment, setNewInvestment] = useState<Omit<Investment, 'id'>>({
    name: '',
    returnRate: 0,
    returnRateType: 'yearly',
    conversionMethod: 'exact',
    riskLevel: 3,
    liquidityLevel: 3,
    taxEfficiency: 3,
    color: '#' + Math.floor(Math.random()*16777215).toString(16)
  });

  const colors = ['#4ade80', '#60a5fa', '#f97316', '#8b5cf6', '#ec4899', '#facc15', '#06b6d4', '#ef4444'];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setFormValues(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }));
  };

  const handleInvestmentChange = (id: string, field: keyof Investment, value: any) => {
    setInvestments(prev =>
      prev.map(inv =>
        inv.id === id
          ? { ...inv, [field]: field === 'name' || field === 'returnRateType' || field === 'conversionMethod' ? value : parseFloat(value) || 0 }
          : inv
      )
    );
  };

  const handleDeleteInvestment = (id: string) => {
    setInvestments(prev => prev.filter(inv => inv.id !== id));
  };

  const handleNewInvestmentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setNewInvestment(prev => ({
      ...prev,
      [name]: name === 'name' || name === 'returnRateType' || name === 'conversionMethod' ? value : parseFloat(value) || 0
    }));
  };

  const handleAddInvestment = () => {
    if (newInvestment.name && newInvestment.returnRate > 0) {
      const newId = `custom-${Date.now()}`;
      const colorIndex = investments.length % colors.length;
      
      setInvestments(prev => [
        ...prev, 
        { 
          ...newInvestment, 
          id: newId, 
          color: colors[colorIndex] 
        }
      ]);
      
      setNewInvestment({
        name: '',
        returnRate: 0,
        returnRateType: 'yearly',
        conversionMethod: 'exact',
        riskLevel: 3,
        liquidityLevel: 3,
        taxEfficiency: 3,
        color: '#' + Math.floor(Math.random()*16777215).toString(16)
      });
      
      setShowAddForm(false);
    }
  };

  const calculateComparison = () => {
    const { initialAmount, monthlyContribution, years } = formValues;
    const results: ComparisonResult[] = [{ year: 0 }];
    
    // Initialize year 0 values
    investments.forEach(inv => {
      results[0][inv.id] = initialAmount;
    });
    
    // Calculate each year's value for each investment
    for (let year = 1; year <= years; year++) {
      const yearData: ComparisonResult = { year };
      
      investments.forEach(inv => {
        // Converter taxa anual para mensal dependendo do método escolhido
        let monthlyRate;
        if (inv.returnRateType === 'yearly') {
          if (inv.conversionMethod === 'exact') {
            // Método exato (matemático): (1 + taxa anual)^(1/12) - 1
            monthlyRate = Math.pow(1 + inv.returnRate / 100, 1/12) - 1;
          } else {
            // Método simplificado (comercial): taxa anual / 12
            monthlyRate = (inv.returnRate / 100) / 12;
          }
        } else {
          monthlyRate = inv.returnRate / 100;
        }
        
        const previousValue = results[year - 1][inv.id];
        let currentValue = previousValue;
        
        // Simular os 12 meses deste ano
        for (let month = 1; month <= 12; month++) {
          // Adicionar o aporte mensal
          currentValue += monthlyContribution;
          // Aplicar o rendimento
          currentValue *= (1 + monthlyRate);
        }
        
        yearData[inv.id] = currentValue;
      });
      
      results.push(yearData);
    }
    
    setResults(results);
  };

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    calculateComparison();
  };

  useEffect(() => {
    document.title = "Comparação de Investimentos | Capitallia";
    
    // Atualizar meta tags para SEO
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Compare diferentes opções de investimentos lado a lado e visualize o crescimento potencial do seu patrimônio ao longo do tempo.');
    }
    
    calculateComparison();
  }, [formValues, investments, activeInvestments]);

  const getRadarData = () => {
    return investments.map(inv => ({
      name: inv.name,
      "Rentabilidade": (inv.returnRate / Math.max(...investments.map(i => i.returnRate))) * 100,
      "Risco": (6 - inv.riskLevel) * 20, // Invertido: menor risco = maior valor
      "Liquidez": inv.liquidityLevel * 20,
      "Eficiência Tributária": inv.taxEfficiency * 20,
      color: inv.color
    }));
  };

  const formatTooltipValue = (value: number, name: string, props: any) => {
    if (name === 'year') return value;
    const investment = investments.find(inv => inv.id === name);
    if (investment) {
      return [formatCurrency(value), investment.name];
    }
    return [value, name];
  };

  return (
    <div className="min-h-screen text-white flex flex-col items-center px-6 py-16 relative z-10">
      <div className="text-center max-w-4xl mx-auto">
        
        
        <h1 className="text-5xl md:text-6xl font-bold mt-6 mb-6 text-white leading-tight">
          Comparação de 
          <br />
          <span className="bg-gradient-to-r from-pink-500 to-purple-500 text-transparent bg-clip-text">
            Investimentos
          </span>
        </h1>
        
        <p className="text-gray-400 text-xl md:text-2xl max-w-2xl mx-auto mt-6 mb-10">
          Compare diferentes opções de investimentos lado a lado e visualize o crescimento potencial do seu patrimônio.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl w-full mx-auto">
        {/* Formulário */}
        <div className="lg:col-span-1 space-y-6">
          <GraphCard 
            title="Parâmetros da Simulação" 
            icon={<CompareIcon />}
            description="Configure os valores iniciais"
          >
            <form onSubmit={handleCalculate} className="space-y-4">
              <div>
                <label htmlFor="initialAmount" className="label">Valor Inicial (R$)</label>
                <input
                  type="number"
                  id="initialAmount"
                  name="initialAmount"
                  className="input"
                  value={formValues.initialAmount}
                  onChange={handleInputChange}
                  min="0"
                  step="1000"
                />
              </div>
              
              <div>
                <label htmlFor="monthlyContribution" className="label">Aporte Mensal (R$)</label>
                <input
                  type="number"
                  id="monthlyContribution"
                  name="monthlyContribution"
                  className="input"
                  value={formValues.monthlyContribution}
                  onChange={handleInputChange}
                  min="0"
                  step="100"
                />
              </div>
              
              <div>
                <label htmlFor="years" className="label">Período (anos)</label>
                <input
                  type="range"
                  id="years"
                  name="years"
                  className="w-full"
                  min="1"
                  max="30"
                  step="1"
                  value={formValues.years}
                  onChange={handleInputChange}
                />
                <div className="flex justify-between text-sm text-secondary-600 mt-1">
                  <span>1 ano</span>
                  <span>{formValues.years} anos</span>
                  <span>30 anos</span>
                </div>
              </div>
            </form>
          </GraphCard>
          
          <GraphCard 
            title="Investimentos" 
            icon={<PieChartIcon />}
            description="Gerencie os ativos para comparação"
          >
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <button 
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="bg-indigo-600 hover:bg-indigo-700 transition text-white py-2 px-4 rounded-lg text-sm"
                >
                  {showAddForm ? 'Cancelar' : 'Adicionar Investimento'}
                </button>
              </div>
              
              {showAddForm && (
                <div className="bg-[#2a2a38]/50 p-4 rounded-lg mb-4 border border-gray-800/70">
                  <h3 className="text-lg font-medium mb-3">Novo Investimento</h3>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="label">Nome</label>
                      <input
                        type="text"
                        name="name"
                        className="input"
                        value={newInvestment.name}
                        onChange={handleNewInvestmentChange}
                      />
                    </div>
                    
                    <div>
                      <label className="label">Taxa de Retorno Anual (%)</label>
                      <input
                        type="number"
                        name="returnRate"
                        className="input"
                        value={newInvestment.returnRate}
                        onChange={handleNewInvestmentChange}
                        step="0.1"
                        min="0"
                      />
                    </div>
                    
                    <div>
                      <label className="label">Tipo de Taxa de Retorno</label>
                      <select
                        name="returnRateType"
                        className="input"
                        value={newInvestment.returnRateType}
                        onChange={handleNewInvestmentChange}
                      >
                        <option value="yearly">Anual</option>
                        <option value="monthly">Mensal</option>
                      </select>
                    </div>
                    
                    {newInvestment.returnRateType === 'yearly' && (
                      <div>
                        <label className="label">Método de Conversão</label>
                        <select
                          name="conversionMethod"
                          className="input"
                          value={newInvestment.conversionMethod}
                          onChange={handleNewInvestmentChange}
                        >
                          <option value="exact">Método Exato</option>
                          <option value="simple">Método Simplificado</option>
                        </select>
                      </div>
                    )}
                    
                    <div>
                      <label className="label">Nível de Risco (1-5)</label>
                      <input
                        type="range"
                        name="riskLevel"
                        className="w-full"
                        min="1"
                        max="5"
                        step="1"
                        value={newInvestment.riskLevel}
                        onChange={handleNewInvestmentChange}
                      />
                      <div className="flex justify-between text-sm text-secondary-600">
                        <span>Baixo</span>
                        <span>Médio</span>
                        <span>Alto</span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="label">Liquidez (1-5)</label>
                      <input
                        type="range"
                        name="liquidityLevel"
                        className="w-full"
                        min="1"
                        max="5"
                        step="1"
                        value={newInvestment.liquidityLevel}
                        onChange={handleNewInvestmentChange}
                      />
                      <div className="flex justify-between text-sm text-secondary-600">
                        <span>Baixa</span>
                        <span>Média</span>
                        <span>Alta</span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="label">Eficiência Tributária (1-5)</label>
                      <input
                        type="range"
                        name="taxEfficiency"
                        className="w-full"
                        min="1"
                        max="5"
                        step="1"
                        value={newInvestment.taxEfficiency}
                        onChange={handleNewInvestmentChange}
                      />
                      <div className="flex justify-between text-sm text-secondary-600">
                        <span>Baixa</span>
                        <span>Média</span>
                        <span>Alta</span>
                      </div>
                    </div>
                    
                    <div className="pt-2">
                      <button 
                        onClick={handleAddInvestment}
                        className="btn bg-primary-500 hover:bg-primary-600 text-white rounded w-full"
                        disabled={!newInvestment.name || newInvestment.returnRate <= 0}
                      >
                        Adicionar Investimento
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="space-y-4">
                {investments.map((investment) => (
                  <div key={investment.id} className="p-3 border rounded hover:bg-gray-50">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-2" 
                          style={{ backgroundColor: investment.color }}
                        ></div>
                        <h3 className="font-semibold">{investment.name}</h3>
                      </div>
                      <button 
                        onClick={() => handleDeleteInvestment(investment.id)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Remover
                      </button>
                    </div>
                    
                    <div className="mb-4">
                      <label className="label">Taxa de Retorno (%)</label>
                      <input
                        type="number"
                        value={investment.returnRate}
                        onChange={(e) => handleInvestmentChange(investment.id, 'returnRate', e.target.value)}
                        className="input"
                        step="0.1"
                        min="0"
                      />
                    </div>
                    
                    <div className="mb-4">
                      <label className="label">Tipo de Taxa</label>
                      <select
                        value={investment.returnRateType}
                        onChange={(e) => handleInvestmentChange(investment.id, 'returnRateType', e.target.value)}
                        className="input"
                      >
                        <option value="yearly">Anual</option>
                        <option value="monthly">Mensal</option>
                      </select>
                    </div>
                    
                    {investment.returnRateType === 'yearly' && (
                      <div className="mb-4">
                        <label className="label">Método de Conversão</label>
                        <select
                          value={investment.conversionMethod}
                          onChange={(e) => handleInvestmentChange(investment.id, 'conversionMethod', e.target.value)}
                          className="input"
                        >
                          <option value="exact">Método Exato</option>
                          <option value="simple">Método Simplificado</option>
                        </select>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-3 gap-2 mt-3">
                      <div>
                        <span className="text-sm text-secondary-600 block mb-1">Risco</span>
                        <div className="flex items-center">
                          {Array.from({ length: 5 }).map((_, index) => (
                            <span 
                              key={index}
                              className={`h-2 w-2 rounded-full mr-1 ${
                                index < investment.riskLevel 
                                  ? 'bg-red-500' 
                                  : 'bg-gray-200'
                              }`}
                            ></span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <span className="text-sm text-secondary-600 block mb-1">Liquidez</span>
                        <div className="flex items-center">
                          {Array.from({ length: 5 }).map((_, index) => (
                            <span 
                              key={index}
                              className={`h-2 w-2 rounded-full mr-1 ${
                                index < investment.liquidityLevel 
                                  ? 'bg-green-500' 
                                  : 'bg-gray-200'
                              }`}
                            ></span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <span className="text-sm text-secondary-600 block mb-1">Tributos</span>
                        <div className="flex items-center">
                          {Array.from({ length: 5 }).map((_, index) => (
                            <span 
                              key={index}
                              className={`h-2 w-2 rounded-full mr-1 ${
                                index < investment.taxEfficiency 
                                  ? 'bg-blue-500' 
                                  : 'bg-gray-200'
                              }`}
                            ></span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </GraphCard>
        </div>
        
        <div className="lg:col-span-2 space-y-6">
          <GraphCard 
            title="Crescimento do Patrimônio" 
            icon={<LineChartIcon />}
            description="Visualização da evolução ao longo do tempo"
          >
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={results}>
                  <defs>
                    {investments.map((investment) => (
                      <linearGradient 
                        key={`gradient-${investment.id}`} 
                        id={`color-${investment.id}`} 
                        x1="0" 
                        y1="0" 
                        x2="0" 
                        y2="1"
                      >
                        <stop offset="5%" stopColor={investment.color} stopOpacity={0.6}/>
                        <stop offset="95%" stopColor={investment.color} stopOpacity={0}/>
                      </linearGradient>
                    ))}
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
                      value: 'Valor Acumulado (R$)', 
                      angle: -90, 
                      position: 'insideLeft',
                      fill: "#A0A0A0"
                    }}
                    tick={{fill: "#A0A0A0"}}
                  />
                  <Tooltip 
                    formatter={formatTooltipValue}
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
                  
                  {investments.map((investment) => (
                    <Line 
                      key={investment.id}
                      type="monotone" 
                      dataKey={investment.id}
                      name={investment.name}
                      stroke={investment.color}
                      strokeWidth={2}
                      activeDot={{ r: 6, strokeWidth: 0 }}
                      dot={{ r: 0 }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </GraphCard>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GraphCard 
              title="Comparativo de Características" 
              icon={<RadarIcon />}
              description="Análise dimensional dos ativos"
            >
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart outerRadius="70%" data={getRadarData()}>
                    <PolarGrid stroke="#444" />
                    <PolarAngleAxis dataKey="name" tick={{fill: "#A0A0A0"}} />
                    <PolarRadiusAxis domain={[0, 100]} tickCount={6} tick={{fill: "#A0A0A0"}} />
                    
                    {investments.map((investment) => (
                      <Radar
                        key={investment.id}
                        name={investment.name}
                        dataKey="Rentabilidade"
                        stroke={investment.color}
                        fill={investment.color}
                        fillOpacity={0.3}
                      />
                    ))}
                    
                    <Radar
                      name="Risco"
                      dataKey="Risco"
                      stroke="#888888"
                      fill="#888888"
                      fillOpacity={0}
                    />
                    <Radar
                      name="Liquidez"
                      dataKey="Liquidez"
                      stroke="#888888"
                      fill="#888888"
                      fillOpacity={0}
                    />
                    <Radar
                      name="Eficiência Tributária"
                      dataKey="Eficiência Tributária"
                      stroke="#888888"
                      fill="#888888"
                      fillOpacity={0}
                    />
                    
                    <Legend 
                      wrapperStyle={{
                        paddingTop: '10px',
                        fontSize: '12px'
                      }}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#2a2a38', 
                        border: '1px solid #444', 
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)'
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </GraphCard>
            
            <GraphCard 
              title="Patrimônio Final" 
              icon={<PieChartIcon />}
              description="Análise dos resultados finais"
            >
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-2 text-left border-b">Investimento</th>
                      <th className="px-4 py-2 text-right border-b">Patrimônio em {formValues.years} anos</th>
                      <th className="px-4 py-2 text-right border-b">Rendimento</th>
                    </tr>
                  </thead>
                  <tbody>
                    {investments.map((investment) => {
                      const finalValue = results[results.length - 1]?.[investment.id] || 0;
                      const totalInvested = formValues.initialAmount + (formValues.monthlyContribution * 12 * formValues.years);
                      const earnings = finalValue - totalInvested;
                      const earningsPercent = (earnings / totalInvested) * 100;
                      
                      return (
                        <tr key={investment.id} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <div className="flex items-center">
                              <div 
                                className="w-3 h-3 rounded-full mr-2" 
                                style={{ backgroundColor: investment.color }}
                              ></div>
                              {investment.name}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right font-medium">
                            {formatCurrency(finalValue)}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex flex-col">
                              <span>{formatCurrency(earnings)}</span>
                              <span className="text-sm text-secondary-600">
                                ({formatPercent(earningsPercent, 1)})
                              </span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              
              <div className="bg-gray-50 p-4 mt-4 text-sm">
                <p className="font-medium">Total investido: {formatCurrency(formValues.initialAmount + (formValues.monthlyContribution * 12 * formValues.years))}</p>
                <p className="text-secondary-600 mt-1">Investimento inicial: {formatCurrency(formValues.initialAmount)}</p>
                <p className="text-secondary-600">Aportes mensais: {formatCurrency(formValues.monthlyContribution)} × {formValues.years * 12} meses</p>
              </div>
            </GraphCard>
          </div>
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

export default InvestmentComparisonPage; 