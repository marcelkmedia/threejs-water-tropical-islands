# Maldives — 3D Water & Islands (Three.js + WebGPU)

Companion code for the **3D Water & Islands** course: building a stylized,
cartoonish tropical island scene with high-quality water in **Three.js**, rendered
on **WebGPU** with hand-written **WGSL** shaders.

Each episode of the course lives on its own branch, holding the project as it
stands at the **end** of that episode. Check out a branch, install, and run.

## This branch — `episode-1-project-setup`

**Episode 1 — Project Setup & The Render Loop.** A Vite + TypeScript project with
Three.js pinned, a `WebGPURenderer` that initializes and renders, a scene and a
perspective camera, a render loop with a live FPS/backend readout, and correct
resize handling. The canvas clears to a tropical sky-blue every frame — the
heartbeat every later episode plugs into.

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
editor's built-in preview pane, which often lacks WebGPU. You should see a
full-window sky-blue canvas with a `WebGPU · 60 fps`-style readout in the top-left.

## Build

```bash
npm run build     # type-checks with tsc, then bundles with Vite
npm run preview   # serve the production build locally
```
