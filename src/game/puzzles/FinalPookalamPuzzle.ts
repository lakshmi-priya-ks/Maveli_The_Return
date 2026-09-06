import { sound } from '../../audio/soundEngine';

export interface FlowerType {
  id: number;
  name: string;
  malayalam: string;
  role: string;
  color: string;
  secondaryColor: string;
  targetRingIndex: number;
  isPlaced: boolean;
}

export interface PookalamRing {
  index: number;
  radius: number; // Outer radius of this ring
  innerRadius: number; // Inner radius of this ring
  thickness: number;
  placedFlowerId: number | null;
  correctFlowerId: number;
  color: string;
  name: string;
  malayalam: string;
  shakeTimer: number; // Seconds remaining for gentle shake
  snapScale: number; // Scale factor during snap animation (e.g. 1.2 -> 1.0)
}

interface PetalParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rot: number;
  color: string;
  alpha: number;
  life: number;
}

export class FinalPookalamPuzzle {
  public rings: PookalamRing[] = [];
  public flowers: FlowerType[] = [];
  public selectedFlowerId: number | null = null;
  public centerX = 0;
  public centerY = 0;
  public baseRadius = 160;
  public isCompleted = false;
  public completionTimer = 0;
  public onStateChange?: () => void;

  private particles: PetalParticle[] = [];

  constructor(width: number, height: number) {
    this.reset(width, height);
  }

  // Full reset (used when starting fresh or restarting level)
  public reset(width: number, height: number) {
    this.isCompleted = false;
    this.completionTimer = 0;
    this.selectedFlowerId = null;
    this.particles = [];

    // Target Rings: Center -> Inner -> Middle -> Outer
    // 0: Thamara (Center Lotus)
    // 1: Shankhupushpam (Inner Conch Flower)
    // 2: Chethi (Middle Ixora)
    // 3: Chendumalli (Outer Marigold Garland)
    this.flowers = [
      {
        id: 0,
        name: 'Thamara',
        malayalam: 'താമര',
        role: 'Sacred Center Lotus',
        color: '#f472b6',
        secondaryColor: '#db2777',
        targetRingIndex: 0,
        isPlaced: false,
      },
      {
        id: 1,
        name: 'Shankhupushpam',
        malayalam: 'ശംഖുപുഷ്പം',
        role: 'Blue Butterfly Pea',
        color: '#3b82f6',
        secondaryColor: '#1d4ed8',
        targetRingIndex: 1,
        isPlaced: false,
      },
      {
        id: 2,
        name: 'Chethi',
        malayalam: 'ചെത്തി',
        role: 'Crimson Jungle Flame',
        color: '#ef4444',
        secondaryColor: '#b91c1c',
        targetRingIndex: 2,
        isPlaced: false,
      },
      {
        id: 3,
        name: 'Chendumalli',
        malayalam: 'ചെണ്ടുമല്ലി',
        role: 'Golden Marigold Garland',
        color: '#f59e0b',
        secondaryColor: '#d97706',
        targetRingIndex: 3,
        isPlaced: false,
      },
    ];

    this.calculateGeometry(width, height);
    this.notifyChange();
  }

  // Responsive resize that strictly preserves puzzle state and placed flowers!
  public resize(width: number, height: number) {
    this.calculateGeometry(width, height);
    this.notifyChange();
  }

