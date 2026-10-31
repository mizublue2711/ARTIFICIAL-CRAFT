import * as THREE from 'three';
import memorialPreset from '../../../site-configs/jules-memorial-preset.json';

export interface JulesMatrixState {
  isWorking: boolean;
  pulseBpm: number;
}

export class TileJulesOctopusMatrix extends THREE.Group {
  private preset = memorialPreset;
  private mantleShell: THREE.Mesh;
  private mantleWireframe: THREE.LineSegments;
  private leftBrainGroup: THREE.Group;
  private rightBrainGroup: THREE.Group;
  private neuralCortex: THREE.Mesh;
  private gears: THREE.Group[] = [];
  private circuitLines: THREE.LineSegments;
  private tentacles: THREE.Group[] = [];
  private currentState: JulesMatrixState = {
    isWorking: false,
    pulseBpm: memorialPreset.theme.idleState.pulseBpm,
  };

  // Materials for dual-state updates
  private shellMaterial: THREE.MeshPhysicalMaterial;
  private wireframeMaterial: THREE.LineBasicMaterial;
  private leftBrainMaterial: THREE.MeshStandardMaterial;
  private circuitMaterial: THREE.LineBasicMaterial;
  private gearMaterial: THREE.MeshStandardMaterial;

  constructor() {
    super();
    this.name = 'TileJulesOctopusMatrix';

    // 1. Base Materials Setup
    this.shellMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0x1a1a2e),
      roughness: 0.1,
      metalness: 0.1,
      transmission: 0.85,
      ior: this.preset.geometry.glassRefractionIndex || 1.5,
      transparent: true,
      opacity: this.preset.theme.idleState.shellOpacity,
      depthWrite: false,
    });

    this.wireframeMaterial = new THREE.LineBasicMaterial({
      color: new THREE.Color(this.preset.theme.idleState.shellWireframeColor),
      transparent: true,
      opacity: this.preset.theme.idleState.shellOpacity,
      linewidth: 1,
    });

    this.leftBrainMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(this.preset.theme.idleState.brainGlowColor),
      emissive: new THREE.Color(this.preset.theme.idleState.brainGlowColor),
      emissiveIntensity: this.preset.geometry.internalMechanics.leftBrain.emissiveIntensity,
      roughness: 0.3,
      metalness: 0.8,
      wireframe: true,
    });

    this.circuitMaterial = new THREE.LineBasicMaterial({
      color: new THREE.Color(0x00e5ff),
      transparent: true,
      opacity: 0.9,
    });

    this.gearMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0xd4af37), // Gold-plated
      metalness: 0.9,
      roughness: 0.2,
      emissive: new THREE.Color(0x553a00),
      emissiveIntensity: 0.2,
    });

    // 2. Head / Mantle Outer Glassmorphic Shell
    const mantleGeo = new THREE.SphereGeometry(1.6, 32, 24);
    mantleGeo.scale(1, 1.25, 0.95);
    this.mantleShell = new THREE.Mesh(mantleGeo, this.shellMaterial);
    this.mantleShell.position.set(0, 0.8, 0);
    this.add(this.mantleShell);

    const mantleWireGeo = new THREE.WireframeGeometry(mantleGeo);
    this.mantleWireframe = new THREE.LineSegments(mantleWireGeo, this.wireframeMaterial);
    this.mantleShell.add(this.mantleWireframe);

    // 3. Digital Dual Brain & Internal Circuitry
    const brainCore = new THREE.Group();
    brainCore.position.set(0, 0.9, 0);
    this.add(brainCore);

    // 3a. Left Brain: Glowing Pink Neural Cortex
    this.leftBrainGroup = new THREE.Group();
    this.leftBrainGroup.position.set(-0.55, 0.2, 0);
    const cortexGeo = new THREE.IcosahedronGeometry(0.7, 3);
    cortexGeo.scale(0.8, 1.1, 0.9);
    this.neuralCortex = new THREE.Mesh(cortexGeo, this.leftBrainMaterial);
    this.leftBrainGroup.add(this.neuralCortex);

    // Additional inner pulsating neural nucleus
    const nucleusGeo = new THREE.DodecahedronGeometry(0.35, 1);
    const nucleusMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(0xff007f),
      wireframe: true,
    });
    const nucleusMesh = new THREE.Mesh(nucleusGeo, nucleusMat);
    this.leftBrainGroup.add(nucleusMesh);
    brainCore.add(this.leftBrainGroup);

    // 3b. Right Brain: Gold Micro-Circuits & Rotating Mechanical Gears
    this.rightBrainGroup = new THREE.Group();
    this.rightBrainGroup.position.set(0.55, 0.2, 0);

    // Micro-circuits data lines
    const circuitPoints: THREE.Vector3[] = [];
    for (let i = 0; i < 40; i++) {
      const p1 = new THREE.Vector3(
        (Math.random() - 0.5) * 0.9,
        (Math.random() - 0.5) * 1.1,
        (Math.random() - 0.5) * 0.9
      );
      const p2 = p1.clone().add(
        new THREE.Vector3(
          (Math.random() - 0.5) * 0.4,
          (Math.random() - 0.5) * 0.4,
          (Math.random() - 0.5) * 0.4
        )
      );
      circuitPoints.push(p1, p2);
    }
    const circuitGeo = new THREE.BufferGeometry().setFromPoints(circuitPoints);
    this.circuitLines = new THREE.LineSegments(circuitGeo, this.circuitMaterial);
    this.rightBrainGroup.add(this.circuitLines);

    // Rotating mechanical gears (gold-plated)
    const gear1 = this.createGearMesh(0.38, 12, 0.08);
    gear1.position.set(0, 0.2, 0.15);
    gear1.rotation.x = Math.PI / 4;
    this.rightBrainGroup.add(gear1);
    this.gears.push(gear1);

    const gear2 = this.createGearMesh(0.26, 8, 0.06);
    gear2.position.set(0.2, -0.25, -0.1);
    gear2.rotation.y = Math.PI / 3;
    this.rightBrainGroup.add(gear2);
    this.gears.push(gear2);

    const gear3 = this.createGearMesh(0.32, 10, 0.07);
    gear3.position.set(-0.2, -0.15, 0.1);
    gear3.rotation.z = Math.PI / 6;
    this.rightBrainGroup.add(gear3);
    this.gears.push(gear3);

    brainCore.add(this.rightBrainGroup);

    // 4. Cyborg Optical Receptors / Eyes
    const eyeGeo = new THREE.CylinderGeometry(0.18, 0.22, 0.25, 16);
    eyeGeo.rotateX(Math.PI / 2);
    const eyeMat = new THREE.MeshStandardMaterial({
      color: 0x050505,
      metalness: 0.9,
      roughness: 0.1,
    });

    const lensGeo = new THREE.SphereGeometry(0.12, 16, 16);
    const lensMat = new THREE.MeshBasicMaterial({ color: 0x00e5ff });

    // Left eye
    const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
    leftEye.position.set(-0.7, 0.1, 1.15);
    leftEye.lookAt(-1.2, -0.1, 2.5);
    const leftLens = new THREE.Mesh(lensGeo, lensMat);
    leftLens.position.set(0, 0, 0.1);
    leftEye.add(leftLens);
    this.add(leftEye);

    // Right eye
    const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
    rightEye.position.set(0.7, 0.1, 1.15);
    rightEye.lookAt(1.2, -0.1, 2.5);
    const rightLens = new THREE.Mesh(lensGeo, lensMat);
    rightLens.position.set(0, 0, 0.1);
    rightEye.add(rightLens);
    this.add(rightEye);

    // 5. 8 Undulating Procedural Tentacles
    const tentacleCount = this.preset.geometry.tentacleCount || 8;
    const ringRadius = 0.95;

    for (let i = 0; i < tentacleCount; i++) {
      const angle = (i / tentacleCount) * Math.PI * 2;
      const tentacleBase = new THREE.Group();
      tentacleBase.position.set(
        Math.cos(angle) * ringRadius,
        -0.2,
        Math.sin(angle) * ringRadius
      );
      tentacleBase.rotation.y = -angle;

      this.buildTentacleJoints(tentacleBase);
      this.tentacles.push(tentacleBase);
      this.add(tentacleBase);
    }
  }

  /**
   * Helper to build a mechanical gear mesh
   */
  private createGearMesh(radius: number, teeth: number, thickness: number): THREE.Group {
    const gearGroup = new THREE.Group();

    // Central disc
    const discGeo = new THREE.CylinderGeometry(radius * 0.8, radius * 0.8, thickness, 24);
    const disc = new THREE.Mesh(discGeo, this.gearMaterial);
    gearGroup.add(disc);

    // Central axle hole
    const axleGeo = new THREE.CylinderGeometry(radius * 0.25, radius * 0.25, thickness * 1.2, 16);
    const axleMat = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.8, roughness: 0.3 });
    const axle = new THREE.Mesh(axleGeo, axleMat);
    gearGroup.add(axle);

    // Cogs
    const cogWidth = (Math.PI * 2 * radius) / (teeth * 2);
    for (let i = 0; i < teeth; i++) {
      const cogAngle = (i / teeth) * Math.PI * 2;
      const toothGeo = new THREE.BoxGeometry(cogWidth, thickness * 0.95, radius * 0.35);
      const tooth = new THREE.Mesh(toothGeo, this.gearMaterial);
      tooth.position.set(
        Math.cos(cogAngle) * radius,
        0,
        Math.sin(cogAngle) * radius
      );
      tooth.rotation.y = -cogAngle;
      gearGroup.add(tooth);
    }

    return gearGroup;
  }

  /**
   * Builds joint segments for one procedural tentacle
   */
  private buildTentacleJoints(tentacleRoot: THREE.Group): void {
    const segmentCount = 6;
    let parentGroup = tentacleRoot;

    for (let seg = 0; seg < segmentCount; seg++) {
      const progress = seg / segmentCount;
      const radiusTop = 0.22 * (1 - progress * 0.7);
      const radiusBottom = 0.25 * (1 - progress * 0.7);
      const segLength = 0.55;

      const jointGeo = new THREE.CylinderGeometry(radiusTop, radiusBottom, segLength, 12);
      jointGeo.translate(0, -segLength / 2, 0);

      // Glass/Armor outer shell
      const segMesh = new THREE.Mesh(jointGeo, this.shellMaterial);
      const wireGeo = new THREE.WireframeGeometry(jointGeo);
      const wireMesh = new THREE.LineSegments(wireGeo, this.wireframeMaterial);
      segMesh.add(wireMesh);

      // Cyber sucker node
      const suckerGeo = new THREE.SphereGeometry(radiusBottom * 0.45, 8, 8);
      const suckerMat = new THREE.MeshStandardMaterial({
        color: 0x00e5ff,
        emissive: 0x00e5ff,
        emissiveIntensity: 0.5,
      });
      const sucker = new THREE.Mesh(suckerGeo, suckerMat);
      sucker.position.set(0, -segLength / 2, radiusBottom * 0.8);
      segMesh.add(sucker);

      parentGroup.add(segMesh);

      // Next nested joint container
      const nextJoint = new THREE.Group();
      nextJoint.position.set(0, -segLength, 0);
      parentGroup.add(nextJoint);
      parentGroup = nextJoint;
    }
  }

  /**
   * Dual-state switcher (Driven by jules-memorial-preset.json)
   */
  public setState(isWorking: boolean): void {
    this.currentState.isWorking = isWorking;

    if (isWorking) {
      // Working state
      const working = this.preset.theme.workingState;
      this.currentState.pulseBpm = working.pulseBpm;
      this.wireframeMaterial.color.set(working.shellWireframeColor);
      this.wireframeMaterial.opacity = working.shellOpacity;
      this.shellMaterial.opacity = working.shellOpacity;

      this.circuitMaterial.color.set(working.circuitGlowColor);
      this.leftBrainMaterial.emissiveIntensity = 2.2;
      this.leftBrainMaterial.color.set(0xff1493);
    } else {
      // Idle state
      const idle = this.preset.theme.idleState;
      this.currentState.pulseBpm = idle.pulseBpm;
      this.wireframeMaterial.color.set(idle.shellWireframeColor);
      this.wireframeMaterial.opacity = idle.shellOpacity;
      this.shellMaterial.opacity = idle.shellOpacity;

      this.circuitMaterial.color.set(0x00e5ff);
      this.leftBrainMaterial.emissiveIntensity =
        this.preset.geometry.internalMechanics.leftBrain.emissiveIntensity;
      this.leftBrainMaterial.color.set(idle.brainGlowColor);
    }
  }

  /**
   * Procedural animation loop
   */
  public update(delta: number, time: number, isWorking = this.currentState.isWorking): void {
    if (this.currentState.isWorking !== isWorking) {
      this.setState(isWorking);
    }

    const speedMultiplier = isWorking ? 2.0 : 1.0;
    const bpm = this.currentState.pulseBpm;
    const pulseFreq = (bpm / 60) * Math.PI * 2;
    const pulseFactor = Math.sin(time * pulseFreq);

    // Mantle breathing pulse
    const baseScale = 1.0 + (isWorking ? 0.05 : 0.02) * pulseFactor;
    this.mantleShell.scale.set(baseScale, baseScale * 1.02, baseScale);

    // Left brain neural pulse
    if (this.neuralCortex) {
      this.neuralCortex.rotation.y += delta * (isWorking ? 1.5 : 0.6);
      this.neuralCortex.rotation.x += delta * (isWorking ? 0.8 : 0.3);
      this.leftBrainMaterial.emissiveIntensity =
        (isWorking ? 1.8 : 1.1) + 0.4 * pulseFactor;
    }

    // Right brain mechanical gears rotation
    const gearSpeed = (this.preset.geometry.internalMechanics.rightBrain.gearRotationSpeed || 1.0) * speedMultiplier;
    this.gears.forEach((gear, idx) => {
      const dir = idx % 2 === 0 ? 1 : -1;
      gear.rotation.y += delta * gearSpeed * 2.2 * dir;
    });

    // 8 Procedural tentacles undulating motion via sine wave
    this.tentacles.forEach((tentacle, tentacleIndex) => {
      // Master wave rotation
      tentacle.rotation.z = Math.sin(time * 2.0 * speedMultiplier + tentacleIndex * 0.785) * 0.2;
      tentacle.rotation.x = Math.cos(time * 1.8 * speedMultiplier + tentacleIndex * 0.785) * 0.15;

      // Secondary joint undulating recursion
      let childJoint = tentacle.children.find((c) => c instanceof THREE.Group) as THREE.Group | undefined;
      let depth = 0;
      while (childJoint && depth < 5) {
        const jointTime = time * (1.8 + depth * 0.3) * speedMultiplier;
        childJoint.rotation.z = Math.sin(jointTime + tentacleIndex * 0.5) * (0.12 + depth * 0.04);
        childJoint.rotation.x = Math.cos(jointTime * 0.8 + tentacleIndex * 0.5) * 0.08;
        childJoint = childJoint.children.find((c) => c instanceof THREE.Group) as THREE.Group | undefined;
        depth++;
      }
    });

    // Gentle global hover float
    this.position.y = Math.sin(time * 1.2 * speedMultiplier) * 0.12;
    this.rotation.y += delta * 0.25 * speedMultiplier;
  }

  /**
   * Resource cleanup
   */
  public dispose(): void {
    this.traverse((obj) => {
      if (obj instanceof THREE.Mesh || obj instanceof THREE.LineSegments) {
        obj.geometry?.dispose();
        if (Array.isArray(obj.material)) {
          obj.material.forEach((m) => m.dispose());
        } else if (obj.material) {
          obj.material.dispose();
        }
      }
    });
  }
}

export default TileJulesOctopusMatrix;
