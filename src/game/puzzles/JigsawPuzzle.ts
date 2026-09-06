import { sound } from '../../audio/soundEngine';

export interface JigsawPiece {
  id: number;
  quadrant: 0 | 1 | 2 | 3; // 0: Top-Left, 1: Top-Right, 2: Bottom-Right, 3: Bottom-Left
  targetX: number;
  targetY: number;
  currentX: number;
  currentY: number;
  rotation: number; // 0, 90, 180, 270 degrees
  targetRotation: number;
  placed: boolean;
  name: string;
  flowers: string;
}

export class JigsawPuzzle {
  public pieces: JigsawPiece[] = [];
  public centerX: number = 0;
  public centerY: number = 0;
  public radius: number = 135;
  public selectedPieceId: number | null = null;
  public isDragging: boolean = false;
  public dragOffsetX: number = 0;
  public dragOffsetY: number = 0;
  private pointerDownX: number = 0;
  private pointerDownY: number = 0;
  private hasMovedSignificantly: boolean = false;
  public isCompleted: boolean = false;
  public completionTimer: number = 0;
  public lampLit: boolean = false;
  public feedbackNotice: string = '';
  public feedbackTimer: number = 0;
  public rotateButtonBounds = { x: 0, y: 0, w: 0, h: 0 };

  constructor(width: number, height: number) {
    this.reset(width, height);
  }

  public reset(width: number, height: number) {
    this.resize(width, height, true);
  }

  public resize(width: number, height: number, forceResetPieces = false) {
    const isPortrait = height > width;
    this.centerX = width * 0.5;
    this.centerY = isPortrait ? height * 0.38 : height * 0.42;

    // Radius tuned for comfortable visual balance and touch targets
    const availableSpace = isPortrait
      ? Math.min(width * 0.42, height * 0.25)
      : Math.min(width * 0.35, height * 0.32);
    this.radius = Math.max(110, Math.min(155, availableSpace));

    this.isCompleted = forceResetPieces ? false : this.isCompleted;
    this.completionTimer = forceResetPieces ? 0 : this.completionTimer;
    this.lampLit = forceResetPieces ? false : this.lampLit;
    this.selectedPieceId = forceResetPieces ? null : this.selectedPieceId;
    this.isDragging = false;
    this.feedbackNotice = forceResetPieces ? '' : this.feedbackNotice;
    this.feedbackTimer = forceResetPieces ? 0 : this.feedbackTimer;

    // 4 quadrants:
    // When sector is drawn from 0 to 90 degrees (Bottom-Right):
    // Rotation = 0   => 0 to 90 deg    (Bottom-Right)
    // Rotation = 90  => 90 to 180 deg  (Bottom-Left)
    // Rotation = 180 => 180 to 270 deg (Top-Left)
    // Rotation = 270 => 270 to 360 deg (Top-Right)
    const pieceDefinitions = [
      { id: 0, quadrant: 0 as const, targetRot: 180, name: 'Vada-Kizhakku (North-East)', flowers: 'Thumba & Chethi' },
      { id: 1, quadrant: 1 as const, targetRot: 270, name: 'Thekku-Kizhakku (South-East)', flowers: 'Chendumalli' },
      { id: 2, quadrant: 2 as const, targetRot: 0, name: 'Thekku-Padinjare (South-West)', flowers: 'Shankhupushpam' },
      { id: 3, quadrant: 3 as const, targetRot: 90, name: 'Vada-Padinjare (North-West)', flowers: 'Mukkutti' },
    ];

    // Tray layout
    const trayY = isPortrait ? height * 0.76 : height * 0.82;
    const traySpacing = Math.min(125, width * 0.23);

    // Position Rotate Button above or next to tray
    const btnW = 160;
    const btnH = 40;
    this.rotateButtonBounds = {
      x: this.centerX - btnW * 0.5,
      y: isPortrait ? height * 0.60 : height * 0.67,
      w: btnW,
      h: btnH,
    };

    if (forceResetPieces || this.pieces.length === 0) {
      this.pieces = pieceDefinitions.map((def, idx) => {
        const scatterX = this.centerX + (idx - 1.5) * traySpacing;
        // Scrambled rotation (intentionally different from targetRotation)
        const initialRotation = ((def.targetRot + (idx % 2 === 0 ? 90 : 180)) % 360);
        return {
          id: def.id,
          quadrant: def.quadrant,
          targetX: this.centerX,
          targetY: this.centerY,
          currentX: scatterX,
          currentY: trayY,
          rotation: initialRotation,
          targetRotation: def.targetRot,
          placed: false,
          name: def.name,
          flowers: def.flowers,
        };
      });
    } else {
      // Reposition placed pieces at new center, and unplaced pieces at tray
      this.pieces.forEach((p, idx) => {
        p.targetX = this.centerX;
        p.targetY = this.centerY;
        if (p.placed) {
          p.currentX = this.centerX;
          p.currentY = this.centerY;
        } else if (!this.isDragging || this.selectedPieceId !== p.id) {
          const scatterX = this.centerX + (idx - 1.5) * traySpacing;
          p.currentX = scatterX;
          p.currentY = trayY;
        }
      });
    }
  }

