// 기본 스탯 값
const defaultStats = {
    sprite: 210,            // 스프라이트 번호
    evolutionStage: 0,      // 진화 단계
    maxStamina: 0,          // 최대 스테미나
    minWeight: 5,           // 최저 몸무게
    lifespanMinutes: 10,    // 남은 수명 (분)
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
  
  // 초기화 함수
  export const initializeStats = (customStats = {}) => {
    return { ...defaultStats, ...customStats };
  };
  
  // 스탯 업데이트 함수
  export const updateStat = (stats, key, value) => {
    return { ...stats, [key]: value };
  };
  
  export default defaultStats;
  