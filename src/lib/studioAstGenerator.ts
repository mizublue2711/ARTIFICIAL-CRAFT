/**
 * ARTIFICIAL CRAFT - Studio AST & Code Generation Engine
 * Compiles validated StudioConfigData into AST Payloads, 60FPS WebGL Standalone Apps,
 * and Multi-Language Developer SDK Snippets.
 */

import { StudioConfigData } from '@/types/studioConfig';

export interface StudioAstPayload {
  version: string;
  schema: string;
  compositionId: string;
  timestamp: string;
  branding: {
    name: string;
    slogan: string;
    logoUrl: string;
  };
  designTokens: {
    colorSystem: {
      background: string;
      primary: string;
      accent: string;
      borders: string;
    };
    typography: {
      headlineFont: string;
      codeFont: string;
    };
    motionTokens: string[];
  };
  meshAssembly: {
    modelType: string;
    preset: string;
    customModelUrl: string;
    explodedStageProgress: number;
    stages: Record<string, string>;
    raycastingLaserEnabled: boolean;
  };
  telemetry: {
    targetSlaFps: number;
    torquePrecision: string;
    dofSensorCount: string;
    aiLatency: string;
    bentoGrid: {
      viewport3d: boolean;
      performanceGraph: boolean;
      interactiveTactileMatrix: boolean;
    };
    spatialPointCloudEnabled: boolean;
  };
  targetPlatforms: string[];
}

export function normalizeStudioConfig(raw: any): StudioConfigData {
  const brandName = raw?.compositionId || raw?.brandName || 'ARTIFICIAL_CRAFT';
  const slogan = raw?.slogan || raw?.tagline || 'Robots for Everyone // Cybernetic Automation';
  const logoUrl = raw?.logoUrl || 'https://raw.githubusercontent.com/artificial-craft/assets/main/logo-mark.svg';
  const bg = raw?.backgroundColor || raw?.theme?.backgroundColor || '#09090B';
  const primary = raw?.primaryColor || raw?.theme?.primaryColor || '#5322FF';
  const accent = raw?.accentColor || raw?.theme?.accentColor || '#00E5FF';
  const headlineFont = raw?.headlineFont || raw?.theme?.fontFamily || 'Space Grotesk';
  const codeFont = raw?.codeFont || 'JetBrains Mono';
  const motionTokens = Array.isArray(raw?.motionTokens) && raw.motionTokens.length > 0
    ? raw.motionTokens
    : ['kinetic-parallax', 'chromatic-aberration', 'magnetic-attraction'];
  const modelType = raw?.modelType || 'preset';
  const presetModel = raw?.presetModel || (raw?.roboticsNode?.modelType === 'industrial-arm' ? 'industrial-arm' : 'bipedal-robot');
  const customModelUrl = raw?.customModelUrl || '';
  const explodedProgress = typeof raw?.explodedProgress === 'number' ? raw.explodedProgress : 33;
  const explodedStages = raw?.explodedStages || {
    stage0: '0% // Assembled Unibody Core',
    stage33: '33% // Tactical Outer Aerogel Shell',
    stage66: '66% // High-Torque Brushless Motor Core',
    stage100: '100% // Micro Tactile Haptic Sensor Array',
  };
  const raycastingLaser = raw?.raycastingLaser ?? true;
  const telemetryFps = typeof raw?.telemetryFps === 'number' ? raw.telemetryFps : 60;
  const torquePrecision = raw?.torquePrecision || '±0.01mm';
  const dofSensorCount = raw?.dofSensorCount || '11 DOF';
  const aiLatency = raw?.aiLatency || '<2ms';
  const bentoModules = {
    viewport3d: raw?.bentoModules?.viewport3d ?? true,
    performanceGraph: raw?.bentoModules?.performanceGraph ?? true,
    interactiveTactileMatrix: raw?.bentoModules?.interactiveTactileMatrix ?? true,
  };
  const spatialPointCloud = raw?.spatialPointCloud ?? true;
  const sandboxLanguages = Array.isArray(raw?.sandboxLanguages) && raw.sandboxLanguages.length > 0
    ? raw.sandboxLanguages
    : ['typescript', 'python', 'ros2', 'cpp'];

  return {
    compositionId: brandName,
    slogan,
    logoUrl,
    backgroundColor: bg,
    primaryColor: primary,
    accentColor: accent,
    headlineFont,
    codeFont,
    motionTokens,
    modelType,
    presetModel,
    customModelUrl,
    explodedProgress,
    explodedStages,
    raycastingLaser,
    telemetryFps,
    torquePrecision,
    dofSensorCount,
    aiLatency,
    bentoModules,
    spatialPointCloud,
    sandboxLanguages,
  };
}

