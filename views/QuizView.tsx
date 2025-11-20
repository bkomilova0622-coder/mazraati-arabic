
import React, { useState, useEffect, useRef } from 'react';
import { Animal, CategoryInfo } from '../types';
import { AnimalCard } from '../components/AnimalCard';
import { ArrowLeft, Volume2, RefreshCw, CheckCircle, XCircle, Clock, Trophy, Home } from 'lucide-react';
import { speakArabic } from '../services/audioService';
import { Confetti } from '../components/Confetti';

interface QuizViewProps {
  category: CategoryInfo;
  animals: Animal[];
  onBack: () => void;
}

export const QuizView: React.FC<QuizViewProps> = ({ category, animals, onBack }) => {
  const [targetAnimal, setTargetAnimal] = useState<Animal | null>(null);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [showFeedback, setShowFeedback] = useState<'correct' | 'wrong' | 'timeout' | null>(null);
  const [options, setOptions] = useState<Animal[]>([]);
  const [finished, setFinished] = useState(false);
  
  // Timer State
  const ROUND_DURATION = 15; // Seconds
  const [timeLeft, setTimeLeft] = useState(ROUND_DURATION);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalRounds = 5;

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  // Init round
  const startNewRound = () => {
    setShowFeedback(null);
    setTimeLeft(ROUND_DURATION);
    clearTimer();
    
    // Pick a random target
    const randomTarget = animals[Math.floor(Math.random() * animals.length)];
    setTargetAnimal(randomTarget);

    // Pick 3 other distractors + target
    let roundOptions = [randomTarget];
    const others = animals.filter(a => a.id !== randomTarget.id);
    
    // Shuffle others
    const shuffledOthers = others.sort(() => 0.5 - Math.random()).slice(0, 3); // Take 3
    roundOptions = [...roundOptions, ...shuffledOthers];
    // Shuffle options
    roundOptions.sort(() => 0.5 - Math.random());
    
    setOptions(roundOptions);

    // Start Timer
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Auto speak the prompt after a short delay
    setTimeout(() => {
      speakPrompt(randomTarget);
    }, 500);
  };

  useEffect(() => {
    startNewRound();
    return () => clearTimer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTimeout = () => {
    clearTimer();
    setShowFeedback('timeout');
    speakArabic('انتهى الوقت'); // Time's up
    
    setTimeout(() => {
      nextRoundOrFinish();
    }, 2500);
  };

  const speakPrompt = (target: Animal) => {
    if (!target) return;
    speakArabic(`أَيْنَ ${target.arabicName}؟`);
  };

  const nextRoundOrFinish = () => {
    if (round >= totalRounds) {
      setFinished(true);
    } else {
      setRound(r => r + 1);
      startNewRound();
    }
  };

  const handleAnswer = (selected: Animal) => {
    if (showFeedback) return; // Prevent interaction during feedback
    clearTimer();

    if (selected.id === targetAnimal?.id) {
      setShowFeedback('correct');
      setScore(s => s + 1);
      // speakArabic('أَحْسَنْتَ'); // Optional praise
      
      setTimeout(() => {
        nextRoundOrFinish();
      }, 1500);
    } else {
      setShowFeedback('wrong');
      speakArabic('حاول مرة أخرى'); // "Try again"
      
      // For wrong answer, we don't auto advance immediately, we let them see it was wrong?
      // Or usually in timed quizzes, wrong = next question.
      // Let's do wrong = next question to keep flow fast like a game.
      setTimeout(() => {
        nextRoundOrFinish();
      }, 1500);
    }
  };

  const handleReplay = () => {
    setScore(0);
    setRound(1);
    setFinished(false);
    startNewRound();
  };

  if (finished) {
    const percentage = (score / totalRounds) * 100;
    let feedbackMsg = "Good effort!";
    let arabicMsg = "جيد!";
    if (percentage === 100) { feedbackMsg = "Perfect!"; arabicMsg = "مُمْتَاز!"; }
    else if (percentage > 60) { feedbackMsg = "Well Done!"; arabicMsg = "أَحْسَنْتَ!"; }

    return (
      <div className="max-w-2xl mx-auto p-6 text-center mt-8 animate-fade-in">
        <Confetti />
        <div className="bg-white/90 backdrop-blur-md rounded-[2rem] p-8 md:p-12 shadow-2xl border-4 border-white ring-4 ring-sky-100/50">
          <div className="inline-block p-4 bg-amber-100 rounded-full mb-6 animate-bounce">
            <Trophy className="w-16 h-16 text-amber-500" />
          </div>
          
          <h2 className="text-5xl font-bold text-slate-800 mb-2">{feedbackMsg}</h2>
          <p className="text-4xl text-sky-600 font-bold mb-8 arabic-text">{arabicMsg}</p>
          
          <div className="bg-slate-50 rounded-2xl p-6 mb-8">
            <p className="text-slate-500 uppercase tracking-widest text-sm font-bold mb-2">Final Score</p>
            <div className="text-6xl font-extrabold text-slate-800">
              {score} <span className="text-3xl text-slate-400">/ {totalRounds}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button 
              onClick={onBack}
              className="px-8 py-4 rounded-full bg-white border-2 border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-lg flex items-center justify-center shadow-sm transition-all"
            >
              <Home className="mr-2 w-5 h-5" /> Home
            </button>
            <button 
              onClick={handleReplay}
              className="px-8 py-4 rounded-full bg-sky-500 hover:bg-sky-600 text-white font-bold text-lg flex items-center justify-center shadow-lg shadow-sky-200 transition-all hover:scale-105"
            >
              <RefreshCw className="mr-2 w-5 h-5" /> Play Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 w-full min-h-[80vh] flex flex-col">
       {/* Top HUD */}
       <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 shadow-lg mb-6 flex flex-col gap-4 border border-white/50">
         
         {/* Header Row */}
         <div className="flex justify-between items-center">
            <button 
              onClick={onBack}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-slate-500" />
            </button>
            
            <div className="flex flex-col items-center">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Current Group</span>
              <span className="font-bold text-slate-700">{category.title}</span>
            </div>

            <div className="flex items-center gap-2 bg-amber-50 px-3 py-1 rounded-full border border-amber-100">
              <Trophy className="w-5 h-5 text-amber-500" />
              <span className="font-bold text-amber-700">{score}</span>
            </div>
         </div>

         {/* Progress & Timer Row */}
         <div className="flex items-center gap-4">
           <div className="flex-1">
             <div className="flex justify-between text-xs font-bold text-slate-400 mb-1">
               <span>Progress</span>
               <span>{round} / {totalRounds}</span>
             </div>
             <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
               <div 
                 className="h-full bg-sky-500 transition-all duration-500" 
                 style={{ width: `${(round / totalRounds) * 100}%` }} 
               />
             </div>
           </div>

           {/* Timer Pill */}
           <div className={`
             flex items-center gap-2 px-4 py-2 rounded-xl font-mono font-bold text-lg shadow-inner transition-colors duration-300
             ${timeLeft <= 5 ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-slate-100 text-slate-600'}
           `}>
             <Clock className="w-5 h-5" />
             {timeLeft}s
           </div>
         </div>
       </div>

      {/* Question Area */}
      <div className="flex-1 flex flex-col justify-center">
        <div className="text-center mb-8 relative">
          <p className="text-slate-500 font-bold mb-2">Listen & Find</p>
          <h2 className="text-5xl md:text-7xl font-bold text-slate-800 mb-6 drop-shadow-sm arabic-text" dir="rtl">
             أَيْنَ <span className="text-sky-600">{targetAnimal?.arabicName}</span>؟
          </h2>
          
          <button 
            onClick={() => targetAnimal && speakPrompt(targetAnimal)}
            className="inline-flex items-center px-8 py-3 bg-white hover:bg-sky-50 text-sky-600 rounded-full font-bold shadow-md transition-all active:scale-95 border border-sky-100"
          >
            <Volume2 className="w-6 h-6 mr-2" /> Replay Sound
          </button>
        </div>

        {/* Options Grid */}
        {/* Centered 2x2 grid for larger cards */}
        <div className="grid grid-cols-2 gap-6 md:gap-8 max-w-3xl mx-auto w-full px-4">
          {options.map((animal) => (
            <div key={animal.id} className="relative group perspective-1000">
              <div className={`transition-transform duration-300 h-full ${showFeedback ? 'transform' : 'hover:-translate-y-2'}`}>
                <AnimalCard 
                    animal={animal} 
                    minimal={true} 
                    onClick={() => handleAnswer(animal)}
                    disabled={!!showFeedback}
                />
              </div>
              
              {/* Feedback Overlays */}
              {showFeedback === 'correct' && animal.id === targetAnimal?.id && (
                <div className="absolute inset-0 flex items-center justify-center bg-green-500/80 rounded-3xl z-20 backdrop-blur-sm animate-scale-in pointer-events-none">
                  <CheckCircle className="w-24 h-24 text-white drop-shadow-lg" />
                </div>
              )}

              {(showFeedback === 'wrong' || showFeedback === 'timeout') && animal.id === targetAnimal?.id && (
                <div className="absolute inset-0 flex items-center justify-center bg-green-500/40 rounded-3xl z-20 border-4 border-green-500 animate-pulse pointer-events-none">
                   {/* Highlight the correct one even if wrong */}
                   <span className="bg-white text-green-600 px-4 py-2 rounded-full font-bold shadow-md text-xl">Here!</span>
                </div>
              )}

              {showFeedback === 'wrong' && animal.id !== targetAnimal?.id && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-200/50 rounded-3xl z-10 grayscale opacity-50 pointer-events-none">
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Floating Messages */}
      {showFeedback === 'wrong' && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50 animate-bounce-in">
           <div className="bg-red-500 text-white px-8 py-4 rounded-full text-3xl font-bold shadow-2xl border-4 border-white flex items-center gap-3">
             <XCircle className="w-8 h-8" /> Try Again!
           </div>
        </div>
      )}

      {showFeedback === 'timeout' && (
         <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50 animate-bounce-in">
           <div className="bg-amber-500 text-white px-8 py-4 rounded-full text-3xl font-bold shadow-2xl border-4 border-white flex items-center gap-3">
             <Clock className="w-8 h-8" /> Time's Up!
           </div>
        </div>
      )}
    </div>
  );
};
