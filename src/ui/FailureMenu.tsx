import React from 'react';
import { RotateCcw, Home } from 'lucide-react';
import { sound } from '../audio/soundEngine';

interface FailureMenuProps {
  onRestartLevel: () => void;
  onMainMenu: () => void;
}

export const FailureMenu: React.FC<FailureMenuProps> = ({
  onRestartLevel,
  onMainMenu,
}) => {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs select-none">
      <div className="relative w-full max-w-md bg-[#23150e] border-2 border-[#b91c1c] rounded-lg p-6 md:p-8 shadow-2xl text-center">
        {/* Traditional ornamental lamp silhouette */}
        <div className="w-12 h-12 mx-auto mb-3 rounded-full border border-[#d4af37]/60 flex items-center justify-center bg-[#1c110b]">
          <div className="w-3 h-3 rounded-full bg-[#ef4444]" />
        </div>

        <h2 className="font-kerala-title text-2xl md:text-3xl font-bold text-[#fca5a5] tracking-wider uppercase">
          JOURNEY INTERRUPTED
        </h2>

        <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-[#ef4444] to-transparent mx-auto my-3" />

        <p className="text-sm md:text-base text-[#e5d5b7] font-kerala-body mb-6">
          "Let's try that path again."
        </p>

        {/* Explicit Choices: RESTART LEVEL / MAIN MENU */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => {
              sound.playFootstep();
              onRestartLevel();
            }}
            className="w-full py-3.5 px-6 rounded-md bg-[#b91c1c] hover:bg-[#dc2626] text-[#fffef0] font-kerala-title font-bold text-sm tracking-wider border border-[#ffd700]/70 shadow-lg active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>RESTART LEVEL</span>
          </button>

          <button
            onClick={() => {
              sound.playFootstep();
              onMainMenu();
            }}
            className="w-full py-3 px-6 rounded-md bg-[#2a1a11] hover:bg-[#3d2417] text-[#e8d8b5] font-kerala-title text-xs tracking-wider border border-[#d4af37]/50 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>MAIN MENU</span>
          </button>
        </div>
      </div>
    </div>
  );
};
