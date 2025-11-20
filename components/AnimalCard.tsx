
import React, { useState } from 'react';
import { Animal } from '../types';
import { Volume2, Loader2 } from 'lucide-react';
import { speakArabic } from '../services/audioService';

interface AnimalCardProps {
  animal: Animal;
  onClick?: () => void;
  minimal?: boolean; // For quiz mode, maybe hide text until clicked
  disabled?: boolean;
}

export const AnimalCard: React.FC<AnimalCardProps> = ({ animal, onClick, minimal = false, disabled = false }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (disabled) return;
    
    // If a parent handler is provided, call it (e.g. for Quiz selection)
    if (onClick) {
      onClick();
    } else {
      // Default behavior: Play sound
      setIsLoading(true);
      try {
        await speakArabic(animal.arabicName);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`
        group relative flex flex-col items-center justify-center w-full h-full
        aspect-square rounded-3xl shadow-xl transition-all duration-300
        hover:-translate-y-2 hover:shadow-2xl active:scale-95
        ${animal.color} border-4 border-white
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      {/* Emoji / Image 
          Adjusted sizes: 
          - minimal (Quiz): Larger text (text-8xl -> md:text-9xl), removed mb-4 for perfect centering.
          - normal (Learn): slightly smaller, keeps margin for text below.
      */}
      <div className={`
        drop-shadow-sm transform transition-transform group-hover:scale-110
        ${minimal ? 'text-8xl md:text-9xl' : 'text-7xl md:text-8xl mb-4'}
      `}>
        {animal.emoji}
      </div>

      {!minimal && (
        <div className="text-center z-10">
          {/* Arabic Name */}
          <h3 className="text-3xl md:text-4xl font-bold text-slate-800 mb-1 arabic-text">
            {animal.arabicName}
          </h3>
          
          {/* Transliteration & English */}
          <p className="text-sm md:text-base text-slate-600 font-semibold opacity-80">
            {animal.transliteration}
          </p>
          <p className="text-xs md:text-sm text-slate-500 uppercase tracking-wider mt-1">
            {animal.englishName}
          </p>
        </div>
      )}

      {/* Audio Indicator */}
      {!minimal && (
        <div className="absolute top-3 right-3 bg-white/80 p-2 rounded-full text-sky-600 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Volume2 className="w-5 h-5" />}
        </div>
      )}
    </button>
  );
};