  // Hit test for a piece
  private isPointInPiece(x: number, y: number, piece: JigsawPiece): boolean {
    const dist = Math.hypot(x - piece.currentX, y - piece.currentY);
    if (dist > this.radius * 1.1) return false;

    // Mid-angle of the 90-degree quadrant
    const midAngleRad = ((piece.rotation + 45) * Math.PI) / 180;
    const centroidX = piece.currentX + Math.cos(midAngleRad) * (this.radius * 0.52);
    const centroidY = piece.currentY + Math.sin(midAngleRad) * (this.radius * 0.52);

    const distFromCentroid = Math.hypot(x - centroidX, y - centroidY);
    if (distFromCentroid < this.radius * 0.62) return true;

    // Angle check relative to apex
    const angleRad = Math.atan2(y - piece.currentY, x - piece.currentX);
    let angleDeg = (angleRad * 180) / Math.PI;
    if (angleDeg < 0) angleDeg += 360;

    let rot = piece.rotation % 360;
    if (rot < 0) rot += 360;

    const diff = (angleDeg - rot + 360) % 360;
    return diff <= 95 && dist <= this.radius + 8;
  }

  // Hit test for on-screen Rotate button
  private isPointInRotateButton(x: number, y: number): boolean {
    const b = this.rotateButtonBounds;
    return x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h;
  }

  public handlePointerDown(x: number, y: number): boolean {
    if (this.isCompleted) return false;

    // Check Rotate button tap
    if (this.isPointInRotateButton(x, y)) {
      this.rotateActivePiece();
      return true;
    }

    this.pointerDownX = x;
    this.pointerDownY = y;
    this.hasMovedSignificantly = false;

    // Check unplaced pieces topmost first
    for (let i = this.pieces.length - 1; i >= 0; i--) {
      const p = this.pieces[i];
      if (p.placed) continue;

      if (this.isPointInPiece(x, y, p)) {
        this.selectedPieceId = p.id;
        this.isDragging = true;
        this.dragOffsetX = p.currentX - x;
        this.dragOffsetY = p.currentY - y;

        // Bring selected piece to top of rendering order
        this.pieces.splice(i, 1);
        this.pieces.push(p);

        sound.playFootstep();
        return true;
      }
    }

    // Tapping elsewhere deselects piece
    this.selectedPieceId = null;
    return false;
  }

  public handlePointerMove(x: number, y: number) {
    if (!this.isDragging || this.selectedPieceId === null) return;

    if (Math.hypot(x - this.pointerDownX, y - this.pointerDownY) > 8) {
      this.hasMovedSignificantly = true;
    }

    const piece = this.pieces.find((p) => p.id === this.selectedPieceId);
    if (piece && !piece.placed) {
      piece.currentX = x + this.dragOffsetX;
      piece.currentY = y + this.dragOffsetY;
    }
  }

