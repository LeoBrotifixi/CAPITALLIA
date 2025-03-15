import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import CompoundInterestPage from './pages/CompoundInterestPage';
import SimpleInterestPage from './pages/SimpleInterestPage';
import InvestmentReturnPage from './pages/InvestmentReturnPage';
import TaxConversionPage from './pages/TaxConversionPage';
import FinancingPage from './pages/FinancingPage';
import InflationPage from './pages/InflationPage';
import CalculadoraPage from './pages/CalculadoraPage';
import InvestmentComparisonPage from './pages/InvestmentComparisonPage';
import DestaquesPage from './pages/DestaquesPage';
import { ThemeProvider } from './context/ThemeContext';
import GalaxyBackground from './components/GalaxyBackground';
import { ThemeContext } from './context/ThemeContext';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

const AppContent: React.FC = () => {
  const { isDark } = React.useContext(ThemeContext);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Efeitos de fundo */}
      <GalaxyBackground />
      
      <Header />
      
      <main className="flex-grow relative z-10">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/juros-compostos" element={<CompoundInterestPage />} />
          <Route path="/juros-simples" element={<SimpleInterestPage />} />
          <Route path="/rentabilidade" element={<InvestmentReturnPage />} />
          <Route path="/conversao-taxas" element={<TaxConversionPage />} />
          <Route path="/financiamento" element={<FinancingPage />} />
          <Route path="/inflacao" element={<InflationPage />} />
          <Route path="/calculadora" element={<CalculadoraPage />} />
          <Route path="/comparacao-investimentos" element={<InvestmentComparisonPage />} />
          <Route path="/destaques" element={<DestaquesPage />} />
        </Routes>
      </main>
      
      <Footer />
    </div>
  );
};

export default App; 