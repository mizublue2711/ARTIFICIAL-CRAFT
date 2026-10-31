import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { ROBOT_COMPONENTS } from '../../data/robotAssembly';
import { MechanicalComponent } from '../../types/telemetry';
import { sfx } from '../../utils/audio';

interface RobotArmSceneProps {
  explodeProgress: number; // 0.0 to 1.0 (corresponds to 0% to 100%)
  wireframeMode: boolean;
  autoRotate: boolean;
  cameraPreset: 'isometric' | 'front' | 'side' | 'wrist_focus' | 'top';
  onSelectComponent: (component: MechanicalComponent | null) => void;
  selectedComponent: MechanicalComponent | null;
  laserTargetEnabled?: boolean;
}

interface ComponentMeshNode {
  data: MechanicalComponent;
  group: THREE.Group;
  initialPos: THREE.Vector3;
  targetExplodedOffset: THREE.Vector3;
  highlightMeshes: THREE.Mesh[];
  wireframeMeshes: THREE.LineSegments[];
}

export const RobotArmScene: React.FC<RobotArmSceneProps> = ({
  explodeProgress,
  wireframeMode,
  autoRotate,
  cameraPreset,
  onSelectComponent,
  selectedComponent,
  laserTargetEnabled = true,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hoveredNode, setHoveredNode] = useState<MechanicalComponent | null>(null);
  const [fpsReadout, setFpsReadout] = useState<number>(60);

  // References to keep mutable three.js state without tearing down WebGL canvas
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const nodesMapRef = useRef<Map<string, ComponentMeshNode>>(new Map());
  const hoveredNodeRef = useRef<MechanicalComponent | null>(null);
  const selectedNodeRef = useRef<MechanicalComponent | null>(null);
  const explodeProgressRef = useRef<number>(explodeProgress);
  const wireframeModeRef = useRef<boolean>(wireframeMode);
  const autoRotateRef = useRef<boolean>(autoRotate);
  const cameraPresetRef = useRef<string>(cameraPreset);

  // Laser beam & reticle objects
  const laserLineRef = useRef<THREE.Line | null>(null);
  const laserReticleRef = useRef<THREE.Group | null>(null);

  // Orbit controls math helpers without external library dependency
  const orbitStateRef = useRef({
    isDragging: false,
    prevPointerX: 0,
    prevPointerY: 0,
    spherical: { radius: 10.5, phi: Math.PI / 3.2, theta: Math.PI / 4.2 },
    targetSpherical: { radius: 10.5, phi: Math.PI / 3.2, theta: Math.PI / 4.2 },
    lookAt: new THREE.Vector3(0, 2.3, 0),
    targetLookAt: new THREE.Vector3(0, 2.3, 0),
  });

  // Keep refs in sync with incoming props
  useEffect(() => {
    explodeProgressRef.current = explodeProgress;
  }, [explodeProgress]);

  useEffect(() => {
    wireframeModeRef.current = wireframeMode;
    // Update wireframe visibility immediately
    nodesMapRef.current.forEach((node) => {
      node.wireframeMeshes.forEach((line) => {
        line.visible = wireframeMode;
      });
    });
  }, [wireframeMode]);

  useEffect(() => {
    autoRotateRef.current = autoRotate;
  }, [autoRotate]);

  useEffect(() => {
    selectedNodeRef.current = selectedComponent;
  }, [selectedComponent]);

  // Handle camera presets
  useEffect(() => {
    cameraPresetRef.current = cameraPreset;
    const orb = orbitStateRef.current;
    if (cameraPreset === 'isometric') {
      orb.targetSpherical = { radius: 10.5, phi: Math.PI / 3.2, theta: Math.PI / 4.2 };
      orb.targetLookAt.set(0, 2.3, 0);
    } else if (cameraPreset === 'front') {
      orb.targetSpherical = { radius: 10.0, phi: Math.PI / 2.05, theta: 0 };
      orb.targetLookAt.set(0, 2.3, 0);
    } else if (cameraPreset === 'side') {
      orb.targetSpherical = { radius: 10.0, phi: Math.PI / 2.05, theta: Math.PI / 2 };
      orb.targetLookAt.set(0, 2.3, 0);
    } else if (cameraPreset === 'wrist_focus') {
      orb.targetSpherical = { radius: 4.8, phi: Math.PI / 2.8, theta: Math.PI / 3.5 };
      orb.targetLookAt.set(0.8, 4.2, 0.7);
    } else if (cameraPreset === 'top') {
      orb.targetSpherical = { radius: 9.5, phi: 0.15, theta: Math.PI / 4 };
      orb.targetLookAt.set(0, 1.8, 0);
    }
  }, [cameraPreset]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect software WebGL
    const isSoftwareGl = (() => {
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

    // 1. Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x09090b);
    scene.fog = new THREE.FogExp2(0x09090b, 0.038);
    sceneRef.current = scene;

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(
      42,
      container.clientWidth / container.clientHeight,
      0.1,
      80
    );
    cameraRef.current = camera;

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: false,
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    container.appendChild(renderer.domElement);

    // 4. Studio Environment Lighting (RoomEnvironment)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 5. Studio Lighting Rig
    const ambientLight = new THREE.HemisphereLight(0x00e5ff, 0x09090b, 0.6);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.4);
    keyLight.position.set(6, 12, 8);
    keyLight.castShadow = !isSoftwareGl;
    if (keyLight.castShadow) {
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
      keyLight.shadow.camera.near = 0.5;
      keyLight.shadow.camera.far = 30;
      keyLight.shadow.camera.left = -6;
      keyLight.shadow.camera.right = 6;
      keyLight.shadow.camera.top = 7;
      keyLight.shadow.camera.bottom = -2;
      keyLight.shadow.bias = -0.0004;
      keyLight.shadow.normalBias = 0.02;
    }
    scene.add(keyLight);

    // Cool Electric Cyan Rim / Back light
    const cyanRim = new THREE.DirectionalLight(0x00e5ff, 1.8);
    cyanRim.position.set(-8, 6, -6);
    scene.add(cyanRim);

    // Electric Indigo Accent Light
    const indigoFill = new THREE.DirectionalLight(0x5322ff, 1.2);
    indigoFill.position.set(4, 2, -7);
    scene.add(indigoFill);

    // 6. Ground Platform & Tactile CAD Grid
    const groundGroup = new THREE.Group();
    scene.add(groundGroup);

    // Radial contact shadow under robot arm base
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 256;
    shadowCanvas.height = 256;
    const sCtx = shadowCanvas.getContext('2d')!;
    const grad = sCtx.createRadialGradient(128, 128, 10, 128, 128, 128);
    grad.addColorStop(0, 'rgba(0, 0, 0, 0.85)');
    grad.addColorStop(0.35, 'rgba(0, 0, 0, 0.45)');
    grad.addColorStop(0.7, 'rgba(0, 0, 0, 0.15)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    sCtx.fillStyle = grad;
    sCtx.fillRect(0, 0, 256, 256);

    const shadowTexture = new THREE.CanvasTexture(shadowCanvas);
    shadowTexture.colorSpace = THREE.SRGBColorSpace;
    const shadowPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(6.5, 6.5),
      new THREE.MeshBasicMaterial({
        map: shadowTexture,
        transparent: true,
        opacity: 0.65,
        depthWrite: false,
      })
    );
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = 0.005;
    groundGroup.add(shadowPlane);

    // Precision Industrial Floor Grid
    const gridHelper = new THREE.GridHelper(30, 30, 0x00e5ff, 0x27272a);
    gridHelper.position.y = 0;
    (gridHelper.material as THREE.Material).transparent = true;
    (gridHelper.material as THREE.Material).opacity = 0.28;
    groundGroup.add(gridHelper);

    // Tactical concentric measurement rings on floor
    const ringGeo1 = new THREE.RingGeometry(1.6, 1.62, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x00e5ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.35,
    });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat);
    ring1.rotation.x = -Math.PI / 2;
    ring1.position.y = 0.01;
    groundGroup.add(ring1);

    const ringGeo2 = new THREE.RingGeometry(3.2, 3.22, 64);
    const ring2 = new THREE.Mesh(ringGeo2, ringMat);
    ring2.rotation.x = -Math.PI / 2;
    ring2.position.y = 0.01;
    groundGroup.add(ring2);

    // 7. Laser Beam & Target Reticle Objects
    const laserMat = new THREE.LineBasicMaterial({
      color: 0x00e5ff,
      linewidth: 1,
      transparent: true,
      opacity: 0.9,
    });
    const laserGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 8, 4),
      new THREE.Vector3(0, 0, 0),
    ]);
    const laserLine = new THREE.Line(laserGeo, laserMat);
    laserLine.visible = false;
    scene.add(laserLine);
    laserLineRef.current = laserLine;

    const reticleGroup = new THREE.Group();
    const reticleRing = new THREE.Mesh(
      new THREE.RingGeometry(0.18, 0.2, 32),
      new THREE.MeshBasicMaterial({
        color: 0x00e5ff,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.95,
      })
    );
    reticleRing.rotation.x = -Math.PI / 2;
    reticleGroup.add(reticleRing);

    // 4 crosshair dashes
    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI) / 2;
      const dashGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(Math.cos(angle) * 0.22, 0, Math.sin(angle) * 0.22),
        new THREE.Vector3(Math.cos(angle) * 0.32, 0, Math.sin(angle) * 0.32),
      ]);
      const dashLine = new THREE.Line(dashGeo, laserMat);
      reticleGroup.add(dashLine);
    }
    reticleGroup.visible = false;
    scene.add(reticleGroup);
    laserReticleRef.current = reticleGroup;

    // 8. Shared PBR Material Palette
    const darkTitaniumMat = new THREE.MeshStandardMaterial({
      color: 0x141417,
      roughness: 0.28,
      metalness: 0.88,
    });

    const brushedAlloyMat = new THREE.MeshStandardMaterial({
      color: 0x27272a,
      roughness: 0.35,
      metalness: 0.82,
    });

    const harmonicGoldMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      roughness: 0.22,
      metalness: 0.92,
    });

    const carbonSparMat = new THREE.MeshStandardMaterial({
      color: 0x09090b,
      roughness: 0.55,
      metalness: 0.45,
    });

    const cyanGlowMat = new THREE.MeshBasicMaterial({
      color: 0x00e5ff,
    });

    const indigoAccentMat = new THREE.MeshStandardMaterial({
      color: 0x5322ff,
      roughness: 0.3,
      metalness: 0.7,
    });

    // 9. Procedural Hierarchical Assembly of Industrial Arm Components
    const rootAssembly = new THREE.Group();
    scene.add(rootAssembly);

    const nodesMap = new Map<string, ComponentMeshNode>();

    // Helper to create wireframe lines for any mesh
    const createWireframe = (mesh: THREE.Mesh, colorHex = 0x00e5ff) => {
      const edges = new THREE.EdgesGeometry(mesh.geometry);
      const line = new THREE.LineSegments(
        edges,
        new THREE.LineBasicMaterial({
          color: colorHex,
          transparent: true,
          opacity: 0.55,
        })
      );
      line.visible = wireframeModeRef.current;
      mesh.add(line);
      return line;
    };

    // Component 1: Base Turret
    {
      const compData = ROBOT_COMPONENTS.find((c) => c.id === 'base_turret')!;
      const group = new THREE.Group();
      group.position.set(...compData.position);

      const baseFlange = new THREE.Mesh(
        new THREE.CylinderGeometry(1.35, 1.45, 0.24, 32),
        darkTitaniumMat
      );
      baseFlange.castShadow = !isSoftwareGl;
      baseFlange.receiveShadow = !isSoftwareGl;
      group.add(baseFlange);

      // Cyan status ring
      const statusRing = new THREE.Mesh(
        new THREE.CylinderGeometry(1.32, 1.32, 0.04, 32),
        cyanGlowMat
      );
      statusRing.position.y = 0.12;
      group.add(statusRing);

      // Upper turntable turret cylinder
      const turretHousing = new THREE.Mesh(
        new THREE.CylinderGeometry(0.95, 1.15, 0.4, 32),
        brushedAlloyMat
      );
      turretHousing.position.y = 0.32;
      turretHousing.castShadow = !isSoftwareGl;
      group.add(turretHousing);

      // Perimeter bolts (Instanced or grouped)
      for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI * 2) / 8;
        const bolt = new THREE.Mesh(
          new THREE.CylinderGeometry(0.04, 0.04, 0.1, 8),
          harmonicGoldMat
        );
        bolt.position.set(Math.cos(angle) * 1.25, 0.15, Math.sin(angle) * 1.25);
        group.add(bolt);
      }

      const wf1 = createWireframe(baseFlange);
      const wf2 = createWireframe(turretHousing);

      rootAssembly.add(group);
      nodesMap.set(compData.id, {
        data: compData,
        group,
        initialPos: group.position.clone(),
        targetExplodedOffset: new THREE.Vector3(...compData.explodedOffset),
        highlightMeshes: [baseFlange, turretHousing],
        wireframeMeshes: [wf1, wf2],
      });
    }

    // Component 2: Shoulder Yoke
    {
      const compData = ROBOT_COMPONENTS.find((c) => c.id === 'shoulder_yoke')!;
      const group = new THREE.Group();
      group.position.set(...compData.position);

      // Yoke center hub
      const hub = new THREE.Mesh(
        new THREE.CylinderGeometry(0.72, 0.72, 0.5, 32),
        darkTitaniumMat
      );
      hub.rotation.x = Math.PI / 2;
      hub.castShadow = !isSoftwareGl;
      group.add(hub);

      // Harmonic Drive Outer Ring
      const hdRing = new THREE.Mesh(
        new THREE.CylinderGeometry(0.76, 0.76, 0.14, 32),
        harmonicGoldMat
      );
      hdRing.rotation.x = Math.PI / 2;
      group.add(hdRing);

      // Yoke Left Arm
      const leftArm = new THREE.Mesh(
        new THREE.BoxGeometry(0.32, 0.75, 0.22),
        indigoAccentMat
      );
      leftArm.position.set(-0.45, 0.3, 0);
      group.add(leftArm);

      // Yoke Right Arm
      const rightArm = new THREE.Mesh(
        new THREE.BoxGeometry(0.32, 0.75, 0.22),
        indigoAccentMat
      );
      rightArm.position.set(0.45, 0.3, 0);
      group.add(rightArm);

      const wf1 = createWireframe(hub);
      const wf2 = createWireframe(leftArm);
      const wf3 = createWireframe(rightArm);

      rootAssembly.add(group);
      nodesMap.set(compData.id, {
        data: compData,
        group,
        initialPos: group.position.clone(),
        targetExplodedOffset: new THREE.Vector3(...compData.explodedOffset),
        highlightMeshes: [hub, leftArm, rightArm],
        wireframeMeshes: [wf1, wf2, wf3],
      });
    }

    // Component 3: Port Shell [L]
    {
      const compData = ROBOT_COMPONENTS.find((c) => c.id === 'outer_bicep_shell_left')!;
      const group = new THREE.Group();
      group.position.set(...compData.position);

      const shellMesh = new THREE.Mesh(
        new THREE.BoxGeometry(0.18, 1.25, 0.5),
        new THREE.MeshStandardMaterial({
          color: 0x1f1f23,
          roughness: 0.32,
          metalness: 0.85,
        })
      );
      shellMesh.castShadow = !isSoftwareGl;
      group.add(shellMesh);

      // Cyan accent line
      const stripe = new THREE.Mesh(
        new THREE.BoxGeometry(0.2, 0.8, 0.03),
        cyanGlowMat
      );
      stripe.position.set(-0.02, 0, 0.25);
      group.add(stripe);

      const wf = createWireframe(shellMesh);
      rootAssembly.add(group);
      nodesMap.set(compData.id, {
        data: compData,
        group,
        initialPos: group.position.clone(),
        targetExplodedOffset: new THREE.Vector3(...compData.explodedOffset),
        highlightMeshes: [shellMesh],
        wireframeMeshes: [wf],
      });
    }

    // Component 4: Starboard Shell [R]
    {
      const compData = ROBOT_COMPONENTS.find((c) => c.id === 'outer_bicep_shell_right')!;
      const group = new THREE.Group();
      group.position.set(...compData.position);

      const shellMesh = new THREE.Mesh(
        new THREE.BoxGeometry(0.18, 1.25, 0.5),
        new THREE.MeshStandardMaterial({
          color: 0x1f1f23,
          roughness: 0.32,
          metalness: 0.85,
        })
      );
      shellMesh.castShadow = !isSoftwareGl;
      group.add(shellMesh);

      // Louver vents
      for (let i = -2; i <= 2; i++) {
        const vent = new THREE.Mesh(
          new THREE.BoxGeometry(0.2, 0.04, 0.3),
          darkTitaniumMat
        );
        vent.position.set(0.01, i * 0.16, 0);
        group.add(vent);
      }

      const wf = createWireframe(shellMesh);
      rootAssembly.add(group);
      nodesMap.set(compData.id, {
        data: compData,
        group,
        initialPos: group.position.clone(),
        targetExplodedOffset: new THREE.Vector3(...compData.explodedOffset),
        highlightMeshes: [shellMesh],
        wireframeMeshes: [wf],
      });
    }

    // Component 5: Carbon Bicep Core
    {
      const compData = ROBOT_COMPONENTS.find((c) => c.id === 'carbon_bicep_core')!;
      const group = new THREE.Group();
      group.position.set(...compData.position);

      const sparMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(0.24, 0.28, 1.35, 16),
        carbonSparMat
      );
      sparMesh.castShadow = !isSoftwareGl;
      group.add(sparMesh);

      // Internal bus conduit
      const conduit = new THREE.Mesh(
        new THREE.CylinderGeometry(0.06, 0.06, 1.4, 12),
        indigoAccentMat
      );
      conduit.position.x = 0.15;
      group.add(conduit);

      const wf = createWireframe(sparMesh);
      rootAssembly.add(group);
      nodesMap.set(compData.id, {
        data: compData,
        group,
        initialPos: group.position.clone(),
        targetExplodedOffset: new THREE.Vector3(...compData.explodedOffset),
        highlightMeshes: [sparMesh],
        wireframeMeshes: [wf],
      });
    }

    // Component 6: Elbow Harmonic Core
    {
      const compData = ROBOT_COMPONENTS.find((c) => c.id === 'elbow_harmonic_core')!;
      const group = new THREE.Group();
      group.position.set(...compData.position);

      const elbowCasing = new THREE.Mesh(
        new THREE.CylinderGeometry(0.55, 0.55, 0.42, 32),
        darkTitaniumMat
      );
      elbowCasing.rotation.z = Math.PI / 2;
      elbowCasing.castShadow = !isSoftwareGl;
      group.add(elbowCasing);

      // Flexspline gear teeth ring
      const flexspline = new THREE.Mesh(
        new THREE.CylinderGeometry(0.58, 0.58, 0.16, 32),
        harmonicGoldMat
      );
      flexspline.rotation.z = Math.PI / 2;
      group.add(flexspline);

      const wf1 = createWireframe(elbowCasing);
      const wf2 = createWireframe(flexspline);

      rootAssembly.add(group);
      nodesMap.set(compData.id, {
        data: compData,
        group,
        initialPos: group.position.clone(),
        targetExplodedOffset: new THREE.Vector3(...compData.explodedOffset),
        highlightMeshes: [elbowCasing, flexspline],
        wireframeMeshes: [wf1, wf2],
      });
    }

    // Component 7: Forearm Actuator Pack
    {
      const compData = ROBOT_COMPONENTS.find((c) => c.id === 'forearm_actuator_pack')!;
      const group = new THREE.Group();
      group.position.set(...compData.position);

      // 4 linear actuator cylinders
      const actuatorMeshes: THREE.Mesh[] = [];
      const wfMeshes: THREE.LineSegments[] = [];

      for (let i = 0; i < 4; i++) {
        const angle = (i * Math.PI * 2) / 4 + Math.PI / 4;
        const cyl = new THREE.Mesh(
          new THREE.CylinderGeometry(0.08, 0.08, 0.85, 16),
          brushedAlloyMat
        );
        cyl.position.set(Math.cos(angle) * 0.18, 0, Math.sin(angle) * 0.18);
        cyl.castShadow = !isSoftwareGl;
        group.add(cyl);
        actuatorMeshes.push(cyl);
        wfMeshes.push(createWireframe(cyl));
      }

      rootAssembly.add(group);
      nodesMap.set(compData.id, {
        data: compData,
        group,
        initialPos: group.position.clone(),
        targetExplodedOffset: new THREE.Vector3(...compData.explodedOffset),
        highlightMeshes: actuatorMeshes,
        wireframeMeshes: wfMeshes,
      });
    }

    // Component 8: 3-Axis Wrist Gimbal
    {
      const compData = ROBOT_COMPONENTS.find((c) => c.id === 'wrist_gimbal_3axis')!;
      const group = new THREE.Group();
      group.position.set(...compData.position);

      // Spherical compact wrist housing
      const wristSphere = new THREE.Mesh(
        new THREE.SphereGeometry(0.34, 24, 24),
        darkTitaniumMat
      );
      wristSphere.castShadow = !isSoftwareGl;
      group.add(wristSphere);

      // Orthogonal rotation collar
      const collar = new THREE.Mesh(
        new THREE.TorusGeometry(0.36, 0.05, 12, 32),
        indigoAccentMat
      );
      collar.rotation.x = Math.PI / 2;
      group.add(collar);

      const wf = createWireframe(wristSphere);
      rootAssembly.add(group);
      nodesMap.set(compData.id, {
        data: compData,
        group,
        initialPos: group.position.clone(),
        targetExplodedOffset: new THREE.Vector3(...compData.explodedOffset),
        highlightMeshes: [wristSphere],
        wireframeMeshes: [wf],
      });
    }

    // Component 9: Dexterous Palm Chassis Mk-IV
    {
      const compData = ROBOT_COMPONENTS.find((c) => c.id === 'dexterous_palm_chassis')!;
      const group = new THREE.Group();
      group.position.set(...compData.position);

      const palmMesh = new THREE.Mesh(
        new THREE.BoxGeometry(0.38, 0.45, 0.18),
        darkTitaniumMat
      );
      palmMesh.castShadow = !isSoftwareGl;
      group.add(palmMesh);

      // Tactile sensor matrix faceplate (Cyan tactile node grid)
      const matrixPlate = new THREE.Mesh(
        new THREE.BoxGeometry(0.32, 0.38, 0.02),
        new THREE.MeshStandardMaterial({
          color: 0x00e5ff,
          roughness: 0.2,
          metalness: 0.8,
        })
      );
      matrixPlate.position.set(0, 0, 0.1);
      group.add(matrixPlate);

      const wf = createWireframe(palmMesh);
      rootAssembly.add(group);
      nodesMap.set(compData.id, {
        data: compData,
        group,
        initialPos: group.position.clone(),
        targetExplodedOffset: new THREE.Vector3(...compData.explodedOffset),
        highlightMeshes: [palmMesh],
        wireframeMeshes: [wf],
      });
    }

    // Component 10: Index Articulated Tactile Phalanx & Tip
    {
      const compData = ROBOT_COMPONENTS.find((c) => c.id === 'tactile_finger_index')!;
      const group = new THREE.Group();
      group.position.set(...compData.position);

      // 3 articulated phalanx links
      const phalanxMeshes: THREE.Mesh[] = [];
      const wfMeshes: THREE.LineSegments[] = [];

      for (let f = 0; f < 3; f++) {
        const ph = new THREE.Mesh(
          new THREE.BoxGeometry(0.06, 0.14 - f * 0.02, 0.06),
          f === 2 ? harmonicGoldMat : darkTitaniumMat
        );
        ph.position.set(0, f * 0.14, 0);
        group.add(ph);
        phalanxMeshes.push(ph);
        wfMeshes.push(createWireframe(ph));
      }

      rootAssembly.add(group);
      nodesMap.set(compData.id, {
        data: compData,
        group,
        initialPos: group.position.clone(),
        targetExplodedOffset: new THREE.Vector3(...compData.explodedOffset),
        highlightMeshes: phalanxMeshes,
        wireframeMeshes: wfMeshes,
      });
    }

    // Component 11: Opposable Thumb
    {
      const compData = ROBOT_COMPONENTS.find((c) => c.id === 'tactile_finger_thumb')!;
      const group = new THREE.Group();
      group.position.set(...compData.position);

      const thumbJoint = new THREE.Mesh(
        new THREE.SphereGeometry(0.08, 16, 16),
        harmonicGoldMat
      );
      group.add(thumbJoint);

      const thumbTip = new THREE.Mesh(
        new THREE.CylinderGeometry(0.04, 0.06, 0.22, 12),
        indigoAccentMat
      );
      thumbTip.position.set(0.08, 0.12, 0.08);
      thumbTip.rotation.z = -Math.PI / 4;
      group.add(thumbTip);

      const wf = createWireframe(thumbTip);
      rootAssembly.add(group);
      nodesMap.set(compData.id, {
        data: compData,
        group,
        initialPos: group.position.clone(),
        targetExplodedOffset: new THREE.Vector3(...compData.explodedOffset),
        highlightMeshes: [thumbJoint, thumbTip],
        wireframeMeshes: [wf],
      });
    }

    nodesMapRef.current = nodesMap;

    // Pre-warm shaders
    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    // 10. Pointer Raycaster & Interaction
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    const getRaycastIntersects = (e: MouseEvent | Touch) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);

      // Collect all interactive meshes
      const interactiveMeshes: THREE.Mesh[] = [];
      nodesMap.forEach((node) => {
        interactiveMeshes.push(...node.highlightMeshes);
      });

      return raycaster.intersectObjects(interactiveMeshes, false);
    };

    const handlePointerMove = (e: MouseEvent) => {
      const orb = orbitStateRef.current;
      if (orb.isDragging) {
        const deltaX = e.clientX - orb.prevPointerX;
        const deltaY = e.clientY - orb.prevPointerY;
        orb.prevPointerX = e.clientX;
        orb.prevPointerY = e.clientY;

        orb.targetSpherical.theta -= deltaX * 0.006;
        orb.targetSpherical.phi = Math.max(
          0.1,
          Math.min(Math.PI / 2.05, orb.targetSpherical.phi - deltaY * 0.006)
        );
        return;
      }

      // Check raycast hover
      const intersects = getRaycastIntersects(e);
      if (intersects.length > 0) {
        const hitMesh = intersects[0].object as THREE.Mesh;
        // Find owner node
        let matchedNode: ComponentMeshNode | null = null;
        for (const node of nodesMap.values()) {
          if (node.highlightMeshes.includes(hitMesh)) {
            matchedNode = node;
            break;
          }
        }

        if (matchedNode && matchedNode.data.id !== hoveredNodeRef.current?.id) {
          hoveredNodeRef.current = matchedNode.data;
          setHoveredNode(matchedNode.data);
          sfx.playTacticalClick(2200, 0.02);
        }
      } else {
        if (hoveredNodeRef.current !== null) {
          hoveredNodeRef.current = null;
          setHoveredNode(null);
        }
      }
    };

    const handlePointerDown = (e: MouseEvent) => {
      const orb = orbitStateRef.current;
      orb.isDragging = true;
      orb.prevPointerX = e.clientX;
      orb.prevPointerY = e.clientY;
    };

    const handlePointerUp = (e: MouseEvent) => {
      const orb = orbitStateRef.current;
      const movedDistance = Math.hypot(e.clientX - orb.prevPointerX, e.clientY - orb.prevPointerY);
      orb.isDragging = false;

      // If user tapped without dragging, select component
      if (movedDistance < 4) {
        const intersects = getRaycastIntersects(e);
        if (intersects.length > 0) {
          const hitMesh = intersects[0].object as THREE.Mesh;
          for (const node of nodesMap.values()) {
            if (node.highlightMeshes.includes(hitMesh)) {
              onSelectComponent(node.data);
              sfx.playLaserLock();
              break;
            }
          }
        }
      }
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const orb = orbitStateRef.current;
      orb.targetSpherical.radius = Math.max(
        3.5,
        Math.min(18.0, orb.targetSpherical.radius + e.deltaY * 0.01)
      );
    };

    const domEl = renderer.domElement;
    domEl.addEventListener('pointermove', handlePointerMove);
    domEl.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointerup', handlePointerUp);
    domEl.addEventListener('wheel', handleWheel, { passive: false });

    // Touch support for mobile / tablets
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        const orb = orbitStateRef.current;
        orb.isDragging = true;
        orb.prevPointerX = e.touches[0].clientX;
        orb.prevPointerY = e.touches[0].clientY;
      }
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1 && orbitStateRef.current.isDragging) {
        const orb = orbitStateRef.current;
        const deltaX = e.touches[0].clientX - orb.prevPointerX;
        const deltaY = e.touches[0].clientY - orb.prevPointerY;
        orb.prevPointerX = e.touches[0].clientX;
        orb.prevPointerY = e.touches[0].clientY;

        orb.targetSpherical.theta -= deltaX * 0.007;
        orb.targetSpherical.phi = Math.max(
          0.1,
          Math.min(Math.PI / 2.05, orb.targetSpherical.phi - deltaY * 0.007)
        );
      }
    };
    const handleTouchEnd = () => {
      orbitStateRef.current.isDragging = false;
    };
    domEl.addEventListener('touchstart', handleTouchStart, { passive: true });
    domEl.addEventListener('touchmove', handleTouchMove, { passive: true });
    domEl.addEventListener('touchend', handleTouchEnd);

    // 11. Handle Resize
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // 12. Main 60FPS Lossless Animation Loop
    let frameId = 0;
    const clock = new THREE.Clock();
    let lastFpsUpdate = 0;
    let framesCount = 0;

    // Pre-allocated scratch vector math helpers
    const _scratchVecA = new THREE.Vector3();
    const _scratchVecB = new THREE.Vector3();

    const tick = () => {
      const dt = Math.min(clock.getDelta(), 0.1);
      const elapsed = clock.getElapsedTime();

      // FPS calculation
      framesCount++;
      if (elapsed - lastFpsUpdate >= 1.0) {
        setFpsReadout(Math.round(framesCount / (elapsed - lastFpsUpdate)));
        framesCount = 0;
        lastFpsUpdate = elapsed;
      }

      // Auto-rotation when not dragging
      const orb = orbitStateRef.current;
      if (autoRotateRef.current && !orb.isDragging) {
        orb.targetSpherical.theta += 0.3 * dt;
      }

      // Damped spherical camera movement
      orb.spherical.theta = THREE.MathUtils.damp(
        orb.spherical.theta,
        orb.targetSpherical.theta,
        8,
        dt
      );
      orb.spherical.phi = THREE.MathUtils.damp(
        orb.spherical.phi,
        orb.targetSpherical.phi,
        8,
        dt
      );
      orb.spherical.radius = THREE.MathUtils.damp(
        orb.spherical.radius,
        orb.targetSpherical.radius,
        8,
        dt
      );
      orb.lookAt.lerp(orb.targetLookAt, 1 - Math.exp(-6 * dt));

      // Compute camera position from spherical coordinates
      const sinPhiRadius = Math.sin(orb.spherical.phi) * orb.spherical.radius;
      camera.position.set(
        orb.lookAt.x + sinPhiRadius * Math.sin(orb.spherical.theta),
        orb.lookAt.y + Math.cos(orb.spherical.phi) * orb.spherical.radius,
        orb.lookAt.z + sinPhiRadius * Math.cos(orb.spherical.theta)
      );
      camera.lookAt(orb.lookAt);

      // Exploded View kinematics with exponential damping
      const expProgress = explodeProgressRef.current;
      const idleSway = expProgress < 0.05 ? Math.sin(elapsed * 1.5) * 0.015 : 0;

      nodesMap.forEach((node) => {
        // Calculate factor based on whether explosion has reached this component's threshold
        // Stage 33 components start separating at 0-33%, Stage 66 at 33-66%, Stage 100 at 66-100%
        let factor = 0;
        if (node.data.explodedStage === 33) {
          factor = Math.min(Math.max(expProgress / 0.33, 0), 1);
        } else if (node.data.explodedStage === 66) {
          factor = Math.min(Math.max((expProgress - 0.2) / 0.5, 0), 1);
        } else {
          factor = Math.min(Math.max((expProgress - 0.5) / 0.5, 0), 1);
        }

        // Cubic easing for smooth physical momentum
        const eased = factor * factor * (3 - 2 * factor);

        _scratchVecA.copy(node.targetExplodedOffset).multiplyScalar(eased);
        _scratchVecB.copy(node.initialPos).add(_scratchVecA);

        if (node.data.id === 'base_turret') {
          _scratchVecB.y += idleSway;
        }

        node.group.position.lerp(_scratchVecB, 1 - Math.exp(-9 * dt));
      });

      // Active component target laser beam
      const activeComponent = selectedNodeRef.current || hoveredNodeRef.current;
      if (laserTargetEnabled && activeComponent && laserLineRef.current && laserReticleRef.current) {
        const node = nodesMap.get(activeComponent.id);
        if (node) {
          node.group.getWorldPosition(_scratchVecA);

          // Emitter position floating above
          const emitterPos = _scratchVecB.set(
            _scratchVecA.x + 1.8,
            _scratchVecA.y + 3.2,
            _scratchVecA.z + 2.2
          );

          // Update laser line vertices
          const posAttr = laserLineRef.current.geometry.attributes.position as THREE.BufferAttribute;
          posAttr.setXYZ(0, emitterPos.x, emitterPos.y, emitterPos.z);
          posAttr.setXYZ(1, _scratchVecA.x, _scratchVecA.y, _scratchVecA.z);
          posAttr.needsUpdate = true;
          laserLineRef.current.visible = true;

          // Position reticle exactly at component target
          laserReticleRef.current.position.copy(_scratchVecA);
          laserReticleRef.current.rotation.y = elapsed * 1.5;
          laserReticleRef.current.visible = true;
        }
      } else {
        if (laserLineRef.current) laserLineRef.current.visible = false;
        if (laserReticleRef.current) laserReticleRef.current.visible = false;
      }

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointerup', handlePointerUp);
      domEl.removeEventListener('pointermove', handlePointerMove);
      domEl.removeEventListener('pointerdown', handlePointerDown);
      domEl.removeEventListener('wheel', handleWheel);
      domEl.removeEventListener('touchstart', handleTouchStart);
      domEl.removeEventListener('touchmove', handleTouchMove);
      domEl.removeEventListener('touchend', handleTouchEnd);
      renderer.dispose();
      if (domEl.parentNode === container) {
        container.removeChild(domEl);
      }
    };
  }, [laserTargetEnabled, onSelectComponent]);

  return (
    <div className="relative w-full h-full select-none overflow-hidden">
      {/* 3D Canvas Mount Point */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Floating Viewport Telemetry Badge (Top-Left) */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5 pointer-events-none">
        <div className="flex items-center gap-2 px-3 py-1 bg-black/60 border border-white/10 rounded-sm font-mono-cad text-xs text-zinc-300">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF]" />
          <span>THREE.JS ENGINE</span>
          <span className="text-zinc-500">|</span>
          <span className="text-[#00E5FF] font-semibold">{fpsReadout} FPS SLA</span>
        </div>
        <div className="text-[10px] font-mono-cad text-zinc-400 bg-black/40 px-2.5 py-0.5 border border-white/5 rounded-sm">
          AZIMUTH: {(orbitStateRef.current.spherical.theta * (180 / Math.PI)).toFixed(1)}° ELEV:{' '}
          {(orbitStateRef.current.spherical.phi * (180 / Math.PI)).toFixed(1)}°
        </div>
      </div>

      {/* Hovered Component Quick Tactical CAD HUD */}
      {hoveredNode && !selectedComponent && (
        <div className="absolute top-4 right-4 z-10 pointer-events-none font-mono-cad max-w-xs animate-in fade-in duration-150">
          <div className="bg-[#09090B]/90 border border-[#00E5FF]/40 p-3 rounded-sm shadow-xl shadow-[#00E5FF]/5">
            <div className="flex items-center justify-between text-[10px] text-[#00E5FF] mb-1">
              <span>TARGET ACQUIRED</span>
              <span className="px-1 bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/30">
                {hoveredNode.code}
              </span>
            </div>
            <div className="text-xs font-semibold text-white tracking-wide">{hoveredNode.name}</div>
            <div className="mt-2 text-[10px] text-zinc-400 space-y-0.5 border-t border-white/10 pt-1.5">
              <div className="flex justify-between">
                <span>CATEGORY:</span>
                <span className="text-zinc-200">{hoveredNode.category}</span>
              </div>
              <div className="flex justify-between">
                <span>MATERIAL:</span>
                <span className="text-zinc-200 truncate max-w-[140px]">
                  {hoveredNode.specs.material}
                </span>
              </div>
              {hoveredNode.specs.torqueOrForce && (
                <div className="flex justify-between">
                  <span>RATED:</span>
                  <span className="text-[#00E5FF]">{hoveredNode.specs.torqueOrForce}</span>
                </div>
              )}
            </div>
            <div className="mt-2 text-[9px] text-cyan-400/80 uppercase tracking-widest text-right">
              [Click Node to Inspect CAD Blueprint]
            </div>
          </div>
        </div>
      )}

      {/* Center Reticle Coordinate Marks */}
      <div className="absolute bottom-6 right-6 z-10 pointer-events-none font-mono-cad text-[10px] text-zinc-300 flex flex-col items-end gap-1">
        <div className="flex items-center gap-1.5">
          <span className="text-zinc-400">STATUS:</span>
          <span className="text-emerald-400">NOMINAL CAD SYNC</span>
        </div>
        <div className="text-zinc-400">DRAG TO ORBIT • SCROLL TO ZOOM</div>
      </div>
    </div>
  );
};
