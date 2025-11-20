import React from 'react';
import { CategoryInfo } from '../types';
import { ArrowRight } from 'lucide-react';

interface CategoryCardProps {
  category: CategoryInfo;
  onClick: () => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`
        relative overflow-hidden w-full p-6 rounded-3xl shadow-lg text-white text-left
        transform transition-all duration-300 hover:scale-105 hover:shadow-2xl
        bg-gradient-to-br ${category.color}
      `}
    >
      <div className="relative z-10 flex justify-between items-center">
        <div>
          <h3 className="text-3xl font-bold mb-1">{category.title}</h3>
          <p className="text-xl opacity-90 arabic-text font-bold mb-4">{category.arabicTitle}</p>
          <div className="inline-flex items-center bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm text-sm font-bold">
            Start Learning <ArrowRight className="ml-2 w-4 h-4" />
          </div>
        </div>
        <div className="text-7xl md:text-8xl filter drop-shadow-md animate-bounce-slight">
          {category.icon}
        </div>
      </div>
      
      {/* Decor circles */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full pointer-events-none" />
    </button>
  );
};
