import React, { useState } from 'react';
import { Plane, Clock, ShieldCheck, Luggage, ArrowRight, Zap, Check } from 'lucide-react';
import { Flight } from '../types/flight';

interface FlightResultsProps {
  flights: Flight[];
  originName: string;
  destName: string;
  departureDate: string;
  onSelectFlight: (flight: Flight) => void;
}

export const FlightResults: React.FC<FlightResultsProps> = ({
  flights,
  originName,
  destName,
  departureDate,
  onSelectFlight,
}) => {
  const [selectedAirlineFilter, setSelectedAirlineFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'price' | 'time' | 'duration'>('price');

  const airlinesList = Array.from(new Set(flights.map((f) => f.airline)));

  // Filter flights
  const filteredFlights = flights.filter((f) => {
    if (selectedAirlineFilter === 'all') return true;
    return f.airline === selectedAirlineFilter;
  });

  // Sort flights
  const sortedFlights = [...filteredFlights].sort((a, b) => {
    if (sortBy === 'price') return a.price - b.price;
    if (sortBy === 'time') return a.departureTime.localeCompare(b.departureTime);
    if (sortBy === 'duration') return a.durationMinutes - b.durationMinutes;
    return 0;
  });

  return (
    <section id="flight-results" className="py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with Route Info & Filters */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 pb-4 border-b border-[#243046]">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">
              <span>Direct UK Domestic Flight Schedules</span>
              <span aria-hidden="true">·</span>
              <span>Live Availability</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-2.5">
              <span>{originName}</span>
              <ArrowRight className="w-5 h-5 text-amber-400" />
              <span>{destName}</span>
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
              <span>Date: {departureDate}</span>
              <span aria-hidden="true">·</span>
              <span className="text-slate-300 font-medium">{sortedFlights.length} Direct Flights Found</span>
            </div>
          </div>

          {/* Controls: Filter & Sort */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Airline Filter */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-400">Carrier:</span>
              <select
                value={selectedAirlineFilter}
                onChange={(e) => setSelectedAirlineFilter(e.target.value)}
                className="bg-[#151c2a] text-slate-200 text-xs font-medium rounded-lg px-2.5 py-1.5 border border-[#27354d] focus:outline-none focus:border-amber-400 cursor-pointer"
              >
                <option value="all">All UK Carriers</option>
                {airlinesList.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Filter */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-400">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'price' | 'time' | 'duration')}
                className="bg-[#151c2a] text-slate-200 text-xs font-medium rounded-lg px-2.5 py-1.5 border border-[#27354d] focus:outline-none focus:border-amber-400 cursor-pointer"
              >
                <option value="price">Cheapest Price</option>
                <option value="time">Earliest Departure</option>
                <option value="duration">Shortest Flight</option>
              </select>
            </div>
          </div>
        </div>

        {/* Flights List */}
        {sortedFlights.length === 0 ? (
          <div className="text-center py-16 bg-[#111724] border border-[#243046] rounded-2xl p-8">
            <Plane className="w-12 h-12 text-slate-500 mx-auto mb-3" />
            <p className="text-slate-300 font-semibold mb-1">No flights found matching your filter</p>
            <p className="text-xs text-slate-400 mb-4">Try resetting the airline filter to view all flights on this corridor.</p>
            <button
              onClick={() => setSelectedAirlineFilter('all')}
              className="px-4 py-2 bg-amber-400 text-black text-xs font-bold rounded-lg cursor-pointer"
            >
              Reset Carrier Filter
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedFlights.map((flight) => {
              const hours = Math.floor(flight.durationMinutes / 60);
              const mins = flight.durationMinutes % 60;
              const durationStr = `${hours}h ${mins}m`;

              return (
                <div
                  key={flight.id}
                  className="bg-[#121826] hover:bg-[#151d2f] border border-[#243046] hover:border-amber-400/50 rounded-2xl p-4 sm:p-6 transition-all shadow-md group"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                    {/* Airline & Aircraft Spec */}
                    <div className="lg:col-span-3 flex items-center gap-3.5">
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-inner shrink-0"
                        style={{ backgroundColor: flight.airlineLogoColor }}
                      >
                        {flight.airlineCode}
                      </div>
                      <div>
                        <div className="text-base font-bold text-white group-hover:text-amber-400 transition-colors">
                          {flight.airline}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                          <span className="font-mono-numbers font-semibold text-slate-300">{flight.flightNumber}</span>
                          <span aria-hidden="true">·</span>
                          <span>{flight.aircraft}</span>
                        </div>
                      </div>
                    </div>

                    {/* Flight Times & Route Visual */}
                    <div className="lg:col-span-5 grid grid-cols-7 items-center gap-2">
                      {/* Departure */}
                      <div className="col-span-3 text-left">
                        <div className="text-xl sm:text-2xl font-black text-white font-mono-numbers">
                          {flight.departureTime}
                        </div>
                        <div className="text-xs font-bold text-amber-400 uppercase tracking-wide">
                          {flight.origin.code}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate max-w-[120px]">
                          {flight.terminal}
                        </div>
                      </div>

                      {/* Flight Path Graphic */}
                      <div className="col-span-1 flex flex-col items-center">
                        <span className="text-[10px] font-mono-numbers text-slate-400 font-semibold mb-1 whitespace-nowrap">
                          {durationStr}
                        </span>
                        <div className="w-full flex items-center justify-center relative">
                          <div className="w-full h-[1px] bg-slate-700" />
                          <Plane className="w-3.5 h-3.5 text-amber-400 absolute rotate-90" />
                        </div>
                        <span className="text-[9px] text-emerald-400 font-semibold mt-1 uppercase tracking-wider">
                          Non-Stop
                        </span>
                      </div>

                      {/* Arrival */}
                      <div className="col-span-3 text-right">
                        <div className="text-xl sm:text-2xl font-black text-white font-mono-numbers">
                          {flight.arrivalTime}
                        </div>
                        <div className="text-xs font-bold text-amber-400 uppercase tracking-wide">
                          {flight.destination.code}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate max-w-[120px] ml-auto">
                          Gate {flight.gate}
                        </div>
                      </div>
                    </div>

                    {/* Amenities & Punctuality */}
                    <div className="lg:col-span-2 flex flex-col gap-1 text-xs text-slate-400 border-t lg:border-t-0 lg:border-l border-[#243046] pt-3 lg:pt-0 lg:pl-5">
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <Luggage className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>Cabin bag included ({flight.baggageAllowance.cabinKg}kg)</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                        <Clock className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span>{flight.punctualityRate}% On-Time Record</span>
                      </div>
                      <div className="text-[11px] text-amber-400/90 font-medium">
                        Only {flight.availableSeats} seats left at this fare
                      </div>
                    </div>

                    {/* Fare & Booking CTA */}
                    <div className="lg:col-span-2 flex items-center lg:flex-col lg:items-end justify-between gap-3 border-t lg:border-t-0 border-[#243046] pt-3 lg:pt-0">
                      <div className="text-left lg:text-right">
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider block">One Way From</span>
                        <div className="text-2xl sm:text-3xl font-black text-amber-400 font-mono-numbers leading-none">
                          £{flight.price}
                        </div>
                        <span className="text-[10px] text-slate-400">incl. UK APD</span>
                      </div>

                      <button
                        onClick={() => onSelectFlight(flight)}
                        className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs rounded-xl flex items-center gap-2 shadow-md shadow-amber-400/20 transition-all cursor-pointer active:scale-95 whitespace-nowrap"
                      >
                        <span>Select Flight</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
