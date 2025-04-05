// src/data/stats.js
import { defaultStats } from "./defaultStatsFile"; 

export function initializeStats(digiName, oldStats={}, dataMap={}){
  if(!dataMap[digiName]){
    console.error(`initializeStats: [${digiName}] not found in dataMap!`);
    digiName= "Digitama"; // fallback
  }
  const custom = dataMap[digiName] || {};
  
  let merged= { ...defaultStats, ...custom };

  // 기존 이어받기
  merged.age = oldStats.age || merged.age;
  merged.weight = oldStats.weight || merged.weight;
  merged.lifespanSeconds= oldStats.lifespanSeconds || merged.lifespanSeconds;

  merged.hungerCountdown= merged.hungerTimer * 60;
  merged.strengthCountdown= merged.strengthTimer * 60;

  // ★ (1) poop 관련 필드 이어받기
  merged.poopCount = (oldStats.poopCount !== undefined) ? oldStats.poopCount : 0;
  merged.poopTimer = merged.poopTimer || 0;        // dataMap에서 가져온 값(분)
  merged.poopCountdown = (oldStats.poopCountdown !== undefined)
    ? oldStats.poopCountdown
    : (merged.poopTimer * 60);

  merged.lastMaxPoopTime = oldStats.lastMaxPoopTime || null;

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

  // ★ (2) poop 로직
  // poopTimer>0 일 경우
  if(s.poopTimer>0){
    s.poopCountdown -= deltaSec;
    if(s.poopCountdown<=0){
      if(s.poopCount<8){
        // 1) 똥 1개 추가
        s.poopCount++;
        s.poopCountdown= s.poopTimer*60;
      } else {
        // 이미 똥=8 → lastMaxPoopTime 체크
        if(!s.lastMaxPoopTime){
          s.lastMaxPoopTime= Date.now();
        } else {
          const e= (Date.now() - s.lastMaxPoopTime)/1000;
          // 8시간=28800초 방치 → careMistakes++
          if(e>=28800){
            s.careMistakes++;
            s.lastMaxPoopTime= Date.now(); // 다시 리셋
          }
        }
        // countdown 리셋
        s.poopCountdown= s.poopTimer*60;
      }
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