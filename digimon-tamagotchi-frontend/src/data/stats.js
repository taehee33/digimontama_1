// src/data/stats.js
import digimonData from "./digimonData";

const defaultStats = {
  // 디지타마로 설정
  sprite: 133,
  evolutionStage: "Digitama",
  maxStamina: 0,
  minWeight: 0,

  // 수명/진화
  lifespanSeconds: 0,
  lifespanMinutes: 0,
  timeToEvolve: 0,         // 분
  timeToEvolveSeconds: 0,  // 초

  // 수면/배변
  sleepTime: { hour: 0, minute: 0 },
  wakeupTime: { hour: 0, minute: 0 },
  hungerTimer: 0,
  strengthTimer: 0,
  poopTimer: 0,

  hungerCountdown: 0,
  strengthCountdown: 0,

  healing: 0,
  attribute: 0,
  power: 0,
  attackSprite: 0,
  altAttackSprite: 65535,

  // 유지되는 스탯
  age: 0,
  weight: 0,
  strength: 0,
  stamina: 0,
  winRate: 0,
  effort: 0,
  careMistakes: 0,

  // 배부름, 건강 (최대5)
  fullness: 0,
  health: 0,
};

const digimonStats = {
  Digitama: {
    sprite: 133,
    evolutionStage: "Digitama",
    timeToEvolve: 0,
    timeToEvolveSeconds: 10, // 10초 후 진화
    hungerTimer: 0,
    strengthTimer: 0,
    poopTimer: 0,
  },
  Botamon: {
    sprite: 210,
    evolutionStage: "Baby1",
    timeToEvolve: 10, // 분
    timeToEvolveSeconds: 600, // 10분
    hungerTimer: 3,
    strengthTimer: 3,
    poopTimer: 3,
    minWeight: 5,
    maxStamina: 50,
  },
  Koromon: {
    sprite: 225,
    evolutionStage: "Baby2",
    timeToEvolve: 10,
    timeToEvolveSeconds: 600,
    hungerTimer: 4,
    strengthTimer: 4,
    poopTimer: 4,
    minWeight: 6,
    maxStamina: 60,
  },
  Agumon: {
    sprite: 240,
    evolutionStage: "Child",
    timeToEvolve: 10,
    timeToEvolveSeconds: 600,
    hungerTimer: 5,
    strengthTimer: 5,
    poopTimer: 5,
    minWeight: 10,
    maxStamina: 100,
  },
  Betamon: {
    sprite: 260,
    evolutionStage: "Child",
    timeToEvolve: 10,
    timeToEvolveSeconds: 600,
    hungerTimer: 5,
    strengthTimer: 5,
    poopTimer: 5,
    minWeight: 10,
    maxStamina: 100,
  },
  // 더 필요하면 추가
};

export const initializeStats = (digimonName) => {
  const custom = digimonStats[digimonName] || {};
  const merged = { ...defaultStats, ...custom };

  merged.hungerCountdown = merged.hungerTimer * 60;
  merged.strengthCountdown = merged.strengthTimer * 60;
  return merged;
};

export const updateLifespan = (stats, deltaTime) => {
  const s = { ...stats };

  // 수명
  s.lifespanSeconds += deltaTime;
  s.lifespanMinutes += deltaTime / 60;

  // timeToEvolve(분)
  const dec = deltaTime / 60;
  s.timeToEvolve = Math.max(0, s.timeToEvolve - dec);

  // timeToEvolveSeconds(초)
  s.timeToEvolveSeconds = Math.max(0, s.timeToEvolveSeconds - deltaTime);

  // 배고픔/건강
  if (s.hungerTimer > 0) {
    s.hungerCountdown -= deltaTime;
    if (s.hungerCountdown <= 0) {
      s.fullness = Math.max(0, s.fullness - 1);
      s.hungerCountdown = s.hungerTimer * 60;
    }
  }
  if (s.strengthTimer > 0) {
    s.strengthCountdown -= deltaTime;
    if (s.strengthCountdown <= 0) {
      s.health = Math.max(0, s.health - 1);
      s.strengthCountdown = s.strengthTimer * 60;
    }
  }

  return s;
};

export const updateAge = (stats) => {
  const now = new Date();
  if (now.getHours() === 0 && now.getMinutes() === 0) {
    return { ...stats, age: stats.age + 1 };
  }
  return stats;
};

export default defaultStats;