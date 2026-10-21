import React from 'react';
import { ArrowRight, Plane, Clock, ShieldCheck, MapPin } from 'lucide-react';
import { POPULAR_UK_DOMESTIC_ROUTES, UK_AIRPORTS } from '../data/ukAirports';

interface UkRoutesShowcaseProps {
  onSelectRoute: (originCode: string, destCode: string) => void;
}

export const UkRoutesShowcase: React.FC<UkRoutesShowcaseProps> = ({ onSelectRoute }) => {
  const airportSpotlights = [
    {
      code: 'LHR',
      name: 'London Heathrow (Terminal 2 & 5)',
      city: 'London',
      image: '/src/assets/images/uk_airport_heathrow_1792555466905.jpg',
      stat: '55+ Daily Domestic Flights',
      description: 'Primary departure hub for British Airways domestic shuttle flights to Scotland and Northern Ireland.',
      corridors: ['Edinburgh (EDI)', 'Glasgow (GLA)', 'Belfast (BHD)', 'Aberdeen (ABZ)'],
    },
    {
      code: 'EDI',
      name: 'Edinburgh International',
      city: 'Edinburgh',
      image: '/src/assets/images/uk_airport_edinburgh_1792555466660.jpg',
      stat: 'Scotland’s Busiest Airport',
      description: 'Premier domestic corridor connecting the Scottish capital directly with London, Manchester and Birmingham.',
      corridors: ['London Heathrow (LHR)', 'London Gatwick (LGW)', 'Manchester (MAN)', 'Bristol (BRS)'],
    },
    {
      code: 'MAN',
      name: 'Manchester Airport (Terminals 1-3)',
      city: 'Manchester',
      image: '/src/assets/images/uk_airport_manchester_1792555467301.jpg',
      stat: 'North England Hub',
      description: 'High frequency domestic routes connecting Manchester to Belfast, Isle of Man, and Scottish regional hubs.',
      corridors: ['Belfast City (BHD)', 'Edinburgh (EDI)', 'Aberdeen (ABZ)', 'Jersey (JER)'],
    },
  ];

  return (
    <div className="py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* SECTION 1: POPULAR UK CORRIDORS */}
        <section id="popular-routes">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">
                <span>Direct City-to-City Connections</span>
                <span aria-hidden="true">·</span>
                <span>Sub-90 Minute Travel</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Britain’s Most Traveled Domestic Flight Corridors
              </h2>
            </div>
            <p className="text-xs text-slate-400 max-w-sm">
              Avoid 5-hour motorway journeys and rail disruptions. Fly non-stop between major UK economic centres.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {POPULAR_UK_DOMESTIC_ROUTES.map((route) => (
              <div
                key={`${route.origin}-${route.destination}`}
                onClick={() => onSelectRoute(route.origin, route.destination)}
                className="bg-[#121826] hover:bg-[#161f31] border border-[#243046] hover:border-amber-400/50 rounded-2xl p-5 cursor-pointer transition-all shadow-md group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                    <span className="font-mono-numbers font-semibold text-amber-400">{route.origin} ⇄ {route.destination}</span>
                    <span className="text-[11px] text-slate-400">{route.distance}</span>
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors">
                    {route.label}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Average flight time {route.avgTime}</span>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-[#1e283b] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">Typical Fare</span>
                    <span className="text-lg font-black text-amber-400 font-mono-numbers">{route.typicalFare}</span>
                  </div>
                  <button className="w-8 h-8 rounded-lg bg-amber-400/10 group-hover:bg-amber-400 text-amber-400 group-hover:text-black flex items-center justify-center transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 2: BUSIEST UK DOMESTIC AIRPORTS SPOTLIGHT */}
        <section id="busiest-airports">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">
                <span>Airport Infrastructure</span>
                <span aria-hidden="true">·</span>
                <span>Key Flight Hubs</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                The Busiest UK Domestic Airport Hubs
              </h2>
            </div>
            <p className="text-xs text-slate-400 max-w-sm">
              Equipped with dedicated UK domestic security lines, rapid baggage collection, and executive airline lounges.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {airportSpotlights.map((hub) => (
              <div
                key={hub.code}
                className="bg-[#121826] border border-[#243046] rounded-2xl overflow-hidden shadow-lg flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={hub.image}
                      alt={hub.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#121826] via-transparent to-black/30" />
                    <span className="absolute top-3 left-3 px-2.5 py-1 bg-amber-400 text-black font-extrabold text-xs rounded-lg font-mono-numbers">
                      {hub.code}
                    </span>
                    <span className="absolute bottom-3 right-3 text-xs font-bold text-amber-300 bg-black/60 px-2 py-0.5 rounded backdrop-blur-sm">
                      {hub.stat}
                    </span>
                  </div>

                  <div className="p-5">
                    <h3 className="text-lg font-bold text-white mb-1.5">{hub.name}</h3>
                    <p className="text-xs text-slate-300 leading-relaxed mb-4">{hub.description}</p>

                    <div className="space-y-1.5 pt-3 border-t border-[#1e283b]">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                        Top Connected Corridors:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {hub.corridors.map((c) => (
                          <span
                            key={c}
                            className="text-[11px] bg-[#1a2336] text-slate-300 border border-[#27354d] px-2 py-0.5 rounded-md"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <button
                    onClick={() => {
                      if (hub.code === 'LHR') onSelectRoute('LHR', 'EDI');
                      else if (hub.code === 'EDI') onSelectRoute('EDI', 'LHR');
                      else onSelectRoute('MAN', 'BHD');
                    }}
                    className="w-full py-2.5 bg-[#1b253b] hover:bg-amber-400 hover:text-black text-amber-400 font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    <span>View Flights From {hub.code}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 3: DOMESTIC TRAVEL ADVANTAGE */}
        <section className="bg-[#101623] border border-[#243046] rounded-2xl p-6 sm:p-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center shrink-0">
                <Plane className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white mb-1">No Passports Needed for UK Citizens</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Fly domestically across Great Britain & Northern Ireland using standard photographic ID or UK Driving License.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white mb-1">Beat Train Delays & Traffic</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  London to Edinburgh takes under 80 minutes in the air compared to 5 hours on rail, with reliable scheduled airlines.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white mb-1">UK CAA Consumer Protection</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Every booking is protected under UK Civil Aviation Authority standards and Air Passenger Duty transparency.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
