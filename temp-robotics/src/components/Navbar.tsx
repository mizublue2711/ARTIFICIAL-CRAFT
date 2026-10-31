import React, { useState } from 'react';
import { Volume2, VolumeX, Menu, X, ArrowUpRight, ShieldCheck, Box } from 'lucide-react';
import { sfx } from '../utils/audio';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [muted, setMuted] = useState(false);

  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    sfx.setMuted(next);
    if (!next) sfx.playTacticalClick(2000, 0.02);
  };

  const navLinks = [
    { label: '3D ASSEMBLY FACTORY', href: '#' },
    { label: 'ROBOTICS ECOSYSTEM', href: '#ecosystem' },
    { label: 'DATA FACTORY', href: '#data-factory' },
    { label: 'SPECS & SDK', href: '#specs-sandbox' },
  ];

  return (
    <nav className="sticky top-0 z-30 w-full bg-[#09090B]/90 backdrop-blur-md border-b border-white/10 font-mono-cad text-xs">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand & Slogan */}
        <div className="flex items-center gap-4">
          <a
            href="#"
            className="flex items-center gap-2.5 group"
            onClick={() => sfx.playTacticalClick(1600, 0.02)}
          >
            {/* Tactical Hexagon/Cross Logo */}
            <div className="w-8 h-8 rounded-xs bg-[#5322FF] flex items-center justify-center border border-[#00E5FF]/40 shadow-sm shadow-[#5322FF]/30 group-hover:scale-105 transition-transform">
              <Box className="w-4 h-4 text-[#00E5FF]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-white tracking-widest text-sm font-display uppercase">
                  VinDynamics
                </span>
                <span className="text-[9px] px-1 py-0.2 bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/30 rounded-xs">
                  PHYSICAL AI
                </span>
              </div>
              <div className="text-[10px] text-zinc-400 tracking-wider">
                ROBOTS FOR EVERYONE
              </div>
            </div>
          </a>
        </div>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-6 text-[11px] text-zinc-400">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => sfx.playTacticalClick(1900, 0.015)}
              className="hover:text-[#00E5FF] transition-colors relative py-1"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Right Actions: Status Badge, Mute, CTA */}
        <div className="hidden lg:flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-black/60 border border-white/10 rounded-xs text-[10px] text-zinc-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>PLANT: <strong className="text-emerald-400">ONLINE</strong></span>
          </div>

          <button
            onClick={toggleMute}
            title={muted ? 'Unmute Audio' : 'Mute Tactical SFX'}
            className="p-1.5 border border-white/10 hover:border-white/20 bg-black/40 text-zinc-400 hover:text-white rounded-xs transition-colors"
          >
            {muted ? <VolumeX className="w-4 h-4 text-zinc-500" /> : <Volume2 className="w-4 h-4 text-[#00E5FF]" />}
          </button>

          <a
            href="#specs-sandbox"
            onClick={() => sfx.playTacticalClick(2200, 0.03)}
            className="flex items-center gap-1 px-3.5 py-1.5 bg-[#5322FF] hover:bg-[#5322FF]/90 text-white font-bold text-xs rounded-xs transition-colors shadow-sm shadow-[#5322FF]/20"
          >
            <span>DEV KIT ACCESS</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#00E5FF]" />
          </a>
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={toggleMute}
            className="p-1.5 border border-white/10 bg-black/40 text-zinc-400 rounded-xs"
          >
            {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#00E5FF]" />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 border border-white/10 text-zinc-300 hover:text-white rounded-xs"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#09090B] border-b border-white/10 px-6 py-4 space-y-3 animate-in slide-in-from-top-2">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => {
                setMobileMenuOpen(false);
                sfx.playTacticalClick(1900, 0.015);
              }}
              className="block text-zinc-300 hover:text-[#00E5FF] py-1 text-xs"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-2 border-t border-white/10">
            <a
              href="#specs-sandbox"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-center py-2 bg-[#5322FF] text-white font-bold text-xs rounded-xs"
            >
              DEV KIT ACCESS
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};
