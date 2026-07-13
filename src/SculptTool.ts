import * as THREE from 'three/webgpu';
import { applyHeightColours } from './terrain';

export type SculptMode = 'raise' | 'lower' | null;

/** A raise/lower terrain brush. Arm a mode with setMode(), then hold the LEFT mouse
 *  button and drag over the mesh to reshape it; the mouse wheel resizes the brush.
 *  Call update() each frame, and dispose() to remove its listeners. */
export class SculptTool {
  private mode: SculptMode = null;
  private radius = 5;
  private sculpting = false;
  private mouse: { x: number; y: number } | null = null;

  // Reused each frame so we don't allocate in the loop.
  private raycaster = new THREE.Raycaster();
  private ndc = new THREE.Vector2();
  private localHit = new THREE.Vector3();
  private ring: THREE.Mesh;

  constructor(
    private mesh: THREE.Mesh,
    private camera: THREE.PerspectiveCamera,
    private canvas: HTMLCanvasElement,
    scene: THREE.Scene,
  ) {
    // A ring on the ground that shows where the brush is and how big it is.
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x9be7a0,
      transparent: true,
      opacity: 0.85,
      side: THREE.DoubleSide,
      depthTest: false, // always draw on top so the brush is never hidden
      depthWrite: false,
    });
    this.ring = new THREE.Mesh(new THREE.RingGeometry(0.9, 1, 48), ringMat);
    this.ring.rotation.x = -Math.PI / 2;
    this.ring.renderOrder = 10;
    this.ring.visible = false;
    scene.add(this.ring);

    this.canvas.addEventListener('mousedown', this.onMouseDown);
    window.addEventListener('mouseup', this.onMouseUp);
    window.addEventListener('mousemove', this.onMouseMove);
    this.canvas.addEventListener('wheel', this.onWheel, { passive: false });
  }

  /** Arm 'raise' or 'lower', or pass null to put the brush away. */
  setMode(mode: SculptMode) {
    this.mode = mode;
  }
  getMode(): SculptMode {
    return this.mode;
  }

  // Left button starts a stroke (only if a mode is armed); releasing ends it.
  private onMouseDown = (e: MouseEvent) => {
    if (e.button === 0 && this.mode) {
      this.sculpting = true;
      this.mouse = { x: e.clientX, y: e.clientY };
    }
  };
  private onMouseUp = (e: MouseEvent) => {
    if (e.button === 0) this.sculpting = false;
  };
  private onMouseMove = (e: MouseEvent) => {
    this.mouse = { x: e.clientX, y: e.clientY };
  };
  private onWheel = (e: WheelEvent) => {
    if (!this.mode) return;
    e.preventDefault(); // don't scroll the page
    this.radius = Math.max(2, Math.min(14, this.radius - Math.sign(e.deltaY)));
  };

  /** Call once per frame: place the ring at the cursor and, while dragging, sculpt. */
  update() {
    if (!this.mode || !this.mouse) {
      this.ring.visible = false;
      return;
    }

    // Turn the mouse position into a ray and shoot it at the terrain.
    const rect = this.canvas.getBoundingClientRect();
    this.ndc.x = ((this.mouse.x - rect.left) / rect.width) * 2 - 1;
    this.ndc.y = -((this.mouse.y - rect.top) / rect.height) * 2 + 1;
    this.raycaster.setFromCamera(this.ndc, this.camera);
    const hit = this.raycaster.intersectObject(this.mesh)[0];
    if (!hit) {
      this.ring.visible = false;
      return;
    }

    // Show the ring at the hit point, tinted by mode and sized to the brush.
    const ringMat = this.ring.material as THREE.MeshBasicMaterial;
    ringMat.color.set(this.mode === 'lower' ? 0xe79b9b : 0x9be7a0);
    this.ring.visible = true;
    this.ring.position.copy(hit.point);
    this.ring.position.y += 0.06; // float just above the surface
    this.ring.scale.set(this.radius, this.radius, 1);

    if (this.sculpting) {
      // The hit point is in world space; convert it to the mesh's own coordinates.
      this.mesh.worldToLocal(this.localHit.copy(hit.point));
      this.applyBrush(this.localHit.x, this.localHit.y, this.mode === 'raise' ? 0.09 : -0.09);
    }
  }

  private applyBrush(localX: number, localY: number, delta: number) {
    const geo = this.mesh.geometry;
    const pos = geo.attributes.position;
    const r2 = this.radius * this.radius;
    for (let i = 0; i < pos.count; i++) {
      const dx = pos.getX(i) - localX;
      const dy = pos.getY(i) - localY;
      const dist2 = dx * dx + dy * dy;
      if (dist2 < r2) {
        const t = Math.sqrt(dist2) / this.radius;
        const falloff = 1 - t * t * (3 - 2 * t); // 1 at the centre → 0 at the edge
        pos.setZ(i, pos.getZ(i) + delta * falloff);
      }
    }
    pos.needsUpdate = true;
    geo.computeVertexNormals(); // re-light the new slopes
    geo.computeBoundingSphere(); // keep raycasting accurate as the shape changes
    applyHeightColours(geo); // re-tint so the beach/grass zones follow the new shape
  }

  /** Remove listeners and the ring — call if you ever tear the scene down. */
  dispose() {
    this.canvas.removeEventListener('mousedown', this.onMouseDown);
    window.removeEventListener('mouseup', this.onMouseUp);
    window.removeEventListener('mousemove', this.onMouseMove);
    this.canvas.removeEventListener('wheel', this.onWheel);
    this.ring.geometry.dispose();
    (this.ring.material as THREE.Material).dispose();
    this.ring.removeFromParent();
  }
}
