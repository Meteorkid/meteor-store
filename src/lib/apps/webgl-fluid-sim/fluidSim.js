/*
MIT License

Copyright (c) 2017 Pavel Dobryakov

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

// @ts-nocheck
/* eslint-disable */

'use strict';

// i18n - 中英双语翻译
const i18n = {
    en: {
        quality: 'quality',
        simResolution: 'sim resolution',
        densityDiffusion: 'density diffusion',
        velocityDiffusion: 'velocity diffusion',
        pressure: 'pressure',
        vorticity: 'vorticity',
        splatRadius: 'splat radius',
        shading: 'shading',
        colorful: 'colorful',
        paused: 'paused',
        randomSplats: 'Random splats',
        bloom: 'Bloom',
        enabled: 'enabled',
        intensity: 'intensity',
        threshold: 'threshold',
        sunrays: 'Sunrays',
        weight: 'weight',
        capture: 'Capture',
        bgColor: 'background color',
        screenshot: 'take screenshot',
        langBtn: '中文',
        // dropdown options
        high: 'high',
        medium: 'medium',
        low: 'low',
        veryLow: 'very low',
        gestureControl: 'Gesture Control',
        enableGesture: 'enable gesture',
        bgMode: 'background',
        bgBlack: 'black',
        bgWhite: 'white',
        bgCamera: 'camera',
        waterMode: 'water mode',
        common: 'Essentials',
        advanced: 'Advanced settings',
        controls: 'Fluid controls',
        closeControls: 'Close controls',
        cameraRequesting: 'Requesting camera access…',
        cameraReady: 'Camera ready',
        cameraDenied: 'Camera unavailable. Check browser permission and retry.',
        retryCamera: 'Retry camera',
    },
    zh: {
        quality: '画质',
        simResolution: '模拟分辨率',
        densityDiffusion: '密度扩散',
        velocityDiffusion: '速度扩散',
        pressure: '压力',
        vorticity: '涡旋强度',
        splatRadius: '触点半径',
        shading: '着色',
        colorful: '多彩模式',
        paused: '暂停',
        randomSplats: '随机溅射',
        bloom: '辉光',
        enabled: '启用',
        intensity: '强度',
        threshold: '阈值',
        sunrays: '光线',
        weight: '权重',
        capture: '截图',
        bgColor: '背景颜色',
        screenshot: '截图保存',
        langBtn: 'English',
        high: '高',
        medium: '中',
        low: '低',
        veryLow: '极低',
        gestureControl: '手势控制',
        enableGesture: '启用手势',
        bgMode: '背景模式',
        bgBlack: '黑色',
        bgWhite: '白色',
        bgCamera: '摄像头',
        waterMode: '水纹模式',
        common: '常用设置',
        advanced: '高级设置',
        controls: '流体控制',
        closeControls: '关闭控制面板',
        cameraRequesting: '正在请求摄像头权限…',
        cameraReady: '摄像头已就绪',
        cameraDenied: '无法使用摄像头，请检查浏览器权限后重试。',
        retryCamera: '重试摄像头',
    }
};

const inheritedLang = document.documentElement.lang.toLowerCase();
let currentLang = inheritedLang.startsWith('zh') ? 'zh' : 'en';
function t(key) { return i18n[currentLang][key] || key; }

function updatePageTexts() {
    document.title = currentLang === 'zh' ? 'WebGL 流体模拟' : 'WebGL Fluid Simulation';
}

function switchLang() {
    currentLang = currentLang === 'en' ? 'zh' : 'en';
    localStorage.setItem('fluidLang', currentLang);
    updatePageTexts();
    rebuildGUI();
}

let gui = null;
let controlsRoot = null;
let controlsToggle = null;
let controlsBackdrop = null;
let controlsClose = null;
let cameraStatusText = null;
let cameraRetryButton = null;
/** 动画循环句柄，用于组件卸载时销毁 */
let rafId = null;
function rebuildGUI() {
    destroyControlPanelChrome();
    if (gui) { gui.destroy(); gui = null; }
    startGUI();
}

function setControlPanelOpen(open, { restoreFocus = false } = {}) {
    if (!controlsRoot || !controlsToggle || !gui) return;
    controlsRoot.classList.toggle('fluid-controls-open', open);
    controlsToggle.setAttribute('aria-expanded', String(open));
    gui.domElement.setAttribute('aria-hidden', String(!open));
    gui.domElement.inert = !open;
    if (open) {
        controlsClose?.focus();
    } else if (restoreFocus) {
        controlsToggle.focus();
    }
}

function handleControlPanelKeydown(event) {
    if (event.key === 'Escape' && controlsRoot?.classList.contains('fluid-controls-open')) {
        setControlPanelOpen(false, { restoreFocus: true });
    }
}

function setupControlPanelChrome() {
    const root = canvas.closest('.fluid-sim-root');
    const autoPlace = gui?.domElement?.parentElement;
    if (!root || !autoPlace) return;

    controlsRoot = root;
    gui.domElement.id = 'fluid-control-panel';
    gui.domElement.classList.add('fluid-control-panel');
    autoPlace.classList.add('fluid-controls-shell');
    root.appendChild(autoPlace);

    const header = document.createElement('div');
    header.className = 'fluid-control-header';
    const title = document.createElement('strong');
    title.textContent = t('controls');
    controlsClose = document.createElement('button');
    controlsClose.type = 'button';
    controlsClose.className = 'fluid-controls-close';
    controlsClose.setAttribute('aria-label', t('closeControls'));
    controlsClose.textContent = '×';
    controlsClose.addEventListener('click', () => setControlPanelOpen(false, { restoreFocus: true }));
    header.append(title, controlsClose);
    gui.domElement.insertBefore(header, gui.domElement.firstChild);

    controlsToggle = document.createElement('button');
    controlsToggle.type = 'button';
    controlsToggle.className = 'fluid-controls-toggle';
    controlsToggle.setAttribute('aria-controls', gui.domElement.id);
    controlsToggle.setAttribute('aria-expanded', 'false');
    controlsToggle.setAttribute('aria-label', t('controls'));
    controlsToggle.innerHTML = '<span aria-hidden="true">≡</span><span>' + t('controls') + '</span>';
    controlsToggle.addEventListener('click', () => {
        const open = !root.classList.contains('fluid-controls-open');
        setControlPanelOpen(open);
    });

    controlsBackdrop = document.createElement('button');
    controlsBackdrop.type = 'button';
    controlsBackdrop.className = 'fluid-controls-backdrop';
    controlsBackdrop.setAttribute('aria-label', t('closeControls'));
    controlsBackdrop.addEventListener('click', () => setControlPanelOpen(false, { restoreFocus: true }));
    root.append(controlsBackdrop, controlsToggle);
    window.addEventListener('keydown', handleControlPanelKeydown);
    setControlPanelOpen(false);
}

function destroyControlPanelChrome() {
    window.removeEventListener('keydown', handleControlPanelKeydown);
    controlsToggle?.remove();
    controlsBackdrop?.remove();
    controlsRoot?.classList.remove('fluid-controls-open');
    controlsRoot = null;
    controlsToggle = null;
    controlsBackdrop = null;
    controlsClose = null;
    cameraStatusText = null;
    cameraRetryButton = null;
}

function setCameraStatus(messageKey, tone = '') {
    if (!cameraStatusText || !cameraRetryButton) return;
    cameraStatusText.textContent = t(messageKey);
    cameraStatusText.parentElement.dataset.tone = tone;
    cameraRetryButton.hidden = messageKey !== 'cameraDenied';
}

// ============================================
// 摄像头 + 手势 + 背景 统一管理
// ============================================

let mediaPipeReady = typeof Hands !== 'undefined' && typeof Camera !== 'undefined';

// --- 状态 ---
let gestureEnabled = false;   // 手势追踪开关
let bgMode = 'black';         // 背景模式：black | white | camera

// --- DOM ---
const gestureVideo = document.getElementById('gestureVideo');
const cameraBg = document.getElementById('cameraBg');
const cameraBgCtx = cameraBg ? cameraBg.getContext('2d') : null;
const fogOverlay = document.getElementById('fogOverlay');

// 动态设置摄像头背景 canvas 分辨率
function resizeCameraBg() {
    if (!cameraBg) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    cameraBg.width = Math.round(window.innerWidth * dpr * 0.5);
    cameraBg.height = Math.round(window.innerHeight * dpr * 0.5);
}
resizeCameraBg();
window.addEventListener('resize', resizeCameraBg);

// --- MediaPipe 实例 ---
let handsInstance = null;
let cameraInstance = null;

// ============================================
// 背景模式
// ============================================
// 主动在用户手势内请求摄像头权限。Chrome 要求 getUserMedia 必须发生在「临时用户
// 激活」窗口内；切换背景/手势后 startCamera 前还要 await initHands()（首次会下载
// 手势模型），真正的 getUserMedia 往往落在激活过期之后，权限弹窗不会出现。所以
// 在用户点击的瞬间先预请求一次，授权会持久保留，之后的 startCamera() 才能成功。
async function prewarmCamera() {
    if (typeof navigator === 'undefined' || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraStatus('cameraDenied', 'error');
        return false;
    }
    setCameraStatus('cameraRequesting', 'working');
    try {
        const stream = await navigator.mediaDevices
        .getUserMedia({ video: { width: 256, height: 192 } })
        stream.getTracks().forEach((track) => track.stop());
        setCameraStatus('cameraReady', 'success');
        return true;
    } catch {
        setCameraStatus('cameraDenied', 'error');
        return false;
    }
}

