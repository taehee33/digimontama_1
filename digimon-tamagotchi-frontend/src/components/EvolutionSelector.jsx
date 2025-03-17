import { useState } from "react";
import digimonData from "../data/digimonData";

const EvolutionSelector = ({ selectedDigimon, onEvolve }) => {
  const [evolutionOptions, setEvolutionOptions] = useState([]);

  const handleShowOptions = () => {
    const currentData = digimonData[selectedDigimon];
    if (!currentData) return;

    const candidates = Object.keys(digimonData).filter((name) => {
      const data = digimonData[name];
      return (
        data.version === currentData.version &&
        isNextStage(currentData.stage, data.stage)
      );
    });

    setEvolutionOptions(candidates);
  };

  const isNextStage = (currentStage, candidateStage) => {
    const stages = [
      "Baby1",
      "Baby2",
      "Child",
      "Adult",
      "Perfect",
      "Ultimate",
      "SuperUltimate",
    ];
    const currentIndex = stages.indexOf(currentStage);
    const candidateIndex = stages.indexOf(candidateStage);
    return candidateIndex === currentIndex + 1;
  };

  return (
    <div>
      <button onClick={handleShowOptions}>진화</button>
      {evolutionOptions.length > 0 && (
        <select onChange={(e) => onEvolve(e.target.value)}>
          <option value="">진화 선택</option>
          {evolutionOptions.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export default EvolutionSelector;
