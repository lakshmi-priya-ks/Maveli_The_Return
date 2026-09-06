import React from 'react';
import { X, ArrowLeft, ArrowRight, ArrowUp, Compass, Drum, Palette, Puzzle } from 'lucide-react';

interface HowToPlayModalProps {
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ onClose }) => {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs select-none">
      <div className="relative w-full max-w-2xl bg-[#23150e] border-2 border-[#d4af37] rounded-lg p-6 shadow-2xl text-[#f7eed8]">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-[#d4af37]/40 pb-3 mb-4">
          <h2 className="font-kerala-title text-xl md:text-2xl font-bold text-[#ffd700] tracking-wide">
            HOW TO PLAY
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded text-[#d4af37] hover:text-[#fff] hover:bg-[#3a2215] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Visual Guides Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-kerala-body max-h-[70vh] overflow-y-auto pr-1">
          {/* Controls */}
          <div className="p-3.5 rounded bg-[#1c110b] border border-[#d4af37]/30">
            <h3 className="font-kerala-title text-[#ffd700] text-sm font-semibold mb-2 flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#f59e0b]" />
              MOVEMENT & CONTROLS
            </h3>
            <div className="space-y-2 text-xs text-[#e8d8b5]">
              <div className="flex items-center justify-between">
                <span>Move Left / Right:</span>
                <div className="flex gap-1">
                  <kbd className="px-2 py-1 bg-[#2d1b11] border border-[#d4af37]/50 rounded text-[11px] font-mono">
                    &larr; / &rarr;
                  </kbd>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span>Jump:</span>
                <div className="flex gap-1">
                  <kbd className="px-2 py-1 bg-[#2d1b11] border border-[#d4af37]/50 rounded text-[11px] font-mono">
                    &uarr; or Space
                  </kbd>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span>Pause:</span>
                <kbd className="px-2 py-1 bg-[#2d1b11] border border-[#d4af37]/50 rounded text-[11px] font-mono">
                  ESC
                </kbd>
              </div>
              <div className="flex items-center justify-between">
                <span>Mute / Unmute:</span>
                <kbd className="px-2 py-1 bg-[#2d1b11] border border-[#d4af37]/50 rounded text-[11px] font-mono">
                  M
                </kbd>
              </div>
              <p className="text-[11px] text-[#a38c70] pt-1 italic">
                *On mobile devices, on-screen touch buttons will appear automatically.
              </p>
            </div>
          </div>

          {/* Objective: Pookalam Fragments */}
          <div className="p-3.5 rounded bg-[#1c110b] border border-[#d4af37]/30">
            <h3 className="font-kerala-title text-[#ffd700] text-sm font-semibold mb-2 flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded-full bg-[#f59e0b] border border-[#ffd700]" />
              POOKALAM FRAGMENTS
            </h3>
            <p className="text-xs text-[#e8d8b5] leading-relaxed">
              Explore each level to collect the shattered floral pieces. When all fragments in an area are found, reach the sacred stone altar to begin the restoration challenge.
            </p>
            <div className="mt-3 flex items-center gap-2 text-xs text-[#ffd700]">
              <div className="w-2 h-2 rounded-full bg-[#ef4444]" />
              <span>Watch out for water canals & river hazards!</span>
            </div>
          </div>

          {/* Puzzles: Jigsaw & Maze */}
          <div className="p-3.5 rounded bg-[#1c110b] border border-[#d4af37]/30">
            <h3 className="font-kerala-title text-[#ffd700] text-sm font-semibold mb-2 flex items-center gap-2">
              <Puzzle className="w-4 h-4 text-[#f59e0b]" />
              PUZZLE INTERLUDES
            </h3>
            <div className="space-y-1 text-xs text-[#e8d8b5]">
              <p>
                <strong>Level 1 Jigsaw:</strong> Drag floral quadrants into the central altar. Tap/click to rotate.
              </p>
              <p className="pt-1">
                <strong>Level 2 Maze:</strong> Navigate Kerala temple garden paths. Choose between the fast path or winding route for bonus score petals!
              </p>
            </div>
          </div>

          {/* Rhythms & Final Pookalam */}
          <div className="p-3.5 rounded bg-[#1c110b] border border-[#d4af37]/30">
            <h3 className="font-kerala-title text-[#ffd700] text-sm font-semibold mb-2 flex items-center gap-2">
              <Drum className="w-4 h-4 text-[#f59e0b]" />
              CHENDA & GRAND POOKALAM
            </h3>
            <div className="space-y-1 text-xs text-[#e8d8b5]">
              <p>
                <strong>Chenda Rhythm:</strong> Memorize and repeat traditional drum strokes (Dhim, Tha, Ki, Ta) across 3 short rounds.
              </p>
              <p className="pt-1">
                <strong>Grand Pookalam:</strong> Select and place sacred flowers (Thamara, Shankhupushpam, Chethi, Chendumalli) into matching concentric rings!
              </p>
            </div>
          </div>
        </div>

        {/* Got it button */}
        <div className="mt-5 text-center">
          <button
            onClick={onClose}
            className="px-8 py-2.5 rounded-md bg-[#b45309] text-[#fff] font-kerala-title font-bold text-sm tracking-wider border border-[#ffd700] hover:bg-[#d97706] transition-colors cursor-pointer"
          >
            UNDERSTOOD &bull; CONTINUE
          </button>
        </div>
      </div>
    </div>
  );
};
