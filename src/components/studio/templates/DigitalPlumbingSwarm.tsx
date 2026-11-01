import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

import {
  COLORS,
  HEADLESS_AGENTS,
  createDynamicCameraBookmarks,
  resolveThemeColors,
} from '@/components/studio/templates/constants';
import {
  buildCourtyardAndCleanroom,
  CourtyardArchitectureRefs,
  spawnHexagonalWaterRipple,
  updateCourtyardAndCleanroom,
} from '@/components/studio/templates/CourtyardEnvironment';
import {
  buildHeroPipelineStation,
  buildIgnitionConsoleStation,
  buildPlumberSwarmStation,
  buildTriCoreBentoStation,
  deformSandboxAtPoint,
  HeroPipelineRefs,
  IgnitionConsoleRefs,
  PlumberSwarmRefs,
  TriCoreBentoRefs,
  updateAllStations,
} from '@/components/studio/templates/PlumbingModules';
import { createContactShadowTexture } from '@/components/studio/templates/proceduralTextures';
import { soundEngine } from '@/components/studio/templates/soundEngine';
import { TerminalHUD } from '@/components/studio/templates/TerminalHUD';
import {
  CameraBookmark,
  DiagnosticState,
  DigitalPlumbingSwarmProps,
  StationId,
  ThemeColors,
} from '@/components/studio/templates/types';
import '@/components/studio/templates/DigitalPlumbingSwarm.css';

export type { DigitalPlumbingSwarmProps };

// Reusable scratch objects for Raycasting & Camera Damping (Zero GC in 60fps loop)
const _pointerNDC = new THREE.Vector2();
const _raycaster = new THREE.Raycaster();
const _brainLocalHit = new THREE.Vector3();
const _camTargetPos = new THREE.Vector3();
const _camTargetLook = new THREE.Vector3();
const _currentLookAt = new THREE.Vector3(0, 1.45, -2.35);