export function generateStudioAst(rawConfig: any): StudioAstPayload {
  const config = normalizeStudioConfig(rawConfig);
  return {
    version: '2.5.0-BRUTALIST',
    schema: 'https://artificial-craft.com/schemas/studio-ast/v2.json',
    compositionId: config.compositionId,
    timestamp: new Date().toISOString(),
    branding: {
      name: config.compositionId,
      slogan: config.slogan,
      logoUrl: config.logoUrl,
    },
    designTokens: {
      colorSystem: {
        background: config.backgroundColor,
        primary: config.primaryColor,
        accent: config.accentColor,
        borders: 'rgba(255, 255, 255, 0.1)',
      },
      typography: {
        headlineFont: config.headlineFont,
        codeFont: config.codeFont,
      },
      motionTokens: config.motionTokens,
    },
    meshAssembly: {
      modelType: config.modelType,
      preset: config.presetModel,
      customModelUrl: config.customModelUrl,
      explodedStageProgress: config.explodedProgress,
      stages: config.explodedStages,
      raycastingLaserEnabled: config.raycastingLaser,
    },
    telemetry: {
      targetSlaFps: config.telemetryFps,
      torquePrecision: config.torquePrecision,
      dofSensorCount: config.dofSensorCount,
      aiLatency: config.aiLatency,
      bentoGrid: config.bentoModules,
      spatialPointCloudEnabled: config.spatialPointCloud,
    },
    targetPlatforms: config.sandboxLanguages,
  };
}

