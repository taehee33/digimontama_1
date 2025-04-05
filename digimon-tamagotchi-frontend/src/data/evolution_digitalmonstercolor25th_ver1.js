// src/data/evolution_digitalmonstercolor25th_ver1.js
// Ver.1의 진화조건만 정의(로직 없음)

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
    // 필요시 추가...
  };