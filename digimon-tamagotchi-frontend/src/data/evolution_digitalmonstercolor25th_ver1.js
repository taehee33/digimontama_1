// src/data/evolution_digitalmonstercolor25th_ver1.js

export const evolutionConditionsVer1 = {
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
            check: (stats) => stats.timeToEvolveSeconds <= 0 && stats.careMistakes < 4,
          },
        },
        {
          next: "Betamon",
          condition: {
            check: (stats) => stats.timeToEvolveSeconds <= 0 && stats.careMistakes >= 4,
          },
        },
      ],
    },
    Agumon: {
      evolution: [
        {
          next: "Greymon",
          condition: {
            check: (stats) => stats.timeToEvolveSeconds <= 0 && stats.careMistakes < 4,
          },
        },
        {
          next: "Betamon",
          condition: {
            check: (stats) => stats.timeToEvolveSeconds <= 0 && stats.careMistakes >= 4,
          },
        },
      ],
    },
    Betamon: {
      evolution: [],
    },
    Greymon: {
      evolution: [],
    },
    // ...
  };