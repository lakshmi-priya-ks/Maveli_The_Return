import React from 'react';
import { FinalPookalamPuzzle } from '../game/puzzles/FinalPookalamPuzzle';
import { Check, Sparkles } from 'lucide-react';

interface FinalPookalamUIProps {
  puzzle: FinalPookalamPuzzle;
  onSelectFlower: (id: number) => void;
}

export const FinalPookalamUI: React.FC<FinalPookalamUIProps> = ({
  puzzle,
  onSelectFlower,
}) => {
  const selectedFlower = puzzle.flowers.find((f) => f.id === puzzle.selectedFlowerId);
  const placedCount = puzzle.rings.filter((r) => r.placedFlowerId !== null).length;
  const isCompleted = puzzle.isCompleted;

  // Custom authentic floral SVG visual for each flower
  const renderFlowerIcon = (id: number) => {
    switch (id) {
      case 0: // Thamara (Pink Lotus)
        return (
          <svg className="w-8 h-8 drop-shadow-sm" viewBox="0 0 36 36" fill="none">
            {/* Outer petals */}
            <path d="M18 4 C11 12, 6 20, 18 29 C30 20, 25 12, 18 4 Z" fill="#f472b6" />
            <path d="M9 13 C4 18, 5 24, 18 29 C12 25, 9 20, 9 13 Z" fill="#db2777" />
            <path d="M27 13 C32 18, 31 24, 18 29 C24 25, 27 20, 27 13 Z" fill="#db2777" />
            {/* Inner petals */}
            <path d="M18 10 C14 15, 11 21, 18 28 C25 21, 22 15, 18 10 Z" fill="#fbcfe8" />
            {/* Golden Core */}
            <circle cx="18" cy="22" r="3.5" fill="#ffd700" />
          </svg>
        );
      case 1: // Shankhupushpam (Royal Blue Butterfly Pea)
        return (
          <svg className="w-8 h-8 drop-shadow-sm" viewBox="0 0 36 36" fill="none">
            {/* Broad conch outer wing */}
            <ellipse cx="18" cy="17" rx="14" ry="11" fill="#1d4ed8" />
            <ellipse cx="18" cy="18" rx="11" ry="8" fill="#3b82f6" />
            {/* Pure white and yellow throat */}
            <ellipse cx="18" cy="20" rx="5" ry="3.5" fill="#ffffff" />
            <ellipse cx="18" cy="21" rx="2" ry="1.5" fill="#fde047" />
          </svg>
        );
      case 2: // Chethi (Crimson Ixora)
        return (
          <svg className="w-8 h-8 drop-shadow-sm" viewBox="0 0 36 36" fill="none">
            {/* 4 cruciform scarlet petals */}
            <ellipse cx="18" cy="10" rx="4" ry="7" fill="#ef4444" />
            <ellipse cx="18" cy="26" rx="4" ry="7" fill="#ef4444" />
            <ellipse cx="10" cy="18" rx="7" ry="4" fill="#dc2626" />
            <ellipse cx="26" cy="18" rx="7" ry="4" fill="#dc2626" />
            {/* Gold eye */}
            <circle cx="18" cy="18" r="2.8" fill="#ffd700" />
          </svg>
        );
      case 3: // Chendumalli (Golden Marigold)
        return (
          <svg className="w-8 h-8 drop-shadow-sm" viewBox="0 0 36 36" fill="none">
            {/* Multi-layered ruffled marigold */}
            <circle cx="18" cy="18" r="13" fill="#b45309" />
            <circle cx="18" cy="18" r="10.5" fill="#f59e0b" />
            <circle cx="18" cy="18" r="7.5" fill="#fbbf24" />
            <circle cx="18" cy="18" r="4" fill="#fef08a" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-3 sm:p-5 z-20 select-none">
      {/* Top Banner: Concise Instruction & Dynamic Visual Hint */}
      <div className="flex flex-col items-center mt-12 sm:mt-11 drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
        <div className="bg-[#1f120a]/92 border border-[#d4af37]/80 rounded-full px-4 py-1.5 flex items-center gap-2 shadow-lg backdrop-blur-xs max-w-[90vw]">
          <span className="text-[#ffd700] text-xs">❖</span>
          <h2 className="font-kerala-title text-xs sm:text-sm font-bold tracking-wider text-[#ffd700] uppercase truncate">
            Arrange the Grand Pookalam
          </h2>
          <span className="text-[#ffd700] text-xs">❖</span>
        </div>

        {/* Dynamic Action Cue */}
        <div className="mt-1.5 flex items-center gap-2 px-3 py-0.5 rounded-full bg-[#180e07]/85 border border-[#d4af37]/40 shadow">
          {selectedFlower ? (
            <p className="text-[11px] sm:text-xs text-[#fef08a] font-kerala-body tracking-wide flex items-center gap-1.5 animate-pulse">
              <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: selectedFlower.color }} />
              <span>Tap the matching ring to place <strong>{selectedFlower.name}</strong></span>
              <button
                onClick={() => onSelectFlower(selectedFlower.id)}
                className="pointer-events-auto ml-1.5 px-1.5 py-0.2 text-[10px] rounded bg-[#4a2612] text-[#fcd34d] hover:bg-[#6e391b] border border-[#d4af37]/50 cursor-pointer"
                title="Deselect flower"
              >
                ✕ Cancel
              </button>
            </p>
          ) : (
            <p className="text-[11px] sm:text-xs text-[#e8d8b5] font-kerala-body tracking-wide flex items-center gap-1.5">
              <span className="text-[#d4af37] font-bold">Step:</span>
              <span>Select flower below → Place in ring</span>
            </p>
          )}
        </div>
      </div>

      {/* Bottom Area: Flower Selection Tray */}
      <div className="w-full flex justify-center items-end pb-2 sm:pb-3 pointer-events-auto">
        <div className="w-full max-w-2xl bg-[#1c1008]/95 border-2 border-[#d4af37]/90 rounded-xl sm:rounded-2xl p-2.5 sm:p-3 shadow-2xl backdrop-blur-xs">
          {/* Progress indicator */}
          <div className="flex items-center justify-between mb-2 px-1 text-[11px] font-kerala-title text-[#d4af37]">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#ffd700]" />
              <span className="tracking-wide">POOKALAM RESTORATION</span>
            </span>
            <span className="font-bold text-[#ffd700]">
              {placedCount} / 4 RINGS
            </span>
          </div>

          {/* 4 Flower Option Buttons: Responsive Grid (2x2 on mobile portrait, 4x1 on tablet/desktop) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5">
            {puzzle.flowers.map((flw) => {
              const isSelected = puzzle.selectedFlowerId === flw.id;
              const isPlaced = flw.isPlaced;

              return (
                <button
                  key={flw.id}
                  disabled={isPlaced || isCompleted}
                  onClick={() => onSelectFlower(flw.id)}
                  title={
                    isPlaced
                      ? `${flw.name} is already placed`
                      : `Select ${flw.name} (${flw.role})`
                  }
                  className={`relative flex items-center sm:flex-col sm:text-center gap-2 sm:gap-1.5 p-2 sm:p-2.5 rounded-lg border transition-all duration-200 select-none cursor-pointer ${
                    isPlaced
                      ? 'bg-[#150d07]/70 border-[#5e4225]/40 opacity-75 cursor-default'
                      : isSelected
                      ? 'bg-[#4e270f] border-[#ffd700] -translate-y-1 shadow-[0_4px_12px_rgba(212,175,55,0.35)] ring-1 ring-[#ffd700]'
                      : 'bg-[#26150b] border-[#8c5a2b]/70 hover:border-[#ffd700] hover:bg-[#341d0f] active:scale-95'
                  }`}
                >
                  {/* Flower Visual */}
                  <div className="relative flex-shrink-0 flex items-center justify-center">
                    {renderFlowerIcon(flw.id)}
                    {isPlaced && (
                      <div className="absolute inset-0 flex items-center justify-center bg-[#180e07]/80 rounded-full">
                        <Check className="w-4 h-4 text-[#ffd700]" strokeWidth={3} />
                      </div>
                    )}
                  </div>

                  {/* Text Details */}
                  <div className="flex-1 text-left sm:text-center min-w-0">
                    <div className="flex items-center gap-1 sm:justify-center">
                      <span className={`block font-kerala-title text-xs sm:text-sm font-bold truncate ${
                        isSelected ? 'text-[#ffd700]' : isPlaced ? 'text-[#a89878]' : 'text-[#fef08a]'
                      }`}>
                        {flw.name}
                      </span>
                    </div>
                    <span className="block text-[10px] text-[#e8d8b5]/80 font-kerala-body truncate">
                      {flw.malayalam}
                    </span>
                    <span className="hidden sm:block text-[9px] text-[#c4b595]/60 truncate mt-0.5">
                      {flw.role}
                    </span>
                  </div>

                  {/* Active selection dot */}
                  {isSelected && (
                    <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#ffd700] shadow-[0_0_6px_#ffd700] animate-ping" />
                  )}
                  {isPlaced && (
                    <span className="sm:hidden text-[9px] text-[#ffd700] font-bold">
                      ✓ Done
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Completion Celebration Overlay Banner */}
      {isCompleted && puzzle.completionTimer > 0.6 && (
        <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center bg-black/40 z-30 transition-opacity duration-700">
          <div className="bg-[#24130a]/95 border-2 border-[#ffd700] rounded-2xl p-6 sm:p-8 max-w-md text-center shadow-[0_0_40px_rgba(255,215,0,0.4)] animate-in fade-in zoom-in duration-500">
            <div className="flex justify-center mb-2">
              <Sparkles className="w-8 h-8 text-[#ffd700] animate-spin" />
            </div>
            <h1 className="font-kerala-title text-xl sm:text-2xl font-black tracking-widest text-[#ffd700] mb-1">
              POOKALAM RESTORED
            </h1>
            <p className="font-kerala-body text-base text-[#fef08a] mb-3">
              പൂക്കളം പൂർത്തിയായി
            </p>
            <p className="text-xs sm:text-sm text-[#e8d8b5] font-kerala-body leading-relaxed">
              The grand floral mandala shines with harmony and blessing. King Maveli smiles upon the festival.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