  public handlePointerUp(): boolean {
    if (!this.isDragging || this.selectedPieceId === null) {
      this.isDragging = false;
      return false;
    }

    const piece = this.pieces.find((p) => p.id === this.selectedPieceId);
    if (!piece || piece.placed) {
      this.isDragging = false;
      return false;
    }

    // If it was a quick tap without dragging, rotate the piece!
    if (!this.hasMovedSignificantly) {
      this.rotatePiece(piece);
      this.isDragging = false;
      return true;
    }

    // Distance to center altar
    const dist = Math.hypot(piece.currentX - this.centerX, piece.currentY - this.centerY);
    const snapTolerance = Math.max(45, this.radius * 0.35);

    // Calculate rotation difference from target
    const currentRot = (piece.rotation % 360 + 360) % 360;
    const targetRot = (piece.targetRotation % 360 + 360) % 360;
    const rotDiff = Math.abs(currentRot - targetRot);

    if (dist < snapTolerance) {
      if (rotDiff === 0) {
        // Correct position and rotation: Lock piece!
        piece.currentX = this.centerX;
        piece.currentY = this.centerY;
        piece.rotation = piece.targetRotation;
        piece.placed = true;
        this.selectedPieceId = null;

        sound.playSnap();
        sound.playPetalPickup(piece.id);

        this.feedbackNotice = 'Quadrant restored!';
        this.feedbackTimer = 1.5;

        // Check completion
        if (this.pieces.every((p) => p.placed)) {
          this.isCompleted = true;
          this.lampLit = true;
          sound.playLampLight();
          sound.playTempleBell(659.25);
          this.feedbackNotice = 'The Grand Pookalam is complete!';
        }
      } else {
        // Near center but rotation is wrong
        sound.playFootstep();
        this.feedbackNotice = 'Rotate piece to align with the altar!';
        this.feedbackTimer = 2.0;
      }
    }

    this.isDragging = false;
    return true;
  }

  // Rotate a specific piece by 90 degrees
  public rotatePiece(piece: JigsawPiece) {
    if (piece.placed) return;
    piece.rotation = (piece.rotation + 90) % 360;
    sound.playFootstep();
  }

  // Rotate currently selected piece (or the first unplaced piece if none selected)
  public rotateActivePiece() {
    let targetPiece = this.pieces.find((p) => p.id === this.selectedPieceId && !p.placed);
    if (!targetPiece) {
      targetPiece = this.pieces.find((p) => !p.placed);
    }
    if (targetPiece) {
      this.selectedPieceId = targetPiece.id;
      this.rotatePiece(targetPiece);
    }
  }

  public update(dt: number) {
    if (this.isCompleted) {
      this.completionTimer += dt;
    }
    if (this.feedbackTimer > 0) {
      this.feedbackTimer -= dt;
      if (this.feedbackTimer <= 0) {
        this.feedbackNotice = '';
      }
    }
  }

