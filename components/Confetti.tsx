import React from 'react';

export const Confetti: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-50 overflow-hidden">
      <div className="w-full h-full relative">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `-10%`,
              animationDuration: `${2 + Math.random() * 3}s`,
              animationDelay: `${Math.random()}s`,
              fontSize: '24px',
            }}
          >
            {['🎉', '⭐', '🌟', '✨', '🍬'][Math.floor(Math.random() * 5)]}
          </div>
        ))}
      </div>
    </div>
  );
};