async function setBgMode(mode) {
    bgMode = mode;
    if (mode === 'camera') await prewarmCamera();

    // 重置所有背景状态
    cameraBg.style.display = 'none';
    fogOverlay.style.display = 'none';
    document.body.style.backgroundColor = '#000';
    config.TRANSPARENT = false;

    if (mode === 'white') {
        document.body.style.backgroundColor = '#fff';
    } else if (mode === 'camera') {
        config.TRANSPARENT = true;
        document.body.style.backgroundColor = 'transparent';
        cameraBg.style.display = 'block';
        fogOverlay.style.display = 'block';
    }

    // 背景变化后重新评估摄像头需求
    await syncCamera();
}

// ============================================
// 摄像头生命周期（背景和手势共用）
// ============================================
function isCameraNeeded() {
    return bgMode === 'camera' || gestureEnabled;
}

async function syncCamera() {
    if (isCameraNeeded() && !cameraInstance) {
        await startCamera();
    } else if (!isCameraNeeded() && cameraInstance) {
        stopCamera();
    }
}

async function startCamera() {
    if (cameraInstance) return;
    if (!mediaPipeReady) {
        setCameraStatus('cameraDenied', 'error');
        return;
    }
    try {
        await initHands();
        cameraInstance = new Camera(gestureVideo, {
            onFrame: async () => {
                try {
                    await handsInstance.send({ image: gestureVideo });
                } catch (e) { /* 静默跳过单帧错误 */ }
            },
            width: 256,
            height: 192
        });
        await cameraInstance.start();
        setCameraStatus('cameraReady', 'success');
    } catch {
        cameraInstance = null;
        setCameraStatus('cameraDenied', 'error');
    }
}

function stopCamera() {
    if (!cameraInstance) return;
    cameraInstance.stop();
    cameraInstance = null;
    // 清空背景画面
    if (cameraBgCtx) {
        cameraBgCtx.clearRect(0, 0, cameraBg.width, cameraBg.height);
    }
}

// ============================================
// MediaPipe Hands 初始化
// ============================================
async function initHands() {
    if (handsInstance) return;
    if (!mediaPipeReady) {
        alert(currentLang === 'zh'
            ? '手势库加载失败，请检查网络后刷新页面'
            : 'Gesture library failed to load. Check network and refresh.');
        return;
    }

    handsInstance = new Hands({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
    });
    handsInstance.setOptions({
        maxNumHands: 1,
        modelComplexity: 0,          // 0=精简模型，最快
        minDetectionConfidence: 0.6, // 适中阈值，减少误检
        minTrackingConfidence: 0.5   // 追踪稳定
    });
    handsInstance.onResults(onHandResults);
}

// ============================================
// 每帧回调：背景绘制 + 手势追踪
// ============================================

// 五指尖 landmark 索引
const FINGER_TIPS = [4, 8, 12, 16, 20]; // 拇指、食指、中指、无名指、小指
const FINGER_MCPS = [2, 5, 9, 13, 17];
const FINGER_PIPS = [3, 6, 10, 14, 18]; // 中间关节

// 坐标平滑 — 每指独立平滑
const SMOOTH_FACTOR = 0.65; // 更高 = 更跟手（0.65 是响应速度和稳定性的最佳平衡）

// 多指追踪状态
let fingerStates = []; // [{smoothX, smoothY, pointer, id}]

function isFingerExtended(landmarks, i) {
    const tip = landmarks[FINGER_TIPS[i]];
    const pip = landmarks[FINGER_PIPS[i]];
    const mcp = landmarks[FINGER_MCPS[i]];
    if (i === 0) {
        // 拇指：指尖远离掌心
        const wrist = landmarks[0];
        return Math.abs(tip.x - wrist.x) > Math.abs(mcp.x - wrist.x) + 0.02;
    }
    // 其余手指：PIP 弯曲角度 — tip 在 pip 上方 且 pip 在 mcp 上方
    return tip.y < pip.y && pip.y < mcp.y;
}

function getFingerStates(landmarks) {
    const result = [];
    for (let i = 0; i < FINGER_TIPS.length; i++) {
        if (isFingerExtended(landmarks, i)) {
            result.push({
                id: i,
                x: landmarks[FINGER_TIPS[i]].x,
                y: landmarks[FINGER_TIPS[i]].y
            });
        }
    }
    return result;
}

function isPinching(landmarks) {
    // 捏合检测：拇指尖和食指尖距离很近，且食指必须伸直
    const thumb = landmarks[4];
    const index = landmarks[8];
    const indexMcp = landmarks[5];
    // 食指弯曲时不判定为捏合（避免误检）
    if (index.y > indexMcp.y) return false;
    const dx = thumb.x - index.x;
    const dy = thumb.y - index.y;
    return Math.sqrt(dx * dx + dy * dy) < 0.05;
}

// 五指溅射 — 一次性发射大量溅射
function fiveFingerSplash() {
    splatStack.push(parseInt(Math.random() * 15) + 10);
}

let lastSplashTime = 0;
const SPLASH_COOLDOWN = 800; // 溅射冷却 ms

function onHandResults(results) {
    // 1. 背景：摄像头画面 → 全屏模糊背景
    if (bgMode === 'camera' && cameraBgCtx) {
        cameraBgCtx.save();
        cameraBgCtx.clearRect(0, 0, cameraBg.width, cameraBg.height);
        cameraBgCtx.translate(cameraBg.width, 0);
        cameraBgCtx.scale(-1, 1);
        cameraBgCtx.drawImage(results.image, 0, 0, cameraBg.width, cameraBg.height);
        cameraBgCtx.restore();
    }

    // 2. 手势追踪
    if (!gestureEnabled) return;

    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        const landmarks = results.multiHandLandmarks[0];
        const fingers = getFingerStates(landmarks);
        const now = performance.now();

        // 五指全伸 → 溅射特效
        if (fingers.length >= 5 && now - lastSplashTime > SPLASH_COOLDOWN) {
            fiveFingerSplash();
            lastSplashTime = now;
        }

        // 捏合模式：拇指+食指捏合时只追踪食指（更精准）
        let trackFingers = fingers;
        if (isPinching(landmarks) && fingers.length > 1) {
            // 只追踪食指（id=1）
            trackFingers = fingers.filter(f => f.id === 1);
            if (trackFingers.length === 0) trackFingers = [fingers[0]]; // fallback
        }

        // 同步指针数量
        while (fingerStates.length < trackFingers.length) {
            fingerStates.push({
                smoothX: null, smoothY: null,
                pointer: new pointerPrototype(),
                id: -100 - fingerStates.length
            });
            fingerStates[fingerStates.length - 1].pointer.id = fingerStates[fingerStates.length - 1].id;
        }
        // 多余的指针抬起
        while (fingerStates.length > trackFingers.length) {
            const fs = fingerStates.pop();
            if (fs.pointer.down) updatePointerUpData(fs.pointer);
        }

        // 更新每个指针
        for (let i = 0; i < trackFingers.length; i++) {
            const fs = fingerStates[i];
            const f = trackFingers[i];

            // 指数移动平均
            if (fs.smoothX === null) {
                fs.smoothX = f.x;
                fs.smoothY = f.y;
            } else {
                fs.smoothX += (f.x - fs.smoothX) * SMOOTH_FACTOR;
                fs.smoothY += (f.y - fs.smoothY) * SMOOTH_FACTOR;
            }

            const posX = (1 - fs.smoothX) * canvas.width;
            const posY = fs.smoothY * canvas.height;

            if (!fs.pointer.down) {
                updatePointerDownData(fs.pointer, fs.id, posX, posY);
            } else {
                updatePointerMoveData(fs.pointer, posX, posY);
            }
        }
    } else {
        // 手离开画面 → 所有指针抬起
        for (const fs of fingerStates) {
            if (fs.pointer.down) updatePointerUpData(fs.pointer);
            fs.smoothX = null;
            fs.smoothY = null;
        }
    }
}

// ============================================
// 手势开关（防竞态锁）
// ============================================
let gestureToggling = false;
let gestureBtnRef = null; // 保存按钮引用，用于状态更新

function updateGestureBtnUI() {
    if (!gestureBtnRef) return;
    const nameEl = gestureBtnRef.__li.querySelector('.property-name');
    if (nameEl) {
        nameEl.textContent = t('enableGesture');
        nameEl.style.color = gestureEnabled
            ? '#34C759'
            : 'rgba(255,255,255,0.70)';
    }
    gestureBtnRef.__li.style.borderLeft = gestureEnabled
        ? '3px solid #34C759'
        : '3px solid rgba(255,255,255,0.15)';
}

async function toggleGesture() {
    if (gestureToggling) return; // 防止快速连按
    gestureToggling = true;

    gestureEnabled = !gestureEnabled;

    if (gestureEnabled) {
        const cameraReady = await prewarmCamera();
        if (!cameraReady) {
            gestureEnabled = false;
            updateGestureBtnUI();
            gestureToggling = false;
            return;
        }
        await initHands();
        if (!handsInstance) { gestureEnabled = false; gestureToggling = false; return; }
        fingerStates = [];
        await syncCamera();
    } else {
        // 抬起所有指针
        for (const fs of fingerStates) {
            if (fs.pointer.down) updatePointerUpData(fs.pointer);
        }
        fingerStates = [];
        await syncCamera();
    }

    updateGestureBtnUI();
    gestureToggling = false;
}

