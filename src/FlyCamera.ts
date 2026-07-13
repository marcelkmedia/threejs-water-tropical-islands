import * as THREE from 'three/webgpu';

/** A first-person fly camera. Hold the right mouse button to look (pointer lock),
 *  W/A/S/D to move, Shift to go faster. Call update(dt) each frame; call dispose()
 *  to remove its listeners. */
export class FlyCamera {
  // What the camera controls. The `!` tells TypeScript we'll set these in the
  // constructor (Step 5) — without it, it complains they have no initial value.
  private camera!: THREE.PerspectiveCamera;
  private view!: HTMLCanvasElement;
  private dot!: HTMLElement;

  // Where we're looking, and whether we're currently flying.
  private yaw = 0;        // turn left / right (radians)
  private pitch = -0.4;   // look up / down — starts tilted down to look over the atoll
  private flying = false; // true only while the right button is held (pointer lock)
  private keys = new Set<string>(); // the movement keys currently held down

  // Two scratch vectors we reuse every frame (making new ones each frame is wasteful).
  private forward = new THREE.Vector3();
  private right = new THREE.Vector3();

  // Right button down → start flying (pointer lock hides the cursor); up → stop.
  private onContextMenu = (e: Event) => e.preventDefault(); // stop the right-click menu
  private onMouseDown = (e: MouseEvent) => {
    if (e.button === 2) this.view.requestPointerLock();
  };
  private onMouseUp = (e: MouseEvent) => {
    if (e.button === 2) document.exitPointerLock();
  };

  // Pointer lock turned on or off: update `flying` and show/hide the centre dot.
  private onLockChange = () => {
    this.flying = document.pointerLockElement === this.view;
    this.dot.style.display = this.flying ? 'block' : 'none';
  };

  // While flying, mouse movement changes the look angles.
  private onMouseMove = (e: MouseEvent) => {
    if (!this.flying) return;
    this.yaw -= e.movementX * 0.002; // moving the mouse left/right turns the view
    this.pitch -= e.movementY * 0.002;
    this.pitch = Math.max(-1.4, Math.min(1.4, this.pitch)); // don't flip over the top
  };

  // Just remember which keys are down; update() reads them each frame.
  private onKeyDown = (e: KeyboardEvent) => this.keys.add(e.code);
  private onKeyUp = (e: KeyboardEvent) => this.keys.delete(e.code);

  constructor(camera: THREE.PerspectiveCamera, view: HTMLCanvasElement, dot: HTMLElement) {
    this.camera = camera;
    this.view = view;
    this.dot = dot;

    // The mouse-move / mouse-up listeners live on `window` so a drag keeps working
    // even if the cursor leaves the canvas.
    view.addEventListener('contextmenu', this.onContextMenu);
    view.addEventListener('mousedown', this.onMouseDown);
    window.addEventListener('mouseup', this.onMouseUp);
    document.addEventListener('pointerlockchange', this.onLockChange);
    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
  }

  /** Call once per frame, passing the delta time (seconds since the last frame). */
  update(dt: number) {
    // Point the camera using the look angles we've been building up.
    this.camera.rotation.set(this.pitch, this.yaw, 0, 'YXZ');

    if (this.flying) {
      // Shift → 12 units per second, otherwise 4. Times dt = how far to move this frame.
      const speed = (this.keys.has('ShiftLeft') || this.keys.has('ShiftRight') ? 12 : 4) * dt;

      // The camera's own axes: forward = where it looks, right = 90° to the side.
      this.camera.getWorldDirection(this.forward);
      this.right.crossVectors(this.forward, this.camera.up).normalize();

      // Slide the camera along those axes, based on which keys are held.
      if (this.keys.has('KeyW')) this.camera.position.addScaledVector(this.forward, speed);
      if (this.keys.has('KeyS')) this.camera.position.addScaledVector(this.forward, -speed);
      if (this.keys.has('KeyD')) this.camera.position.addScaledVector(this.right, speed);
      if (this.keys.has('KeyA')) this.camera.position.addScaledVector(this.right, -speed);
    }
  }

  /** Unhook every listener — call this if you ever tear the scene down. */
  dispose() {
    this.view.removeEventListener('contextmenu', this.onContextMenu);
    this.view.removeEventListener('mousedown', this.onMouseDown);
    window.removeEventListener('mouseup', this.onMouseUp);
    document.removeEventListener('pointerlockchange', this.onLockChange);
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
  }
}
