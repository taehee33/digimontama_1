const DigimonSelector = ({ selectedDigimon, setSelectedDigimon, digimonNames }) => {
    return (
      <select value={selectedDigimon} onChange={(e) => setSelectedDigimon(e.target.value)}>
        {digimonNames.map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>
    );
  };
  
  export default DigimonSelector;
  