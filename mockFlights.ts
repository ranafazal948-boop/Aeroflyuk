import { Flight, Airport } from '../types/flight';
import { UK_AIRPORTS } from './ukAirports';

const AIRLINE_TEMPLATES = [
  { name: 'British Airways', code: 'BA', color: '#1E3A8A', aircraft: ['Airbus A320neo', 'Airbus A321neo', 'Airbus A319'] },
  { name: 'easyJet', code: 'U2', color: '#EA580C', aircraft: ['Airbus A320neo', 'Airbus A321neo'] },
  { name: 'Loganair', code: 'LM', color: '#B91C1C', aircraft: ['Embraer E145', 'ATR 72-600', 'De Havilland Twin Otter'] },
  { name: 'Eastern Airways', code: 'T3', color: '#047857', aircraft: ['ATR 72-600', 'BAe Jetstream 41'] },
  { name: 'Ryanair UK', code: 'RK', color: '#0369A1', aircraft: ['Boeing 737 MAX 8-200', 'Boeing 737-800'] },
];

export function getAirportByCode(code: string): Airport {
  const airport = UK_AIRPORTS.find((a) => a.code.toUpperCase() === code.toUpperCase());
  if (airport) return airport;
  return UK_AIRPORTS[0];
}

// Generate realistic domestic flights for any UK city-to-city pair
export function searchDomesticFlights(originCode: string, destCode: string, dateStr: string): Flight[] {
  const origin = getAirportByCode(originCode);
  const destination = getAirportByCode(destCode);

  // Approximate duration calculation between UK coordinates/latitudes
  let baseDuration = 75; // default 1h 15m
  if (
    (originCode === 'MAN' && destCode === 'BHD') ||
    (originCode === 'BHD' && destCode === 'MAN') ||
    (originCode === 'GLA' && destCode === 'BFS')
  ) {
    baseDuration = 55;
  } else if (
    (originCode === 'LHR' && destCode === 'EDI') ||
    (originCode === 'EDI' && destCode === 'LHR') ||
    (originCode === 'LGW' && destCode === 'EDI')
  ) {
    baseDuration = 80;
  } else if (
    (originCode === 'LHR' && destCode === 'ABZ') ||
    (originCode === 'ABZ' && destCode === 'LHR') ||
    (originCode === 'BRS' && destCode === 'EDI')
  ) {
    baseDuration = 95;
  } else if (originCode === 'LHR' && destCode === 'MAN') {
    baseDuration = 60;
  }

  // Generate 4 to 6 scheduled flights across morning, afternoon, evening
  const scheduleSlots = [
    { hour: 6, min: 45, priceBase: 42 },
    { hour: 9, min: 15, priceBase: 58 },
    { hour: 12, min: 30, priceBase: 49 },
    { hour: 15, min: 50, priceBase: 54 },
    { hour: 18, min: 20, priceBase: 65 },
    { hour: 20, min: 40, priceBase: 45 },
  ];

  return scheduleSlots.map((slot, index) => {
    const airline = AIRLINE_TEMPLATES[index % AIRLINE_TEMPLATES.length];
    const aircraft = airline.aircraft[index % airline.aircraft.length];

    // Flight number format
    const flightNum = `${airline.code}${1000 + (Math.abs(originCode.charCodeAt(0) * 11 + destCode.charCodeAt(0) * 7 + index * 123) % 8999)}`;

    const depH = String(slot.hour).padStart(2, '0');
    const depM = String(slot.min).padStart(2, '0');
    const depTime = `${depH}:${depM}`;

    // Arrival time calculation
    const totalArrMin = slot.hour * 60 + slot.min + baseDuration;
    const arrH = String(Math.floor(totalArrMin / 60) % 24).padStart(2, '0');
    const arrM = String(totalArrMin % 60).padStart(2, '0');
    const arrTime = `${arrH}:${arrM}`;

    const terminal = origin.terminals[index % origin.terminals.length] || 'Terminal 1';
    const gateLetter = ['A', 'B', 'C', 'D'][index % 4];
    const gateNum = (index * 7 + 12) % 36 + 1;
    const gate = `${gateLetter}${gateNum}`;

    // Dynamic price based on demand
    const dynamicPrice = slot.priceBase + (index % 3) * 6;

    return {
      id: `FLIGHT-${originCode}-${destCode}-${flightNum}-${dateStr}-${index}`,
      flightNumber: flightNum,
      airline: airline.name,
      airlineCode: airline.code,
      airlineLogoColor: airline.color,
      origin,
      destination,
      departureTime: depTime,
      arrivalTime: arrTime,
      durationMinutes: baseDuration,
      aircraft,
      price: dynamicPrice,
      availableSeats: 14 - (index % 8),
      terminal,
      gate,
      baggageAllowance: {
        cabinBagIncluded: true,
        cabinKg: 7,
        checkedKgIncluded: index % 2 === 0 ? 0 : 20,
      },
      carbonEmissionKg: Math.round(baseDuration * 0.95),
      punctualityRate: 94 + (index % 5),
    };
  });
}
