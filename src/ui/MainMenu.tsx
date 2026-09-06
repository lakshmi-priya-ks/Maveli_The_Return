import React from 'react';
import { Volume2, VolumeX, Sparkles, BookOpen, Play } from 'lucide-react';
import { sound } from '../audio/soundEngine';

interface MainMenuProps {
  onStart: () => void;
  onHowToPlay: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  onStart,
  onHowToPlay,
  isMuted,
  onToggleMute,
}) => {
  return (
    <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-10 z-30 pointer-events-auto bg-gradient-to-b from-[#1b140e]/70 via-transparent to-[#1b140e]/90 select-none">
      {/* Top Bar with Sound & Subtle Onam Greeting */}
      <div className="flex justify-between items-center w-full max-w-6xl mx-auto">
        <div className="flex items-center gap-2 text-[#d4af37]">
          <div className="w-2.5 h-2.5 rounded-full bg-[#f59e0b] animate-ping" />
          <span className="font-kerala-title text-xs tracking-widest text-[#f5ecd7] uppercase font-semibold">
            Thiruvonam 2026
          </span>
        </div>

        <button
          onClick={onToggleMute}
          className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#23150e]/80 border border-[#d4af37]/60 text-[#d4af37] hover:border-[#ffd700] hover:text-[#fff4a3] transition-colors cursor-pointer text-xs font-kerala-title"
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          <span>{isMuted ? 'UNMUTE SOUND' : 'SOUND ON'}</span>
        </button>
      </div>

      {/* Center Title & Cultural Branding */}
      <div className="flex flex-col items-center text-center my-auto">
        {/* Subtle traditional floral emblem */}
        <div className="w-12 h-12 mb-3 flex items-center justify-center">
          <div className="w-10 h-10 border-2 border-[#d4af37] rounded-full rotate-45 flex items-center justify-center bg-[#2d1b11]/80 shadow-[0_0_15px_rgba(212,175,55,0.4)]">
            <div className="w-4 h-4 bg-[#ef4444] rounded-full" />
          </div>
        </div>

        <h1 className="font-kerala-title text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-wider text-[#ffd700] drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] leading-tight">
          MAAVELI
        </h1>
        <h2 className="font-kerala-title text-lg sm:text-2xl md:text-3xl tracking-[0.25em] text-[#f7eed8] mt-1 font-semibold uppercase">
          THE RETURN
        </h2>

        <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent my-4" />

        <p className="text-sm md:text-base text-[#e5d5b7] max-w-md font-kerala-body font-normal leading-relaxed px-4 text-center">
          The Grand Pookalam has been scattered across the land. Travel through the villages, paddy fields, and backwaters of Kerala to restore the festival and welcome King Maveli home.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3.5 mt-8">
          <button
            onClick={() => {
              sound.playTempleBell(880);
              onStart();
            }}
            className="w-56 sm:w-auto px-8 py-3.5 rounded-md bg-gradient-to-r from-[#b45309] via-[#d97706] to-[#b45309] text-[#fffef0] font-kerala-title font-bold text-base tracking-wider border-2 border-[#ffd700] shadow-[0_4px_20px_rgba(217,119,6,0.5)] hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>BEGIN JOURNEY</span>
          </button>

          <button
            onClick={() => {
              sound.playFootstep();
              onHowToPlay();
            }}
            className="w-56 sm:w-auto px-6 py-3.5 rounded-md bg-[#2a1a11]/90 text-[#f5ecd7] font-kerala-title text-sm tracking-wider border border-[#d4af37]/70 hover:border-[#ffd700] hover:text-[#ffd700] active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <BookOpen className="w-4 h-4" />
            <span>HOW TO PLAY</span>
          </button>
        </div>
      </div>

      {/* Footer Heritage Motif */}
      <div className="text-center text-xs text-[#a38c70] font-kerala-title tracking-wider w-full">
        <span>POOKALAM RESTORATION &bull; KERALA HERITAGE ADVENTURE</span>
      </div>
    </div>
  );
};
