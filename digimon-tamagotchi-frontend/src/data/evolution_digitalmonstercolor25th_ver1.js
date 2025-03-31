// src/data/evolutionConditions.js

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
    Agumon: { evolution: [] },
    Betamon: { evolution: [] },
  };
  
  export default evolutionConditions;