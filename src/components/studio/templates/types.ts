import * as THREE from 'three';
import type React from 'react';

export type StationId = 0 | 1 | 2 | 3;

export interface AgentInfo {
  id: string;
  name: string;
  role: string;
  schemaStatus: string;
  pipeColor: number;
  hexColor: string;
  throughput: string;
  orbitAngle: number;
  orbitRadius: number;
  description: string;
}

export interface DiagnosticState {
  activeStation: StationId;
  purgeProgress: number; // 0.0 = Legacy AI (Decorative Wallpaper), 1.0 = ARTIFICIAL CRAFT (Deterministic Pipeline)
  shockwaveProgress: number; // 0 to 1 active wave
  shockwaveActive: boolean;
  activeAgentId: string;
  pistonCycleCount: number;
  pistonDrift: number; // Always 0.000%
  brainActiveNodes: number;
  brainCoherence: number;
  canvasDeformCount: number;
  canvasVerticesDeformed: number;
  ignitionTriggered: boolean;
  ignitionProgress: number;
  fps: number;
  audioMuted: boolean;
  dockCollapsed: boolean;
  laserScanY: number;
  dossierHovered: boolean;
}

export interface CameraBookmark {
  stationId: StationId;
  code: string;
  title: string;
  subtitle: string;
  position: THREE.Vector3;
  lookAt: THREE.Vector3;
}

export interface ThemeColors {
  SKY_ZENITH: number;
  SKY_HORIZON: number;
  BG_OBSIDIAN: number;
  CONCRETE_MATTE: number;
  INDOOR_BRUTALIST_WALL: number;
  TITANIUM_PANEL: number;
  OUTDOOR_ANTHRACITE_WALL: number;
  AMBIENT_MIDNIGHT: number;
  KEY_LIGHT_6500K: number;
  SWISS_GRID: number;
  SWISS_GRID_ACTIVE: number;
  ELECTRIC_INDIGO: number;
  CYAN_LASER: number;
  TITANIUM_DARK: number;
  TITANIUM_LIGHT: number;
  CHROME_VALVE: number;
  BLOAT_MAGENTA: number;
  BLOAT_AMBER: number;
  EMERALD_OK: number;
  CRIMSON_ALERT: number;
}

export interface DigitalPlumbingSwarmProps {
  projectName?: string;
  slogan?: string;
  primaryColor?: string;   // Default: "#5322FF" (Electric Indigo)
  accentColor?: string;    // Default: "#00E5FF" (Electric Cyan)
  backgroundColor?: string;// Default: "#09090B" (Obsidian Black)
  enableRaycasting?: boolean;
  className?: string;
  style?: React.CSSProperties;
}
