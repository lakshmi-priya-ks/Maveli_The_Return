import React from 'react';
import { Volume2, VolumeX, Pause } from 'lucide-react';

interface HUDProps {
  lives: number;
  maxLives: number;
  objective: string;
  fragmentsCollected: number;
  totalFragments: number;
  pookalamPercent: number;
  isMuted: boolean;
  onToggleMute: () => void;
  onPause: () => void;
}

export const HUD: React.FC<HUDProps> = ({
  lives,
  maxLives,
  objective,
  fragmentsCollected,
  totalFragments,
  pookalamPercent,
  isMuted,
  onToggleMute,
  onPause,
}) => {
  return (
    <header className="absolute top-0 left-0 right-0 px-4 py-2.5 pointer-events-none flex items-center justify-between z-20 select-none">
      {/* Top Left: Lives - Handcrafted brass lotus flame indicators */}
      <div className="flex items-center gap-2 pointer-events-auto">
        <div className="flex items-center gap-1.5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
          {Array.from({ length: maxLives }).map((_, idx) => {
            const isAlive = idx < lives;
            return (
              <div
                key={idx}
                title={isAlive ? 'Sacred Life Flame Active' : 'Life Extinguished'}
                className="relative w-5 h-6 flex items-center justify-center transition-transform duration-300"
              >
                {/* Brass Lamp Base */}
                <svg className="w-5 h-6" viewBox="0 0 24 28" fill="none">
                  {/* Stem & saucer */}
                  <ellipse cx="12" cy="24" rx="8" ry="3" fill={isAlive ? '#b89428' : '#4a3318'} />
                  <path d="M11 16 H13 V24 H11 Z" fill={isAlive ? '#d4af37' : '#3a2410'} />
                  <ellipse cx="12" cy="16" rx="6" ry="2.5" fill={isAlive ? '#f5d77f' : '#4a3318'} />
                  {/* Flame */}
                  {isAlive ? (
                    <>
                      <path
                        d="M12 4 C15 9, 16 13, 12 16 C8 13, 9 9, 12 4 Z"
                        fill="#ff7700"
                        className="animate-pulse"
                      />
                      <ellipse cx="12" cy="13" rx="2" ry="2.5" fill="#fff4a3" />
                    </>
                  ) : (
                    <circle cx="12" cy="15" r="1.5" fill="#241508" />
                  )}
                </svg>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top Center: Minimal Pookalam Motif & Objective with delicate divider */}
      <div className="flex flex-col items-center pointer-events-none max-w-[50vw]">
        <div className="flex items-center gap-2 drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
          {/* Miniature Circular Pookalam Progress Motif */}
          <div className="relative w-6 h-6 flex items-center justify-center">
            <svg className="w-6 h-6 -rotate-90" viewBox="0 0 36 36">
              {/* Outer track */}
              <circle
                cx="18"
                cy="18"
                r="15"
                fill="rgba(24, 14, 8, 0.6)"
                stroke="rgba(212, 175, 55, 0.3)"
                strokeWidth="2.5"
              />
              {/* Concentric progress arc */}
              <circle
                cx="18"
                cy="18"
                r="15"
                fill="none"
                stroke="#ffd700"
                strokeWidth="2.8"
                strokeDasharray={`${(pookalamPercent / 100) * 94.2}, 94.2`}
                strokeLinecap="round"
              />
            </svg>
            {/* Inner flower core */}
            <div
              className={`absolute w-2 h-2 rounded-full transition-colors duration-500 ${
                pookalamPercent >= 100
                  ? 'bg-[#ffd700] shadow-[0_0_8px_#ffd700]'
                  : pookalamPercent >= 50
                  ? 'bg-[#f59e0b]'
                  : 'bg-[#ef4444]'
              }`}
            />
          </div>

          <span className="font-kerala-title text-xs tracking-wider text-[#ffd700] font-bold drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
            POOKALAM {pookalamPercent}%
          </span>
        </div>

        {/* Objective label with subtle decorative divider */}
        <div className="hidden sm:flex items-center gap-2 mt-0.5 opacity-90 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
          <span className="text-[#d4af37] text-[9px]">❖</span>
          <p className="text-[11px] text-[#fbf7ed] font-kerala-body tracking-wide truncate max-w-[320px]">
            {objective}
          </p>
          <span className="text-[#d4af37] text-[9px]">❖</span>
        </div>
      </div>

      {/* Top Right: Fragment Count & Discreet Brass Buttons */}
      <div className="flex items-center gap-2.5 pointer-events-auto">
        {/* Fragment Count */}
        <div className="flex items-center gap-1.5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)]">
          {/* Floral fragment icon */}
          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="8" fill="#d97706" />
            <circle cx="10" cy="10" r="5" fill="#ef4444" />
            <circle cx="10" cy="10" r="2.5" fill="#ffd700" />
          </svg>
          <span className="font-kerala-title text-xs text-[#fef08a] font-semibold">
            {fragmentsCollected}/{totalFragments}
          </span>
        </div>

        {/* Mute Button */}
        <button
          onClick={onToggleMute}
          title={isMuted ? 'Unmute Audio (M)' : 'Mute Audio (M)'}
          className="w-7 h-7 rounded-full bg-[#201209]/80 border border-[#d4af37]/70 flex items-center justify-center text-[#d4af37] hover:text-[#fff4a3] hover:border-[#ffd700] transition-colors cursor-pointer shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
        >
          {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
        </button>

        {/* Pause Button */}
        <button
          onClick={onPause}
          title="Pause (ESC)"
          className="w-7 h-7 rounded-full bg-[#201209]/80 border border-[#d4af37]/70 flex items-center justify-center text-[#d4af37] hover:text-[#fff4a3] hover:border-[#ffd700] transition-colors cursor-pointer shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
        >
          <Pause className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
};
