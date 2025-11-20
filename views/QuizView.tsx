
import React, { useState, useEffect, useRef } from 'react';
import { Animal, CategoryInfo, Team } from '../types';
import { AnimalCard } from '../components/AnimalCard';
import { ArrowLeft, Volume2, RefreshCw, CheckCircle, XCircle, Clock, Trophy, Home, Users, User, Crown } from 'lucide-react';
import { speakArabic } from '../services/audioService';
import { Confetti } from '../components/Confetti';

interface QuizViewProps {
  category: CategoryInfo;
  animals: Animal[];
  onBack: () => void;
}

// Predefined Team Configs
const TEAM_CONFIGS: Omit<Team, 'score'>[] = [
  { id: 0, name: 'Red Team', color: 'bg-red-500', lightColor: 'bg-red-100', textColor: 'text-red-600', borderColor: 'border-red-200', icon: '🔴' },
  { id: 1, name: 'Blue Team', color: 'bg-sky-500', lightColor: 'bg-sky-100', textColor: 'text-sky-600', borderColor: 'border-sky-200', icon: '🔵' },
  { id: 2, name: 'Green Team', color: 'bg-green-500', lightColor: 'bg-green-100', textColor: 'text-green-600', borderColor: 'border-green-200', icon: '🟢' },
  { id: 3, name: 'Orange Team', color: 'bg-orange-500', lightColor: 'bg-orange-100', textColor: 'text-orange-600', borderColor: 'border-orange-200', icon: '🟠' },
];

const SOLO_TEAM: Omit<Team, 'score'> = {
  id: 0, name: 'Player', color: 'bg-sky-500', lightColor: 'bg-sky-100', textColor: 'text-sky-600', borderColor: 'border-sky-200', icon: '👤'
};

