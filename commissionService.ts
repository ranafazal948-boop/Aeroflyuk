import { Booking, OwnerSettings, PayoutTransaction, BaggageItem } from '../types/flight';

const SETTINGS_KEY = 'aerofly_uk_owner_settings';
const BOOKINGS_KEY = 'aerofly_uk_bookings';
const PAYOUTS_KEY = 'aerofly_uk_payouts';

export const DEFAULT_OWNER_SETTINGS: OwnerSettings = {
  commissionType: 'fixed',
  fixedCommissionPerTicket: 14.50, // £14.50 per ticket commission
  percentageCommission: 5.0, // 5% markup
  bankDetails: {
    accountHolder: 'Fazal Elahi',
    sortCode: '18-50-08',
    accountNumber: '54107608',
    bankName: 'Citibank',
    bankAddress: 'Canada Square, Canary Wharf London, E14 5LB United Kingdom',
    iban: 'GB96CITI18500854107608',
    swiftBic: 'CITIGB2L',
    paypalEmail: 'ranafazal948@gmail.com',
  },
  ownerPin: '7860',
  ownerEmail: 'ranafazal948@gmail.com',
  apiConfig: {
    activeProvider: 'simulated_live',
    travelpayoutsMarker: '548921',
    travelpayoutsApiKey: 'tp_uk_live_9812401823',
    skyscannerApiKey: 'sk_live_uk_air_34891',
    duffelApiToken: 'duffel_live_091248102',
    amadeusClientId: 'amad_client_89123',
    amadeusClientSecret: 'amad_sec_991823',
  },
};

// Initial realistic bookings with baggage tracking
const INITIAL_BOOKINGS: Booking[] = [
  {
    bookingReference: 'UK-89214',
    flight: {
      id: 'F-LHR-EDI-BA1432',
      flightNumber: 'BA1432',
      airline: 'British Airways',
      airlineCode: 'BA',
      airlineLogoColor: '#1E3A8A',
      origin: {
        code: 'LHR',
        name: 'London Heathrow Airport',
        city: 'London',
        region: 'England',
        busiestDomesticRank: 1,
        terminals: ['Terminal 5'],
        runwayHeading: '09L/27R',
      },
      destination: {
        code: 'EDI',
        name: 'Edinburgh Airport',
        city: 'Edinburgh',
        region: 'Scotland',
        busiestDomesticRank: 2,
        terminals: ['Main Terminal'],
        runwayHeading: '06/24',
      },
      departureTime: '09:15',
      arrivalTime: '10:35',
      durationMinutes: 80,
      aircraft: 'Airbus A320neo',
      price: 58,
      availableSeats: 9,
      terminal: 'Terminal 5',
      gate: 'A14',
      baggageAllowance: { cabinBagIncluded: true, cabinKg: 7, checkedKgIncluded: 20 },
      carbonEmissionKg: 76,
      punctualityRate: 97,
    },
    departureDate: '2026-10-24',
    passengers: [
      {
        title: 'Mr',
        firstName: 'Oliver',
        lastName: 'Harrison',
        email: 'oliver.h@ukmail.co.uk',
        phone: '+44 7911 123456',
        passportOrId: 'GB9823145',
        checkedBagsCount: 1,
        seatNumber: '04A',
      },
    ],
    cabinClass: 'Economy',
    baggageItems: [
      {
        id: 'BAG-01',
        type: 'standard_hold',
        label: 'Standard Hold Bag (20kg)',
        weightLimitKg: 20,
        price: 24.00,
        tagNumber: 'BA-01258921-A',
        trackingStatus: 'Tag Printed',
      },
    ],
    fareBreakdown: {
      baseFare: 58,
      ukAirPassengerDuty: 7.00,
      airportSecurityFee: 4.50,
      baggageFee: 24.00,
      totalAmount: 93.50,
    },
    ownerCommissionEarned: 14.50,
    bookingTimestamp: '2026-10-20 14:22',
    status: 'Confirmed',
    paymentMethod: 'Mastercard •••• 4412',
    affiliateSource: 'AeroFly Direct Engine',
  },
  {
    bookingReference: 'UK-76190',
    flight: {
      id: 'F-MAN-BHD-U2815',
      flightNumber: 'U2815',
      airline: 'easyJet',
      airlineCode: 'U2',
      airlineLogoColor: '#EA580C',
      origin: {
        code: 'MAN',
        name: 'Manchester Airport',
        city: 'Manchester',
        region: 'England',
        busiestDomesticRank: 3,
        terminals: ['Terminal 1'],
        runwayHeading: '05L/23R',
      },
      destination: {
        code: 'BHD',
        name: 'George Best Belfast City Airport',
        city: 'Belfast',
        region: 'Northern Ireland',
        busiestDomesticRank: 5,
        terminals: ['Main Terminal'],
        runwayHeading: '04/22',
      },
      departureTime: '12:30',
      arrivalTime: '13:25',
      durationMinutes: 55,
      aircraft: 'Airbus A320neo',
      price: 49,
      availableSeats: 6,
      terminal: 'Terminal 1',
      gate: 'B08',
      baggageAllowance: { cabinBagIncluded: true, cabinKg: 7, checkedKgIncluded: 0 },
      carbonEmissionKg: 52,
      punctualityRate: 95,
    },
    departureDate: '2026-10-25',
    passengers: [
      {
        title: 'Ms',
        firstName: 'Fiona',
        lastName: 'Campbell',
        email: 'fiona.c@glasgow.org.uk',
        phone: '+44 7822 654321',
        passportOrId: 'GB1123489',
        checkedBagsCount: 0,
        seatNumber: '11F',
      },
    ],
    cabinClass: 'Economy',
    baggageItems: [],
    fareBreakdown: {
      baseFare: 49,
      ukAirPassengerDuty: 7.00,
      airportSecurityFee: 4.50,
      baggageFee: 0,
      totalAmount: 60.50,
    },
    ownerCommissionEarned: 14.50,
    bookingTimestamp: '2026-10-20 18:45',
    status: 'Confirmed',
    paymentMethod: 'Apple Pay',
    affiliateSource: 'Travelpayouts UK Partner API',
  },
];

