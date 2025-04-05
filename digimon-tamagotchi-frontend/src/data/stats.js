// src/data/stats.js
// - 로직(초기화, updateLifespan, etc.)
// - digimonDataVer1를 import하여 merge
// - 오버피드, health=5 clamp, hunger=0->12h 사망

import { digimonDataVer1 } from "./digimondata_digitalmonstercolor25th_ver1";

const defaultStats = {
  // 공통 기본
  sprite: 133,
  evolutionStage: "Digitama",
  lifespanSeconds: 0,
  timeToEvolveSeconds: 0,

  hungerTimer: 0,
  strengthTimer: 0,
  poopTimer: 0,
  hungerCountdown: 0,
  strengthCountdown: 0,

  age: 0,
  weight: 0,
  strength: 0,
  fullness: 0,   // 0..(5+maxOverfeed)
  health: 0,     // 0..5
  isDead: false,
  lastHungerZeroAt: null,
  maxOverfeed: 0,
  // etc. minWeight, maxStamina...
};

/** initializeStats(digiName) */
export function initializeStats(digiName){
  // 해당 Ver.1 데이터
  const data= digimonDataVer1[digiName] || {};
  const merged= { ...defaultStats, ...data };

  // timer countdown
  merged.hungerCountdown= merged.hungerTimer*60;
  merged.strengthCountdown= merged.strengthTimer*60;
  return merged;
}

/** updateLifespan(stats, deltaSec) */
export function updateLifespan(stats, deltaSec){
  if(stats.isDead) return stats;

  const s= { ...stats };

  // 수명
  s.lifespanSeconds += deltaSec;

  // 진화 타이머
  s.timeToEvolveSeconds= Math.max(0, s.timeToEvolveSeconds - deltaSec);

  // fullness--
  if(s.hungerTimer>0){
    s.hungerCountdown -= deltaSec;
    if(s.hungerCountdown<=0){
      s.fullness= Math.max(0, s.fullness-1);
      s.hungerCountdown= s.hungerTimer*60;

      // hunger=0 => record time
      if(s.fullness===0 && !s.lastHungerZeroAt){
        s.lastHungerZeroAt= Date.now();
      }
    }
  }

  // health--
  if(s.strengthTimer>0){
    s.strengthCountdown -= deltaSec;
    if(s.strengthCountdown<=0){
      s.health= Math.max(0, s.health-1);
      s.strengthCountdown= s.strengthTimer*60;
    }
  }

  // hunger=0 => 12h later => isDead
  if(s.fullness>0){
    s.lastHungerZeroAt= null;
  } else if(s.fullness===0 && s.lastHungerZeroAt){
    const elapsed= (Date.now()- s.lastHungerZeroAt)/1000;
    if(elapsed>=43200){
      s.isDead= true;
    }
  }
  return s;
}

/** updateAge => 자정마다 age++ */
export function updateAge(stats){
  const now= new Date();
  if(now.getHours()===0 && now.getMinutes()===0){
    return { ...stats, age: stats.age+1 };
  }
  return stats;
}