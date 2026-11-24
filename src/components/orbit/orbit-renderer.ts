import * as THREE from 'orbit-three';
import { interpolateOrbitPose, orbitFlightPullback, rotateOrbitPose, type OrbitPose } from './orbit-camera';
import { ORBIT_BODIES, ORBIT_SUN } from './orbit-bodies';
import { BELT_ORBIT_DAYS, orbitAngleRadians, orbitSpinDelta } from './orbit-motion';
import {
  createReferencePlanetMaterials,
  createReferenceRingGeometry,
  createReferenceSunMaterial,
} from './reference/materials';
import { createReferenceSpaceObjects } from './reference/space-objects';

const muted = new THREE.Color('#8E99AD');
const solar = new THREE.Color('#FFB454');
const zAxis = new THREE.Vector3(0, 0, 1);
const overviewAngles = { azimuth: THREE.MathUtils.degToRad(35), elevation: THREE.MathUtils.degToRad(20) };

interface OrbitNode {
  id: string;
  button: HTMLButtonElement | null;
}

/** VibeFather 的 Opus 5.5 场景，投影结果接入商城的行星按钮。 */
export function createOrbitRenderer(canvas: HTMLCanvasElement, context: WebGL2RenderingContext, nodes: readonly OrbitNode[], sunLabel: HTMLSpanElement | null) {
  const coarse = matchMedia('(pointer: coarse)').matches;
  let pixelRatio = Math.min(devicePixelRatio || 1, coarse ? 1.5 : 2);
  const renderer = new THREE.WebGLRenderer({ canvas, context, antialias: true, logarithmicDepthBuffer: true });
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.setClearColor('#05070D', 1);
  renderer.setPixelRatio(pixelRatio);

  const scene = new THREE.Scene();
  scene.add(new THREE.AmbientLight('#8FA3C7', 0.06), new THREE.PointLight('#ffffff', 3, 0, 0));
  const camera = new THREE.PerspectiveCamera(coarse ? 52 : 40, 1, .1, 12_000);
  const [horizontalSegments, verticalSegments] = coarse ? [32, 24] : [64, 48];
  const sphere = new THREE.SphereGeometry(1, horizontalSegments, verticalSegments);
  const cloudSphere = new THREE.SphereGeometry(1.012, horizontalSegments, verticalSegments);
  const shell = new THREE.SphereGeometry(1.08, horizontalSegments, verticalSegments);
  const orbitPoints = new Float32Array(720 * 3);
  for (let i = 0; i < 720; i++) {
    const angle = i / 720 * Math.PI * 2;
    orbitPoints[i * 3] = Math.cos(angle);
    orbitPoints[i * 3 + 2] = -Math.sin(angle);
  }
  const orbitGeometry = new THREE.BufferGeometry();
  orbitGeometry.setAttribute('position', new THREE.BufferAttribute(orbitPoints, 3));

  const sunMaterial = createReferenceSunMaterial(ORBIT_SUN.palette);
  const sun = new THREE.Mesh(sphere, sunMaterial);
  const sunTilt = new THREE.Group();
  sunTilt.rotation.z = THREE.MathUtils.degToRad(ORBIT_SUN.tilt);
  sunTilt.scale.setScalar(ORBIT_SUN.radius);
  sunTilt.add(sun);
  scene.add(sunTilt);

  const bodies = ORBIT_BODIES.map((body, index) => {
    const root = new THREE.Group();
    const tilt = new THREE.Group();
    const tiltRadians = THREE.MathUtils.degToRad(body.tilt);
    tilt.rotation.z = tiltRadians;
    root.scale.setScalar(body.radius);
    root.add(tilt);
    scene.add(root);

    const materials = createReferencePlanetMaterials(renderer, body, index + 1, coarse);
    const surface = new THREE.Mesh(sphere, materials.surface);
    tilt.add(surface);
    const clouds = materials.clouds ? new THREE.Mesh(cloudSphere, materials.clouds) : null;
    if (clouds) tilt.add(clouds);
    if (materials.atmosphere) root.add(new THREE.Mesh(shell, materials.atmosphere));
    if (body.rings && materials.rings) tilt.add(new THREE.Mesh(createReferenceRingGeometry(body.rings), materials.rings));

    const orbit = new THREE.LineLoop(orbitGeometry, new THREE.LineBasicMaterial({
      color: muted, transparent: true, opacity: .28, depthWrite: false, toneMapped: false,
    }));
    orbit.scale.setScalar(body.distance);
    orbit.frustumCulled = false;
    scene.add(orbit);
    return { ...body, materials, clouds, surface, tiltRadians, position: root.position, orbit, button: nodes.find(node => node.id === body.id)?.button };
  });

  const space = createReferenceSpaceObjects(coarse, pixelRatio);
  scene.add(space.stars, space.belt, space.glow);

  const overview = new THREE.Vector3();
  const overviewDistance = coarse ? 120 : 82;
  const pose: OrbitPose = { ...overviewAngles, target: new THREE.Vector3(), distance: overviewDistance };
  const projected = new THREE.Vector3(), ray = new THREE.Vector3();
  const view = { x: .62, y: .46 };
  const normalDepth = .25;
  let width = 0, height = 0;
  let focalPixels = 0;
  let focused: (typeof bodies)[number] | undefined;
  let hoveredId: string | undefined;
  let flight: { from: OrbitPose; to: OrbitPose; start: number; pullback: number; duration: number; opening?: boolean } | null = null;
  let viewFlight: { x: number; y: number; toX: number; toY: number; start: number } | null = null;
  let frame = 0;
  let hasContext = true;
  let inViewport = false;
  let playbackRate = 0;
  let simulatedDays = 0;
  let surfaceSeconds = 0;
  let previousTick: number | null = null;
  let sampleTotal = 0, samples = 0;
  let degraded = false;

  function updateBodyPositions() {
    for (const body of bodies) {
      const angle = orbitAngleRadians(body.angle, simulatedDays, body.orbitDays);
      body.position.set(Math.cos(angle) * body.distance, 0, -Math.sin(angle) * body.distance);
      if (body.materials.atmosphere || body.materials.rings) {
        ray.copy(body.position).negate().normalize();
        body.materials.atmosphere?.uniforms.uSunDir.value.copy(ray);
        body.materials.rings?.uniforms.uSunLocal.value.copy(ray).applyAxisAngle(zAxis, -body.tiltRadians);
      }
    }
    space.belt.rotation.y = orbitAngleRadians(0, simulatedDays, BELT_ORBIT_DAYS);
  }

  function projectLabel(element: HTMLElement | null | undefined, point: THREE.Vector3, bodyRadius: number) {
    if (!element) return;
    const viewPoint = projected.copy(point).applyMatrix4(camera.matrixWorldInverse);
    const inFront = viewPoint.z < 0;
    viewPoint.applyMatrix4(camera.projectionMatrix);
    const x = (viewPoint.x * .5 + .5) * width;
    const y = (.5 - viewPoint.y * .5) * height;
    const visible = inFront && x > 22 && x < width - 22 && y > 22 && y < height - 34;
    element.style.visibility = visible ? '' : 'hidden';
    if (visible) {
      const radius = focalPixels * bodyRadius / Math.max(.00001, point.distanceTo(camera.position));
      element.style.setProperty('--projected-x', `${x.toFixed(2)}px`);
      element.style.setProperty('--projected-y', `${y.toFixed(2)}px`);
      element.style.setProperty('--visual-diameter', `${Math.min(height * .78, radius * 2).toFixed(2)}px`);
    }
  }

  function render() {
    if (!hasContext || width <= 0 || height <= 0) return;
    camera.position.setFromSphericalCoords(pose.distance, Math.PI / 2 - pose.elevation, pose.azimuth).add(pose.target);
    camera.lookAt(pose.target);
    const sunDistance = camera.position.length();
    let nearest = sunDistance - ORBIT_SUN.radius;
    const focusDistance = focused ? focused.position.distanceTo(camera.position) / focused.radius : 40;
    const opacity = THREE.MathUtils.smoothstep(focusDistance, 20, 40);
    for (const body of bodies) {
      const distance = body.position.distanceTo(camera.position);
      nearest = Math.min(nearest, distance - body.radius);
      const hot = body === focused || body.id === hoveredId;
      body.orbit.material.color.copy(hot ? solar : muted);
      body.orbit.material.opacity = (hot ? .9 : .28) * opacity;
      body.orbit.visible = opacity > .001;
      if (body.materials.clouds) body.materials.clouds.depthTest = distance >= body.radius * 40;
    }
    camera.near = THREE.MathUtils.clamp(normalDepth * nearest, .00001, 1);
    camera.setViewOffset(width, height, (.5 - view.x) * width, (.5 - view.y) * height, width, height);
    camera.updateMatrixWorld();

    space.stars.position.copy(camera.position);
    space.updateSunGlow(sunDistance, focalPixels);
    renderer.render(scene, camera);
    for (const body of bodies) projectLabel(body.button, body.position, body.radius);
    projectLabel(sunLabel, overview, ORBIT_SUN.radius);
  }

  function playing() {
    return playbackRate > 0 && inViewport && !document.hidden;
  }

  function advanceSimulation(delta: number) {
    const follow = flight ? undefined : focused;
    if (follow) pose.target.sub(follow.position);
    simulatedDays += playbackRate * delta;
    surfaceSeconds += delta;
    updateBodyPositions();
    if (follow) pose.target.add(follow.position);

    for (const body of bodies) {
      body.surface.rotation.y = (body.surface.rotation.y + orbitSpinDelta(body.rotationHours, playbackRate, delta)) % (2 * Math.PI);
      if (body.clouds) body.clouds.rotation.y = body.surface.rotation.y + surfaceSeconds * .012;
    }
    sunMaterial.uniforms.uTime.value = 12 + surfaceSeconds;
    sun.rotation.y = (sun.rotation.y + orbitSpinDelta(ORBIT_SUN.rotationHours, playbackRate, delta)) % (2 * Math.PI);
  }

  function requestFrame() {
    if (!frame && hasContext && width > 0 && height > 0) frame = requestAnimationFrame(tick);
  }

  function sunFacingAngle(body: (typeof bodies)[number]) {
    return Math.atan2(-body.position.x, -body.position.z) + THREE.MathUtils.degToRad(body.focus.azimuth);
  }

  function setProjectionTarget(immediately: boolean) {
    const mobile = width <= 820;
    const toX = mobile ? .5 : focused ? .36 : .62;
    const toY = mobile ? focused ? .26 : .6 : focused ? .5 : .46;
    if (immediately || (view.x === toX && view.y === toY)) {
      view.x = toX;
      view.y = toY;
      viewFlight = null;
    } else {
      viewFlight = { ...view, toX, toY, start: performance.now() };
    }
  }

  function tick(now: number) {
    frame = 0;
    const live = playing();
    if (live && previousTick !== null) {
      const elapsed = now - previousTick;
      advanceSimulation(Math.min(elapsed / 1000, .1));
      if (!degraded) {
        sampleTotal += Math.min(elapsed, 250);
        if (++samples === 90) {
          degraded = sampleTotal / samples > 28;
          if (degraded) {
            pixelRatio = 1;
            renderer.setPixelRatio(pixelRatio);
            space.setPixelRatio(pixelRatio);
            space.halveStars();
          }
          sampleTotal = 0;
          samples = 0;
        }
      }
    }
    previousTick = live ? now : null;
    if (flight) {
      const progress = THREE.MathUtils.clamp((now - flight.start) / flight.duration, 0, 1);
      if (focused) flight.to.azimuth = sunFacingAngle(focused);
      if (flight.opening) {
        const eased = 1 - (1 - progress) ** 3;
        pose.distance = Math.exp(THREE.MathUtils.lerp(Math.log(40), Math.log(overviewDistance), eased));
      } else {
        interpolateOrbitPose(flight.from, flight.to, progress, pose, flight.pullback);
      }
      if (progress >= 1) flight = null;
    }
    if (viewFlight) {
      const progress = THREE.MathUtils.clamp((now - viewFlight.start) / 900, 0, 1);
      const eased = progress < .5 ? 4 * progress ** 3 : 1 - 4 * (1 - progress) ** 3;
      view.x = THREE.MathUtils.lerp(viewFlight.x, viewFlight.toX, eased);
      view.y = THREE.MathUtils.lerp(viewFlight.y, viewFlight.toY, eased);
      if (progress >= 1) viewFlight = null;
    }
    render();
    if (live || flight || viewFlight) requestFrame();
  }

  function move(id: string | null, reduce: boolean, immediately = false) {
    focused = bodies.find(body => body.id === id);
    const portrait = window.innerWidth / window.innerHeight < .75 ? 1.35 : 1;
    const to: OrbitPose = focused ? {
      azimuth: sunFacingAngle(focused),
      elevation: THREE.MathUtils.degToRad(focused.focus.elevation),
      target: focused.position,
      distance: 4 * portrait * focused.radius,
    } : { ...overviewAngles, target: overview, distance: overviewDistance };
    setProjectionTarget(reduce || immediately);
    if (reduce || immediately) {
      flight = null;
      pose.target.copy(to.target);
      pose.distance = to.distance;
      pose.azimuth = to.azimuth;
      pose.elevation = to.elevation;
      render();
      return;
    }
    const from = { ...pose, target: pose.target.clone() };
    flight = { from, to, start: performance.now(), pullback: orbitFlightPullback(from, to), duration: focused ? 1600 : 1400 };
    requestFrame();
  }

  function rotate(dx: number, dy: number) {
    if (!hasContext || height <= 0) return;
    flight = null;
    viewFlight = null;
    rotateOrbitPose(pose, dx, dy, height);
    requestFrame();
  }

  function resize() {
    if (!hasContext) return;
    ({ width, height } = canvas.getBoundingClientRect());
    if (width <= 0 || height <= 0) return;
    focalPixels = height / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)));
    renderer.setSize(width, height, false);
    if (!viewFlight) setProjectionTarget(true);
    render();
    if (playing() || flight || viewFlight) requestFrame();
  }

  function syncPlayback() {
    previousTick = null;
    if (playing()) requestFrame();
  }

  const observer = new ResizeObserver(resize);
  const viewportObserver = new IntersectionObserver(([entry]) => {
    inViewport = entry.isIntersecting;
    syncPlayback();
  });
  observer.observe(canvas);
  viewportObserver.observe(canvas);
  document.addEventListener('visibilitychange', syncPlayback);
  updateBodyPositions();
  resize();

  return {
    move, rotate,
    open() {
      const from = { ...pose, distance: 40, target: pose.target.clone() };
      const to = { ...pose, target: overview, distance: overviewDistance };
      pose.distance = 40;
      flight = { from, to, start: performance.now(), pullback: 0, duration: 2400, opening: true };
      render();
      requestFrame();
    },
    setHover(id: string | undefined) {
      if (hoveredId === id) return;
      hoveredId = id;
      requestFrame();
    },
    zoom(factor: number) {
      if (!hasContext || height <= 0) return;
      flight = null;
      pose.distance = THREE.MathUtils.clamp(pose.distance * factor, focused ? focused.radius * 1.6 : 12, focused ? focused.radius * 40 : 180);
      requestFrame();
    },
    setPlayback(shouldPlay: boolean, speed: number) {
      const nextRate = shouldPlay ? speed : 0;
      if (nextRate === playbackRate) return;
      playbackRate = nextRate;
      syncPlayback();
    },
    setContext(active: boolean) {
      if (active) {
        for (const body of bodies) body.materials.restore();
        hasContext = true;
        resize();
        move(focused?.id ?? null, true);
      } else {
        hasContext = false;
        cancelAnimationFrame(frame);
        frame = 0;
        flight = null;
        viewFlight = null;
        previousTick = null;
        for (const label of [...bodies.map(({ button }) => button), sunLabel]) {
          label?.style.removeProperty('--projected-x');
          label?.style.removeProperty('--projected-y');
          label?.style.removeProperty('--visual-diameter');
          label?.style.removeProperty('visibility');
        }
      }
    },
    dispose() {
      hasContext = false;
      observer.disconnect();
      viewportObserver.disconnect();
      document.removeEventListener('visibilitychange', syncPlayback);
      cancelAnimationFrame(frame);
      const geometries = new Set<THREE.BufferGeometry>([sphere, cloudSphere, shell, orbitGeometry]);
      scene.traverse(node => {
        if (node instanceof THREE.Mesh || node instanceof THREE.LineLoop || node instanceof THREE.Points) geometries.add(node.geometry);
      });
      geometries.forEach(geometry => geometry.dispose());
      for (const body of bodies) {
        body.materials.dispose();
        body.orbit.material.dispose();
      }
      space.stars.material.dispose();
      space.belt.material.dispose();
      space.glow.material.map?.dispose();
      space.glow.material.dispose();
      sunMaterial.dispose();
      renderer.dispose();
    },
  };
}