  public render(ctx: CanvasRenderingContext2D, time: number) {
    // Altar stone foundation & guideline mandala
    ctx.save();
    ctx.translate(this.centerX, this.centerY);

    // Weathered laterite altar plinth
    const plinthGrad = ctx.createRadialGradient(0, 0, 10, 0, 0, this.radius + 28);
    plinthGrad.addColorStop(0, '#24140b');
    plinthGrad.addColorStop(0.75, '#1a0d07');
    plinthGrad.addColorStop(1, '#120904');
    ctx.fillStyle = plinthGrad;
    ctx.beginPath();
    ctx.arc(0, 0, this.radius + 24, 0, Math.PI * 2);
    ctx.fill();

    // Fine carved Kasavu brass rim around altar
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Sacred Kolam / Kalam rice-flour chalk guidelines
    ctx.strokeStyle = 'rgba(235, 225, 200, 0.28)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([6, 6]);
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
    ctx.arc(0, 0, this.radius * 0.78, 0, Math.PI * 2);
    ctx.arc(0, 0, this.radius * 0.52, 0, Math.PI * 2);
    ctx.arc(0, 0, this.radius * 0.26, 0, Math.PI * 2);
    ctx.stroke();

    // Subtle 8-point geometric rays
    ctx.beginPath();
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 4) {
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(a) * this.radius, Math.sin(a) * this.radius);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // Quadrant alignment guides (subtle golden crosses)
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-this.radius, 0);
    ctx.lineTo(this.radius, 0);
    ctx.moveTo(0, -this.radius);
    ctx.lineTo(0, this.radius);
    ctx.stroke();

    // Central Nilavilakku Brass Lamp base
    ctx.fillStyle = '#8f681a';
    ctx.beginPath();
    ctx.arc(0, 0, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#d4af37';
    ctx.beginPath();
    ctx.arc(0, 0, 14, 0, Math.PI * 2);
    ctx.fill();

    // If lamp is lit (upon complete restoration): warm radiant oil flame
    if (this.lampLit) {
      const flicker = Math.sin(time * 0.009) * 2;
      const aura = ctx.createRadialGradient(0, 0, 10, 0, 0, this.radius + 50);
      aura.addColorStop(0, 'rgba(255, 220, 100, 0.7)');
      aura.addColorStop(0.4, 'rgba(255, 140, 30, 0.3)');
      aura.addColorStop(0.8, 'rgba(255, 90, 10, 0.1)');
      aura.addColorStop(1, 'rgba(255, 80, 0, 0)');
      ctx.fillStyle = aura;
      ctx.beginPath();
      ctx.arc(0, 0, this.radius + 50, 0, Math.PI * 2);
      ctx.fill();

      // Deep brass oil wick flame
      ctx.fillStyle = '#ff7700';
      ctx.beginPath();
      ctx.moveTo(-5, 0);
      ctx.quadraticCurveTo(8, -10 + flicker, 0, -26 + flicker);
      ctx.quadraticCurveTo(-8, -10 + flicker, -5, 0);
      ctx.fill();

      ctx.fillStyle = '#fff4a3';
      ctx.beginPath();
      ctx.arc(0, -10 + flicker, 4.5, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();

    // Render unplaced tray shadow background
    this.renderTrayBackground(ctx);

    // Render jigsaw pieces (placed pieces first, then unplaced, then dragging piece on top)
    const placedPieces = this.pieces.filter((p) => p.placed);
    const unplacedPieces = this.pieces.filter((p) => !p.placed && p.id !== this.selectedPieceId);
    const activePiece = this.pieces.find((p) => p.id === this.selectedPieceId && !p.placed);

    for (const p of placedPieces) {
      this.renderQuadrantPiece(ctx, p, time);
    }
    for (const p of unplacedPieces) {
      this.renderQuadrantPiece(ctx, p, time);
    }
    if (activePiece) {
      this.renderQuadrantPiece(ctx, activePiece, time);
    }

    // Render On-Screen Rotate Button & Guidance Hints
    this.renderUIOverlay(ctx, time);
  }

  // Soft tray area for unplaced pieces
  private renderTrayBackground(ctx: CanvasRenderingContext2D) {
    if (this.isCompleted) return;

    ctx.save();
    const isPortrait = this.centerY > this.radius * 2.2;
    const trayY = isPortrait ? this.rotateButtonBounds.y + 60 : this.rotateButtonBounds.y + 50;

    ctx.fillStyle = 'rgba(26, 15, 9, 0.65)';
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.25)';
    ctx.lineWidth = 1.5;

    const trayW = Math.min(620, ctx.canvas.width * 0.92);
    const trayH = 135;
    const rx = this.centerX - trayW * 0.5;

    ctx.beginPath();
    ctx.roundRect?.(rx, trayY - 20, trayW, trayH, 12);
    ctx.fill();
    ctx.stroke();

    // Tray label
    ctx.fillStyle = 'rgba(244, 230, 195, 0.5)';
    ctx.font = '600 11px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('SACRED FLORAL FRAGMENTS TRAY', this.centerX, trayY - 5);
    ctx.restore();
  }

  // Render authentic multi-layered Kerala Pookalam quadrant
  private renderQuadrantPiece(ctx: CanvasRenderingContext2D, piece: JigsawPiece, time: number) {
    ctx.save();
    ctx.translate(piece.currentX, piece.currentY);
    ctx.rotate((piece.rotation * Math.PI) / 180);

    const isSelected = this.selectedPieceId === piece.id && !piece.placed;
    const scale = isSelected ? 1.06 : 1.0;
    ctx.scale(scale, scale);

    const R = this.radius;

    // Drop shadow when lifted / dragging
    if (isSelected) {
      ctx.save();
      ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
      ctx.beginPath();
      ctx.moveTo(6, 10);
      ctx.arc(6, 10, R, 0, Math.PI * 0.5);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    // Layer 5 (Outer Rim): Braided Mango Leaf Garland with Kasavu studs
    ctx.fillStyle = '#234e23';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, R, 0, Math.PI * 0.5);
    ctx.closePath();
    ctx.fill();

    // Garland leaf scallops
    ctx.fillStyle = '#347234';
    const steps5 = 8;
    for (let i = 0; i <= steps5; i++) {
      const a = (i / steps5) * (Math.PI * 0.5);
      const lx = Math.cos(a) * (R - 7);
      const ly = Math.sin(a) * (R - 7);
      ctx.beginPath();
      ctx.arc(lx, ly, 6, 0, Math.PI * 2);
      ctx.fill();
    }

    // Layer 4: Deep Shankhupushpam (Royal Blue) & White Thumba rays
    const r4 = R * 0.84;
    ctx.fillStyle = '#1e3a8a';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, r4, 0, Math.PI * 0.5);
    ctx.closePath();
    ctx.fill();

    // White Thumba petal points
    ctx.fillStyle = '#f8fafc';
    const steps4 = 6;
    for (let i = 0; i <= steps4; i++) {
      const a = (i / steps4) * (Math.PI * 0.5);
      const px = Math.cos(a) * (r4 - 5);
      const py = Math.sin(a) * (r4 - 5);
      ctx.beginPath();
      ctx.ellipse(px, py, 6, 3, a + 0.4, 0, Math.PI * 2);
      ctx.fill();
    }

    // Layer 3: Warm Chendumalli (Marigold) Orange & Golden Yellow
    const r3 = R * 0.65;
    ctx.fillStyle = '#d97706';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, r3, 0, Math.PI * 0.5);
    ctx.closePath();
    ctx.fill();

    // Marigold textured florets
    ctx.fillStyle = '#fbbf24';
    const steps3 = 5;
    for (let i = 0; i <= steps3; i++) {
      const a = (i / steps3) * (Math.PI * 0.5);
      const px = Math.cos(a) * (r3 - 6);
      const py = Math.sin(a) * (r3 - 6);
      ctx.beginPath();
      ctx.arc(px, py, 5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Layer 2: Vivid Scarlet Chethi (Ixora) Flower Ring
    const r2 = R * 0.44;
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, r2, 0, Math.PI * 0.5);
    ctx.closePath();
    ctx.fill();

    // Chethi petal florets
    ctx.fillStyle = '#ef4444';
    const steps2 = 4;
    for (let i = 0; i <= steps2; i++) {
      const a = (i / steps2) * (Math.PI * 0.5);
      const px = Math.cos(a) * (r2 - 4);
      const py = Math.sin(a) * (r2 - 4);
      ctx.beginPath();
      ctx.arc(px, py, 4, 0, Math.PI * 2);
      ctx.fill();
    }

    // Layer 1 (Core): Delicate Sacred Lotus / Thamara Pink & Cream
    const r1 = R * 0.24;
    ctx.fillStyle = '#ec4899';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, r1, 0, Math.PI * 0.5);
    ctx.closePath();
    ctx.fill();

    // Center brass lamp hub sector
    ctx.fillStyle = '#d4af37';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, 14, 0, Math.PI * 0.5);
    ctx.closePath();
    ctx.fill();

    // Outer Kasavu gold edge filigree
    ctx.strokeStyle = piece.placed ? '#ffd700' : isSelected ? '#ffffff' : '#d4af37';
    ctx.lineWidth = isSelected ? 2.5 : 1.5;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(R, 0);
    ctx.arc(0, 0, R, 0, Math.PI * 0.5);
    ctx.lineTo(0, 0);
    ctx.stroke();

    // Shimmer glow if locked into place
    if (piece.placed) {
      ctx.fillStyle = `rgba(255, 235, 150, ${Math.sin(time * 0.004) * 0.12 + 0.12})`;
      ctx.fill();
    }

    ctx.restore();
  }

  // Render On-Screen Rotate Button, Status Feedback, and Instructions
  private renderUIOverlay(ctx: CanvasRenderingContext2D, time: number) {
    if (this.isCompleted) {
      // Completed Victory Banner
      ctx.save();
      const alpha = Math.min(1, this.completionTimer * 1.2);
      ctx.globalAlpha = alpha;

      const bannerY = this.centerY + this.radius + 35;
      ctx.fillStyle = 'rgba(24, 14, 8, 0.92)';
      ctx.strokeStyle = '#d4af37';
      ctx.lineWidth = 2;

      const bw = 320;
      const bh = 54;
      ctx.beginPath();
      ctx.roundRect?.(this.centerX - bw * 0.5, bannerY - bh * 0.5, bw, bh, 8);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#ffd700';
      ctx.font = '700 15px "Cinzel", serif';
      ctx.textAlign = 'center';
      ctx.fillText('POOKALAM RESTORED', this.centerX, bannerY - 3);

      ctx.fillStyle = '#fef08a';
      ctx.font = '500 11px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('Sacred floral blessing complete • Awakening next realm', this.centerX, bannerY + 16);
      ctx.restore();
      return;
    }

    // On-screen Rotate Button
    const b = this.rotateButtonBounds;
    ctx.save();
    const hasSelection = this.selectedPieceId !== null;

    ctx.fillStyle = hasSelection ? 'rgba(74, 40, 20, 0.95)' : 'rgba(38, 22, 13, 0.85)';
    ctx.strokeStyle = hasSelection ? '#ffd700' : 'rgba(212, 175, 55, 0.6)';
    ctx.lineWidth = hasSelection ? 2 : 1.2;

    ctx.beginPath();
    ctx.roundRect?.(b.x, b.y, b.w, b.h, 8);
    ctx.fill();
    ctx.stroke();

    // Rotate button text & icon
    ctx.fillStyle = hasSelection ? '#fff4a3' : '#d4af37';
    ctx.font = '600 13px "Cinzel", serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('↻ ROTATE PIECE', this.centerX, b.y + b.h * 0.5);

    // Guidance text
    ctx.font = '500 11px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#e8d8b5';
    ctx.textBaseline = 'alphabetic';
    const guideY = b.y - 12;
    ctx.fillText('DRAG TO MOVE • TAP OR CLICK ROTATE TO ALIGN', this.centerX, guideY);

    // Feedback Notice (if rotated incorrectly, etc.)
    if (this.feedbackNotice) {
      ctx.fillStyle = '#ffd700';
      ctx.font = '600 12px "Cinzel", serif';
      ctx.fillText(this.feedbackNotice, this.centerX, guideY - 18);
    }

    ctx.restore();
  }
}
