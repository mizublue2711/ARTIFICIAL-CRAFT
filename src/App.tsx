import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import BentoGrid from '@/components/BentoGrid';
import BlueprintLibrary from '@/components/BlueprintLibrary';
import BannerStudio from '@/components/BannerStudio';
import Experts from '@/components/Experts';
import Footer from '@/components/Footer';
import { LanguageProvider } from '@/context/LanguageContext';

function LogoMarquee() {
  const items = [
    'Dify', 'n8n', 'Pinecone', 'GPT-4o', 'Claude', 'Llama', 'Telegram',
    'Slack', 'HubSpot', 'Notion', 'Pipedrive', 'Mistral',
  ];
  return (
    <div className="relative py-10 border-y border-zinc-800/60 bg-[#09090b] overflow-hidden">
      <div className="text-center font-mono text-[10px] uppercase tracking-widest text-zinc-600 mb-6">
        Native integrations across the stack
      </div>
      <div className="relative mask-fade-edges overflow-hidden">
        <div className="flex gap-12 animate-[float_30s_linear_infinite] whitespace-nowrap" style={{ animation: 'marquee 32s linear infinite' }}>
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

function App() {
  return (
    <LanguageProvider>
      <div className="relative min-h-screen bg-[#09090b] text-zinc-200 selection:bg-cyan-400/20">
        <Navbar />
        <main>
          <Hero />
          <LogoMarquee />
          <BentoGrid />
          <BlueprintLibrary />
          <BannerStudio />
          <Experts />
        </main>
        <Footer />
      </div>
    </LanguageProvider>
  );
}

export default App;