// Simulation section

const canvas = document.getElementById('fluidCanvas');
resizeCanvas();

let config = {
    SIM_RESOLUTION: 128,
    DYE_RESOLUTION: 1024,
    CAPTURE_RESOLUTION: 512,
    DENSITY_DISSIPATION: 1,
    VELOCITY_DISSIPATION: 0.2,
    PRESSURE: 0.8,
    PRESSURE_ITERATIONS: 20,
    CURL: 30,
    SPLAT_RADIUS: 0.25,
    SPLAT_FORCE: 6000,
    SHADING: true,
    COLORFUL: true,
    COLOR_UPDATE_SPEED: 10,
    WATER_MODE: false,
    PAUSED: false,
    BACK_COLOR: { r: 0, g: 0, b: 0 },
    TRANSPARENT: false,
    BLOOM: true,
    BLOOM_ITERATIONS: 8,
    BLOOM_RESOLUTION: 256,
    BLOOM_INTENSITY: 0.8,
    BLOOM_THRESHOLD: 0.6,
    BLOOM_SOFT_KNEE: 0.7,
    SUNRAYS: true,
    SUNRAYS_RESOLUTION: 196,
    SUNRAYS_WEIGHT: 1.0,
}

function pointerPrototype () {
    this.id = -1;
    this.texcoordX = 0;
    this.texcoordY = 0;
    this.prevTexcoordX = 0;
    this.prevTexcoordY = 0;
    this.deltaX = 0;
    this.deltaY = 0;
    this.down = false;
    this.moved = false;
    this.color = [30, 0, 300];
}

let pointers = [];
let splatStack = [];
pointers.push(new pointerPrototype());

const { gl, ext } = getWebGLContext(canvas);

if (isMobile()) {
    config.DYE_RESOLUTION = 512;
}
if (!ext.supportLinearFiltering) {
    config.DYE_RESOLUTION = 512;
    config.SHADING = false;
    config.BLOOM = false;
    config.SUNRAYS = false;
}

updatePageTexts();
try {
    startGUI();
} catch (e) {
    console.error('GUI init error:', e);
    document.title = 'ERROR: ' + e.message;
}

function getWebGLContext (canvas) {
    const params = { alpha: true, depth: false, stencil: false, antialias: false, preserveDrawingBuffer: false };

    let gl = canvas.getContext('webgl2', params);
    const isWebGL2 = !!gl;
    if (!isWebGL2)
        gl = canvas.getContext('webgl', params) || canvas.getContext('experimental-webgl', params);

    let halfFloat;
    let supportLinearFiltering;
    if (isWebGL2) {
        gl.getExtension('EXT_color_buffer_float');
        supportLinearFiltering = gl.getExtension('OES_texture_float_linear');
    } else {
        halfFloat = gl.getExtension('OES_texture_half_float');
        supportLinearFiltering = gl.getExtension('OES_texture_half_float_linear');
    }

    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    const halfFloatTexType = isWebGL2 ? gl.HALF_FLOAT : halfFloat.HALF_FLOAT_OES;
    let formatRGBA;
    let formatRG;
    let formatR;

    if (isWebGL2)
    {
        formatRGBA = getSupportedFormat(gl, gl.RGBA16F, gl.RGBA, halfFloatTexType);
        formatRG = getSupportedFormat(gl, gl.RG16F, gl.RG, halfFloatTexType);
        formatR = getSupportedFormat(gl, gl.R16F, gl.RED, halfFloatTexType);
    }
    else
    {
        formatRGBA = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
        formatRG = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
        formatR = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
    }

    return {
        gl,
        ext: {
            formatRGBA,
            formatRG,
            formatR,
            halfFloatTexType,
            supportLinearFiltering
        }
    };
}

function getSupportedFormat (gl, internalFormat, format, type)
{
    if (!supportRenderTextureFormat(gl, internalFormat, format, type))
    {
        switch (internalFormat)
        {
            case gl.R16F:
                return getSupportedFormat(gl, gl.RG16F, gl.RG, type);
            case gl.RG16F:
                return getSupportedFormat(gl, gl.RGBA16F, gl.RGBA, type);
            default:
                return null;
        }
    }

    return {
        internalFormat,
        format
    }
}

function supportRenderTextureFormat (gl, internalFormat, format, type) {
    let texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, 4, 4, 0, format, type, null);

    let fbo = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);

    let status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
    return status == gl.FRAMEBUFFER_COMPLETE;
}

function startGUI () {
    gui = new dat.GUI({ width: 320 });
    const commonFolder = gui.addFolder(t('common'));
    const advancedFolder = gui.addFolder(t('advanced'));
    commonFolder.domElement.parentElement.classList.add('fluid-common-section');
    advancedFolder.domElement.parentElement.classList.add('fluid-advanced-section');
    commonFolder.open();

    // 背景模式（从当前 bgMode 同步初始值，避免切语言后下拉失步）
    const bgModeMap = { black: 'bgBlack', white: 'bgWhite', camera: 'bgCamera' };
    let bgConfig = { mode: t(bgModeMap[bgMode] || 'bgBlack') };
    commonFolder.add(bgConfig, 'mode', [t('bgBlack'), t('bgWhite'), t('bgCamera')])
        .name(t('bgMode'))
        .onChange(v => {
            const map = { [t('bgBlack')]: 'black', [t('bgWhite')]: 'white', [t('bgCamera')]: 'camera' };
            setBgMode(map[v] || 'black');
        });

    // 水纹模式：只改变水纹颜色为极淡近透明色，不改变背景
    commonFolder.add(config, 'WATER_MODE').name(t('waterMode')).onChange(v => {
        if (v) {
            config._savedColorful = config.COLORFUL;
            config.COLORFUL = false;
        } else {
            config.COLORFUL = config._savedColorful !== undefined ? config._savedColorful : true;
        }
        // 强制刷新所有 GUI 控件显示
        for (let i = 0; i < gui.__controllers.length; i++) {
            gui.__controllers[i].updateDisplay();
        }
    });

    // 手势控制
    try {
        gestureBtnRef = commonFolder.add({ fun: function() { toggleGesture(); } }, 'fun');
        gestureBtnRef.name(t('enableGesture'));
        gestureBtnRef.__li.querySelector('.property-name').style.color = gestureEnabled
            ? '#34C759'
            : 'rgba(255,255,255,0.70)';
        gestureBtnRef.__li.style.borderLeft = gestureEnabled
            ? '3px solid #34C759'
            : '3px solid rgba(255,255,255,0.15)';
        if (!mediaPipeReady) {
            gestureBtnRef.__li.style.opacity = '0.55';
        }
    } catch (e2) {
        console.error('Gesture GUI error:', e2);
    }

    const cameraStatus = document.createElement('li');
    cameraStatus.className = 'fluid-camera-status';
    cameraStatusText = document.createElement('span');
    cameraStatusText.textContent = '';
    cameraRetryButton = document.createElement('button');
    cameraRetryButton.type = 'button';
    cameraRetryButton.textContent = t('retryCamera');
    cameraRetryButton.hidden = true;
    cameraRetryButton.addEventListener('click', async () => {
        const granted = await prewarmCamera();
        if (granted) await syncCamera();
    });
    cameraStatus.append(cameraStatusText, cameraRetryButton);
    commonFolder.__ul.appendChild(cameraStatus);

    try {
        commonFolder.add(config, 'DYE_RESOLUTION', { [t('high')]: 1024, [t('medium')]: 512, [t('low')]: 256, [t('veryLow')]: 128 }).name(t('quality')).onFinishChange(initFramebuffers);
    } catch (e3) {
        console.error('Quality GUI error:', e3);
    }
    commonFolder.add(config, 'PAUSED').name(t('paused')).listen();

    advancedFolder.add(config, 'SIM_RESOLUTION', { '32': 32, '64': 64, '128': 128, '256': 256 }).name(t('simResolution')).onFinishChange(initFramebuffers);
    advancedFolder.add(config, 'DENSITY_DISSIPATION', 0, 4.0).name(t('densityDiffusion'));
    advancedFolder.add(config, 'VELOCITY_DISSIPATION', 0, 4.0).name(t('velocityDiffusion'));
    advancedFolder.add(config, 'PRESSURE', 0.0, 1.0).name(t('pressure'));
    advancedFolder.add(config, 'CURL', 0, 50).name(t('vorticity')).step(1);
    advancedFolder.add(config, 'SPLAT_RADIUS', 0.01, 1.0).name(t('splatRadius'));
    advancedFolder.add(config, 'SHADING').name(t('shading')).onFinishChange(updateKeywords);
    advancedFolder.add(config, 'COLORFUL').name(t('colorful'));

    advancedFolder.add({ fun: () => {
        splatStack.push(parseInt(Math.random() * 20) + 5);
    } }, 'fun').name(t('randomSplats'));

    let bloomFolder = advancedFolder.addFolder(t('bloom'));
    bloomFolder.add(config, 'BLOOM').name(t('enabled')).onFinishChange(updateKeywords);
    bloomFolder.add(config, 'BLOOM_INTENSITY', 0.1, 2.0).name(t('intensity'));
    bloomFolder.add(config, 'BLOOM_THRESHOLD', 0.0, 1.0).name(t('threshold'));

    let sunraysFolder = advancedFolder.addFolder(t('sunrays'));
    sunraysFolder.add(config, 'SUNRAYS').name(t('enabled')).onFinishChange(updateKeywords);
    sunraysFolder.add(config, 'SUNRAYS_WEIGHT', 0.3, 1.0).name(t('weight'));

    let captureFolder = advancedFolder.addFolder(t('capture'));
    captureFolder.addColor(config, 'BACK_COLOR').name(t('bgColor'));
    captureFolder.add({ fun: captureScreenshot }, 'fun').name(t('screenshot'));

    let github = advancedFolder.add({ fun : () => {
        window.open('https://github.com/Meteorkid/webgl-fluid-sim');
    } }, 'fun').name('Github');
    github.__li.className = 'cr function bigFont';
    github.__li.style.borderLeft = '3px solid #8C8C8C';
    let githubIcon = document.createElement('span');
    github.domElement.parentElement.appendChild(githubIcon);
    githubIcon.className = 'icon github';

    // 快捷键提示
    let shortcutText = currentLang === 'zh'
        ? '⌨ H:面板 G:手势 P:暂停 空格:溅射'
        : '⌨ H:Panel G:Gesture P:Pause Space:Splat';
    let shortcuts = advancedFolder.add({ fun: () => {} }, 'fun').name(shortcutText);
    shortcuts.__li.className = 'cr function bigFont';
    shortcuts.__li.style.borderLeft = '3px solid rgba(255,255,255,0.08)';
    shortcuts.__li.style.cursor = 'default';
    shortcuts.__li.style.opacity = '0.6';

    setupControlPanelChrome();
}

