export type GameState =
  | 'TITLE'
  | 'HOW_TO_PLAY'
  | 'INTRO'
  | 'LEVEL_1'
  | 'PUZZLE_1'
  | 'LEVEL_2'
  | 'PUZZLE_2'
  | 'LEVEL_3'
  | 'PUZZLE_3'
  | 'LEVEL_4'
  | 'PUZZLE_4'
  | 'CELEBRATION'
  | 'RESULTS';

export interface FragmentItem {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  petalColor: string; // e.g., '#f59e0b', '#ef4444', '#f8fafc', '#ec4899', '#fbbf24'
  collected: boolean;
  type: 'petal_cluster' | 'floral_ring' | 'lotus_shard' | 'marigold_knot';
  pulsePhase: number;
  ringIndex: number; // 0 to 4 corresponding to final Pookalam
}

export interface Platform {
  x: number;
  y: number;
  w: number;
  h: number;
  type: 'ground' | 'wood' | 'boat' | 'moving_horizontal' | 'moving_vertical' | 'hazard_water' | 'hazard_spikes' | 'bridge';
  startX?: number;
  endX?: number;
  startY?: number;
  endY?: number;
  speed?: number;
  dx?: number;
  dy?: number;
}

export interface SceneryProp {
  x: number;
  y: number;
  type: 'house' | 'coconut_tree' | 'banana_plant' | 'nilavilakku' | 'temple_wall' | 'boat_decor' | 'muthukkuda' | 'flower_bush';
  scale?: number;
  lit?: boolean;
}

export interface LevelData {
  id: number;
  name: string;
  subtitle: string;
  objective: string;
  worldWidth: number;
  worldHeight: number;
  playerStart: { x: number; y: number };
  goalArea: { x: number; y: number; w: number; h: number };
  platforms: Platform[];
  fragments: FragmentItem[];
  scenery: SceneryProp[];
  waterLevel?: number; // y coordinate of water
  theme: 'village' | 'paddy' | 'backwaters' | 'festival';
}

export interface PlayerState {
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  grounded: boolean;
  facing: 'left' | 'right';
  animState: 'idle' | 'walk' | 'jump' | 'fall' | 'celebrate' | 'failure';
  animTimer: number;
  coyoteTimer: number;
  jumpBufferTimer: number;
  lives: number;
  maxLives: number;
}

export interface GameStats {
  score: number;
  fragmentsCollected: number;
  totalFragments: number;
  puzzlesCompleted: number;
  totalPuzzles: number;
  startTime: number;
  finishTime: number;
  rank?: 'S' | 'A' | 'B' | 'C';
  collectedFragmentIds?: string[];
}
