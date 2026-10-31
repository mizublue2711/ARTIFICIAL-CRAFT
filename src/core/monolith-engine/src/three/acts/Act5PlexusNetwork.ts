import * as THREE from 'three';

/**
 * Act 5: The Call to Action (00:24 – 00:30)
 * MotionKey: Proximity Node Linking, Attractor Field Physics, Organic Particle Swarm,
 * Velocity Interpolation, Spatial Hash Grid.
 * Aesthetic: Clean Tech Plexus Network.
 */

export const ACT5_CONFIG = {
  nodeCount: 200,
  maxDistance: 1.8, // 3D units equivalent to proximity threshold
  pulseInterval: 60, // frames
  coreColor: '#5322FF',
  lineColor: '#00E5FF',
};

interface PlexusNode {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  baseRadius: number;
  theta: number;
  phi: number;
  orbitSpeed: number;
}

export class Act5PlexusNetwork {
  public group: THREE.Group;
  private nodes: PlexusNode[] = [];
  private pointsMesh: THREE.Points;
  private linesMesh: THREE.LineSegments;
  private linePositions: Float32Array;
  private lineColors: Float32Array;
  private maxLines = 1200;

  // Central Gravitational Core Mesh
  private coreMesh: THREE.Mesh;

  // Elastic expansion pulse state
  private pulseProgress: number = 0;

  constructor() {
    this.group = new THREE.Group();

    // 1. Central Gravitational Core
    const coreGeo = new THREE.IcosahedronGeometry(0.7, 2);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x5322FF,
      emissive: 0x5322FF,
      emissiveIntensity: 0.9,
      roughness: 0.15,
      metalness: 0.8,
      wireframe: true,
    });
    this.coreMesh = new THREE.Mesh(coreGeo, coreMat);
    this.group.add(this.coreMesh);

    // 2. 200 Autonomous Data Nodes
    const count = ACT5_CONFIG.nodeCount;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const radius = 1.2 + Math.random() * 2.8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      this.nodes.push({
        x, y, z,
        vx: (Math.random() - 0.5) * 0.02,
        vy: (Math.random() - 0.5) * 0.02,
        vz: (Math.random() - 0.5) * 0.02,
        baseRadius: radius,
        theta,
        phi,
        orbitSpeed: (0.4 + Math.random() * 0.6) * (Math.random() > 0.5 ? 1 : -1),
      });

      positions[i * 3 + 0] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
    }

    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0x00E5FF,
      size: 0.08,
      transparent: true,
      opacity: 0.9,
    });
    this.pointsMesh = new THREE.Points(pGeo, pMat);
    this.group.add(this.pointsMesh);

    // 3. Dynamic Vector Connecting Lines
    const lGeo = new THREE.BufferGeometry();
    this.linePositions = new Float32Array(this.maxLines * 6);
    this.lineColors = new Float32Array(this.maxLines * 6);

    lGeo.setAttribute('position', new THREE.BufferAttribute(this.linePositions, 3));
    lGeo.setAttribute('color', new THREE.BufferAttribute(this.lineColors, 3));

    const lMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });
    this.linesMesh = new THREE.LineSegments(lGeo, lMat);
    this.group.add(this.linesMesh);

    this.group.position.set(0, 2.0, 0);
  }

  public update(time: number, frame: number, delta: number) {
    // Rotate gravitational core
    this.coreMesh.rotation.y = time * 0.8;
    this.coreMesh.rotation.x = time * 0.5;

    // Trigger gravity pulse every 60 frames (1 second @ 60fps)
    const pulseFrame = frame % ACT5_CONFIG.pulseInterval;
    const pulsePhase = pulseFrame / ACT5_CONFIG.pulseInterval; // 0 to 1
    // Elastic spring formula for expansion then snap-back
    const pulseExpand = Math.sin(pulsePhase * Math.PI) * Math.exp(-pulsePhase * 3) * 1.8;

    const count = this.nodes.length;
    const pAttr = this.pointsMesh.geometry.attributes.position;
    const posArr = pAttr.array as Float32Array;

    // Update node orbits and positions
    for (let i = 0; i < count; i++) {
      const node = this.nodes[i];
      node.theta += node.orbitSpeed * delta * 0.8;

      const currentR = node.baseRadius + pulseExpand;
      node.x = currentR * Math.sin(node.phi) * Math.cos(node.theta);
      node.y = currentR * Math.sin(node.phi) * Math.sin(node.theta);
      node.z = currentR * Math.cos(node.phi);

      posArr[i * 3 + 0] = node.x;
      posArr[i * 3 + 1] = node.y;
      posArr[i * 3 + 2] = node.z;
    }
    pAttr.needsUpdate = true;

    // Proximity Node Linking (< maxDistance)
    let lineIdx = 0;
    const maxDist = ACT5_CONFIG.maxDistance;
    const maxDistSq = maxDist * maxDist;

    const colorCyan = new THREE.Color(ACT5_CONFIG.lineColor);
    const colorViolet = new THREE.Color(ACT5_CONFIG.coreColor);
    const tempColor = new THREE.Color();

    for (let i = 0; i < count && lineIdx < this.maxLines; i++) {
      const ni = this.nodes[i];
      for (let j = i + 1; j < count && lineIdx < this.maxLines; j++) {
        const nj = this.nodes[j];
        const dx = ni.x - nj.x;
        const dy = ni.y - nj.y;
        const dz = ni.z - nj.z;
        const distSq = dx * dx + dy * dy + dz * dz;

        if (distSq < maxDistSq) {
          const dist = Math.sqrt(distSq);
          const alpha = 1.0 - dist / maxDist;

          // Color blend based on proximity
          tempColor.lerpColors(colorCyan, colorViolet, 1.0 - alpha);

          const ptr = lineIdx * 6;
          // Point A
          this.linePositions[ptr + 0] = ni.x;
          this.linePositions[ptr + 1] = ni.y;
          this.linePositions[ptr + 2] = ni.z;
          this.lineColors[ptr + 0] = tempColor.r * alpha;
          this.lineColors[ptr + 1] = tempColor.g * alpha;
          this.lineColors[ptr + 2] = tempColor.b * alpha;

          // Point B
          this.linePositions[ptr + 3] = nj.x;
          this.linePositions[ptr + 4] = nj.y;
          this.linePositions[ptr + 5] = nj.z;
          this.lineColors[ptr + 3] = tempColor.r * alpha;
          this.lineColors[ptr + 4] = tempColor.g * alpha;
          this.lineColors[ptr + 5] = tempColor.b * alpha;

          lineIdx++;
        }
      }
    }

    // Zero out unused line segments
    for (let k = lineIdx * 6; k < this.maxLines * 6; k++) {
      this.linePositions[k] = 0;
      this.lineColors[k] = 0;
    }

    this.linesMesh.geometry.attributes.position.needsUpdate = true;
    this.linesMesh.geometry.attributes.color.needsUpdate = true;
  }

  public setVisible(v: boolean) {
    this.group.visible = v;
  }

  public dispose() {
    this.coreMesh.geometry.dispose();
    (this.coreMesh.material as THREE.Material).dispose();
    this.pointsMesh.geometry.dispose();
    (this.pointsMesh.material as THREE.Material).dispose();
    this.linesMesh.geometry.dispose();
    (this.linesMesh.material as THREE.Material).dispose();
  }
}
