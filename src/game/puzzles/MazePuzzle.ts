import { sound } from '../../audio/soundEngine';

export interface MazeCell {
  x: number;
  y: number;
  isWall: boolean;
  hasFragment?: boolean;
  fragmentCollected?: boolean;
  isDestination?: boolean;
}

export class MazePuzzle {
  public cols = 11;
  public rows = 9;
  public grid: MazeCell[][] = [];
  public cellSize = 44;
  public offsetX = 0;
  public offsetY = 0;
  public playerGridX = 1;
  public playerGridY = 1;
  public playerPixelX = 0;
  public playerPixelY = 0;
  public isCompleted = false;
  public bonusFragmentsCollected = 0;
  public totalBonusFragments = 2;

  constructor(width: number, height: number) {
    this.reset(width, height);
  }

  public reset(width: number, height: number) {
    this.isCompleted = false;
    this.bonusFragmentsCollected = 0;
    this.playerGridX = 1;
    this.playerGridY = 1;

    // Layout: 11x9 decorative maze
    // 0 = path, 1 = wall, F = fragment, D = destination
    // Design with safe short central route vs. outer winding path with 2 bonus fragments
    const map = [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 1, 2, 0, 0, 0, 0, 1], // (5,1) has Fragment 1
      [1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1],
      [1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1],
      [1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1], // Safe route through (7,3)->(7,5)
      [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1],
      [1, 2, 0, 0, 0, 0, 0, 0, 1, 3, 1], // (1,7) has Fragment 2, (9,7) is Destination
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ];

    this.cols = map[0].length;
    this.rows = map.length;

    // Responsive cell sizing
    const maxCellW = (width - 40) / this.cols;
    const maxCellH = (height - 140) / this.rows;
    this.cellSize = Math.floor(Math.min(54, Math.min(maxCellW, maxCellH)));

    this.offsetX = Math.floor((width - this.cols * this.cellSize) * 0.5);
    this.offsetY = Math.floor((height - this.rows * this.cellSize) * 0.52);

    this.grid = [];
    for (let r = 0; r < this.rows; r++) {
      this.grid[r] = [];
      for (let c = 0; c < this.cols; c++) {
        const val = map[r][c];
        this.grid[r][c] = {
          x: c,
          y: r,
          isWall: val === 1,
          hasFragment: val === 2,
          fragmentCollected: false,
          isDestination: val === 3,
        };
      }
    }

