import React from 'react';
import { Play, RotateCcw, BookOpen, Volume2, VolumeX, Home } from 'lucide-react';
import { sound } from '../audio/soundEngine';

interface PauseMenuProps {
  onResume: () => void;
  onRestartLevel: () => void;
  onHowToPlay: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onMainMenu: () => void;
}

export const PauseMenu: React.FC<PauseMenuProps> = ({
  onResume,
  onRestartLevel,
  onHowToPlay,
  isMuted,
  onToggleMute,
  onMainMenu,
}) => {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs select-none">
      <div className="relative w-full max-w-sm bg-[#23150e] border-2 border-[#d4af37] rounded-lg p-6 shadow-2xl text-center">
        <h2 className="font-kerala-title text-2xl font-bold text-[#ffd700] tracking-wider uppercase mb-1">
          JOURNEY PAUSED
        </h2>

        <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mx-auto my-3" />

        <div className="flex flex-col gap-2.5 mt-4">
          {/* Resume */}
          <button
            onClick={() => {
              sound.playFootstep();
              onResume();
            }}
            className="w-full py-3 px-4 rounded-md bg-[#b45309] hover:bg-[#d97706] text-[#fffef0] font-kerala-title font-bold text-sm tracking-wider border border-[#ffd700] active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>RESUME</span>
          </button>

          {/* Restart Level */}
          <button
            onClick={() => {
              sound.playFootstep();
              onRestartLevel();
            }}
            className="w-full py-2.5 px-4 rounded-md bg-[#2a1a11] hover:bg-[#3d2417] text-[#f5ecd7] font-kerala-title text-xs tracking-wider border border-[#d4af37]/60 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>RESTART LEVEL</span>
          </button>

          {/* How to play */}
          <button
            onClick={() => {
              sound.playFootstep();
              onHowToPlay();
            }}
            className="w-full py-2.5 px-4 rounded-md bg-[#2a1a11] hover:bg-[#3d2417] text-[#f5ecd7] font-kerala-title text-xs tracking-wider border border-[#d4af37]/60 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <BookOpen className="w-4 h-4" />
            <span>HOW TO PLAY</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={onToggleMute}
            className="w-full py-2.5 px-4 rounded-md bg-[#2a1a11] hover:bg-[#3d2417] text-[#f5ecd7] font-kerala-title text-xs tracking-wider border border-[#d4af37]/60 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            <span>{isMuted ? 'UNMUTE SOUND' : 'MUTE SOUND'}</span>
          </button>

          {/* Main Menu */}
          <button
            onClick={() => {
              sound.playFootstep();
              onMainMenu();
            }}
            className="w-full py-2.5 px-4 rounded-md bg-[#1c110b] hover:bg-[#2d1b11] text-[#a38c70] hover:text-[#f5ecd7] font-kerala-title text-xs tracking-wider border border-[#d4af37]/30 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer mt-1"
          >
            <Home className="w-4 h-4" />
            <span>MAIN MENU</span>
          </button>
        </div>
      </div>
    </div>
  );
};
