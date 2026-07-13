# Tropical Islands — 3D Water & Islands (Three.js + WebGPU)

Companion code for the **3D Water & Islands** course: building a stylized,
cartoonish tropical island scene with high-quality water in **Three.js**, rendered
on **WebGPU** with hand-written **WGSL** shaders.

Each episode of the course lives on its own branch, holding the project as it
stands at the **end** of that episode. Check out a branch, install, and run.

## This branch — `episode-6-sculpt-and-colour`

**Episode 6 — Sculpt & Colour the Island.** Builds on Episode 5. The atoll is now
**coloured by height** (wet sand → beach → grass, via per-vertex colours in
`src/terrain.ts`) and **editable by hand**: `src/SculptTool.ts` is a raise/lower brush
— arm a mode with the toolbar buttons, then hold the **left mouse button** and drag to
reshape the sand under a soft round brush; the **mouse wheel** resizes it. Normals and
colours update live after every edit. The **right mouse button** + **W/A/S/D** still
fly the camera.

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
coloured by height; click **Raise** or **Lower**, then **hold the left mouse button and
drag** to reshape it (scroll to resize the brush). **Right mouse button + W/A/S/D**
flies the camera; a `WebGPU · 60 fps`-style readout sits in the top-left.

## Build

```bash
npm run build     # type-checks with tsc, then bundles with Vite
npm run preview   # serve the production build locally
```