  private calculateGeometry(width: number, height: number) {
    const isLandscapeShort = height < 500 && width > height;
    const isMobilePortrait = width < 640 && height > width;

    if (isLandscapeShort) {
      // Landscape on phone: offset slightly left to give room for side tray
      this.centerX = width * 0.42;
      this.centerY = height * 0.5;
      this.baseRadius = Math.min(width * 0.3, height * 0.42);
    } else if (isMobilePortrait) {
      // Mobile portrait: center horizontally, leave room for bottom 2x2 tray
      this.centerX = width * 0.5;
      this.centerY = height * 0.38;
      this.baseRadius = Math.min(width * 0.42, height * 0.28);
    } else {
      // Desktop / Tablet
      this.centerX = width * 0.5;
      this.centerY = height * 0.45;
      this.baseRadius = Math.min(Math.min(width, height) * 0.32, 220);
    }

    // Preserve existing placement states if rings already exist
    const currentPlacements = this.rings.map((r) => r.placedFlowerId);

    const r0 = this.baseRadius * 0.25; // Lotus Center (radius ~55px)
    const r1 = this.baseRadius * 0.50; // Shankhupushpam (~110px)
    const r2 = this.baseRadius * 0.76; // Chethi (~167px)
    const r3 = this.baseRadius;        // Chendumalli (~220px)

    this.rings = [
      {
        index: 0,
        innerRadius: 0,
        radius: r0,
        thickness: r0,
        placedFlowerId: currentPlacements[0] ?? null,
        correctFlowerId: 0,
        color: '#f472b6',
        name: 'Thamara',
        malayalam: 'താമര',
        shakeTimer: 0,
        snapScale: 1.0,
      },
      {
        index: 1,
        innerRadius: r0,
        radius: r1,
        thickness: r1 - r0,
        placedFlowerId: currentPlacements[1] ?? null,
        correctFlowerId: 1,
        color: '#3b82f6',
        name: 'Shankhupushpam',
        malayalam: 'ശംഖുപുഷ്പം',
        shakeTimer: 0,
        snapScale: 1.0,
      },
      {
        index: 2,
        innerRadius: r1,
        radius: r2,
        thickness: r2 - r1,
        placedFlowerId: currentPlacements[2] ?? null,
        correctFlowerId: 2,
        color: '#ef4444',
        name: 'Chethi',
        malayalam: 'ചെത്തി',
        shakeTimer: 0,
        snapScale: 1.0,
      },
      {
        index: 3,
        innerRadius: r2,
        radius: r3,
        thickness: r3 - r2,
        placedFlowerId: currentPlacements[3] ?? null,
        correctFlowerId: 3,
        color: '#f59e0b',
        name: 'Chendumalli',
        malayalam: 'ചെണ്ടുമല്ലി',
        shakeTimer: 0,
        snapScale: 1.0,
      },
    ];
  }

  public setOnStateChange(cb: () => void) {
    this.onStateChange = cb;
  }

  private notifyChange() {
    if (this.onStateChange) {
      this.onStateChange();
    }
  }

  // Player selects a flower from tray
  public selectFlower(id: number) {
    if (this.isCompleted) return;

    const flower = this.flowers.find((f) => f.id === id);
    if (!flower || flower.isPlaced) return;

    if (this.selectedFlowerId === id) {
      // Toggle off if already selected
      this.selectedFlowerId = null;
    } else {
      this.selectedFlowerId = id;
      sound.playSnap();
    }
    this.notifyChange();
  }

  // Player places the currently selected flower into target ring
  public placeInRing(ringIndex: number): boolean {
    if (this.isCompleted || this.selectedFlowerId === null) return false;

    const ring = this.rings[ringIndex];
    const flower = this.flowers.find((f) => f.id === this.selectedFlowerId);

    if (!ring || !flower || ring.placedFlowerId !== null) {
      return false;
    }

    if (ring.correctFlowerId === this.selectedFlowerId) {
      // Correct answer!
      ring.placedFlowerId = this.selectedFlowerId;
      flower.isPlaced = true;
      ring.snapScale = 1.16;

      // Spawn celebratory floral particles
      this.spawnRingParticles(ring);

      sound.playSnap();
      sound.playPetalPickup(ringIndex);

      this.selectedFlowerId = null;

      // Check if all 4 rings are completed
      if (this.rings.every((r) => r.placedFlowerId !== null)) {
        this.isCompleted = true;
        this.completionTimer = 0;
        sound.playLampLight();
        sound.playTempleBell(880);
      }

      this.notifyChange();
      return true;
    } else {
      // Incorrect placement: gentle mismatch feedback without penalty
      ring.shakeTimer = 0.35;
      sound.playFootstep();
      this.notifyChange();
      return false;
    }
  }

  private spawnRingParticles(ring: PookalamRing) {
    const count = 16;
    const midR = (ring.radius + ring.innerRadius) * 0.5;
    for (let i = 0; i < count; i++) {
      const angle = (i * Math.PI * 2) / count + (Math.random() - 0.5) * 0.2;
      const speed = 1.2 + Math.random() * 2.0;
      this.particles.push({
        x: this.centerX + Math.cos(angle) * midR,
        y: this.centerY + Math.sin(angle) * midR,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        rot: Math.random() * Math.PI * 2,
        color: ring.color,
        alpha: 1.0,
        life: 0.8,
      });
    }
  }

