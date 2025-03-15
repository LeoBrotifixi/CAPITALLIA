const fs = require('fs');
const path = require('path');

// Lista de arquivos que precisam ser atualizados
const pagesToUpdate = [
  'TaxConversionPage.tsx',
  'SimpleInterestPage.tsx',
  'RealReturnPage.tsx',
  'InvestmentComparisonPage.tsx',
  'InvestmentReturnPage.tsx',
  'FinancingPage.tsx'
];

// Diretório das páginas
const pagesDir = path.join(__dirname, 'src', 'pages');

// Expressão regular para encontrar a mensagem de novidade
const noveltyRegex = /<span className="inline-block bg-gray-800 text-pink-400 font-medium px-4 py-1 rounded-full text-sm mb-6 shadow-lg">\s*NOVIDADE: Versão Dark 2\.0 já disponível →\s*<\/span>/g;

// Processa cada arquivo
pagesToUpdate.forEach(filename => {
  const filePath = path.join(pagesDir, filename);
  
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Remove a mensagem de novidade
    if (noveltyRegex.test(content)) {
      content = content.replace(noveltyRegex, '');
      console.log(`Removida mensagem de novidade de: ${filename}`);
      
      // Escreve o arquivo atualizado
      fs.writeFileSync(filePath, content);
    } else {
      console.log(`Mensagem de novidade não encontrada em: ${filename}`);
    }
  } else {
    console.log(`Arquivo não encontrado: ${filename}`);
  }
});

console.log('Processamento concluído!'); 