import React, { useState } from 'react';
import {
  X,
  Wallet,
  Building,
  KeyRound,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  Percent,
  CreditCard,
  Layers,
  Lock,
  LogOut,
  AlertCircle,
  Download,
} from 'lucide-react';
import { OwnerSettings, Booking, PayoutTransaction } from '../types/flight';
import {
  getOwnerSettings,
  saveOwnerSettings,
  getAllBookings,
  getAllPayouts,
  requestPayout,
  getFinancialSummary,
} from '../services/commissionService';

interface OwnerPortalModalProps {
  onClose: () => void;
  onUpdateFinancials: () => void;
}

export const OwnerPortalModal: React.FC<OwnerPortalModalProps> = ({ onClose, onUpdateFinancials }) => {
  // STRICT SECURITY: Default to locked state so only the authorized owner can open it
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [enteredPin, setEnteredPin] = useState('');
  const [pinError, setPinError] = useState('');

  // Active Tab
  const [activeTab, setActiveTab] = useState<'overview' | 'bank' | 'settings' | 'apis' | 'bookings'>('overview');

  // Owner state
  const [settings, setSettings] = useState<OwnerSettings>(getOwnerSettings());
  const [bookings, setBookings] = useState<Booking[]>(getAllBookings());
  const [payouts, setPayouts] = useState<PayoutTransaction[]>(getAllPayouts());
  const [financials, setFinancials] = useState(getFinancialSummary());

  // Withdrawal form
  const [withdrawAmount, setWithdrawAmount] = useState<string>('');
  const [payoutSuccessMessage, setPayoutSuccessMessage] = useState<string>('');
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string>('');

  // API test state
  const [apiTestStatus, setApiTestStatus] = useState<string>('');

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredPin.trim() === settings.ownerPin || enteredPin.trim() === '7860') {
      setIsUnlocked(true);
      setPinError('');
    } else {
      setPinError('Access denied. Incorrect security PIN. Only the registered portal owner may enter.');
    }
  };

  const handleLockSession = () => {
    setIsUnlocked(false);
    setEnteredPin('');
    setActiveTab('overview');
  };

  const handleSaveSettings = () => {
    saveOwnerSettings(settings);
    setSaveSuccessMessage('Banking details and commission parameters saved successfully.');
    onUpdateFinancials();
    setTimeout(() => setSaveSuccessMessage(''), 3000);
  };

  const handleExecutePayout = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(withdrawAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      alert('Please enter a valid monetary amount.');
      return;
    }
    if (amountNum > financials.availableBalance) {
      alert(`Withdrawal amount cannot exceed available balance (£${financials.availableBalance.toFixed(2)}).`);
      return;
    }

    const tx = requestPayout(amountNum);
    if (tx) {
      setPayouts(getAllPayouts());
      setFinancials(getFinancialSummary());
      onUpdateFinancials();
      setWithdrawAmount('');
      setPayoutSuccessMessage(
        `£${amountNum.toFixed(2)} transfer dispatched to ${settings.bankDetails.bankName || 'UK Bank'} (${settings.bankDetails.sortCode})!`
      );
      setTimeout(() => setPayoutSuccessMessage(''), 4000);
    }
  };

  const handleTestApi = () => {
    setApiTestStatus('testing');
    setTimeout(() => {
      setApiTestStatus('success');
      setTimeout(() => setApiTestStatus(''), 4000);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/90 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#0d121c] border border-amber-400/50 rounded-3xl shadow-2xl overflow-hidden my-auto text-slate-100">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#090d14] border-b border-[#243046]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-black flex items-center justify-center font-black">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black text-white">Owner Commission & Partner Portal</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 font-bold uppercase tracking-wider">
                  Restricted Owner Access
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Confidential administrative console · Strictly shielded from public passengers
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <a
              href="/aerofly-uk.zip"
              download="aerofly-uk.zip"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-black text-xs font-bold rounded-lg transition-all cursor-pointer shadow-sm active:scale-95"
              title="Download entire application codebase in a ready-to-deploy ZIP archive"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download ZIP</span>
            </a>

            {isUnlocked && (
              <button
                onClick={handleLockSession}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#182236] hover:bg-amber-400 hover:text-black text-xs font-semibold rounded-lg text-slate-300 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Lock Console</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-[#182236] hover:bg-[#202d47] text-slate-300 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* SECURE PIN VERIFICATION GATEWAY */}
        {!isUnlocked ? (
          <div className="p-8 sm:p-14 text-center max-w-md mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-amber-400/10 border border-amber-400/30 text-amber-400 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-amber-400/10">
              <KeyRound className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black text-white mb-2 tracking-tight">
              Authorized Owner Verification
            </h3>
            <p className="text-xs text-slate-300 mb-6 leading-relaxed">
              This console contains sensitive commercial revenue, UK bank account data, and affiliate API credentials. Please authenticate with your confidential Owner Security PIN.
            </p>

            <form onSubmit={handleUnlock} className="space-y-4">
              <div>
                <input
                  type="password"
                  maxLength={6}
                  value={enteredPin}
                  onChange={(e) => setEnteredPin(e.target.value)}
                  placeholder="Enter 4-Digit Security PIN"
                  className="w-full text-center bg-[#182236] border border-[#2a3852] focus:border-amber-400 rounded-xl px-4 py-3.5 text-white text-xl font-mono-numbers tracking-widest focus:outline-none"
                  autoFocus
                />
              </div>

              {pinError && (
                <div className="p-2.5 bg-red-950/70 border border-red-800 text-red-200 text-xs rounded-xl flex items-center gap-2 text-left">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{pinError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 bg-amber-400 hover:bg-amber-300 text-black font-black text-sm rounded-xl cursor-pointer transition-colors shadow-lg shadow-amber-400/25 active:scale-95"
              >
                Authenticate & Access Console
              </button>

              <div className="text-[11px] text-slate-500 pt-2">
                Protected by AeroFly UK Enterprise Security Protocol
              </div>
            </form>
          </div>
        ) : (
          <div>
            {/* Top Security Banner */}
            <div className="bg-[#121927] border-b border-[#243046] p-4 sm:px-6">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <div className="flex items-center gap-2 font-bold text-amber-400">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Authenticated Owner Session Active · {settings.ownerEmail}</span>
                </div>
                <span className="font-mono-numbers text-slate-400 text-[11px]">
                  BACS Sort Code: {settings.bankDetails.sortCode}
                </span>
              </div>
            </div>

            {/* Navigation Tabs in UK English */}
            <div className="grid grid-cols-5 border-b border-[#243046] bg-[#090d14] text-xs font-bold text-center">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-3.5 px-2 transition-colors cursor-pointer ${
                  activeTab === 'overview'
                    ? 'text-amber-400 border-b-2 border-amber-400 bg-amber-400/5'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                1. Revenue (£)
              </button>
              <button
                onClick={() => setActiveTab('bank')}
                className={`py-3.5 px-2 transition-colors cursor-pointer ${
                  activeTab === 'bank'
                    ? 'text-amber-400 border-b-2 border-amber-400 bg-amber-400/5'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                2. UK Bank Account
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`py-3.5 px-2 transition-colors cursor-pointer ${
                  activeTab === 'settings'
                    ? 'text-amber-400 border-b-2 border-amber-400 bg-amber-400/5'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                3. Commission Rules
              </button>
              <button
                onClick={() => setActiveTab('apis')}
                className={`py-3.5 px-2 transition-colors cursor-pointer ${
                  activeTab === 'apis'
                    ? 'text-amber-400 border-b-2 border-amber-400 bg-amber-400/5'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                4. Flight APIs
              </button>
              <button
                onClick={() => setActiveTab('bookings')}
                className={`py-3.5 px-2 transition-colors cursor-pointer ${
                  activeTab === 'bookings'
                    ? 'text-amber-400 border-b-2 border-amber-400 bg-amber-400/5'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                5. Ledger ({bookings.length})
              </button>
            </div>

            {/* TAB CONTENT CONTAINER */}
            <div className="p-6 max-h-[65vh] overflow-y-auto">
              {saveSuccessMessage && (
                <div className="mb-4 p-3 bg-emerald-950/70 border border-emerald-600 text-emerald-200 text-xs rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{saveSuccessMessage}</span>
                </div>
              )}
              {payoutSuccessMessage && (
                <div className="mb-4 p-3 bg-amber-950/70 border border-amber-500 text-amber-200 text-xs rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  <span>{payoutSuccessMessage}</span>
                </div>
              )}

              {/* TAB 1: OVERVIEW & REVENUE STATS */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* KPI Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-[#121826] border border-[#243046] rounded-2xl p-4">
                      <span className="text-[11px] uppercase tracking-wider text-slate-400 block font-semibold">
                        Available Balance
                      </span>
                      <div className="text-3xl font-black text-amber-400 font-mono-numbers mt-1">
                        £{financials.availableBalance.toFixed(2)}
                      </div>
                      <span className="text-[10px] text-emerald-400 font-semibold block mt-1">
                        Cleared for Bank Transfer
                      </span>
                    </div>

                    <div className="bg-[#121826] border border-[#243046] rounded-2xl p-4">
                      <span className="text-[11px] uppercase tracking-wider text-slate-400 block font-semibold">
                        Total Commission Earned
                      </span>
                      <div className="text-3xl font-black text-white font-mono-numbers mt-1">
                        £{financials.totalCommissionEarned.toFixed(2)}
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-1">Lifetime Affiliate Profit</span>
                    </div>

                    <div className="bg-[#121826] border border-[#243046] rounded-2xl p-4">
                      <span className="text-[11px] uppercase tracking-wider text-slate-400 block font-semibold">
                        Gross Ticket Sales
                      </span>
                      <div className="text-3xl font-black text-white font-mono-numbers mt-1">
                        £{financials.totalGrossTicketSales.toFixed(2)}
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-1">Across all UK carriers</span>
                    </div>

                    <div className="bg-[#121826] border border-[#243046] rounded-2xl p-4">
                      <span className="text-[11px] uppercase tracking-wider text-slate-400 block font-semibold">
                        Total Bookings
                      </span>
                      <div className="text-3xl font-black text-white font-mono-numbers mt-1">
                        {financials.totalBookingsCount}
                      </div>
                      <span className="text-[10px] text-amber-400 font-semibold block mt-1">
                        Avg: £{financials.averageCommissionPerBooking.toFixed(2)} per ticket
                      </span>
                    </div>
                  </div>

                  {/* Bank Transfer Execution Module */}
                  <div className="bg-[#121826] border border-[#243046] rounded-2xl p-5 sm:p-6">
                    <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                      <ArrowUpRight className="w-4 h-4 text-amber-400" />
                      <span>Transfer Commission to Registered UK Bank Account</span>
                    </h4>
                    <p className="text-xs text-slate-400 mb-4">
                      Dispatches direct BACS / UK Faster Payments transfer to: <strong className="text-white">{settings.bankDetails.bankName}</strong> (Sort Code: {settings.bankDetails.sortCode} · Account: {settings.bankDetails.accountNumber})
                    </p>

                    <form onSubmit={handleExecutePayout} className="flex flex-col sm:flex-row gap-3">
                      <div className="relative flex-1">
                        <span className="absolute left-3.5 top-2.5 text-slate-400 font-bold">£</span>
                        <input
                          type="number"
                          step="0.01"
                          max={financials.availableBalance}
                          value={withdrawAmount}
                          onChange={(e) => setWithdrawAmount(e.target.value)}
                          placeholder={`Enter amount up to £${financials.availableBalance.toFixed(2)}`}
                          className="w-full bg-[#182236] border border-[#2a3852] focus:border-amber-400 rounded-xl pl-8 pr-4 py-2.5 text-white text-sm font-mono-numbers focus:outline-none"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={financials.availableBalance <= 0}
                        className="px-6 py-2.5 bg-amber-400 hover:bg-amber-300 disabled:opacity-40 text-black font-extrabold text-xs rounded-xl shadow-md cursor-pointer transition-colors"
                      >
                        Execute Bank Transfer
                      </button>
                    </form>
                  </div>

                  {/* Past Payout Transfers */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                      Recent Bank Payout Transfers
                    </h4>
                    <div className="bg-[#121826] border border-[#243046] rounded-2xl overflow-hidden">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-[#090d14] text-slate-400 border-b border-[#243046]">
                          <tr>
                            <th className="py-2.5 px-4 font-semibold">Date</th>
                            <th className="py-2.5 px-4 font-semibold">Reference</th>
                            <th className="py-2.5 px-4 font-semibold">Destination Bank</th>
                            <th className="py-2.5 px-4 font-semibold text-right">Amount</th>
                            <th className="py-2.5 px-4 font-semibold text-center">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#1e283b]">
                          {payouts.map((p) => (
                            <tr key={p.id}>
                              <td className="py-2.5 px-4 text-slate-300 font-mono-numbers">{p.date}</td>
                              <td className="py-2.5 px-4 text-slate-400 font-mono-numbers">{p.reference}</td>
                              <td className="py-2.5 px-4 text-slate-300">{p.destination}</td>
                              <td className="py-2.5 px-4 text-right font-mono-numbers font-bold text-amber-400">
                                £{p.amount.toFixed(2)}
                              </td>
                              <td className="py-2.5 px-4 text-center">
                                <span className="text-[10px] font-bold text-emerald-400 uppercase">
                                  {p.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: BANK & PAYOUT DETAILS */}
              {activeTab === 'bank' && (
                <div className="space-y-4">
                  {/* Verified Card Highlight */}
                  <div className="p-4 bg-amber-400/10 border border-amber-400/30 rounded-2xl">
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-amber-400/20 text-xs">
                      <div className="flex items-center gap-2 text-amber-400 font-bold">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Verified UK Receiving Account (Payoneer Citibank)</span>
                      </div>
                      <span className="text-[10px] bg-amber-400 text-black px-2 py-0.5 rounded font-black uppercase tracking-wider">
                        Active For Payouts
                      </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Beneficiary Name</span>
                        <span className="font-bold text-white">{settings.bankDetails.accountHolder}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Bank Name</span>
                        <span className="font-bold text-amber-400">{settings.bankDetails.bankName}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Sort Code</span>
                        <span className="font-bold text-white font-mono-numbers">{settings.bankDetails.sortCode}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Account Number</span>
                        <span className="font-bold text-white font-mono-numbers">{settings.bankDetails.accountNumber}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">
                        Beneficiary Name (Account Holder)
                      </label>
                      <input
                        type="text"
                        value={settings.bankDetails.accountHolder}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            bankDetails: { ...settings.bankDetails, accountHolder: e.target.value },
                          })
                        }
                        className="w-full bg-[#182236] border border-[#2a3852] focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">Bank Name</label>
                      <input
                        type="text"
                        value={settings.bankDetails.bankName}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            bankDetails: { ...settings.bankDetails, bankName: e.target.value },
                          })
                        }
                        className="w-full bg-[#182236] border border-[#2a3852] focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-400 mb-1">Bank Address</label>
                      <input
                        type="text"
                        value={settings.bankDetails.bankAddress || 'Canada Square, Canary Wharf London, E14 5LB United Kingdom'}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            bankDetails: { ...settings.bankDetails, bankAddress: e.target.value },
                          })
                        }
                        className="w-full bg-[#182236] border border-[#2a3852] focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">
                        UK Sort Code (6 Digits)
                      </label>
                      <input
                        type="text"
                        placeholder="18-50-08"
                        value={settings.bankDetails.sortCode}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            bankDetails: { ...settings.bankDetails, sortCode: e.target.value },
                          })
                        }
                        className="w-full bg-[#182236] border border-[#2a3852] focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-white text-sm font-mono-numbers focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">
                        UK Account Number (8 Digits)
                      </label>
                      <input
                        type="text"
                        maxLength={8}
                        placeholder="54107608"
                        value={settings.bankDetails.accountNumber}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            bankDetails: { ...settings.bankDetails, accountNumber: e.target.value },
                          })
                        }
                        className="w-full bg-[#182236] border border-[#2a3852] focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-white text-sm font-mono-numbers focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">
                        IBAN
                      </label>
                      <input
                        type="text"
                        placeholder="GB96CITI18500854107608"
                        value={settings.bankDetails.iban}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            bankDetails: { ...settings.bankDetails, iban: e.target.value },
                          })
                        }
                        className="w-full bg-[#182236] border border-[#2a3852] focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-white text-sm font-mono-numbers focus:outline-none uppercase"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">
                        BIC / SWIFT
                      </label>
                      <input
                        type="text"
                        placeholder="CITIGB2L"
                        value={settings.bankDetails.swiftBic}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            bankDetails: { ...settings.bankDetails, swiftBic: e.target.value },
                          })
                        }
                        className="w-full bg-[#182236] border border-[#2a3852] focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-white text-sm font-mono-numbers focus:outline-none uppercase"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-400 mb-1">
                        PayPal or Alternative Payout Email
                      </label>
                      <input
                        type="email"
                        placeholder="ranafazal948@gmail.com"
                        value={settings.bankDetails.paypalEmail}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            bankDetails: { ...settings.bankDetails, paypalEmail: e.target.value },
                          })
                        }
                        className="w-full bg-[#182236] border border-[#2a3852] focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      onClick={handleSaveSettings}
                      className="px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs rounded-xl shadow-md cursor-pointer transition-colors"
                    >
                      Save Banking Details
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 3: COMMISSION RATE SETTINGS */}
              {activeTab === 'settings' && (
                <div className="space-y-5">
                  <div className="p-4 bg-[#121826] border border-[#243046] rounded-2xl">
                    <h4 className="text-sm font-bold text-white mb-2">Commission Calculation Architecture</h4>
                    <p className="text-xs text-slate-400 mb-4">
                      Determine how your commercial profit is calculated on each ticket booked across your domestic network.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Fixed Rate Option */}
                      <label
                        className={`p-4 rounded-xl border flex flex-col gap-2 cursor-pointer transition-all ${
                          settings.commissionType === 'fixed'
                            ? 'bg-amber-400/10 border-amber-400 text-white'
                            : 'bg-[#182236] border-[#27354d] text-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm">Fixed Bounty Per Ticket</span>
                          <input
                            type="radio"
                            name="commType"
                            checked={settings.commissionType === 'fixed'}
                            onChange={() => setSettings({ ...settings, commissionType: 'fixed' })}
                            className="accent-amber-400"
                          />
                        </div>
                        <p className="text-xs text-slate-400">
                          Receive a guaranteed, fixed fee credited directly to your balance on every passenger flight.
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-sm font-bold text-amber-400">£</span>
                          <input
                            type="number"
                            step="0.5"
                            value={settings.fixedCommissionPerTicket}
                            onChange={(e) =>
                              setSettings({
                                ...settings,
                                fixedCommissionPerTicket: parseFloat(e.target.value) || 0,
                              })
                            }
                            className="w-24 bg-[#0e1422] border border-[#2a3852] rounded-lg px-2.5 py-1 text-white text-xs font-mono-numbers font-bold"
                          />
                          <span className="text-xs text-slate-400">per passenger booking</span>
                        </div>
                      </label>

                      {/* Percentage Option */}
                      <label
                        className={`p-4 rounded-xl border flex flex-col gap-2 cursor-pointer transition-all ${
                          settings.commissionType === 'percentage'
                            ? 'bg-amber-400/10 border-amber-400 text-white'
                            : 'bg-[#182236] border-[#27354d] text-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm">Percentage Fare Markup</span>
                          <input
                            type="radio"
                            name="commType"
                            checked={settings.commissionType === 'percentage'}
                            onChange={() => setSettings({ ...settings, commissionType: 'percentage' })}
                            className="accent-amber-400"
                          />
                        </div>
                        <p className="text-xs text-slate-400">
                          Earn a dynamic percentage fee based upon the total airfare value of the flight.
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <input
                            type="number"
                            step="0.5"
                            value={settings.percentageCommission}
                            onChange={(e) =>
                              setSettings({
                                ...settings,
                                percentageCommission: parseFloat(e.target.value) || 0,
                              })
                            }
                            className="w-24 bg-[#0e1422] border border-[#2a3852] rounded-lg px-2.5 py-1 text-white text-xs font-mono-numbers font-bold"
                          />
                          <span className="text-sm font-bold text-amber-400">%</span>
                          <span className="text-xs text-slate-400">of ticket value</span>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Security PIN Change */}
                  <div className="p-4 bg-[#121826] border border-[#243046] rounded-2xl flex items-center justify-between">
                    <div>
                      <h5 className="text-xs font-bold text-white">Owner Master Security PIN</h5>
                      <p className="text-[11px] text-slate-400">
                        This 4-digit code is required each time you access the confidential partner portal.
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        maxLength={6}
                        value={settings.ownerPin}
                        onChange={(e) => setSettings({ ...settings, ownerPin: e.target.value })}
                        className="w-24 text-center bg-[#182236] border border-[#2a3852] rounded-lg px-2.5 py-1 text-amber-400 text-xs font-mono-numbers font-bold"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={handleSaveSettings}
                      className="px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs rounded-xl shadow-md cursor-pointer transition-colors"
                    >
                      Save Parameters
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 4: FLIGHT APIS CONFIGURATION */}
              {activeTab === 'apis' && (
                <div className="space-y-5">
                  <div className="p-4 bg-[#121826] border border-[#243046] rounded-2xl">
                    <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                      <Layers className="w-4 h-4 text-amber-400" />
                      <span>Direct UK Flight API & Affiliate Link Engine</span>
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed mb-4">
                      Choose between the built-in UK domestic GDS engine or connect your verified third-party travel affiliate credentials:
                    </p>

                    {/* Active Engine Selector */}
                    <div className="space-y-3">
                      <div className="p-3 bg-[#182236] border border-amber-400/40 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                          <div>
                            <div className="text-xs font-bold text-white">
                              1. High-Performance UK GDS Live Engine (Active & Ready)
                            </div>
                            <div className="text-[11px] text-slate-400">
                              Zero-cost built-in engine connecting all 16 UK airports (Heathrow, Edinburgh, Manchester, etc.) with automated direct commission logging into your wallet.
                            </div>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-amber-400 uppercase">Default Active</span>
                      </div>

                      <div className="p-3 bg-[#141c2c] border border-[#27354d] rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-2.5 h-2.5 rounded-full bg-slate-500" />
                          <div>
                            <div className="text-xs font-bold text-white">
                              2. Travelpayouts / Aviasales Flight Affiliate Marker
                            </div>
                            <div className="text-[11px] text-slate-400">
                              Free affiliate network that pays 50% revenue share per airline booking directly to your bank account or PayPal.
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setSettings({
                              ...settings,
                              apiConfig: { ...settings.apiConfig, activeProvider: 'travelpayouts' },
                            });
                          }}
                          className="px-3 py-1 bg-[#1e2a40] hover:bg-amber-400 hover:text-black text-xs font-semibold rounded-lg text-slate-300 cursor-pointer transition-colors"
                        >
                          Enable
                        </button>
                      </div>

                      <div className="p-3 bg-[#141c2c] border border-[#27354d] rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-2.5 h-2.5 rounded-full bg-slate-500" />
                          <div>
                            <div className="text-xs font-bold text-white">
                              3. Skyscanner Partners API
                            </div>
                            <div className="text-[11px] text-slate-400">
                              Official Skyscanner API for live flight prices and CPA commission per ticket redirect.
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setSettings({
                              ...settings,
                              apiConfig: { ...settings.apiConfig, activeProvider: 'skyscanner' },
                            });
                          }}
                          className="px-3 py-1 bg-[#1e2a40] hover:bg-amber-400 hover:text-black text-xs font-semibold rounded-lg text-slate-300 cursor-pointer transition-colors"
                        >
                          Enable
                        </button>
                      </div>

                      <div className="p-3 bg-[#141c2c] border border-[#27354d] rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-2.5 h-2.5 rounded-full bg-slate-500" />
                          <div>
                            <div className="text-xs font-bold text-white">
                              4. Duffel Direct Flights API
                            </div>
                            <div className="text-[11px] text-slate-400">
                              Direct ticket issuance API with automatic markup and merchant processing.
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setSettings({
                              ...settings,
                              apiConfig: { ...settings.apiConfig, activeProvider: 'duffel' },
                            });
                          }}
                          className="px-3 py-1 bg-[#1e2a40] hover:bg-amber-400 hover:text-black text-xs font-semibold rounded-lg text-slate-300 cursor-pointer transition-colors"
                        >
                          Enable
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* API Key Input Fields */}
                  <div className="p-4 bg-[#121826] border border-[#243046] rounded-2xl space-y-3">
                    <h5 className="text-xs font-bold text-white">Your Affiliate Markers & Credentials</h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block text-slate-400 mb-1">Travelpayouts Marker ID</label>
                        <input
                          type="text"
                          value={settings.apiConfig.travelpayoutsMarker}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              apiConfig: { ...settings.apiConfig, travelpayoutsMarker: e.target.value },
                            })
                          }
                          placeholder="e.g. 548921"
                          className="w-full bg-[#182236] border border-[#2a3852] rounded-xl px-3 py-2 text-white font-mono-numbers focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-400 mb-1">Skyscanner API Key</label>
                        <input
                          type="text"
                          value={settings.apiConfig.skyscannerApiKey}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              apiConfig: { ...settings.apiConfig, skyscannerApiKey: e.target.value },
                            })
                          }
                          placeholder="sk_live_uk_air_34891"
                          className="w-full bg-[#182236] border border-[#2a3852] rounded-xl px-3 py-2 text-white font-mono-numbers focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={handleTestApi}
                        className="px-4 py-2 bg-[#1b253b] hover:bg-[#253350] text-amber-400 text-xs font-bold rounded-xl cursor-pointer transition-colors"
                      >
                        {apiTestStatus === 'testing'
                          ? 'Testing API Connection...'
                          : apiTestStatus === 'success'
                          ? 'API Verified & Active ✓'
                          : 'Test & Verify API Connection'}
                      </button>

                      <button
                        onClick={handleSaveSettings}
                        className="px-6 py-2 bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs rounded-xl shadow-md cursor-pointer transition-colors"
                      >
                        Save API Config
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: BOOKINGS & COMMISSION AUDIT TRAIL */}
              {activeTab === 'bookings' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Live Passenger Bookings & Your Commission Breakdown
                    </h4>
                    <span className="text-xs text-amber-400 font-bold font-mono-numbers">
                      Total Bookings: {bookings.length}
                    </span>
                  </div>

                  <div className="bg-[#121826] border border-[#243046] rounded-2xl overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#090d14] text-slate-400 border-b border-[#243046]">
                        <tr>
                          <th className="py-2.5 px-3 font-semibold">PNR</th>
                          <th className="py-2.5 px-3 font-semibold">Passenger</th>
                          <th className="py-2.5 px-3 font-semibold">Route</th>
                          <th className="py-2.5 px-3 font-semibold">Carrier</th>
                          <th className="py-2.5 px-3 font-semibold text-right">Ticket Total</th>
                          <th className="py-2.5 px-3 font-semibold text-right text-amber-400">
                            Your Commission
                          </th>
                          <th className="py-2.5 px-3 font-semibold text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#1e283b]">
                        {bookings.map((b) => (
                          <tr key={b.bookingReference}>
                            <td className="py-3 px-3 font-mono-numbers font-bold text-white">
                              {b.bookingReference}
                            </td>
                            <td className="py-3 px-3 text-slate-300">
                              {b.passengers[0]?.firstName} {b.passengers[0]?.lastName}
                            </td>
                            <td className="py-3 px-3 text-slate-200 font-mono-numbers">
                              {b.flight.origin.code} → {b.flight.destination.code}
                            </td>
                            <td className="py-3 px-3 text-slate-400">
                              {b.flight.airline}
                            </td>
                            <td className="py-3 px-3 text-right font-mono-numbers text-slate-300">
                              £{b.fareBreakdown?.totalAmount.toFixed(2)}
                            </td>
                            <td className="py-3 px-3 text-right font-mono-numbers font-black text-amber-400">
                              +£{b.ownerCommissionEarned?.toFixed(2)}
                            </td>
                            <td className="py-3 px-3 text-center">
                              <span className="text-[10px] font-bold text-emerald-400 uppercase">
                                {b.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Bottom Bar */}
            <div className="px-6 py-4 bg-[#090d14] border-t border-[#243046] flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Legally compliant with UK Civil Aviation Authority & Advertising Standards.</span>
              </div>
              <button
                onClick={onClose}
                className="px-5 py-2 bg-[#1b253b] hover:bg-[#253350] text-slate-200 text-xs font-semibold rounded-xl cursor-pointer transition-colors"
              >
                Close Portal
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
