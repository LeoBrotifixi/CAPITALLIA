import React, { useEffect } from 'react';
import '../styles/GalaxyEffects.css';

const CursorEffect: React.FC = () => {
  useEffect(() => {
    // Criar o cursor principal
    const cursor = document.createElement('div');
    cursor.className = 'cursor-effect';
    document.body.appendChild(cursor);

    // Criar os elementos de rastro
    const cursorTrails: HTMLDivElement[] = [];
    const trailsCount = 5;
    
    for (let i = 0; i < trailsCount; i++) {
      const trail = document.createElement('div');
      trail.className = 'cursor-trail';
      trail.style.opacity = `${1 - i * 0.2}`;
      document.body.appendChild(trail);
      cursorTrails.push(trail);
    }
    
    // Atualizar a posição do cursor e dos rastros
    const updateCursor = (e: MouseEvent) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
      
      // Efeito de aumento ao mover
      cursor.style.width = '25px';
      cursor.style.height = '25px';
      setTimeout(() => {
        cursor.style.width = '20px';
        cursor.style.height = '20px';
      }, 100);
    };
    
    // Atualizar a posição dos rastros com delay
    const updateTrails = (e: MouseEvent) => {
      cursorTrails.forEach((trail, index) => {
        setTimeout(() => {
          trail.style.left = `${e.clientX}px`;
          trail.style.top = `${e.clientY}px`;
        }, index * 50);
      });
    };
    
    // Adicionar eventos de mouse
    document.addEventListener('mousemove', updateCursor);
    document.addEventListener('mousemove', updateTrails);
    
    // Links e botões ganham um efeito especial
    const handleElementEnter = () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
      cursor.style.mixBlendMode = 'difference';
      cursor.style.backgroundColor = 'rgba(255, 255, 255, 0.6)';
    };
    
    const handleElementLeave = () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(1)';
      cursor.style.mixBlendMode = 'normal';
      cursor.style.backgroundColor = 'rgba(139, 92, 246, 0.3)';
    };
    
    // Adicionar efeitos em links e botões
    const clickableElements = document.querySelectorAll('a, button, input, select, [role="button"]');
    clickableElements.forEach(element => {
      element.addEventListener('mouseenter', handleElementEnter);
      element.addEventListener('mouseleave', handleElementLeave);
    });
    
    // Limpar ao desmontar
    return () => {
      document.body.removeChild(cursor);
      cursorTrails.forEach(trail => {
        document.body.removeChild(trail);
      });
      document.removeEventListener('mousemove', updateCursor);
      document.removeEventListener('mousemove', updateTrails);
      
      clickableElements.forEach(element => {
        element.removeEventListener('mouseenter', handleElementEnter);
        element.removeEventListener('mouseleave', handleElementLeave);
      });
    };
  }, []);
  
  return null;
};

export default CursorEffect; 