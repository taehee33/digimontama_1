// src/data/stats.js
import { defaultStats } from "./defaultStatsFile"; 
// 혹은 아래 defaultStats를 이 파일 내에 직접 정의해도 됨

export function initializeStats(digiName, oldStats={}, dataMap={}){
  if(!dataMap[digiName]){
    console.error(`initializeStats: [${digiName}] not found in dataMap!`);
    // fallback: Digitama? or just return oldStats?
    // 여기서는 Digitama로 fallback 예시
    digiName= "Digitama";
  }
  const custom = dataMap[digiName] || {};
  
  let merged= { ...defaultStats, ...custom };

  // 기존 age, weight, lifespanSeconds 이어받기
  merged.age = oldStats.age || merged.age;
  merged.weight = oldStats.weight || merged.weight;
  merged.lifespanSeconds= oldStats.lifespanSeconds || merged.lifespanSeconds;

  merged.hungerCountdown= merged.hungerTimer * 60;
  merged.strengthCountdown= merged.strengthTimer*60;

  return merged;
}

export function updateLifespan(stats, deltaSec=1){
  if(stats.isDead) return stats;

  const s= { ...stats };
  s.lifespanSeconds += deltaSec;
  s.timeToEvolveSeconds= Math.max(0, s.timeToEvolveSeconds - deltaSec);

  // fullness--
  if(s.hungerTimer>0){
    s.hungerCountdown -= deltaSec;
    if(s.hungerCountdown<=0){
      s.fullness= Math.max(0, s.fullness-1);
      s.hungerCountdown= s.hungerTimer*60;

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
  // hunger=0 => 12h->사망
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

export function updateAge(stats){
  const now= new Date();
  if(now.getHours()===0 && now.getMinutes()===0){
    return { ...stats, age: stats.age+1 };
  }
  return stats;
}