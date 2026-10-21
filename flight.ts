export interface Airport {
  code: string; // IATA (e.g. LHR, EDI, MAN)
  name: string;
  city: string;
  region: 'England' | 'Scotland' | 'Northern Ireland' | 'Wales' | 'Crown Dependencies';
  busiestDomesticRank: number;
  terminals: string[];
  runwayHeading: string;
}

export type CabinClass = 'Economy' | 'Premium Economy' | 'Executive Class';

export interface BaggageItem {
  id: string;
  type: 'cabin_standard' | 'standard_hold' | 'heavy_hold' | 'sports_special';
  label: string;
  weightLimitKg: number;
  price: number;
  tagNumber: string;
  trackingStatus: 'Manifest Registered' | 'Tag Printed' | 'Hold Loaded' | 'Baggage Reclaim Belt 2';
}

export interface Flight {
  id: string;
  flightNumber: string;
  airline: string;
  airlineCode: string;
  airlineLogoColor: string;
  origin: Airport;
  destination: Airport;
  departureTime: string;
  arrivalTime: string;
  durationMinutes: number;
  aircraft: string;
  price: number; // Base fare in GBP (£)
  availableSeats: number;
  terminal: string;
  gate: string;
  baggageAllowance: {
    cabinBagIncluded: boolean;
    cabinKg: number;
    checkedKgIncluded: number;
  };
  carbonEmissionKg: number;
  punctualityRate: number;
}

export interface Passenger {
  title: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  passportOrId: string;
  checkedBagsCount: number;
  seatNumber: string;
  mealPreference?: string;
  specialAssistance?: boolean;
}

export interface Booking {
  bookingReference: string; // PNR e.g. UK-98421
  flight: Flight;
  departureDate: string;
  passengers: Passenger[];
  cabinClass: CabinClass;
  baggageItems: BaggageItem[];
  fareBreakdown: {
    baseFare: number;
    ukAirPassengerDuty: number; // UK APD
    airportSecurityFee: number;
    baggageFee: number;
    totalAmount: number;
  };
  ownerCommissionEarned: number;
  bookingTimestamp: string;
  status: 'Confirmed' | 'Ticket Issued' | 'Checked In';
  paymentMethod: string;
  affiliateSource: string;
}

export interface OwnerSettings {
  commissionType: 'fixed' | 'percentage';
  fixedCommissionPerTicket: number;
  percentageCommission: number;
  bankDetails: {
    accountHolder: string;
    sortCode: string; // e.g. 20-45-78
    accountNumber: string; // 8 digits
    bankName: string;
    bankAddress?: string;
    iban: string;
    swiftBic: string;
    paypalEmail: string;
  };
  ownerPin: string; // Secret PIN e.g. '7860'
  ownerEmail: string;
  apiConfig: {
    activeProvider: 'simulated_live' | 'travelpayouts' | 'skyscanner' | 'duffel' | 'amadeus';
    travelpayoutsMarker: string;
    travelpayoutsApiKey: string;
    skyscannerApiKey: string;
    duffelApiToken: string;
    amadeusClientId: string;
    amadeusClientSecret: string;
  };
}

export interface PayoutTransaction {
  id: string;
  date: string;
  amount: number;
  destination: string;
  status: 'Completed' | 'Processing';
  reference: string;
}
