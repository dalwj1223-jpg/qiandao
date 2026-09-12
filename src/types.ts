export type GameState = 'START' | 'PLAYING' | 'PAUSED' | 'GAMEOVER';

export type PlatformType = 'standard' | 'moving' | 'fragile' | 'disappearing' | 'trap';

export type PlatformStyle = 'swimring' | 'lemon' | 'lime' | 'ice' | 'watermelon' | 'popsicle';

export type ItemType = 'spring' | 'propeller' | 'rocket' | 'shield';

export type MonsterType = 'jellyfish' | 'pufferfish' | 'crab';

export interface PowerUp {
  type: ItemType;
  duration: number; // remaining frames/ms
  maxDuration: number;
}

export interface Player {
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  facing: 'left' | 'right';
  squashTimer: number; // > 0 means in squash landing frame (>.< face, flattened body)
  stretchTimer: number; // > 0 means in launch stretch frame
  isSquashing: boolean;
  powerUp: PowerUp | null;
  hasShield: boolean;
  rotation: number;
}

export interface Item {
  type: ItemType;
  x: number; // offset on platform
  y: number;
  width: number;
  height: number;
  collected: boolean;
  frame?: number;
}

export interface Platform {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  type: PlatformType;
  style?: PlatformStyle;
  vx?: number;
  minX?: number;
  maxX?: number;
  broken?: boolean;
  breakProgress?: number;
  disappearAlpha?: number;
  disappearDir?: number;
  item?: Item | null;
  hasBeenJumpedOn?: boolean;
}

export interface Monster {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  type: MonsterType;
  vx: number;
  minX: number;
  maxX: number;
  alive: boolean;
  frame: number;
}

export interface Projectile {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  life: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
  shape?: 'circle' | 'star' | 'spark';
}

export interface StarBackground {
  x: number;
  y: number;
  size: number;
  alpha: number;
  twinkleSpeed: number;
}

export interface Mission {
  id: string;
  text: string;
  current: number;
  target: number;
  completed: boolean;
}
