import React, { useEffect } from 'react';
import { Animal, CategoryInfo } from '../types';
import { AnimalCard } from '../components/AnimalCard';
import { ArrowLeft, Gamepad2 } from 'lucide-react';
import { speakArabic } from '../services/geminiService';

interface LearnViewProps {
  category: CategoryInfo;
  animals: Animal[];
  onBack: () => void;
  onStartQuiz: () => void;
}

export const LearnView: React.FC<LearnViewProps> = ({ category, animals, onBack, onStartQuiz }) => {
  
  useEffect(() => {
    // Announce the category name in Arabic on entry? Optional.
    // speakArabic(category.arabicTitle); 
  }, [category]);

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        <button 
          onClick={onBack}
          className="flex items-center text-slate-600 hover:text-slate-900 font-bold transition-colors bg-white px-4 py-2 rounded-full shadow-sm"
        >
          <ArrowLeft className="w-5 h-5 mr-2" /> Back
        </button>

        <div className="text-center">
          <h2 className="text-4xl font-bold text-slate-800">{category.title}</h2>
          <p className="text-2xl text-sky-600 arabic-text mt-1">{category.arabicTitle}</p>
        </div>

        <button
          onClick={onStartQuiz}
          className="flex items-center bg-sky-500 hover:bg-sky-600 text-white px-6 py-3 rounded-full shadow-lg font-bold transition-all hover:scale-105 active:scale-95"
        >
          <Gamepad2 className="w-6 h-6 mr-2" /> Play Quiz
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
        {animals.map((animal) => (
          <AnimalCard key={animal.id} animal={animal} />
        ))}
      </div>
    </div>
  );
};
