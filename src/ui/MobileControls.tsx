import React from 'react';
import { ArrowLeft, ArrowRight, ArrowUp, ArrowDown } from 'lucide-react';

interface MobileControlsProps {
  onLeftDown: () => void;
  onLeftUp: () => void;
  onRightDown: () => void;
  onRightUp: () => void;
  onJumpDown: () => void;
  onJumpUp: () => void;
  isMaze?: boolean;
  onUpDown?: () => void;
  onUpUp?: () => void;
  onDownDown?: () => void;
  onDownUp?: () => void;
}

export const MobileControls: React.FC<MobileControlsProps> = ({
  onLeftDown,
  onLeftUp,
  onRightDown,
  onRightUp,
  onJumpDown,
  onJumpUp,
  isMaze = false,
  onUpDown,
  onUpUp,
  onDownDown,
  onDownUp,
}) => {
  return (
    <div className="absolute inset-x-0 bottom-0 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] px-[max(1rem,env(safe-area-inset-left))] pointer-events-none z-30 flex justify-between items-end select-none">
      {/* Left side: Directional D-Pad / Horizontal buttons */}
      {isMaze ? (
        // 4-way D-Pad for Maze
        <div className="grid grid-cols-3 gap-1.5 pointer-events-auto bg-[#23150e]/80 p-2 rounded-lg border border-[#d4af37]/50">
          <div />
          <button
            onTouchStart={(e) => { e.preventDefault(); onUpDown?.(); }}
            onTouchEnd={(e) => { e.preventDefault(); onUpUp?.(); }}
            onMouseDown={onUpDown}
            onMouseUp={onUpUp}
            className="w-12 h-12 rounded bg-[#3a2012] border border-[#d4af37] text-[#ffd700] flex items-center justify-center active:bg-[#b45309] transition-colors"
          >
            <ArrowUp className="w-6 h-6" />
          </button>
          <div />

          <button
            onTouchStart={(e) => { e.preventDefault(); onLeftDown(); }}
            onTouchEnd={(e) => { e.preventDefault(); onLeftUp(); }}
            onMouseDown={onLeftDown}
            onMouseUp={onLeftUp}
            className="w-12 h-12 rounded bg-[#3a2012] border border-[#d4af37] text-[#ffd700] flex items-center justify-center active:bg-[#b45309] transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div />
          <button
            onTouchStart={(e) => { e.preventDefault(); onRightDown(); }}
            onTouchEnd={(e) => { e.preventDefault(); onRightUp(); }}
            onMouseDown={onRightDown}
            onMouseUp={onRightUp}
            className="w-12 h-12 rounded bg-[#3a2012] border border-[#d4af37] text-[#ffd700] flex items-center justify-center active:bg-[#b45309] transition-colors"
          >
            <ArrowRight className="w-6 h-6" />
          </button>

          <div />
          <button
            onTouchStart={(e) => { e.preventDefault(); onDownDown?.(); }}
            onTouchEnd={(e) => { e.preventDefault(); onDownUp?.(); }}
            onMouseDown={onDownDown}
            onMouseUp={onDownUp}
            className="w-12 h-12 rounded bg-[#3a2012] border border-[#d4af37] text-[#ffd700] flex items-center justify-center active:bg-[#b45309] transition-colors"
          >
            <ArrowDown className="w-6 h-6" />
          </button>
          <div />
        </div>
      ) : (
        // Horizontal Movement (Left / Right)
        <div className="flex gap-3 pointer-events-auto">
          <button
            onTouchStart={(e) => { e.preventDefault(); onLeftDown(); }}
            onTouchEnd={(e) => { e.preventDefault(); onLeftUp(); }}
            onMouseDown={onLeftDown}
            onMouseUp={onLeftUp}
            className="w-14 h-14 rounded-full bg-[#2a170e]/90 border-2 border-[#d4af37] text-[#ffd700] flex items-center justify-center active:bg-[#b45309] active:scale-95 transition-all shadow-lg"
          >
            <ArrowLeft className="w-7 h-7" />
          </button>

          <button
            onTouchStart={(e) => { e.preventDefault(); onRightDown(); }}
            onTouchEnd={(e) => { e.preventDefault(); onRightUp(); }}
            onMouseDown={onRightDown}
            onMouseUp={onRightUp}
            className="w-14 h-14 rounded-full bg-[#2a170e]/90 border-2 border-[#d4af37] text-[#ffd700] flex items-center justify-center active:bg-[#b45309] active:scale-95 transition-all shadow-lg"
          >
            <ArrowRight className="w-7 h-7" />
          </button>
        </div>
      )}

      {/* Right side: Jump / Action button */}
      {!isMaze && (
        <div className="pointer-events-auto pr-[max(0.5rem,env(safe-area-inset-right))]">
          <button
            onTouchStart={(e) => { e.preventDefault(); onJumpDown(); }}
            onTouchEnd={(e) => { e.preventDefault(); onJumpUp(); }}
            onMouseDown={onJumpDown}
            onMouseUp={onJumpUp}
            className="w-16 h-16 rounded-full bg-gradient-to-t from-[#9a3412] to-[#ea580c] border-2 border-[#ffd700] text-[#fff] flex flex-col items-center justify-center active:scale-90 transition-all shadow-xl"
          >
            <ArrowUp className="w-7 h-7 stroke-[2.5]" />
            <span className="text-[9px] font-kerala-title font-bold tracking-widest text-[#fef08a]">
              JUMP
            </span>
          </button>
        </div>
      )}
    </div>
  );
};
