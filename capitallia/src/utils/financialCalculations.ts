/**
 * Interfaces para os tipos de retorno
 */
interface TimelineItem {
  month: number;
  balance: number;
  totalContributions: number;
  totalInterest: number;
}

interface CompoundInterestResult {
  finalBalance: number;
  totalContributions: number;
  totalInterest: number;
  timeline: TimelineItem[];
}

interface SimpleInterestResult {
  amount: number;
  interest: number;
}

interface LoanPayment {
  month: number;
  payment: number;
  interest: number;
  amortization: number;
  remainingDebt: number;
}

interface LoanSACResult {
  totalPaid: number;
  totalInterest: number;
  payments: LoanPayment[];
}

interface LoanPriceResult {
  fixedPayment: number;
  totalPaid: number;
  totalInterest: number;
  payments: LoanPayment[];
}

/**
 * Calcula juros compostos com aportes mensais
 * @param initialCapital Capital inicial
 * @param monthlyContribution Aporte mensal
 * @param interestRate Taxa de juros mensal (em porcentagem)
 * @param totalMonths Total de meses
 * @returns Objeto com resultados do cálculo
 */
export const calculateCompoundInterest = (
  initialCapital: number,
  monthlyContribution: number,
  interestRate: number,
  totalMonths: number
): CompoundInterestResult => {
  const monthlyRate = interestRate / 100;
  
  let balance = initialCapital;
  let totalContrib = initialCapital;
  const timeline: TimelineItem[] = [];
  
  for (let month = 1; month <= totalMonths; month++) {
    // Adiciona o aporte mensal
    balance += monthlyContribution;
    totalContrib += monthlyContribution;
    
    // Aplica os juros
    const interestEarned = balance * monthlyRate;
    balance += interestEarned;
    
    timeline.push({
      month,
      balance,
      totalContributions: totalContrib,
      totalInterest: balance - totalContrib
    });
  }
  
  return {
    finalBalance: balance,
    totalContributions: totalContrib,
    totalInterest: balance - totalContrib,
    timeline
  };
};

/**
 * Calcula juros simples
 * @param principal Capital inicial
 * @param rate Taxa de juros (em porcentagem)
 * @param time Período de tempo
 * @returns Montante final e juros acumulados
 */
export const calculateSimpleInterest = (
  principal: number,
  rate: number,
  time: number
): SimpleInterestResult => {
  const interest = (principal * rate * time) / 100;
  const amount = principal + interest;
  
  return {
    amount,
    interest
  };
};

/**
 * Converte entre diferentes períodos de taxas de juros
 * @param rate Taxa de juros original (em porcentagem)
 * @param fromPeriod Período original ('daily', 'monthly', 'yearly')
 * @param toPeriod Período de destino ('daily', 'monthly', 'yearly')
 * @returns Taxa convertida
 */
export const convertInterestRate = (
  rate: number,
  fromPeriod: 'daily' | 'monthly' | 'yearly',
  toPeriod: 'daily' | 'monthly' | 'yearly'
): number => {
  const daysInYear = 365;
  const monthsInYear = 12;
  
  // Converte para taxa diária
  let dailyRate;
  if (fromPeriod === 'daily') {
    dailyRate = rate;
  } else if (fromPeriod === 'monthly') {
    dailyRate = Math.pow(1 + rate / 100, 1 / 30) - 1;
  } else { // yearly
    dailyRate = Math.pow(1 + rate / 100, 1 / daysInYear) - 1;
  }
  
  // Converte da taxa diária para o período desejado
  if (toPeriod === 'daily') {
    return dailyRate * 100;
  } else if (toPeriod === 'monthly') {
    return (Math.pow(1 + dailyRate, 30) - 1) * 100;
  } else { // yearly
    return (Math.pow(1 + dailyRate, daysInYear) - 1) * 100;
  }
};

/**
 * Calcula pagamentos de um financiamento pelo sistema de amortização constante (SAC)
 * @param principal Valor do principal (empréstimo)
 * @param interestRate Taxa de juros mensal (em porcentagem)
 * @param months Número de meses
 * @returns Objeto com informações do financiamento
 */
export const calculateLoanSAC = (
  principal: number,
  interestRate: number,
  months: number
): LoanSACResult => {
  const monthlyRate = interestRate / 100;
  const amortization = principal / months;
  
  const payments: LoanPayment[] = [];
  let remainingDebt = principal;
  let totalInterest = 0;
  
  for (let month = 1; month <= months; month++) {
    const interest = remainingDebt * monthlyRate;
    totalInterest += interest;
    
    const payment = amortization + interest;
    remainingDebt -= amortization;
    
    payments.push({
      month,
      payment,
      interest,
      amortization,
      remainingDebt
    });
  }
  
  return {
    totalPaid: principal + totalInterest,
    totalInterest,
    payments
  };
};

/**
 * Calcula pagamentos de um financiamento pelo sistema Price (prestações fixas)
 * @param principal Valor do principal (empréstimo)
 * @param interestRate Taxa de juros mensal (em porcentagem)
 * @param months Número de meses
 * @returns Objeto com informações do financiamento
 */
export const calculateLoanPrice = (
  principal: number,
  interestRate: number,
  months: number
): LoanPriceResult => {
  const monthlyRate = interestRate / 100;
  
  // Cálculo da prestação fixa (sistema Price)
  const fixedPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
  
  const payments: LoanPayment[] = [];
  let remainingDebt = principal;
  let totalInterest = 0;
  
  for (let month = 1; month <= months; month++) {
    const interest = remainingDebt * monthlyRate;
    totalInterest += interest;
    
    const amortization = fixedPayment - interest;
    remainingDebt -= amortization;
    
    payments.push({
      month,
      payment: fixedPayment,
      interest,
      amortization,
      remainingDebt: remainingDebt < 0.01 ? 0 : remainingDebt // Evitar erros de arredondamento
    });
  }
  
  return {
    fixedPayment,
    totalPaid: fixedPayment * months,
    totalInterest,
    payments
  };
};

/**
 * Calcula o valor futuro corrigido pela inflação
 * @param currentValue Valor atual
 * @param inflationRate Taxa de inflação anual (em porcentagem)
 * @param years Número de anos
 * @returns Valor futuro corrigido
 */
export const calculateInflationAdjustedValue = (
  currentValue: number,
  inflationRate: number,
  years: number
): number => {
  const adjustedValue = currentValue * Math.pow(1 + inflationRate / 100, years);
  return adjustedValue;
};

/**
 * Calcula o valor atual trazendo do futuro com inflação
 * @param futureValue Valor futuro
 * @param inflationRate Taxa de inflação anual (em porcentagem)
 * @param years Número de anos
 * @returns Valor atual necessário
 */
export const calculatePresentValueWithInflation = (
  futureValue: number,
  inflationRate: number,
  years: number
): number => {
  const presentValue = futureValue / Math.pow(1 + inflationRate / 100, years);
  return presentValue;
};

/**
 * Formata um valor para moeda brasileira (BRL)
 * @param value Valor a ser formatado
 * @returns String formatada em BRL
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

/**
 * Formata um número com porcentagem 
 * @param value Valor a ser formatado
 * @param decimalPlaces Número de casas decimais
 * @returns String formatada com porcentagem
 */
export const formatPercent = (value: number, decimalPlaces = 2): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces
  }).format(value / 100);
}; 