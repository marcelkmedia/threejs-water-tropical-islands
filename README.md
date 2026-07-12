# 3D Water & Islands — Three.js + WebGPU

Companion code for the **3D Water & Islands** course: building a stylized,
cartoonish tropical "Maldives" island scene with high-quality water — depth-tinted
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
git clone https://github.com/marcelkmedia/threejs-water-island-maldives.git
cd threejs-water-island-maldives
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
| 1 | Project Setup & The Render Loop | [`episode-1-project-setup`](https://github.com/marcelkmedia/threejs-water-island-maldives/tree/episode-1-project-setup) ✅ |
| 2 | Your First Mesh: A Cube on a Plane | _coming soon_ |
| 3 | Lights & Shadows | _coming soon_ |
| 4 | A Free-Moving Camera | _coming soon_ |
| 5 | Stylized Look & Materials | _coming soon_ |
| 6 | Sculpting the Island | _coming soon_ |
| 7 | The Ocean Surface: Gerstner Waves | _coming soon_ |
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