function isMobile () {
    return /Mobi|Android/i.test(navigator.userAgent);
}

function captureScreenshot () {
    let res = getResolution(config.CAPTURE_RESOLUTION);
    let target = createFBO(res.width, res.height, ext.formatRGBA.internalFormat, ext.formatRGBA.format, ext.halfFloatTexType, gl.NEAREST);
    render(target);

    let texture = framebufferToTexture(target);
    texture = normalizeTexture(texture, target.width, target.height);

    let captureCanvas = textureToCanvas(texture, target.width, target.height);
    let datauri = captureCanvas.toDataURL();
    downloadURI('fluid.png', datauri);
}

function framebufferToTexture (target) {
    gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo);
    let length = target.width * target.height * 4;
    let texture = new Float32Array(length);
    gl.readPixels(0, 0, target.width, target.height, gl.RGBA, gl.FLOAT, texture);
    return texture;
}

function normalizeTexture (texture, width, height) {
    let result = new Uint8Array(texture.length);
    let id = 0;
    for (let i = height - 1; i >= 0; i--) {
        for (let j = 0; j < width; j++) {
            let nid = i * width * 4 + j * 4;
            result[nid + 0] = clamp01(texture[id + 0]) * 255;
            result[nid + 1] = clamp01(texture[id + 1]) * 255;
            result[nid + 2] = clamp01(texture[id + 2]) * 255;
            result[nid + 3] = clamp01(texture[id + 3]) * 255;
            id += 4;
        }
    }
    return result;
}

function clamp01 (input) {
    return Math.min(Math.max(input, 0), 1);
}

function textureToCanvas (texture, width, height) {
    let captureCanvas = document.createElement('canvas');
    let ctx = captureCanvas.getContext('2d');
    captureCanvas.width = width;
    captureCanvas.height = height;

    let imageData = ctx.createImageData(width, height);
    imageData.data.set(texture);
    ctx.putImageData(imageData, 0, 0);

    return captureCanvas;
}

function downloadURI (filename, uri) {
    let link = document.createElement('a');
    link.download = filename;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

class Material {
    constructor (vertexShader, fragmentShaderSource) {
        this.vertexShader = vertexShader;
        this.fragmentShaderSource = fragmentShaderSource;
        this.programs = [];
        this.activeProgram = null;
        this.uniforms = [];
    }

    setKeywords (keywords) {
        let hash = 0;
        for (let i = 0; i < keywords.length; i++)
            hash += hashCode(keywords[i]);

        let program = this.programs[hash];
        if (program == null)
        {
            let fragmentShader = compileShader(gl.FRAGMENT_SHADER, this.fragmentShaderSource, keywords);
            program = createProgram(this.vertexShader, fragmentShader);
            this.programs[hash] = program;
        }

        if (program == this.activeProgram) return;

        this.uniforms = getUniforms(program);
        this.activeProgram = program;
    }

    bind () {
        gl.useProgram(this.activeProgram);
    }
}

class Program {
    constructor (vertexShader, fragmentShader) {
        this.uniforms = {};
        this.program = createProgram(vertexShader, fragmentShader);
        this.uniforms = getUniforms(this.program);
    }

    bind () {
        gl.useProgram(this.program);
    }
}

function createProgram (vertexShader, fragmentShader) {
    let program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS))
        console.trace(gl.getProgramInfoLog(program));

    return program;
}

function getUniforms (program) {
    let uniforms = [];
    let uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
    for (let i = 0; i < uniformCount; i++) {
        let uniformName = gl.getActiveUniform(program, i).name;
        uniforms[uniformName] = gl.getUniformLocation(program, uniformName);
    }
    return uniforms;
}

function compileShader (type, source, keywords) {
    source = addKeywords(source, keywords);

    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
        console.trace(gl.getShaderInfoLog(shader));

    return shader;
};

function addKeywords (source, keywords) {
    if (keywords == null) return source;
    let keywordsString = '';
    keywords.forEach(keyword => {
        keywordsString += '#define ' + keyword + '\n';
    });
    return keywordsString + source;
}

const baseVertexShader = compileShader(gl.VERTEX_SHADER, `
    precision highp float;

    attribute vec2 aPosition;
    varying vec2 vUv;
    varying vec2 vL;
    varying vec2 vR;
    varying vec2 vT;
    varying vec2 vB;
    uniform vec2 texelSize;

    void main () {
        vUv = aPosition * 0.5 + 0.5;
        vL = vUv - vec2(texelSize.x, 0.0);
        vR = vUv + vec2(texelSize.x, 0.0);
        vT = vUv + vec2(0.0, texelSize.y);
        vB = vUv - vec2(0.0, texelSize.y);
        gl_Position = vec4(aPosition, 0.0, 1.0);
    }
`);

const blurVertexShader = compileShader(gl.VERTEX_SHADER, `
    precision highp float;

    attribute vec2 aPosition;
    varying vec2 vUv;
    varying vec2 vL;
    varying vec2 vR;
    uniform vec2 texelSize;

    void main () {
        vUv = aPosition * 0.5 + 0.5;
        float offset = 1.33333333;
        vL = vUv - texelSize * offset;
        vR = vUv + texelSize * offset;
        gl_Position = vec4(aPosition, 0.0, 1.0);
    }
`);

const blurShader = compileShader(gl.FRAGMENT_SHADER, `
    precision mediump float;
    precision mediump sampler2D;

    varying vec2 vUv;
    varying vec2 vL;
    varying vec2 vR;
    uniform sampler2D uTexture;

    void main () {
        vec4 sum = texture2D(uTexture, vUv) * 0.29411764;
        sum += texture2D(uTexture, vL) * 0.35294117;
        sum += texture2D(uTexture, vR) * 0.35294117;
        gl_FragColor = sum;
    }
`);

const copyShader = compileShader(gl.FRAGMENT_SHADER, `
    precision mediump float;
    precision mediump sampler2D;

    varying highp vec2 vUv;
    uniform sampler2D uTexture;

    void main () {
        gl_FragColor = texture2D(uTexture, vUv);
    }
`);

const clearShader = compileShader(gl.FRAGMENT_SHADER, `
    precision mediump float;
    precision mediump sampler2D;

    varying highp vec2 vUv;
    uniform sampler2D uTexture;
    uniform float value;

    void main () {
        gl_FragColor = value * texture2D(uTexture, vUv);
    }
`);

const colorShader = compileShader(gl.FRAGMENT_SHADER, `
    precision mediump float;

    uniform vec4 color;

    void main () {
        gl_FragColor = color;
    }
`);

const checkerboardShader = compileShader(gl.FRAGMENT_SHADER, `
    precision highp float;
    precision highp sampler2D;

    varying vec2 vUv;
    uniform sampler2D uTexture;
    uniform float aspectRatio;

    #define SCALE 25.0

    void main () {
        vec2 uv = floor(vUv * SCALE * vec2(aspectRatio, 1.0));
        float v = mod(uv.x + uv.y, 2.0);
        v = v * 0.1 + 0.8;
        gl_FragColor = vec4(vec3(v), 1.0);
    }
`);

