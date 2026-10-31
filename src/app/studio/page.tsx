import CraftStudioConfigurator from '@/components/studio/CraftStudioConfigurator';

export const metadata = {
  title: 'ARTIFICIAL CRAFT // STUDIO CONFIGURATOR',
  description: 'Autonomous 3D Web App Generator & Visual AI Studio',
};

export default function StudioPage() {
  return (
    <main className="min-h-screen bg-[#09090B] text-white pt-20">
      <CraftStudioConfigurator />
    </main>
  );
}
