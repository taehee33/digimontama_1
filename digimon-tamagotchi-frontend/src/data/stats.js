// stats.js
import digimonData from './digimonData';  // digimonData.js 임포트

// 기본 스탯 값
const defaultStats = {
  sprite: 210,               // 스프라이트 번호
  evolutionStage: "Baby1",   // 진화 단계
  maxStamina: 0,             // 최대 스테미나
  minWeight: 5,              // 최저 몸무게

  // ---------------------------
  // 수명/진화 관련
  // ---------------------------
  lifespanSeconds: 0,        // 실제 생존 시간(초) => 1초마다 +1
  lifespanMinutes: 0,        // (기존) 분 단위 수명도 함께 관리
  timeToEvolve: 10,          // 진화까지 남은 시간(분)
  timeToEvolveSeconds: 600,  // 진화까지 남은 시간(초)

  // ---------------------------
  // 수면/배변/등등
  // ---------------------------
  sleepTime: {
    hour: 0,
    minute: 0
  },
  wakeupTime: {
    hour: 0,
    minute: 0
  },
  hungerTimer: 3,            // 배고픔 "기준" (분)
  strengthTimer: 3,          // 힘(건강) "기준" (분)
  poopTimer: 3,              // 배변 타이머 (분) [필요시 사용]

  // "기준값"에 따른 실제 카운트다운(초)
  hungerCountdown: 3 * 60,
  strengthCountdown: 3 * 60,

  healing: 0,                // 치료 상태
  attribute: 0,              // 속성
  power: 0,                  // 파워
  attackSprite: 0,           // 공격 스프라이트
  altAttackSprite: 65535,    // 대체 공격 스프라이트

  // ---------------------------
  // 유지되는 스탯
  // ---------------------------
  age: 0,                    // 연령 (1일마다 +1)
  weight: 0,                 // 체중 (디지몬마다 다르게 초기화)
  strength: 0,               // 근력 (디지몬마다 다르게 초기화)
  stamina: 0,                // 체력 (디지몬마다 다르게 초기화)
  winRate: 0,                // 승률
  effort: 0,                 // 노력
  careMistakes: 0,           // 케어미스

  // ---------------------------
  // 추가: 배부름, 건강함 (최대5)
  // ---------------------------
  fullness: 0,
  health: 0,
};

// 디지몬별 스탯 데이터 (필요에 따라 override)
const digimonStats = {
  "Botamon": {
    sprite: 210,
    evolutionStage: "Baby1",
    maxStamina: 50,
    minWeight: 5,

    // 기존 방식 유지 (분)
    lifespanMinutes: 0,
    timeToEvolve: 10,
    timeToEvolveSeconds: 600,

    hungerTimer: 3,
    strengthTimer: 3,
    poopTimer: 3,
    healing: 0,
    attribute: "Free",
    power: 30,
    attackSprite: 220,
    altAttackSprite: 65535,
    age: 0,
    weight: 5,     // Botamon의 체중
    strength: 0,   // 근력
    stamina: 50,   // 체력
    winRate: 0,
    effort: 0,
    careMistakes: 0,

    // 초기 fullness/health
    fullness: 0,
    health: 0,
  },
  "Koromon": {
    sprite: 225,
    evolutionStage: "Baby2",
    maxStamina: 60,
    minWeight: 6,

    lifespanMinutes: 0,
    timeToEvolve: 10,
    timeToEvolveSeconds: 600,

    hungerTimer: 4,
    strengthTimer: 4,
    poopTimer: 4,
    healing: 0,
    attribute: "Free",
    power: 35,
    attackSprite: 230,
    altAttackSprite: 65535,
    age: 0,
    weight: 6,
    strength: 5,
    stamina: 60,
    winRate: 0,
    effort: 0,
    careMistakes: 0,

    fullness: 0,
    health: 0,
  },
  "Agumon": {
    sprite: 240,
    evolutionStage: "Child",
    maxStamina: 100,
    minWeight: 10,

    lifespanMinutes: 15,
    timeToEvolve: 10,
    timeToEvolveSeconds: 600,

    hungerTimer: 5,
    strengthTimer: 5,
    poopTimer: 5,
    healing: 0,
    attribute: "Vaccine",
    power: 50,
    attackSprite: 250,
    altAttackSprite: 65535,
    age: 1,
    weight: 10,
    strength: 10,
    stamina: 100,
    winRate: 0,
    effort: 0,
    careMistakes: 0,

    fullness: 0,
    health: 0,
  },
  // 나머지 디지몬들도 필요시 추가
};

// (1) 초기화 함수
export const initializeStats = (digimonName) => {
  const customStats = digimonStats[digimonName] || {};
  const merged = { ...defaultStats, ...customStats };

  // hungerTimer/strengthTimer는 "기준(분)"이므로
  // 실제 카운트다운(초) 변수에 재설정
  merged.hungerCountdown = merged.hungerTimer * 60;
  merged.strengthCountdown = merged.strengthTimer * 60;

  return merged;
};

/**
 * (2) 매 1초마다( deltaTime=1 ) 호출된다고 가정
 *     => 수명/진화타이머/배고픔/건강 카운트다운 등 업데이트
 */
export const updateLifespan = (stats, deltaTime) => {
  // deltaTime(초)만큼 경과
  const newStats = { ...stats };

  // 1) 수명(초) + deltaTime
  newStats.lifespanSeconds += deltaTime;

  // (기존) lifespanMinutes도 업데이트 (혹시 다른 로직에서 사용한다면)
  newStats.lifespanMinutes += (deltaTime / 60);

  // 2) timeToEvolve (분 단위) => 1초 지날 때마다 1/60분 감소
  const decMinutes = deltaTime / 60;
  newStats.timeToEvolve = Math.max(0, newStats.timeToEvolve - decMinutes);

  // timeToEvolveSeconds(초 단위) => deltaTime만큼 감소
  newStats.timeToEvolveSeconds = Math.max(
    0,
    newStats.timeToEvolveSeconds - deltaTime
  );

  // 3) hungerCountdown, strengthCountdown
  //    기준값(hungerTimer)은 그대로 두고, countdown만 줄임
  newStats.hungerCountdown -= deltaTime;
  if (newStats.hungerCountdown <= 0) {
    // fullness -1 (최소 0)
    newStats.fullness = Math.max(0, newStats.fullness - 1);
    // 다시 hungerTimer(분)*60초로 리셋
    newStats.hungerCountdown = newStats.hungerTimer * 60;
  }

  newStats.strengthCountdown -= deltaTime;
  if (newStats.strengthCountdown <= 0) {
    // health -1 (최소 0)
    newStats.health = Math.max(0, newStats.health - 1);
    newStats.strengthCountdown = newStats.strengthTimer * 60;
  }

  return newStats;
};

// (3) 연령 증가 함수 (자정마다)
export const updateAge = (stats) => {
  const currentTime = new Date();
  const hours = currentTime.getHours();
  const minutes = currentTime.getMinutes();
  if (hours === 0 && minutes === 0) {
    return { ...stats, age: stats.age + 1 };
  }
  return stats;
};

export default defaultStats;