  // Pointer input on the canvas: identify which ring was tapped/clicked
  public handlePointerDown(x: number, y: number): boolean {
    if (this.isCompleted) return false;

    const dist = Math.hypot(x - this.centerX, y - this.centerY);

    // Generous hit test tolerance
    const maxRadius = this.rings[3].radius + 24;
    if (dist > maxRadius) return false;

    // Check rings from innermost to outermost
    for (let i = 0; i < this.rings.length; i++) {
      const ring = this.rings[i];
      const isHit = i === 0
        ? dist <= ring.radius
        : dist > ring.innerRadius && dist <= ring.radius + (i === 3 ? 24 : 0);

      if (isHit) {
        if (this.selectedFlowerId !== null) {
          return this.placeInRing(i);
        } else {
          // If no flower is selected yet, provide gentle feedback
          ring.shakeTimer = 0.15;
          sound.playFootstep();
          return false;
        }
      }
    }

    return false;
  }

  public update(dt: number) {
    if (this.isCompleted) {
      this.completionTimer += dt;
    }

    // Update ring shake & snap scale
    for (const ring of this.rings) {
      if (ring.shakeTimer > 0) {
        ring.shakeTimer = Math.max(0, ring.shakeTimer - dt);
      }
      if (ring.snapScale > 1.0) {
        ring.snapScale = Math.max(1.0, ring.snapScale - dt * 0.6);
      }
    }

    // Update particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= dt;
      p.alpha = Math.max(0, p.life / 0.8);
      p.rot += 0.05;
      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  public render(ctx: CanvasRenderingContext2D, time: number) {
    ctx.save();

    // 1. Surrounding Kerala Traditional Architecture / Courtyard elements
    this.renderNilavilakkuLamps(ctx, time);

    // 2. Center Dais
    ctx.save();
    ctx.translate(this.centerX, this.centerY);

    const outerR = this.rings[3].radius;
    const daisR = outerR + 24;

    // Polished teak & laterite circular dais
    const daisGrad = ctx.createRadialGradient(0, 0, daisR * 0.3, 0, 0, daisR);
    daisGrad.addColorStop(0, '#2c180e');
    daisGrad.addColorStop(0.85, '#1e0f08');
    daisGrad.addColorStop(1, '#150a05');
    ctx.fillStyle = daisGrad;
    ctx.beginPath();
    ctx.arc(0, 0, daisR, 0, Math.PI * 2);
    ctx.fill();

    // Carved brass rim border with ornamental studs
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 3.5;
    ctx.stroke();

    ctx.strokeStyle = '#7a4212';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(0, 0, daisR - 5, 0, Math.PI * 2);
    ctx.stroke();

    // Traditional brass rim studs
    ctx.fillStyle = '#ffd700';
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 16) {
      ctx.beginPath();
      ctx.arc(Math.cos(a) * (daisR - 2.5), Math.sin(a) * (daisR - 2.5), 2.2, 0, Math.PI * 2);
      ctx.fill();
    }

    // 3. Render Concentric Rings from Outermost to Innermost
    for (let i = this.rings.length - 1; i >= 0; i--) {
      const ring = this.rings[i];
      ctx.save();

      // Apply shake if ring had gentle mismatch
      if (ring.shakeTimer > 0) {
        const shakeAmp = Math.sin(ring.shakeTimer * 40) * 5 * (ring.shakeTimer / 0.35);
        ctx.translate(shakeAmp, 0);
      }

      // Apply snap scale if freshly placed
      if (ring.snapScale > 1.0) {
        ctx.scale(ring.snapScale, ring.snapScale);
      }

      if (ring.placedFlowerId !== null) {
        // --- RESTORED FLOWER RING (Handcrafted Authentic Pookalam) ---
        this.renderPlacedRing(ctx, ring, time);
      } else {
        // --- UNPLACED TARGET RING (Visual cues, petal silhouettes, subtle guidance) ---
        this.renderUnplacedRing(ctx, ring, time);
      }

      ctx.restore();
    }

    // 4. Grand Golden Completion Radiance
    if (this.isCompleted) {
      this.renderCompletionGlow(ctx, daisR, time);
    }

    // 5. Burst Petal Particles
    for (const p of this.particles) {
      ctx.save();
      ctx.translate(p.x - this.centerX, p.y - this.centerY);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.beginPath();
      ctx.ellipse(0, 0, 6, 3, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    ctx.restore(); // end Dais translate
    ctx.restore();
  }

  // Render Placed Flower Ring with realistic Kerala floral textures
  private renderPlacedRing(ctx: CanvasRenderingContext2D, ring: PookalamRing, time: number) {
    const innerR = ring.innerRadius;
    const outerR = ring.radius;
    const midR = (innerR + outerR) * 0.5;

    if (ring.index === 0) {
      // --- CENTER: THAMARA (Sacred Blooming Lotus) ---
      // Background petal layer (deep rose)
      ctx.fillStyle = '#db2777';
      ctx.beginPath();
      ctx.arc(0, 0, outerR, 0, Math.PI * 2);
      ctx.fill();

      // Outer 8 Lotus Petals
      const petalCount = 8;
      for (let p = 0; p < petalCount; p++) {
        const angle = (p * Math.PI * 2) / petalCount;
        ctx.save();
        ctx.rotate(angle);
        ctx.fillStyle = '#f472b6';
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(outerR * 0.6, outerR * 0.35, outerR, 0);
        ctx.quadraticCurveTo(outerR * 0.6, -outerR * 0.35, 0, 0);
        ctx.fill();

        // Delicate petal vein
        ctx.strokeStyle = '#fbcfe8';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(outerR * 0.85, 0);
        ctx.stroke();
        ctx.restore();
      }

      // Inner 8 offset petals (softer pink)
      for (let p = 0; p < petalCount; p++) {
        const angle = (p * Math.PI * 2) / petalCount + Math.PI / petalCount;
        ctx.save();
        ctx.rotate(angle);
        ctx.fillStyle = '#f9a8d4';
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(outerR * 0.45, outerR * 0.22, outerR * 0.72, 0);
        ctx.quadraticCurveTo(outerR * 0.45, -outerR * 0.22, 0, 0);
        ctx.fill();
        ctx.restore();
      }

      // Golden Lotus Center / Seed Pod (Karnika)
      ctx.fillStyle = '#ffd700';
      ctx.beginPath();
      ctx.arc(0, 0, outerR * 0.28, 0, Math.PI * 2);
      ctx.fill();

      // Golden stamens
      ctx.fillStyle = '#f59e0b';
      for (let s = 0; s < 12; s++) {
        const sa = (s * Math.PI * 2) / 12;
        ctx.beginPath();
        ctx.arc(Math.cos(sa) * (outerR * 0.22), Math.sin(sa) * (outerR * 0.22), 1.8, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (ring.index === 1) {
      // --- INNER RING: SHANKHUPUSHPAM (Royal Blue Butterfly Pea) ---
      // Base deep blue ring
      ctx.fillStyle = '#1e3a8a';
      ctx.beginPath();
      ctx.arc(0, 0, outerR, 0, Math.PI * 2);
      ctx.arc(0, 0, innerR, 0, Math.PI * 2, true);
      ctx.fill();

      // Vivid royal blue petal whorls
      const count = 16;
      for (let i = 0; i < count; i++) {
        const angle = (i * Math.PI * 2) / count;
        ctx.save();
        ctx.rotate(angle);
        ctx.fillStyle = '#3b82f6';
        ctx.beginPath();
        ctx.ellipse(midR, 0, (outerR - innerR) * 0.46, 5.5, 0, 0, Math.PI * 2);
        ctx.fill();

        // White floral conch throat accent
        ctx.fillStyle = '#eff6ff';
        ctx.beginPath();
        ctx.ellipse(midR - 2, 0, 3, 2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    } else if (ring.index === 2) {
      // --- MIDDLE RING: CHETHI (Vivid Crimson Jungle Flame Florets) ---
      // Crimson base ring
      ctx.fillStyle = '#991b1b';
      ctx.beginPath();
      ctx.arc(0, 0, outerR, 0, Math.PI * 2);
      ctx.arc(0, 0, innerR, 0, Math.PI * 2, true);
      ctx.fill();

      // Densely packed 4-petal cross florets
      const count = 24;
      for (let i = 0; i < count; i++) {
        const angle = (i * Math.PI * 2) / count;
        ctx.save();
        ctx.rotate(angle);
        ctx.translate(midR, 0);

        // 4 cross petals
        ctx.fillStyle = '#ef4444';
        for (let cp = 0; cp < 4; cp++) {
          ctx.beginPath();
          const pa = (cp * Math.PI) / 2;
          ctx.ellipse(Math.cos(pa) * 4.5, Math.sin(pa) * 4.5, 4.2, 2.2, pa, 0, Math.PI * 2);
          ctx.fill();
        }

        // Golden center eye
        ctx.fillStyle = '#ffd700';
        ctx.beginPath();
        ctx.arc(0, 0, 1.8, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }
    } else if (ring.index === 3) {
      // --- OUTER RING: CHENDUMALLI (Golden Marigold Garland) ---
      // Deep marigold base
      ctx.fillStyle = '#b45309';
      ctx.beginPath();
      ctx.arc(0, 0, outerR, 0, Math.PI * 2);
      ctx.arc(0, 0, innerR, 0, Math.PI * 2, true);
      ctx.fill();

      // Lush frilled marigold heads
      const count = 32;
      for (let i = 0; i < count; i++) {
        const angle = (i * Math.PI * 2) / count;
        ctx.save();
        ctx.rotate(angle);
        ctx.translate(midR, 0);

        // Marigold ruffled florets
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(0, 0, (outerR - innerR) * 0.44, 0, Math.PI * 2);
        ctx.fill();

        // Inner lighter gold ruffle
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.arc(0, 0, (outerR - innerR) * 0.28, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }
    }
  }

  // Render Unplaced Target Ring with clear visual petal silhouettes and subtle guidance
  private renderUnplacedRing(ctx: CanvasRenderingContext2D, ring: PookalamRing, time: number) {
    const innerR = ring.innerRadius;
    const outerR = ring.radius;
    const midR = (innerR + outerR) * 0.5;
    const isFlowerSelected = this.selectedFlowerId !== null;
    const isThisRingMatching = this.selectedFlowerId === ring.correctFlowerId;

    // Gentle mismatch tint
    if (ring.shakeTimer > 0) {
      ctx.fillStyle = 'rgba(185, 28, 28, 0.25)';
      ctx.beginPath();
      ctx.arc(0, 0, outerR, 0, Math.PI * 2);
      if (innerR > 0) ctx.arc(0, 0, innerR, 0, Math.PI * 2, true);
      ctx.fill();
    }

    // When ANY flower is selected, available target rings receive subtle inviting guidance
    if (isFlowerSelected) {
      const pulse = Math.sin(time * 0.006 + ring.index * 0.7) * 0.15 + 0.85;
      ctx.fillStyle = `rgba(212, 175, 55, ${0.08 * pulse})`;
      ctx.beginPath();
      ctx.arc(0, 0, outerR, 0, Math.PI * 2);
      if (innerR > 0) ctx.arc(0, 0, innerR, 0, Math.PI * 2, true);
      ctx.fill();

      // Guiding border
      ctx.strokeStyle = `rgba(255, 215, 0, ${0.45 * pulse})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, outerR, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Sacred geometric Kolam guide outline (dashed brass lines)
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.35)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.arc(0, 0, outerR, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // --- VISUAL CLUES: Handcrafted Faint Petal Silhouette Watermarks ---
    ctx.save();
    ctx.globalAlpha = 0.22;

    if (ring.index === 0) {
      // Faint Pink Lotus silhouette
      ctx.fillStyle = '#f472b6';
      for (let p = 0; p < 8; p++) {
        const a = (p * Math.PI * 2) / 8;
        ctx.save();
        ctx.rotate(a);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(outerR * 0.5, outerR * 0.25, outerR * 0.85, 0);
        ctx.quadraticCurveTo(outerR * 0.5, -outerR * 0.25, 0, 0);
        ctx.fill();
        ctx.restore();
      }
      ctx.beginPath();
      ctx.arc(0, 0, outerR * 0.28, 0, Math.PI * 2);
      ctx.fill();
    } else if (ring.index === 1) {
      // Faint Blue Shankhupushpam silhouettes
      ctx.fillStyle = '#60a5fa';
      for (let p = 0; p < 12; p++) {
        const a = (p * Math.PI * 2) / 12;
        ctx.save();
        ctx.rotate(a);
        ctx.beginPath();
        ctx.ellipse(midR, 0, (outerR - innerR) * 0.4, 4, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    } else if (ring.index === 2) {
      // Faint Crimson Chethi 4-petal cross silhouettes
      ctx.fillStyle = '#f87171';
      for (let p = 0; p < 16; p++) {
        const a = (p * Math.PI * 2) / 16;
        ctx.save();
        ctx.rotate(a);
        ctx.translate(midR, 0);
        for (let cp = 0; cp < 4; cp++) {
          const pa = (cp * Math.PI) / 2;
          ctx.beginPath();
          ctx.ellipse(Math.cos(pa) * 3, Math.sin(pa) * 3, 3, 1.5, pa, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
    } else if (ring.index === 3) {
      // Faint Golden Marigold garland scalloping
      ctx.fillStyle = '#fbbf24';
      for (let p = 0; p < 20; p++) {
        const a = (p * Math.PI * 2) / 20;
        ctx.save();
        ctx.rotate(a);
        ctx.beginPath();
        ctx.arc(midR, 0, (outerR - innerR) * 0.38, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }
    ctx.restore();

    // Subtle traditional Sanskrit/Malayalam watermark text as secondary hint
    ctx.fillStyle = 'rgba(247, 238, 216, 0.4)';
    ctx.font = 'bold 11px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(ring.name, 0, -midR);
  }

  // 4 Cast-Brass Nilavilakku Lamps at Dais perimeter
  private renderNilavilakkuLamps(ctx: CanvasRenderingContext2D, time: number) {
    const outerR = this.rings[3].radius;
    const lampDist = outerR + 42;

    const lampPositions = [
      { x: this.centerX - lampDist, y: this.centerY - lampDist * 0.6 },
      { x: this.centerX + lampDist, y: this.centerY - lampDist * 0.6 },
      { x: this.centerX - lampDist, y: this.centerY + lampDist * 0.6 },
      { x: this.centerX + lampDist, y: this.centerY + lampDist * 0.6 },
    ];

    for (const pos of lampPositions) {
      ctx.save();
      ctx.translate(pos.x, pos.y);

      // Lamp base & stem
      ctx.fillStyle = '#b89428';
      ctx.beginPath();
      ctx.ellipse(0, 16, 12, 4, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillRect(-2, 0, 4, 16);
      ctx.beginPath();
      ctx.ellipse(0, 0, 10, 3.5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Crown Makudam
      ctx.beginPath();
      ctx.moveTo(-3, 0);
      ctx.lineTo(0, -7);
      ctx.lineTo(3, 0);
      ctx.closePath();
      ctx.fill();

      // Flame lights up upon completion (or gentle warm flicker if already placed rings > 2)
      const placedCount = this.rings.filter((r) => r.placedFlowerId !== null).length;
      if (this.isCompleted || placedCount >= 2) {
        const flicker = Math.sin(time * 0.008 + pos.x) * 1.5;
        const flameY = -9 + flicker;

        // Radiant glow
        const glowR = this.isCompleted ? 48 : 28;
        const glow = ctx.createRadialGradient(0, flameY, 2, 0, flameY, glowR);
        glow.addColorStop(0, 'rgba(255, 230, 110, 0.75)');
        glow.addColorStop(0.5, 'rgba(255, 140, 30, 0.25)');
        glow.addColorStop(1, 'rgba(255, 80, 0, 0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(0, flameY, glowR, 0, Math.PI * 2);
        ctx.fill();

        // Flame core
        ctx.fillStyle = '#ff7300';
        ctx.beginPath();
        ctx.moveTo(-3, flameY + 4);
        ctx.quadraticCurveTo(4, flameY, 0, flameY - 10);
        ctx.quadraticCurveTo(-4, flameY, -3, flameY + 4);
        ctx.fill();

        ctx.fillStyle = '#fff4a3';
        ctx.beginPath();
        ctx.arc(0, flameY - 1, 2.2, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }
  }

  // Grand Golden Completion Radiance Sequence
  private renderCompletionGlow(ctx: CanvasRenderingContext2D, daisR: number, time: number) {
    const pulse = Math.sin(time * 0.004) * 18;
    const maxGlowR = daisR + 55 + pulse;

    const glow = ctx.createRadialGradient(0, 0, 20, 0, 0, maxGlowR);
    glow.addColorStop(0, 'rgba(255, 240, 140, 0.55)');
    glow.addColorStop(0.45, 'rgba(255, 160, 40, 0.28)');
    glow.addColorStop(0.85, 'rgba(245, 120, 20, 0.1)');
    glow.addColorStop(1, 'rgba(215, 60, 10, 0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(0, 0, maxGlowR, 0, Math.PI * 2);
    ctx.fill();

    // Sacred rotating light rays
    ctx.save();
    ctx.rotate(time * 0.0008);
    ctx.strokeStyle = 'rgba(255, 220, 100, 0.14)';
    ctx.lineWidth = 2.5;
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 8) {
      ctx.beginPath();
      ctx.moveTo(Math.cos(a) * daisR, Math.sin(a) * daisR);
      ctx.lineTo(Math.cos(a) * maxGlowR, Math.sin(a) * maxGlowR);
      ctx.stroke();
    }
    ctx.restore();
  }
}
