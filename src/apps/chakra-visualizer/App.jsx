// @ts-nocheck
/* eslint-disable */
import React, { useState } from 'react';
import Tutorial from './components/Tutorial';
import Camera from './components/Camera';
import './App.css';

function App() {
  const [showCamera, setShowCamera] = useState(false);
  const [initialJutsu, setInitialJutsu] = useState(null);

  const handleStart = (jutsuId = null) => {
    setInitialJutsu(jutsuId);
    setShowCamera(true);
  };

  return (
    <>
      {!showCamera ? (
        <Tutorial onStart={handleStart} />
      ) : (
        <div className="camera-view">
          <Camera initialJutsu={initialJutsu} onBack={() => { setInitialJutsu(null); setShowCamera(false); }} />
        </div>
      )}
    </>
  );
}

export default App;
