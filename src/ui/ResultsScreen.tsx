import React, { useEffect } from 'react';
import { RotateCcw, Home, Award, Clock, Sparkles } from 'lucide-react';
import { GameStats } from '../types';
import { sound } from '../audio/soundEngine';

interface ResultsScreenProps {
  stats: GameStats;
  onPlayAgain: () => void;
  onMainMenu: () => void;
}

export const ResultsScreen: React.FC<ResultsScreenProps> = ({
  stats,
  onPlayAgain,
  onMainMenu,
}) => {
  // Calculate total elapsed time formatted
  const elapsedSec = Math.max(1, Math.floor((stats.finishTime - stats.startTime) / 1000));
  const minutes = Math.floor(elapsedSec / 60);
  const seconds = elapsedSec % 60;
  const timeFormatted = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  // Calculate Rank
  // Ratio dynamically derived from game definition: stats.fragmentsCollected / stats.totalFragments
  const totalAvailable = stats.totalFragments > 0 ? stats.totalFragments : 16;
  const completionRate = Math.round((stats.fragmentsCollected / totalAvailable) * 100);
  let rank = 'B';
  let rankTitle = 'FESTIVAL HERO';
  if (completionRate >= 95 && elapsedSec <= 360) {
    rank = 'S';
    rankTitle = 'ONAM LEGEND';
  } else if (completionRate >= 80) {
    rank = 'A';
    rankTitle = "MAVELI'S PRIDE";
  } else if (completionRate >= 60) {
    rank = 'B';
    rankTitle = 'FESTIVAL HERO';
  } else {
    rank = 'C';
    rankTitle = 'ONAM EXPLORER';
  }

  // Save best score & time to localStorage
  useEffect(() => {
    try {
      const bestScore = Number(localStorage.getItem('maaveli_best_score') || '0');
      if (stats.score > bestScore) {
        localStorage.setItem('maaveli_best_score', String(stats.score));
      }
    } catch {
      // ignore
    }
  }, [stats.score]);

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center p-4 md:p-8 bg-black/85 backdrop-blur-xs select-none">
      <div className="relative w-full max-w-lg bg-[#23150e] border-2 border-[#d4af37] rounded-lg p-6 md:p-8 shadow-2xl text-center">
        {/* Decorative Heritage Header */}
        <div className="flex items-center justify-center gap-2 mb-2 text-[#d4af37]">
          <Award className="w-5 h-5 text-[#ffd700]" />
          <h2 className="font-kerala-title text-2xl md:text-3xl font-extrabold text-[#ffd700] tracking-wider uppercase">
            JOURNEY COMPLETE
          </h2>
          <Award className="w-5 h-5 text-[#ffd700]" />
        </div>

        <p className="text-xs md:text-sm text-[#e5d5b7] font-kerala-body mb-6">
          The Grand Pookalam shines bright and King Maveli rejoices in the spirit of Onam.
        </p>

        {/* Rank Badge */}
        <div className="inline-flex flex-col items-center justify-center p-3 px-6 rounded-md bg-[#1c110b] border border-[#d4af37]/70 shadow-inner mb-6">
          <span className="font-kerala-title text-3xl font-black text-[#ffd700]">{rank}</span>
          <span className="font-kerala-title text-xs tracking-widest text-[#f5ecd7] font-semibold">
            {rankTitle}
          </span>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 text-left mb-6">
          <div className="p-3 rounded bg-[#1c110b] border border-[#d4af37]/30">
            <span className="block text-[11px] text-[#a38c70] font-kerala-title uppercase">Final Score</span>
            <span className="text-lg font-bold text-[#fef08a] font-kerala-title">{stats.score}</span>
          </div>

          <div className="p-3 rounded bg-[#1c110b] border border-[#d4af37]/30">
            <span className="block text-[11px] text-[#a38c70] font-kerala-title uppercase">Pookalam Restored</span>
            <span className="text-lg font-bold text-[#fef08a] font-kerala-title">100% Complete</span>
          </div>

          <div className="p-3 rounded bg-[#1c110b] border border-[#d4af37]/30">
            <span className="block text-[11px] text-[#a38c70] font-kerala-title uppercase">Fragments Found</span>
            <span className="text-lg font-bold text-[#fef08a] font-kerala-title">
              {stats.fragmentsCollected} / {stats.totalFragments}
            </span>
          </div>

          <div className="p-3 rounded bg-[#1c110b] border border-[#d4af37]/30">
            <span className="block text-[11px] text-[#a38c70] font-kerala-title uppercase flex items-center gap-1">
              <Clock className="w-3 h-3 inline" /> Time Taken
            </span>
            <span className="text-lg font-bold text-[#fef08a] font-kerala-title">{timeFormatted}</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => {
              sound.playTempleBell(880);
              onPlayAgain();
            }}
            className="flex-1 py-3 px-6 rounded-md bg-[#b45309] hover:bg-[#d97706] text-[#fffef0] font-kerala-title font-bold text-sm tracking-wider border border-[#ffd700] active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>PLAY AGAIN</span>
          </button>

          <button
            onClick={() => {
              sound.playFootstep();
              onMainMenu();
            }}
            className="flex-1 py-3 px-6 rounded-md bg-[#2a1a11] hover:bg-[#3d2417] text-[#e8d8b5] font-kerala-title text-xs tracking-wider border border-[#d4af37]/50 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>MAIN MENU</span>
          </button>
        </div>
      </div>
    </div>
  );
};
