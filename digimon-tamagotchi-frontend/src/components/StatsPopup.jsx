// src/components/StatsPopup.jsx
import React from "react";

// lifespan format
function formatTime(sec=0){
  const d= Math.floor(sec/86400);
  const r= sec%86400;
  const m= Math.floor(r/60), s= r%60;
  return `${d} day ${m} min ${s} sec`;
}
function formatTimeToEvolve(sec=0){
  const mm= Math.floor(sec/60), ss= sec%60;
  return `${mm}m ${ss}s`;
}
function fullnessDisplay(fullness, maxOverfeed=0){
  const base= Math.min(5, fullness);
  let over=0;
  if(fullness>5){
    over= fullness-5;
  }
  return `${base}${over>0? "(+"+over+")": ""}`;
}

export default function StatsPopup({
  stats,
  onClose,
  devMode=false,
  onChangeStats
}){
  const {
    fullness, maxOverfeed, timeToEvolveSeconds, lifespanSeconds,
    age, sprite, evolutionStage, weight, health, isDead,
    hungerTimer, strengthTimer, poopTimer,
    maxStamina, minWeight, healing, attribute, power,
    attackSprite, altAttackSprite, careMistakes
  }= stats;

  function handleChange(field,e){
    if(!onChangeStats) return;
    const val= parseInt(e.target.value,10);
    const newStats= {...stats,[field]: val};
    onChangeStats(newStats);
  }

  // dev selects
  const possibleFullness=[];
  for(let i=0;i<=5+(maxOverfeed||0); i++){
    possibleFullness.push(i);
  }
  const possibleHealth=[0,1,2,3,4,5];
  const possibleWeight=[];
  for(let w=0; w<=50; w++){
    possibleWeight.push(w);
  }
  const possibleMistakes=[];
  for(let c=0; c<10; c++){
    possibleMistakes.push(c);
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded shadow-xl w-80">
        <h2 className="text-lg font-bold mb-2">Digimon Status</h2>
        <ul className="text-sm space-y-1">
          <li>Age: {age}</li>
          <li>Sprite: {sprite}</li>
          <li>Stage: {evolutionStage}</li>
          <li>Lifespan: {formatTime(lifespanSeconds)}</li>
          <li>TimeToEvolve: {formatTimeToEvolve(timeToEvolveSeconds)}</li>
          <li>Fullness: {fullnessDisplay(fullness, maxOverfeed)}</li>
          <li>Health: {health}</li>
          <li>Weight: {weight}</li>
          <li>MaxOverfeed: {maxOverfeed}</li>
          <li>isDead: {isDead? "Yes":"No"}</li>

          <li>HungerTimer: {hungerTimer} min</li>
          <li>StrengthTimer: {strengthTimer} min</li>
          <li>PoopTimer: {poopTimer} min</li>
          <li>MaxStamina: {maxStamina}</li>
          <li>MinWeight: {minWeight}</li>
          <li>Healing: {healing}</li>
          <li>Attribute: {attribute}</li>
          <li>Power: {power}</li>
          <li>Attack Sprite: {attackSprite}</li>
          <li>Alt Attack Sprite: {altAttackSprite}</li>
          <li>CareMistakes: {careMistakes||0}</li>
        </ul>

        {devMode && onChangeStats && (
          <div className="mt-2 border p-2 text-sm">
            <h3 className="font-bold">[Dev Mode] 스탯 수정</h3>
            {/* fullness */}
            <label className="block mt-1">
              Fullness:
              <select
                value={fullness}
                onChange={(e)=> handleChange("fullness",e)}
                className="border ml-2"
              >
                {possibleFullness.map(v=><option key={v} value={v}>{v}</option>)}
              </select>
            </label>
            {/* health */}
            <label className="block mt-1">
              Health:
              <select
                value={health}
                onChange={(e)=> handleChange("health",e)}
                className="border ml-2"
              >
                {possibleHealth.map(h=><option key={h} value={h}>{h}</option>)}
              </select>
            </label>
            {/* weight */}
            <label className="block mt-1">
              Weight:
              <select
                value={weight}
                onChange={(e)=> handleChange("weight",e)}
                className="border ml-2"
              >
                {possibleWeight.map(w=><option key={w} value={w}>{w}</option>)}
              </select>
            </label>
            {/* careMistakes */}
            <label className="block mt-1">
              CareMistakes:
              <select
                value={careMistakes||0}
                onChange={(e)=> handleChange("careMistakes",e)}
                className="border ml-2"
              >
                {possibleMistakes.map(c=><option key={c} value={c}>{c}</option>)}
              </select>
            </label>
          </div>
        )}

        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          닫기
        </button>
      </div>
    </div>
  );
}