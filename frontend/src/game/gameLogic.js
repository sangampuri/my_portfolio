export const LANE_X = [-2, 0, 2];
export const SPAWN_Z = -80;
export const DESPAWN_Z = 6;
export const BASE_SPEED = 14;
export const MAX_SPEED = 34;
export const SPEED_RAMP = 0.35; // m/s gained per second
export const GRAVITY = 26;
export const JUMP_V = 9.5;
export const COIN_VALUE = 10;
export const OBSTACLE_POOL = 14;
export const COIN_POOL = 48;

export const OBSTACLE_DIMS = {
  barrier: { w: 1.7, h: 0.7, d: 0.8 }, // jump over
  wall: { w: 1.7, h: 2.2, d: 0.8 }, // change lane
};

export function createState() {
  const g = {
    time: 0,
    distance: 0,
    speed: BASE_SPEED,
    coins: 0,
    score: 0,
    nextSpawn: 14,
    player: { lane: 1, x: 0, y: 0, vy: 0 },
    obstacles: Array.from({ length: OBSTACLE_POOL }, () => ({ active: false, x: 0, z: 0, type: "barrier" })),
    coinList: Array.from({ length: COIN_POOL }, () => ({ active: false, x: 0, z: 0 })),
  };
  [-30, -48, -66].forEach((z) => spawnRow(g, z)); // road not empty at start
  return g;
}

export function resetState(g) {
  Object.assign(g, createState());
}

export function jump(g) {
  const p = g.player;
  if (p.y <= 0.001) p.vy = JUMP_V;
}

export function moveLane(g, dir) {
  const p = g.player;
  p.lane = Math.max(0, Math.min(2, p.lane + dir));
}

const free = (pool) => pool.find((o) => !o.active);

function spawnRow(g, z) {
  const progress = Math.min(1, (g.speed - BASE_SPEED) / (MAX_SPEED - BASE_SPEED));
  const lanes = [0, 1, 2].sort(() => Math.random() - 0.5);
  const blockedCount = Math.random() < 0.2 + 0.4 * progress ? 2 : 1; // never 3: one lane always open
  const wallChance = 0.25 + 0.35 * progress;

  lanes.slice(0, blockedCount).forEach((l) => {
    const o = free(g.obstacles);
    if (!o) return;
    o.active = true;
    o.x = LANE_X[l];
    o.z = z;
    o.type = Math.random() < wallChance ? "wall" : "barrier";
  });

  if (Math.random() < 0.7) {
    const open = lanes.slice(blockedCount);
    const l = open[Math.floor(Math.random() * open.length)];
    for (let i = 0; i < 4; i++) {
      const c = free(g.coinList);
      if (!c) break;
      c.active = true;
      c.x = LANE_X[l];
      c.z = z + 3 + i * 2.2;
    }
  }
}

// Advance world by dt seconds. Returns true if player crashed.
export function step(g, dt) {
  g.time += dt;
  g.speed = Math.min(MAX_SPEED, BASE_SPEED + g.time * SPEED_RAMP);
  const move = g.speed * dt;
  g.distance += move;

  const p = g.player;
  p.x += (LANE_X[p.lane] - p.x) * Math.min(1, dt * 14);
  p.vy -= GRAVITY * dt;
  p.y += p.vy * dt;
  if (p.y <= 0) {
    p.y = 0;
    p.vy = 0;
  }

  while (g.distance >= g.nextSpawn) {
    spawnRow(g, SPAWN_Z);
    g.nextSpawn += 12 + g.speed * 0.45 + Math.random() * 5;
  }

  let crashed = false;

  for (const o of g.obstacles) {
    if (!o.active) continue;
    o.z += move;
    if (o.z > DESPAWN_Z) {
      o.active = false;
      continue;
    }
    const d = OBSTACLE_DIMS[o.type];
    if (
      Math.abs(o.z) < d.d / 2 + 0.4 &&
      Math.abs(o.x - p.x) < d.w / 2 + 0.3 &&
      p.y < d.h - 0.05
    ) {
      crashed = true;
    }
  }

  for (const c of g.coinList) {
    if (!c.active) continue;
    c.z += move;
    if (c.z > DESPAWN_Z) {
      c.active = false;
      continue;
    }
    if (Math.abs(c.z) < 0.9 && Math.abs(c.x - p.x) < 0.9 && p.y < 2) {
      c.active = false;
      g.coins += 1;
    }
  }

  g.score = Math.floor(g.distance) + g.coins * COIN_VALUE;
  return crashed;
}