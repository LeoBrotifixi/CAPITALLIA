import React from 'react';
import '../styles/GalaxyEffects.css';

const GalaxyBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 bg-black">
      {/* Gradiente sutil no topo */}
      <div 
        className="absolute inset-0 opacity-60"
        style={{
          background: 'radial-gradient(circle at top center, rgba(60, 0, 80, 0.3) 0%, transparent 70%)'
        }}
      />
    </div>
  );
};

export default GalaxyBackground; 