import React from 'react';

const StatsPopup = ({ stats, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-4 rounded-2xl shadow-xl w-80">
        <h2 className="text-xl font-bold mb-4">Digimon Status</h2>
        <ul className="text-sm space-y-1">
          <li>Sprite: {stats.sprite}</li>
          <li>Evolution Stage: {stats.evolutionStage}</li>
          <li>Max Stamina: {stats.maxStamina}</li>
          <li>Min Weight: {stats.minWeight}</li>
          <li>Lifespan: {stats.lifespanMinutes} min</li>
          <li>Sleep Time: {stats.sleepTime.hour}h {stats.sleepTime.minute}m</li>
          <li>Wakeup Time: {stats.wakeupTime.hour}h {stats.wakeupTime.minute}m</li>
          <li>Hunger Timer: {stats.hungerTimer} min</li>
          <li>Strength Timer: {stats.strengthTimer} min</li>
          <li>Poop Timer: {stats.poopTimer} min</li>
          <li>Healing: {stats.healing}</li>
          <li>Attribute: {stats.attribute}</li>
          <li>Power: {stats.power}</li>
          <li>Attack Sprite: {stats.attackSprite}</li>
          <li>Alt Attack Sprite: {stats.altAttackSprite}</li>
        </ul>
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default StatsPopup;