    this.playerPixelX = this.offsetX + (this.playerGridX + 0.5) * this.cellSize;
    this.playerPixelY = this.offsetY + (this.playerGridY + 0.5) * this.cellSize;
  }

  public move(dx: number, dy: number) {
    if (this.isCompleted) return;

    const nx = this.playerGridX + dx;
    const ny = this.playerGridY + dy;

    if (nx >= 0 && nx < this.cols && ny >= 0 && ny < this.rows) {
      const cell = this.grid[ny][nx];
      if (!cell.isWall) {
        this.playerGridX = nx;
        this.playerGridY = ny;
        sound.playFootstep();

        // Check fragment
        if (cell.hasFragment && !cell.fragmentCollected) {
          cell.fragmentCollected = true;
          this.bonusFragmentsCollected++;
          sound.playPetalPickup(this.bonusFragmentsCollected);
        }

        // Check destination
        if (cell.isDestination) {
          this.isCompleted = true;
          sound.playTempleBell(880);
          sound.playLampLight();
        }
      }
    }
  }

  public handlePointerDown(screenX: number, screenY: number) {
    if (this.isCompleted) return;

    // Convert screen coordinates to grid coordinates
    const gridX = Math.floor((screenX - this.offsetX) / this.cellSize);
    const gridY = Math.floor((screenY - this.offsetY) / this.cellSize);

    const dx = gridX - this.playerGridX;
    const dy = gridY - this.playerGridY;

    // If clicked adjacent orthogonal cell
    if (Math.abs(dx) + Math.abs(dy) === 1) {
      this.move(dx, dy);
    } else {
      // Direct toward click
      if (Math.abs(dx) > Math.abs(dy)) {
        this.move(Math.sign(dx), 0);
      } else if (dy !== 0) {
        this.move(0, Math.sign(dy));
      }
    }
  }

  public update(_dt: number) {
    // Smooth pixel lerp
    const targetPx = this.offsetX + (this.playerGridX + 0.5) * this.cellSize;
    const targetPy = this.offsetY + (this.playerGridY + 0.5) * this.cellSize;
    this.playerPixelX += (targetPx - this.playerPixelX) * 0.35;
    this.playerPixelY += (targetPy - this.playerPixelY) * 0.35;
  }

  public render(ctx: CanvasRenderingContext2D, time: number) {
    ctx.save();

    // Maze stone courtyard background
    ctx.fillStyle = '#221610';
    ctx.fillRect(
      this.offsetX - 8,
      this.offsetY - 8,
      this.cols * this.cellSize + 16,
      this.rows * this.cellSize + 16
    );

    // Decorative Kasavu border around maze
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 3;
    ctx.strokeRect(
      this.offsetX - 8,
      this.offsetY - 8,
      this.cols * this.cellSize + 16,
      this.rows * this.cellSize + 16
    );

    // Render cells
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const cell = this.grid[r][c];
        const px = this.offsetX + c * this.cellSize;
        const py = this.offsetY + r * this.cellSize;

        if (cell.isWall) {
          // Kerala manicured floral hedge & carved laterite wall
          ctx.fillStyle = '#264e22';
          ctx.fillRect(px, py, this.cellSize, this.cellSize);

          // Top leaf texture
          ctx.fillStyle = '#3a7335';
          ctx.fillRect(px + 2, py + 2, this.cellSize - 4, this.cellSize - 4);

          // Small floral studs on hedges
          ctx.fillStyle = '#ef4444';
          ctx.beginPath();
          ctx.arc(px + this.cellSize * 0.5, py + this.cellSize * 0.5, 3, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Warm sand/laterite pathway
          ctx.fillStyle = '#e8d8b5';
          ctx.fillRect(px, py, this.cellSize, this.cellSize);

          // Subtle stone paver lines
          ctx.strokeStyle = '#c5b085';
          ctx.lineWidth = 1;
          ctx.strokeRect(px + 1, py + 1, this.cellSize - 2, this.cellSize - 2);

          // Destination cell: Golden Temple Archway & Lamp
          if (cell.isDestination) {
            const aura = ctx.createRadialGradient(
              px + this.cellSize * 0.5,
              py + this.cellSize * 0.5,
              4,
              px + this.cellSize * 0.5,
              py + this.cellSize * 0.5,
              this.cellSize * 0.8
            );
            aura.addColorStop(0, 'rgba(255, 215, 0, 0.8)');
            aura.addColorStop(1, 'rgba(255, 140, 0, 0.1)');
            ctx.fillStyle = aura;
            ctx.fillRect(px, py, this.cellSize, this.cellSize);

            // Brass lamp icon
            ctx.fillStyle = '#b45309';
            ctx.beginPath();
            ctx.arc(px + this.cellSize * 0.5, py + this.cellSize * 0.5, this.cellSize * 0.3, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#fef08a';
            ctx.beginPath();
            ctx.arc(px + this.cellSize * 0.5, py + this.cellSize * 0.45, 5, 0, Math.PI * 2);
            ctx.fill();
          }

          // Bonus fragment collectible
          if (cell.hasFragment && !cell.fragmentCollected) {
            const float = Math.sin(time * 0.005 + c) * 3;
            const fx = px + this.cellSize * 0.5;
            const fy = py + this.cellSize * 0.5 + float;

            ctx.fillStyle = '#ec4899';
            ctx.beginPath();
            ctx.arc(fx, fy, 8, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#ffd700';
            ctx.beginPath();
            ctx.arc(fx, fy, 4, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
    }

    // Render Maveli Token
    const mx = this.playerPixelX;
    const my = this.playerPixelY;

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath();
    ctx.ellipse(mx, my + 8, 12, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Body / Mundu
    ctx.fillStyle = '#faf6eb';
    ctx.beginPath();
    ctx.arc(mx, my, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Golden Crown & Moustache top-down badge
    ctx.fillStyle = '#d4af37';
    ctx.beginPath();
    ctx.arc(mx, my - 3, 6, 0, Math.PI * 2);
    ctx.fill();

    // Moustache
    ctx.strokeStyle = '#1e1106';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(mx, my + 4, 4, 0.2, Math.PI - 0.2);
    ctx.stroke();

    ctx.restore();
  }
}
