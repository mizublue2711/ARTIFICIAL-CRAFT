import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BatchProductionModal from '@/components/BatchProductionModal';
import { LanguageProvider } from '@/context/LanguageContext';

import Home from '@/pages/Home';
import Library from '@/pages/Library';
import FlipbookReader from '@/pages/FlipbookReader';
import Playground from '@/pages/Playground';

function App() {
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);

  const handleOpenBatchModal = () => setIsBatchModalOpen(true);

  return (
    <LanguageProvider>
      <BrowserRouter>
        <div className="relative min-h-screen bg-[#09090b] text-zinc-200 selection:bg-cyan-400/20 flex flex-col justify-between">
          <Navbar onOpenBatchModal={handleOpenBatchModal} />

          <Routes>
            <Route path="/" element={<Home onOpenBatchModal={handleOpenBatchModal} />} />
            <Route path="/playground" element={<Playground />} />
            <Route path="/library" element={<Library />} />
            <Route path="/flipbook/:slug" element={<FlipbookReader />} />
          </Routes>

          <Footer />

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
