import { sound } from '../../audio/soundEngine';

export type ChendaStroke = 'dhim' | 'tha' | 'ki' | 'ta';

export interface DrumPad {
  id: ChendaStroke;
  label: string;
  sublabel: string;
  x: number;
  y: number;
  radius: number;
  color: string;
  activeUntil: number;
}

export class ChendaRhythmPuzzle {
  public pads: DrumPad[] = [];
  public currentRound = 1;
  public maxRounds = 3;
  public sequence: ChendaStroke[] = [];
  public playerInputIndex = 0;
  public isPlayingSequence = false;
  public sequenceTimer = 0;
  public sequenceStep = 0;
  public isCompleted = false;
  public feedbackMessage = '';
  public feedbackTimer = 0;
  public centerX = 0;
  public centerY = 0;

  constructor(width: number, height: number) {
    this.reset(width, height);
  }

  public reset(width: number, height: number) {
    this.currentRound = 1;
    this.isCompleted = false;
    this.feedbackMessage = 'Listen to the sacred rhythm of the Chenda...';
    this.feedbackTimer = 3;
    this.playerInputIndex = 0;
    this.centerX = width * 0.5;
    this.centerY = height * 0.5;

    // 4 Traditional Drum Pads: DHIM, THA, KI, TA
    const padSize = Math.min(54, width * 0.11);
    const spacing = Math.min(130, width * 0.23);

    const padDefs: Array<{ id: ChendaStroke; label: string; sublabel: string; color: string }> = [
      { id: 'dhim', label: 'DHIM', sublabel: 'Deep Bass', color: '#9a3412' },
      { id: 'tha', label: 'THA', sublabel: 'Resonant', color: '#c2410c' },
      { id: 'ki', label: 'KI', sublabel: 'Rim Edge', color: '#b45309' },
      { id: 'ta', label: 'TA', sublabel: 'Crisp Strike', color: '#ca8a04' },
    ];

    this.pads = padDefs.map((def, idx) => {
      const px = this.centerX + (idx - 1.5) * spacing;
      const py = this.centerY + 70;
      return {
        id: def.id,
        label: def.label,
        sublabel: def.sublabel,
        x: px,
        y: py,
        radius: padSize,
        color: def.color,
        activeUntil: 0,
      };
    });

    this.startRound(1);
  }

  public startRound(round: number) {
    this.currentRound = round;
    this.playerInputIndex = 0;
    this.isPlayingSequence = true;
    this.sequenceStep = 0;
    this.sequenceTimer = 0.8; // Brief initial delay

    // Sequences for the 3 rounds
    if (round === 1) {
      this.sequence = ['dhim', 'tha', 'ki'];
      this.feedbackMessage = 'Round 1: 3 Beats';
    } else if (round === 2) {
      this.sequence = ['tha', 'ki', 'ta', 'dhim'];
      this.feedbackMessage = 'Round 2: 4 Beats';
    } else {
      this.sequence = ['dhim', 'dhim', 'tha', 'ki', 'ta'];
      this.feedbackMessage = 'Round 3: 5 Beats (Panchari Melam)';
    }
  }

  public triggerPad(stroke: ChendaStroke, isPlayer = true) {
    sound.playChenda(stroke);
    const pad = this.pads.find((p) => p.id === stroke);
    if (pad) {
      pad.activeUntil = performance.now() + 240;
    }

    if (isPlayer) {
      if (this.isPlayingSequence || this.isCompleted) return;

      const expected = this.sequence[this.playerInputIndex];
      if (stroke === expected) {
        this.playerInputIndex++;
        // Check if round complete
        if (this.playerInputIndex >= this.sequence.length) {
          sound.playTempleBell(784);
          if (this.currentRound >= this.maxRounds) {
            this.isCompleted = true;
            this.feedbackMessage = 'Chenda Mastered! The temple gates open!';
            sound.playLampLight();
          } else {
            this.feedbackMessage = 'Excellent rhythm!';
            setTimeout(() => {
              this.startRound(this.currentRound + 1);
            }, 900);
          }
        }
      } else {
        // Mistake: gentle retry
        this.feedbackMessage = 'Listen once more...';
        sound.playFootstep();
        this.playerInputIndex = 0;
        setTimeout(() => {
          this.startRound(this.currentRound);
        }, 1000);
      }
    }
  }

  public handlePointerDown(x: number, y: number): boolean {
    if (this.isPlayingSequence || this.isCompleted) return false;

    for (const pad of this.pads) {
      const dist = Math.hypot(x - pad.x, y - pad.y);
      if (dist <= pad.radius) {
        this.triggerPad(pad.id, true);
        return true;
      }
    }
    return false;
  }

  public update(dt: number) {
    if (this.isPlayingSequence) {
      this.sequenceTimer -= dt;
      if (this.sequenceTimer <= 0) {
        if (this.sequenceStep < this.sequence.length) {
          const stroke = this.sequence[this.sequenceStep];
          this.triggerPad(stroke, false);
          this.sequenceStep++;
          this.sequenceTimer = 0.55;
        } else {
          this.isPlayingSequence = false;
          this.feedbackMessage = 'Your turn! Repeat the rhythm:';
        }
      }
    }
  }

  public render(ctx: CanvasRenderingContext2D, _time: number) {
    ctx.save();

    // Central Traditional Wooden Chenda Illustration
    ctx.translate(this.centerX, this.centerY - 90);

    // Chenda Drum Body (Jackfruit tree carved wood cylinder)
    ctx.fillStyle = '#6b2d0d';
    ctx.fillRect(-70, -40, 140, 80);

    // Brass tension rings & hemp ropes (Varukal)
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 3;
    ctx.strokeRect(-70, -40, 140, 80);

    // Zig-zag tension ropes across cylinder
    ctx.strokeStyle = '#e2d3b3';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let rx = -65; rx <= 65; rx += 20) {
      ctx.moveTo(rx, -40);
      ctx.lineTo(rx + 10, 40);
      ctx.lineTo(rx + 20, -40);
    }
    ctx.stroke();

    // Cowhide drumhead edges (Idanthala / Valanthala)
    ctx.fillStyle = '#f5ecd7';
    ctx.beginPath();
    ctx.ellipse(-70, 0, 12, 40, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.ellipse(70, 0, 12, 40, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.restore();

    // Render 4 Drum Pads
    const now = performance.now();
    for (const pad of this.pads) {
      ctx.save();
      const isActive = now < pad.activeUntil;

      // Outer wooden bezel
      ctx.fillStyle = isActive ? '#ffd700' : '#451a03';
      ctx.beginPath();
      ctx.arc(pad.x, pad.y, pad.radius + 4, 0, Math.PI * 2);
      ctx.fill();

      // Parchment / membrane face
      ctx.fillStyle = isActive ? '#ffffff' : pad.color;
      ctx.beginPath();
      ctx.arc(pad.x, pad.y, pad.radius, 0, Math.PI * 2);
      ctx.fill();

      // Concentric drumhead ring
      ctx.strokeStyle = isActive ? '#b45309' : 'rgba(255,255,255,0.4)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(pad.x, pad.y, pad.radius * 0.65, 0, Math.PI * 2);
      ctx.stroke();

      // Label (Stroke Name)
      ctx.fillStyle = isActive ? '#9a3412' : '#fef3c7';
      ctx.font = 'bold 18px "Cinzel", serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(pad.label, pad.x, pad.y - 4);

      // Sublabel
      ctx.font = '10px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = isActive ? '#78350f' : '#fde68a';
      ctx.fillText(pad.sublabel, pad.x, pad.y + 14);

      ctx.restore();
    }
  }
}
