import React, { useEffect, useState } from 'react';
import { sound } from '../audio/soundEngine';

interface CelebrationScreenProps {
  onComplete: () => void;
}

export const CelebrationScreen: React.FC<CelebrationScreenProps> = ({ onComplete }) => {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    // Start authentic traditional Chenda Melam celebratory rhythm!
    sound.startMelam();

    const t1 = setTimeout(() => setStage(1), 1500); // "THE COLOURS OF ONAM HAVE RETURNED"
    const t2 = setTimeout(() => setStage(2), 3800); // "WELCOME HOME, MAVELI"
    const t3 = setTimeout(() => setStage(3), 6200); // "HAPPY ONAM"

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      sound.stopMelam();
    };
  }, []);

  return (
    <div className="absolute inset-0 z-40 flex flex-col items-center justify-between p-6 md:p-10 pointer-events-auto bg-gradient-to-b from-[#1b140e]/60 via-transparent to-[#1b140e]/85 select-none animate-fadeIn">
      {/* Drifting Petals Canvas / Visual Accents */}
      <div className="flex items-center gap-2 text-[#ffd700]">
        <div className="w-2.5 h-2.5 rounded-full bg-[#f59e0b] animate-ping" />
        <span className="font-kerala-title text-xs md:text-sm tracking-widest text-[#f5ecd7] font-semibold uppercase">
          Thiruvonam Celebration
        </span>
        <div className="w-2.5 h-2.5 rounded-full bg-[#f59e0b] animate-ping" />
      </div>

      {/* Center Narrative Messages that unfold smoothly */}
      <div className="flex flex-col items-center text-center my-auto px-4 max-w-xl">
        {/* Sacred Golden Nilavilakku emblem */}
        <div className="w-14 h-14 mb-4 rounded-full border-2 border-[#d4af37] bg-[#2a1a11]/90 flex items-center justify-center shadow-[0_0_20px_rgba(255,215,0,0.5)]">
          <div className="w-5 h-5 rounded-full bg-[#ef4444]" />
        </div>

        {stage >= 1 && (
          <h3 className="font-kerala-title text-base sm:text-xl md:text-2xl text-[#fef08a] font-semibold tracking-wider transition-all duration-700">
            THE COLOURS OF ONAM HAVE RETURNED
          </h3>
        )}

        {stage >= 2 && (
          <h1 className="font-kerala-title text-3xl sm:text-5xl md:text-6xl font-extrabold text-[#ffd700] tracking-wide mt-3 drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)] transition-all duration-700">
            WELCOME HOME, MAVELI
          </h1>
        )}

        {stage >= 3 && (
          <div className="mt-4 transition-all duration-700 flex flex-col items-center">
            <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent my-3" />
            <h2 className="font-kerala-title text-2xl sm:text-3xl md:text-4xl text-[#faf6eb] font-bold tracking-widest">
              HAPPY ONAM
            </h2>
            <p className="text-xs sm:text-sm text-[#e8d8b5] font-kerala-body mt-2 max-w-md">
              The Grand Pookalam is whole once again. Prosperity, harmony, and joy fill every courtyard of Kerala.
            </p>

            <button
              onClick={() => {
                sound.playTempleBell(880);
                onComplete();
              }}
              className="mt-8 px-8 py-3 rounded-md bg-gradient-to-r from-[#b45309] to-[#d97706] text-[#fffef0] font-kerala-title font-bold text-sm tracking-widest border-2 border-[#ffd700] shadow-[0_4px_20px_rgba(217,119,6,0.6)] hover:brightness-110 active:scale-98 transition-all cursor-pointer"
            >
              VIEW RESULTS
            </button>
          </div>
        )}
      </div>

      <div className="text-xs text-[#d4af37]/80 font-kerala-title tracking-widest text-center">
        CHENDA MELAM &bull; POOKALAM RESTORED
      </div>
    </div>
  );
};
