# Tropical Islands — 3D Water & Islands (Three.js + WebGPU)

Companion code for the **3D Water & Islands** course: building a stylized,
cartoonish tropical island scene with high-quality water in **Three.js**, rendered
on **WebGPU** with hand-written **WGSL** shaders.

Each episode of the course lives on its own branch, holding the project as it
stands at the **end** of that episode. Check out a branch, install, and run.

## This branch — `episode-2-cube-on-plane`

**Episode 2 — Your First Mesh: A Cube on a Plane.** Builds on Episode 1: adds a
ground plane and a cube (both `MeshStandardMaterial`), an ambient light and a
sun-like directional light, and a gentle rotation. The cube sits on the sand under
the tropical sky, lit so it reads as a solid, spinning 3D object.

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
editor's built-in preview pane, which often lacks WebGPU. You should see a terracotta
cube gently rotating on a sandy ground plane under a tropical sky, with a
`WebGPU · 60 fps`-style readout in the top-left.

## Build

```bash
npm run build     # type-checks with tsc, then bundles with Vite
npm run preview   # serve the production build locally
```
