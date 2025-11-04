import React, { useEffect, useState } from 'react';

interface ConfettiProps {
  show: boolean;
}

export const Confetti: React.FC<ConfettiProps> = ({ show }) => {
  const [particles, setParticles] = useState<Array<{ id: number; left: number; delay: number; color: string }>>([]);

  useEffect(() => {
    if (show) {
      const newParticles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.5,
        color: ['#4a90e2', '#7fb3f0', '#3b82f6', '#60a5fa', '#93c5fd'][Math.floor(Math.random() * 5)]
      }));
      setParticles(newParticles);

      const timer = setTimeout(() => {
        setParticles([]);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [show]);

  if (!show || particles.length === 0) return null;

  return (
    <div className="confetti-container">
      {particles.map(particle => (
        <div
          key={particle.id}
          className="confetti-particle"
          style={{
            left: `${particle.left}%`,
            animationDelay: `${particle.delay}s`,
            backgroundColor: particle.color
          }}
        />
      ))}
    </div>
  );
};
