// src/data/digimondata_digitalmonstercolor25th_ver1.js
export const digimonDataVer1 = {
  // 사망 형태
  Ohakadamon1: {
    sprite: 159,
    evolutionStage: "Ohakadamon",
    hungerTimer: 0,
    strengthTimer: 0,
    poopTimer: 0,
    maxOverfeed: 0,
  },
  Ohakadamon2: {
    sprite: 160,
    evolutionStage: "Ohakadamon",
    hungerTimer: 0,
    strengthTimer: 0,
    poopTimer: 0,
    maxOverfeed: 0,
  },

  // Digitama
  Digitama: {
    sprite: 133,
    evolutionStage: "Digitama",
    timeToEvolveSeconds: 10,
    hungerTimer: 0,
    strengthTimer: 0,
    poopTimer: 0,
    maxOverfeed: 0,
  },

  // Baby1, Baby2, Child
  Botamon: {
    sprite: 210,
    evolutionStage: "Baby1",
    timeToEvolveSeconds: 600,
    hungerTimer: 3,
    strengthTimer: 3,
    poopTimer: 3,
    maxOverfeed: 3,
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
    maxOverfeed: 2,
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
    maxOverfeed: 4,
    minWeight: 10,
    maxStamina: 100,
  },
  Betamon: {
    // ★ 여기서 sprite=255 로 확정
    sprite: 255,
    evolutionStage: "Child",
    timeToEvolveSeconds: 600,
    hungerTimer: 5,
    strengthTimer: 5,
    poopTimer: 5,
    maxOverfeed: 2,
    minWeight: 10,
    maxStamina: 100,
  },

  // Adult
  Greymon: {
    sprite: 270,
    evolutionStage: "Adult",
    timeToEvolveSeconds: 600,
    hungerTimer: 5,
    strengthTimer: 5,
    poopTimer: 5,
    maxOverfeed: 2,
    // 필요 시 minWeight, maxStamina 등 추가
  },

  // 필요 시 Perfect/Ultimate/SU 추가
};