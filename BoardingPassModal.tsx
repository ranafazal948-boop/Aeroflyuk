import React, { useState } from 'react';
import {
  X,
  Printer,
  Plane,
  CheckCircle2,
  ShieldCheck,
  QrCode,
  Luggage,
  Plus,
  Trash2,
  Tag,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { Booking, BaggageItem } from '../types/flight';
import { updateBooking } from '../services/commissionService';

interface BoardingPassModalProps {
  booking: Booking;
  onClose: () => void;
  onBookingUpdated?: (updated: Booking) => void;
}

export const BoardingPassModal: React.FC<BoardingPassModalProps> = ({
  booking,
  onClose,
  onBookingUpdated,
}) => {
  const [currentBooking, setCurrentBooking] = useState<Booking>(booking);
  const [showBaggageManager, setShowBaggageManager] = useState<boolean>(false);
  const [baggageUpdateNotice, setBaggageUpdateNotice] = useState<string>('');

  const passenger = currentBooking.passengers[0];
  const { flight } = currentBooking;

  const handlePrint = () => {
    window.print();
  };

  // Add a new checked bag directly from boarding pass
  const handleAddBaggage = (type: 'standard_hold' | 'heavy_hold') => {
    const isHeavy = type === 'heavy_hold';
    const price = isHeavy ? 38.00 : 24.00;
    const weight = isHeavy ? 32 : 20;
    const label = isHeavy ? 'Heavy Hold Bag (32kg)' : 'Standard Hold Bag (20kg)';
    const tagSuffix = currentBooking.baggageItems.length + 1;
    const pnrClean = currentBooking.bookingReference.replace('UK-', '');

    const newBag: BaggageItem = {
      id: `BAG-${Date.now().toString().slice(-4)}`,
      type,
      label,
      weightLimitKg: weight,
      price,
      tagNumber: `${flight.airlineCode}-${isHeavy ? 'HVY' : 'STD'}-${pnrClean}-${tagSuffix}`,
      trackingStatus: 'Tag Printed',
    };

    const updatedBags = [...currentBooking.baggageItems, newBag];
    const newBaggageFee = updatedBags.reduce((sum, b) => sum + b.price, 0);
    const updatedFare = {
      ...currentBooking.fareBreakdown,
      baggageFee: newBaggageFee,
      totalAmount: currentBooking.fareBreakdown.baseFare + currentBooking.fareBreakdown.ukAirPassengerDuty + currentBooking.fareBreakdown.airportSecurityFee + newBaggageFee,
    };

    const updated: Booking = {
      ...currentBooking,
      baggageItems: updatedBags,
      fareBreakdown: updatedFare,
      passengers: [
        {
          ...passenger,
          checkedBagsCount: updatedBags.length,
        },
      ],
    };

    setCurrentBooking(updated);
    updateBooking(updated);
    if (onBookingUpdated) onBookingUpdated(updated);

    setBaggageUpdateNotice(`Added ${label}. Dynamic total updated to £${updatedFare.totalAmount.toFixed(2)}`);
    setTimeout(() => setBaggageUpdateNotice(''), 3500);
  };

  // Remove a checked bag dynamically
  const handleRemoveBaggage = (bagId: string) => {
    const removedBag = currentBooking.baggageItems.find((b) => b.id === bagId);
    const updatedBags = currentBooking.baggageItems.filter((b) => b.id !== bagId);
    const newBaggageFee = updatedBags.reduce((sum, b) => sum + b.price, 0);
    const updatedFare = {
      ...currentBooking.fareBreakdown,
      baggageFee: newBaggageFee,
      totalAmount: currentBooking.fareBreakdown.baseFare + currentBooking.fareBreakdown.ukAirPassengerDuty + currentBooking.fareBreakdown.airportSecurityFee + newBaggageFee,
    };

    const updated: Booking = {
      ...currentBooking,
      baggageItems: updatedBags,
      fareBreakdown: updatedFare,
      passengers: [
        {
          ...passenger,
          checkedBagsCount: updatedBags.length,
        },
      ],
    };

    setCurrentBooking(updated);
    updateBooking(updated);
    if (onBookingUpdated) onBookingUpdated(updated);

    setBaggageUpdateNotice(`Removed ${removedBag?.label || 'bag'}. Dynamic total updated to £${updatedFare.totalAmount.toFixed(2)}`);
    setTimeout(() => setBaggageUpdateNotice(''), 3500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/90 backdrop-blur-md overflow-y-auto print:bg-white print:p-0">
      <div className="relative w-full max-w-2xl bg-[#0d121c] border border-amber-400/40 rounded-3xl shadow-2xl overflow-hidden my-auto print:border-none print:shadow-none print:bg-white print:text-black">
        {/* Top notification banner */}
        <div className="bg-amber-400 text-black px-6 py-2.5 flex items-center justify-between text-xs font-bold uppercase tracking-wider print:hidden">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-black" />
            <span>UK Domestic E-Ticket Confirmed & Issued</span>
          </div>
          <button
            onClick={onClose}
            className="w-6 h-6 rounded-md hover:bg-black/10 flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Boarding Pass Container */}
        <div className="p-6 sm:p-8">
          {/* Ticket Header */}
          <div className="flex items-center justify-between pb-5 border-b border-[#243046] print:border-black">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-extrabold text-base shadow-sm"
                style={{ backgroundColor: flight.airlineLogoColor }}
              >
                {flight.airlineCode}
              </div>
              <div>
                <h3 className="text-lg font-black text-white print:text-black">{flight.airline}</h3>
                <p className="text-xs text-amber-400 font-semibold uppercase tracking-wider print:text-black">
                  UK Domestic Boarding Pass
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase tracking-widest block print:text-black">PNR Booking Ref</span>
              <span className="text-lg font-mono-numbers font-black text-amber-400 print:text-black">
                {currentBooking.bookingReference}
              </span>
            </div>
          </div>

          {/* Passenger & Flight Details Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-5 border-b border-[#243046] print:border-black text-xs">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 block print:text-slate-600">Passenger</span>
              <span className="text-sm font-bold text-white print:text-black">
                {passenger.title} {passenger.firstName} {passenger.lastName}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 block print:text-slate-600">Flight No</span>
              <span className="text-sm font-mono-numbers font-bold text-amber-400 print:text-black">
                {flight.flightNumber}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 block print:text-slate-600">Date</span>
              <span className="text-sm font-mono-numbers font-bold text-white print:text-black">
                {currentBooking.departureDate}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 block print:text-slate-600">Class & Fare</span>
              <span className="text-sm font-bold text-white print:text-black">
                {currentBooking.cabinClass} (£{currentBooking.fareBreakdown.totalAmount.toFixed(2)})
              </span>
            </div>
          </div>

          {/* Departure & Arrival Routing */}
          <div className="py-6 border-b border-[#243046] print:border-black">
            <div className="grid grid-cols-7 items-center">
              {/* Origin */}
              <div className="col-span-3">
                <div className="text-3xl sm:text-4xl font-black text-white font-mono-numbers print:text-black">
                  {flight.origin.code}
                </div>
                <div className="text-sm font-bold text-amber-400 print:text-black">{flight.origin.city}</div>
                <div className="text-xs text-slate-400 print:text-slate-600">{flight.terminal}</div>
                <div className="text-xs font-mono-numbers font-semibold text-slate-300 mt-1 print:text-black">
                  Dep: {flight.departureTime}
                </div>
              </div>

              {/* Graphic */}
              <div className="col-span-1 flex flex-col items-center">
                <Plane className="w-5 h-5 text-amber-400 rotate-90 print:text-black" />
                <span className="text-[10px] text-slate-400 uppercase mt-1 print:text-black">Direct</span>
              </div>

              {/* Destination */}
              <div className="col-span-3 text-right">
                <div className="text-3xl sm:text-4xl font-black text-white font-mono-numbers print:text-black">
                  {flight.destination.code}
                </div>
                <div className="text-sm font-bold text-amber-400 print:text-black">{flight.destination.city}</div>
                <div className="text-xs text-slate-400 print:text-slate-600">{flight.destination.name}</div>
                <div className="text-xs font-mono-numbers font-semibold text-slate-300 mt-1 print:text-black">
                  Arr: {flight.arrivalTime}
                </div>
              </div>
            </div>
          </div>

          {/* Gate, Boarding Time, Seat */}
          <div className="grid grid-cols-3 gap-3 py-5 bg-[#121926] rounded-2xl p-4 my-5 border border-[#232f44] print:bg-slate-100 print:border-black text-center">
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest block print:text-slate-600">Gate</span>
              <span className="text-xl sm:text-2xl font-black text-white font-mono-numbers print:text-black">
                {flight.gate}
              </span>
            </div>
            <div className="border-x border-[#243046] print:border-slate-300">
              <span className="text-[10px] text-slate-400 uppercase tracking-widest block print:text-slate-600">Boarding</span>
              <span className="text-xl sm:text-2xl font-black text-amber-400 font-mono-numbers print:text-black">
                {flight.departureTime}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest block print:text-slate-600">Seat</span>
              <span className="text-xl sm:text-2xl font-black text-white font-mono-numbers print:text-black">
                {passenger.seatNumber}
              </span>
            </div>
          </div>

          {/* DYNAMIC BAGGAGE TRACKING INTERFACE SECTION */}
          <div className="my-5 p-4 bg-[#111724] border border-[#232f44] rounded-2xl print:border-black print:bg-white">
            <div className="flex items-center justify-between pb-3 border-b border-[#202c42] print:border-slate-300">
              <div className="flex items-center gap-2">
                <Luggage className="w-4 h-4 text-amber-400 print:text-black" />
                <span className="text-xs font-bold text-white uppercase tracking-wider print:text-black">
                  Baggage Tracking & Allowance Interface
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-amber-400 font-mono-numbers font-bold print:text-black">
                  {currentBooking.baggageItems.length} Checked Bag{currentBooking.baggageItems.length === 1 ? '' : 's'}
                </span>
                <button
                  type="button"
                  onClick={() => setShowBaggageManager(!showBaggageManager)}
                  className="px-2.5 py-1 bg-[#1a2438] hover:bg-amber-400 hover:text-black text-amber-400 text-[11px] font-semibold rounded-lg transition-colors cursor-pointer print:hidden"
                >
                  {showBaggageManager ? 'Hide Manager' : 'Manage / Add Bags'}
                </button>
              </div>
            </div>

            {baggageUpdateNotice && (
              <div className="my-2 p-2 bg-emerald-950/70 border border-emerald-600 text-emerald-200 text-xs rounded-lg flex items-center gap-2 print:hidden">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{baggageUpdateNotice}</span>
              </div>
            )}

            {/* Live Tracked Baggage Items */}
            <div className="mt-3 space-y-2">
              {/* Hand bag is always shown */}
              <div className="flex items-center justify-between p-2.5 bg-[#0b0f17] rounded-xl text-xs print:bg-slate-50">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-slate-200 font-medium print:text-black">Cabin Hand Luggage (7kg)</span>
                </div>
                <span className="text-[11px] text-slate-400 font-mono-numbers print:text-slate-600">
                  Status: Carry-On Approved
                </span>
              </div>

              {/* Checked bags */}
              {currentBooking.baggageItems.map((bag, idx) => (
                <div
                  key={bag.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-2.5 bg-[#0b0f17] rounded-xl text-xs gap-2 border border-[#1e283b] print:border-slate-300 print:bg-slate-50"
                >
                  <div className="flex items-center gap-2">
                    <Tag className="w-3.5 h-3.5 text-amber-400 print:text-black shrink-0" />
                    <div>
                      <div className="font-bold text-white print:text-black flex items-center gap-2">
                        <span>{bag.label}</span>
                        <span className="text-[10px] text-amber-400 font-mono-numbers bg-amber-400/10 px-1.5 py-0.2 rounded print:text-black">
                          {bag.tagNumber}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 print:text-slate-600">
                        Tracking: <strong className="text-emerald-400 print:text-black">{bag.trackingStatus}</strong> · Belt 2 Arrival
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3">
                    <span className="font-mono-numbers font-bold text-white print:text-black">
                      £{bag.price.toFixed(2)}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveBaggage(bag.id)}
                      title="Remove this checked bag option"
                      className="text-red-400 hover:text-red-300 p-1 hover:bg-red-950/40 rounded transition-colors cursor-pointer print:hidden"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Interactive Add Baggage Manager drawer */}
            {showBaggageManager && (
              <div className="mt-4 pt-3 border-t border-[#1e283b] space-y-2 bg-[#090d14] p-3 rounded-xl print:hidden">
                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">
                  Add Checked Baggage Option (Dynamic Price Recalculation):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => handleAddBaggage('standard_hold')}
                    className="p-2.5 bg-[#141b2b] hover:bg-amber-400 hover:text-black border border-[#27354d] rounded-xl flex items-center justify-between transition-all cursor-pointer group"
                  >
                    <div className="text-left">
                      <div className="font-bold text-white group-hover:text-black">+ Standard 20kg Bag</div>
                      <div className="text-[10px] text-slate-400 group-hover:text-black">Generates instant tag</div>
                    </div>
                    <span className="font-mono-numbers font-bold text-amber-400 group-hover:text-black">
                      +£24.00
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleAddBaggage('heavy_hold')}
                    className="p-2.5 bg-[#141b2b] hover:bg-amber-400 hover:text-black border border-[#27354d] rounded-xl flex items-center justify-between transition-all cursor-pointer group"
                  >
                    <div className="text-left">
                      <div className="font-bold text-white group-hover:text-black">+ Heavy 32kg Bag</div>
                      <div className="text-[10px] text-slate-400 group-hover:text-black">Priority heavy ramp tag</div>
                    </div>
                    <span className="font-mono-numbers font-bold text-amber-400 group-hover:text-black">
                      +£38.00
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Barcode & Scannable QR Code */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#243046] print:border-black">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-white p-1 rounded-lg flex items-center justify-center text-black">
                <QrCode className="w-12 h-12" />
              </div>
              <div className="text-xs">
                <div className="text-slate-300 font-semibold print:text-black">Digital Airport Gate Pass</div>
                <div className="text-[11px] text-slate-400 print:text-slate-600 font-mono-numbers">
                  ID: {passenger.passportOrId} · Seq #042
                </div>
                <div className="text-[10px] text-amber-400 font-semibold print:text-black">
                  Valid for UK Domestic Security FastTrack
                </div>
              </div>
            </div>

            {/* Simulated Barcode */}
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-[3px] h-8">
                {[3, 1, 4, 2, 5, 1, 3, 2, 4, 1, 2, 5, 2, 3, 1, 4, 3, 2, 1, 5, 2, 4].map((w, idx) => (
                  <div
                    key={idx}
                    className="bg-white print:bg-black h-full rounded-[1px]"
                    style={{ width: `${w}px` }}
                  />
                ))}
              </div>
              <span className="text-[9px] font-mono text-slate-400 mt-1 tracking-widest print:text-black">
                *{currentBooking.bookingReference}*
              </span>
            </div>
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="px-6 py-4 bg-[#090d14] border-t border-[#243046] flex items-center justify-between print:hidden">
          <div className="text-xs text-slate-400">
            Official e-ticket sent to <span className="text-white font-semibold">{passenger.email}</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-[#1a2335] hover:bg-[#25324c] text-white text-xs font-semibold rounded-xl flex items-center gap-2 cursor-pointer transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Boarding Pass</span>
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-black text-xs font-extrabold rounded-xl cursor-pointer transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