const displayShaderSource = `
    precision highp float;
    precision highp sampler2D;

    varying vec2 vUv;
    varying vec2 vL;
    varying vec2 vR;
    varying vec2 vT;
    varying vec2 vB;
    uniform sampler2D uTexture;
    uniform sampler2D uBloom;
    uniform sampler2D uSunrays;
    uniform sampler2D uDithering;
    uniform vec2 ditherScale;
    uniform vec2 texelSize;

    vec3 linearToGamma (vec3 color) {
        color = max(color, vec3(0));
        return max(1.055 * pow(color, vec3(0.416666667)) - 0.055, vec3(0));
    }

    void main () {
        vec3 c = texture2D(uTexture, vUv).rgb;

    #ifdef SHADING
        vec3 lc = texture2D(uTexture, vL).rgb;
        vec3 rc = texture2D(uTexture, vR).rgb;
        vec3 tc = texture2D(uTexture, vT).rgb;
        vec3 bc = texture2D(uTexture, vB).rgb;

        float dx = length(rc) - length(lc);
        float dy = length(tc) - length(bc);

        vec3 n = normalize(vec3(dx, dy, length(texelSize)));
        vec3 l = vec3(0.0, 0.0, 1.0);

        float diffuse = clamp(dot(n, l) + 0.7, 0.7, 1.0);
        c *= diffuse;
    #endif

    #ifdef BLOOM
        vec3 bloom = texture2D(uBloom, vUv).rgb;
    #endif

    #ifdef SUNRAYS
        float sunrays = texture2D(uSunrays, vUv).r;
        c *= sunrays;
    #ifdef BLOOM
        bloom *= sunrays;
    #endif
    #endif

    #ifdef BLOOM
        float noise = texture2D(uDithering, vUv * ditherScale).r;
        noise = noise * 2.0 - 1.0;
        bloom += noise / 255.0;
        bloom = linearToGamma(bloom);
        c += bloom;
    #endif

        float a = max(c.r, max(c.g, c.b));
        gl_FragColor = vec4(c, a);
    }
`;

const bloomPrefilterShader = compileShader(gl.FRAGMENT_SHADER, `
    precision mediump float;
    precision mediump sampler2D;

    varying vec2 vUv;
    uniform sampler2D uTexture;
    uniform vec3 curve;
    uniform float threshold;

    void main () {
        vec3 c = texture2D(uTexture, vUv).rgb;
        float br = max(c.r, max(c.g, c.b));
        float rq = clamp(br - curve.x, 0.0, curve.y);
        rq = curve.z * rq * rq;
        c *= max(rq, br - threshold) / max(br, 0.0001);
        gl_FragColor = vec4(c, 0.0);
    }
`);

const bloomBlurShader = compileShader(gl.FRAGMENT_SHADER, `
    precision mediump float;
    precision mediump sampler2D;

    varying vec2 vL;
    varying vec2 vR;
    varying vec2 vT;
    varying vec2 vB;
    uniform sampler2D uTexture;

    void main () {
        vec4 sum = vec4(0.0);
        sum += texture2D(uTexture, vL);
        sum += texture2D(uTexture, vR);
        sum += texture2D(uTexture, vT);
        sum += texture2D(uTexture, vB);
        sum *= 0.25;
        gl_FragColor = sum;
    }
`);

const bloomFinalShader = compileShader(gl.FRAGMENT_SHADER, `
    precision mediump float;
    precision mediump sampler2D;

    varying vec2 vL;
    varying vec2 vR;
    varying vec2 vT;
    varying vec2 vB;
    uniform sampler2D uTexture;
    uniform float intensity;

    void main () {
        vec4 sum = vec4(0.0);
        sum += texture2D(uTexture, vL);
        sum += texture2D(uTexture, vR);
        sum += texture2D(uTexture, vT);
        sum += texture2D(uTexture, vB);
        sum *= 0.25;
        gl_FragColor = sum * intensity;
    }
`);

const sunraysMaskShader = compileShader(gl.FRAGMENT_SHADER, `
    precision highp float;
    precision highp sampler2D;

    varying vec2 vUv;
    uniform sampler2D uTexture;

    void main () {
        vec4 c = texture2D(uTexture, vUv);
        float br = max(c.r, max(c.g, c.b));
        c.a = 1.0 - min(max(br * 20.0, 0.0), 0.8);
        gl_FragColor = c;
    }
`);

const sunraysShader = compileShader(gl.FRAGMENT_SHADER, `
    precision highp float;
    precision highp sampler2D;

    varying vec2 vUv;
    uniform sampler2D uTexture;
    uniform float weight;

    #define ITERATIONS 16

    void main () {
        float Density = 0.3;
        float Decay = 0.95;
        float Exposure = 0.7;

        vec2 coord = vUv;
        vec2 dir = vUv - 0.5;

        dir *= 1.0 / float(ITERATIONS) * Density;
        float illuminationDecay = 1.0;

        float color = texture2D(uTexture, vUv).a;

        for (int i = 0; i < ITERATIONS; i++)
        {
            coord -= dir;
            float col = texture2D(uTexture, coord).a;
            color += col * illuminationDecay * weight;
            illuminationDecay *= Decay;
        }

        gl_FragColor = vec4(color * Exposure, 0.0, 0.0, 1.0);
    }
`);

const splatShader = compileShader(gl.FRAGMENT_SHADER, `
    precision highp float;
    precision highp sampler2D;

    varying vec2 vUv;
    uniform sampler2D uTarget;
    uniform float aspectRatio;
    uniform vec3 color;
    uniform vec2 point;
    uniform float radius;

    void main () {
        vec2 p = vUv - point.xy;
        p.x *= aspectRatio;
        vec3 splat = exp(-dot(p, p) / radius) * color;
        vec3 base = texture2D(uTarget, vUv).xyz;
        gl_FragColor = vec4(base + splat, 1.0);
    }
`);

const advectionShader = compileShader(gl.FRAGMENT_SHADER, `
    precision highp float;
    precision highp sampler2D;

    varying vec2 vUv;
    uniform sampler2D uVelocity;
    uniform sampler2D uSource;
    uniform vec2 texelSize;
    uniform vec2 dyeTexelSize;
    uniform float dt;
    uniform float dissipation;

    vec4 bilerp (sampler2D sam, vec2 uv, vec2 tsize) {
        vec2 st = uv / tsize - 0.5;

        vec2 iuv = floor(st);
        vec2 fuv = fract(st);

        vec4 a = texture2D(sam, (iuv + vec2(0.5, 0.5)) * tsize);
        vec4 b = texture2D(sam, (iuv + vec2(1.5, 0.5)) * tsize);
        vec4 c = texture2D(sam, (iuv + vec2(0.5, 1.5)) * tsize);
        vec4 d = texture2D(sam, (iuv + vec2(1.5, 1.5)) * tsize);

        return mix(mix(a, b, fuv.x), mix(c, d, fuv.x), fuv.y);
    }

    void main () {
    #ifdef MANUAL_FILTERING
        vec2 coord = vUv - dt * bilerp(uVelocity, vUv, texelSize).xy * texelSize;
        vec4 result = bilerp(uSource, coord, dyeTexelSize);
    #else
        vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
        vec4 result = texture2D(uSource, coord);
    #endif
        float decay = 1.0 + dissipation * dt;
        gl_FragColor = result / decay;
    }`,
    ext.supportLinearFiltering ? null : ['MANUAL_FILTERING']
);

const divergenceShader = compileShader(gl.FRAGMENT_SHADER, `
    precision mediump float;
    precision mediump sampler2D;

    varying highp vec2 vUv;
    varying highp vec2 vL;
    varying highp vec2 vR;
    varying highp vec2 vT;
    varying highp vec2 vB;
    uniform sampler2D uVelocity;

    void main () {
        float L = texture2D(uVelocity, vL).x;
        float R = texture2D(uVelocity, vR).x;
        float T = texture2D(uVelocity, vT).y;
        float B = texture2D(uVelocity, vB).y;

        vec2 C = texture2D(uVelocity, vUv).xy;
        if (vL.x < 0.0) { L = -C.x; }
        if (vR.x > 1.0) { R = -C.x; }
        if (vT.y > 1.0) { T = -C.y; }
        if (vB.y < 0.0) { B = -C.y; }

        float div = 0.5 * (R - L + T - B);
        gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
    }
`);

const curlShader = compileShader(gl.FRAGMENT_SHADER, `
    precision mediump float;
    precision mediump sampler2D;

    varying highp vec2 vUv;
    varying highp vec2 vL;
    varying highp vec2 vR;
    varying highp vec2 vT;
    varying highp vec2 vB;
    uniform sampler2D uVelocity;

    void main () {
        float L = texture2D(uVelocity, vL).y;
        float R = texture2D(uVelocity, vR).y;
        float T = texture2D(uVelocity, vT).x;
        float B = texture2D(uVelocity, vB).x;
        float vorticity = R - L - T + B;
        gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
    }
`);

const vorticityShader = compileShader(gl.FRAGMENT_SHADER, `
    precision highp float;
    precision highp sampler2D;

    varying vec2 vUv;
    varying vec2 vL;
    varying vec2 vR;
    varying vec2 vT;
    varying vec2 vB;
    uniform sampler2D uVelocity;
    uniform sampler2D uCurl;
    uniform float curl;
    uniform float dt;

    void main () {
        float L = texture2D(uCurl, vL).x;
        float R = texture2D(uCurl, vR).x;
        float T = texture2D(uCurl, vT).x;
        float B = texture2D(uCurl, vB).x;
        float C = texture2D(uCurl, vUv).x;

        vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
        force /= length(force) + 0.0001;
        force *= curl * C;
        force.y *= -1.0;

        vec2 velocity = texture2D(uVelocity, vUv).xy;
        velocity += force * dt;
        velocity = min(max(velocity, -1000.0), 1000.0);
        gl_FragColor = vec4(velocity, 0.0, 1.0);
    }
`);