export function DigitalPlumbingSwarm({
  projectName,
  slogan,
  primaryColor = '#5322FF',
  accentColor = '#00E5FF',
  backgroundColor = '#09090B',
  enableRaycasting = true,
  className = '',
  style,
}: DigitalPlumbingSwarmProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Resolve Theme Colors & Dynamic Camera Bookmarks
    const theme: ThemeColors = resolveThemeColors(primaryColor, accentColor, backgroundColor);
    const cameraBookmarks: CameraBookmark[] = createDynamicCameraBookmarks(projectName, slogan);

    // 2. Diagnostic State Machine
    const state: DiagnosticState = {
      activeStation: 0,
      purgeProgress: 0.0,
      shockwaveProgress: 0.0,
      shockwaveActive: false,
      activeAgentId: 'n8n',
      pistonCycleCount: 1024,
      pistonDrift: 0.0,
      brainActiveNodes: 260,
      brainCoherence: 99.94,
      canvasDeformCount: 0,
      canvasVerticesDeformed: 0,
      ignitionTriggered: false,
      ignitionProgress: 0.0,
      fps: 60,
      audioMuted: false,
      dockCollapsed: false,
      laserScanY: 0.5,
      dossierHovered: false,
    };

    // 3. Scene, Camera, WebGLRenderer Setup
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(48, width / height, 0.1, 80);

    const isMobile = window.innerWidth < 768;
    const renderer = new THREE.WebGLRenderer({
      antialias: !isMobile,
      alpha: false,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.22;
    renderer.shadowMap.enabled = !isMobile;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // Environment map & Studio lighting
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    scene.background = new THREE.Color(theme.BG_OBSIDIAN);
    scene.fog = new THREE.FogExp2(theme.SKY_HORIZON, 0.012);

    // Ambient & Studio Lights
    const ambientLight = new THREE.AmbientLight(theme.AMBIENT_MIDNIGHT, 0.2);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(theme.SKY_HORIZON, theme.BG_OBSIDIAN, 0.65);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(theme.KEY_LIGHT_6500K, 3.4);
    keyLight.position.set(3.2, 8.8, 3.1);
    keyLight.castShadow = !isMobile;
    if (keyLight.castShadow) {
      keyLight.shadow.mapSize.width = 2048;
      keyLight.shadow.mapSize.height = 2048;
      keyLight.shadow.camera.near = 0.5;
      keyLight.shadow.camera.far = 22;
      const d = 8.5;
      keyLight.shadow.camera.left = -d;
      keyLight.shadow.camera.right = d;
      keyLight.shadow.camera.top = d;
      keyLight.shadow.camera.bottom = -d;
      keyLight.shadow.bias = -0.0005;
      keyLight.shadow.normalBias = 0.02;
    }
    scene.add(keyLight);

    const indigoSpotLeft = new THREE.SpotLight(
      theme.ELECTRIC_INDIGO,
      18.0,
      18.0,
      Math.PI / 3.2,
      0.45,
      1.2
    );
    indigoSpotLeft.position.set(-5.2, 4.2, -0.8);
    indigoSpotLeft.target.position.set(-2.5, 1.0, -2.2);
    scene.add(indigoSpotLeft, indigoSpotLeft.target);

    const indigoSpotRight = new THREE.SpotLight(
      theme.ELECTRIC_INDIGO,
      18.0,
      18.0,
      Math.PI / 3.2,
      0.45,
      1.2
    );
    indigoSpotRight.position.set(5.2, 4.2, -0.8);
    indigoSpotRight.target.position.set(2.5, 1.0, -2.2);
    scene.add(indigoSpotRight, indigoSpotRight.target);

    const cyanLaserAccent = new THREE.PointLight(theme.CYAN_LASER, 8.5, 12.0);
    cyanLaserAccent.position.set(2.2, 1.7, 0.2);
    scene.add(cyanLaserAccent);

    // 4. Build Cleanroom, Hydro-Kinetic Courtyard & 4 Stations
    const courtyardRefs: CourtyardArchitectureRefs = buildCourtyardAndCleanroom(renderer, theme);
    scene.add(courtyardRefs.root);

    const contactShadowTex = createContactShadowTexture();

    const heroRefs: HeroPipelineRefs = buildHeroPipelineStation(contactShadowTex, theme);
    const bentoRefs: TriCoreBentoRefs = buildTriCoreBentoStation(contactShadowTex, theme);
    const plumberRefs: PlumberSwarmRefs = buildPlumberSwarmStation(contactShadowTex, theme, {
      projectName,
      slogan,
      primaryColor,
      accentColor,
    });
    const ignitionRefs: IgnitionConsoleRefs = buildIgnitionConsoleStation(contactShadowTex, theme);

    scene.add(heroRefs.root, bentoRefs.root, plumberRefs.root, ignitionRefs.root);

    // 5. Interactive Meshes
    const interactiveMeshes: THREE.Object3D[] = [
      courtyardRefs.waterMirrorMesh,
      heroRefs.valveLeverHitbox,
      bentoRefs.brainHitbox,
      bentoRefs.muscleHitbox,
      bentoRefs.sandboxMesh,
      plumberRefs.dossierScreenMesh,
      ...plumberRefs.agentHitboxes,
      ignitionRefs.ignitionHitbox,
    ];

    let brainMagnetPointLocal: THREE.Vector3 | null = null;
    let isDraggingValve = false;
    let cameraTransitionActive = true;
    let elapsedTime = 0;
    let frameCounter = 0;
    let fpsAccumTime = 0;
    let lastWaterRippleTime = 0;

    // Helper functions for terminal interaction
    const focusStation = (stationId: StationId, immediate = false) => {
      state.activeStation = stationId;
      const bm = cameraBookmarks[stationId];
      _camTargetPos.copy(bm.position);
      _camTargetLook.copy(bm.lookAt);
      cameraTransitionActive = true;

      if (immediate) {
        camera.position.copy(_camTargetPos);
        _currentLookAt.copy(_camTargetLook);
        camera.lookAt(_currentLookAt);
      }
      hud.update(state);
    };

    const setPurgeProgress = (value: number, playAudio = false) => {
      const clamped = THREE.MathUtils.clamp(value, 0, 1);
      const prev = state.purgeProgress;
      state.purgeProgress = clamped;

      if (clamped >= 0.85 && prev < 0.85) {
        state.shockwaveActive = true;
        state.shockwaveProgress = 0;
        if (playAudio) soundEngine.playPurgeShockwave();
      } else if (playAudio && Math.abs(clamped - prev) > 0.04) {
        soundEngine.playValveTurn(clamped);
      }

      hud.update(state);
    };

    const selectSwarmAgent = (agentId: string) => {
      const agentIndex = HEADLESS_AGENTS.findIndex((a) => a.id === agentId);
      if (agentIndex === -1) return;

      state.activeAgentId = agentId;
      soundEngine.playAgentLock(agentIndex);

      HEADLESS_AGENTS.forEach((ag) => {
        const active = ag.id === agentId;
        const tube = plumberRefs.conduitTubes.get(ag.id);
        if (tube) {
          const mat = tube.material as THREE.MeshStandardMaterial;
          mat.emissiveIntensity = active ? 2.8 : 0.2;
          mat.opacity = active ? 0.96 : 0.28;
        }

        const beam = plumberRefs.laserBeams.get(ag.id);
        if (beam) {
          const bMat = beam.material as THREE.MeshBasicMaterial;
          bMat.opacity = active ? 1.0 : 0.28;
          const halo = beam.getObjectByName('LASER_BLOOM_HALO') as THREE.Mesh | undefined;
          if (halo) {
            (halo.material as THREE.MeshBasicMaterial).opacity = active ? 0.38 : 0.07;
          }
        }

        const pylon = plumberRefs.agentNodes.get(ag.id);
        if (pylon) {
          const crystal = pylon.getObjectByName('PYLON_SPIRE_CRYSTAL') as THREE.Mesh | undefined;
          if (crystal) {
            (crystal.material as THREE.MeshStandardMaterial).emissiveIntensity = active ? 2.6 : 0.65;
          }
          if (active) {
            const worldPos = new THREE.Vector3();
            pylon.getWorldPosition(worldPos);
            spawnHexagonalWaterRipple(courtyardRefs, worldPos);
          }
        }
      });

      hud.update(state);
    };

    const triggerCenterSandboxDeform = (worldHitPoint?: THREE.Vector3) => {
      const targetPoint =
        worldHitPoint ||
        new THREE.Vector3(
          1.25 + (Math.random() - 0.5) * 0.35,
          1.45 + (Math.random() - 0.5) * 0.35,
          -2.1
        );
      const count = deformSandboxAtPoint(bentoRefs, targetPoint);
      state.canvasDeformCount += 1;
      state.canvasVerticesDeformed = count;
      soundEngine.playCanvasDeform();
      hud.update(state);
    };

    const triggerEngineIgnition = () => {
      state.ignitionTriggered = true;
      state.ignitionProgress = 0;

      const pAttr = ignitionRefs.pneumaticParticles.geometry.attributes.position as THREE.BufferAttribute;
      const pArr = pAttr.array as Float32Array;
      for (let i = 0; i < pAttr.count; i++) {
        const theta = (i / pAttr.count) * Math.PI * 2;
        pArr[i * 3] = Math.cos(theta) * 0.32;
        pArr[i * 3 + 1] = 1.08;
        pArr[i * 3 + 2] = Math.sin(theta) * 0.32;
      }
      pAttr.needsUpdate = true;

      soundEngine.playPneumaticIgnition();
      hud.update(state);

      window.setTimeout(() => {
        if (state.ignitionTriggered) {
          hud.showPlaygroundModal(true);
        }
      }, 650);
    };

    const handleInteractiveHit = (obj: THREE.Object3D, point: THREE.Vector3, allowDrag = false) => {
      const name = obj.name;

      if (name === 'COURTYARD_WATER_MIRROR') {
        spawnHexagonalWaterRipple(courtyardRefs, point);
      } else if (name === 'HERO_PURGE_VALVE') {
        if (allowDrag) isDraggingValve = true;
        const next = state.purgeProgress < 0.85 ? 1.0 : 0.0;
        setPurgeProgress(next, true);
        if (state.activeStation !== 0) focusStation(0);
      } else if (name === 'BENTO_CANVAS_SANDBOX') {
        triggerCenterSandboxDeform(point);
        if (state.activeStation !== 1) focusStation(1);
      } else if (name === 'BENTO_BRAIN_HITBOX' || name === 'BENTO_MUSCLE_HITBOX') {
        if (state.activeStation !== 1) focusStation(1);
      } else if (name.startsWith('SWARM_AGENT_')) {
        const agentId = obj.userData.agentId as string;
        if (agentId) {
          selectSwarmAgent(agentId);
          if (state.activeStation !== 2) focusStation(2);
        }
      } else if (name === 'FOUNDER_DOSSIER_PLATE') {
        state.dossierHovered = !state.dossierHovered;
        if (state.activeStation !== 2) focusStation(2);
      } else if (name === 'IGNITION_LAUNCH_BUTTON') {
        if (state.activeStation !== 3) focusStation(3);
        triggerEngineIgnition();
      }
    };

    // 6. Build 2D Viewport Terminal HUD
    const hud = new TerminalHUD(
      {
        onSelectStation: (st) => focusStation(st),
        onPurgeSliderChange: (val) => setPurgeProgress(val, true),
        onSelectAgent: (agId) => selectSwarmAgent(agId),
        onDeformSandbox: () => triggerCenterSandboxDeform(),
        onTriggerIgnition: () => triggerEngineIgnition(),
        onToggleAudio: () => {
          state.audioMuted = !state.audioMuted;
          soundEngine.muted = state.audioMuted;
          hud.update(state);
        },
        onToggleCollapse: () => {
          state.dockCollapsed = !state.dockCollapsed;
          hud.update(state);
        },
        onClosePlaygroundModal: () => {
          state.ignitionTriggered = false;
          state.ignitionProgress = 0;
          hud.showPlaygroundModal(false);
          hud.update(state);
        },
      },
      container,
      { projectName, slogan }
    );

    // Initial camera bookmark
    focusStation(0, true);

    // 7. Raycasting & Pointer Events
    let lastRaycastTime = 0;

    const onPointerMove = (e: PointerEvent) => {
      if (!enableRaycasting) return;

      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      _pointerNDC.x = (x / rect.width) * 2 - 1;
      _pointerNDC.y = -(y / rect.height) * 2 + 1;

      if (isDraggingValve) {
        const nextVal = THREE.MathUtils.clamp((_pointerNDC.x + 0.6) / 1.2, 0, 1);
        setPurgeProgress(nextVal, true);
        return;
      }

      const now = performance.now();
      if (now - lastRaycastTime < 16) return;
      lastRaycastTime = now;

      _raycaster.setFromCamera(_pointerNDC, camera);
      const hits = _raycaster.intersectObjects(interactiveMeshes, false);

      brainMagnetPointLocal = null;
      let hoveringDossier = false;

      if (hits.length > 0) {
        const hit = hits[0];
        const name = hit.object.name;

        if (name === 'COURTYARD_WATER_MIRROR') {
          container.style.cursor = 'crosshair';
          if (now - lastWaterRippleTime > 75) {
            lastWaterRippleTime = now;
            spawnHexagonalWaterRipple(courtyardRefs, hit.point);
          }
        } else {
          container.style.cursor = 'pointer';
        }

        if (name === 'BENTO_BRAIN_HITBOX') {
          _brainLocalHit.copy(hit.point);
          bentoRefs.brainGroup.worldToLocal(_brainLocalHit);
          brainMagnetPointLocal = _brainLocalHit;
        } else if (name === 'FOUNDER_DOSSIER_PLATE') {
          hoveringDossier = true;
        }
      } else {
        container.style.cursor = 'default';
      }

      if (state.dossierHovered !== hoveringDossier) {
        state.dossierHovered = hoveringDossier;
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      if (!enableRaycasting) return;
      if ((e.target as HTMLElement)?.closest('#plumbing-terminal-hud')) return;

      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      _pointerNDC.x = (x / rect.width) * 2 - 1;
      _pointerNDC.y = -(y / rect.height) * 2 + 1;
      _raycaster.setFromCamera(_pointerNDC, camera);

      const hits = _raycaster.intersectObjects(interactiveMeshes, false);
      if (hits.length === 0) return;

      const hit = hits[0];
      handleInteractiveHit(hit.object, hit.point, true);
    };

    const onPointerUp = () => {
      isDraggingValve = false;
    };

    container.addEventListener('pointermove', onPointerMove, { passive: true });
    container.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointerup', onPointerUp);

    // 8. Resize Observer
    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', onResize);
    const resizeObserver = new ResizeObserver(() => onResize());
    resizeObserver.observe(container);

    // 9. 60 FPS Animation Loop
    let animId = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);

      const dt = Math.min(clock.getDelta(), 0.1);
      elapsedTime += dt;

      // Live FPS Counter
      frameCounter++;
      fpsAccumTime += dt;
      if (fpsAccumTime >= 0.5) {
        state.fps = Math.min(60, Math.max(55, Math.round(frameCounter / fpsAccumTime)));
        frameCounter = 0;
        fpsAccumTime = 0;
        hud.update(state);
      }

      // Periodic ambient hexagonal pulse on the Obsidian Water Mirror
      if (Math.floor(elapsedTime * 1.2) !== Math.floor((elapsedTime - dt) * 1.2)) {
        const randX = (Math.random() - 0.5) * 7.2;
        const randZ = -0.05 + (Math.random() - 0.5) * 2.6;
        spawnHexagonalWaterRipple(courtyardRefs, new THREE.Vector3(randX, 0.025, randZ));
      }

      if (state.shockwaveActive) {
        state.shockwaveProgress += dt * 1.45;
        if (state.shockwaveProgress >= 1.0) {
          state.shockwaveActive = false;
          state.shockwaveProgress = 0;
        }
      }

      if (state.ignitionTriggered && state.ignitionProgress < 1.0) {
        state.ignitionProgress = Math.min(1.0, state.ignitionProgress + dt * 0.9);
      }

      // Camera smooth damping
      if (cameraTransitionActive) {
        const alpha = 1 - Math.exp(-5.5 * dt);
        camera.position.lerp(_camTargetPos, alpha);
        _currentLookAt.lerp(_camTargetLook, alpha);
        camera.lookAt(_currentLookAt);

        if (
          camera.position.distanceToSquared(_camTargetPos) < 0.0004 &&
          _currentLookAt.distanceToSquared(_camTargetLook) < 0.0004
        ) {
          cameraTransitionActive = false;
        }
      }

      // Update Courtyard Water Mirror & Exposed Pipeline Arches
      updateCourtyardAndCleanroom(elapsedTime, dt, courtyardRefs, state.purgeProgress);

      // Update all 4 procedural 3D stations
      updateAllStations(
        elapsedTime,
        dt,
        heroRefs,
        bentoRefs,
        plumberRefs,
        ignitionRefs,
        {
          purgeProgress: state.purgeProgress,
          shockwaveProgress: state.shockwaveProgress,
          shockwaveActive: state.shockwaveActive,
          brainMagnetPointLocal: brainMagnetPointLocal,
          activeAgentId: state.activeAgentId,
          dossierHovered: state.dossierHovered,
          ignitionTriggered: state.ignitionTriggered,
          ignitionProgress: state.ignitionProgress,
          projectName,
          slogan,
          primaryColor,
          accentColor,
          onPistonCycleIncrement: () => {
            state.pistonCycleCount += 1;
          },
          onBrainMetricsUpdate: (nodes, coherence) => {
            state.brainActiveNodes = nodes;
            state.brainCoherence = coherence;
          },
        }
      );

      renderer.render(scene, camera);
    };

    animate();

    // 10. Clean Unmount & Disposal
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointerup', onPointerUp);
      container.removeEventListener('pointermove', onPointerMove);
      container.removeEventListener('pointerdown', onPointerDown);
      resizeObserver.disconnect();

      hud.dispose();
      soundEngine.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [
    projectName,
    slogan,
    primaryColor,
    accentColor,
    backgroundColor,
    enableRaycasting,
  ]);

  return (
    <div
      ref={mountRef}
      className={`ac-terminal-container ${className}`}
      style={{
        ['--ac-indigo' as string]: primaryColor,
        ['--ac-cyan' as string]: accentColor,
        ['--ac-obsidian' as string]: backgroundColor,
        ...style,
      }}
    />
  );
}

export default DigitalPlumbingSwarm;
