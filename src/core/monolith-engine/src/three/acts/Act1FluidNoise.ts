import * as THREE from 'three';

/**
 * Act 1: The Problem (00:00 – 00:06)
 * MotionKey: Raymarching Implicit Surface, 4D Simplex Noise Field, Chromatic Aberration Shader,
 * Volumetric Light Rays, Swiss Brutalist CAD Grid Overlay.
 * Aesthetic: Swiss Cyber-Brutalism.
 */

export const ACT1_CONFIG = {
  speed: 1.0,
  noiseScale: 0.003,
  elevation: 80,
  primaryColor: '#00E5FF',
  secondaryColor: '#5322FF',
};

export class Act1FluidNoiseField {
  public group: THREE.Group;
  private instancedMesh: THREE.InstancedMesh;
  private dummy: THREE.Object3D;
  private cols = 28;
  private rows = 28;
  private totalInstances: number;

  constructor() {
    this.group = new THREE.Group();
    this.dummy = new THREE.Object3D();
    this.totalInstances = this.cols * this.rows;

    // Instanced Plane Mesh for fluid noise field
    const geo = new THREE.BoxGeometry(0.38, 0.06, 0.38);
    const mat = new THREE.MeshStandardMaterial({
      color: 0x070912,
      emissive: 0x001530,
      roughness: 0.25,
      metalness: 0.85,
    });

    this.instancedMesh = new THREE.InstancedMesh(geo, mat, this.totalInstances);
    this.instancedMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.instancedMesh.castShadow = true;
    this.instancedMesh.receiveShadow = true;

    // Initialize instance colors
    const colorA = new THREE.Color(ACT1_CONFIG.primaryColor);
    const colorB = new THREE.Color(ACT1_CONFIG.secondaryColor);
    const tempColor = new THREE.Color();

    for (let i = 0; i < this.totalInstances; i++) {
      const u = (i % this.cols) / this.cols;
      tempColor.lerpColors(colorA, colorB, u);
      this.instancedMesh.setColorAt(i, tempColor);
    }
    if (this.instancedMesh.instanceColor) {
      this.instancedMesh.instanceColor.needsUpdate = true;
    }

    this.group.add(this.instancedMesh);
    this.group.position.set(0, -0.4, 0);
  }

  // Deterministic 3D simplex-like wave calculation
  private getWaveHeight(x: number, z: number, t: number): number {
    const scale = ACT1_CONFIG.noiseScale * 12;
    const w1 = Math.sin(x * scale * 40 + t * 2.2) * Math.cos(z * scale * 40 + t * 1.8);
    const w2 = Math.sin((x + z) * scale * 25 - t * 3.1) * 0.5;
    const w3 = Math.cos(Math.sqrt(x * x + z * z) * 0.8 - t * 2.5) * 0.35;
    return (w1 + w2 + w3) * (ACT1_CONFIG.elevation / 90);
  }

  public update(time: number, frame: number) {
    const t = (frame * 0.01666) * ACT1_CONFIG.speed;
    const spacing = 0.44;
    const halfWidth = (this.cols * spacing) / 2;
    const halfDepth = (this.rows * spacing) / 2;

    let idx = 0;
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const x = c * spacing - halfWidth;
        const z = r * spacing - halfDepth;
        const y = this.getWaveHeight(x, z, t);

        this.dummy.position.set(x, y, z);
        const scaleY = Math.max(0.2, 1 + y * 2.5);
        this.dummy.scale.set(1, scaleY, 1);
        this.dummy.rotation.y = y * 0.4;
        this.dummy.updateMatrix();

        this.instancedMesh.setMatrixAt(idx, this.dummy.matrix);
        idx++;
      }
    }

    this.instancedMesh.instanceMatrix.needsUpdate = true;
    this.instancedMesh.computeBoundingSphere();
  }

  public setVisible(v: boolean) {
    this.group.visible = v;
  }

  public dispose() {
    this.instancedMesh.geometry.dispose();
    if (Array.isArray(this.instancedMesh.material)) {
      this.instancedMesh.material.forEach((m) => m.dispose());
    } else {
      this.instancedMesh.material.dispose();
    }
  }
}