export function generateCodeSnippets(rawConfig: any) {
  try {
    const config = normalizeStudioConfig(rawConfig);
    const safeCompId = (config.compositionId || 'artificial_craft').toLowerCase().replace(/[^a-z0-9_]/g, '_');
    const tsCode = `// ARTIFICIAL CRAFT 3D CLIENT ENGINE // TypeScript & Three.js
// Composition: ${config.compositionId}
// SLA: ${config.telemetryFps}FPS | Latency: ${config.aiLatency}

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export interface TelemetryPacket {
  fps: number;
  torque: string;
  dof: string;
  latency: string;
}

export class CraftRuntimeEngine {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private rootAssembly: THREE.Group;
  private laserBeam?: THREE.Line;
  private particleCloud?: THREE.Points;

  constructor(container: HTMLElement) {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('${config.backgroundColor}');
    this.scene.fog = new THREE.FogExp2('${config.backgroundColor}', 0.04);

    this.camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
    this.camera.position.set(3.2, 2.4, 4.5);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(this.renderer.domElement);

    const controls = new OrbitControls(this.camera, this.renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    this.rootAssembly = new THREE.Group();
    this.scene.add(this.rootAssembly);

    this.initLighting();
    this.buildAssembly(${config.explodedProgress / 100});
    ${config.raycastingLaser ? 'this.initRaycastingLaser();' : '// Raycasting laser disabled'}
    ${config.spatialPointCloud ? 'this.initSpatialPointCloud();' : '// Spatial point cloud disabled'}

    this.animate();
  }

  private initLighting(): void {
    const ambient = new THREE.AmbientLight(0xffffff, 0.4);
    this.scene.add(ambient);

    const dirLight = new THREE.DirectionalLight('${config.primaryColor}', 2.4);
    dirLight.position.set(5, 10, 7);
    this.scene.add(dirLight);

    const rimLight = new THREE.PointLight('${config.accentColor}', 3.5, 20);
    rimLight.position.set(-4, -2, -3);
    this.scene.add(rimLight);
  }

  public setExplodedProgress(progress: number): void {
    // 0.0 (Assembled) -> 1.0 (Micro Tactile Sensors Exploded)
    const normalized = Math.max(0, Math.min(1, progress));
    this.rootAssembly.children.forEach((mesh, index) => {
      mesh.position.y = (index - 1.5) * normalized * 1.8;
      mesh.rotation.y += 0.02 * normalized;
    });
  }

  private animate = (): void => {
    requestAnimationFrame(this.animate);
    this.rootAssembly.rotation.y += 0.005;
    this.renderer.render(this.scene, this.camera);
  };
}`;

  const pythonCode = `# ARTIFICIAL CRAFT // Autonomous Telemetry Node (Python 3.11+)
# Stream telemetry matrix to WebGL 60FPS Front-end Client

import asyncio
import json
import math
import time
from dataclasses import dataclass, asdict

@dataclass
class TelemetryState:
    composition_id: str = "${config.compositionId}"
    sla_target_fps: int = ${config.telemetryFps}
    torque_precision: str = "${config.torquePrecision}"
    dof_sensors: str = "${config.dofSensorCount}"
    ai_latency: str = "${config.aiLatency}"
    exploded_stage: float = ${config.explodedProgress / 100}
    timestamp: float = 0.0

class ArtificialCraftDaemon:
    def __init__(self):
        self.state = TelemetryState()
        self.laser_active = ${config.raycastingLaser ? 'True' : 'False'}
        self.is_running = True

    async def broadcast_loop(self):
        print(f"[TACTICAL CAD] Initialized node {self.state.composition_id}")
        print(f"[KERNEL] Enforcing Swiss brutalist design boundaries // SLA: {self.state.sla_target_fps} FPS")

        t = 0.0
        while self.is_running:
            self.state.timestamp = time.time()
            # Synthetic kinematics pulse
            pulse = math.sin(t * 2.0) * 0.005
            self.state.torque_precision = f"±{abs(0.01 + pulse):.4f}mm"

            payload = json.dumps(asdict(self.state))
            # Broadcast over WebSocket / ZeroMQ to Client
            await asyncio.sleep(1.0 / self.state.sla_target_fps)
            t += 0.016

if __name__ == "__main__":
    daemon = ArtificialCraftDaemon()
    asyncio.run(daemon.broadcast_loop())`;

  const ros2Code = `// ARTIFICIAL CRAFT // ROS2 Humble/Iron Tactical Telemetry Publisher
// Package: artificial_craft_kinematics
// Node: ${safeCompId}_broadcaster

#include <chrono>
#include <memory>
#include <string>
#include "rclcpp/rclcpp.hpp"
#include "std_msgs/msg/string.hpp"

using namespace std::chrono_literals;

class CraftKinematicsNode : public rclcpp::Node {
public:
  CraftKinematicsNode() : Node("${safeCompId}_node") {
    publisher_ = this->create_publisher<std_msgs::msg::String>("/ac/telemetry", 10);
    timer_ = this->create_wall_timer(16ms, std::bind(&CraftKinematicsNode::publish_state, this));
    RCLCPP_INFO(this->get_logger(), "ARTIFICIAL CRAFT ROS2 BRIDGE ACTIVATED // SLA: %d FPS", ${config.telemetryFps});
  }

private:
  void publish_state() {
    auto message = std_msgs::msg::String();
    message.data = "{\\"composition\\":\\"${config.compositionId}\\", \\"torque\\":\\"${config.torquePrecision}\\", \\"dof\\":\\"${config.dofSensorCount}\\", \\"laser\\":${config.raycastingLaser ? 'true' : 'false'}}";
    publisher_->publish(message);
  }

  rclcpp::Publisher<std_msgs::msg::String>::SharedPtr publisher_;
  rclcpp::TimerBase::SharedPtr timer_;
};

int main(int argc, char * argv[]) {
  rclcpp::init(argc, argv);
  rclcpp::spin(std::make_shared<CraftKinematicsNode>());
  rclcpp::shutdown();
  return 0;
}`;

  const cppCode = `// ARTIFICIAL CRAFT // Low-Latency C++20 Cybernetic Controller
// High-Frequency Motor Vector & Haptic Sensor Bus
#pragma once

#include <iostream>
#include <string_view>
#include <array>
#include <cstdint>

namespace ArtificialCraft {
  struct MachineConfig {
    static constexpr std::string_view ID = "${config.compositionId}";
    static constexpr std::string_view TORQUE_SPEC = "${config.torquePrecision}";
    static constexpr uint32_t TARGET_FPS = ${config.telemetryFps};
    static constexpr bool LASER_INSPECTION = ${config.raycastingLaser ? 'true' : 'false'};
  };

  class TactileSensorMatrix {
  public:
    void sample_high_frequency_bus() noexcept {
      // Direct register read (<${config.aiLatency})
      std::cout << "[TELEMETRY] Sampling ${config.dofSensorCount} at " << MachineConfig::TORQUE_SPEC << std::endl;
    }
  };
} // namespace ArtificialCraft`;

    return {
      typescript: tsCode,
      python: pythonCode,
      ros2: ros2Code,
      cpp: cppCode,
    };
  } catch (err) {
    console.warn('[AST GENERATOR] Code snippet generation fallback:', err);
    return {
      typescript: '// TypeScript SDK generated in fallback mode',
      python: '# Python telemetry node fallback',
      ros2: '// ROS2 Humble node fallback',
      cpp: '// C++20 controller fallback',
    };
  }
}

