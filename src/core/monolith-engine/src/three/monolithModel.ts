import * as THREE from 'three';
import { ProceduralTextureManager } from './proceduralTextures';

/**
 * Composite 7-part procedural Monolith Model.
 * Implements smooth spring-damped Exploded View (0% - 100%),
 * PBR materials with anisotropic carbon, brushed metal, gold PCB traces,
 * glowing sapphire crystal neural core, and live telemetry typographic ribbons.
 */
export class MonolithModel {
  public group: THREE.Group;
  private textures: ProceduralTextureManager;

  // Component parts for exploded view expansion
  private leftArmorPlate!: THREE.Mesh;
  private rightArmorPlate!: THREE.Mesh;
  private neuralCore!: THREE.Mesh;
  private coreInnerGlow!: THREE.Mesh;
  private pcbBoards: THREE.Mesh[] = [];
  private heatSinks: THREE.Mesh[] = [];
  private ribbonMesh!: THREE.Mesh;
  private laserHeads: THREE.Group[] = [];
  private basePedestal!: THREE.Mesh;
  private contactShadowPlane!: THREE.Mesh;

  // Materials for disposal and animation
  private ribbonUpdater?: (t: number, f: number) => void;
  private coreMaterial!: THREE.MeshPhysicalMaterial;
  private armorMaterial!: THREE.MeshStandardMaterial;
  private goldPcbMaterial!: THREE.MeshStandardMaterial;

  // Exploded view animation state
  private currentExplodeProgress: number = 0;
  private targetExplodeProgress: number = 0;

  constructor(renderer: THREE.WebGLRenderer) {
    this.group = new THREE.Group();
    this.textures = new ProceduralTextureManager(renderer);

    this.buildModel();
  }

