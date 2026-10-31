import * as THREE from 'three';

/**
 * Act 4: The Audit (00:18 – 00:24)
 * MotionKey: Volumetric Hexagonal Tunnel, Velocity Vector Blur, Focal Depth Displacement,
 * Particle Warp Speed, Pulse Rhythm.
 * Aesthetic: Cyberpunk Hyperspace Tunnel.
 */

export const ACT4_CONFIG = {
  tunnelSpeed: 2.5,
  particleDensity: 5000,
  fogDensity: 0.002,
  primaryColor: '#00E5FF',
};

export class Act4HyperspaceTunnel {
  public group: THREE.Group;
  private ringMesh: THREE.InstancedMesh;
  private dummy: THREE.Object3D;
  private numRings = 40;
  private ringSpacing = 1.8;
  private tunnelLength: number;

  // 5,000 High-Speed Warp Particles
  private particlesMesh: THREE.Points;
  private particlePositions: Float32Array;
  private particleVelocities: Float32Array;

  // 4 Specialized Audit Nodes
  private auditNodesGroup: THREE.Group;
  private nodeMeshes: THREE.Mesh[] = [];

  constructor() {
    this.group = new THREE.Group();
    this.dummy = new THREE.Object3D();
    this.tunnelLength = this.numRings * this.ringSpacing;

    // --- 1. Hexagonal Instanced Tunnel Rings ---
    const hexRadius = 3.4;
    const ringGeo = new THREE.CylinderGeometry(hexRadius, hexRadius, 0.08, 6, 1, true);
    // Wireframe / Emissive cyber metal ring
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x00E5FF,
      wireframe: true,
      transparent: true,
      opacity: 0.65,
    });

    this.ringMesh = new THREE.InstancedMesh(ringGeo, ringMat, this.numRings);
    this.ringMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.group.add(this.ringMesh);

    // --- 2. 5,000 Streaming Warp Energy Particles ---
    const count = ACT4_CONFIG.particleDensity;
    const pGeo = new THREE.BufferGeometry();
    this.particlePositions = new Float32Array(count * 3);
    this.particleVelocities = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Cling to hexagonal perimeter with random radial angle
      const angle = Math.random() * Math.PI * 2;
      const r = hexRadius * (0.85 + Math.random() * 0.35);
      this.particlePositions[i * 3 + 0] = Math.cos(angle) * r;
      this.particlePositions[i * 3 + 1] = Math.sin(angle) * r;
      this.particlePositions[i * 3 + 2] = -Math.random() * this.tunnelLength;
      this.particleVelocities[i] = 1.0 + Math.random() * 2.0;
    }

    pGeo.setAttribute('position', new THREE.BufferAttribute(this.particlePositions, 3));

    const pMat = new THREE.PointsMaterial({
      color: 0x00E5FF,
      size: 0.06,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });
    this.particlesMesh = new THREE.Points(pGeo, pMat);
    this.group.add(this.particlesMesh);

    // --- 3. 4 Specialized Audit Nodes ("SYNTAX", "SEMANTICS", "DRIFT", "BUDGET") ---
    this.auditNodesGroup = new THREE.Group();
    const auditLabels = ['AUDIT 01: SYNTAX', 'AUDIT 02: SEMANTICS', 'AUDIT 03: ZERO DRIFT', 'AUDIT 04: GPU BUDGET'];
    const auditColors = [0x00E5FF, 0x5322FF, 0x00E5FF, 0xffd700];

    for (let a = 0; a < 4; a++) {
      const angle = (a * Math.PI) / 2 + Math.PI / 4;
      const nodeGeo = new THREE.OctahedronGeometry(0.35);
      const nodeMat = new THREE.MeshStandardMaterial({
        color: auditColors[a],
        emissive: auditColors[a],
        emissiveIntensity: 0.8,
        roughness: 0.2,
        metalness: 0.9,
      });
      const node = new THREE.Mesh(nodeGeo, nodeMat);
      const nr = 2.4;
      node.position.set(Math.cos(angle) * nr, Math.sin(angle) * nr, -6);
      this.nodeMeshes.push(node);
      this.auditNodesGroup.add(node);
    }
    this.group.add(this.auditNodesGroup);

    this.group.position.set(0, 1.8, 0);
  }

  public update(time: number, frame: number, delta: number): { zShake: number } {
    const speed = ACT4_CONFIG.tunnelSpeed * 18;
    const zOffset = (time * speed) % this.ringSpacing;

    // Animate hexagonal rings advancing along Z toward camera
    for (let i = 0; i < this.numRings; i++) {
      const z = -i * this.ringSpacing + zOffset;
      this.dummy.position.set(0, 0, z);
      this.dummy.rotation.z = time * 0.4 + i * 0.08;
      // Scale rings as they approach camera
      const s = 1.0 + Math.max(0, (z + 20) / 30) * 0.2;
      this.dummy.scale.set(s, s, 1);
      this.dummy.updateMatrix();
      this.ringMesh.setMatrixAt(i, this.dummy.matrix);
    }
    this.ringMesh.instanceMatrix.needsUpdate = true;

    // Animate high-speed energy particles
    const positions = this.particlePositions;
    const vels = this.particleVelocities;
    const count = ACT4_CONFIG.particleDensity;

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      positions[idx + 2] += vels[i] * speed * delta * 1.5;
      if (positions[idx + 2] > 2.0) {
        // Reset to deep tunnel background
        positions[idx + 2] = -this.tunnelLength;
      }
    }
    this.particlesMesh.geometry.attributes.position.needsUpdate = true;

    // Rotate Audit Nodes & pulse glow
    this.auditNodesGroup.rotation.z = time * 0.6;
    this.nodeMeshes.forEach((n, idx) => {
      n.rotation.x = time * 2 + idx;
      n.rotation.y = time * 1.5 + idx;
    });

    // 120 BPM camera Z-shake pulse: BPM 120 = 2 Hz (period 0.5s)
    const beatFraction = (time % 0.5) / 0.5; // 0.0 to 1.0 each beat
    const zShake = Math.exp(-beatFraction * 8) * 0.12 * Math.sin(beatFraction * 24);

    return { zShake };
  }

  public setVisible(v: boolean) {
    this.group.visible = v;
  }

  public dispose() {
    this.ringMesh.geometry.dispose();
    (this.ringMesh.material as THREE.Material).dispose();
    this.particlesMesh.geometry.dispose();
    (this.particlesMesh.material as THREE.Material).dispose();
    this.nodeMeshes.forEach((n) => {
      n.geometry.dispose();
      (n.material as THREE.Material).dispose();
    });
  }
}
