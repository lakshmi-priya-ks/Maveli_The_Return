import { FragmentItem, LevelData, Platform, PlayerState, SceneryProp } from '../types';

export class GameRenderer {
  private ctx: CanvasRenderingContext2D;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }

  // Clear canvas
  public clear(width: number, height: number) {
    this.ctx.clearRect(0, 0, width, height);
  }

  // Draw rich atmospheric sky & parallax mountains
  public drawSky(theme: LevelData['theme'], width: number, height: number, cameraX: number) {
    const ctx = this.ctx;

    // Atmospheric sky gradient
    const grad = ctx.createLinearGradient(0, 0, 0, height);
    if (theme === 'village') {
      // Soft early morning Kerala sunshine
      grad.addColorStop(0, '#5a8eb8');
      grad.addColorStop(0.35, '#92c2dc');
      grad.addColorStop(0.7, '#d6e8ed');
      grad.addColorStop(1, '#fae6c3');
    } else if (theme === 'paddy') {
      // Crisp vibrant daylight with emerald horizon
      grad.addColorStop(0, '#4288b8');
      grad.addColorStop(0.4, '#7bbad9');
      grad.addColorStop(0.75, '#b9e0d3');
      grad.addColorStop(1, '#e3f3cb');
    } else if (theme === 'backwaters') {
      // Spectacular golden sunset over Vembanad Lake
      grad.addColorStop(0, '#2d1a36');
      grad.addColorStop(0.3, '#6e2b4f');
      grad.addColorStop(0.6, '#b64e3b');
      grad.addColorStop(0.85, '#e58043');
      grad.addColorStop(1, '#fabc68');
    } else {
      // Twilight temple festival
      grad.addColorStop(0, '#151125');
      grad.addColorStop(0.35, '#2e1c3e');
      grad.addColorStop(0.7, '#592645');
      grad.addColorStop(1, '#8c3d38');
    }

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Sun / Sunset Orb
    ctx.save();
    if (theme === 'backwaters') {
      const sunX = width * 0.7 - cameraX * 0.04;
      const sunY = height * 0.44;

      // Outer warm radiance
      const sunGlow = ctx.createRadialGradient(sunX, sunY, 15, sunX, sunY, 220);
      sunGlow.addColorStop(0, 'rgba(255, 245, 200, 0.85)');
      sunGlow.addColorStop(0.25, 'rgba(255, 160, 60, 0.5)');
      sunGlow.addColorStop(0.65, 'rgba(235, 95, 30, 0.18)');
      sunGlow.addColorStop(1, 'rgba(215, 60, 20, 0)');
      ctx.fillStyle = sunGlow;
      ctx.beginPath();
      ctx.arc(sunX, sunY, 220, 0, Math.PI * 2);
      ctx.fill();

      // Sun disc with soft edge
      ctx.fillStyle = '#fff6dd';
      ctx.beginPath();
      ctx.arc(sunX, sunY, 34, 0, Math.PI * 2);
      ctx.fill();
    } else if (theme === 'village' || theme === 'paddy') {
      const sunX = width * 0.22 - cameraX * 0.03;
      const sunY = height * 0.22;

      const sunGlow = ctx.createRadialGradient(sunX, sunY, 15, sunX, sunY, 140);
      sunGlow.addColorStop(0, 'rgba(255, 252, 225, 0.75)');
      sunGlow.addColorStop(0.35, 'rgba(255, 235, 150, 0.25)');
      sunGlow.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = sunGlow;
      ctx.beginPath();
      ctx.arc(sunX, sunY, 140, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#fffdf0';
      ctx.beginPath();
      ctx.arc(sunX, sunY, 22, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // Western Ghats distant mountains (Parallax Layer 1)
    ctx.save();
    const mountainColor =
      theme === 'backwaters'
        ? '#321838'
        : theme === 'festival'
        ? '#1e1428'
        : theme === 'paddy'
        ? '#3c6657'
        : '#47685e';
    ctx.fillStyle = mountainColor;
    ctx.globalAlpha = 0.45;
    ctx.beginPath();
    const hillOffset = cameraX * 0.1;
    ctx.moveTo(0, height);
    for (let x = -60; x <= width + 60; x += 80) {
      const hillY =
        height * 0.65 +
        Math.sin((x + hillOffset) * 0.0025) * 55 +
        Math.cos((x + hillOffset) * 0.006) * 30;
      ctx.lineTo(x, hillY);
    }
    ctx.lineTo(width, height);
    ctx.closePath();
    ctx.fill();

    // Mid-distant coconut palm silhouette ridge (Parallax Layer 2)
    const palmRidgeColor =
      theme === 'backwaters'
        ? '#211024'
        : theme === 'festival'
        ? '#150d1e'
        : theme === 'paddy'
        ? '#264234'
        : '#2d453b';
    ctx.fillStyle = palmRidgeColor;
    ctx.globalAlpha = 0.68;
    ctx.beginPath();
    const palmOffset = cameraX * 0.22;
    ctx.moveTo(0, height);
    for (let x = -50; x <= width + 50; x += 50) {
      const ridgeY = height * 0.74 + Math.sin((x + palmOffset) * 0.005) * 28;
      ctx.lineTo(x, ridgeY);
    }
    ctx.lineTo(width, height);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  // Draw scenery props (Houses, Coconut trees, Banana plants, Nilavilakku)
  public drawScenery(props: SceneryProp[], time: number) {
    const ctx = this.ctx;
    for (const prop of props) {
      ctx.save();
      ctx.translate(prop.x, prop.y);
      const scale = prop.scale || 1.0;
      ctx.scale(scale, scale);

      switch (prop.type) {
        case 'coconut_tree':
          this.drawCoconutTree(time);
          break;
        case 'house':
          this.drawKeralaHouse();
          break;
        case 'banana_plant':
          this.drawBananaPlant(time);
          break;
        case 'nilavilakku':
          this.drawNilavilakku(prop.lit ?? false, time);
          break;
        case 'temple_wall':
          this.drawTempleWall();
          break;
        case 'muthukkuda':
          this.drawMuthukkuda(time);
          break;
        case 'boat_decor':
          this.drawBoatDecor(time);
          break;
        case 'flower_bush':
          this.drawFlowerBush();
          break;
      }
      ctx.restore();
    }
  }

  // Realistic, organically curved Coconut Tree
  public drawCoconutTree(time: number) {
    const ctx = this.ctx;
    ctx.save();

    const sway = Math.sin(time * 0.0012) * 14;
    const topX = 28 + sway;
    const topY = -245;

    // Organic trunk with realistic woodbark texture
    ctx.lineWidth = 15;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#4e3322';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(18, -130, topX, topY);
    ctx.stroke();

    // Dark core shadow along inner trunk curve
    ctx.lineWidth = 11;
    ctx.strokeStyle = '#392316';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(17, -130, topX - 1, topY);
    ctx.stroke();

    // Segmented natural rings on palm trunk
    ctx.strokeStyle = '#27170e';
    ctx.lineWidth = 2.5;
    for (let y = -18; y > topY + 15; y -= 15) {
      const t = y / topY;
      const curX = t * t * topX + 2 * (1 - t) * t * 18;
      ctx.beginPath();
      ctx.ellipse(curX, y, 7.5, 3, 0.15, 0, Math.PI);
      ctx.stroke();
    }

    // Organic bunches of coconuts nestled in the crown
    const coconuts = [
      { ox: -10, oy: 12, r: 7.5, col: '#768533' },
      { ox: 0, oy: 15, r: 8, col: '#8a993b' },
      { ox: 10, oy: 11, r: 7, col: '#6d7b2e' },
      { ox: -5, oy: 22, r: 7, col: '#889839' },
      { ox: 6, oy: 21, r: 7.5, col: '#798835' },
    ];
    for (const c of coconuts) {
      ctx.fillStyle = c.col;
      ctx.beginPath();
      ctx.arc(topX + c.ox, topY + c.oy, c.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#47531d';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Natural multi-layered palm fronds with graceful arching curves
    const frondAngles = [-155, -125, -95, -65, -35, -5, 25, 60, 95];
    for (let i = 0; i < frondAngles.length; i++) {
      const deg = frondAngles[i];
      const rad = (deg * Math.PI) / 180;
      const frondLen = 95 + Math.sin(deg * 2) * 18;
      const endX = topX + Math.cos(rad) * frondLen + Math.sin(time * 0.0018 + i) * 6;
      const endY = topY + Math.sin(rad) * (frondLen * 0.75) + 32;

      // Frond central rib (Rachis)
      ctx.lineWidth = 3.5;
      ctx.strokeStyle = '#285822';
      ctx.beginPath();
      ctx.moveTo(topX, topY);
      const cpX = topX + Math.cos(rad) * (frondLen * 0.55);
      const cpY = topY + Math.sin(rad) * 45 - 18;
      ctx.quadraticCurveTo(cpX, cpY, endX, endY);
      ctx.stroke();

      // Natural pinnate leaflets hanging from the rachis
      const leafColor = i % 2 === 0 ? '#386f2c' : '#2b5a22';
      ctx.fillStyle = leafColor;
      for (let f = 0.22; f <= 0.94; f += 0.12) {
        const lx = topX + (endX - topX) * f;
        const ly = topY + (endY - topY) * f;
        ctx.beginPath();
        ctx.ellipse(lx, ly + 5, 14 * (1 - f * 0.35), 4.5, rad + 0.35, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.restore();
  }

  // Realistic Traditional Kerala House (Naalukettu architecture)
  public drawKeralaHouse() {
    const ctx = this.ctx;
    ctx.save();

    // Natural whitewashed lime plaster wall
    const wallGrad = ctx.createLinearGradient(0, -110, 0, 0);
    wallGrad.addColorStop(0, '#f0ebd8');
    wallGrad.addColorStop(1, '#e2dac1');
    ctx.fillStyle = wallGrad;
    ctx.fillRect(-85, -112, 170, 112);

    // Weathered laterite stone base plinth (Thara)
    const plinthGrad = ctx.createLinearGradient(0, -22, 0, 0);
    plinthGrad.addColorStop(0, '#8c3d24');
    plinthGrad.addColorStop(1, '#612513');
    ctx.fillStyle = plinthGrad;
    ctx.fillRect(-90, -22, 180, 22);

    // Carved wooden veranda pillars (Thoothukal)
    [-72, -26, 26, 72].forEach((px) => {
      // Stone pillar base
      ctx.fillStyle = '#523420';
      ctx.fillRect(px - 6, -28, 12, 6);
      // Carved teak pillar
      const pillarGrad = ctx.createLinearGradient(px - 5, 0, px + 5, 0);
      pillarGrad.addColorStop(0, '#66391a');
      pillarGrad.addColorStop(0.5, '#8c522a');
      pillarGrad.addColorStop(1, '#4f2a11');
      ctx.fillStyle = pillarGrad;
      ctx.fillRect(px - 4, -112, 8, 84);
      // Pillar bracket (Bodhi)
      ctx.fillStyle = '#5c3216';
      ctx.beginPath();
      ctx.moveTo(px - 7, -112);
      ctx.lineTo(px + 7, -112);
      ctx.lineTo(px + 4, -104);
      ctx.lineTo(px - 4, -104);
      ctx.closePath();
      ctx.fill();
    });

    // Traditional carved double wooden door
    ctx.fillStyle = '#3a1f0d';
    ctx.fillRect(-20, -82, 40, 60);
    ctx.strokeStyle = '#5a3418';
    ctx.lineWidth = 2;
    ctx.strokeRect(-20, -82, 40, 60);
    // Center divider
    ctx.beginPath();
    ctx.moveTo(0, -82);
    ctx.lineTo(0, -22);
    ctx.stroke();
    // Brass door handles
    ctx.fillStyle = '#d4af37';
    ctx.beginPath();
    ctx.arc(-4, -52, 2.5, 0, Math.PI * 2);
    ctx.arc(4, -52, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Terracotta tiled roof with authentic Kerala roofline curvature
    const roofGrad = ctx.createLinearGradient(0, -185, 0, -112);
    roofGrad.addColorStop(0, '#a33e24');
    roofGrad.addColorStop(0.6, '#8d3119');
    roofGrad.addColorStop(1, '#662211');
    ctx.fillStyle = roofGrad;
    ctx.beginPath();
    ctx.moveTo(-115, -112);
    ctx.quadraticCurveTo(-60, -145, 0, -182);
    ctx.quadraticCurveTo(60, -145, 115, -112);
    ctx.closePath();
    ctx.fill();

    // Carved wooden eave fascia (Valampiri / Utharam)
    ctx.fillStyle = '#4a2612';
    ctx.fillRect(-116, -115, 232, 6);

    // Decorative gable (Mukhappu) with wooden lattice
    ctx.fillStyle = '#45220e';
    ctx.beginPath();
    ctx.moveTo(-38, -140);
    ctx.lineTo(0, -178);
    ctx.lineTo(38, -140);
    ctx.closePath();
    ctx.fill();
    // Gable lattice lines
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 1;
    for (let gx = -24; gx <= 24; gx += 8) {
      ctx.beginPath();
      ctx.moveTo(gx, -140);
      ctx.lineTo(gx * 0.25, -174);
      ctx.stroke();
    }

    // Natural curved terracotta tile ridges
    ctx.strokeStyle = '#5a1d0f';
    ctx.lineWidth = 2;
    for (let rx = -100; rx <= 100; rx += 16) {
      ctx.beginPath();
      ctx.moveTo(rx, -112);
      ctx.quadraticCurveTo(rx * 0.5, -145, rx * 0.15, -178);
      ctx.stroke();
    }

    ctx.restore();
  }

  // Realistic Kerala courtyard scene for Title / Story screens
  public drawTitleScene(width: number, height: number, time: number) {
    this.drawSky('village', width, height, 0);

    const groundY = height * 0.77;
    const ctx = this.ctx;

    // Lush courtyard lawn with textured grass fringe
    ctx.fillStyle = '#386f2c';
    ctx.fillRect(0, groundY, width, 14);

    // Laterite soil foundation
    const earthGrad = ctx.createLinearGradient(0, groundY + 14, 0, height);
    earthGrad.addColorStop(0, '#8c3f25');
    earthGrad.addColorStop(1, '#572414');
    ctx.fillStyle = earthGrad;
    ctx.fillRect(0, groundY + 14, width, height - groundY);

    // Left coconut palms
    ctx.save();
    ctx.translate(width * 0.12, groundY);
    this.drawCoconutTree(time);
    ctx.restore();

    // Right Kerala house
    ctx.save();
    ctx.translate(width * 0.82, groundY);
    this.drawKeralaHouse();
    ctx.restore();

    // Nilavilakku lamp with warm flickering flame
    ctx.save();
    ctx.translate(width * 0.27, groundY);
    this.drawNilavilakku(true, time);
    ctx.restore();

    // Banana plant
    ctx.save();
    ctx.translate(width * 0.68, groundY);
    this.drawBananaPlant(time);
    ctx.restore();

    // King Maveli standing majestically in the courtyard
    const maveliState: PlayerState = {
      x: width * 0.48 - 18,
      y: groundY - 72,
      vx: 0,
      vy: 0,
      width: 36,
      height: 72,
      grounded: true,
      facing: 'right',
      animState: 'idle',
      animTimer: time * 0.001,
      coyoteTimer: 0,
      jumpBufferTimer: 0,
      lives: 3,
      maxLives: 3,
    };
    this.drawPlayer(maveliState, time);
  }

  // Realistic Banana Plant with broad arching leaves
  public drawBananaPlant(time: number) {
    const ctx = this.ctx;
    ctx.save();

    // Broad succulent green trunk (Pindi)
    const trunkGrad = ctx.createLinearGradient(-8, 0, 8, 0);
    trunkGrad.addColorStop(0, '#386926');
    trunkGrad.addColorStop(0.5, '#56993c');
    trunkGrad.addColorStop(1, '#2c541e');
    ctx.fillStyle = trunkGrad;
    ctx.fillRect(-7, -65, 14, 65);

    // Arching leaves
    const leaves = [
      { angle: -0.65, len: 78 },
      { angle: -1.25, len: 86 },
      { angle: -1.95, len: 82 },
      { angle: -2.55, len: 76 },
    ];

    for (let i = 0; i < leaves.length; i++) {
      const l = leaves[i];
      const sway = Math.sin(time * 0.0018 + i) * 0.07;
      const angle = l.angle + sway;

      ctx.save();
      ctx.translate(0, -60);
      ctx.rotate(angle);

      // Leaf blade
      ctx.fillStyle = i % 2 === 0 ? '#498833' : '#3c7229';
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(l.len * 0.5, 18, l.len, 4);
      ctx.quadraticCurveTo(l.len * 0.5, -16, 0, 0);
      ctx.closePath();
      ctx.fill();

      // Pale central midrib
      ctx.strokeStyle = '#8bc34a';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(l.len, 0);
      ctx.stroke();

      ctx.restore();
    }

    // Pendulous purple-red banana blossom (Vazhakoombu)
    ctx.fillStyle = '#6b1836';
    ctx.beginPath();
    ctx.ellipse(0, -42, 6, 12, 0.2, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // Authentic Heavy Cast Bell-Metal Brass Nilavilakku
  public drawNilavilakku(lit: boolean, time: number) {
    const ctx = this.ctx;
    ctx.save();

    // Multi-tiered circular pedestal base
    const baseGrad = ctx.createLinearGradient(-22, 0, 22, 0);
    baseGrad.addColorStop(0, '#8c6b1a');
    baseGrad.addColorStop(0.35, '#d4af37');
    baseGrad.addColorStop(0.7, '#f5d77f');
    baseGrad.addColorStop(1, '#705312');

    ctx.fillStyle = baseGrad;
    ctx.beginPath();
    ctx.ellipse(0, 0, 22, 7, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#57400d';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Central baluster stem with ornamental rings
    ctx.fillStyle = baseGrad;
    ctx.fillRect(-3.5, -78, 7, 78);

    [-26, -52].forEach((ry) => {
      ctx.beginPath();
      ctx.arc(0, ry, 6.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    });

    // Top oil tray (Thattu) with 5 wick spouts
    ctx.beginPath();
    ctx.ellipse(0, -78, 26, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Crown pinnacle (Makudam)
    ctx.beginPath();
    ctx.moveTo(-5, -78);
    ctx.lineTo(0, -96);
    ctx.lineTo(5, -78);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Warm flickering flame and radiant ambient illumination
    if (lit) {
      const flicker = Math.sin(time * 0.008) * 2.5 + Math.cos(time * 0.014) * 1.5;
      const flameY = -98 + flicker;

      // Soft ambient light halo
      const glow = ctx.createRadialGradient(0, flameY, 4, 0, flameY, 65);
      glow.addColorStop(0, 'rgba(255, 230, 110, 0.75)');
      glow.addColorStop(0.4, 'rgba(255, 150, 35, 0.3)');
      glow.addColorStop(1, 'rgba(255, 100, 0, 0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(0, flameY, 65, 0, Math.PI * 2);
      ctx.fill();

      // Deep orange flame body
      ctx.fillStyle = '#ff7300';
      ctx.beginPath();
      ctx.moveTo(-4.5, flameY + 6);
      ctx.quadraticCurveTo(7, flameY, 0, flameY - 16);
      ctx.quadraticCurveTo(-7, flameY, -4.5, flameY + 6);
      ctx.fill();

      // Glowing golden core
      ctx.fillStyle = '#fff4a3';
      ctx.beginPath();
      ctx.arc(0, flameY - 2, 3.8, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  // Traditional Temple Wall with porous laterite texture
  private drawTempleWall() {
    const ctx = this.ctx;
    ctx.save();
    // Porous laterite block texture
    ctx.fillStyle = '#7d3822';
    ctx.fillRect(-65, -92, 130, 92);

    ctx.strokeStyle = '#4e1f12';
    ctx.lineWidth = 2;
    for (let y = -92; y < 0; y += 20) {
      ctx.beginPath();
      ctx.moveTo(-65, y);
      ctx.lineTo(65, y);
      ctx.stroke();
    }
    for (let x = -42; x <= 42; x += 42) {
      ctx.beginPath();
      ctx.moveTo(x, -92);
      ctx.lineTo(x, 0);
      ctx.stroke();
    }

    // Carved timber coping
    ctx.fillStyle = '#522811';
    ctx.fillRect(-70, -98, 140, 8);
    ctx.restore();
  }

  // Traditional Muthukkuda (Ceremonial Silk Umbrella)
  private drawMuthukkuda(time: number) {
    const ctx = this.ctx;
    ctx.save();

    // Long golden pole
    ctx.fillStyle = '#d4af37';
    ctx.fillRect(-2.5, -180, 5, 180);

    // Velvet dome with gentle festive sway
    const sway = Math.sin(time * 0.002) * 2.5;
    ctx.translate(0, -180);
    ctx.rotate((sway * Math.PI) / 180);

    // Deep crimson velvet
    ctx.fillStyle = '#9c1c2a';
    ctx.beginPath();
    ctx.arc(0, 0, 38, Math.PI, 0);
    ctx.closePath();
    ctx.fill();

    // Kasavu gold concentric rings
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Golden silk fringes (Thongal)
    ctx.fillStyle = '#ffdf40';
    for (let fx = -36; fx <= 36; fx += 8) {
      ctx.fillRect(fx - 1, 0, 2.5, 11);
      ctx.beginPath();
      ctx.arc(fx + 0.25, 12, 2.2, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  // Chundan Vallam prow ornament
  private drawBoatDecor(time: number) {
    const ctx = this.ctx;
    ctx.save();
    // Sleek oiled teak prow
    ctx.fillStyle = '#33190d';
    ctx.beginPath();
    ctx.moveTo(-45, 0);
    ctx.quadraticCurveTo(0, -22, 45, -48 + Math.sin(time * 0.002) * 4);
    ctx.lineTo(48, -40);
    ctx.quadraticCurveTo(0, -16, -42, 6);
    ctx.closePath();
    ctx.fill();

    // Gold brass strip
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
  }

  // Chethi (Ixora) flower bush
  private drawFlowerBush() {
    const ctx = this.ctx;
    ctx.save();
    // Foliage
    ctx.fillStyle = '#2b5f27';
    ctx.beginPath();
    ctx.arc(-12, -16, 20, 0, Math.PI * 2);
    ctx.arc(12, -18, 18, 0, Math.PI * 2);
    ctx.arc(0, -28, 18, 0, Math.PI * 2);
    ctx.fill();

    // Vivid scarlet Chethi florets
    ctx.fillStyle = '#dc2626';
    [-14, -5, 6, 16, 0].forEach((fx, i) => {
      ctx.beginPath();
      ctx.arc(fx, -22 + (i % 2) * 8, 4, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
  }

  // Draw handcrafted platforms (Ground, Timber deck, Snake boat, Water hazard)
  public drawPlatforms(platforms: Platform[], time: number) {
    const ctx = this.ctx;

    for (const p of platforms) {
      ctx.save();
      if (p.type === 'ground') {
        // Natural grass & moss cap
        ctx.fillStyle = '#386f2c';
        ctx.fillRect(p.x, p.y, p.w, 10);

        // Organic grass tufts along top edge
        ctx.fillStyle = '#4e8c33';
        for (let gx = p.x; gx < p.x + p.w; gx += 14) {
          ctx.beginPath();
          ctx.moveTo(gx, p.y);
          ctx.lineTo(gx + 4, p.y - 4);
          ctx.lineTo(gx + 8, p.y);
          ctx.fill();
        }

        // Layered rich laterite earth foundation
        const earthGrad = ctx.createLinearGradient(p.x, p.y + 10, p.x, p.y + p.h);
        earthGrad.addColorStop(0, '#8f4127');
        earthGrad.addColorStop(0.5, '#6c2e19');
        earthGrad.addColorStop(1, '#471b0d');
        ctx.fillStyle = earthGrad;
        ctx.fillRect(p.x, p.y + 10, p.w, p.h - 10);

        // Subtle laterite stone strata
        ctx.strokeStyle = '#43190c';
        ctx.lineWidth = 1.8;
        for (let py = p.y + 26; py < p.y + p.h; py += 26) {
          ctx.beginPath();
          ctx.moveTo(p.x, py);
          ctx.lineTo(p.x + p.w, py);
          ctx.stroke();
        }
      } else if (p.type === 'wood' || p.type === 'bridge') {
        // Polished aged teak timber deck
        const timberGrad = ctx.createLinearGradient(p.x, p.y, p.x, p.y + p.h);
        timberGrad.addColorStop(0, '#8c4e25');
        timberGrad.addColorStop(1, '#572d13');
        ctx.fillStyle = timberGrad;
        ctx.fillRect(p.x, p.y, p.w, p.h);

        // Warm light top highlight
        ctx.fillStyle = '#ad6b38';
        ctx.fillRect(p.x, p.y, p.w, 3);

        // Timber planks separation
        ctx.strokeStyle = '#3e1d09';
        ctx.lineWidth = 2;
        for (let px = p.x + 24; px < p.x + p.w; px += 24) {
          ctx.beginPath();
          ctx.moveTo(px, p.y);
          ctx.lineTo(px, p.y + p.h);
          ctx.stroke();
        }

        // Bridge coir rope railing
        if (p.type === 'bridge') {
          ctx.strokeStyle = '#c48e4b';
          ctx.lineWidth = 3.5;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y - 14);
          ctx.quadraticCurveTo(p.x + p.w * 0.5, p.y - 8, p.x + p.w, p.y - 14);
          ctx.stroke();
        }
      } else if (p.type === 'boat') {
        // Chundan Vallam (Snake Boat) deck platform
        const bob = Math.sin(time * 0.0025 + p.x * 0.01) * 3.5;
        ctx.translate(0, bob);

        // Sleek oiled teak hull
        ctx.fillStyle = '#26140b';
        ctx.beginPath();
        ctx.moveTo(p.x - 25, p.y - 8);
        ctx.lineTo(p.x + p.w + 42, p.y - 16); // High proud prow
        ctx.quadraticCurveTo(p.x + p.w * 0.5, p.y + p.h + 20, p.x - 30, p.y + 6);
        ctx.closePath();
        ctx.fill();

        // Authentic brass trim bands
        ctx.strokeStyle = '#d4af37';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Standing deck
        ctx.fillStyle = '#6b3717';
        ctx.fillRect(p.x, p.y, p.w, p.h);

        // Brass lamp on stern
        ctx.fillStyle = '#ffd700';
        ctx.fillRect(p.x + 6, p.y - 12, 6, 12);
      } else if (p.type === 'hazard_water') {
        // Backwater river / canal with natural depth gradient
        const waveOffset = (time * 0.05) % 40;
        const waterGrad = ctx.createLinearGradient(p.x, p.y, p.x, p.y + p.h);
        waterGrad.addColorStop(0, 'rgba(24, 62, 85, 0.88)');
        waterGrad.addColorStop(1, 'rgba(10, 28, 42, 0.96)');
        ctx.fillStyle = waterGrad;
        ctx.fillRect(p.x, p.y, p.w, p.h);

        // Natural soft wave ripples on water surface
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        for (let wx = p.x - 20; wx < p.x + p.w + 20; wx += 28) {
          const wy = p.y + Math.sin((wx + waveOffset) * 0.14) * 3.5;
          if (wx === p.x - 20) ctx.moveTo(wx, wy);
          else ctx.lineTo(wx, wy);
        }
        ctx.stroke();
      } else if (p.type === 'moving_horizontal' || p.type === 'moving_vertical') {
        // Handcrafted bamboo raft
        ctx.fillStyle = '#44703a';
        ctx.fillRect(p.x, p.y, p.w, p.h);

        ctx.strokeStyle = '#8bbd4c';
        ctx.lineWidth = 3;
        for (let bx = p.x + 10; bx < p.x + p.w; bx += 14) {
          ctx.beginPath();
          ctx.moveTo(bx, p.y);
          ctx.lineTo(bx, p.y + p.h);
          ctx.stroke();
        }
      }
      ctx.restore();
    }
  }

  // Draw Pookalam Fragments (Intricate, handcrafted floral collectibles)
  public drawFragments(fragments: FragmentItem[], time: number) {
    const ctx = this.ctx;
    for (const f of fragments) {
      if (f.collected) continue;

      ctx.save();
      const floatY = Math.sin(time * 0.003 + f.pulsePhase) * 5;
      const rot = time * 0.0012 + f.pulsePhase;
      const cx = f.x + f.width * 0.5;
      const cy = f.y + f.height * 0.5 + floatY;

      ctx.translate(cx, cy);

      // Warm golden aura ring
      const glow = ctx.createRadialGradient(0, 0, 4, 0, 0, 26);
      glow.addColorStop(0, 'rgba(255, 225, 90, 0.7)');
      glow.addColorStop(0.5, 'rgba(255, 170, 30, 0.25)');
      glow.addColorStop(1, 'rgba(255, 130, 0, 0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(0, 0, 26, 0, Math.PI * 2);
      ctx.fill();

      // Rotating floral mandala
      ctx.rotate(rot);

      // 8-petal mandala
      ctx.fillStyle = f.petalColor;
      for (let i = 0; i < 8; i++) {
        ctx.save();
        ctx.rotate((i * Math.PI) / 4);
        ctx.beginPath();
        ctx.ellipse(8, 0, 7.5, 3.8, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Golden center core
      ctx.fillStyle = '#ffd700';
      ctx.beginPath();
      ctx.arc(0, 0, 4.8, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }
  }

  // Draw Goal Area: Ancient Pookalam Altar Dais
  public drawGoalArea(goal: LevelData['goalArea'], time: number, fragmentsReady: boolean) {
    const ctx = this.ctx;
    ctx.save();

    // Sacred stone altar plinth
    ctx.fillStyle = '#4e2f1c';
    ctx.fillRect(goal.x, goal.y + goal.h - 32, goal.w, 32);
    ctx.fillStyle = '#7a4627';
    ctx.fillRect(goal.x + 10, goal.y + goal.h - 52, goal.w - 20, 20);

    const pulse = Math.sin(time * 0.004) * 0.2 + 0.8;
    ctx.save();
    ctx.translate(goal.x + goal.w * 0.5, goal.y + goal.h - 52);

    if (fragmentsReady) {
      // Radiant golden portal aura
      const aura = ctx.createRadialGradient(0, -32, 10, 0, -32, 75);
      aura.addColorStop(0, `rgba(255, 220, 80, ${0.55 * pulse})`);
      aura.addColorStop(0.6, `rgba(255, 130, 35, ${0.3 * pulse})`);
      aura.addColorStop(1, 'rgba(255, 80, 0, 0)');
      ctx.fillStyle = aura;
      ctx.beginPath();
      ctx.arc(0, -32, 75, 0, Math.PI * 2);
      ctx.fill();

      // Floating floral ring portal
      ctx.strokeStyle = '#ffd700';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, -32, 38 + Math.sin(time * 0.005) * 4, 0, Math.PI * 2);
      ctx.stroke();

      // Petal markers around ring
      for (let a = 0; a < Math.PI * 2; a += Math.PI / 4) {
        ctx.fillStyle = '#ef4444';
        const px = Math.cos(a + time * 0.002) * 38;
        const py = -32 + Math.sin(a + time * 0.002) * 38;
        ctx.beginPath();
        ctx.arc(px, py, 4.5, 0, Math.PI * 2);
        ctx.fill();
      }
    } else {
      // Incomplete outline awaiting fragments
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.45)';
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 6]);
      ctx.beginPath();
      ctx.arc(0, -32, 38, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    }
    ctx.restore();
    ctx.restore();
  }

  // Draw King Maveli (Stylized realistic human proportions and authentic Kerala attire)
  public drawPlayer(player: PlayerState, time: number) {
    const ctx = this.ctx;
    ctx.save();

    const cx = player.x + player.width * 0.5;
    const cy = player.y + player.height;

    ctx.translate(cx, cy);

    // Facing direction
    if (player.facing === 'left') {
      ctx.scale(-1, 1);
    }

    // Natural walk bobbing & leg swing
    let bobY = 0;
    let legAngle = 0;
    if (player.animState === 'walk') {
      bobY = Math.abs(Math.sin(player.animTimer * 10)) * -3.5;
      legAngle = Math.sin(player.animTimer * 10) * 0.35;
    } else if (player.animState === 'jump') {
      bobY = -3;
    }

    ctx.translate(0, bobY);

    // Natural grounding contact shadow
    ctx.fillStyle = 'rgba(15, 8, 4, 0.28)';
    ctx.beginPath();
    ctx.ellipse(0, 2 - bobY, 18, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Traditional Leather / Wood Sandals (Methiyadi)
    ctx.fillStyle = '#7a421b';
    ctx.fillRect(-12 + Math.sin(legAngle) * 7, -6, 10, 6);
    ctx.fillRect(2 - Math.sin(legAngle) * 7, -6, 10, 6);

    // Kasavu Mundu (Dhoti) in fine off-white handloom cotton
    const dhotiGrad = ctx.createLinearGradient(0, -36, 0, -6);
    dhotiGrad.addColorStop(0, '#f9f6ee');
    dhotiGrad.addColorStop(1, '#ede5d0');
    ctx.fillStyle = dhotiGrad;
    ctx.beginPath();
    ctx.moveTo(-16, -36);
    ctx.lineTo(16, -36);
    ctx.lineTo(14, -6);
    ctx.lineTo(-14, -6);
    ctx.closePath();
    ctx.fill();

    // Authentic fabric fold lines
    ctx.strokeStyle = '#dfd5be';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, -36);
    ctx.lineTo(0, -6);
    ctx.moveTo(-6, -36);
    ctx.lineTo(-5, -6);
    ctx.moveTo(6, -36);
    ctx.lineTo(5, -6);
    ctx.stroke();

    // Metallic Kasavu Gold Zari Border (Kara) at bottom of Mundu
    ctx.fillStyle = '#d4af37';
    ctx.fillRect(-14, -11, 28, 4.5);
    ctx.fillStyle = '#b89428';
    ctx.fillRect(-14, -7, 28, 1);

    // Vermillion Silk Waist Sash (Pattukachha)
    ctx.fillStyle = '#991b1b';
    ctx.fillRect(-16, -38, 32, 5.5);
    // Hanging pleated silk tassel with gold fringe
    ctx.fillRect(8, -38, 5.5, 19);
    ctx.fillStyle = '#d4af37';
    ctx.fillRect(8, -20, 5.5, 2.5);

    // Regal broad torso in warm natural South Indian skin tone
    const skinGrad = ctx.createRadialGradient(0, -50, 4, 0, -50, 16);
    skinGrad.addColorStop(0, '#d19362');
    skinGrad.addColorStop(0.7, '#ba7b4d');
    skinGrad.addColorStop(1, '#9e6238');
    ctx.fillStyle = skinGrad;
    ctx.beginPath();
    ctx.ellipse(0, -50, 14, 15, 0, 0, Math.PI * 2);
    ctx.fill();

    // Antique Gold Royal Necklaces (Kasumala & Haaram)
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 2.8;
    ctx.beginPath();
    ctx.arc(0, -55, 10, 0.25, Math.PI - 0.25);
    ctx.stroke();

    // Carved Ruby Chest Pendant (Pathakkam)
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.arc(0, -45, 3.2, 0, Math.PI * 2);
    ctx.fill();

    // Gold Armlets (Tholvala)
    ctx.fillStyle = '#d4af37';
    ctx.fillRect(-17, -52, 4, 5);
    ctx.fillRect(13, -52, 4, 5);

    // Hands
    ctx.fillStyle = '#ba7b4d';
    if (player.animState === 'celebrate') {
      ctx.beginPath();
      ctx.arc(-16, -66, 4.5, 0, Math.PI * 2);
      ctx.arc(16, -66, 4.5, 0, Math.PI * 2);
      ctx.fill();
    } else {
      const armSwing = Math.sin(player.animTimer * 10) * 5;
      ctx.beginPath();
      ctx.arc(-15 - armSwing, -42, 4, 0, Math.PI * 2);
      ctx.arc(15 + armSwing, -42, 4, 0, Math.PI * 2);
      ctx.fill();
    }

    // Dignified Head & Features
    ctx.fillStyle = skinGrad;
    ctx.beginPath();
    ctx.arc(0, -68, 11, 0, Math.PI * 2);
    ctx.fill();

    // Warm, benevolent eyes
    ctx.fillStyle = '#221508';
    ctx.beginPath();
    ctx.arc(4, -70, 1.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(4.5, -70.5, 0.6, 0, Math.PI * 2);
    ctx.fill();

    // Sandalwood paste (Chandanam) & Vermillion (Kumkumam) tilak
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(0, -75, 5.5, 2);
    ctx.fillStyle = '#b91c1c';
    ctx.beginPath();
    ctx.arc(2.8, -72.5, 1.2, 0, Math.PI * 2);
    ctx.fill();

    // Curled Kerala Moustache (Meesha)
    ctx.strokeStyle = '#1e1106';
    ctx.lineWidth = 2.6;
    ctx.beginPath();
    ctx.moveTo(0, -65);
    ctx.quadraticCurveTo(7, -65, 12, -68);
    ctx.stroke();

    // Golden Kundalam (Earrings)
    ctx.fillStyle = '#d4af37';
    ctx.beginPath();
    ctx.arc(-10, -67, 2.8, 0, Math.PI * 2);
    ctx.fill();

    // Traditional Golden Crown (Kireedam)
    const crownGrad = ctx.createLinearGradient(-13, -95, 13, -75);
    crownGrad.addColorStop(0, '#d4af37');
    crownGrad.addColorStop(0.5, '#fef08a');
    crownGrad.addColorStop(1, '#b89428');
    ctx.fillStyle = crownGrad;
    ctx.beginPath();
    ctx.moveTo(-11, -75);
    ctx.lineTo(-13, -88);
    ctx.lineTo(-5, -84);
    ctx.lineTo(0, -96); // Central high pinnacle
    ctx.lineTo(5, -84);
    ctx.lineTo(13, -88);
    ctx.lineTo(11, -75);
    ctx.closePath();
    ctx.fill();

    // Crown gems (Ruby & Emerald)
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.arc(0, -86, 2.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#059669';
    ctx.beginPath();
    ctx.arc(-6, -81, 1.8, 0, Math.PI * 2);
    ctx.arc(6, -81, 1.8, 0, Math.PI * 2);
    ctx.fill();

    // Traditional Palm-Leaf Umbrella (Olakuda)
    ctx.save();
    ctx.translate(-16, -44);
    ctx.rotate(-0.35 + Math.sin(time * 0.002) * 0.05);

    // Bamboo handle
    ctx.strokeStyle = '#7c4d24';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(0, 16);
    ctx.lineTo(0, -52);
    ctx.stroke();

    // Woven palm leaf cone
    ctx.fillStyle = '#c7ab4e';
    ctx.beginPath();
    ctx.moveTo(-24, -46);
    ctx.lineTo(0, -70);
    ctx.lineTo(24, -46);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#8c7028';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    ctx.restore();
    ctx.restore();
  }
}
