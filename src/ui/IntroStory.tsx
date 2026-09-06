import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { sound } from '../audio/soundEngine';

interface IntroStoryProps {
  onContinue: () => void;
}

export const IntroStory: React.FC<IntroStoryProps> = ({ onContinue }) => {
  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs select-none">
      <div className="relative w-full max-w-lg bg-[#23150e] border-2 border-[#d4af37] rounded-lg p-6 md:p-8 shadow-2xl text-center">
        {/* Sacred Golden Lamp */}
        <div className="w-12 h-12 mx-auto mb-3 rounded-full border border-[#d4af37]/60 flex items-center justify-center bg-[#1c110b]">
          <Sparkles className="w-5 h-5 text-[#ffd700]" />
        </div>

        <h2 className="font-kerala-title text-2xl md:text-3xl font-extrabold text-[#ffd700] tracking-wider uppercase mb-2">
          THE RETURN OF MAVELI
        </h2>

        <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mx-auto my-3" />

        <div className="space-y-3 text-xs md:text-sm text-[#e8d8b5] font-kerala-body leading-relaxed text-left max-w-md mx-auto">
          <p>
            As the gentle monsoon winds subside, King Maveli arrives on the shores of Kerala to visit his beloved people for Thiruvonam.
          </p>
          <p>
            Yet the village courtyards lie quiet. The great welcome Pookalam has been scattered to the winds. The ceremonial lamps remain unlit.
          </p>
          <p className="text-[#fef08a] font-medium">
            Join Maveli across the village, the emerald paddy fields, and the shimmering backwaters. Gather the missing floral fragments and restore the spirit of Onam!
          </p>
        </div>

        <button
          onClick={() => {
            sound.playTempleBell(880);
            onContinue();
          }}
          className="mt-6 w-full py-3.5 px-6 rounded-md bg-gradient-to-r from-[#b45309] via-[#d97706] to-[#b45309] text-[#fffef0] font-kerala-title font-bold text-sm tracking-wider border border-[#ffd700] shadow-lg active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>ENTER THE VILLAGE</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
