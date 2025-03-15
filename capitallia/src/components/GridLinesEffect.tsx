import React, { useEffect, useState } from 'react';
import '../styles/GalaxyEffects.css';

interface GridLine {
  id: number;
  startY: number;
  endY: number;
  left: number;
  color: string;
  opacity: number;
  duration: number;
  rotate: number;
}

interface VerticalGridLine {
  id: number;
  startX: number;
  endX: number;
  top: number;
  color: string;
  opacity: number;
  duration: number;
  rotate: number;
}

const GridLinesEffect: React.FC = () => {
  const [lines, setLines] = useState<GridLine[]>([]);
  const [verticalLines, setVerticalLines] = useState<VerticalGridLine[]>([]);

  // Função para gerar cores em formato neon
  const getRandomColor = (): string => {
    const colors = [
      '#8b5cf6', // roxo
      '#3b82f6', // azul
      '#06b6d4', // ciano
      '#f472b6', // rosa
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  useEffect(() => {
    // Criar linhas horizontais
    const horizontalLines: GridLine[] = [];
    for (let i = 0; i < 15; i++) {
      horizontalLines.push({
        id: i,
        startY: -100 + Math.random() * 50,
        endY: window.innerHeight + 100 + Math.random() * 50,
        left: Math.random() * 100,
        color: getRandomColor(),
        opacity: Math.random() * 0.3 + 0.05,
        duration: Math.random() * 60 + 30,
        rotate: Math.random() * 10 - 5
      });
    }
    setLines(horizontalLines);

    // Criar linhas verticais
    const verticalLines: VerticalGridLine[] = [];
    for (let i = 0; i < 15; i++) {
      verticalLines.push({
        id: i,
        startX: -100 + Math.random() * 50,
        endX: window.innerWidth + 100 + Math.random() * 50,
        top: Math.random() * 100,
        color: getRandomColor(),
        opacity: Math.random() * 0.3 + 0.05,
        duration: Math.random() * 60 + 30,
        rotate: Math.random() * 10 - 5
      });
    }
    setVerticalLines(verticalLines);
  }, []);

  return (
    <div className="grid-lines-container fixed inset-0 pointer-events-none z-0">
      {/* Linhas horizontais */}
      {lines.map((line) => (
        <div
          key={`line-${line.id}`}
          className="grid-line"
          style={{
            top: `${line.left}%`,
            '--start-y': `${line.startY}px`,
            '--end-y': `${line.endY}px`,
            '--line-color': line.color,
            '--line-opacity': line.opacity,
            '--rotate-deg': `${line.rotate}deg`,
            animationDuration: `${line.duration}s`,
          } as React.CSSProperties}
        />
      ))}

      {/* Linhas verticais */}
      {verticalLines.map((line) => (
        <div
          key={`vline-${line.id}`}
          className="grid-line-vertical"
          style={{
            left: `${line.top}%`,
            '--start-x': `${line.startX}px`,
            '--end-x': `${line.endX}px`,
            '--line-color': line.color,
            '--line-opacity': line.opacity,
            '--rotate-deg': `${line.rotate}deg`,
            animationDuration: `${line.duration}s`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
};

export default GridLinesEffect; 