/**
 * Generates standalone, 60FPS WebGL HTML suitable for both iframe srcdoc and single-file download.
 */
export function generateLiveHtml(config: StudioConfigData): string {
  const ast = generateStudioAst(config);
  const astJsonString = JSON.stringify(ast, null, 2).replace(/<\/script>/g, '<\\/script>');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${config.compositionId} // ARTIFICIAL CRAFT 3D</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=${encodeURIComponent(config.headlineFont)}:wght@400;700;900&family=${encodeURIComponent(config.codeFont)}:wght@400;600;700&display=swap" rel="stylesheet">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js"></script>
  <style>
    :root {
      --bg: ${config.backgroundColor};
      --primary: ${config.primaryColor};
      --accent: ${config.accentColor};
      --font-headline: '${config.headlineFont}', sans-serif;
      --font-code: '${config.codeFont}', monospace;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body, html {
      width: 100%; height: 100%;
      background: var(--bg);
      color: #e4e4e7;
      font-family: var(--font-code);
      overflow-x: hidden;
      overflow-y: auto;
    }
    /* Grid Backdrop */
    .bg-tactical-grid {
      background-image:
        linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
      background-size: 32px 32px;
    }
    /* Top Tactical HUD */
    .hud-bar {
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 48px;
      background: rgba(9, 9, 11, 0.75);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 16px;
      z-index: 40;
    }
    .hud-badge {
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      padding: 4px 8px;
      border: 1px solid rgba(255, 255, 255, 0.15);
      background: rgba(0, 0, 0, 0.5);
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    .pulse-dot {
      width: 6px; height: 6px;
      border-radius: 50%;
      background: var(--accent);
      box-shadow: 0 0 8px var(--accent);
      animation: pulse 1.5s infinite;
    }
    @keyframes pulse {
      0%, 100% { opacity: 0.4; transform: scale(0.9); }
      50% { opacity: 1; transform: scale(1.2); }
    }
    /* Main Layout */
    .studio-container {
      position: relative;
      width: 100%;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    .viewport-hero {
      position: relative;
      width: 100%;
      height: 60vh;
      min-height: 400px;
      overflow: hidden;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    #three-canvas-container {
      width: 100%; height: 100%;
      position: absolute;
      top: 0; left: 0;
    }
    /* Floating 3D Overlays */
    .viewport-overlay-brand {
      position: absolute;
      bottom: 20px; left: 20px;
      z-index: 20;
      pointer-events: none;
    }
    .viewport-overlay-brand h1 {
      font-family: var(--font-headline);
      font-size: 26px;
      font-weight: 900;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      color: #ffffff;
      text-shadow: 0 0 20px rgba(0,0,0,0.8);
    }
    .viewport-overlay-brand p {
      font-size: 11px;
      color: var(--accent);
      text-transform: uppercase;
      letter-spacing: 0.15em;
      margin-top: 4px;
    }
    .stage-pill {
      position: absolute;
      top: 60px; right: 20px;
      z-index: 20;
      background: rgba(0,0,0,0.8);
      border: 1px solid var(--primary);
      padding: 6px 12px;
      font-size: 10px;
      color: #fff;
      display: flex;
      flex-direction: column;
      gap: 2px;
      box-shadow: 0 0 15px rgba(83, 34, 255, 0.3);
    }
    .stage-pill-val {
      color: var(--accent);
      font-weight: 700;
      font-size: 12px;
    }
    /* Bento Grid Section */
    .bento-section {
      padding: 24px 20px;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 16px;
      z-index: 10;
    }
    .bento-card {
      background: rgba(18, 18, 22, 0.6);
      backdrop-filter: blur(8px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      padding: 16px;
      position: relative;
    }
    .bento-card-title {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--accent);
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .tactile-matrix {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 6px;
      margin-top: 8px;
    }
    .tactile-cell {
      height: 36px;
      background: rgba(0, 0, 0, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.08);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 9px;
      color: #a1a1aa;
      transition: all 0.3s;
    }
    .tactile-cell.active {
      border-color: var(--accent);
      background: rgba(0, 229, 255, 0.12);
      color: #ffffff;
      box-shadow: 0 0 10px rgba(0, 229, 255, 0.25);
    }
    /* Laser Canvas Overlay */
    .laser-status {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      color: var(--accent);
      font-size: 10px;
    }
  </style>
</head>
<body class="bg-tactical-grid">
  <div class="studio-container">
    <!-- Top Tactical HUD -->
    <header class="hud-bar">
      <div style="display: flex; align-items: center; gap: 12px;">
        <span class="pulse-dot"></span>
        <span style="font-weight: 700; font-size: 11px; color: #fff; letter-spacing: 0.08em;">
          ARTIFICIAL CRAFT // 3D WEBAPP RUNTIME
        </span>
        <span class="hud-badge" style="border-color: var(--primary); color: #fff;">
          SLA: ${config.telemetryFps}FPS
        </span>
      </div>
      <div style="display: flex; align-items: center; gap: 8px;">
        <span class="hud-badge" style="color: #10B981; border-color: rgba(16, 185, 129, 0.3);">
          GATE: ZOD VALIDATED
        </span>
        <span class="hud-badge" style="color: var(--accent);">
          LATENCY: ${config.aiLatency}
        </span>
      </div>
    </header>

    <!-- 3D WebGL Viewport Hero Stage -->
    <div class="viewport-hero">
      <div id="three-canvas-container"></div>

      <div class="viewport-overlay-brand">
        <h1>${config.compositionId}</h1>
        <p>${config.slogan}</p>
      </div>

      <div class="stage-pill">
        <span>ASSEMBLY STAGE</span>
        <span class="stage-pill-val" id="stage-val-text">${config.explodedProgress}% // ${
          config.explodedProgress < 25 ? 'STAGE 0 (ASSEMBLED)' :
          config.explodedProgress < 50 ? 'STAGE 1 (OUTER SHELL)' :
          config.explodedProgress < 80 ? 'STAGE 2 (MOTOR CORE)' : 'STAGE 3 (TACTILE SENSORS)'
        }</span>
        <span style="font-size: 9px; color: #71717a;">${config.presetModel.toUpperCase()}</span>
      </div>
    </div>

    <!-- Telemetry & Bento Grid Modules -->
    <div class="bento-section">
      ${config.bentoModules.viewport3d ? `
      <div class="bento-card">
        <div class="bento-card-title">
          <span>01 // 3D ACTUATOR METRICS</span>
          <span style="color: #10B981;">ONLINE</span>
        </div>
        <div style="display: flex; flex-direction: column; gap: 8px; font-size: 11px;">
          <div style="display: flex; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.06); padding-bottom: 4px;">
            <span style="color: #71717a;">Torque Precision</span>
            <span style="color: #fff; font-weight: 700;">${config.torquePrecision}</span>
          </div>
          <div style="display: flex; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.06); padding-bottom: 4px;">
            <span style="color: #71717a;">Sensor Degrees</span>
            <span style="color: var(--accent); font-weight: 700;">${config.dofSensorCount}</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: #71717a;">Raycast Laser</span>
            <span class="laser-status">${config.raycastingLaser ? 'ACTIVE [1PX CYAN]' : 'STANDBY'}</span>
          </div>
        </div>
      </div>
      ` : ''}

      ${config.bentoModules.performanceGraph ? `
      <div class="bento-card">
        <div class="bento-card-title">
          <span>02 // KINEMATICS HARMONICS</span>
          <span id="live-hz-text" style="color: var(--accent);">60.0 HZ</span>
        </div>
        <canvas id="harmonics-canvas" width="300" height="70" style="width: 100%; height: 70px; background: rgba(0,0,0,0.5);"></canvas>
      </div>
      ` : ''}

      ${config.bentoModules.interactiveTactileMatrix ? `
      <div class="bento-card">
        <div class="bento-card-title">
          <span>03 // TACTILE MATRIX (16 DOF)</span>
          <span style="color: #10B981;">CALIBRATED</span>
        </div>
        <div class="tactile-matrix" id="tactile-grid">
          <!-- 16 Haptic Cells -->
        </div>
      </div>
      ` : ''}
    </div>
  </div>

  <script id="ac-ast-data" type="application/json">
    ${astJsonString}
  </script>

  <script>
    // --- THREE.JS HIGH PRECISION ENGINE ---
    (function() {
      const container = document.getElementById('three-canvas-container');
      if (!container) return;

      const scene = new THREE.Scene();
      scene.background = new THREE.Color('${config.backgroundColor}');
      scene.fog = new THREE.FogExp2('${config.backgroundColor}', 0.05);

      const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
      camera.position.set(3.2, 2.2, 4.2);

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);

      const controls = new THREE.OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.8;

      // Lighting
      const ambient = new THREE.AmbientLight(0xffffff, 0.4);
      scene.add(ambient);

      const keyLight = new THREE.DirectionalLight('${config.primaryColor}', 3.0);
      keyLight.position.set(5, 8, 5);
      scene.add(keyLight);

      const rimLight = new THREE.PointLight('${config.accentColor}', 4.0, 15);
      rimLight.position.set(-4, -2, -4);
      scene.add(rimLight);

      // Model Assembly Group
      const assembly = new THREE.Group();
      scene.add(assembly);

      const primaryMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color('${config.primaryColor}'),
        metalness: 0.85,
        roughness: 0.25,
        wireframe: false,
      });

      const titaniumMat = new THREE.MeshStandardMaterial({
        color: 0x1f1f24,
        metalness: 0.95,
        roughness: 0.15,
      });

      const accentMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color('${config.accentColor}'),
        emissive: new THREE.Color('${config.accentColor}'),
        emissiveIntensity: 0.4,
        metalness: 0.5,
        roughness: 0.2,
      });

      // 4 Exploded Stages Mesh Components
      // Layer 0: Unibody Chassis Core
      const coreGeo = new THREE.CylinderGeometry(0.5, 0.6, 1.2, 16);
      const coreMesh = new THREE.Mesh(coreGeo, primaryMat);
      coreMesh.position.y = 0;
      assembly.add(coreMesh);

      // Layer 1: Outer Shell Shield
      const shellGeo = new THREE.TorusGeometry(0.85, 0.08, 16, 32);
      const shellMesh = new THREE.Mesh(shellGeo, titaniumMat);
      shellMesh.rotation.x = Math.PI / 2;
      assembly.add(shellMesh);

      // Layer 2: High-Torque Brushless Motor Ring
      const motorGeo = new THREE.CylinderGeometry(0.95, 0.95, 0.22, 24);
      const motorMesh = new THREE.Mesh(motorGeo, titaniumMat);
      motorMesh.position.y = 0;
      assembly.add(motorMesh);

      // Layer 3: Tactile Sensor Ring & Stator Pins
      const sensorGroup = new THREE.Group();
      for (let i = 0; i < 8; i++) {
        const pinGeo = new THREE.BoxGeometry(0.08, 0.25, 0.08);
        const pin = new THREE.Mesh(pinGeo, accentMat);
        const angle = (i / 8) * Math.PI * 2;
        pin.position.set(Math.cos(angle) * 1.1, 0, Math.sin(angle) * 1.1);
        sensorGroup.add(pin);
      }
      assembly.add(sensorGroup);

      // Apply Exploded Stage Distance
      const progress = ${config.explodedProgress} / 100.0;
      coreMesh.position.y = 0;
      shellMesh.position.y = progress * 1.4;
      motorMesh.position.y = -progress * 1.2;
      sensorGroup.position.y = progress * 2.2;

      ${config.raycastingLaser ? `
      // Laser Inspection Beam (1px Cyan Raycast)
      const laserPoints = [new THREE.Vector3(-2.8, 1.8, 0), new THREE.Vector3(0, 0, 0)];
      const laserGeo = new THREE.BufferGeometry().setFromPoints(laserPoints);
      const laserMat = new THREE.LineBasicMaterial({ color: new THREE.Color('${config.accentColor}'), linewidth: 2 });
      const laserLine = new THREE.Line(laserGeo, laserMat);
      scene.add(laserLine);

      // Laser Contact Ring
      const contactGeo = new THREE.RingGeometry(0.04, 0.08, 16);
      const contactMat = new THREE.MeshBasicMaterial({ color: new THREE.Color('${config.accentColor}'), side: THREE.DoubleSide });
      const contactMesh = new THREE.Mesh(contactGeo, contactMat);
      contactMesh.rotation.x = Math.PI / 2;
      scene.add(contactMesh);
      ` : ''}

      ${config.spatialPointCloud ? `
      // Spatial Point Cloud (1200+ Magnetic Particles)
      const particleCount = 1200;
      const posArray = new Float32Array(particleCount * 3);
      for (let i = 0; i < particleCount * 3; i += 3) {
        posArray[i] = (Math.random() - 0.5) * 8;
        posArray[i + 1] = (Math.random() - 0.5) * 6;
        posArray[i + 2] = (Math.random() - 0.5) * 8;
      }
      const cloudGeo = new THREE.BufferGeometry();
      cloudGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
      const cloudMat = new THREE.PointsMaterial({
        size: 0.025,
        color: new THREE.Color('${config.accentColor}'),
        transparent: true,
        opacity: 0.6,
      });
      const pointCloud = new THREE.Points(cloudGeo, cloudMat);
      scene.add(pointCloud);
      ` : ''}

      // Resize Handler
      window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
      });

      // Animation Loop
      let clock = new THREE.Clock();
      function animate() {
        requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();

        controls.update();

        ${config.raycastingLaser ? `
        const sweepY = Math.sin(elapsedTime * 2.5) * 0.8;
        laserPoints[1].set(Math.cos(elapsedTime) * 0.5, sweepY, Math.sin(elapsedTime) * 0.5);
        laserLine.geometry.setFromPoints(laserPoints);
        contactMesh.position.copy(laserPoints[1]);
        ` : ''}

        ${config.spatialPointCloud ? `
        pointCloud.rotation.y = elapsedTime * 0.03;
        ` : ''}

        renderer.render(scene, camera);
      }
      animate();
    })();

    // --- HARMONICS WAVE GRAPH ANIMATION ---
    (function() {
      const canvas = document.getElementById('harmonics-canvas');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      let step = 0;

      function draw() {
        requestAnimationFrame(draw);
        step += 0.08;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = '${config.accentColor}';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        for (let x = 0; x < canvas.width; x += 2) {
          const y = (canvas.height / 2) + Math.sin(x * 0.05 + step) * 18 * Math.cos(x * 0.02);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      draw();
    })();

    // --- TACTILE MATRIX INITIALIZER ---
    (function() {
      const grid = document.getElementById('tactile-grid');
      if (!grid) return;
      grid.innerHTML = '';
      for (let i = 0; i < 16; i++) {
        const cell = document.createElement('div');
        cell.className = 'tactile-cell';
        cell.innerText = 'C' + (i + 1).toString().padStart(2, '0');
        grid.appendChild(cell);
      }
      setInterval(() => {
        const cells = grid.querySelectorAll('.tactile-cell');
        cells.forEach((c) => c.classList.remove('active'));
        const activeIdx = Math.floor(Math.random() * cells.length);
        cells[activeIdx].classList.add('active');
      }, 400);
    })();
  </script>
</body>
</html>`;
}

/**
 * High-performance Fallback Generator for real-time Single-File HTML/Three.js
 */
export function generateFallbackCyberneticHTML(rawConfig: any): string {
  const config = normalizeStudioConfig(rawConfig);
  const bg = config.backgroundColor || '#09090B';
  const primary = config.primaryColor || '#5322FF';
  const accent = config.accentColor || '#00E5FF';
  const brand = config.compositionId || 'NODE_05_MANUFACTURING_FACTORY';
  const tag = config.slogan || 'Autonomous 3D Manufacturing Pipeline & Multi-Agent Swarm';
  const speed = 1.5;
  const isNode05 = brand.includes('NODE_05') || config.presetModel === 'kinematic_manipulator_arm';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${brand} // HYPERFRAME 60FPS</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=Space+Grotesk:wght@700&display=swap" rel="stylesheet">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body, html {
      width: 100%; height: 100%;
      background-color: ${bg};
      color: #F4F4F5;
      font-family: 'JetBrains Mono', monospace;
      overflow: hidden;
    }
    .hud-header {
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 48px;
      background: rgba(9, 9, 11, 0.7);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 16px;
      z-index: 30;
      font-size: 11px;
    }
    .badge {
      background: rgba(83, 34, 255, 0.15);
      border: 1px solid ${accent};
      color: ${accent};
      padding: 3px 8px;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 1px;
      text-transform: uppercase;
    }
    #three-viewport {
      width: 100%; height: 100%;
      position: absolute;
      top: 0; left: 0;
    }
    .hud-brand {
      position: absolute;
      bottom: 24px; left: 24px;
      z-index: 20;
      pointer-events: none;
    }
    .hud-brand h1 {
      font-size: 1.4rem;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: #fff;
      font-family: 'Space Grotesk', sans-serif;
    }
    .hud-brand p {
      font-size: 0.8rem;
      color: ${accent};
      opacity: 0.9;
      margin-top: 4px;
      letter-spacing: 1px;
    }
    .hud-telemetry {
      position: absolute;
      top: 60px; right: 16px;
      z-index: 20;
      background: rgba(0,0,0,0.75);
      border: 1px solid rgba(255,255,255,0.1);
      padding: 8px 12px;
      font-size: 10px;
      color: #a1a1aa;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
  </style>
</head>
<body>
  <header class="hud-header">
    <div style="display:flex; align-items:center; gap:8px;">
      <span style="width:6px; height:6px; border-radius:50%; background:${accent}; box-shadow:0 0 8px ${accent};"></span>
      <span style="font-weight:700; color:#fff;">${brand} // STUDIO RUNTIME</span>
      ${isNode05 ? '<span style="color:#a855f7; font-size:9px; border:1px solid #5322FF; padding:1px 4px; background:rgba(83,34,255,0.2);">NODE 05 PRESET</span>' : ''}
    </div>
    <div style="display:flex; align-items:center; gap:8px;">
      <span class="badge">SLA: 60FPS</span>
      <span class="badge" style="border-color:${primary}; color:${primary};">AST VALIDATED</span>
    </div>
  </header>

  <div id="three-viewport"></div>

  <div class="hud-brand">
    <h1>${brand}</h1>
    <p>${tag}</p>
  </div>

  <div class="hud-telemetry">
    <div>NODE: <span style="color:#fff;">${config.presetModel.toUpperCase()}</span></div>
    <div>EXPLODED: <span style="color:${accent};">${config.explodedProgress}%</span></div>
    <div>SLA: <span style="color:${primary};">${config.telemetryFps} FPS</span></div>
    <div>PIPELINE: <span style="color:#10b981;">DIFY + N8N SWARM</span></div>
  </div>

  <script>
    (function() {
      const container = document.getElementById('three-viewport');
      if (!container) return;

      const scene = new THREE.Scene();
      scene.background = new THREE.Color('${bg}');
      scene.fog = new THREE.FogExp2('${bg}', 0.05);

      const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
      camera.position.set(3.2, 2.4, 4.0);
      camera.lookAt(0, 0, 0);

      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);

      const ambient = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(ambient);

      const keyLight = new THREE.DirectionalLight('${primary}', 2.5);
      keyLight.position.set(5, 8, 5);
      scene.add(keyLight);

      const rimLight = new THREE.PointLight('${accent}', 3.0, 15);
      rimLight.position.set(-4, -2, -4);
      scene.add(rimLight);

      // Procedural 3D Mesh Group
      const group = new THREE.Group();
      scene.add(group);

      const mat = new THREE.MeshStandardMaterial({
        color: new THREE.Color('${primary}'),
        wireframe: true,
        metalness: 0.8,
        roughness: 0.2
      });

      // Assembly components with exploded displacement
      const core = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.7, 1.2, 16), mat);
      group.add(core);

      const arm = new THREE.Mesh(new THREE.BoxGeometry(0.3, 1.8, 0.3), mat);
      arm.position.set(0.6, 0.8 + (${config.explodedProgress} / 100.0) * 0.8, 0);
      arm.rotation.z = -0.4;
      group.add(arm);

      const ring = new THREE.Mesh(new THREE.TorusGeometry(1.1, 0.06, 16, 32), new THREE.MeshBasicMaterial({ color: '${accent}', wireframe: true }));
      ring.position.y = (${config.explodedProgress} / 100.0) * 0.6;
      ring.rotation.x = Math.PI / 2;
      group.add(ring);

      window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      });

      function animate() {
        requestAnimationFrame(animate);
        group.rotation.y += 0.008 * ${speed};
        ring.rotation.z += 0.01;
        renderer.render(scene, camera);
      }
      animate();
    })();
  </script>
</body>
</html>`;
}
