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

  function shufflePictures() {
  // Fisher-Yates shuffle
  for (let i = picturesToShow.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [picturesToShow[i], picturesToShow[j]] = [picturesToShow[j], picturesToShow[i]];
  }

  // Make sure the current picture is the first one
  const currentPicture = picturesToShow[currentIndex % picturesToShow.length];
  picturesToShow = [currentPicture, ...picturesToShow.filter(picture => picture !== currentPicture)];

  // Update the current index
  setCurrentIndex(0);

  // Restart the display
  setIsPlaying(false);
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

  function handleRandomChange() {
  setRandom(!random);
  shufflePictures();
}

return (
  <div>
    
      
    <div id="controls">
      {!isPlaying && (
        <div>
          <h1>Interval Ink</h1>
          <h2>Timed Gesture Drawing</h2>
          <details>
            <summary>Instructions</summary>
            <p>If looking for a Timed Gesture Drawing App that provides it's own library check out <a href="https://quickposes.com/en/gestures/timed">Quickposes</a></p>

            <p>This app allows you to upload pictures and display them one by one with a specified interval. You can also set the percentage of pictures to show, and choose whether to display them in a random order or not.</p>

            <h3>Uploading Pictures</h3>
            <p>Click the "Upload Pictures" button and select the pictures you want to upload. The app only accepts JPEG, PNG, GIF, and WEBP image formats.</p>
            <p> <strong> <em>Server does not save or store files</em></strong></p>

            <h3>Setting the Interval and Percentage of Pictures to Show</h3>
            <p>Use the "Interval (in seconds)" input field to set the time interval for displaying each picture, in seconds. The interval can be between 1 second and 7200 seconds (2 hours).</p>
            <p>Use the "Percentage of pictures to show" input field to set the percentage of pictures you want to display, from 0% to 100%.</p>
            <p>Check the "Random order" checkbox to display the pictures in a random order. If the checkbox is not checked, the pictures will be displayed in the order they were uploaded.</p>

            <h3>Starting and Stopping the Display</h3>
            <p>Click the "Start" button to start displaying the pictures. The first picture will smoothly scroll into view. Click the "Stop" button to stop the display at any time.</p>
            <p>App created by <a href="http://sagresnaw.art/">Christopher Best</a></p>
            </details>        
        </div>
      )}
      
      {!isPlaying && (
        <div>
          <fieldset>
            <legend>Upload Pictures</legend>
            <label for="fileUpload"> Upload: </label>
            <input id='fileUpload' type="file" multiple onChange={handleFileUpload} />
            </fieldset>
        </div>
      )}
      {!isPlaying && (
        <div>
          <fieldset>
          <legend>Settings</legend>
          <div>
            <label for="interval">
              Interval (in seconds):
              </label>
              <input
                id='interval'
                type="number"
                value={ pictureInterval}
                onChange={handleIntervalChange}
                min="1"
                max={7200}
                step="1"
              />
            
          </div>
          <div>
            <label for="percent">
              Percentage of pictures to show:
              </label>
              <input
                id='percent'
                type="number"
                value={percentage}
                onChange={handlePercentageChange}
                min="0"
                max="100"
                step="10"
              />
            
          </div>
          <div>
            <label for="order">
                Random order:
                </label>
              <input id="order" type="checkbox" checked={random} onChange={handleRandomChange} />
            
            </div>

            </fieldset>
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
      <p>{pictureInterval}</p>
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