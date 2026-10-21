/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSearch } from './components/HeroSearch';
import { FlightResults } from './components/FlightResults';
import { UkRoutesShowcase } from './components/UkRoutesShowcase';
import { BookingModal } from './components/BookingModal';
import { BoardingPassModal } from './components/BoardingPassModal';
import { OwnerPortalModal } from './components/OwnerPortalModal';
import { Footer } from './components/Footer';
import { Flight, Booking, CabinClass } from './types/flight';
import { searchDomesticFlights, getAirportByCode } from './data/mockFlights';
import { getFinancialSummary, getAllBookings } from './services/commissionService';
import { Wallet, ArrowRight } from 'lucide-react';

export default function App() {
  // Search parameters
  const [originCode, setOriginCode] = useState<string>('LHR');
  const [destinationCode, setDestinationCode] = useState<string>('EDI');
  const [departureDate, setDepartureDate] = useState<string>(() => {
    const today = new Date();
    today.setDate(today.getDate() + 2);
    return today.toISOString().split('T')[0];
  });
  const [passengersCount, setPassengersCount] = useState<number>(1);
  const [cabinClass, setCabinClass] = useState<CabinClass>('Economy');

  // Flight search results
  const [flights, setFlights] = useState<Flight[]>(() =>
    searchDomesticFlights('LHR', 'EDI', departureDate)
  );

  // Modals & Active Selections
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [activeBoardingPass, setActiveBoardingPass] = useState<Booking | null>(null);
  const [isOwnerPortalOpen, setIsOwnerPortalOpen] = useState<boolean>(false);

  // Owner Financials State
  const [financials, setFinancials] = useState(() => getFinancialSummary());

  // Owner Notification Toast (only triggered on booking completion)
  const [commissionToast, setCommissionToast] = useState<{
    amount: number;
    pnr: string;
    route: string;
  } | null>(null);

  const refreshFinancials = () => {
    setFinancials(getFinancialSummary());
  };

  const handleSearch = () => {
    const results = searchDomesticFlights(originCode, destinationCode, departureDate);
    setFlights(results);
    const resultsElement = document.getElementById('flight-results');
    if (resultsElement) {
      resultsElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectRouteFromShowcase = (orig: string, dest: string) => {
    setOriginCode(orig);
    setDestinationCode(dest);
    const results = searchDomesticFlights(orig, dest, departureDate);
    setFlights(results);
    const resultsElement = document.getElementById('flight-results');
    if (resultsElement) {
      resultsElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenMyTickets = () => {
    const all = getAllBookings();
    if (all.length > 0) {
      setActiveBoardingPass(all[0]);
    } else {
      alert('No tickets booked yet. Please search a domestic route and select a flight to book.');
    }
  };

  const handleBookingSuccess = (newBooking: Booking) => {
    setSelectedFlight(null);
    setActiveBoardingPass(newBooking);
    refreshFinancials();

    // Trigger owner commission alert
    setCommissionToast({
      amount: newBooking.ownerCommissionEarned,
      pnr: newBooking.bookingReference,
      route: `${newBooking.flight.origin.code} → ${newBooking.flight.destination.code}`,
    });

    setTimeout(() => {
      setCommissionToast(null);
    }, 6000);
  };

  const originAirport = getAirportByCode(originCode);
  const destAirport = getAirportByCode(destinationCode);

  return (
    <div className="min-h-screen bg-[#090d14] text-slate-100 flex flex-col font-sans selection:bg-amber-400 selection:text-black">
      {/* Discreet Owner Notification Toast */}
      {commissionToast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm bg-[#111724] border-2 border-amber-400 text-white p-4 rounded-2xl shadow-2xl animate-bounce">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-400 text-black flex items-center justify-center font-bold shrink-0">
              <Wallet className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  Partner Commission Dispatched
                </span>
                <button
                  onClick={() => setCommissionToast(null)}
                  className="text-slate-400 hover:text-white text-xs cursor-pointer"
                >
                  ✕
                </button>
              </div>
              <p className="text-sm font-black text-white mt-0.5">
                +£{commissionToast.amount.toFixed(2)} Credited to Owner Account
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Booking Reference {commissionToast.pnr} ({commissionToast.route}) confirmed.
              </p>
              <button
                onClick={() => {
                  setCommissionToast(null);
                  setIsOwnerPortalOpen(true);
                }}
                className="mt-2 text-xs font-bold text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Access Protected Owner Console</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Navigation Bar */}
      <Navbar
        onOpenOwnerPortal={() => setIsOwnerPortalOpen(true)}
        onOpenMyTickets={handleOpenMyTickets}
        onScrollToSection={handleScrollToSection}
      />

      <main className="flex-1">
        {/* Hero Section & Search Engine */}
        <HeroSearch
          originCode={originCode}
          setOriginCode={setOriginCode}
          destinationCode={destinationCode}
          setDestinationCode={setDestinationCode}
          departureDate={departureDate}
          setDepartureDate={setDepartureDate}
          passengersCount={passengersCount}
          setPassengersCount={setPassengersCount}
          cabinClass={cabinClass}
          setCabinClass={setCabinClass}
          onSearch={handleSearch}
        />

        {/* Flight Search Results */}
        <FlightResults
          flights={flights}
          originName={originAirport.city}
          destName={destAirport.city}
          departureDate={departureDate}
          onSelectFlight={(flight) => setSelectedFlight(flight)}
        />

        {/* UK Domestic Corridors & Airport Showcases */}
        <UkRoutesShowcase onSelectRoute={handleSelectRouteFromShowcase} />
      </main>

      {/* Booking Wizard Modal */}
      {selectedFlight && (
        <BookingModal
          flight={selectedFlight}
          departureDate={departureDate}
          passengersCount={passengersCount}
          cabinClass={cabinClass}
          onClose={() => setSelectedFlight(null)}
          onBookingSuccess={handleBookingSuccess}
        />
      )}

      {/* Boarding Pass / E-Ticket Modal with Dynamic Baggage Management */}
      {activeBoardingPass && (
        <BoardingPassModal
          booking={activeBoardingPass}
          onClose={() => setActiveBoardingPass(null)}
          onBookingUpdated={(updated) => {
            setActiveBoardingPass(updated);
            refreshFinancials();
          }}
        />
      )}

      {/* Owner Commission & Affiliate Hub Modal (Strictly PIN Protected) */}
      {isOwnerPortalOpen && (
        <OwnerPortalModal
          onClose={() => setIsOwnerPortalOpen(false)}
          onUpdateFinancials={refreshFinancials}
        />
      )}

      {/* Footer */}
      <Footer
        onOpenOwnerPortal={() => setIsOwnerPortalOpen(true)}
        onScrollToSection={handleScrollToSection}
      />
    </div>
  );
}
