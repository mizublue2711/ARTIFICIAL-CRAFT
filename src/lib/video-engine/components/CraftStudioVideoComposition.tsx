import React from 'react';
import { AbsoluteFill } from 'remotion';
import { ThemeColorProvider } from './ui/ThemeColorProvider';
import { KineticTypography } from './ui/KineticTypography';
import { MeshViewportSequence } from './3d/MeshViewportSequence';
import { CyberneticHUDLayer, TelemetryData } from './backgrounds/CyberneticHUDLayer';
import { PostProcessingPipeline } from './parametric/PostProcessingPipeline';
import { SwissGridHUD } from './backgrounds/SwissGridHUD';

export interface CraftStudioVideoCompositionProps {
  brandName?: string;
  slogan?: string;
  primaryColor?: string;
  accentColor?: string;
  backgroundColor?: string;
  base_component?: string;
  assemblyStage?: number;
  telemetry?: TelemetryData;
  motion_tokens?: string[];
  logoUrl?: string;
  cameraAnglePreset?: string;
  glitchIntensity?: number;
  audioBpm?: number;
  playbackRate?: number;
  matrixGridSize?: number;
  watermarkPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

export const CraftStudioVideoComposition: React.FC<CraftStudioVideoCompositionProps> = ({
  brandName = 'ARTIFICIAL CRAFT',
  slogan = 'Robots for Everyone // Cybernetic Automation',
  primaryColor = '#5322FF',
  accentColor = '#00E5FF',
  backgroundColor = '#09090B',
  base_component = 'kinematic_manipulator_arm',
  assemblyStage = 33,
  telemetry = { slaTarget: '<2ms', fps: 60 },
  motion_tokens = ['kinetic-parallax', 'chromatic-aberration', 'glitch-flicker'],
  logoUrl,
  cameraAnglePreset = 'isometric-iso',
  glitchIntensity = 0.5,
  audioBpm = 120,
  playbackRate = 1.0,
  matrixGridSize = 48,
  watermarkPosition = 'top-right',
}) => {
  void cameraAnglePreset;
  void glitchIntensity;
  void audioBpm;
  void playbackRate;

  return (
    <ThemeColorProvider
      primaryColor={primaryColor}
      accentColor={accentColor}
      backgroundColor={backgroundColor}
    >
      <PostProcessingPipeline motion_tokens={motion_tokens}>
        <AbsoluteFill style={{ backgroundColor, overflow: 'hidden' }}>
          {/* Layer 1: Ambient Swiss Grid & Scan Laser */}
          <SwissGridHUD
            backgroundColor={backgroundColor}
            primaryColor={primaryColor}
            accentColor={accentColor}
            gridSize={matrixGridSize}
            showScanLine={true}
            showTelemetryCorners={false}
          />

          {/* Layer 2: 3D Mesh / Kinematic Assembler Viewport */}
          <AbsoluteFill style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MeshViewportSequence
              base_component={base_component}
              assemblyStage={assemblyStage}
              primaryColor={primaryColor}
              accentColor={accentColor}
              wireframe={true}
            />
          </AbsoluteFill>

          {/* Layer 3: Kinetic Typography Overlay (Title Reveal) */}
          <div
            style={{
              position: 'absolute',
              top: '70px',
              left: '32px',
              right: '32px',
              zIndex: 15,
              pointerEvents: 'none',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}
          >
            <div style={{ alignSelf: 'flex-start' }}>
              <KineticTypography
                text={brandName}
                color="#FFFFFF"
                accentColor={accentColor}
                animationType="TYPEWRITER_CHAR"
                fontSize={36}
                letterSpacing="2px"
              />
            </div>
            {slogan && (
              <div
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '13px',
                  color: `${accentColor}CC`,
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                }}
              >
                {slogan}
              </div>
            )}
          </div>

          {/* Optional Watermark / Logo */}
          {logoUrl && (
            <div
              style={{
                position: 'absolute',
                top: watermarkPosition.includes('top') ? '24px' : undefined,
                bottom: watermarkPosition.includes('bottom') ? '24px' : undefined,
                left: watermarkPosition.includes('left') ? '24px' : undefined,
                right: watermarkPosition.includes('right') ? '24px' : undefined,
                zIndex: 25,
                pointerEvents: 'none',
              }}
            >
              <img
                src={logoUrl}
                alt="Brand Logo"
                style={{ height: '24px', opacity: 0.8 }}
              />
            </div>
          )}

          {/* Layer 4: Cybernetic HUD Overlay */}
          <CyberneticHUDLayer
            telemetry={telemetry}
            primaryColor={primaryColor}
            accentColor={accentColor}
            brandName={brandName}
            assemblyStage={assemblyStage}
          />
        </AbsoluteFill>
      </PostProcessingPipeline>
    </ThemeColorProvider>
  );
};

export default CraftStudioVideoComposition;
