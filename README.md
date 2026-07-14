# Tropical Islands — 3D Water & Islands (Three.js + WebGPU)

Companion code for the **3D Water & Islands** course: building a stylized,
cartoonish tropical island scene with high-quality water in **Three.js**, rendered
on **WebGPU** with hand-written **WGSL** shaders.

Each episode of the course lives on its own branch, holding the project as it
stands at the **end** of that episode. Check out a branch, install, and run.

## This branch — `episode-6-colour`

**Episode 6 — Colour the Island.** Builds on Episode 5. The atoll is now **coloured by
height**: every vertex gets a colour from its elevation — wet under-water sand → bright
beach sand → green on the island tops — via a per-vertex `color` attribute filled in
`src/terrain.ts` and a `MeshStandardMaterial({ vertexColors: true })`. The shoreline is
set low so a good amount of the ring reads as dry land. `main.ts` is unchanged from
Episode 5; only `terrain.ts` gained the colour code.

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
editor's built-in preview pane, which often lacks WebGPU. You should see the atoll
coloured by height — wet under-water sand, bright beach, green tops; **hold the right
mouse button and use W/A/S/D** to fly over it (Shift to go faster), with a
`WebGPU · 60 fps`-style readout in the top-left.

## Build

```bash
npm run build     # type-checks with tsc, then bundles with Vite
npm run preview   # serve the production build locally
```
