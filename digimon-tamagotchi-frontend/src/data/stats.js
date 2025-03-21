import digimonData from './digimonData';  // digimonData.js 임포트

// 기본 스탯 값
const defaultStats = {
  sprite: 210,            // 스프라이트 번호
  evolutionStage: "Baby1",  // 진화 단계
  maxStamina: 0,          // 최대 스테미나
  minWeight: 5,           // 최저 몸무게
  lifespanMinutes: 0,    // 남은 수명 (분)
  timeToEvolve: 10,     // 진화까지 남은 시간 (분)
  sleepTime: {            // 수면 시간
    hour: 0,
    minute: 0
  },
  wakeupTime: {           // 기상 시간
    hour: 0,
    minute: 0
  },
  hungerTimer: 3,         // 배고픔 타이머 (분)
  strengthTimer: 3,       // 힘 소멸 타이머 (분)
  poopTimer: 3,           // 배변 타이머 (분)
  healing: 0,             // 치료 상태
  attribute: 0,           // 속성
  power: 0,               // 파워
  attackSprite: 0,        // 공격 스프라이트
  altAttackSprite: 65535  // 대체 공격 스프라이트
};

// 디지몬별 스탯 데이터
const digimonStats = {
  "Botamon": {
    sprite: 210,
    evolutionStage: "Baby1", // Baby1로 설정
    maxStamina: 50,
    minWeight: 5,
    lifespanMinutes: 0,
    timeToEvolve: 10,     // 진화까지 남은 시간 (분)
    hungerTimer: 3,
    strengthTimer: 3,
    poopTimer: 3,
    healing: 0,
    attribute: "Free",
    power: 30,
    attackSprite: 220,
    altAttackSprite: 65535
  },
  "Koromon": {
    sprite: 225,
    evolutionStage: "Baby2", // Baby2로 설정
    maxStamina: 60,
    minWeight: 6,
    lifespanMinutes: 0,
    timeToEvolve: 10,     // 진화까지 남은 시간 (분)
    hungerTimer: 4,
    strengthTimer: 4,
    poopTimer: 4,
    healing: 0,
    attribute: "Free",
    power: 35,
    attackSprite: 230,
    altAttackSprite: 65535
  },
  "Agumon": {
    sprite: 240,
    evolutionStage: "Child", // Child로 설정
    maxStamina: 100,
    minWeight: 10,
    lifespanMinutes: 15,
    hungerTimer: 5,
    strengthTimer: 5,
    poopTimer: 5,
    healing: 0,
    attribute: "Vaccine",
    power: 50,
    attackSprite: 250,
    altAttackSprite: 65535
  },
  // 나머지 디지몬들도 여기에 추가
};

// 초기화 함수
export const initializeStats = (digimonName) => {
  const customStats = digimonStats[digimonName] || {};
  return { ...defaultStats, ...customStats };
};

// 스탯 업데이트 함수
export const updateStat = (stats, key, value) => {
  return { ...stats, [key]: value };
};

// 수명 업데이트 함수 (시간 증가)
export const updateLifespan = (stats, deltaTime) => {
  return { ...stats, lifespanMinutes: stats.lifespanMinutes + deltaTime, timeToEvolve: Math.max(0, stats.timeToEvolve - deltaTime) };
};

export default defaultStats;