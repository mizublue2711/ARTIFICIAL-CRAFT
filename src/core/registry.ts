import React from 'react';
import ParticleCanvas from '@/components/ParticleCanvas';
import ThreeHookCanvas from '@/components/ThreeHookCanvas';
import BrutalistLogo from '@/components/BrutalistLogo';
import ArtificialCraftLogo from '@/components/logos/ArtificialCraftLogo';
import PlugAndPlaySandbox from '@/components/PlugAndPlaySandbox';
import CsvDataVisualizer from '@/components/CsvDataVisualizer';
import ExistentialBlackbox from '@/components/ExistentialBlackbox';
import Hero from '@/components/Hero';
import BentoGrid from '@/components/BentoGrid';
import BlueprintLibrary from '@/components/BlueprintLibrary';
import BannerStudio from '@/components/BannerStudio';
import BatchProductionModal from '@/components/BatchProductionModal';
import Experts from '@/components/Experts';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { VisualComponentType, UniversalComponentProps } from '@/types/preset';

export type { VisualComponentType };

export const componentRegistry: Record<VisualComponentType | string, React.ComponentType<UniversalComponentProps>> = {
  ParticleCanvas: ParticleCanvas as unknown as React.ComponentType<UniversalComponentProps>,
  ThreeHookCanvas: ThreeHookCanvas as unknown as React.ComponentType<UniversalComponentProps>,
  BrutalistLogo: BrutalistLogo as unknown as React.ComponentType<UniversalComponentProps>,
  ArtificialCraftLogo: ArtificialCraftLogo as unknown as React.ComponentType<UniversalComponentProps>,
  PlugAndPlaySandbox: PlugAndPlaySandbox as unknown as React.ComponentType<UniversalComponentProps>,
  CsvDataVisualizer: CsvDataVisualizer as unknown as React.ComponentType<UniversalComponentProps>,
  ExistentialBlackbox: ExistentialBlackbox as unknown as React.ComponentType<UniversalComponentProps>,
  Hero: Hero as unknown as React.ComponentType<UniversalComponentProps>,
  BentoGrid: BentoGrid as unknown as React.ComponentType<UniversalComponentProps>,
  BlueprintLibrary: BlueprintLibrary as unknown as React.ComponentType<UniversalComponentProps>,
  BannerStudio: BannerStudio as unknown as React.ComponentType<UniversalComponentProps>,
  BatchProductionModal: BatchProductionModal as unknown as React.ComponentType<UniversalComponentProps>,
  Experts: Experts as unknown as React.ComponentType<UniversalComponentProps>,
  Footer: Footer as unknown as React.ComponentType<UniversalComponentProps>,
  Navbar: Navbar as unknown as React.ComponentType<UniversalComponentProps>,
};

export function getComponent(name: string) {
  return componentRegistry[name] || null;
}
