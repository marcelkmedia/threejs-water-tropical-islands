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

// Map the scene's light values into a pleasant displayable range (filmic look).
renderer.toneMapping = THREE.ACESFilmicToneMapping;

// Turn on shadows, with soft (filtered) edges.
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

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

// A flat ground plane. PlaneGeometry is born standing up (facing +Z), so we
// tip it back 90° to lie flat on the ground.
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshStandardMaterial({ color: 0xe8d8b0 }), // warm sand
);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true; // the ground shows shadows cast onto it
scene.add(ground);

// A cube, lifted so it rests ON the ground instead of halfway through it.
const cube = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshStandardMaterial({ color: 0xcc7a4a }), // terracotta
);
cube.position.y = 0.5;
cube.castShadow = true; // the cube blocks light and casts a shadow
scene.add(cube);

// Ambient light: a soft, even glow from all directions so nothing is pure black.
const ambient = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambient);

// Directional light: parallel rays like the sun, giving the cube light and dark sides.
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

// The GPU device is requested asynchronously, so we await it before rendering.
await renderer.init();

// setAnimationLoop calls this function once per display refresh (~60×/second).
renderer.setAnimationLoop(() => {
  // Turn the cube a little each frame so it gently spins.
  cube.rotation.y += 0.01;

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