const pressureShader = compileShader(gl.FRAGMENT_SHADER, `
    precision mediump float;
    precision mediump sampler2D;

    varying highp vec2 vUv;
    varying highp vec2 vL;
    varying highp vec2 vR;
    varying highp vec2 vT;
    varying highp vec2 vB;
    uniform sampler2D uPressure;
    uniform sampler2D uDivergence;

    void main () {
        float L = texture2D(uPressure, vL).x;
        float R = texture2D(uPressure, vR).x;
        float T = texture2D(uPressure, vT).x;
        float B = texture2D(uPressure, vB).x;
        float C = texture2D(uPressure, vUv).x;
        float divergence = texture2D(uDivergence, vUv).x;
        float pressure = (L + R + B + T - divergence) * 0.25;
        gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
    }
`);

const gradientSubtractShader = compileShader(gl.FRAGMENT_SHADER, `
    precision mediump float;
    precision mediump sampler2D;

    varying highp vec2 vUv;
    varying highp vec2 vL;
    varying highp vec2 vR;
    varying highp vec2 vT;
    varying highp vec2 vB;
    uniform sampler2D uPressure;
    uniform sampler2D uVelocity;

    void main () {
        float L = texture2D(uPressure, vL).x;
        float R = texture2D(uPressure, vR).x;
        float T = texture2D(uPressure, vT).x;
        float B = texture2D(uPressure, vB).x;
        vec2 velocity = texture2D(uVelocity, vUv).xy;
        velocity.xy -= vec2(R - L, T - B);
        gl_FragColor = vec4(velocity, 0.0, 1.0);
    }
`);

const blit = (() => {
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(0);

    return (target, clear = false) => {
        if (target == null)
        {
            gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        }
        else
        {
            gl.viewport(0, 0, target.width, target.height);
            gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo);
        }
        if (clear)
        {
            gl.clearColor(0.0, 0.0, 0.0, 1.0);
            gl.clear(gl.COLOR_BUFFER_BIT);
        }
        // CHECK_FRAMEBUFFER_STATUS();
        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
    }
})();

function CHECK_FRAMEBUFFER_STATUS () {
    let status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
    if (status != gl.FRAMEBUFFER_COMPLETE)
        console.trace("Framebuffer error: " + status);
}

let dye;
let velocity;
let divergence;
let curl;
let pressure;
let bloom;
let bloomFramebuffers = [];
let sunrays;
let sunraysTemp;

let ditheringTexture = createTextureAsync('LDR_LLL1_0.png');

const blurProgram            = new Program(blurVertexShader, blurShader);
const copyProgram            = new Program(baseVertexShader, copyShader);
const clearProgram           = new Program(baseVertexShader, clearShader);
const colorProgram           = new Program(baseVertexShader, colorShader);
const checkerboardProgram    = new Program(baseVertexShader, checkerboardShader);
const bloomPrefilterProgram  = new Program(baseVertexShader, bloomPrefilterShader);
const bloomBlurProgram       = new Program(baseVertexShader, bloomBlurShader);
const bloomFinalProgram      = new Program(baseVertexShader, bloomFinalShader);
const sunraysMaskProgram     = new Program(baseVertexShader, sunraysMaskShader);
const sunraysProgram         = new Program(baseVertexShader, sunraysShader);
const splatProgram           = new Program(baseVertexShader, splatShader);
const advectionProgram       = new Program(baseVertexShader, advectionShader);
const divergenceProgram      = new Program(baseVertexShader, divergenceShader);
const curlProgram            = new Program(baseVertexShader, curlShader);
const vorticityProgram       = new Program(baseVertexShader, vorticityShader);
const pressureProgram        = new Program(baseVertexShader, pressureShader);
const gradienSubtractProgram = new Program(baseVertexShader, gradientSubtractShader);

const displayMaterial = new Material(baseVertexShader, displayShaderSource);

function initFramebuffers () {
    let simRes = getResolution(config.SIM_RESOLUTION);
    let dyeRes = getResolution(config.DYE_RESOLUTION);

    const texType = ext.halfFloatTexType;
    const rgba    = ext.formatRGBA;
    const rg      = ext.formatRG;
    const r       = ext.formatR;
    const filtering = ext.supportLinearFiltering ? gl.LINEAR : gl.NEAREST;

    gl.disable(gl.BLEND);

    if (dye == null)
        dye = createDoubleFBO(dyeRes.width, dyeRes.height, rgba.internalFormat, rgba.format, texType, filtering);
    else
        dye = resizeDoubleFBO(dye, dyeRes.width, dyeRes.height, rgba.internalFormat, rgba.format, texType, filtering);

    if (velocity == null)
        velocity = createDoubleFBO(simRes.width, simRes.height, rg.internalFormat, rg.format, texType, filtering);
    else
        velocity = resizeDoubleFBO(velocity, simRes.width, simRes.height, rg.internalFormat, rg.format, texType, filtering);

    divergence = createFBO      (simRes.width, simRes.height, r.internalFormat, r.format, texType, gl.NEAREST);
    curl       = createFBO      (simRes.width, simRes.height, r.internalFormat, r.format, texType, gl.NEAREST);
    pressure   = createDoubleFBO(simRes.width, simRes.height, r.internalFormat, r.format, texType, gl.NEAREST);

    initBloomFramebuffers();
    initSunraysFramebuffers();
}

function initBloomFramebuffers () {
    let res = getResolution(config.BLOOM_RESOLUTION);

    const texType = ext.halfFloatTexType;
    const rgba = ext.formatRGBA;
    const filtering = ext.supportLinearFiltering ? gl.LINEAR : gl.NEAREST;

    bloom = createFBO(res.width, res.height, rgba.internalFormat, rgba.format, texType, filtering);

    bloomFramebuffers.length = 0;
    for (let i = 0; i < config.BLOOM_ITERATIONS; i++)
    {
        let width = res.width >> (i + 1);
        let height = res.height >> (i + 1);

        if (width < 2 || height < 2) break;

        let fbo = createFBO(width, height, rgba.internalFormat, rgba.format, texType, filtering);
        bloomFramebuffers.push(fbo);
    }
}

function initSunraysFramebuffers () {
    let res = getResolution(config.SUNRAYS_RESOLUTION);

    const texType = ext.halfFloatTexType;
    const r = ext.formatR;
    const filtering = ext.supportLinearFiltering ? gl.LINEAR : gl.NEAREST;

    sunrays     = createFBO(res.width, res.height, r.internalFormat, r.format, texType, filtering);
    sunraysTemp = createFBO(res.width, res.height, r.internalFormat, r.format, texType, filtering);
}

function createFBO (w, h, internalFormat, format, type, param) {
    gl.activeTexture(gl.TEXTURE0);
    let texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, param);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, param);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, w, h, 0, format, type, null);

    let fbo = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    gl.viewport(0, 0, w, h);
    gl.clear(gl.COLOR_BUFFER_BIT);

    let texelSizeX = 1.0 / w;
    let texelSizeY = 1.0 / h;

    return {
        texture,
        fbo,
        width: w,
        height: h,
        texelSizeX,
        texelSizeY,
        attach (id) {
            gl.activeTexture(gl.TEXTURE0 + id);
            gl.bindTexture(gl.TEXTURE_2D, texture);
            return id;
        }
    };
}

function createDoubleFBO (w, h, internalFormat, format, type, param) {
    let fbo1 = createFBO(w, h, internalFormat, format, type, param);
    let fbo2 = createFBO(w, h, internalFormat, format, type, param);

    return {
        width: w,
        height: h,
        texelSizeX: fbo1.texelSizeX,
        texelSizeY: fbo1.texelSizeY,
        get read () {
            return fbo1;
        },
        set read (value) {
            fbo1 = value;
        },
        get write () {
            return fbo2;
        },
        set write (value) {
            fbo2 = value;
        },
        swap () {
            let temp = fbo1;
            fbo1 = fbo2;
            fbo2 = temp;
        }
    }
}

function resizeFBO (target, w, h, internalFormat, format, type, param) {
    let newFBO = createFBO(w, h, internalFormat, format, type, param);
    copyProgram.bind();
    gl.uniform1i(copyProgram.uniforms.uTexture, target.attach(0));
    blit(newFBO);
    return newFBO;
}

function resizeDoubleFBO (target, w, h, internalFormat, format, type, param) {
    if (target.width == w && target.height == h)
        return target;
    target.read = resizeFBO(target.read, w, h, internalFormat, format, type, param);
    target.write = createFBO(w, h, internalFormat, format, type, param);
    target.width = w;
    target.height = h;
    target.texelSizeX = 1.0 / w;
    target.texelSizeY = 1.0 / h;
    return target;
}

function createTextureAsync (url) {
    let texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, 1, 1, 0, gl.RGB, gl.UNSIGNED_BYTE, new Uint8Array([255, 255, 255]));

    let obj = {
        texture,
        width: 1,
        height: 1,
        attach (id) {
            gl.activeTexture(gl.TEXTURE0 + id);
            gl.bindTexture(gl.TEXTURE_2D, texture);
            return id;
        }
    };

    let image = new Image();
    image.onload = () => {
        obj.width = image.width;
        obj.height = image.height;
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    };
    image.src = url;

    return obj;
}

