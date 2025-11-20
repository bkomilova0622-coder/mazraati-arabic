import React, { useState } from 'react';
import { CATEGORIES, ANIMALS } from './constants';
import { AnimalGroup, ViewState, CategoryInfo } from './types';
import { CategoryCard } from './components/CategoryCard';
import { LearnView } from './views/LearnView';
import { QuizView } from './views/QuizView';
import { Sprout, Star } from 'lucide-react';

const MIXED_CATEGORY: CategoryInfo = {
  id: 'MIXED' as AnimalGroup,
  title: "Grand Challenge",
  arabicTitle: "التحدي الكبير",
  icon: "🏆",
  color: "from-violet-500 to-fuchsia-600"
};

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>(ViewState.HOME);
  const [selectedCategory, setSelectedCategory] = useState<CategoryInfo | null>(null);

  const handleCategorySelect = (category: CategoryInfo) => {
    setSelectedCategory(category);
    
    // If it's the mixed category, go straight to quiz
    if (category.id === 'MIXED' as AnimalGroup) {
      setView(ViewState.QUIZ);
    } else {
      setView(ViewState.LEARN);
    }
  };

  const handleBackToHome = () => {
    setView(ViewState.HOME);
    setSelectedCategory(null);
  };

  const handleStartQuiz = () => {
    setView(ViewState.QUIZ);
  };

  const handleBackToLearn = () => {
    // If in mixed mode, back goes to home
    if (selectedCategory?.id === 'MIXED' as AnimalGroup) {
      setView(ViewState.HOME);
      setSelectedCategory(null);
    } else {
      setView(ViewState.LEARN);
    }
  };

  // Filter animals based on selection
  const currentAnimals = selectedCategory 
    ? (selectedCategory.id === 'MIXED' as AnimalGroup ? ANIMALS : ANIMALS.filter(a => a.group === selectedCategory.id))
    : [];

  return (
    <div className="min-h-screen bg-sky-50 overflow-x-hidden pb-20 relative font-sans">
      
      {/* Navbar / Brand */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm py-4 sticky top-0 z-40 border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center cursor-pointer" onClick={handleBackToHome}>
            <div className="p-2 bg-green-100 rounded-xl mr-3 shadow-sm">
              <Sprout className="w-6 h-6 md:w-8 md:h-8 text-green-600" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-extrabold text-slate-800 tracking-tight">Mazra'ati</h1>
              <p className="text-[10px] md:text-xs text-slate-500 font-bold tracking-widest uppercase">My Arabic Farm</p>
            </div>
          </div>
          
          {view !== ViewState.HOME && (
            <button onClick={handleBackToHome} className="text-sm font-bold text-slate-400 hover:text-slate-600">
              Exit
            </button>
          )}
        </div>
      </header>

      <main className="pt-8">
        {view === ViewState.HOME && (
          <div className="max-w-6xl mx-auto px-4 animate-fade-in">
            <div className="text-center mb-12">
              <div className="inline-block mb-4 px-4 py-1 bg-sky-100 text-sky-700 rounded-full text-sm font-bold">
                Welcome Students!
              </div>
              <h2 className="text-4xl md:text-6xl font-bold text-slate-800 mb-4 tracking-tight">Let's Learn Arabic!</h2>
              <p className="text-xl text-slate-600">Select a group to explore the farm animals.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto mb-12">
              {CATEGORIES.map((cat) => (
                <CategoryCard 
                  key={cat.id} 
                  category={cat} 
                  onClick={() => handleCategorySelect(cat)} 
                />
              ))}
            </div>

            {/* Mixed Mode Button */}
            <div className="max-w-5xl mx-auto mb-20">
               <div className="relative group cursor-pointer" onClick={() => handleCategorySelect(MIXED_CATEGORY)}>
                  <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-[2rem] blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                  <div className="relative bg-white rounded-[1.9rem] p-2">
                    <div className="bg-gradient-to-r from-violet-500 to-fuchsia-600 rounded-3xl p-6 md:p-8 flex items-center justify-between text-white shadow-xl transform group-hover:scale-[1.01] transition-all">
                       <div>
                         <h3 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
                           <Star className="fill-yellow-400 text-yellow-400 animate-spin-slow" />
                           Grand Challenge
                         </h3>
                         <p className="opacity-90 mt-1">Play with all animals mixed together! • التحدي الكبير</p>
                       </div>
                       <div className="text-5xl md:text-6xl animate-bounce">
                         🏆
                       </div>
                    </div>
                  </div>
               </div>
            </div>

            {/* Footer Deco */}
            <div className="text-center opacity-40 pointer-events-none select-none">
              <div className="flex justify-center gap-8 text-6xl grayscale">
                 <span className="animate-bounce" style={{ animationDelay: '0s' }}>🚜</span>
                 <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>🌻</span>
                 <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>🌽</span>
              </div>
            </div>
          </div>
        )}

        {view === ViewState.LEARN && selectedCategory && (
          <LearnView 
            category={selectedCategory} 
            animals={currentAnimals} 
            onBack={handleBackToHome}
            onStartQuiz={handleStartQuiz}
          />
        )}

        {view === ViewState.QUIZ && selectedCategory && (
          <QuizView 
            category={selectedCategory} 
            animals={currentAnimals} 
            onBack={handleBackToLearn}
          />
        )}
      </main>

      {/* Created By Badge */}
      <div className="fixed bottom-6 w-full flex justify-center pointer-events-none z-50">
        <div className="bg-white/90 backdrop-blur-sm px-6 py-2 rounded-full shadow-lg border-2 border-white text-slate-500 text-sm font-bold pointer-events-auto hover:scale-105 transition-transform duration-300 flex items-center gap-2">
          <span>✨</span> Created by Bibihadicha
        </div>
      </div>

    </div>
  );
};

export default App;