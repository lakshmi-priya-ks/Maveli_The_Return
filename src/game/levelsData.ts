import { LevelData } from '../types';

export const LEVELS: Record<number, LevelData> = {
  1: {
    id: 1,
    name: 'Thiruvonathottam',
    subtitle: 'The Quiet Village',
    objective: 'Gather 4 scattered Pookalam fragments to restore the first floral ring',
    worldWidth: 2600,
    worldHeight: 700,
    theme: 'village',
    playerStart: { x: 120, y: 500 },
    goalArea: { x: 2360, y: 440, w: 120, h: 140 },
    platforms: [
      // Main village ground pathway
      { x: 0, y: 580, w: 650, h: 120, type: 'ground' },
      // Small courtyard rise
      { x: 650, y: 540, w: 220, h: 160, type: 'ground' },
      // Wooden veranda / house roof platform
      { x: 260, y: 450, w: 180, h: 22, type: 'wood' },
      { x: 400, y: 340, w: 160, h: 20, type: 'wood' },
      // Village pathway continues
      { x: 920, y: 580, w: 420, h: 120, type: 'ground' },
      // Elevated laterite wall
      { x: 1060, y: 460, w: 160, h: 22, type: 'wood' },
      { x: 1240, y: 380, w: 150, h: 22, type: 'wood' },
      // Bridge over village lotus pond
      { x: 1340, y: 590, w: 60, h: 110, type: 'ground' },
      { x: 1400, y: 560, w: 240, h: 24, type: 'bridge' },
      // Water pond hazard underneath bridge (if Maveli falls into water -> Journey Interrupted!)
      { x: 1400, y: 620, w: 240, h: 80, type: 'hazard_water' },
      // Far village bank
      { x: 1640, y: 580, w: 500, h: 120, type: 'ground' },
      // Canopy platform among coconut trees
      { x: 1720, y: 460, w: 150, h: 22, type: 'wood' },
      { x: 1920, y: 380, w: 160, h: 22, type: 'wood' },
      // Grand courtyard destination
      { x: 2180, y: 580, w: 420, h: 120, type: 'ground' },
      { x: 2280, y: 500, w: 240, h: 80, type: 'ground' },
    ],
    fragments: [
      {
        id: 'fragment_level1_01',
        x: 320,
        y: 400,
        width: 32,
        height: 32,
        petalColor: '#f59e0b',
        collected: false,
        type: 'petal_cluster',
        pulsePhase: 0,
        ringIndex: 0,
      },
      {
        id: 'fragment_level1_02',
        x: 740,
        y: 480,
        width: 32,
        height: 32,
        petalColor: '#f8fafc',
        collected: false,
        type: 'floral_ring',
        pulsePhase: 1.2,
        ringIndex: 0,
      },
      {
        id: 'fragment_level1_03',
        x: 1290,
        y: 320,
        width: 32,
        height: 32,
        petalColor: '#ef4444',
        collected: false,
        type: 'marigold_knot',
        pulsePhase: 2.4,
        ringIndex: 0,
      },
      {
        id: 'fragment_level1_04',
        x: 1980,
        y: 320,
        width: 32,
        height: 32,
        petalColor: '#fbbf24',
        collected: false,
        type: 'lotus_shard',
        pulsePhase: 3.6,
        ringIndex: 0,
      },
    ],
    scenery: [
      { x: 60, y: 580, type: 'coconut_tree', scale: 1.1 },
      { x: 180, y: 580, type: 'house', scale: 1.0 },
      { x: 500, y: 580, type: 'banana_plant', scale: 0.9 },
      { x: 800, y: 540, type: 'nilavilakku', scale: 1.0, lit: false },
      { x: 960, y: 580, type: 'coconut_tree', scale: 1.0 },
      { x: 1100, y: 580, type: 'banana_plant', scale: 1.0 },
      { x: 1350, y: 580, type: 'flower_bush', scale: 0.8 },
      { x: 1700, y: 580, type: 'house', scale: 1.05 },
      { x: 2100, y: 580, type: 'coconut_tree', scale: 1.2 },
      { x: 2380, y: 500, type: 'nilavilakku', scale: 1.2, lit: false },
    ],
  },

  2: {
    id: 2,
    name: 'Nellikka Paadam',
    subtitle: 'The Emerald Paddy Fields',
    objective: 'Traverse the earthen bunds and collect 4 fragments to unlock the ancient maze',
    worldWidth: 2800,
    worldHeight: 700,
    theme: 'paddy',
    playerStart: { x: 100, y: 500 },
    goalArea: { x: 2560, y: 440, w: 120, h: 140 },
    platforms: [
      // Starting ridge
      { x: 0, y: 580, w: 380, h: 120, type: 'ground' },
      // Canal water
      { x: 380, y: 630, w: 320, h: 70, type: 'hazard_water' },
      // Moving water-lily/reed platform across canal
      {
        x: 420,
        y: 570,
        w: 110,
        h: 22,
        type: 'moving_horizontal',
        startX: 400,
        endX: 620,
        speed: 1.4,
        dx: 1,
      },
      // Second earthen dyke
      { x: 700, y: 580, w: 340, h: 120, type: 'ground' },
      // Elevated farm storage wooden loft
      { x: 820, y: 460, w: 140, h: 20, type: 'wood' },
      { x: 920, y: 350, w: 130, h: 20, type: 'wood' },
      // Water channel with irrigation sluice
      { x: 1040, y: 630, w: 360, h: 70, type: 'hazard_water' },
      // Moving vertical waterwheel lift
      {
        x: 1120,
        y: 540,
        w: 100,
        h: 20,
        type: 'moving_vertical',
        startY: 380,
        endY: 560,
        speed: 1.2,
        dy: 1,
      },
      // Center island bund
      { x: 1340, y: 580, w: 340, h: 120, type: 'ground' },
      { x: 1440, y: 460, w: 160, h: 20, type: 'wood' },
      // Stepping stone dykes over deep paddy water
      { x: 1680, y: 630, w: 460, h: 70, type: 'hazard_water' },
      { x: 1720, y: 560, w: 90, h: 24, type: 'bridge' },
      {
        x: 1860,
        y: 520,
        w: 90,
        h: 22,
        type: 'moving_horizontal',
        startX: 1840,
        endX: 2020,
        speed: 1.6,
        dx: 1,
      },
      // Edge of the fields
      { x: 2140, y: 580, w: 660, h: 120, type: 'ground' },
      { x: 2300, y: 480, w: 150, h: 22, type: 'wood' },
      { x: 2460, y: 520, w: 220, h: 80, type: 'ground' },
    ],
    fragments: [
      {
        id: 'fragment_level2_01',
        x: 520,
        y: 480,
        width: 32,
        height: 32,
        petalColor: '#22c55e',
        collected: false,
        type: 'floral_ring',
        pulsePhase: 0.5,
        ringIndex: 1,
      },
      {
        id: 'fragment_level2_02',
        x: 960,
        y: 300,
        width: 32,
        height: 32,
        petalColor: '#f59e0b',
        collected: false,
        type: 'marigold_knot',
        pulsePhase: 1.8,
        ringIndex: 1,
      },
      {
        id: 'fragment_level2_03',
        x: 1500,
        y: 400,
        width: 32,
        height: 32,
        petalColor: '#ef4444',
        collected: false,
        type: 'petal_cluster',
        pulsePhase: 2.9,
        ringIndex: 1,
      },
      {
        id: 'fragment_level2_04',
        x: 1940,
        y: 450,
        width: 32,
        height: 32,
        petalColor: '#f8fafc',
        collected: false,
        type: 'lotus_shard',
        pulsePhase: 4.1,
        ringIndex: 1,
      },
    ],
    scenery: [
      { x: 180, y: 580, type: 'banana_plant', scale: 1.1 },
      { x: 280, y: 580, type: 'coconut_tree', scale: 1.2 },
      { x: 740, y: 580, type: 'coconut_tree', scale: 0.9 },
      { x: 1380, y: 580, type: 'banana_plant', scale: 1.0 },
      { x: 1600, y: 580, type: 'coconut_tree', scale: 1.1 },
      { x: 2200, y: 580, type: 'house', scale: 0.95 },
      { x: 2500, y: 520, type: 'nilavilakku', scale: 1.1, lit: false },
    ],
  },

  3: {
    id: 3,
    name: 'Vembanad Kayal',
    subtitle: 'Backwaters & The Snake Boats',
    objective: 'Leap across the rhythmic Chundan Vallams to collect 4 sacred water-lily fragments',
    worldWidth: 3000,
    worldHeight: 700,
    theme: 'backwaters',
    playerStart: { x: 100, y: 480 },
    goalArea: { x: 2740, y: 440, w: 120, h: 140 },
    platforms: [
      // Starting jetty dock
      { x: 0, y: 560, w: 320, h: 140, type: 'ground' },
      // Vast backwaters with flowing currents (hazard)
      { x: 320, y: 610, w: 2380, h: 90, type: 'hazard_water' },

      // Snake boat 1 (gently rocking platform)
      {
        x: 390,
        y: 550,
        w: 220,
        h: 30,
        type: 'boat',
        startY: 540,
        endY: 560,
        speed: 1.0,
        dy: 1,
      },
      // Mid-river stilt fishing hut / jetty
      { x: 690, y: 490, w: 140, h: 22, type: 'wood' },

      // Snake boat 2 (moving with the current)
      {
        x: 910,
        y: 540,
        w: 230,
        h: 30,
        type: 'boat',
        startX: 880,
        endX: 1040,
        speed: 1.2,
        dx: 1,
      },

      // Wooden watchtower platform
      { x: 1230, y: 450, w: 130, h: 20, type: 'wood' },
      { x: 1330, y: 360, w: 130, h: 20, type: 'wood' },

      // Snake boat 3 (grand Chundan Vallam)
      {
        x: 1540,
        y: 530,
        w: 260,
        h: 30,
        type: 'boat',
        startY: 520,
        endY: 544,
        speed: 0.9,
        dy: 1,
      },

      // Floating lotus bamboo raft
      {
        x: 1890,
        y: 510,
        w: 140,
        h: 22,
        type: 'moving_horizontal',
        startX: 1860,
        endX: 2060,
        speed: 1.5,
        dx: 1,
      },

      // Snake boat 4
      {
        x: 2180,
        y: 540,
        w: 240,
        h: 30,
        type: 'boat',
        startY: 530,
        endY: 552,
        speed: 1.1,
        dy: 1,
      },

      // Temple Ghat destination
      { x: 2500, y: 560, w: 500, h: 140, type: 'ground' },
      { x: 2650, y: 480, w: 250, h: 80, type: 'ground' },
    ],
    fragments: [
      {
        id: 'fragment_level3_01',
        x: 490,
        y: 470,
        width: 32,
        height: 32,
        petalColor: '#3b82f6',
        collected: false,
        type: 'lotus_shard',
        pulsePhase: 0.3,
        ringIndex: 2,
      },
      {
        id: 'fragment_level3_02',
        x: 980,
        y: 460,
        width: 32,
        height: 32,
        petalColor: '#ec4899',
        collected: false,
        type: 'petal_cluster',
        pulsePhase: 1.5,
        ringIndex: 2,
      },
      {
        id: 'fragment_level3_03',
        x: 1390,
        y: 300,
        width: 32,
        height: 32,
        petalColor: '#f59e0b',
        collected: false,
        type: 'marigold_knot',
        pulsePhase: 2.7,
        ringIndex: 2,
      },
      {
        id: 'fragment_level3_04',
        x: 2280,
        y: 460,
        width: 32,
        height: 32,
        petalColor: '#f8fafc',
        collected: false,
        type: 'floral_ring',
        pulsePhase: 3.9,
        ringIndex: 2,
      },
    ],
    scenery: [
      { x: 60, y: 560, type: 'coconut_tree', scale: 1.2 },
      { x: 220, y: 560, type: 'nilavilakku', scale: 1.0, lit: false },
      { x: 1280, y: 590, type: 'boat_decor', scale: 1.0 },
      { x: 2580, y: 560, type: 'coconut_tree', scale: 1.15 },
      { x: 2780, y: 480, type: 'nilavilakku', scale: 1.2, lit: false },
    ],
  },

  4: {
    id: 4,
    name: 'Thrikkakara Temple Grounds',
    subtitle: 'The Grand Onam Pavilion',
    objective: 'Collect the 4 royal floral crowns to prepare the Grand Pookalam Altar',
    worldWidth: 2600,
    worldHeight: 700,
    theme: 'festival',
    playerStart: { x: 120, y: 500 },
    goalArea: { x: 2360, y: 420, w: 140, h: 160 },
    platforms: [
      // Grand stone temple courtyard
      { x: 0, y: 580, w: 520, h: 120, type: 'ground' },
      // Elevated carved temple balustrade
      { x: 240, y: 460, w: 160, h: 22, type: 'wood' },
      { x: 380, y: 360, w: 160, h: 22, type: 'wood' },
      // Gap with decorative festival pool
      { x: 520, y: 620, w: 200, h: 80, type: 'hazard_water' },
      { x: 550, y: 540, w: 140, h: 24, type: 'bridge' },
      // Temple pavilion center
      { x: 720, y: 580, w: 500, h: 120, type: 'ground' },
      { x: 860, y: 470, w: 150, h: 22, type: 'wood' },
      { x: 1040, y: 390, w: 160, h: 22, type: 'wood' },
      // Hanging festival canopy / swing platforms
      {
        x: 1280,
        y: 490,
        w: 120,
        h: 22,
        type: 'moving_horizontal',
        startX: 1260,
        endX: 1440,
        speed: 1.4,
        dx: 1,
      },
      {
        x: 1520,
        y: 430,
        w: 120,
        h: 22,
        type: 'moving_vertical',
        startY: 340,
        endY: 480,
        speed: 1.2,
        dy: 1,
      },
      // East pavilion steps
      { x: 1700, y: 580, w: 400, h: 120, type: 'ground' },
      { x: 1840, y: 490, w: 160, h: 22, type: 'wood' },
      { x: 2020, y: 410, w: 160, h: 22, type: 'wood' },
      // Grand Pookalam Altar dais
      { x: 2180, y: 580, w: 420, h: 120, type: 'ground' },
      { x: 2280, y: 500, w: 280, h: 80, type: 'ground' },
    ],
    fragments: [
      {
        id: 'fragment_level4_01',
        x: 440,
        y: 300,
        width: 32,
        height: 32,
        petalColor: '#f59e0b',
        collected: false,
        type: 'petal_cluster',
        pulsePhase: 0.6,
        ringIndex: 3,
      },
      {
        id: 'fragment_level4_02',
        x: 930,
        y: 410,
        width: 32,
        height: 32,
        petalColor: '#ec4899',
        collected: false,
        type: 'lotus_shard',
        pulsePhase: 1.9,
        ringIndex: 3,
      },
      {
        id: 'fragment_level4_03',
        x: 1340,
        y: 420,
        width: 32,
        height: 32,
        petalColor: '#ef4444',
        collected: false,
        type: 'marigold_knot',
        pulsePhase: 3.1,
        ringIndex: 3,
      },
      {
        id: 'fragment_level4_04',
        x: 2080,
        y: 350,
        width: 32,
        height: 32,
        petalColor: '#f8fafc',
        collected: false,
        type: 'floral_ring',
        pulsePhase: 4.3,
        ringIndex: 3,
      },
    ],
    scenery: [
      { x: 80, y: 580, type: 'muthukkuda', scale: 1.1 },
      { x: 200, y: 580, type: 'temple_wall', scale: 1.0 },
      { x: 760, y: 580, type: 'nilavilakku', scale: 1.1, lit: false },
      { x: 1000, y: 580, type: 'muthukkuda', scale: 1.0 },
      { x: 1740, y: 580, type: 'muthukkuda', scale: 1.1 },
      { x: 1980, y: 580, type: 'coconut_tree', scale: 1.2 },
      { x: 2420, y: 500, type: 'nilavilakku', scale: 1.3, lit: false },
    ],
  },
};

/**
 * Dynamically computes total collectible fragments defined across all levels.
 * Guarantees that the game denominator is never hard-coded.
 */
export const getTotalFragmentsAvailable = (): number => {
  return Object.values(LEVELS).reduce((total, lvl) => total + (lvl.fragments?.length || 0), 0);
};

/**
 * Returns a complete array of unique fragment IDs defined in the game levels.
 */
export const getAllFragmentIds = (): string[] => {
  return Object.values(LEVELS).flatMap((lvl) => (lvl.fragments || []).map((f) => f.id));
};
