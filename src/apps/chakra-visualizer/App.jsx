// @ts-nocheck
/* eslint-disable */
import React, { useState } from 'react';
import Tutorial from './components/Tutorial';
import Camera from './components/Camera';
import { requestCameraAccess } from '@/lib/apps/camera-access';
import './App.css';

function App() {
  const [showCamera, setShowCamera] = useState(false);
  const [initialJutsu, setInitialJutsu] = useState(null);
  const [cameraAttempt, setCameraAttempt] = useState(0);
  const [cameraRequestState, setCameraRequestState] = useState('idle');

  const handleStart = async (jutsuId = null) => {
    // 主动在用户点击手势内请求摄像头权限。Chrome 要求 getUserMedia 必须发生在
    // 「临时用户激活」窗口内；点击开始后还要下载手势运行时与模型，等模型加载完
    // Camera 组件再 start() 时激活早已过期，权限弹窗不会弹出（表现为「无法获取
    // 摄像头权限、没有主动拉取权限」）。这里先在点击瞬间预请求一次，授权会持久
    // 保留，之后的 start() 才能成功。
    // 等首次权限请求结束后再挂载 Camera，避免两个 getUserMedia 同时抢占摄像头。
    if (cameraRequestState === 'requesting') return;
    setCameraRequestState('requesting');
    const access = await requestCameraAccess();
    if (!access.ok) {
      setCameraRequestState(access.reason);
      return;
    }
    setCameraRequestState('idle');
    setInitialJutsu(jutsuId);
    setCameraAttempt((attempt) => attempt + 1);
    setShowCamera(true);
  };

  return (
    <>
      {!showCamera ? (
        <Tutorial onStart={handleStart} cameraRequestState={cameraRequestState} />
      ) : (
        <div className="camera-view">
          <Camera
            key={cameraAttempt}
            initialJutsu={initialJutsu}
            onRetry={() => {
              setShowCamera(false);
              void handleStart(initialJutsu);
            }}
            onBack={() => { setInitialJutsu(null); setShowCamera(false); }}
          />
        </div>
      )}
    </>
  );
}

export default App;
