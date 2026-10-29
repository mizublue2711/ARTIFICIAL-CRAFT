import Hero from '@/components/Hero';
import PlugAndPlaySandbox from '@/components/PlugAndPlaySandbox';
import CsvDataVisualizer from '@/components/CsvDataVisualizer';
import BentoGrid from '@/components/BentoGrid';
import BlueprintLibrary from '@/components/BlueprintLibrary';
import BannerStudio from '@/components/BannerStudio';
import ExistentialBlackbox from '@/components/ExistentialBlackbox';
import Experts from '@/components/Experts';

interface HomeProps {
  onOpenBatchModal?: () => void;
}

function LogoMarquee() {
  const items = [
    'Dify', 'n8n', 'Pinecone', 'GPT-4o', 'Claude', 'Llama', 'Telegram',
    'Slack', 'HubSpot', 'Notion', 'Pipedrive', 'Mistral',
  ];
  return (
    <div className="relative py-10 border-y border-zinc-800/60 bg-[#09090b] overflow-hidden font-mono">
      <div className="text-center font-mono text-[10px] uppercase tracking-widest text-zinc-600 mb-6">
        Native integrations across the stack
      </div>
      <div className="relative mask-fade-edges overflow-hidden">
        <div className="flex gap-12 whitespace-nowrap" style={{ animation: 'marquee 32s linear infinite' }}>
          {[...items, ...items].map((name, i) => (
            <span
              key={i}
              className="font-mono text-[15px] font-medium text-zinc-600 hover:text-zinc-300 transition-colors"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
      <style>{`@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
    </div>
  );
}

export default function Home({ onOpenBatchModal }: HomeProps) {
  return (
    <main>
      <Hero onOpenBatchModal={onOpenBatchModal} />
      <LogoMarquee />
      <PlugAndPlaySandbox />
      <CsvDataVisualizer />
      <BentoGrid />
      <BlueprintLibrary />
      <BannerStudio onOpenBatchModal={onOpenBatchModal} />
      <ExistentialBlackbox />
      <Experts />
    </main>
  );
}
