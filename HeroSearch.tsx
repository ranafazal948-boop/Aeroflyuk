import React, { useState } from 'react';
import { Plane, ArrowRightLeft, Calendar, Users, Search, MapPin, Sparkles } from 'lucide-react';
import { UK_AIRPORTS, POPULAR_UK_DOMESTIC_ROUTES } from '../data/ukAirports';
import { CabinClass } from '../types/flight';

interface HeroSearchProps {
  originCode: string;
  setOriginCode: (val: string) => void;
  destinationCode: string;
  setDestinationCode: (val: string) => void;
  departureDate: string;
  setDepartureDate: (val: string) => void;
  passengersCount: number;
  setPassengersCount: (val: number) => void;
  cabinClass: CabinClass;
  setCabinClass: (val: CabinClass) => void;
  onSearch: () => void;
}

export const HeroSearch: React.FC<HeroSearchProps> = ({
  originCode,
  setOriginCode,
  destinationCode,
  setDestinationCode,
  departureDate,
  setDepartureDate,
  passengersCount,
  setPassengersCount,
  cabinClass,
  setCabinClass,
  onSearch,
}) => {
  const [tripType, setTripType] = useState<'oneway' | 'roundtrip'>('oneway');

  const handleSwapAirports = () => {
    const temp = originCode;
    setOriginCode(destinationCode);
    setDestinationCode(temp);
  };

  const handleQuickRouteSelect = (orig: string, dest: string) => {
    setOriginCode(orig);
    setDestinationCode(dest);
    onSearch();
  };

  return (
    <section id="hero-search" className="relative pt-6 pb-14 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Hero Visual Card with Sunset Aviation Image */}
        <div className="relative rounded-2xl overflow-hidden border border-[#243046] shadow-2xl mb-8 min-h-[380px] lg:min-h-[440px] flex flex-col justify-end p-6 sm:p-10">
          {/* Background Image with contrast scrim */}
          <img
            src="/src/assets/images/hero_uk_aviation_1792555465407.jpg"
            alt="UK domestic commercial aviation airliner taking off"
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#090d14] via-[#090d14]/75 to-black/35" />

          {/* Hero Content */}
          <div className="relative z-10 max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-amber-400 mb-3">
              <span>UK Domestic Flight Network</span>
              <span aria-hidden="true">·</span>
              <span>Direct City to City Links</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4 text-balance">
              Fly Between Britain’s Busiest Cities in Under 90 Minutes.
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-6 max-w-2xl">
              Instant live flight schedules and direct bookings connecting London, Edinburgh, Manchester, Belfast, Glasgow, and Aberdeen with verified e-tickets and transparent pricing.
            </p>

            {/* Popular Route Shortcuts */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-400 font-medium">Busiest Corridors:</span>
              {POPULAR_UK_DOMESTIC_ROUTES.slice(0, 4).map((r) => (
                <button
                  key={`${r.origin}-${r.destination}`}
                  onClick={() => handleQuickRouteSelect(r.origin, r.destination)}
                  className="px-2.5 py-1 rounded bg-[#131926]/90 hover:bg-amber-400 hover:text-black text-slate-200 border border-[#2d3a54] transition-all cursor-pointer font-medium"
                >
                  {r.label} <span className="text-amber-400 group-hover:text-black font-mono-numbers">({r.typicalFare})</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Flight Search Engine Container */}
        <div className="bg-[#111724] border border-[#243046] rounded-2xl p-5 sm:p-7 shadow-xl -mt-16 sm:-mt-20 relative z-20">
          {/* Top Controls: Trip Type & Cabin Class */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-5 mb-5 border-b border-[#1f293d]">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setTripType('oneway')}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  tripType === 'oneway'
                    ? 'bg-amber-400 text-black shadow-sm'
                    : 'text-slate-400 hover:text-white bg-[#172033]'
                }`}
              >
                One Way
              </button>
              <button
                type="button"
                onClick={() => setTripType('roundtrip')}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  tripType === 'roundtrip'
                    ? 'bg-amber-400 text-black shadow-sm'
                    : 'text-slate-400 hover:text-white bg-[#172033]'
                }`}
              >
                Round Trip
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs text-slate-300">
                <span className="text-slate-400">Class:</span>
                <select
                  value={cabinClass}
                  onChange={(e) => setCabinClass(e.target.value as CabinClass)}
                  className="bg-[#172033] text-amber-300 text-xs font-semibold rounded-md px-2.5 py-1 border border-[#2b3952] focus:outline-none focus:border-amber-400 cursor-pointer"
                >
                  <option value="Economy">Economy</option>
                  <option value="Premium Economy">Premium Economy</option>
                  <option value="Executive Class">Executive Class</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-slate-300">
                <Users className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-slate-400">Pax:</span>
                <select
                  value={passengersCount}
                  onChange={(e) => setPassengersCount(Number(e.target.value))}
                  className="bg-[#172033] text-white text-xs font-semibold rounded-md px-2.5 py-1 border border-[#2b3952] focus:outline-none focus:border-amber-400 cursor-pointer font-mono-numbers"
                >
                  <option value={1}>1 Passenger</option>
                  <option value={2}>2 Passengers</option>
                  <option value={3}>3 Passengers</option>
                  <option value={4}>4 Passengers</option>
                </select>
              </div>
            </div>
          </div>

          {/* Form Fields: Origin, Swap, Destination, Date, Action */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
            {/* Origin Airport */}
            <div className="md:col-span-3">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                Departure Airport
              </label>
              <div className="relative">
                <select
                  value={originCode}
                  onChange={(e) => setOriginCode(e.target.value)}
                  className="w-full bg-[#182236] border border-[#2a3852] focus:border-amber-400 rounded-xl px-3.5 py-3 text-white text-sm font-semibold appearance-none cursor-pointer focus:outline-none"
                >
                  {UK_AIRPORTS.map((airport) => (
                    <option key={`from-${airport.code}`} value={airport.code} disabled={airport.code === destinationCode}>
                      {airport.city} ({airport.code}) - {airport.name.replace(' Airport', '')}
                    </option>
                  ))}
                </select>
                <span className="absolute right-3.5 top-3.5 text-amber-400 font-mono-numbers text-xs font-bold pointer-events-none">
                  {originCode}
                </span>
              </div>
            </div>

            {/* Airport Swap Button */}
            <div className="md:col-span-1 flex justify-center py-1 md:py-0">
              <button
                type="button"
                onClick={handleSwapAirports}
                title="Swap departure and arrival airports"
                className="w-10 h-10 rounded-xl bg-[#1b253b] hover:bg-amber-400 hover:text-black text-slate-300 border border-[#2a3852] flex items-center justify-center transition-all cursor-pointer active:scale-95 shadow-sm"
              >
                <ArrowRightLeft className="w-4 h-4" />
              </button>
            </div>

            {/* Destination Airport */}
            <div className="md:col-span-3">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                Arrival Airport
              </label>
              <div className="relative">
                <select
                  value={destinationCode}
                  onChange={(e) => setDestinationCode(e.target.value)}
                  className="w-full bg-[#182236] border border-[#2a3852] focus:border-amber-400 rounded-xl px-3.5 py-3 text-white text-sm font-semibold appearance-none cursor-pointer focus:outline-none"
                >
                  {UK_AIRPORTS.map((airport) => (
                    <option key={`to-${airport.code}`} value={airport.code} disabled={airport.code === originCode}>
                      {airport.city} ({airport.code}) - {airport.name.replace(' Airport', '')}
                    </option>
                  ))}
                </select>
                <span className="absolute right-3.5 top-3.5 text-amber-400 font-mono-numbers text-xs font-bold pointer-events-none">
                  {destinationCode}
                </span>
              </div>
            </div>

            {/* Date Picker */}
            <div className="md:col-span-3">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                Flight Date
              </label>
              <input
                type="date"
                value={departureDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setDepartureDate(e.target.value)}
                className="w-full bg-[#182236] border border-[#2a3852] focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-white text-sm font-semibold font-mono-numbers focus:outline-none cursor-pointer"
              />
            </div>

            {/* Search Submit CTA */}
            <div className="md:col-span-2">
              <button
                type="button"
                onClick={onSearch}
                className="w-full bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-sm py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-amber-400/25 transition-all cursor-pointer active:scale-95"
              >
                <Search className="w-4 h-4 text-black stroke-[2.5]" />
                <span>Search Flights</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
