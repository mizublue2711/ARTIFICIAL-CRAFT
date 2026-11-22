import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import BatchProductionModal from '@/components/BatchProductionModal';
import { PreloaderStage } from '@/components/motion/PreloaderStage';
import { LanguageProvider } from '@/context/LanguageContext';

import Home from '@/pages/Home';
import Library from '@/pages/Library';
import FlipbookReader from '@/pages/FlipbookReader';
import PlaygroundPage from '@/pages/Playground';
import RoboticsPage from '@/pages/Robotics';
import StudioPage from '@/app/studio/page';
import AboutPage from '@/app/about/page';
import DocsArchitecture from '@/pages/DocsArchitecture';
import ShowcasePage from '@/pages/ShowcasePage';

function App() {
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [isPreloaderComplete, setIsPreloaderComplete] = useState(false);

  const handleOpenBatchModal = () => setIsBatchModalOpen(true);

  return (
    <LanguageProvider>
      <BrowserRouter>
        <PreloaderStage onComplete={() => setIsPreloaderComplete(true)} />
        <div className="relative w-full min-h-screen bg-[#05050A] text-zinc-200 selection:bg-cyan-400/20 flex flex-col justify-between">
          <Navbar onOpenBatchModal={handleOpenBatchModal} />

          <div className="w-full flex-1 bg-[#05050A]">
            <Routes>
              <Route
                path="/"
                element={
                  <Home
                    onOpenBatchModal={handleOpenBatchModal}
                    isPreloaderComplete={isPreloaderComplete}
                  />
                }
              />
              <Route path="/library" element={<Library />} />
              <Route path="/flipbook/:slug" element={<FlipbookReader />} />
              <Route path="/playground" element={<PlaygroundPage />} />
              <Route path="/robotics" element={<RoboticsPage />} />
              <Route path="/studio" element={<StudioPage />} />
              <Route path="/showcase" element={<ShowcasePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/docs/architecture" element={<DocsArchitecture />} />
            </Routes>
          </div>

          <Footer />

          {/* Cybernetic Brutalist Floating Back To Top */}
          <BackToTop />

          {/* Global Batch Production Modal */}
          <BatchProductionModal
            isOpen={isBatchModalOpen}
            onClose={() => setIsBatchModalOpen(false)}
          />
        </div>
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;
