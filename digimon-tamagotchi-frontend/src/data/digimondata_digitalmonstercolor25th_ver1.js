// src/data/digimondata_digitalmonstercolor25th_ver1.js

const entriesVer1 = {
    Digitama: { 
      sprite: 133,
      evolutionStage: "Digitama",
      timeToEvolveSeconds: 10,
      hungerTimer: 0,
      strengthTimer: 0,
      poopTimer: 0,
      minWeight: 0,
      maxStamina: 0,
    },
    Botamon: {
      sprite: 210,
      evolutionStage: "Baby1",
      timeToEvolveSeconds: 600,
      hungerTimer: 3,
      strengthTimer: 3,
      poopTimer: 3,
      minWeight: 5,
      maxStamina: 50,
    },
    Koromon: {
      sprite: 225,
      evolutionStage: "Baby2",
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
      timeToEvolveSeconds: 600,
      hungerTimer: 5,
      strengthTimer: 5,
      poopTimer: 5,
      minWeight: 10,
      maxStamina: 100,
    },
  };
  
  const defaultStats = {
    sprite: 133,
    evolutionStage: "Digitama",
    maxStamina: 0,
    minWeight: 0,
  
    lifespanSeconds: 0,
    lifespanMinutes: 0,
    timeToEvolve: 0,
    timeToEvolveSeconds: 0,
  
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
  
    age: 0,
    weight: 0,
    strength: 0,
    stamina: 0,
    winRate: 0,
    effort: 0,
    careMistakes: 0,
  
    fullness: 0,
    health: 0,
  };
  
  export function initializeStats(digimonName) {
    const custom = entriesVer1[digimonName] || {};
    const merged = { ...defaultStats, ...custom };
  
    merged.hungerCountdown = merged.hungerTimer * 60;
    merged.strengthCountdown = merged.strengthTimer * 60;
    return merged;
  }
  
  export function updateLifespan(prev, deltaTime) {
    const s = { ...prev };
    s.lifespanSeconds += deltaTime;
    s.lifespanMinutes += deltaTime / 60;
  
    s.timeToEvolveSeconds = Math.max(0, s.timeToEvolveSeconds - deltaTime);
  
    const dec = deltaTime / 60;
    s.timeToEvolve = Math.max(0, s.timeToEvolve - dec);
  
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
  }
  
  export function updateAge(stats) {
    // 사용 안 해도 됨
    return stats;
  }
  
  // Digitama->Botamon, Botamon->Koromon, Koromon->(careMistakes<4 => Agumon, else Betamon)
  export const evolutionConditions = {
    Digitama: {
      evolution: [
        {
          next: "Botamon",
          condition: {
            check: (stats) => stats.timeToEvolveSeconds <= 0,
          },
        },
      ],
    },
    Botamon: {
      evolution: [
        {
          next: "Koromon",
          condition: {
            check: (stats) => stats.timeToEvolveSeconds <= 0,
          },
        },
      ],
    },
    Koromon: {
      evolution: [
        {
          next: "Agumon",
          condition: {
            check: (stats) =>
              stats.timeToEvolveSeconds <= 0 && stats.careMistakes < 4,
          },
        },
        {
          next: "Betamon",
          condition: {
            check: (stats) =>
              stats.timeToEvolveSeconds <= 0 && stats.careMistakes >= 4,
          },
        },
      ],
    },
    Agumon: {
      evolution: [],
    },
    Betamon: {
      evolution: [],
    },
  };