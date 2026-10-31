import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { MonolithModel } from './monolithModel';
import { Act1FluidNoiseField } from './acts/Act1FluidNoise';
import { Act2GlassmorphicAssembly } from './acts/Act2GlassmorphicAssembly';
import { Act3MatrixPrecision } from './acts/Act3MatrixPrecision';
import { Act4HyperspaceTunnel } from './acts/Act4HyperspaceTunnel';
import { Act5PlexusNetwork } from './acts/Act5PlexusNetwork';

// Pre-allocated scratch variables outside render loop for Zero GC
const _vecTargetCam = new THREE.Vector3();
const _vecTargetLook = new THREE.Vector3();
const _curLookAt = new THREE.Vector3(0, 1.8, 0);

export type CameraMode = 'director' | 'orbit';
export type AspectRatioMode = '16:9' | '9:16';

export class SceneController {
  public container: HTMLElement;
  public canvas: HTMLCanvasElement;
  public renderer: THREE.WebGLRenderer;
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;
  public controls: OrbitControls;

  // 3D Objects
  public monolith: MonolithModel;
  public act1Fluid: Act1FluidNoiseField;
  public act2Assembly: Act2GlassmorphicAssembly;
  public act3Matrix: Act3MatrixPrecision;
  public act4Tunnel: Act4HyperspaceTunnel;
  public act5Plexus: Act5PlexusNetwork;

  // Lighting
  private keyLight: THREE.DirectionalLight;
  private hemiLight: THREE.HemisphereLight;
  private rimLight: THREE.DirectionalLight;
  private pointFill: THREE.PointLight;

  // State
  private isSoftwareGl: boolean = false;
  private cameraMode: CameraMode = 'director';
  private aspectRatioMode: AspectRatioMode = '16:9';
  private currentActIndex: number = 0;
  private frameCount: number = 0;
  private lastTime: number = 0;
  private running: boolean = false;
  private animFrameId: number = 0;

  // External callback when timeline ticks
  public onTimeTick?: (timeSec: number, frame: number, currentAct: number) => void;

