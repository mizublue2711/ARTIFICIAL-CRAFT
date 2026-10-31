import React from 'react';
import { HeroSection } from '@/components/robotics/sections/HeroSection';
import { BentoRoboticsEcosystem } from '@/components/robotics/sections/BentoRoboticsEcosystem';
import { DataFactorySection } from '@/components/robotics/sections/DataFactorySection';
import { SpecsAndSandboxSection } from '@/components/robotics/sections/SpecsAndSandboxSection';
import { TopTelemetryBar } from '@/components/robotics/hud/TopTelemetryBar';

export const RoboticsPage: React.FC = () => {
  return (
    <div className="w-full min-h-screen bg-[#09090B] text-zinc-200 pt-16">
      <TopTelemetryBar />
      <HeroSection />
      <BentoRoboticsEcosystem />
      <DataFactorySection />
      <SpecsAndSandboxSection />
    </div>
  );
};

export default RoboticsPage;
