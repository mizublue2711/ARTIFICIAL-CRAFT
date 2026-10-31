import AboutClient from '@/components/about/AboutClient';

export const metadata = {
  title: 'ARTIFICIAL CRAFT // ABOUT US - THE PLUMBER & THE HEADLESS ARMY',
  description: 'Swiss Brutalism design precision with zero-drift code execution.',
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#09090B] text-white pt-24 pb-16">
      <AboutClient />
    </main>
  );
}
