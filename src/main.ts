import * as THREE from 'three/webgpu';
import { FlyCamera } from './FlyCamera';
import { createTerrain, resetTerrain } from './terrain';
import { SculptTool } from './SculptTool';

// Grab the two elements we created in index.html.
const canvas = document.querySelector<HTMLCanvasElement>('#app')!;
const hud = document.querySelector<HTMLDivElement>('#hud')!;

// If the browser can't do WebGPU, say so clearly instead of showing a blank page.
if (!navigator.gpu) {
  document.body.innerHTML =
    '<div class="error">This demo needs <b>WebGPU</b>, which your browser ' +
    "doesn't support yet.<br/>Try the latest Chrome, Edge, or Safari.</div>";
  throw new Error('WebGPU not available');
}

const renderer = new THREE.WebGPURenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // cap DPR for perf
renderer.setSize(window.innerWidth, window.innerHeight);

// Map the scene's light values into a pleasant displayable range (filmic look).
renderer.toneMapping = THREE.ACESFilmicToneMapping;

// Turn on shadows, with soft (filtered) edges.
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x7ec8e3); // tropical sky blue

// Distance fog: fade the far sea floor into the sky colour toward the horizon.
scene.fog = new THREE.Fog(0x7ec8e3, 20, 95);

const camera = new THREE.PerspectiveCamera(
  60,                                     // field of view, in degrees
  window.innerWidth / window.innerHeight, // aspect ratio
  0.1,                                    // near clip plane
  100,                                    // far clip plane
);
camera.position.set(0, 10, 34); // up and back, looking out over the atoll

// Set up the fly camera (defined in FlyCamera.ts).
const dot = document.querySelector<HTMLDivElement>('#dot')!;
const flyCamera = new FlyCamera(camera, renderer.domElement, dot);

// Build the atoll terrain (noise + height-based colours live in terrain.ts).
const ground = createTerrain();
scene.add(ground);

// The raise/lower sculpt brush (see SculptTool.ts).
const sculpt = new SculptTool(ground, camera, renderer.domElement, scene);

// Wire the toolbar buttons to the tool. Clicking an armed mode again disarms it.
const raiseBtn = document.querySelector<HTMLButtonElement>('#raise')!;
const lowerBtn = document.querySelector<HTMLButtonElement>('#lower')!;
const resetBtn = document.querySelector<HTMLButtonElement>('#reset')!;

function arm(mode: 'raise' | 'lower') {
  const next = sculpt.getMode() === mode ? null : mode;
  sculpt.setMode(next);
  raiseBtn.classList.toggle('active', next === 'raise');
  lowerBtn.classList.toggle('active', next === 'lower');
}
raiseBtn.addEventListener('click', () => arm('raise'));
lowerBtn.addEventListener('click', () => arm('lower'));
resetBtn.addEventListener('click', () => resetTerrain(ground.geometry));

// Ambient light: a soft, even glow from all directions so nothing is pure black.
const ambient = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambient);

// Directional light: parallel rays like the sun, lighting the terrain's slopes.
const sun = new THREE.DirectionalLight(0xffffff, 2);
sun.position.set(3, 5, 2);
sun.castShadow = true; // this light casts shadows

// The shadow camera's box — must be big enough to cover the scene.
sun.shadow.camera.near = 0.5;
sun.shadow.camera.far = 20;
sun.shadow.camera.left = -6;
sun.shadow.camera.right = 6;
sun.shadow.camera.top = 6;
sun.shadow.camera.bottom = -6;

// Shadow-map resolution: higher = crisper edges, but more memory.
sun.shadow.mapSize.set(2048, 2048);

// A small bias stops flat surfaces from shadowing themselves ("shadow acne").
sun.shadow.bias = -0.0001;

scene.add(sun);

// Which backend did Three.js actually pick? The WebGPU backend object carries an
// `isWebGPUBackend` flag; the WebGL fallback doesn't — so we test for the flag.
const backend = 'isWebGPUBackend' in renderer.backend ? 'WebGPU' : 'WebGL';

let frames = 0;
let fps = 0;
let lastSample = performance.now();

// A timer measures how much real time passes between frames (delta time).
const timer = new THREE.Timer();

// The GPU device is requested asynchronously, so we await it before rendering.
await renderer.init();

// setAnimationLoop calls this function once per display refresh (~60×/second).
renderer.setAnimationLoop(() => {
  timer.update();
  const dt = timer.getDelta(); // seconds since the previous frame

  flyCamera.update(dt); // mouse look + WASD movement
  sculpt.update();      // brush ring + sculpting

  // Count frames and refresh the readout about once a second.
  frames++;
  const now = performance.now();
  if (now - lastSample >= 1000) {
    fps = Math.round((frames * 1000) / (now - lastSample));
    frames = 0;
    lastSample = now;
    hud.textContent = `${backend} · ${fps} fps`;
  }
  renderer.render(scene, camera);
});

function onResize() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  renderer.setSize(w, h);
  camera.aspect = w / h;
  camera.updateProjectionMatrix(); // rebuild the projection matrix from the new aspect
}
window.addEventListener('resize', onResize);