  constructor(container: HTMLElement) {
    this.container = container;

    // 1. Detect software WebGL
    this.isSoftwareGl = (() => {
      try {
        const gl = document.createElement('canvas').getContext('webgl2');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return true;
      }
    })();

    // 2. Setup WebGLRenderer with ACESFilmicToneMapping & PCFSoftShadowMap
    this.renderer = new THREE.WebGLRenderer({
      antialias: !this.isSoftwareGl,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: true, // Needed for crisp canvas video recording
    });
    this.canvas = this.renderer.domElement;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.renderer.setPixelRatio(this.isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = !this.isSoftwareGl;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(this.canvas);

    // 3. Setup Scene & Atmospheric FogExp2
    this.scene = new THREE.Scene();
    const bgCol = 0x05060b;
    this.scene.background = new THREE.Color(bgCol);
    this.scene.fog = new THREE.FogExp2(bgCol, 0.035);

    // 4. Studio Environment Reflection via RoomEnvironment & PMREMGenerator
    const pmrem = new THREE.PMREMGenerator(this.renderer);
    this.scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();

    // 5. Setup Perspective Camera
    const aspect = container.clientWidth / container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(40, aspect, 0.1, 100);
    this.camera.position.set(0, 2.2, 7.5);

    // 6. Setup OrbitControls (with smooth damping)
    this.controls = new OrbitControls(this.camera, this.canvas);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.target.set(0, 1.8, 0);
    this.controls.maxPolarAngle = Math.PI / 2 + 0.05; // Don't dip below floor
    this.controls.minDistance = 2.0;
    this.controls.maxDistance = 18.0;
    this.controls.enabled = false; // Director mode by default

    // 7. Studio 3-Point Lighting Rig with #5322FF Rim Light
    // Warm Key Light
    this.keyLight = new THREE.DirectionalLight(0xfff6ea, 2.2);
    this.keyLight.position.set(4, 7, 5);
    this.keyLight.castShadow = !this.isSoftwareGl;
    this.keyLight.shadow.mapSize.width = 2048;
    this.keyLight.shadow.mapSize.height = 2048;
    this.keyLight.shadow.camera.near = 0.5;
    this.keyLight.shadow.camera.far = 25;
    this.keyLight.shadow.bias = -0.0005;
    this.keyLight.shadow.normalBias = 0.02;
    const d = 4.5;
    this.keyLight.shadow.camera.left = -d;
    this.keyLight.shadow.camera.right = d;
    this.keyLight.shadow.camera.top = d;
    this.keyLight.shadow.camera.bottom = -d;
    this.scene.add(this.keyLight);

    // Cool Fill Light (Hemisphere)
    this.hemiLight = new THREE.HemisphereLight(0xd9e5ff, 0x050814, 0.9);
    this.scene.add(this.hemiLight);

    // Signature #5322FF High-Tech Rim Light
    this.rimLight = new THREE.DirectionalLight(0x5322ff, 4.0);
    this.rimLight.position.set(-5, 4, -4);
    this.scene.add(this.rimLight);

    // Cyan Specular Point Light for metallic highlights
    this.pointFill = new THREE.PointLight(0x00E5FF, 2.5, 12, 1.5);
    this.pointFill.position.set(0, 1.8, 3.2);
    this.scene.add(this.pointFill);

    // 8. Initialize 3D Subject & Act Scenes
    this.monolith = new MonolithModel(this.renderer);
    this.scene.add(this.monolith.group);

    this.act1Fluid = new Act1FluidNoiseField();
    this.scene.add(this.act1Fluid.group);

    this.act2Assembly = new Act2GlassmorphicAssembly();
    this.scene.add(this.act2Assembly.group);

    this.act3Matrix = new Act3MatrixPrecision(1920, 1080);
    this.scene.add(this.act3Matrix.mesh);

    this.act4Tunnel = new Act4HyperspaceTunnel();
    this.scene.add(this.act4Tunnel.group);

    this.act5Plexus = new Act5PlexusNetwork();
    this.scene.add(this.act5Plexus.group);

    this.resize();
    this.updateActVisibility(0);
  }

  public setCameraMode(mode: CameraMode) {
    this.cameraMode = mode;
    this.controls.enabled = mode === 'orbit';
  }

  public getCameraMode(): CameraMode {
    return this.cameraMode;
  }

  public setAspectRatioMode(mode: AspectRatioMode) {
    this.aspectRatioMode = mode;
    this.resize();
  }

  public getAspectRatioMode(): AspectRatioMode {
    return this.aspectRatioMode;
  }

  public resize() {
    if (!this.container) return;
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;

    if (this.aspectRatioMode === '16:9') {
      this.camera.aspect = w / h;
    } else {
      // 9:16 Vertical Framing
      this.camera.aspect = (h * 9) / 16 / h;
    }

    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  }

  /**
   * Set active scene visibility cleanly per Act
   */
  public updateActVisibility(actIndex: number) {
    this.currentActIndex = actIndex;

    // Act 1: Fluid noise field + Monolith
    this.act1Fluid.setVisible(actIndex === 0);

    // Act 2: Glassmorphic UI assembly
    this.act2Assembly.setVisible(actIndex === 1);

    // Act 3: Matrix precision
    this.act3Matrix.setVisible(actIndex === 2);

    // Act 4: Hyperspace tunnel
    this.act4Tunnel.setVisible(actIndex === 3);

    // Act 5: Plexus network
    this.act5Plexus.setVisible(actIndex === 4);

    // Monolith adjustments per act
    if (actIndex === 1 || actIndex === 2) {
      // Keep monolith in background during CAD layer & matrix breakdown
      this.monolith.group.position.z = -1.2;
    } else {
      this.monolith.group.position.z = 0;
    }
  }

  /**
   * Automated Director Camera cinematic angles per act using smooth exponential damping
   */
  private updateDirectorCamera(timeSec: number, delta: number) {
    const act = Math.min(4, Math.floor(timeSec / 6));
    const actProgress = (timeSec % 6) / 6;

    if (act === 0) {
      // Act 1: The Problem - Cinematic low slow-push cutting darkness
      _vecTargetCam.set(
        Math.sin(actProgress * 0.8) * 2.2,
        1.2 + actProgress * 0.8,
        6.8 - actProgress * 1.5
      );
      _vecTargetLook.set(0, 1.8, 0);
    } else if (act === 1) {
      // Act 2: The Logic - High 3D isometric view inspecting glassmorphic CAD layers
      _vecTargetCam.set(
        3.2 - actProgress * 1.2,
        3.8 - actProgress * 0.6,
        5.2 - actProgress * 0.8
      );
      _vecTargetLook.set(0, 1.6, 0);
    } else if (act === 2) {
      // Act 3: The Precision - Head-on macro caliper alignment inspection
      _vecTargetCam.set(
        Math.sin(actProgress * 1.2) * 0.6,
        1.9,
        4.6 - actProgress * 0.4
      );
      _vecTargetLook.set(0, 1.8, 0);
    } else if (act === 3) {
      // Act 4: The Audit - Tunnel warp camera looking straight down the hexagonal axis
      _vecTargetCam.set(0, 1.8, 4.2);
      _vecTargetLook.set(0, 1.8, -12);
    } else {
      // Act 5: The Call to Action - Low-angle hero shot of craft meets code
      const angle = actProgress * Math.PI * 0.4 - 0.2;
      _vecTargetCam.set(
        Math.sin(angle) * 4.6,
        0.8 + actProgress * 0.5,
        Math.cos(angle) * 4.6
      );
      _vecTargetLook.set(0, 2.2, 0);
    }

    // Smooth camera damping
    this.camera.position.x = THREE.MathUtils.damp(this.camera.position.x, _vecTargetCam.x, 4.5, delta);
    this.camera.position.y = THREE.MathUtils.damp(this.camera.position.y, _vecTargetCam.y, 4.5, delta);
    this.camera.position.z = THREE.MathUtils.damp(this.camera.position.z, _vecTargetCam.z, 4.5, delta);

    _curLookAt.x = THREE.MathUtils.damp(_curLookAt.x, _vecTargetLook.x, 5.0, delta);
    _curLookAt.y = THREE.MathUtils.damp(_curLookAt.y, _vecTargetLook.y, 5.0, delta);
    _curLookAt.z = THREE.MathUtils.damp(_curLookAt.z, _vecTargetLook.z, 5.0, delta);
    this.camera.lookAt(_curLookAt);
  }

  /**
   * Step the 3D scene to an exact deterministic timestamp (timeSec: 0.000 to 30.000)
   */
  public step(timeSec: number, delta: number = 0.01666) {
    const frame = Math.floor(timeSec * 60);
    const act = Math.min(4, Math.floor(timeSec / 6));
    const actRelativeTime = timeSec % 6;

    if (act !== this.currentActIndex) {
      this.updateActVisibility(act);
    }

    // 1. Update Monolith
    this.monolith.update(timeSec, frame, delta);

    // 2. Update Active Act
    let zShake = 0;
    if (act === 0) {
      this.act1Fluid.update(timeSec, frame);
    } else if (act === 1) {
      this.act2Assembly.update(actRelativeTime, frame, delta);
    } else if (act === 2) {
      this.act3Matrix.update(actRelativeTime, frame);
    } else if (act === 3) {
      const auditRes = this.act4Tunnel.update(actRelativeTime, frame, delta);
      zShake = auditRes.zShake;
    } else if (act === 4) {
      this.act5Plexus.update(timeSec, frame, delta);
    }

    // 3. Update Camera
    if (this.cameraMode === 'director') {
      this.updateDirectorCamera(timeSec, delta);
      if (zShake !== 0) {
        this.camera.position.z += zShake;
      }
    } else {
      this.controls.update();
    }

    // Render Scene
    this.renderer.render(this.scene, this.camera);
  }

  public startAnimationLoop(getTimelineTime: () => { time: number; isPlaying: boolean; speed: number }) {
    this.running = true;
    this.lastTime = performance.now();

    const loop = (currentTime: number) => {
      if (!this.running) return;

      const realDelta = (currentTime - this.lastTime) * 0.001;
      this.lastTime = currentTime;

      const { time, isPlaying, speed } = getTimelineTime();
      const delta = Math.min(realDelta * speed, 0.05);

      this.step(time, delta);
      this.frameCount++;

      if (this.onTimeTick) {
        const act = Math.min(4, Math.floor(time / 6));
        this.onTimeTick(time, this.frameCount, act);
      }

      this.animFrameId = requestAnimationFrame(loop);
    };

    this.animFrameId = requestAnimationFrame(loop);
  }

  public stopAnimationLoop() {
    this.running = false;
    cancelAnimationFrame(this.animFrameId);
  }

  public dispose() {
    this.stopAnimationLoop();
    this.monolith.dispose();
    this.act1Fluid.dispose();
    this.act2Assembly.dispose();
    this.act3Matrix.dispose();
    this.act4Tunnel.dispose();
    this.act5Plexus.dispose();
    this.renderer.dispose();
    if (this.canvas.parentElement) {
      this.canvas.parentElement.removeChild(this.canvas);
    }
  }
}
