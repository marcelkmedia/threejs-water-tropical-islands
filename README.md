# Maldives — 3D Water & Islands (Three.js + WebGPU)

Companion code for the **3D Water & Islands** course: building a stylized,
cartoonish tropical island scene with high-quality water in **Three.js**, rendered
on **WebGPU** with hand-written **WGSL** shaders.

Each episode of the course lives on its own branch, holding the project as it
stands at the **end** of that episode. Check out a branch, install, and run.

## This branch — `episode-4-free-moving-camera`

**Episode 4 — A Free-Moving Camera.** Builds on Episode 3: adds delta time
(`THREE.Timer`) so motion is frame-rate independent, and a first-person **fly camera**
(`src/FlyCamera.ts`). Hold the **right mouse button** to look (pointer lock hides the
cursor and shows a centre dot), **W/A/S/D** to move, **Shift** to go faster.

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
editor's built-in preview pane, which often lacks WebGPU. You should see the terracotta
cube on the sand; **hold the right mouse button and use W/A/S/D** to fly around it
(Shift to go faster), with a `WebGPU · 60 fps`-style readout in the top-left.

## Build

```bash
npm run build     # type-checks with tsc, then bundles with Vite
npm run preview   # serve the production build locally
```