  private buildModel() {
    const carbonTex = this.textures.createCarbonWeaveTexture();
    const normalTex = this.textures.createBrushedMetalNormalMap();
    const pcbTex = this.textures.createPCBTracesTexture();
    const shadowTex = this.textures.createContactShadowTexture();
    const { texture: ribbonTex, update: updateRibbon } = this.textures.createMonolithTelemetryRibbon();
    this.ribbonUpdater = updateRibbon;

    // --- 1. Base Ground Contact Shadow & Technical Pedestal ---
    const shadowGeo = new THREE.PlaneGeometry(6, 4);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      opacity: 0.65,
      depthWrite: false,
    });
    this.contactShadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    this.contactShadowPlane.rotation.x = -Math.PI / 2;
    this.contactShadowPlane.position.y = 0.01; // Avoid z-fighting
    this.group.add(this.contactShadowPlane);

    // Grounding CAD base pedestal
    const pedestalGeo = new THREE.CylinderGeometry(1.6, 1.8, 0.12, 8);
    const pedestalMat = new THREE.MeshStandardMaterial({
      color: 0x0a0c14,
      metalness: 0.9,
      roughness: 0.25,
      normalMap: normalTex,
    });
    this.basePedestal = new THREE.Mesh(pedestalGeo, pedestalMat);
    this.basePedestal.position.y = 0.06;
    this.basePedestal.receiveShadow = true;
    this.group.add(this.basePedestal);

    // --- 2. Primary Silhouette: Dual Beveled Armor Chassis (Left & Right) ---
    // Outer armor: Matte anisotropic graphite with chamfers
    this.armorMaterial = new THREE.MeshStandardMaterial({
      color: 0x11131a,
      roughness: 0.35,
      metalness: 0.85,
      map: carbonTex,
      normalMap: normalTex,
      normalScale: new THREE.Vector2(0.5, 0.5),
    });

    const pillarWidth = 0.55;
    const pillarHeight = 3.6;
    const pillarDepth = 0.7;

    // Left armor pillar
    const leftArmorGeo = new THREE.BoxGeometry(pillarWidth, pillarHeight, pillarDepth);
    this.leftArmorPlate = new THREE.Mesh(leftArmorGeo, this.armorMaterial);
    this.leftArmorPlate.position.set(-0.42, pillarHeight / 2 + 0.12, 0);
    this.leftArmorPlate.castShadow = true;
    this.leftArmorPlate.receiveShadow = true;
    this.group.add(this.leftArmorPlate);

    // Right armor pillar
    const rightArmorGeo = new THREE.BoxGeometry(pillarWidth, pillarHeight, pillarDepth);
    this.rightArmorPlate = new THREE.Mesh(rightArmorGeo, this.armorMaterial);
    this.rightArmorPlate.position.set(0.42, pillarHeight / 2 + 0.12, 0);
    this.rightArmorPlate.castShadow = true;
    this.rightArmorPlate.receiveShadow = true;
    this.group.add(this.rightArmorPlate);

    // --- 3. Secondary Read: Luminescent Neural Core (Center) ---
    // Faceted crystalline core with transmission and inner emissive refraction
    this.coreMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x00E5FF,
      emissive: 0x5322FF,
      emissiveIntensity: 0.6,
      roughness: 0.1,
      metalness: 0.1,
      transmission: 0.85,
      ior: 1.55,
      thickness: 1.2,
      transparent: true,
      opacity: 0.95,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
    });

    const coreGeo = new THREE.OctahedronGeometry(0.55, 1);
    this.neuralCore = new THREE.Mesh(coreGeo, this.coreMaterial);
    this.neuralCore.scale.set(0.7, 2.6, 0.6);
    this.neuralCore.position.set(0, pillarHeight / 2 + 0.12, 0);
    this.group.add(this.neuralCore);

    // Inner glowing core kernel
    const kernelGeo = new THREE.BoxGeometry(0.18, 2.2, 0.18);
    const kernelMat = new THREE.MeshBasicMaterial({
      color: 0x00E5FF,
    });
    this.coreInnerGlow = new THREE.Mesh(kernelGeo, kernelMat);
    this.coreInnerGlow.position.set(0, pillarHeight / 2 + 0.12, 0);
    this.group.add(this.coreInnerGlow);

    // --- 4. Sub-layer Circuits: Gold-plated PCB Logic Bus Interconnects ---
    this.goldPcbMaterial = new THREE.MeshStandardMaterial({
      map: pcbTex,
      roughness: 0.2,
      metalness: 0.8,
      normalMap: normalTex,
    });

    for (let i = 0; i < 4; i++) {
      const pcbGeo = new THREE.BoxGeometry(0.32, 2.8, 0.04);
      const pcb = new THREE.Mesh(pcbGeo, this.goldPcbMaterial);
      const angle = (i * Math.PI) / 2;
      const radius = 0.38;
      pcb.position.set(Math.cos(angle) * radius, pillarHeight / 2 + 0.12, Math.sin(angle) * radius);
      pcb.rotation.y = angle;
      pcb.castShadow = true;
      this.pcbBoards.push(pcb);
      this.group.add(pcb);
    }

    // --- 5. Hexagonal Heat Dissipation Fins ---
    const heatFinMat = new THREE.MeshStandardMaterial({
      color: 0x1f2333,
      metalness: 0.95,
      roughness: 0.15,
      normalMap: normalTex,
    });

    for (let f = 0; f < 8; f++) {
      const finGeo = new THREE.BoxGeometry(0.9, 0.02, 0.8);
      const fin = new THREE.Mesh(finGeo, heatFinMat);
      fin.position.set(0, 0.6 + f * 0.35, 0);
      fin.castShadow = true;
      this.heatSinks.push(fin);
      this.group.add(fin);
    }

    // --- 6. Accent Detail: Monolith Typographic Waveguide Ribbon ---
    const ribbonGeo = new THREE.CylinderGeometry(0.72, 0.72, 0.45, 32, 1, true);
    const ribbonMat = new THREE.MeshBasicMaterial({
      map: ribbonTex,
      transparent: true,
      side: THREE.DoubleSide,
      opacity: 0.95,
    });
    this.ribbonMesh = new THREE.Mesh(ribbonGeo, ribbonMat);
    this.ribbonMesh.position.set(0, 2.2, 0);
    this.group.add(this.ribbonMesh);

    // Second lower ribbon
    const lowerRibbonGeo = new THREE.CylinderGeometry(0.68, 0.68, 0.35, 32, 1, true);
    const lowerRibbonMesh = new THREE.Mesh(lowerRibbonGeo, ribbonMat);
    lowerRibbonMesh.position.set(0, 1.1, 0);
    this.group.add(lowerRibbonMesh);

    // --- 7. Accent Detail: 4 Corner Optical Laser Caliper Heads ---
    for (let c = 0; c < 4; c++) {
      const headGroup = new THREE.Group();
      const headGeo = new THREE.CylinderGeometry(0.04, 0.06, 0.22, 8);
      const headMat = new THREE.MeshStandardMaterial({
        color: 0x24283b,
        metalness: 0.9,
        roughness: 0.2,
      });
      const headMesh = new THREE.Mesh(headGeo, headMat);
      headGroup.add(headMesh);

      // Cyan / Violet Laser emitter tip
      const tipGeo = new THREE.SphereGeometry(0.035, 8, 8);
      const tipMat = new THREE.MeshBasicMaterial({
        color: c % 2 === 0 ? 0x00E5FF : 0x5322FF,
      });
      const tipMesh = new THREE.Mesh(tipGeo, tipMat);
      tipMesh.position.y = 0.12;
      headGroup.add(tipMesh);

      // Laser beam line projecting downward
      const beamGeo = new THREE.CylinderGeometry(0.006, 0.006, 1.2, 6);
      const beamMat = new THREE.MeshBasicMaterial({
        color: c % 2 === 0 ? 0x00E5FF : 0x5322FF,
        transparent: true,
        opacity: 0.5,
      });
      const beamMesh = new THREE.Mesh(beamGeo, beamMat);
      beamMesh.position.y = -0.55;
      headGroup.add(beamMesh);

      const signX = c === 0 || c === 3 ? -1 : 1;
      const signZ = c === 0 || c === 1 ? -1 : 1;
      headGroup.position.set(signX * 0.72, pillarHeight + 0.12, signZ * 0.45);
      this.laserHeads.push(headGroup);
      this.group.add(headGroup);
    }

    // Set overall group scale and position
    this.group.position.y = 0;
  }

  public setExplodedProgress(target: number) {
    this.targetExplodeProgress = Math.max(0, Math.min(1, target));
  }

  public getExplodedProgress(): number {
    return this.currentExplodeProgress;
  }

  /**
   * Update animation loop with smooth damping (MathUtils.damp)
   */
  public update(time: number, frame: number, delta: number) {
    // Damped exploded view interpolation
    this.currentExplodeProgress = THREE.MathUtils.damp(
      this.currentExplodeProgress,
      this.targetExplodeProgress,
      8.0,
      delta
    );

    const exp = this.currentExplodeProgress;

    // Expand outer armor chassis outward along X and tilt outward slightly
    this.leftArmorPlate.position.x = -0.42 - exp * 1.5;
    this.leftArmorPlate.position.z = -exp * 0.4;
    this.leftArmorPlate.rotation.z = exp * 0.15;

    this.rightArmorPlate.position.x = 0.42 + exp * 1.5;
    this.rightArmorPlate.position.z = -exp * 0.4;
    this.rightArmorPlate.rotation.z = -exp * 0.15;

    // Elevate and float the Neural Core vertically
    this.neuralCore.position.y = 3.6 / 2 + 0.12 + exp * 1.2;
    this.coreInnerGlow.position.y = this.neuralCore.position.y;
    this.neuralCore.rotation.y = time * 0.8;
    this.coreInnerGlow.rotation.y = -time * 1.2;

    // Pulsing core emissive intensity
    const pulse = Math.sin(time * 3.5) * 0.25 + 0.75;
    this.coreMaterial.emissiveIntensity = pulse * (1 + exp * 0.5);

    // Expand PCB logic boards radially
    this.pcbBoards.forEach((pcb, i) => {
      const angle = (i * Math.PI) / 2;
      const baseRadius = 0.38;
      const r = baseRadius + exp * 1.0;
      pcb.position.set(Math.cos(angle) * r, 3.6 / 2 + 0.12 - exp * 0.3 * (i % 2 === 0 ? 1 : -1), Math.sin(angle) * r);
      pcb.rotation.y = angle + exp * 0.35 * (i % 2 === 0 ? 1 : -1);
    });

    // Expand heatsink fins vertically
    this.heatSinks.forEach((fin, idx) => {
      const baseY = 0.6 + idx * 0.35;
      fin.position.y = baseY + exp * (idx - 3.5) * 0.2;
      fin.scale.set(1 + exp * 0.25, 1, 1 + exp * 0.25);
    });

    // Rotate and elevate telemetry ribbons
    this.ribbonMesh.rotation.y = -time * 0.5;
    this.ribbonMesh.position.y = 2.2 + exp * 0.9;
    this.ribbonMesh.scale.set(1 + exp * 0.6, 1, 1 + exp * 0.6);

    // Caliper heads elevate and expand
    this.laserHeads.forEach((head, idx) => {
      const signX = idx === 0 || idx === 3 ? -1 : 1;
      const signZ = idx === 0 || idx === 1 ? -1 : 1;
      head.position.x = signX * (0.72 + exp * 0.8);
      head.position.z = signZ * (0.45 + exp * 0.8);
      head.position.y = 3.6 + 0.12 + exp * 0.7;
    });

    // Update dynamic scrolling telemetry canvas texture
    if (this.ribbonUpdater) {
      this.ribbonUpdater(time, frame);
    }
  }

  public dispose() {
    this.group.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        if (obj.geometry) obj.geometry.dispose();
        if (Array.isArray(obj.material)) {
          obj.material.forEach((m) => m.dispose());
        } else if (obj.material) {
          obj.material.dispose();
        }
      }
    });
  }
}
