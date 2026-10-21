import React, { useState } from 'react';
import {
  X,
  Plane,
  Luggage,
  ShieldCheck,
  CreditCard,
  User,
  Mail,
  Phone,
  CheckCircle2,
  AlertCircle,
  Plus,
  Minus,
  Sparkles,
} from 'lucide-react';
import { Flight, Booking, Passenger, CabinClass, BaggageItem } from '../types/flight';
import { calculateCommissionForTicket, addBooking, getOwnerSettings } from '../services/commissionService';

interface BookingModalProps {
  flight: Flight;
  departureDate: string;
  passengersCount: number;
  cabinClass: CabinClass;
  onClose: () => void;
  onBookingSuccess: (booking: Booking) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  flight,
  departureDate,
  passengersCount,
  cabinClass,
  onClose,
  onBookingSuccess,
}) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Passenger details
  const [title, setTitle] = useState('Mr');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [idDocument, setIdDocument] = useState('');

  // Dynamic Baggage Quantities (User can add and remove checked bag options)
  const [standardBagsCount, setStandardBagsCount] = useState<number>(0); // 20kg at £24.00
  const [heavyBagsCount, setHeavyBagsCount] = useState<number>(0); // 32kg at £38.00
  const [sportsBagsCount, setSportsBagsCount] = useState<number>(0); // Sports/Golf gear at £45.00

  // Other travel options
  const [priorityBoarding, setPriorityBoarding] = useState<boolean>(false); // +£9.00
  const [travelInsurance, setTravelInsurance] = useState<boolean>(false); // +£12.00

  // Seat
  const [selectedSeat, setSelectedSeat] = useState<string>('04B');

  // Payment
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'applepay' | 'googlepay'>('card');
  const [cardNumber, setCardNumber] = useState('4532 8912 3456 7810');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvc, setCardCvc] = useState('781');
  const [isProcessing, setIsProcessing] = useState(false);
  const [formError, setFormError] = useState('');

  // Dynamic Pricing Calculations
  const baseFareTotal = flight.price * passengersCount;
  const ukApd = 7.00 * passengersCount; // UK Air Passenger Duty
  const airportFee = 4.50 * passengersCount;

  const standardBaggagePrice = standardBagsCount * 24.00;
  const heavyBaggagePrice = heavyBagsCount * 38.00;
  const sportsBaggagePrice = sportsBagsCount * 45.00;
  const totalBaggageFee = standardBaggagePrice + heavyBaggagePrice + sportsBaggagePrice;

  const extraServicesFee = (priorityBoarding ? 9.00 : 0) + (travelInsurance ? 12.00 : 0);
  const grandTotal = baseFareTotal + ukApd + airportFee + totalBaggageFee + extraServicesFee;

  const totalCheckedBagsCount = standardBagsCount + heavyBagsCount + sportsBagsCount;

  // Seat map rows
  const seatRows = ['02', '03', '04', '05', '06', '07', '08', '09'];
  const seatCols = ['A', 'B', 'C', 'D', 'E', 'F'];
  const occupiedSeats = ['02A', '02D', '03B', '03C', '05E', '06A', '07F', '08C'];

  const validateStep1 = () => {
    if (!firstName.trim() || !lastName.trim()) {
      setFormError('Please enter passenger full first and last name.');
      return false;
    }
    if (!email.trim() || !email.includes('@')) {
      setFormError('Please enter a valid email address for e-ticket delivery.');
      return false;
    }
    if (!phone.trim()) {
      setFormError('Please enter a UK or international telephone contact number.');
      return false;
    }
    setFormError('');
    return true;
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!validateStep1()) return;
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setCurrentStep(3);
    } else if (currentStep === 3) {
      setCurrentStep(4);
    }
  };

  const handleConfirmBooking = () => {
    setIsProcessing(true);

    setTimeout(() => {
      const ownerSettings = getOwnerSettings();
      const commissionEarned = calculateCommissionForTicket(baseFareTotal);
      const randomPnr = `UK-${Math.floor(10000 + Math.random() * 89999)}`;

      // Construct baggage items with unique tag identifiers
      const compiledBaggage: BaggageItem[] = [];
      let tagSeq = 1;

      for (let i = 0; i < standardBagsCount; i++) {
        compiledBaggage.push({
          id: `BAG-STD-${i + 1}`,
          type: 'standard_hold',
          label: 'Standard Hold Bag (20kg)',
          weightLimitKg: 20,
          price: 24.00,
          tagNumber: `${flight.airlineCode}-STD-${randomPnr.replace('UK-', '')}-${tagSeq++}`,
          trackingStatus: 'Tag Printed',
        });
      }

      for (let i = 0; i < heavyBagsCount; i++) {
        compiledBaggage.push({
          id: `BAG-HVY-${i + 1}`,
          type: 'heavy_hold',
          label: 'Heavy Hold Bag (32kg)',
          weightLimitKg: 32,
          price: 38.00,
          tagNumber: `${flight.airlineCode}-HVY-${randomPnr.replace('UK-', '')}-${tagSeq++}`,
          trackingStatus: 'Tag Printed',
        });
      }

      for (let i = 0; i < sportsBagsCount; i++) {
        compiledBaggage.push({
          id: `BAG-SPT-${i + 1}`,
          type: 'sports_special',
          label: 'Sports Equipment / Golf (23kg)',
          weightLimitKg: 23,
          price: 45.00,
          tagNumber: `${flight.airlineCode}-SPT-${randomPnr.replace('UK-', '')}-${tagSeq++}`,
          trackingStatus: 'Tag Printed',
        });
      }

      const newPassenger: Passenger = {
        title,
        firstName,
        lastName,
        email,
        phone,
        passportOrId: idDocument || 'UK-ID-VERIFIED',
        checkedBagsCount: totalCheckedBagsCount,
        seatNumber: selectedSeat,
      };

      const newBooking: Booking = {
        bookingReference: randomPnr,
        flight,
        departureDate,
        passengers: [newPassenger],
        cabinClass,
        baggageItems: compiledBaggage,
        fareBreakdown: {
          baseFare: baseFareTotal,
          ukAirPassengerDuty: ukApd,
          airportSecurityFee: airportFee,
          baggageFee: totalBaggageFee,
          totalAmount: grandTotal,
        },
        ownerCommissionEarned: commissionEarned,
        bookingTimestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
        status: 'Confirmed',
        paymentMethod: paymentMethod === 'card' ? `Card •••• ${cardNumber.slice(-4)}` : paymentMethod === 'applepay' ? 'Apple Pay' : 'Google Pay',
        affiliateSource: `${ownerSettings.apiConfig.activeProvider.toUpperCase()} Direct Booking Engine`,
      };

      addBooking(newBooking);
      setIsProcessing(false);
      onBookingSuccess(newBooking);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#111724] border border-[#27354d] rounded-2xl shadow-2xl overflow-hidden my-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-7 py-4 border-b border-[#243046] bg-[#0c101a]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-400 text-black flex items-center justify-center font-bold">
              <Plane className="w-5 h-5 -rotate-45" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-white">UK Domestic Flight Reservation</span>
                <span className="text-xs text-amber-400 font-mono-numbers font-semibold">({flight.flightNumber})</span>
              </div>
              <p className="text-xs text-slate-400">
                {flight.origin.city} ({flight.origin.code}) to {flight.destination.city} ({flight.destination.code}) · {departureDate}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#182236] hover:bg-[#202d47] text-slate-300 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Wizard Steps Navigation */}
        <div className="grid grid-cols-4 border-b border-[#243046] bg-[#0f1420] text-center text-xs font-semibold">
          <button
            onClick={() => setCurrentStep(1)}
            className={`py-3 px-2 flex items-center justify-center gap-1.5 transition-colors ${
              currentStep === 1 ? 'text-amber-400 border-b-2 border-amber-400 bg-amber-400/5' : 'text-slate-400'
            }`}
          >
            <span>1. Passenger</span>
          </button>
          <button
            onClick={() => {
              if (validateStep1()) setCurrentStep(2);
            }}
            className={`py-3 px-2 flex items-center justify-center gap-1.5 transition-colors ${
              currentStep === 2 ? 'text-amber-400 border-b-2 border-amber-400 bg-amber-400/5' : 'text-slate-400'
            }`}
          >
            <span>2. Baggage</span>
            {totalCheckedBagsCount > 0 && (
              <span className="px-1.5 py-0.2 bg-amber-400 text-black text-[10px] rounded-full font-bold">
                {totalCheckedBagsCount}
              </span>
            )}
          </button>
          <button
            onClick={() => {
              if (validateStep1()) setCurrentStep(3);
            }}
            className={`py-3 px-2 flex items-center justify-center gap-1.5 transition-colors ${
              currentStep === 3 ? 'text-amber-400 border-b-2 border-amber-400 bg-amber-400/5' : 'text-slate-400'
            }`}
          >
            <span>3. Seat Map</span>
          </button>
          <button
            onClick={() => {
              if (validateStep1()) setCurrentStep(4);
            }}
            className={`py-3 px-2 flex items-center justify-center gap-1.5 transition-colors ${
              currentStep === 4 ? 'text-amber-400 border-b-2 border-amber-400 bg-amber-400/5' : 'text-slate-400'
            }`}
          >
            <span>4. Payment (£{grandTotal.toFixed(2)})</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-7 max-h-[70vh] overflow-y-auto">
          {formError && (
            <div className="mb-4 p-3 bg-red-950/60 border border-red-800 text-red-200 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{formError}</span>
            </div>
          )}

          {/* STEP 1: PASSENGER DETAILS */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="text-sm font-bold text-white flex items-center gap-2 pb-2 border-b border-[#243046]">
                <User className="w-4 h-4 text-amber-400" />
                <span>Passenger Identification</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Title</label>
                  <select
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-[#182236] border border-[#2a3852] rounded-xl px-3 py-2.5 text-white text-sm focus:border-amber-400 focus:outline-none"
                  >
                    <option value="Mr">Mr</option>
                    <option value="Ms">Ms</option>
                    <option value="Mrs">Mrs</option>
                    <option value="Miss">Miss</option>
                    <option value="Dr">Dr</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Oliver"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full bg-[#182236] border border-[#2a3852] rounded-xl px-3.5 py-2.5 text-white text-sm focus:border-amber-400 focus:outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Last Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Harrison"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full bg-[#182236] border border-[#2a3852] rounded-xl px-3.5 py-2.5 text-white text-sm focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-amber-400" />
                    Email (for E-Ticket delivery) *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="oliver.h@ukmail.co.uk"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#182236] border border-[#2a3852] rounded-xl px-3.5 py-2.5 text-white text-sm focus:border-amber-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-amber-400" />
                    UK Mobile Number (for Flight SMS alerts) *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+44 7911 123456"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#182236] border border-[#2a3852] rounded-xl px-3.5 py-2.5 text-white text-sm focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Passport Number or UK Driving Licence (Optional for domestic check-in)
                </label>
                <input
                  type="text"
                  placeholder="e.g. GB9823412 or UK Driving Licence Number"
                  value={idDocument}
                  onChange={(e) => setIdDocument(e.target.value)}
                  className="w-full bg-[#182236] border border-[#2a3852] rounded-xl px-3.5 py-2.5 text-white text-sm focus:border-amber-400 focus:outline-none uppercase font-mono-numbers"
                />
              </div>
            </div>
          )}

          {/* STEP 2: DYNAMIC BAGGAGE TRACKING INTERFACE */}
          {currentStep === 2 && (
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-2 border-b border-[#243046]">
                <div className="text-sm font-bold text-white flex items-center gap-2">
                  <Luggage className="w-4 h-4 text-amber-400" />
                  <span>Baggage Allowance & Hold Luggage Selection</span>
                </div>
                <div className="text-xs text-amber-400 font-bold font-mono-numbers">
                  Baggage Total: £{totalBaggageFee.toFixed(2)}
                </div>
              </div>

              {/* Free Cabin Bag Allowance */}
              <div className="p-4 bg-[#141b2b] border border-[#28364f] rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">Under-Seat & Overhead Hand Luggage</div>
                    <div className="text-xs text-slate-400">
                      1x Cabin bag (up to 7kg, 56 x 45 x 25cm) included free with standard domestic fare
                    </div>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Included Free</span>
              </div>

              {/* Option 1: Standard Checked Hold Bag (20kg) with stepper */}
              <div className="p-4 bg-[#141b2b] border border-[#28364f] rounded-xl flex items-center justify-between gap-4">
                <div>
                  <div className="text-sm font-bold text-white">Standard Checked Hold Bag (20kg)</div>
                  <div className="text-xs text-slate-400">
                    Checked in at terminal desk. Includes automatic baggage tag ID & carousel tracking.
                  </div>
                  <div className="text-xs font-bold text-amber-400 font-mono-numbers mt-1">
                    £24.00 per piece
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={() => setStandardBagsCount(Math.max(0, standardBagsCount - 1))}
                    disabled={standardBagsCount === 0}
                    className="w-8 h-8 rounded-lg bg-[#1e293f] hover:bg-amber-400 hover:text-black disabled:opacity-30 disabled:pointer-events-none text-white flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-6 text-center text-sm font-bold font-mono-numbers text-white">
                    {standardBagsCount}
                  </span>
                  <button
                    type="button"
                    onClick={() => setStandardBagsCount(standardBagsCount + 1)}
                    className="w-8 h-8 rounded-lg bg-[#1e293f] hover:bg-amber-400 hover:text-black text-white flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Option 2: Heavy / Large Hold Bag (32kg) with stepper */}
              <div className="p-4 bg-[#141b2b] border border-[#28364f] rounded-xl flex items-center justify-between gap-4">
                <div>
                  <div className="text-sm font-bold text-white">Heavy Hold Luggage (32kg Maximum Allowance)</div>
                  <div className="text-xs text-slate-400">
                    High capacity allowance for extended stays. Heavy item tag issued for fast ramp priority.
                  </div>
                  <div className="text-xs font-bold text-amber-400 font-mono-numbers mt-1">
                    £38.00 per piece
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={() => setHeavyBagsCount(Math.max(0, heavyBagsCount - 1))}
                    disabled={heavyBagsCount === 0}
                    className="w-8 h-8 rounded-lg bg-[#1e293f] hover:bg-amber-400 hover:text-black disabled:opacity-30 disabled:pointer-events-none text-white flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-6 text-center text-sm font-bold font-mono-numbers text-white">
                    {heavyBagsCount}
                  </span>
                  <button
                    type="button"
                    onClick={() => setHeavyBagsCount(heavyBagsCount + 1)}
                    className="w-8 h-8 rounded-lg bg-[#1e293f] hover:bg-amber-400 hover:text-black text-white flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Option 3: Sports Equipment / Golf Clubs (23kg) with stepper */}
              <div className="p-4 bg-[#141b2b] border border-[#28364f] rounded-xl flex items-center justify-between gap-4">
                <div>
                  <div className="text-sm font-bold text-white">Sports Equipment & Golf Clubs (23kg)</div>
                  <div className="text-xs text-slate-400">
                    Specialist out-of-gauge carriage for golf bags, ski gear, or regional sporting kit.
                  </div>
                  <div className="text-xs font-bold text-amber-400 font-mono-numbers mt-1">
                    £45.00 per piece
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={() => setSportsBagsCount(Math.max(0, sportsBagsCount - 1))}
                    disabled={sportsBagsCount === 0}
                    className="w-8 h-8 rounded-lg bg-[#1e293f] hover:bg-amber-400 hover:text-black disabled:opacity-30 disabled:pointer-events-none text-white flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-6 text-center text-sm font-bold font-mono-numbers text-white">
                    {sportsBagsCount}
                  </span>
                  <button
                    type="button"
                    onClick={() => setSportsBagsCount(sportsBagsCount + 1)}
                    className="w-8 h-8 rounded-lg bg-[#1e293f] hover:bg-amber-400 hover:text-black text-white flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Live Baggage Manifest Preview */}
              <div className="p-4 bg-[#0a0f18] border border-[#222e43] rounded-xl">
                <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Baggage Manifest Summary
                </div>
                {totalCheckedBagsCount === 0 ? (
                  <p className="text-xs text-slate-400">
                    No hold luggage selected. Flying with complimentary 7kg cabin baggage only.
                  </p>
                ) : (
                  <div className="space-y-1.5 text-xs">
                    {standardBagsCount > 0 && (
                      <div className="flex justify-between text-slate-300">
                        <span>{standardBagsCount}x Standard Hold Bag (20kg limit)</span>
                        <span className="font-mono-numbers font-semibold">£{standardBaggagePrice.toFixed(2)}</span>
                      </div>
                    )}
                    {heavyBagsCount > 0 && (
                      <div className="flex justify-between text-slate-300">
                        <span>{heavyBagsCount}x Heavy Hold Bag (32kg limit)</span>
                        <span className="font-mono-numbers font-semibold">£{heavyBaggagePrice.toFixed(2)}</span>
                      </div>
                    )}
                    {sportsBagsCount > 0 && (
                      <div className="flex justify-between text-slate-300">
                        <span>{sportsBagsCount}x Sports Gear / Golf (23kg limit)</span>
                        <span className="font-mono-numbers font-semibold">£{sportsBaggagePrice.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="pt-2 border-t border-[#1e283b] flex justify-between font-bold text-amber-400">
                      <span>Total Checked Luggage ({totalCheckedBagsCount} {totalCheckedBagsCount === 1 ? 'piece' : 'pieces'})</span>
                      <span className="font-mono-numbers">£{totalBaggageFee.toFixed(2)}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 3: SEAT MAP */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="text-sm font-bold text-white flex items-center justify-between pb-2 border-b border-[#243046]">
                <div className="flex items-center gap-2">
                  <Plane className="w-4 h-4 text-amber-400" />
                  <span>Choose Your Seat ({flight.aircraft})</span>
                </div>
                <span className="text-xs text-amber-400 font-bold">Selected: {selectedSeat}</span>
              </div>

              <div className="p-4 bg-[#0a0e16] border border-[#222e43] rounded-xl flex flex-col items-center">
                <div className="w-24 h-6 border-t-2 border-x-2 border-slate-700 rounded-t-full mb-3 text-center text-[10px] text-slate-400">
                  Cockpit
                </div>

                {/* Seat Grid */}
                <div className="space-y-2">
                  {seatRows.map((row) => (
                    <div key={row} className="flex items-center gap-2">
                      <span className="w-6 text-[11px] text-slate-400 font-mono-numbers text-center">{row}</span>

                      {/* Left 3 seats (A, B, C) */}
                      <div className="flex gap-1.5">
                        {seatCols.slice(0, 3).map((col) => {
                          const seatCode = `${row}${col}`;
                          const isOccupied = occupiedSeats.includes(seatCode);
                          const isSelected = selectedSeat === seatCode;

                          return (
                            <button
                              key={seatCode}
                              disabled={isOccupied}
                              onClick={() => setSelectedSeat(seatCode)}
                              className={`w-8 h-8 rounded-md text-[11px] font-bold font-mono-numbers transition-all cursor-pointer ${
                                isOccupied
                                  ? 'bg-[#1b2333] text-slate-600 cursor-not-allowed opacity-40'
                                  : isSelected
                                  ? 'bg-amber-400 text-black shadow-md shadow-amber-400/30 ring-2 ring-amber-300'
                                  : 'bg-[#1e2a40] hover:bg-[#2b3b57] text-slate-200'
                              }`}
                            >
                              {col}
                            </button>
                          );
                        })}
                      </div>

                      {/* Aisle */}
                      <div className="w-5 text-center text-[9px] text-slate-600 uppercase font-mono tracking-tighter">
                        aisle
                      </div>

                      {/* Right 3 seats (D, E, F) */}
                      <div className="flex gap-1.5">
                        {seatCols.slice(3, 6).map((col) => {
                          const seatCode = `${row}${col}`;
                          const isOccupied = occupiedSeats.includes(seatCode);
                          const isSelected = selectedSeat === seatCode;

                          return (
                            <button
                              key={seatCode}
                              disabled={isOccupied}
                              onClick={() => setSelectedSeat(seatCode)}
                              className={`w-8 h-8 rounded-md text-[11px] font-bold font-mono-numbers transition-all cursor-pointer ${
                                isOccupied
                                  ? 'bg-[#1b2333] text-slate-600 cursor-not-allowed opacity-40'
                                  : isSelected
                                  ? 'bg-amber-400 text-black shadow-md shadow-amber-400/30 ring-2 ring-amber-300'
                                  : 'bg-[#1e2a40] hover:bg-[#2b3b57] text-slate-200'
                              }`}
                            >
                              {col}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-6 text-[11px] text-slate-400 mt-5 pt-3 border-t border-[#1f293d] w-full justify-center">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3.5 h-3.5 rounded bg-amber-400" />
                    <span>Selected</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3.5 h-3.5 rounded bg-[#1e2a40]" />
                    <span>Available</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3.5 h-3.5 rounded bg-[#1b2333] opacity-40" />
                    <span>Occupied</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: PAYMENT & DYNAMIC PRICE BREAKDOWN */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="text-sm font-bold text-white flex items-center gap-2 pb-2 border-b border-[#243046]">
                <CreditCard className="w-4 h-4 text-amber-400" />
                <span>Instant Ticket Issuance & Payment</span>
              </div>

              {/* Dynamic Price Breakdown */}
              <div className="p-4 bg-[#141b2b] border border-[#28364f] rounded-xl space-y-2 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Base Airfare ({flight.airline} · {passengersCount} Pax)</span>
                  <span className="font-mono-numbers font-semibold">£{baseFareTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>UK Air Passenger Duty (APD standard domestic)</span>
                  <span className="font-mono-numbers">£{ukApd.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Airport Aviation & Security Charge</span>
                  <span className="font-mono-numbers">£{airportFee.toFixed(2)}</span>
                </div>
                {totalBaggageFee > 0 && (
                  <div className="flex justify-between text-slate-200 font-medium">
                    <span>Checked Hold Luggage ({totalCheckedBagsCount} {totalCheckedBagsCount === 1 ? 'piece' : 'pieces'})</span>
                    <span className="font-mono-numbers text-amber-400 font-bold">£{totalBaggageFee.toFixed(2)}</span>
                  </div>
                )}
                {extraServicesFee > 0 && (
                  <div className="flex justify-between text-slate-300">
                    <span>Priority Services & Perks</span>
                    <span className="font-mono-numbers">£{extraServicesFee.toFixed(2)}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-[#27354d] flex justify-between text-sm font-black text-amber-400">
                  <span>Total Amount Payable</span>
                  <span className="font-mono-numbers text-base">£{grandTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Payment selector */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`py-2 px-3 text-xs font-bold rounded-xl border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    paymentMethod === 'card'
                      ? 'border-amber-400 bg-amber-400/10 text-amber-400'
                      : 'border-[#27354d] text-slate-400 bg-[#161e2f]'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Debit / Credit</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('applepay')}
                  className={`py-2 px-3 text-xs font-bold rounded-xl border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    paymentMethod === 'applepay'
                      ? 'border-amber-400 bg-amber-400/10 text-amber-400'
                      : 'border-[#27354d] text-slate-400 bg-[#161e2f]'
                  }`}
                >
                  <span>Apple Pay</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('googlepay')}
                  className={`py-2 px-3 text-xs font-bold rounded-xl border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    paymentMethod === 'googlepay'
                      ? 'border-amber-400 bg-amber-400/10 text-amber-400'
                      : 'border-[#27354d] text-slate-400 bg-[#161e2f]'
                  }`}
                >
                  <span>Google Pay</span>
                </button>
              </div>

              {/* Card Inputs */}
              {paymentMethod === 'card' && (
                <div className="space-y-3 bg-[#0f1523] p-4 rounded-xl border border-[#232f44]">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full bg-[#182236] border border-[#2a3852] rounded-xl px-3 py-2 text-white text-xs font-mono-numbers focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">Expiry Date</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full bg-[#182236] border border-[#2a3852] rounded-xl px-3 py-2 text-white text-xs font-mono-numbers focus:border-amber-400 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">Security Code (CVV)</label>
                      <input
                        type="password"
                        maxLength={3}
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        className="w-full bg-[#182236] border border-[#2a3852] rounded-xl px-3 py-2 text-white text-xs font-mono-numbers focus:border-amber-400 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="text-[11px] text-slate-400 flex items-center gap-1.5 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>UK Civil Aviation Authority ATOL consumer guarantee and 256-bit SSL encryption.</span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="flex items-center justify-between px-5 sm:px-7 py-4 border-t border-[#243046] bg-[#0c101a]">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStep((currentStep - 1) as any)}
              className="px-4 py-2 bg-[#182236] hover:bg-[#202d47] text-slate-300 text-xs font-semibold rounded-xl cursor-pointer"
            >
              Previous Step
            </button>
          ) : (
            <div />
          )}

          {currentStep < 4 ? (
            <button
              type="button"
              onClick={handleNextStep}
              className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-black text-xs font-extrabold rounded-xl shadow-md shadow-amber-400/20 cursor-pointer transition-all active:scale-95"
            >
              Continue to Step {currentStep + 1}
            </button>
          ) : (
            <button
              type="button"
              disabled={isProcessing}
              onClick={handleConfirmBooking}
              className="px-6 py-2.5 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-black text-xs font-black rounded-xl shadow-lg shadow-amber-400/25 flex items-center gap-2 cursor-pointer transition-all active:scale-95"
            >
              {isProcessing ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Issuing Ticket & Luggage Tags...</span>
                </>
              ) : (
                <>
                  <span>Confirm & Issue Ticket (£{grandTotal.toFixed(2)})</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