export const QuizView: React.FC<QuizViewProps> = ({ category, animals, onBack }) => {
  // Game Phase: SETUP -> PLAYING -> FINISHED
  const [gamePhase, setGamePhase] = useState<'SETUP' | 'PLAYING' | 'FINISHED'>('SETUP');
  
  // Team State
  const [teams, setTeams] = useState<Team[]>([]);
  const [currentTeamIndex, setCurrentTeamIndex] = useState(0);

  // Quiz Logic State
  const [targetAnimal, setTargetAnimal] = useState<Animal | null>(null);
  const [round, setRound] = useState(1);
  const [showFeedback, setShowFeedback] = useState<'correct' | 'wrong' | 'timeout' | null>(null);
  const [options, setOptions] = useState<Animal[]>([]);
  
  // Timer State
  const ROUND_DURATION = 15; 
  const [timeLeft, setTimeLeft] = useState(ROUND_DURATION);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalRoundsPerTeam = 5; 
  // Total game rounds = rounds per team * number of teams
  const [totalGameRounds, setTotalGameRounds] = useState(5);

  // --- SETUP PHASE HELPERS ---

  const initializeGame = (teamCount: number) => {
    let newTeams: Team[] = [];
    
    if (teamCount === 1) {
      newTeams = [{ ...SOLO_TEAM, score: 0 }];
    } else {
      newTeams = TEAM_CONFIGS.slice(0, teamCount).map(t => ({ ...t, score: 0 }));
    }

    setTeams(newTeams);
    setTotalGameRounds(totalRoundsPerTeam * teamCount);
    setCurrentTeamIndex(0);
    setRound(1);
    setGamePhase('PLAYING');
    
    // Small delay before starting the first round logic to allow UI to render
    setTimeout(() => {
      startNewRound(0); // Start with team 0
    }, 100);
  };

  // --- GAME LOGIC ---

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const startNewRound = (teamIdx: number) => {
    setShowFeedback(null);
    setTimeLeft(ROUND_DURATION);
    clearTimer();
    setCurrentTeamIndex(teamIdx);
    
    // Pick a random target
    const randomTarget = animals[Math.floor(Math.random() * animals.length)];
    setTargetAnimal(randomTarget);

    // Pick 3 other distractors + target
    let roundOptions = [randomTarget];
    const others = animals.filter(a => a.id !== randomTarget.id);
    const shuffledOthers = others.sort(() => 0.5 - Math.random()).slice(0, 3); 
    roundOptions = [...roundOptions, ...shuffledOthers];
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

    // Auto speak prompt
    setTimeout(() => {
      speakPrompt(randomTarget);
    }, 500);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => clearTimer();
  }, []);

  const handleTimeout = () => {
    clearTimer();
    setShowFeedback('timeout');
    speakArabic('انتهى الوقت'); 
    setTimeout(() => advanceTurn(), 2500);
  };

  const speakPrompt = (target: Animal) => {
    if (!target) return;
    speakArabic(`أَيْنَ ${target.arabicName}؟`);
  };

  const advanceTurn = () => {
    if (round >= totalGameRounds) {
      setGamePhase('FINISHED');
    } else {
      setRound(r => r + 1);
      // Next team index (loop back to 0)
      const nextTeamIndex = (currentTeamIndex + 1) % teams.length;
      startNewRound(nextTeamIndex);
    }
  };

  const handleAnswer = (selected: Animal) => {
    if (showFeedback) return; 
    clearTimer();

    if (selected.id === targetAnimal?.id) {
      setShowFeedback('correct');
      // Update Score for current team
      setTeams(prev => prev.map((t, i) => i === currentTeamIndex ? { ...t, score: t.score + 1 } : t));
      setTimeout(() => advanceTurn(), 1500);
    } else {
      setShowFeedback('wrong');
      speakArabic('حاول مرة أخرى'); 
      setTimeout(() => advanceTurn(), 1500);
    }
  };

  const handleReplay = () => {
    setGamePhase('SETUP');
  };

  // --- RENDER: SETUP SCREEN ---

  if (gamePhase === 'SETUP') {
    return (
      <div className="max-w-4xl mx-auto p-6 animate-fade-in min-h-[80vh] flex flex-col justify-center">
        <div className="text-center mb-12">
          <button onClick={onBack} className="absolute top-6 left-6 p-2 bg-white rounded-full shadow-sm hover:bg-slate-50">
             <ArrowLeft className="w-6 h-6 text-slate-500" />
          </button>
          <h2 className="text-4xl md:text-6xl font-bold text-slate-800 mb-4">Game Setup</h2>
          <p className="text-xl text-slate-600">Who is playing today?</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto w-full">
          {/* Solo Mode */}
          <button 
            onClick={() => initializeGame(1)}
            className="group relative bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all border-4 border-white hover:border-sky-200 flex flex-col items-center"
          >
            <div className="w-24 h-24 bg-sky-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-sky-200 transition-colors">
               <User className="w-12 h-12 text-sky-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800">Solo Play</h3>
            <p className="text-slate-500">1 Player</p>
          </button>

          {/* Team Modes Container */}
          <div className="bg-white p-8 rounded-3xl shadow-lg border-4 border-white flex flex-col items-center">
            <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mb-4">
               <Users className="w-12 h-12 text-orange-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-6">Team Play</h3>
            
            <div className="flex gap-4">
              {[2, 3, 4].map(num => (
                <button
                  key={num}
                  onClick={() => initializeGame(num)}
                  className="w-16 h-16 rounded-2xl bg-slate-100 hover:bg-orange-500 hover:text-white text-slate-700 font-bold text-xl transition-colors shadow-sm hover:shadow-md flex items-center justify-center"
                >
                  {num}
                </button>
              ))}
            </div>
            <p className="text-slate-400 text-sm mt-4 uppercase tracking-wide font-bold">Select number of teams</p>
          </div>
        </div>
      </div>
    );
  }

  // --- RENDER: RESULTS SCREEN ---

  if (gamePhase === 'FINISHED') {
    // Sort teams by score
    const sortedTeams = [...teams].sort((a, b) => b.score - a.score);
    const winner = sortedTeams[0];
    const isTie = sortedTeams.length > 1 && sortedTeams[0].score === sortedTeams[1].score;

    return (
      <div className="max-w-2xl mx-auto p-6 text-center mt-8 animate-fade-in">
        <Confetti />
        <div className="bg-white/90 backdrop-blur-md rounded-[2rem] p-8 md:p-12 shadow-2xl border-4 border-white ring-4 ring-sky-100/50">
          
          {isTie ? (
             <div className="mb-8">
                <div className="text-6xl mb-4">🤝</div>
                <h2 className="text-5xl font-bold text-slate-800">It's a Tie!</h2>
             </div>
          ) : (
             <div className="mb-8">
                <div className={`inline-block p-6 rounded-full mb-6 animate-bounce ${winner.lightColor}`}>
                   <Trophy className={`w-20 h-20 ${winner.textColor}`} />
                </div>
                <h2 className="text-4xl font-bold text-slate-800 mb-2">Winner!</h2>
                <h3 className={`text-5xl font-extrabold ${winner.textColor} mb-2`}>{winner.name}</h3>
             </div>
          )}
          
          {/* Leaderboard */}
          <div className="bg-slate-50 rounded-2xl p-6 mb-8 space-y-4">
            {sortedTeams.map((team, index) => (
              <div key={team.id} className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm">
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${team.color}`}>
                    {index + 1}
                  </div>
                  <span className="font-bold text-slate-700 text-lg">{team.name}</span>
                </div>
                <div className="text-2xl font-extrabold text-slate-800">
                  {team.score} <span className="text-sm text-slate-400 font-normal">pts</span>
                </div>
              </div>
            ))}
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

  // --- RENDER: PLAYING SCREEN ---

  const currentTeam = teams[currentTeamIndex];

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 w-full min-h-[80vh] flex flex-col">
       {/* Top HUD */}
       <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 shadow-lg mb-6 flex flex-col gap-4 border border-white/50">
         
         <div className="flex justify-between items-center">
            <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <ArrowLeft className="w-6 h-6 text-slate-500" />
            </button>
            
            <div className="flex flex-col items-center">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Category</span>
              <span className="font-bold text-slate-700 text-sm">{category.title}</span>
            </div>

            {/* Round Counter */}
            <div className="bg-slate-100 px-3 py-1 rounded-full text-xs font-bold text-slate-500">
               Round {round} / {totalGameRounds}
            </div>
         </div>

         {/* Team Scoreboard */}
         <div className="flex justify-center gap-2 md:gap-6 overflow-x-auto pb-2">
            {teams.map((team, idx) => {
              const isActive = idx === currentTeamIndex;
              return (
                <div 
                  key={team.id}
                  className={`
                    flex items-center gap-2 md:gap-3 px-3 py-2 md:px-4 md:py-2 rounded-xl border-2 transition-all duration-300
                    ${isActive ? `${team.borderColor} ${team.lightColor} scale-110 shadow-md` : 'border-transparent bg-slate-50 opacity-70'}
                  `}
                >
                  <div className={`
                    w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center text-xs md:text-sm text-white font-bold shadow-sm
                    ${team.color}
                  `}>
                    {team.icon}
                  </div>
                  <div className="flex flex-col">
                    {teams.length > 1 && (
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${team.textColor}`}>
                        {team.name}
                      </span>
                    )}
                    <span className="text-lg md:text-2xl font-extrabold leading-none text-slate-800">
                      {team.score}
                    </span>
                  </div>
                </div>
              );
            })}
         </div>

         {/* Timer Bar */}
         <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden mt-1">
            <div 
              className={`h-full transition-all duration-1000 linear ${timeLeft <= 5 ? 'bg-red-500' : 'bg-sky-400'}`}
              style={{ width: `${(timeLeft / ROUND_DURATION) * 100}%` }}
            />
         </div>
       </div>

      {/* Active Team Indicator (Mobile/Desktop) */}
      {teams.length > 1 && (
         <div className={`text-center mb-4 animate-fade-in`}>
            <span className={`
              inline-flex items-center gap-2 px-6 py-2 rounded-full font-bold shadow-sm border-2 bg-white
              ${currentTeam.textColor} ${currentTeam.borderColor}
            `}>
              {currentTeam.icon} {currentTeam.name}'s Turn
            </span>
         </div>
      )}

      {/* Question Area */}
      <div className="flex-1 flex flex-col justify-center">
        <div className="text-center mb-6 md:mb-10 relative">
          <h2 className="text-5xl md:text-7xl font-bold text-slate-800 mb-6 drop-shadow-sm arabic-text" dir="rtl">
             أَيْنَ <span className="text-sky-600">{targetAnimal?.arabicName}</span>؟
          </h2>
          
          <button 
            onClick={() => targetAnimal && speakPrompt(targetAnimal)}
            className="inline-flex items-center px-6 py-2 bg-white hover:bg-sky-50 text-sky-600 rounded-full font-bold shadow-sm hover:shadow-md transition-all active:scale-95 border border-sky-100 text-sm md:text-base"
          >
            <Volume2 className="w-5 h-5 mr-2" /> Repeat
          </button>
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-2 gap-6 md:gap-8 max-w-3xl mx-auto w-full px-4 pb-8">
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
      
      {/* Feedback Messages */}
      {showFeedback === 'correct' && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50 animate-bounce-in">
           <div className={`bg-white ${currentTeam.textColor} px-10 py-6 rounded-full text-4xl font-extrabold shadow-2xl border-8 ${currentTeam.borderColor} flex flex-col items-center gap-2`}>
             <Crown className="w-12 h-12 fill-current" />
             <div>+1 Point!</div>
           </div>
        </div>
      )}

      {showFeedback === 'wrong' && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50 animate-bounce-in">
           <div className="bg-slate-800 text-white px-8 py-4 rounded-full text-3xl font-bold shadow-2xl border-4 border-white flex items-center gap-3">
             <XCircle className="w-8 h-8 text-red-400" /> Oops!
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