function updateKeywords () {
    let displayKeywords = [];
    if (config.SHADING) displayKeywords.push("SHADING");
    if (config.BLOOM) displayKeywords.push("BLOOM");
    if (config.SUNRAYS) displayKeywords.push("SUNRAYS");
    displayMaterial.setKeywords(displayKeywords);
}

updateKeywords();
initFramebuffers();
multipleSplats(parseInt(Math.random() * 20) + 5);

let lastUpdateTime = Date.now();
let colorUpdateTimer = 0.0;
update();

function update () {
    const dt = calcDeltaTime();
    if (resizeCanvas())
        initFramebuffers();
    updateColors(dt);
    applyInputs();
    if (!config.PAUSED)
        step(dt);
    render(null);
    rafId = requestAnimationFrame(update);
}

function calcDeltaTime () {
    let now = Date.now();
    let dt = (now - lastUpdateTime) / 1000;
    dt = Math.min(dt, 0.016666);
    lastUpdateTime = now;
    return dt;
}

function resizeCanvas () {
    let width = scaleByPixelRatio(canvas.clientWidth);
    let height = scaleByPixelRatio(canvas.clientHeight);
    if (canvas.width != width || canvas.height != height) {
        canvas.width = width;
        canvas.height = height;
        return true;
    }
    return false;
}

function updateColors (dt) {
    if (!config.COLORFUL) return;

    colorUpdateTimer += dt * config.COLOR_UPDATE_SPEED;
    if (colorUpdateTimer >= 1) {
        colorUpdateTimer = wrap(colorUpdateTimer, 0, 1);
        pointers.forEach(p => {
            p.color = generateColor();
        });
        fingerStates.forEach(fs => { fs.pointer.color = generateColor(); });
    }
}

function applyInputs () {
    if (splatStack.length > 0)
        multipleSplats(splatStack.pop());

    pointers.forEach(p => {
        if (p.moved) {
            p.moved = false;
            splatPointer(p);
        }
    });

    // 手势多指独立处理（不在 pointers 数组中）
    fingerStates.forEach(fs => {
        if (fs.pointer.moved) {
            fs.pointer.moved = false;
            splatPointer(fs.pointer);
        }
    });
}

