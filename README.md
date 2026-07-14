# 3D Water & Islands — Three.js + WebGPU

Companion code for the **3D Water & Islands** course: building a stylized,
cartoonish tropical islands scene with high-quality water — depth-tinted
shallows, refraction, Fresnel reflections, shoreline foam, caustics, and a bright
tropical sky — in **Three.js**, rendered on **WebGPU** with hand-written **WGSL**
shaders.

We build it **incrementally**: every episode adds exactly one visible thing and
ends at a concrete, runnable goal.

## How this repo is organized

This `main` branch is just the landing page (this README). The actual project lives
on **episode branches** — each one is a complete, standalone snapshot of the project
at the **end** of that episode. Pick an episode from the table below and check out
its branch.

## Getting started

```bash
git clone https://github.com/marcelkmedia/threejs-water-tropical-islands.git
cd threejs-water-tropical-islands
git checkout episode-1-project-setup   # the episode you want
npm install
npm run dev
```

## Requirements

- **Node.js 18+**
- A browser with **WebGPU** enabled (recent Chrome, Edge, or Safari; recent Firefox
  needs it toggled on). Open the dev URL in a real browser — not an editor's
  built-in preview pane, which often lacks WebGPU.

## Episodes

| # | Episode | Branch |
|---|---------|--------|
| 1 | Project Setup & The Render Loop | [`episode-1-project-setup`](https://github.com/marcelkmedia/threejs-water-tropical-islands/tree/episode-1-project-setup) ✅ |
| 2 | Your First Mesh: A Cube on a Plane | [`episode-2-cube-on-plane`](https://github.com/marcelkmedia/threejs-water-tropical-islands/tree/episode-2-cube-on-plane) ✅ |
| 3 | Lights & Shadows | [`episode-3-lights-and-shadows`](https://github.com/marcelkmedia/threejs-water-tropical-islands/tree/episode-3-lights-and-shadows) ✅ |
| 4 | A Free-Moving Camera | [`episode-4-free-moving-camera`](https://github.com/marcelkmedia/threejs-water-tropical-islands/tree/episode-4-free-moving-camera) ✅ |
| 5 | Terrain from Noise | [`episode-5-terrain`](https://github.com/marcelkmedia/threejs-water-tropical-islands/tree/episode-5-terrain) ✅ |
| 6 | Colour the Island | [`episode-6-colour`](https://github.com/marcelkmedia/threejs-water-tropical-islands/tree/episode-6-colour) ✅ |
| 7 | The Ocean Surface | [`episode-7-ocean-waves`](https://github.com/marcelkmedia/threejs-water-tropical-islands/tree/episode-7-ocean-waves) ✅ |
| 8 | Water Color: Depth, Gradient & Fresnel | _coming soon_ |
| 9 | Refraction & Transparency | _coming soon_ |
| 10 | Shorelines & Foam | _coming soon_ |
| 11 | Reflections & Sky | _coming soon_ |
| 12 | Caustics & Underwater Light | _coming soon_ |
| 13 | Post-Processing & Final Polish | _coming soon_ |

Assumed prior knowledge: vectors and matrix math. We *use* linear algebra here, we
don't re-teach it.

## Tech

- **Three.js** owns the scene graph (meshes, transforms, camera, lights, shadows).
- **WebGPU** (`WebGPURenderer` from `three/webgpu`) is the rendering backend — the
  foundation for later GPU-compute work.
- Custom looks (water, foam, caustics) are hand-written **WGSL** attached through
  Three.js's material hooks. No node-DSL.
