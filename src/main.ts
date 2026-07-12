import * as THREE from 'three/webgpu';

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

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x7ec8e3); // tropical sky blue

const camera = new THREE.PerspectiveCamera(
  60,                                     // field of view, in degrees
  window.innerWidth / window.innerHeight, // aspect ratio
  0.1,                                    // near clip plane
  100,                                    // far clip plane
);
camera.position.set(0, 1, 3); // a little up, a little back
camera.lookAt(0, 0, 0);

// Which backend did Three.js actually pick? The WebGPU backend object carries an
// `isWebGPUBackend` flag; the WebGL fallback doesn't — so we test for the flag.
const backend = 'isWebGPUBackend' in renderer.backend ? 'WebGPU' : 'WebGL';

let frames = 0;
let fps = 0;
let lastSample = performance.now();

// The GPU device is requested asynchronously, so we await it before rendering.
await renderer.init();

// setAnimationLoop calls this function once per display refresh (~60×/second).
renderer.setAnimationLoop(() => {
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
