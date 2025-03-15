import React, { useState, useEffect, useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import GraphCard from '../components/GraphCard';
import { BarChartIcon, LineChartIcon } from '../components/icons/GraphIcons';
import { convertInterestRate, formatPercent } from '../utils/financialCalculations';
import '../styles/GalaxyEffects.css';

// Ícone personalizado para taxas
const CurrencyIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6 text-white" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

type PeriodType = 'daily' | 'monthly' | 'yearly';

interface FormValues {
  interestRate: number;
  fromPeriod: PeriodType;
}

interface ConversionResult {
  daily: number;
  monthly: number;
  yearly: number;
}

const TaxConversionPage: React.FC = () => {
  const { isDark } = useContext(ThemeContext);
  const [values, setValues] = useState<FormValues>({
    interestRate: 1,
    fromPeriod: 'monthly'
  });

  const [results, setResults] = useState<ConversionResult>({
    daily: 0,
    monthly: 0,
    yearly: 0
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setValues(prev => ({
      ...prev,
      [name]: name === 'fromPeriod' ? value : parseFloat(value) || 0
    }));
  };

  const calculateRates = () => {
    const { interestRate, fromPeriod } = values;
    
    const dailyRate = convertInterestRate(interestRate, fromPeriod, 'daily');
    const monthlyRate = convertInterestRate(interestRate, fromPeriod, 'monthly');
    const yearlyRate = convertInterestRate(interestRate, fromPeriod, 'yearly');
    
    setResults({
      daily: dailyRate,
      monthly: monthlyRate,
      yearly: yearlyRate
    });
  };

  useEffect(() => {
    calculateRates();
  }, [values]);

  useEffect(() => {
    document.title = "Conversor de Taxas de Juros | Capitallia";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Converta taxas de juros entre diferentes períodos (anual, mensal, diário) usando métodos exatos ou comerciais.');
    }
  }, []);

  return (
    <div className="min-h-screen text-white flex flex-col items-center px-6 py-16 relative z-10">
      <div className="text-center max-w-4xl mx-auto">
        
        
        <h1 className="text-5xl md:text-6xl font-bold mt-6 mb-6 text-white leading-tight">
          Conversor de 
          <br />
          <span className="bg-gradient-to-r from-pink-500 to-purple-500 text-transparent bg-clip-text">
            Taxas
          </span>
        </h1>
        
        <p className="text-gray-400 text-xl md:text-2xl max-w-2xl mx-auto mt-6 mb-10">
          Converta taxas de juros entre diferentes períodos (anual, mensal, diário) de forma precisa e rápida.
        </p>
      </div>

      <div className="w-full max-w-6xl mx-auto mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <GraphCard 
            title="Taxa de Juros Original" 
            icon={<CurrencyIcon />}
            description="Informe a taxa de juros que deseja converter"
          >
            <div className="space-y-4">
              <div>
                <label htmlFor="interestRate" className="block text-sm font-medium text-gray-300 mb-1">Taxa de Juros (%)</label>
                <input
                  type="number"
                  id="interestRate"
                  name="interestRate"
                  className="w-full bg-[#2a2a38] border border-gray-700 rounded-lg px-3 py-2 text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  value={values.interestRate}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                />
              </div>
              
              <div>
                <label htmlFor="fromPeriod" className="block text-sm font-medium text-gray-300 mb-1">Período</label>
                <select
                  id="fromPeriod"
                  name="fromPeriod"
                  className="w-full bg-[#2a2a38] border border-gray-700 rounded-lg px-3 py-2 text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  value={values.fromPeriod}
                  onChange={handleInputChange}
                >
                  <option value="daily">Diária</option>
                  <option value="monthly">Mensal</option>
                  <option value="yearly">Anual</option>
                </select>
              </div>
            </div>
          </GraphCard>

          <GraphCard 
            title="Taxas Equivalentes" 
            icon={<LineChartIcon />}
            description="Resultados da conversão"
            className="mt-6"
          >
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-indigo-900/20 rounded-lg border border-indigo-900/30">
                <div>
                  <span className="text-sm text-gray-400 mb-1">Taxa Diária (% a.d.)</span>
                  <p className="text-2xl font-bold text-indigo-400">{formatPercent(results.daily, 5)}</p>
                </div>
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-indigo-900/30 text-indigo-400">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              
              <div className="flex justify-between items-center p-4 bg-green-900/20 rounded-lg border border-green-900/30">
                <div>
                  <span className="text-sm text-gray-400 mb-1">Taxa Mensal (% a.m.)</span>
                  <p className="text-2xl font-bold text-green-400">{formatPercent(results.monthly, 4)}</p>
                </div>
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-green-900/30 text-green-400">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              
              <div className="flex justify-between items-center p-4 bg-pink-900/20 rounded-lg border border-pink-900/30">
                <div>
                  <span className="text-sm text-gray-400 mb-1">Taxa Anual (% a.a.)</span>
                  <p className="text-2xl font-bold text-pink-400">{formatPercent(results.yearly, 2)}</p>
                </div>
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-pink-900/30 text-pink-400">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>
          </GraphCard>
        </div>
        
        <div className="lg:col-span-2">
          <GraphCard 
            title="Sobre Conversão de Taxas" 
            icon={<BarChartIcon />}
            description="Como as taxas são convertidas entre diferentes períodos"
          >
            <div className="prose prose-sm max-w-none text-gray-300">
              <p>
                A conversão de taxas de juros entre diferentes períodos é essencial para comparar investimentos e 
                financiamentos de forma justa. Esta calculadora permite converter taxas entre períodos diário, mensal e anual.
              </p>
              
              <h3 className="text-xl text-indigo-400 mt-4">Como funciona a conversão de taxas?</h3>
              <p>
                Para converter taxas de juros entre diferentes períodos, é necessário utilizar a fórmula de juros compostos:
              </p>
              
              <div className="bg-indigo-900/10 p-4 rounded-lg my-4 border border-indigo-900/30">
                <p className="font-semibold text-indigo-300">Para converter de um período maior para um menor:</p>
                <p className="italic text-gray-300">Taxa menor = (1 + Taxa maior)^(1/n) - 1</p>
                
                <p className="font-semibold text-indigo-300 mt-3">Para converter de um período menor para um maior:</p>
                <p className="italic text-gray-300">Taxa maior = (1 + Taxa menor)^n - 1</p>
                
                <p className="mt-3 text-gray-300">Onde <strong>n</strong> é a quantidade do período menor no período maior.</p>
              </div>
              
              <h3 className="text-xl text-indigo-400 mt-4">Exemplos de conversão:</h3>
              
              <p className="text-gray-300"><strong className="text-white">De taxa anual para mensal:</strong></p>
              <p className="text-gray-300">Para uma taxa de 12% a.a., a taxa mensal equivalente seria:</p>
              <p className="text-gray-300">Taxa mensal = (1 + 0,12)^(1/12) - 1 = 0,00949... ≈ 0,95% a.m.</p>
              
              <p className="text-gray-300 mt-4"><strong className="text-white">De taxa mensal para anual:</strong></p>
              <p className="text-gray-300">Para uma taxa de 1% a.m., a taxa anual equivalente seria:</p>
              <p className="text-gray-300">Taxa anual = (1 + 0,01)^12 - 1 = 0,12683... ≈ 12,68% a.a.</p>
              
              <h3 className="text-xl text-indigo-400 mt-4">Cuidados na conversão de taxas:</h3>
              <ul className="list-disc pl-5 space-y-1 text-gray-300">
                <li>Sempre verifique se a taxa está expressa em formato decimal (0,01 para 1%) ou percentual (1% diretamente).</li>
                <li>Não confunda conversão linear (simples multiplicação) com capitalização composta.</li>
                <li>Para taxas efetivas, é necessário considerar o regime de capitalização (diário, mensal, etc.).</li>
                <li>Taxas nominais exigem atenção para o número de períodos de capitalização por ano.</li>
              </ul>
              
              <div className="bg-purple-900/10 border border-purple-900/30 p-4 rounded-lg mt-4">
                <p className="font-semibold text-purple-300">Nota importante:</p>
                <p className="text-gray-300">
                  A conversão direta de taxas de juros considera o regime de capitalização composta.
                  Para investimentos e financiamentos, é fundamental entender se os juros são calculados
                  e incorporados ao capital (capitalizados) no período mencionado.
                </p>
              </div>
              
              <blockquote className="italic border-l-4 pl-4 my-4 border-pink-800 bg-pink-900/10 p-3 rounded-r-lg text-gray-300">
                "A compreensão adequada da conversão de taxas é essencial para comparar diferentes investimentos de forma justa e identificar oportunidades reais no mercado."
              </blockquote>
            </div>
          </GraphCard>
        </div>
      </div>
    </div>
  );
};

export default TaxConversionPage; 