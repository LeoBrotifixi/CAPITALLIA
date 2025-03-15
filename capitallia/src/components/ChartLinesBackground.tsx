import React, { useEffect, useState } from 'react';

interface ChartLine {
  id: number;
  startX: number;
  endX: number;
  points: {x: number, y: number}[];
  color: string;
  opacity: number;
  speed: number;
  amplitude: number;
  width: number;
}

const ChartLinesBackground: React.FC = () => {
  const [chartLines, setChartLines] = useState<ChartLine[]>([]);
  const [dimensions, setDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1920,
    height: typeof window !== 'undefined' ? window.innerHeight : 1080
  });

  // Gerar cores no tema escuro
  const getRandomColor = (): string => {
    const colors = [
      '#3B82F6', // azul
      '#10B981', // verde
      '#6366F1', // indigo
      '#8B5CF6', // roxo
      '#EC4899', // rosa
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  useEffect(() => {
    // Função para criar uma nova linha de gráfico
    const createChartLine = (id: number): ChartLine => {
      const lineSegments = Math.floor(Math.random() * 10) + 10; // 10-20 segmentos
      const startX = Math.random() * dimensions.width;
      const endX = startX + Math.random() * dimensions.width * 0.8;
      const pointsPerSegment = Math.floor(Math.random() * 3) + 2;
      const amplitude = Math.random() * 100 + 30;
      const speed = Math.random() * 15 + 5;
      
      const points: {x: number, y: number}[] = [];
      
      // Criar pontos com um efeito ondulado
      for (let i = 0; i < lineSegments; i++) {
        const segmentX = startX + ((endX - startX) / lineSegments) * i;
        
        for (let j = 0; j < pointsPerSegment; j++) {
          const pointX = segmentX + ((endX - startX) / lineSegments / pointsPerSegment) * j;
          const pointY = dimensions.height / 2 + Math.sin(i * 0.5) * amplitude;
          
          points.push({ x: pointX, y: pointY });
        }
      }
      
      return {
        id,
        startX,
        endX, 
        points,
        color: getRandomColor(),
        opacity: Math.random() * 0.5 + 0.3,
        speed,
        amplitude,
        width: Math.random() * 2 + 1
      };
    };
    
    // Iniciar com várias linhas de gráfico
    const lines: ChartLine[] = [];
    for (let i = 0; i < 15; i++) {
      lines.push(createChartLine(i));
    }
    
    setChartLines(lines);
    
    // Atualizar as linhas do gráfico com animação
    const interval = setInterval(() => {
      setChartLines(prevLines => 
        prevLines.map(line => {
          // Mover os pontos para cima e para baixo com efeito de onda
          const newPoints = line.points.map((point, index) => {
            const timeOffset = Date.now() / 1000 * line.speed;
            const xPos = point.x;
            const yPos = dimensions.height / 2 + 
                        Math.sin(index * 0.2 + timeOffset) * line.amplitude + 
                        Math.cos(index * 0.3 + timeOffset) * (line.amplitude * 0.5);
            
            return { x: xPos, y: yPos };
          });
          
          return { ...line, points: newPoints };
        })
      );
    }, 50);
    
    // Função para lidar com redimensionamento da janela
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, [dimensions]);

  // Criar SVG path a partir de pontos
  const createPathFromPoints = (points: {x: number, y: number}[]): string => {
    if (points.length === 0) return '';
    
    let path = `M ${points[0].x} ${points[0].y}`;
    
    // Usar curva Bezier para criar um caminho mais suave
    for (let i = 1; i < points.length; i++) {
      const prevPoint = points[i - 1];
      const currentPoint = points[i];
      
      // Pontos de controle para a curva Bezier
      const cp1x = prevPoint.x + (currentPoint.x - prevPoint.x) / 3;
      const cp1y = prevPoint.y;
      const cp2x = prevPoint.x + 2 * (currentPoint.x - prevPoint.x) / 3;
      const cp2y = currentPoint.y;
      
      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${currentPoint.x} ${currentPoint.y}`;
    }
    
    return path;
  };

  return (
    <div className="fixed inset-0 z-0 bg-dark-bg overflow-hidden">
      <svg 
        width="100%" 
        height="100%" 
        className="absolute inset-0"
        style={{
          filter: 'blur(0.5px)',
          opacity: 0.7,
        }}
      >
        {chartLines.map(line => (
          <path
            key={`chart-line-${line.id}`}
            d={createPathFromPoints(line.points)}
            fill="none"
            stroke={line.color}
            strokeWidth={line.width}
            strokeOpacity={line.opacity}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}
      </svg>
      
      {/* Efeito de brilho nas intersecções */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black opacity-50" />
    </div>
  );
};

export default ChartLinesBackground; 