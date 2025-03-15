import React, { useState, useEffect, useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell 
} from 'recharts';
import { formatCurrency } from '../utils/financialCalculations';
import GraphCard from '../components/GraphCard';
import { LineChartIcon, PieChartIcon } from '../components/icons/GraphIcons';
import '../styles/GalaxyEffects.css';
import LineChartComponent from '../components/charts/LineChartComponent';
import PieChartComponent from '../components/charts/PieChartComponent';
import AreaChartComponent from '../components/charts/AreaChartComponent';

interface FormValues {
  loanAmount: number;
  interestRate: number;
  interestRateType: 'monthly' | 'yearly';
  conversionMethod: 'exact' | 'simple';
  loanTerm: number;
  system: 'price' | 'sac';
}

interface Payment {
  month: number;
  amortization: number;
  interest: number;
  payment: number;
  remainingDebt: number;
}

// Cores para os gráficos
const COLORS = ['#0066CC', '#34C759', '#FF9500', '#FF2D55'];

const FinancingPage: React.FC = () => {
  const { isDark } = useContext(ThemeContext);
  const [values, setValues] = useState<FormValues>({
    loanAmount: 0,
    interestRate: 0,
    interestRateType: 'monthly',
    conversionMethod: 'exact',
    loanTerm: 0,
    system: 'price'
  });

  const [payments, setPayments] = useState<Payment[]>([]);
  const [totalPayment, setTotalPayment] = useState<number>(0);
  const [totalInterest, setTotalInterest] = useState<number>(0);
  const [firstPayment, setFirstPayment] = useState<number>(0);
  const [lastPayment, setLastPayment] = useState<number>(0);
  const [pieData, setPieData] = useState<{name: string; value: number}[]>([]);

  // Atualizar o título da página para SEO
  useEffect(() => {
    document.title = "Simulador de Financiamento | Capitallia";
    
    // Atualizar meta tags para SEO
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Calcule e compare financiamentos pelo sistema SAC e Price (Tabela Price), visualizando simulações detalhadas das parcelas e juros.');
    }
    
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', 'financiamento, simulador, sistema price, sistema sac, amortização, juros, imóvel, veículo');
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setValues(prev => ({
      ...prev,
      [name]: name === 'system' || name === 'interestRateType' || name === 'conversionMethod' ? value : parseFloat(value) || 0
    }));
  };

  const calculateFinancing = () => {
    const { loanAmount, interestRate, interestRateType, conversionMethod, loanTerm, system } = values;

    // Converter taxa anual para mensal dependendo do método escolhido
    let monthlyRate;
    if (interestRateType === 'yearly') {
      if (conversionMethod === 'exact') {
        // Método exato (matemático): (1 + taxa anual)^(1/12) - 1
        monthlyRate = Math.pow(1 + interestRate / 100, 1/12) - 1;
      } else {
        // Método simplificado (comercial): taxa anual / 12
        monthlyRate = (interestRate / 100) / 12;
      }
    } else {
      monthlyRate = interestRate / 100;
    }

    let paymentsList: Payment[] = [];
    let total = 0;
    let totalInt = 0;

    if (system === 'price') {
      // Sistema Price (prestações fixas)
      const fixedPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, loanTerm)) / (Math.pow(1 + monthlyRate, loanTerm) - 1);
      
      let remainingDebt = loanAmount;
      
      for (let month = 1; month <= loanTerm; month++) {
        const interest = remainingDebt * monthlyRate;
        const amortization = fixedPayment - interest;
        
        remainingDebt -= amortization;
        if (remainingDebt < 0.01) remainingDebt = 0;
        
        total += fixedPayment;
        totalInt += interest;
        
        if (month === 1) {
          setFirstPayment(fixedPayment);
        }
        
        if (month === loanTerm) {
          setLastPayment(fixedPayment);
        }
        
        if (month % 12 === 0 || month === 1 || month === loanTerm) {
          paymentsList.push({
            month,
            payment: fixedPayment,
            interest,
            amortization,
            remainingDebt
          });
        }
      }
    } else {
      // Sistema SAC (amortização constante)
      const amortization = loanAmount / loanTerm;
      let remainingDebt = loanAmount;
      
      for (let month = 1; month <= loanTerm; month++) {
        const interest = remainingDebt * monthlyRate;
        const payment = amortization + interest;
        
        remainingDebt -= amortization;
        
        total += payment;
        totalInt += interest;
        
        if (month === 1) {
          setFirstPayment(payment);
        }
        
        if (month === loanTerm) {
          setLastPayment(payment);
        }
        
        if (month % 12 === 0 || month === 1 || month === loanTerm) {
          paymentsList.push({
            month,
            payment,
            interest,
            amortization,
            remainingDebt
          });
        }
      }
    }
    
    setPayments(paymentsList);
    setTotalPayment(total);
    setTotalInterest(totalInt);

    // Atualizar dados para o gráfico de pizza
    setPieData([
      { name: 'Valor Financiado', value: loanAmount },
      { name: 'Juros Totais', value: totalInt }
    ]);
  };

  useEffect(() => {
    calculateFinancing();
  }, [values]);

  // Preparar dados para o gráfico de composição das parcelas
  const getChartData = () => {
    return payments.map(p => ({
      month: p.month,
      Amortização: p.amortization,
      Juros: p.interest,
      Total: p.payment
    }));
  };

  // Dicas úteis para o usuário
  const tips = [
    {
      title: "Entrada maior",
      description: "Quanto maior a entrada, menor o valor financiado e, consequentemente, menos juros você pagará no total."
    },
    {
      title: "Prazo vs. Parcela",
      description: "Prazos mais longos resultam em parcelas menores, mas o total de juros pagos será maior."
    },
    {
      title: "Compare sistemas",
      description: "O sistema SAC geralmente resulta em menos juros no total, mas com parcelas iniciais maiores."
    }
  ];

  return (
    <div className="min-h-screen text-white flex flex-col items-center px-6 py-16 relative z-10">
      <div className="text-center max-w-4xl mx-auto">
        
        
        <h1 className="text-5xl md:text-6xl font-bold mt-6 mb-6 text-white leading-tight">
          Simulador de 
          <br />
          <span className="bg-gradient-to-r from-pink-500 to-purple-500 text-transparent bg-clip-text">
            Financiamento
          </span>
        </h1>
        
        <p className="text-gray-400 text-xl md:text-2xl max-w-2xl mx-auto mt-6 mb-10">
          Calcule e compare financiamentos pelos sistemas SAC e Price (Tabela Price), visualizando simulações detalhadas.
        </p>
      </div>

      <div className="w-full max-w-6xl mx-auto mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <GraphCard 
            title="Parâmetros de Simulação" 
            icon={<LineChartIcon />}
            description="Configure os valores do seu financiamento"
          >
            <div className="space-y-6">
              <div>
                <label htmlFor="loanAmount" className="block text-sm font-medium text-gray-300 mb-1">Valor do Financiamento (R$)</label>
                <input
                  type="number"
                  id="loanAmount"
                  name="loanAmount"
                  className="w-full bg-[#2a2a38] border border-gray-700 rounded-lg px-3 py-2 text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  value={values.loanAmount}
                  onChange={handleInputChange}
                  min="0"
                  step="1000"
                  placeholder="Digite o valor a ser financiado"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
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
                    step="0.05"
                    placeholder="Digite a taxa de juros"
                  />
                </div>
                
                <div>
                  <label htmlFor="interestRateType" className="block text-sm font-medium text-gray-300 mb-1">Tipo de Taxa</label>
                  <select
                    id="interestRateType"
                    name="interestRateType"
                    className="w-full bg-[#2a2a38] border border-gray-700 rounded-lg px-3 py-2 text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    value={values.interestRateType}
                    onChange={handleInputChange}
                  >
                    <option value="monthly">Mensal</option>
                    <option value="yearly">Anual</option>
                  </select>
                </div>
              </div>
              
              {values.interestRateType === 'yearly' && (
                <div>
                  <label htmlFor="conversionMethod" className="block text-sm font-medium text-gray-300 mb-1">Método de Conversão Anual → Mensal</label>
                  <select
                    id="conversionMethod"
                    name="conversionMethod"
                    className="w-full bg-[#2a2a38] border border-gray-700 rounded-lg px-3 py-2 text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    value={values.conversionMethod}
                    onChange={handleInputChange}
                  >
                    <option value="exact">Método Exato (Matemático)</option>
                    <option value="simple">Método Simplificado (Comercial)</option>
                  </select>
                  <p className="text-xs text-gray-400 mt-1">
                    {values.conversionMethod === 'exact' 
                      ? "Exato: (1 + taxa anual)^(1/12) - 1" 
                      : "Simplificado: taxa anual ÷ 12"}
                  </p>
                </div>
              )}
              
              <div>
                <label htmlFor="loanTerm" className="block text-sm font-medium text-gray-300 mb-1">Prazo (meses)</label>
                <input
                  type="number"
                  id="loanTerm"
                  name="loanTerm"
                  className="w-full bg-[#2a2a38] border border-gray-700 rounded-lg px-3 py-2 text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  value={values.loanTerm}
                  onChange={handleInputChange}
                  min="1"
                  step="12"
                  placeholder="Digite o prazo em meses"
                />
              </div>
              
              <div>
                <label htmlFor="system" className="block text-sm font-medium text-gray-300 mb-1">Sistema de Amortização</label>
                <select
                  id="system"
                  name="system"
                  className="w-full bg-[#2a2a38] border border-gray-700 rounded-lg px-3 py-2 text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  value={values.system}
                  onChange={handleInputChange}
                >
                  <option value="price">Price (Parcelas Fixas)</option>
                  <option value="sac">SAC (Amortização Constante)</option>
                </select>
              </div>
            </div>
          </GraphCard>

          <GraphCard 
            title="Resumo do Financiamento" 
            icon={<PieChartIcon />}
            description="Valores totais e parcelas"
            className="mt-6"
          >
            <div className="space-y-4">
              <div className="p-4 bg-indigo-900/20 rounded-lg border border-indigo-900/30">
                <p className="text-sm text-gray-300 font-medium">Valor Total Pago</p>
                <p className="text-2xl font-bold text-indigo-400">{formatCurrency(totalPayment)}</p>
                <p className="text-sm text-gray-400">
                  {(totalPayment / values.loanAmount * 100 - 100).toFixed(2)}% do valor financiado
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="p-3 bg-amber-900/20 rounded-lg border border-amber-900/30">
                  <p className="text-sm text-gray-300 font-medium">Total de Juros</p>
                  <p className="text-lg font-medium text-amber-400">{formatCurrency(totalInterest)}</p>
                </div>
                
                <div className="p-3 bg-green-900/20 rounded-lg border border-green-900/30">
                  <p className="text-sm text-gray-300 font-medium">Valor Financiado</p>
                  <p className="text-lg font-medium text-green-400">{formatCurrency(values.loanAmount)}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="p-3 bg-blue-900/20 rounded-lg border border-blue-900/30">
                  <p className="text-sm text-gray-300 font-medium">Primeira Parcela</p>
                  <p className="text-lg font-medium text-blue-400">{formatCurrency(firstPayment)}</p>
                </div>
                
                <div className="p-3 bg-blue-900/20 rounded-lg border border-blue-900/30">
                  <p className="text-sm text-gray-300 font-medium">Última Parcela</p>
                  <p className="text-lg font-medium text-blue-400">{formatCurrency(lastPayment)}</p>
                </div>
              </div>
            </div>
          </GraphCard>

          {/* Composição (Gráfico de Pizza) */}
          <GraphCard 
            title="Composição do Financiamento" 
            icon={<PieChartIcon />}
            description="Distribuição do valor total"
            className="mt-6"
          >
            <div className="h-64">
              <PieChartComponent
                data={pieData}
                height={250}
                formatter={(value) => [formatCurrency(value), '']}
                legendPosition="right"
              />
            </div>
          </GraphCard>
        </div>
        
        <div className="lg:col-span-2 space-y-8">
          <GraphCard 
            title="Evolução das Parcelas" 
            icon={<LineChartIcon />}
            description="Visualização da composição das parcelas ao longo do tempo"
          >
            <div className="h-80">
              <AreaChartComponent
                data={getChartData()}
                xAxisDataKey="month"
                xAxisLabel="Meses"
                yAxisLabel="Valor (R$)"
                series={[
                  {
                    dataKey: 'Amortização',
                    name: 'Amortização',
                    color: '#0066CC',
                    strokeWidth: 2
                  },
                  {
                    dataKey: 'Juros',
                    name: 'Juros',
                    color: '#FF9500',
                    strokeWidth: 2
                  },
                  {
                    dataKey: 'Total',
                    name: 'Total',
                    color: '#34C759',
                    strokeWidth: 2
                  }
                ]}
                tooltipFormatter={(value) => [formatCurrency(value), '']}
                tooltipLabelFormatter={(label) => `Mês ${label}`}
                height={320}
              />
            </div>
          </GraphCard>
          
          <GraphCard 
            title="Tabela de Amortização" 
            icon={<LineChartIcon />}
            description="Detalhamento das parcelas ao longo do tempo"
          >
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-800">
                    <th className="px-4 py-2 text-left border-b border-gray-700 text-gray-300">Mês</th>
                    <th className="px-4 py-2 text-right border-b border-gray-700 text-gray-300">Prestação</th>
                    <th className="px-4 py-2 text-right border-b border-gray-700 text-gray-300">Amortização</th>
                    <th className="px-4 py-2 text-right border-b border-gray-700 text-gray-300">Juros</th>
                    <th className="px-4 py-2 text-right border-b border-gray-700 text-gray-300">Saldo Devedor</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment, index) => (
                    <tr key={index} className="border-b border-gray-700 hover:bg-gray-800">
                      <td className="px-4 py-3 text-gray-300">{payment.month}</td>
                      <td className="px-4 py-3 text-right text-gray-300">{formatCurrency(payment.payment)}</td>
                      <td className="px-4 py-3 text-right text-blue-400">{formatCurrency(payment.amortization)}</td>
                      <td className="px-4 py-3 text-right text-amber-400">{formatCurrency(payment.interest)}</td>
                      <td className="px-4 py-3 text-right text-gray-300">{formatCurrency(payment.remainingDebt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GraphCard>

          {/* Dicas */}
          <GraphCard 
            title="Dicas para seu Financiamento" 
            icon={<LineChartIcon />}
            description="Recomendações para otimizar seu financiamento"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {tips.map((tip, index) => (
                <div key={index} className="bg-indigo-900/20 p-4 rounded-lg border border-indigo-900/30 hover:bg-indigo-900/30 transition-colors duration-300">
                  <h3 className="text-indigo-400 font-medium mb-2">{tip.title}</h3>
                  <p className="text-sm text-gray-300 leading-relaxed">{tip.description}</p>
                </div>
              ))}
            </div>
          </GraphCard>
          
          <GraphCard 
            title="Sistemas de Amortização" 
            icon={<LineChartIcon />}
            description="Diferenças entre os sistemas de amortização"
          >
            <div className="prose max-w-none text-gray-300">
              <p className="text-lg leading-relaxed">
                Existem dois sistemas principais de amortização utilizados em financiamentos no Brasil:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-8">
                <div className="bg-blue-900/20 p-6 rounded-lg border border-blue-900/30">
                  <h3 className="text-xl font-medium mb-3 text-blue-400">Sistema Price (Tabela Price)</h3>
                  <p className="text-gray-300">
                    Neste sistema, as prestações são fixas do início ao fim do contrato. A composição da prestação 
                    vai mudando ao longo do tempo: no início, a maior parte do valor pago corresponde a juros; 
                    ao final, quase toda a prestação é amortização do saldo devedor.
                  </p>
                  <ul className="list-disc pl-6 space-y-2 mt-3 text-gray-300">
                    <li><strong className="text-blue-400">Vantagem:</strong> Prestações sempre iguais, facilitando o planejamento financeiro.</li>
                    <li><strong className="text-blue-400">Desvantagem:</strong> Paga-se mais juros no total comparado ao SAC.</li>
                  </ul>
                </div>
                
                <div className="bg-green-900/20 p-6 rounded-lg border border-green-900/30">
                  <h3 className="text-xl font-medium mb-3 text-green-400">Sistema SAC (Amortização Constante)</h3>
                  <p className="text-gray-300">
                    No sistema SAC, a amortização do saldo devedor é constante. Como os juros incidem sobre o saldo 
                    devedor, o valor da prestação diminui ao longo do tempo, à medida que o saldo devedor é reduzido.
                  </p>
                  <ul className="list-disc pl-6 space-y-2 mt-3 text-gray-300">
                    <li><strong className="text-green-400">Vantagem:</strong> Total de juros pagos menor que no Price.</li>
                    <li><strong className="text-green-400">Desvantagem:</strong> Prestações iniciais mais altas, que vão diminuindo ao longo do tempo.</li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-indigo-900/20 p-6 rounded-lg border-l-4 border-indigo-500 mt-8">
                <p className="font-semibold text-indigo-400">Dica:</p>
                <p className="text-gray-300">
                  Avalie sua capacidade de pagamento atual e futura. Se você espera que sua renda aumente com o 
                  tempo, o SAC pode ser uma opção mais econômica. Se preferir estabilidade nas parcelas, 
                  o sistema Price pode ser mais adequado para seu planejamento financeiro.
                </p>
              </div>
            </div>
          </GraphCard>

          <GraphCard 
            title="Evolução do Saldo Devedor" 
            icon={<LineChartIcon />}
            description="Acompanhamento ao longo do financiamento"
            className="mt-6"
          >
            <div className="h-80">
              <AreaChartComponent
                data={getChartData()}
                xAxisDataKey="month"
                xAxisLabel="Meses"
                yAxisLabel="Valor (R$)"
                series={[
                  {
                    dataKey: 'remainingDebt',
                    name: 'Saldo Devedor',
                    color: '#6366F1',
                    strokeWidth: 2
                  }
                ]}
                tooltipFormatter={(value) => [formatCurrency(value), '']}
                tooltipLabelFormatter={(label) => `Mês ${label}`}
                height={320}
              />
            </div>
          </GraphCard>
        </div>
      </div>
    </div>
  );
};

export default FinancingPage; 