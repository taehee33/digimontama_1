// src/data/train_digitalmonstercolor25th_ver1.js

/**
 * Ver.1 훈련 결과 계산
 * partialResults: 5라운드 {round, attack, defend, isHit}
 * 
 * - hits = isHit= true 갯수
 * - fails = 5 - hits
 * - hits가 0~2: "꽝" (체중 -2)
 * - hits가 3~4: "좋음!" (체중 -2, strength+1)
 * - hits=5: "미친거아니야?! 대성공!!!" (체중 -4, strength+3)
 * - 4회 훈련마다 effort+1
 *   => trainingCount++ 저장하여 4의 배수마다 effort++
 */
export function doVer1Training(digimonStats, partialResults) {
    const hits = partialResults.filter((r) => r.isHit).length;
    const fails = partialResults.length - hits; // 보통 5 - hits
  
    // message
    let message = "";
    let weightChange = 0;
    let strengthChange = 0;
    if (hits <= 2) {
      message = "< X!꽝!X >";
      weightChange = -2;
    } else if (hits <= 4) {
      message = "< 좋은 훈련이었다! >";
      weightChange = -2;
      strengthChange = 1;
    } else {
      message = "< 미친거아니야?! 대성공!!! >";
      weightChange = -4;
      strengthChange = 3;
    }
  
    // stat update
    let s = { ...digimonStats };
  
    // 체중은 최소 0 이하로 내려가지 않도록 clamp
    const newWeight = Math.max(0, s.weight + weightChange);
    s.weight = newWeight;
  
    // strength 유지(진화해도) → s.strength은 누적
    s.strength = (s.strength || 0) + strengthChange;
  
    // 훈련 횟수++
    s.trainingCount = (s.trainingCount || 0) + 1;
  
    // 4회마다 effort+1
    if (s.trainingCount % 4 === 0) {
      s.effort = (s.effort || 0) + 1;
    }
  
    // 최종 결과 리턴
    return {
      updatedStats: s,
      hits,
      fails,
      message,
      roundResults: partialResults,
    };
  }