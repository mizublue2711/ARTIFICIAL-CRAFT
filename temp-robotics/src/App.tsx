/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Navbar } from './components/Navbar';
import { TopTelemetryBar } from './components/hud/TopTelemetryBar';
import { HeroSection } from './components/sections/HeroSection';
import { BentoRoboticsEcosystem } from './components/sections/BentoRoboticsEcosystem';
import { DataFactorySection } from './components/sections/DataFactorySection';
import { SpecsAndSandboxSection } from './components/sections/SpecsAndSandboxSection';
import { Footer } from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen bg-[#09090B] text-zinc-100 flex flex-col selection:bg-[#5322FF]/30 selection:text-[#00E5FF]">
      {/* 1. Tactical Navigation */}
      <Navbar />

      {/* 2. Top Telemetry Bar (System SLA, Kinematics, Hands, AI Brain) */}
      <TopTelemetryBar />

      <main className="flex-1 flex flex-col">
        {/* 3. Hero Section: The Exploded Robotics Assembly Factory */}
        <HeroSection />

        {/* 4. Section 1: Bento Grid Robotics Ecosystem */}
        <BentoRoboticsEcosystem />

        {/* 5. Section 2: Data Factory & Spatial Point Cloud */}
        <DataFactorySection />

        {/* 6. Section 3: Technical Specs Table & Live Code Sandbox */}
        <SpecsAndSandboxSection />
      </main>

      {/* 7. Tactical Swiss CAD Footer */}
      <Footer />
    </div>
  );
}
