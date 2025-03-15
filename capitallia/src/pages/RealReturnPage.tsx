import React, { useState, useEffect, useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { formatCurrency, formatPercent } from '../utils/financialCalculations';
import GraphCard from '../components/GraphCard';
import { LineChartIcon, GrowthChartIcon } from '../components/icons/GraphIcons';
import '../styles/GalaxyEffects.css';

interface FormValues {
  initialAmount: number;
  nominalReturn: number;
  inflationRate: number;
  years: number;
  monthlyContribution: number;
}

interface ReturnResult {
  year: number;
  nominalValue: number;
  realValue: number;
  nominalReturn: number;
  realReturn: number;
  inflationImpact: number;
}

const RealReturnPage: React.FC = () => {
  const { isDark } = useContext(ThemeContext);
  const [values, setValues] = useState<FormValues>({
    initialAmount: 10000,
    nominalReturn: 12,
    inflationRate: 4.5,
    years: 10,
    monthlyContribution: 500
  });

  const [results, setResults] = useState<ReturnResult[]>([]);
  const [totalNominalReturn, setTotalNominalReturn] = useState<number>(0);
  const [totalRealReturn, setTotalRealReturn] = useState<number>(0);
  const [totalInflationImpact, setTotalInflationImpact] = useState<number>(0);

  // Atualizar o título da página para SEO
  useEffect(() => {
    document.title = "Calculadora de Retorno Real | Capitallia";
    
    // Atualizar meta tags para SEO
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Calcule o retorno real dos seus investimentos descontando o efeito da inflação e veja o poder de compra efetivo.');
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setValues(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }));
  };

  const calculateReturns = () => {
    const { initialAmount, nominalReturn, inflationRate, years, monthlyContribution } = values;
    
    const nominalRate = 1 + (nominalReturn / 100);
    const inflationRate1 = 1 + (inflationRate / 100);
    const realRate = nominalRate / inflationRate1;
    
    const resultData: ReturnResult[] = [];
    
    let currentNominalValue = initialAmount;
    let currentRealValue = initialAmount;
    
    // Calcular valores para cada ano
    for (let year = 0; year <= years; year++) {
      if (year === 0) {
        resultData.push({
          year,
          nominalValue: currentNominalValue,
          realValue: currentRealValue,
          nominalReturn: 0,
          realReturn: 0,
          inflationImpact: 0
        });
      } else {
        // Adicionar contribuições mensais
        const yearlyContribution = monthlyContribution * 12;
        
        // Calcular valor nominal com juros compostos e contribuições mensais
        // Para simplificar, estamos considerando as contribuições no início de cada ano
        currentNominalValue = (currentNominalValue + yearlyContribution) * nominalRate;
        
        // Calcular valor real (descontando inflação)
        currentRealValue = (currentRealValue + yearlyContribution) * realRate;
        
        const prevNominal = resultData[year - 1].nominalValue;
        const nominalReturnValue = currentNominalValue - prevNominal - yearlyContribution;
        
        const prevReal = resultData[year - 1].realValue;
        const realReturnValue = currentRealValue - prevReal - yearlyContribution;
        
        const inflationImpact = nominalReturnValue - realReturnValue;
        
        resultData.push({
          year,
          nominalValue: currentNominalValue,
          realValue: currentRealValue,
          nominalReturn: nominalReturnValue,
          realReturn: realReturnValue,
          inflationImpact
        });
      }
    }
    
    // Calcular totais
    const totalNominal = currentNominalValue;
    const totalContributions = initialAmount + (monthlyContribution * 12 * years);
    const totalNominalReturns = totalNominal - totalContributions;
    const totalRealReturns = currentRealValue - totalContributions;
    const totalInflationImpact = totalNominalReturns - totalRealReturns;
    
    setResults(resultData);
    setTotalNominalReturn(totalNominalReturns);
    setTotalRealReturn(totalRealReturns);
    setTotalInflationImpact(totalInflationImpact);
  };

  useEffect(() => {
    calculateReturns();
  }, [values]);

  return (
    <div className="min-h-screen text-white flex flex-col items-center px-6 py-16 relative z-10">
      <div className="text-center max-w-4xl mx-auto">
        
        
        <h1 className="text-5xl md:text-6xl font-bold mt-6 mb-6 text-white leading-tight">
          Retorno 
          <br />
          <span className="bg-gradient-to-r from-pink-500 to-purple-500 text-transparent bg-clip-text">
            Real
          </span>
        </h1>
        
        <p className="text-gray-400 text-xl md:text-2xl max-w-2xl mx-auto mt-6 mb-10">
          Calcule o retorno real dos seus investimentos descontando o efeito da inflação e veja o poder de compra efetivo.
        </p>
      </div>

      <div className="container py-12">
        <h1 className="text-3xl font-bold mb-8 text-center">Calculadora de Retorno Real</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="card">
              <h2 className="text-xl font-semibold mb-6">Parâmetros de Cálculo</h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="initialAmount" className="label">Valor Inicial (R$)</label>
                  <input
                    type="number"
                    id="initialAmount"
                    name="initialAmount"
                    className="input"
                    value={values.initialAmount}
                    onChange={handleInputChange}
                    min="1"
                    step="100"
                  />
                </div>
                
                <div>
                  <label htmlFor="monthlyContribution" className="label">Aporte Mensal (R$)</label>
                  <input
                    type="number"
                    id="monthlyContribution"
                    name="monthlyContribution"
                    className="input"
                    value={values.monthlyContribution}
                    onChange={handleInputChange}
                    min="0"
                    step="100"
                  />
                </div>
                
                <div>
                  <label htmlFor="nominalReturn" className="label">Retorno Nominal (% a.a.)</label>
                  <input
                    type="number"
                    id="nominalReturn"
                    name="nominalReturn"
                    className="input"
                    value={values.nominalReturn}
                    onChange={handleInputChange}
                    min="0"
                    step="0.1"
                    max="30"
                  />
                </div>
                
                <div>
                  <label htmlFor="inflationRate" className="label">Inflação Estimada (% a.a.)</label>
                  <input
                    type="number"
                    id="inflationRate"
                    name="inflationRate"
                    className="input"
                    value={values.inflationRate}
                    onChange={handleInputChange}
                    min="0"
                    step="0.1"
                    max="30"
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
                    value={values.years}
                    onChange={handleInputChange}
                  />
                  <div className="flex justify-between text-sm text-secondary-600 mt-1">
                    <span>1 ano</span>
                    <span>{values.years} anos</span>
                    <span>30 anos</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="card mt-6">
              <h2 className="text-xl font-semibold mb-4">Resumo dos Resultados</h2>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-secondary-600">Valor nominal acumulado em {values.years} anos</p>
                  <p className="text-2xl font-bold text-primary-600">
                    {formatCurrency(results[results.length - 1]?.nominalValue || 0)}
                  </p>
                  <p className="text-sm text-secondary-600">
                    Retorno nominal: {formatPercent((totalNominalReturn / (values.initialAmount + (values.monthlyContribution * 12 * values.years))) * 100, 1)}
                  </p>
                </div>
                
                <div className="border-t pt-4">
                  <p className="text-sm text-secondary-600">Valor real acumulado (descontando inflação)</p>
                  <p className="text-2xl font-bold text-indigo-600">
                    {formatCurrency(results[results.length - 1]?.realValue || 0)}
                  </p>
                  <p className="text-sm text-secondary-600">
                    Retorno real: {formatPercent((totalRealReturn / (values.initialAmount + (values.monthlyContribution * 12 * values.years))) * 100, 1)}
                  </p>
                </div>
                
                <div className="border-t pt-4">
                  <p className="text-sm text-secondary-600">Impacto da inflação no seu patrimônio</p>
                  <p className="text-xl font-semibold text-red-500">
                    {formatCurrency(totalInflationImpact)}
                  </p>
                  <p className="text-sm text-secondary-600">
                    {formatPercent((totalInflationImpact / (results[results.length - 1]?.nominalValue || 1)) * 100, 1)} do valor nominal foi perdido para a inflação
                  </p>
                </div>
                
                <div className="border-t pt-4">
                  <p className="text-sm text-secondary-600">Retorno real anual médio</p>
                  <p className="text-xl font-semibold">
                    {formatPercent(((1 + values.nominalReturn / 100) / (1 + values.inflationRate / 100) - 1) * 100, 2)}
                  </p>
                  <p className="text-sm text-secondary-600">
                    = Retorno nominal ({formatPercent(values.nominalReturn, 1)}) - Inflação ({formatPercent(values.inflationRate, 1)})
                  </p>
                </div>
              </div>
            </div>
            
            <div className="card mt-6 bg-blue-50 border border-blue-200">
              <h3 className="text-lg font-semibold mb-3 text-blue-800">O que é Retorno Real?</h3>
              <p className="text-blue-700">
                O retorno real é o ganho de um investimento descontada a inflação do período. 
                É o que realmente importa para seu poder de compra a longo prazo.
              </p>
              <p className="text-blue-700 mt-2">
                Um investimento com retorno nominal de 8% em um cenário de inflação de 5% 
                terá retorno real de apenas 2,86%, calculado como: (1 + 0,08) / (1 + 0,05) - 1 = 0,0286.
              </p>
            </div>
          </div>
          
          <div className="lg:col-span-2 space-y-8">
            <div className="card">
              <h2 className="text-xl font-semibold mb-6">Evolução do Patrimônio</h2>
              
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={results}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="year" 
                      label={{ 
                        value: 'Anos', 
                        position: 'insideBottomRight', 
                        offset: -10 
                      }} 
                    />
                    <YAxis 
                      tickFormatter={(value) => `R$${(value / 1000).toFixed(0)}k`}
                      label={{ 
                        value: 'Valor (R$)', 
                        angle: -90, 
                        position: 'insideLeft',
                      }} 
                    />
                    <Tooltip 
                      formatter={(value: number) => formatCurrency(value)}
                      labelFormatter={(label) => `Ano ${label}`}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="nominalValue" 
                      name="Valor Nominal" 
                      stroke="#0ea5e9" 
                      strokeWidth={2}
                      dot={{ r: 3 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="realValue" 
                      name="Valor Real" 
                      stroke="#8b5cf6" 
                      strokeWidth={2}
                      dot={{ r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="card">
              <h2 className="text-xl font-semibold mb-6">Retornos Anuais</h2>
              
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={results.filter(item => item.year > 0)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="year" 
                      label={{ 
                        value: 'Anos', 
                        position: 'insideBottomRight', 
                        offset: -10 
                      }} 
                    />
                    <YAxis 
                      tickFormatter={(value) => `R$${(value / 1000).toFixed(0)}k`}
                      label={{ 
                        value: 'Retorno (R$)', 
                        angle: -90, 
                        position: 'insideLeft',
                      }} 
                    />
                    <Tooltip 
                      formatter={(value: number) => formatCurrency(value)}
                      labelFormatter={(label) => `Ano ${label}`}
                    />
                    <Legend />
                    <Bar 
                      dataKey="nominalReturn" 
                      name="Retorno Nominal" 
                      fill="#0ea5e9" 
                    />
                    <Bar 
                      dataKey="realReturn" 
                      name="Retorno Real" 
                      fill="#8b5cf6" 
                    />
                    <Bar 
                      dataKey="inflationImpact" 
                      name="Impacto da Inflação" 
                      fill="#ef4444" 
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="card overflow-hidden">
              <h2 className="text-xl font-semibold mb-6">Tabela de Projeção</h2>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-2 text-left border-b">Ano</th>
                      <th className="px-4 py-2 text-right border-b">Valor Nominal</th>
                      <th className="px-4 py-2 text-right border-b">Valor Real</th>
                      <th className="px-4 py-2 text-right border-b">Retorno Nominal</th>
                      <th className="px-4 py-2 text-right border-b">Retorno Real</th>
                      <th className="px-4 py-2 text-right border-b">Impacto da Inflação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((result, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3">{result.year}</td>
                        <td className="px-4 py-3 text-right">{formatCurrency(result.nominalValue)}</td>
                        <td className="px-4 py-3 text-right">{formatCurrency(result.realValue)}</td>
                        <td className="px-4 py-3 text-right">{index > 0 ? formatCurrency(result.nominalReturn) : "-"}</td>
                        <td className="px-4 py-3 text-right">{index > 0 ? formatCurrency(result.realReturn) : "-"}</td>
                        <td className="px-4 py-3 text-right text-red-500">{index > 0 ? formatCurrency(result.inflationImpact) : "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="card">
              <h2 className="text-xl font-semibold mb-4">A Importância do Retorno Real</h2>
              
              <div className="prose max-w-none">
                <p>
                  Ao planejar investimentos de longo prazo, o retorno real é um conceito fundamental para 
                  entender o verdadeiro crescimento do seu patrimônio. O retorno nominal (percentual bruto de 
                  rentabilidade) pode parecer atraente, mas o que realmente importa é quanto poder de compra 
                  você ganha após descontar a inflação.
                </p>
                
                <h3>Considerações sobre Retorno Real</h3>
                <ul>
                  <li>
                    <strong>Diversificação e risco:</strong> Investimentos com maior potencial de retorno real 
                    geralmente envolvem maior risco. Diversifique sua carteira de acordo com seu perfil de risco.
                  </li>
                  <li>
                    <strong>Horizonte de tempo:</strong> Quanto mais longo seu prazo de investimento, maior o 
                    impacto da inflação composta e mais importante se torna o retorno real.
                  </li>
                  <li>
                    <strong>Impostos:</strong> Lembre-se que esta calculadora não considera o impacto dos 
                    impostos, que também reduzem seu retorno efetivo.
                  </li>
                </ul>
                
                <h3>Exemplos de Investimentos e Retornos Reais Históricos</h3>
                <p>
                  Algumas classes de ativos e seus retornos reais históricos médios no Brasil 
                  (considerando períodos de 10+ anos):
                </p>
                <ul>
                  <li><strong>Poupança:</strong> Frequentemente tem retorno real negativo em períodos de inflação alta</li>
                  <li><strong>Títulos públicos (Tesouro IPCA+):</strong> 3% a 6% a.a. em termos reais</li>
                  <li><strong>Fundos imobiliários:</strong> 5% a 8% a.a. em termos reais</li>
                  <li><strong>Ações (Ibovespa):</strong> 7% a 10% a.a. em termos reais no longo prazo, mas com alta volatilidade</li>
                </ul>
                
                <div className="bg-gray-50 p-4 rounded-lg mt-4">
                  <p className="font-semibold">Dica de planejamento:</p>
                  <p>
                    Para metas de longo prazo, como aposentadoria, busque investimentos que ofereçam 
                    retorno real positivo consistente. Um retorno real de 5% a.a. pode dobrar seu poder 
                    de compra em aproximadamente 14 anos.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealReturnPage; 