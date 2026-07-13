# Tropical Islands — 3D Water & Islands (Three.js + WebGPU)

Companion code for the **3D Water & Islands** course: building a stylized,
cartoonish tropical island scene with high-quality water in **Three.js**, rendered
on **WebGPU** with hand-written **WGSL** shaders.

Each episode of the course lives on its own branch, holding the project as it
stands at the **end** of that episode. Check out a branch, install, and run.

## This branch — `episode-5-terrain`

**Episode 5 — Terrain from Noise.** Builds on Episode 4: the flat ground becomes a
tropical **atoll** — a broken ring of low sandy islands around a lagoon, on a flat sea
floor. All the noise and shaping lives in `src/terrain.ts` (using **simplex-noise**),
which `main.ts` calls via `createTerrain()`: the plane's vertices are displaced by a
ring-times-noise height field and its normals recomputed. Distance fog fades the far
water into the sky. (The water itself comes in a later episode.)

## Requirements

- **Node.js 18+**
- A browser with **WebGPU** enabled (recent Chrome, Edge, or Safari; recent Firefox
  needs it toggled on).

## Run it

```bash
npm install
npm run dev
```

Open the printed URL (usually `http://localhost:5173`) in a real browser — not an
editor's built-in preview pane, which often lacks WebGPU. You should see a ring of low
sandy islands around a flat lagoon, fading into haze; **hold the right mouse button and
use W/A/S/D** to fly over it (Shift to go faster), with a `WebGPU · 60 fps`-style
readout in the top-left.

## Build

```bash
npm run build     # type-checks with tsc, then bundles with Vite
npm run preview   # serve the production build locally
```
