import * as THREE from 'three/webgpu';
import { createNoise2D } from 'simplex-noise';

// A tiny seeded random-number generator, so the terrain looks the same every run.
// (You don't need to follow its internals — it just gives repeatable randomness.)
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// noise2D(x, z) → a smooth, repeatable value between -1 and 1.
const noise2D = createNoise2D(mulberry32(1337));

// Fractal noise: add a few layers, each finer and fainter than the last, for
// natural-looking detail.
function fractalNoise(x: number, z: number) {
  let n = 0;
  let amplitude = 1;
  let frequency = 0.05;
  for (let octave = 0; octave < 4; octave++) {
    n += amplitude * noise2D(x * frequency, z * frequency);
    frequency *= 2;
    amplitude *= 0.5;
  }
  return n;
}

// Atoll shape: a flat sea floor with a broken ring of islands + sandbanks.
const SEA_FLOOR = -1.2;   // the flat sea floor sits below the (future) waterline at 0
const ATOLL_RADIUS = 16;  // the ring of islands sits this far from the centre
const RIM_WIDTH = 7;      // how broad the ring is

function terrainHeight(x: number, z: number) {
  // Distance from the centre, gently warped so the ring isn't a perfect circle.
  const d = Math.hypot(x, z) + noise2D(x * 0.03, z * 0.03) * 4;

  // A ring that peaks at ATOLL_RADIUS and fades to nothing in the lagoon and open sea.
  const ring = Math.exp(-((d - ATOLL_RADIUS) ** 2) / (2 * RIM_WIDTH * RIM_WIDTH));

  // Break the ring into separate islands: a slow noise raises some stretches into
  // land and lets others sink away, leaving channels between them.
  const rise = Math.max(0, 0.4 + noise2D(x * 0.09, z * 0.09));

  // How much land is here — 0 out on the open sea, in the lagoon, and in the channels.
  const land = ring * rise;

  // Flat sea floor everywhere; the ring rises out of it, with sandy detail only on land.
  return SEA_FLOOR + land * 1.3 + fractalNoise(x, z) * land * 0.15;
}

// smoothstep-style blend: 0 below a, 1 above b, eased in between (no hard edges).
const smooth = (a: number, b: number, x: number) => {
  const t = Math.max(0, Math.min(1, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

// The three colour "zones", made once.
const cDeep = new THREE.Color(0xb3a079); // wet / under-water sand
const cSand = new THREE.Color(0xe8d8b0); // dry beach sand
const cGrass = new THREE.Color(0x6f9f5b); // grass on the island tops
const tmpColour = new THREE.Color();

// Colour every vertex from its height: wet sand → beach → grass.
function colourByHeight(geo: THREE.BufferGeometry) {
  const pos = geo.attributes.position;
  const col = geo.attributes.color;
  for (let i = 0; i < pos.count; i++) {
    const h = pos.getZ(i);
    if (h < -0.35) {
      tmpColour.copy(cDeep).lerp(cSand, smooth(-0.85, -0.35, h));
    } else {
      tmpColour.copy(cSand).lerp(cGrass, smooth(0, 0.4, h));
    }
    col.setXYZ(i, tmpColour.r, tmpColour.g, tmpColour.b);
  }
  col.needsUpdate = true;
}

// Builds the atoll: a subdivided plane, displaced by the height field and coloured by
// elevation. Returns a ready mesh.
export function createTerrain(): THREE.Mesh {
  const geo = new THREE.PlaneGeometry(80, 80, 240, 240);

  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    pos.setZ(i, terrainHeight(pos.getX(i), pos.getY(i)));
  }
  pos.needsUpdate = true;
  geo.computeVertexNormals();

  geo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(pos.count * 3), 3));
  colourByHeight(geo);

  const mesh = new THREE.Mesh(
    geo,
    new THREE.MeshStandardMaterial({ vertexColors: true }),
  );
  mesh.rotation.x = -Math.PI / 2;
  mesh.receiveShadow = true;
  return mesh;
}