function step (dt) {
    gl.disable(gl.BLEND);

    curlProgram.bind();
    gl.uniform2f(curlProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
    gl.uniform1i(curlProgram.uniforms.uVelocity, velocity.read.attach(0));
    blit(curl);

    vorticityProgram.bind();
    gl.uniform2f(vorticityProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
    gl.uniform1i(vorticityProgram.uniforms.uVelocity, velocity.read.attach(0));
    gl.uniform1i(vorticityProgram.uniforms.uCurl, curl.attach(1));
    gl.uniform1f(vorticityProgram.uniforms.curl, config.CURL);
    gl.uniform1f(vorticityProgram.uniforms.dt, dt);
    blit(velocity.write);
    velocity.swap();

    divergenceProgram.bind();
    gl.uniform2f(divergenceProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
    gl.uniform1i(divergenceProgram.uniforms.uVelocity, velocity.read.attach(0));
    blit(divergence);

    clearProgram.bind();
    gl.uniform1i(clearProgram.uniforms.uTexture, pressure.read.attach(0));
    gl.uniform1f(clearProgram.uniforms.value, config.PRESSURE);
    blit(pressure.write);
    pressure.swap();

    pressureProgram.bind();
    gl.uniform2f(pressureProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
    gl.uniform1i(pressureProgram.uniforms.uDivergence, divergence.attach(0));
    for (let i = 0; i < config.PRESSURE_ITERATIONS; i++) {
        gl.uniform1i(pressureProgram.uniforms.uPressure, pressure.read.attach(1));
        blit(pressure.write);
        pressure.swap();
    }

    gradienSubtractProgram.bind();
    gl.uniform2f(gradienSubtractProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
    gl.uniform1i(gradienSubtractProgram.uniforms.uPressure, pressure.read.attach(0));
    gl.uniform1i(gradienSubtractProgram.uniforms.uVelocity, velocity.read.attach(1));
    blit(velocity.write);
    velocity.swap();

    advectionProgram.bind();
    gl.uniform2f(advectionProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
    if (!ext.supportLinearFiltering)
        gl.uniform2f(advectionProgram.uniforms.dyeTexelSize, velocity.texelSizeX, velocity.texelSizeY);
    let velocityId = velocity.read.attach(0);
    gl.uniform1i(advectionProgram.uniforms.uVelocity, velocityId);
    gl.uniform1i(advectionProgram.uniforms.uSource, velocityId);
    gl.uniform1f(advectionProgram.uniforms.dt, dt);
    gl.uniform1f(advectionProgram.uniforms.dissipation, config.VELOCITY_DISSIPATION);
    blit(velocity.write);
    velocity.swap();

    if (!ext.supportLinearFiltering)
        gl.uniform2f(advectionProgram.uniforms.dyeTexelSize, dye.texelSizeX, dye.texelSizeY);
    gl.uniform1i(advectionProgram.uniforms.uVelocity, velocity.read.attach(0));
    gl.uniform1i(advectionProgram.uniforms.uSource, dye.read.attach(1));
    gl.uniform1f(advectionProgram.uniforms.dissipation, config.DENSITY_DISSIPATION);
    blit(dye.write);
    dye.swap();
}

function render (target) {
    if (config.BLOOM)
        applyBloom(dye.read, bloom);
    if (config.SUNRAYS) {
        applySunrays(dye.read, dye.write, sunrays);
        blur(sunrays, sunraysTemp, 1);
    }

    if (target == null || !config.TRANSPARENT) {
        gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
        gl.enable(gl.BLEND);
    }
    else {
        gl.disable(gl.BLEND);
    }

    if (!config.TRANSPARENT)
        drawColor(target, normalizeColor(config.BACK_COLOR));
    drawDisplay(target);
}

function drawColor (target, color) {
    colorProgram.bind();
    gl.uniform4f(colorProgram.uniforms.color, color.r, color.g, color.b, 1);
    blit(target);
}

function drawCheckerboard (target) {
    checkerboardProgram.bind();
    gl.uniform1f(checkerboardProgram.uniforms.aspectRatio, canvas.width / canvas.height);
    blit(target);
}

function drawDisplay (target) {
    let width = target == null ? gl.drawingBufferWidth : target.width;
    let height = target == null ? gl.drawingBufferHeight : target.height;

    displayMaterial.bind();
    if (config.SHADING)
        gl.uniform2f(displayMaterial.uniforms.texelSize, 1.0 / width, 1.0 / height);
    gl.uniform1i(displayMaterial.uniforms.uTexture, dye.read.attach(0));
    if (config.BLOOM) {
        gl.uniform1i(displayMaterial.uniforms.uBloom, bloom.attach(1));
        gl.uniform1i(displayMaterial.uniforms.uDithering, ditheringTexture.attach(2));
        let scale = getTextureScale(ditheringTexture, width, height);
        gl.uniform2f(displayMaterial.uniforms.ditherScale, scale.x, scale.y);
    }
    if (config.SUNRAYS)
        gl.uniform1i(displayMaterial.uniforms.uSunrays, sunrays.attach(3));
    blit(target);
}

function applyBloom (source, destination) {
    if (bloomFramebuffers.length < 2)
        return;

    let last = destination;

    gl.disable(gl.BLEND);
    bloomPrefilterProgram.bind();
    let knee = config.BLOOM_THRESHOLD * config.BLOOM_SOFT_KNEE + 0.0001;
    let curve0 = config.BLOOM_THRESHOLD - knee;
    let curve1 = knee * 2;
    let curve2 = 0.25 / knee;
    gl.uniform3f(bloomPrefilterProgram.uniforms.curve, curve0, curve1, curve2);
    gl.uniform1f(bloomPrefilterProgram.uniforms.threshold, config.BLOOM_THRESHOLD);
    gl.uniform1i(bloomPrefilterProgram.uniforms.uTexture, source.attach(0));
    blit(last);

    bloomBlurProgram.bind();
    for (let i = 0; i < bloomFramebuffers.length; i++) {
        let dest = bloomFramebuffers[i];
        gl.uniform2f(bloomBlurProgram.uniforms.texelSize, last.texelSizeX, last.texelSizeY);
        gl.uniform1i(bloomBlurProgram.uniforms.uTexture, last.attach(0));
        blit(dest);
        last = dest;
    }

    gl.blendFunc(gl.ONE, gl.ONE);
    gl.enable(gl.BLEND);

    for (let i = bloomFramebuffers.length - 2; i >= 0; i--) {
        let baseTex = bloomFramebuffers[i];
        gl.uniform2f(bloomBlurProgram.uniforms.texelSize, last.texelSizeX, last.texelSizeY);
        gl.uniform1i(bloomBlurProgram.uniforms.uTexture, last.attach(0));
        gl.viewport(0, 0, baseTex.width, baseTex.height);
        blit(baseTex);
        last = baseTex;
    }

    gl.disable(gl.BLEND);
    bloomFinalProgram.bind();
    gl.uniform2f(bloomFinalProgram.uniforms.texelSize, last.texelSizeX, last.texelSizeY);
    gl.uniform1i(bloomFinalProgram.uniforms.uTexture, last.attach(0));
    gl.uniform1f(bloomFinalProgram.uniforms.intensity, config.BLOOM_INTENSITY);
    blit(destination);
}

function applySunrays (source, mask, destination) {
    gl.disable(gl.BLEND);
    sunraysMaskProgram.bind();
    gl.uniform1i(sunraysMaskProgram.uniforms.uTexture, source.attach(0));
    blit(mask);

    sunraysProgram.bind();
    gl.uniform1f(sunraysProgram.uniforms.weight, config.SUNRAYS_WEIGHT);
    gl.uniform1i(sunraysProgram.uniforms.uTexture, mask.attach(0));
    blit(destination);
}

function blur (target, temp, iterations) {
    blurProgram.bind();
    for (let i = 0; i < iterations; i++) {
        gl.uniform2f(blurProgram.uniforms.texelSize, target.texelSizeX, 0.0);
        gl.uniform1i(blurProgram.uniforms.uTexture, target.attach(0));
        blit(temp);

        gl.uniform2f(blurProgram.uniforms.texelSize, 0.0, target.texelSizeY);
        gl.uniform1i(blurProgram.uniforms.uTexture, temp.attach(0));
        blit(target);
    }
}

function splatPointer (pointer) {
    let dx = pointer.deltaX * config.SPLAT_FORCE;
    let dy = pointer.deltaY * config.SPLAT_FORCE;
    splat(pointer.texcoordX, pointer.texcoordY, dx, dy, pointer.color);
}

function multipleSplats (amount) {
    for (let i = 0; i < amount; i++) {
        const color = generateColor();
        color.r *= 10.0;
        color.g *= 10.0;
        color.b *= 10.0;
        const x = Math.random();
        const y = Math.random();
        const dx = 1000 * (Math.random() - 0.5);
        const dy = 1000 * (Math.random() - 0.5);
        splat(x, y, dx, dy, color);
    }
}

function splat (x, y, dx, dy, color) {
    splatProgram.bind();
    gl.uniform1i(splatProgram.uniforms.uTarget, velocity.read.attach(0));
    gl.uniform1f(splatProgram.uniforms.aspectRatio, canvas.width / canvas.height);
    gl.uniform2f(splatProgram.uniforms.point, x, y);
    gl.uniform3f(splatProgram.uniforms.color, dx, dy, 0.0);
    gl.uniform1f(splatProgram.uniforms.radius, correctRadius(config.SPLAT_RADIUS / 100.0));
    blit(velocity.write);
    velocity.swap();

    gl.uniform1i(splatProgram.uniforms.uTarget, dye.read.attach(0));
    gl.uniform3f(splatProgram.uniforms.color, color.r, color.g, color.b);
    blit(dye.write);
    dye.swap();
}

function correctRadius (radius) {
    let aspectRatio = canvas.width / canvas.height;
    if (aspectRatio > 1)
        radius *= aspectRatio;
    return radius;
}

canvas.addEventListener('mousedown', e => {
    let posX = scaleByPixelRatio(e.offsetX);
    let posY = scaleByPixelRatio(e.offsetY);
    updatePointerDownData(pointers[0], -1, posX, posY);
});

canvas.addEventListener('mousemove', e => {
    let pointer = pointers[0];
    if (!pointer.down) return;
    let posX = scaleByPixelRatio(e.offsetX);
    let posY = scaleByPixelRatio(e.offsetY);
    updatePointerMoveData(pointer, posX, posY);
});

window.addEventListener('mouseup', () => {
    updatePointerUpData(pointers[0]);
});

canvas.addEventListener('touchstart', e => {
    e.preventDefault();
    const touches = e.targetTouches;
    while (touches.length >= pointers.length)
        pointers.push(new pointerPrototype());
    for (let i = 0; i < touches.length; i++) {
        let posX = scaleByPixelRatio(touches[i].pageX);
        let posY = scaleByPixelRatio(touches[i].pageY);
        updatePointerDownData(pointers[i + 1], touches[i].identifier, posX, posY);
    }
});

canvas.addEventListener('touchmove', e => {
    e.preventDefault();
    const touches = e.targetTouches;
    for (let i = 0; i < touches.length; i++) {
        let pointer = pointers[i + 1];
        if (!pointer.down) continue;
        let posX = scaleByPixelRatio(touches[i].pageX);
        let posY = scaleByPixelRatio(touches[i].pageY);
        updatePointerMoveData(pointer, posX, posY);
    }
}, false);

window.addEventListener('touchend', e => {
    const touches = e.changedTouches;
    for (let i = 0; i < touches.length; i++)
    {
        let pointer = pointers.find(p => p.id == touches[i].identifier);
        if (pointer == null) continue;
        updatePointerUpData(pointer);
    }
});

window.addEventListener('keydown', e => {
    // 输入框内不触发快捷键
    const tag = e.target.tagName;
    if (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA') return;

    if (e.code === 'KeyP')
        config.PAUSED = !config.PAUSED;
    if (e.code === 'Space') {
        e.preventDefault();
        splatStack.push(parseInt(Math.random() * 20) + 5);
    }
    // H - 显示/隐藏控制面板
    if (e.code === 'KeyH' && gui && controlsRoot) {
        setControlPanelOpen(!controlsRoot.classList.contains('fluid-controls-open'));
    }
    // G - 开关手势控制
    if (e.code === 'KeyG')
        toggleGesture();
});

function updatePointerDownData (pointer, id, posX, posY) {
    pointer.id = id;
    pointer.down = true;
    pointer.moved = false;
    pointer.texcoordX = posX / canvas.width;
    pointer.texcoordY = 1.0 - posY / canvas.height;
    pointer.prevTexcoordX = pointer.texcoordX;
    pointer.prevTexcoordY = pointer.texcoordY;
    pointer.deltaX = 0;
    pointer.deltaY = 0;
    pointer.color = generateColor();
}

function updatePointerMoveData (pointer, posX, posY) {
    pointer.prevTexcoordX = pointer.texcoordX;
    pointer.prevTexcoordY = pointer.texcoordY;
    pointer.texcoordX = posX / canvas.width;
    pointer.texcoordY = 1.0 - posY / canvas.height;
    pointer.deltaX = correctDeltaX(pointer.texcoordX - pointer.prevTexcoordX);
    pointer.deltaY = correctDeltaY(pointer.texcoordY - pointer.prevTexcoordY);
    pointer.moved = Math.abs(pointer.deltaX) > 0 || Math.abs(pointer.deltaY) > 0;
}

function updatePointerUpData (pointer) {
    pointer.down = false;
}

function correctDeltaX (delta) {
    let aspectRatio = canvas.width / canvas.height;
    if (aspectRatio < 1) delta *= aspectRatio;
    return delta;
}

function correctDeltaY (delta) {
    let aspectRatio = canvas.width / canvas.height;
    if (aspectRatio > 1) delta /= aspectRatio;
    return delta;
}

function generateColor () {
    if (config.WATER_MODE) {
        // 水纹模式：极淡的近透明色，模拟真实水纹折射
        let c = HSVtoRGB(Math.random(), 0.05, 1.0);
        c.r *= 0.04;
        c.g *= 0.04;
        c.b *= 0.04;
        return c;
    }
    let c = HSVtoRGB(Math.random(), 1.0, 1.0);
    c.r *= 0.15;
    c.g *= 0.15;
    c.b *= 0.15;
    return c;
}

function HSVtoRGB (h, s, v) {
    let r, g, b, i, f, p, q, t;
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);

    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }

    return {
        r,
        g,
        b
    };
}

function normalizeColor (input) {
    let output = {
        r: input.r / 255,
        g: input.g / 255,
        b: input.b / 255
    };
    return output;
}

function wrap (value, min, max) {
    let range = max - min;
    if (range == 0) return min;
    return (value - min) % range + min;
}

function getResolution (resolution) {
    let aspectRatio = gl.drawingBufferWidth / gl.drawingBufferHeight;
    if (aspectRatio < 1)
        aspectRatio = 1.0 / aspectRatio;

    let min = Math.round(resolution);
    let max = Math.round(resolution * aspectRatio);

    if (gl.drawingBufferWidth > gl.drawingBufferHeight)
        return { width: max, height: min };
    else
        return { width: min, height: max };
}

function getTextureScale (texture, width, height) {
    return {
        x: width / texture.width,
        y: height / texture.height
    };
}

function scaleByPixelRatio (input) {
    let pixelRatio = window.devicePixelRatio || 1;
    return Math.floor(input * pixelRatio);
}

function hashCode (s) {
    if (s.length == 0) return 0;
    let hash = 0;
    for (let i = 0; i < s.length; i++) {
        hash = (hash << 5) - hash + s.charCodeAt(i);
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
};

/**
 * 组件卸载时调用：停止动画循环并销毁 dat.gui 控制面板。
 * note: 模块级 window 事件监听无法在此移除，但页面级应用单次挂载，可接受。
 */
export function destroyFluidSim () {
    if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
    }
    if (gui) {
        destroyControlPanelChrome();
        try { gui.destroy(); } catch (e) { /* ignore */ }
        gui = null;
    }
}
