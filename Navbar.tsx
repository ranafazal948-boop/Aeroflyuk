import React from 'react';
import { Plane, Lock } from 'lucide-react';

interface NavbarProps {
  onOpenOwnerPortal: () => void;
  onOpenMyTickets: () => void;
  onScrollToSection: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenOwnerPortal,
  onOpenMyTickets,
  onScrollToSection,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#090d14]/95 backdrop-blur-md border-b border-[#243046]/70">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 py-3.5">
        {/* Zone 1: Brand Wordmark */}
        <div
          onClick={() => onScrollToSection('hero-search')}
          className="flex items-center gap-2.5 cursor-pointer whitespace-nowrap shrink-0 group"
        >
          <div className="w-8 h-8 rounded-lg bg-amber-400 text-black flex items-center justify-center font-bold shadow-md shadow-amber-400/20 group-hover:bg-amber-300 transition-colors">
            <Plane className="w-5 h-5 -rotate-45" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-extrabold tracking-tight text-white">
              AeroFly<span className="text-amber-400">UK</span>
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-400/90 hidden sm:inline">
              Domestic Air Service
            </span>
          </div>
        </div>

        {/* Zone 2: 4-5 single-line clean navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
          <button
            onClick={() => onScrollToSection('hero-search')}
            className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 text-left cursor-pointer"
          >
            Flight Schedules
          </button>
          <button
            onClick={() => onScrollToSection('popular-routes')}
            className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 text-left cursor-pointer"
          >
            Domestic Corridors
          </button>
          <button
            onClick={() => onScrollToSection('busiest-airports')}
            className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 text-left cursor-pointer"
          >
            Major Hubs
          </button>
          <button
            onClick={onOpenMyTickets}
            className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 text-left cursor-pointer"
          >
            My Boarding Pass
          </button>
        </nav>

        {/* Zone 3: 1 primary action - Secure Partner / Owner Portal (No public balance display) */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenOwnerPortal}
            title="Private Owner Authentication Portal"
            className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-black bg-amber-400 hover:bg-amber-300 rounded-lg transition-all shadow-md shadow-amber-400/20 cursor-pointer whitespace-nowrap shrink-0 active:scale-95"
          >
            <Lock className="w-3.5 h-3.5 text-black" />
            <span>Owner Portal</span>
          </button>
        </div>
      </div>
    </header>
  );
};