const INITIAL_PAYOUTS: PayoutTransaction[] = [
  {
    id: 'PO-8910',
    date: '2026-10-15',
    amount: 145.00,
    destination: 'Citibank (Sort: 18-50-08 ••••7608)',
    status: 'Completed',
    reference: 'BACS-CITI-COMM-991',
  },
];

export function getOwnerSettings(): OwnerSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Migrate older default if accountHolder or bank is old
      if (!parsed.bankDetails || parsed.bankDetails.accountHolder === 'Rana Fazal Travel Holdings' || parsed.bankDetails.bankName === 'Barclays Bank UK PLC') {
        const merged = {
          ...DEFAULT_OWNER_SETTINGS,
          ...parsed,
          bankDetails: DEFAULT_OWNER_SETTINGS.bankDetails,
        };
        saveOwnerSettings(merged);
        return merged;
      }
      return { ...DEFAULT_OWNER_SETTINGS, ...parsed };
    }
  } catch (e) {
    console.warn('Could not read owner settings', e);
  }
  return DEFAULT_OWNER_SETTINGS;
}

export function saveOwnerSettings(settings: OwnerSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Could not save owner settings', e);
  }
}

export function getAllBookings(): Booking[] {
  try {
    const raw = localStorage.getItem(BOOKINGS_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Could not read bookings', e);
  }
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(INITIAL_BOOKINGS));
  return INITIAL_BOOKINGS;
}

export function addBooking(booking: Booking): void {
  const current = getAllBookings();
  const updated = [booking, ...current];
  try {
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Could not save booking', e);
  }
}

export function updateBooking(updatedBooking: Booking): void {
  const current = getAllBookings();
  const index = current.findIndex((b) => b.bookingReference === updatedBooking.bookingReference);
  if (index !== -1) {
    current[index] = updatedBooking;
  } else {
    current.unshift(updatedBooking);
  }
  try {
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(current));
  } catch (e) {
    console.error('Could not update booking', e);
  }
}

export function getAllPayouts(): PayoutTransaction[] {
  try {
    const raw = localStorage.getItem(PAYOUTS_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Could not read payouts', e);
  }
  localStorage.setItem(PAYOUTS_KEY, JSON.stringify(INITIAL_PAYOUTS));
  return INITIAL_PAYOUTS;
}

export function requestPayout(amount: number): PayoutTransaction | null {
  const settings = getOwnerSettings();
  const newPayout: PayoutTransaction = {
    id: `PO-${Date.now().toString().slice(-4)}`,
    date: new Date().toISOString().split('T')[0],
    amount,
    destination: `${settings.bankDetails.bankName || 'UK Bank'} (${settings.bankDetails.sortCode} ••••${settings.bankDetails.accountNumber.slice(-4)})`,
    status: 'Completed',
    reference: `BACS-COMM-${Math.floor(1000 + Math.random() * 9000)}`,
  };

  const current = getAllPayouts();
  const updated = [newPayout, ...current];
  try {
    localStorage.setItem(PAYOUTS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Could not save payout', e);
  }
  return newPayout;
}

export function calculateCommissionForTicket(baseFare: number): number {
  const settings = getOwnerSettings();
  if (settings.commissionType === 'percentage') {
    return parseFloat(((baseFare * settings.percentageCommission) / 100).toFixed(2));
  }
  return settings.fixedCommissionPerTicket;
}

export function getFinancialSummary() {
  const bookings = getAllBookings();
  const payouts = getAllPayouts();

  const totalCommissionEarned = bookings.reduce((sum, b) => sum + (b.ownerCommissionEarned || 0), 0);
  const totalPaidOut = payouts.reduce((sum, p) => sum + p.amount, 0);
  const availableBalance = Math.max(0, totalCommissionEarned - totalPaidOut);
  const totalGrossTicketSales = bookings.reduce((sum, b) => sum + (b.fareBreakdown?.totalAmount || 0), 0);

  return {
    totalCommissionEarned: parseFloat(totalCommissionEarned.toFixed(2)),
    totalPaidOut: parseFloat(totalPaidOut.toFixed(2)),
    availableBalance: parseFloat(availableBalance.toFixed(2)),
    totalGrossTicketSales: parseFloat(totalGrossTicketSales.toFixed(2)),
    totalBookingsCount: bookings.length,
    averageCommissionPerBooking: bookings.length > 0 ? parseFloat((totalCommissionEarned / bookings.length).toFixed(2)) : 0,
  };
}
