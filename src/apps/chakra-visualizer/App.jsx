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
    // 主动在用户点击手势内请求摄像头权限。Chrome 要求 getUserMedia 必须发生在
    // 「临时用户激活」窗口内；点击开始后还要下载 ~5MB 手势模型，等模型加载完
    // Camera 组件再 start() 时激活早已过期，权限弹窗不会弹出（表现为「无法获取
    // 摄像头权限、没有主动拉取权限」）。这里先在点击瞬间预请求一次，授权会持久
    // 保留，之后的 start() 才能成功。
    if (typeof navigator !== 'undefined' && navigator.mediaDevices?.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: { width: 1280, height: 720 } })
        .then((stream) => stream.getTracks().forEach((t) => t.stop()))
        .catch(() => {
          // 用户拒绝或获取失败：交由 Camera 组件统一展示错误提示
        });
    }
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
