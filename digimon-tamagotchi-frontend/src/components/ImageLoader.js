export const loadImages = (sources, callback) => {
    let loadedCount = 0;
    const totalImages = Object.keys(sources).length;
    const images = {};
  
    Object.keys(sources).forEach((key) => {
      images[key] = new Image();
      images[key].src = sources[key];
      images[key].onload = () => {
        loadedCount++;
        if (loadedCount === totalImages) {
          callback(images);
        }
      };
    });
  };
  