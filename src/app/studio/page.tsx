import CraftStudioConfigurator from '@/components/studio/CraftStudioConfigurator';

export const metadata = {
  title: 'ARTIFICIAL CRAFT // STUDIO CONFIGURATOR',
  description: 'Autonomous 3D Web App Generator & Visual AI Studio',
};

export default function StudioPage() {
  return (
    <main className="h-screen w-full bg-[#09090B] text-white overflow-hidden pt-16 flex flex-col">
      <CraftStudioConfigurator />
    </main>
  );
}
