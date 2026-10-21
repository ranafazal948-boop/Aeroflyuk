import React from 'react';
import { Plane, ShieldCheck, Lock } from 'lucide-react';
import { UK_AIRPORTS } from '../data/ukAirports';

interface FooterProps {
  onOpenOwnerPortal: () => void;
  onScrollToSection: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenOwnerPortal, onScrollToSection }) => {
  return (
    <footer className="bg-[#070a0f] border-t border-[#1e2739] text-slate-400 text-xs mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-[#1b2333]">
          {/* Brand info */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-amber-400 text-black flex items-center justify-center font-bold">
                <Plane className="w-4 h-4 -rotate-45" />
              </div>
              <span className="text-lg font-black text-white">
                AeroFly<span className="text-amber-400">UK</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Dedicated UK domestic flight search, schedule aggregator, and automated travel partner booking gateway. Connecting Great Britain & Northern Ireland.
            </p>
            <div className="flex items-center gap-2 text-slate-400 text-[11px]">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>UK CAA & APD Compliant Portal</span>
            </div>
          </div>

          {/* Quick Hubs */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Major UK Hubs</h4>
            <ul className="space-y-1.5 text-slate-400">
              {UK_AIRPORTS.slice(0, 5).map((a) => (
                <li key={a.code}>
                  <button
                    onClick={() => onScrollToSection('hero-search')}
                    className="hover:text-amber-400 transition-colors cursor-pointer text-left"
                  >
                    {a.city} ({a.code})
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Regional Hubs */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Scotland & N. Ireland</h4>
            <ul className="space-y-1.5 text-slate-400">
              {UK_AIRPORTS.slice(5, 10).map((a) => (
                <li key={a.code}>
                  <button
                    onClick={() => onScrollToSection('hero-search')}
                    className="hover:text-amber-400 transition-colors cursor-pointer text-left"
                  >
                    {a.city} ({a.code})
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Owner & Legal */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Administration & Partner</h4>
            <p className="text-slate-400 mb-3 text-[11px] leading-relaxed">
              Website owner can configure bank payout accounts, adjust commission rates, and link affiliate APIs.
            </p>
            <button
              onClick={onOpenOwnerPortal}
              className="px-3.5 py-2 bg-[#121926] hover:bg-amber-400 hover:text-black text-amber-400 border border-amber-400/40 font-bold rounded-xl flex items-center gap-2 transition-all cursor-pointer text-xs"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Open Owner Commission Hub</span>
            </button>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <div>
            © 2026 AeroFly UK Ltd. All rights reserved. Registered UK travel partner & flight portal.
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-white cursor-pointer">Terms of Carriage</span>
            <span>·</span>
            <span className="hover:text-white cursor-pointer">Passenger Rights</span>
            <span>·</span>
            <span className="hover:text-white cursor-pointer">Air Passenger Duty Notice</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
