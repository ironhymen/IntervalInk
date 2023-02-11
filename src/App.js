import React, { useState, useEffect, useRef } from 'react';

const App = () => {
  const [pictures, setPictures] = useState([]);
  const [pictureInterval, setPictureInterval] = useState(60);
  const [percentage, setPercentage] = useState(100);
  const [random, setRandom] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const imageRef = useRef(null);

  

  let picturesToShow;
  if (percentage === 100) {
    picturesToShow = pictures;
  } else {
    const numberOfPictures = Math.round((pictures.length * percentage) / 100);
    const startIndex = currentIndex % pictures.length;
    const endIndex = (startIndex + numberOfPictures - 1) % pictures.length;
    if (endIndex >= startIndex) {
      picturesToShow = pictures.slice(startIndex, endIndex + 1);
    } else {
      picturesToShow = [...pictures.slice(startIndex), ...pictures.slice(0, endIndex + 1)];
    }
  }

  if (random) {
    picturesToShow = picturesToShow
      .map( picture => ({ picture, order: Math.random() }))
      .sort((a, b) => a.order - b.order)
      .map( pictureObject => pictureObject.picture);
  }

useEffect(() => {
  if (!isPlaying) {
    return;
  }

  const intervalId = setInterval(() => {
    setCurrentIndex((currentIndex + 1) % picturesToShow.length);
  }, pictureInterval * 1000);

  return () => {
    clearInterval(intervalId);
  };
}, [isPlaying, currentIndex, picturesToShow.length, pictureInterval]);

  const handleFileUpload = event => {
  const acceptedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  const imageFiles = Array.from(event.target.files).filter(file => {
    return acceptedImageTypes.includes(file.type);
  });
  
  setPictures(imageFiles.map(file => URL.createObjectURL(file)));
};

  const handleStartClick = () => {
  setIsPlaying(true);
  imageRef.current.scrollIntoView({ behavior: 'smooth' });
};

  const handleStopClick = () => {
    setIsPlaying(false);
  };

  const handleIntervalChange = event => {
    setPictureInterval(event.target.value);
  };

  const handlePercentageChange = event => {
    setPercentage(event.target.value);
  };

  const handleRandomChange = event => {
    setRandom(event.target.checked);
  };

return (
  <div>
    
      
    <div id="controls">
      
      {!isPlaying && (
        <div>
          <h1>Timed Gesture Drawing App</h1>
          <h2>Upload Pictures</h2>
          <input type="file" multiple onChange={handleFileUpload} />
        </div>
      )}
      {!isPlaying && (
        <div>
          <h2>Settings</h2>
          <div>
            <label>
              Interval (in seconds):
              <input
                type="number"
                value={ pictureInterval}
                onChange={handleIntervalChange}
                min="1"
                max={7200}
                step="1"
              />
            </label>
          </div>
          <div>
            <label>
              Percentage of pictures to show:
              <input
                type="number"
                value={percentage}
                onChange={handlePercentageChange}
                min="0"
                max="100"
                step="10"
              />
            </label>
          </div>
          <div>
            <label>
              Random order:
              <input type="checkbox" checked={random} onChange={handleRandomChange} />
            </label>
          </div>
        </div>
      )}
      <div>
        {isPlaying ? (
          <button onClick={handleStopClick}>Stop</button>
        ) : (
          <button onClick={handleStartClick}>Start</button>
        )}
      </div>
      </div>
      <div id="pictureArea">
        {picturesToShow.map(( picture, index) => (
          <img
            ref={index === currentIndex ? imageRef : null}            
            key={ picture }
            src={ picture }
            style={{
              display: index === currentIndex ? 'block' : 'none'
              
            }}
            alt="gesture drawing"
          />
        ))}
      </div>
    </div>
);
};

export default App;