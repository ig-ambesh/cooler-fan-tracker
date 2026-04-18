import type { ApplianceRates } from '../types';
import type { LogSummary } from './summary';

export const RUPEES_PER_UNIT = 7;

function parseRate(value: string): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
}

export function calculateUnits(minutes: number, unitsPerHour: string): number {
  return (minutes / 60) * parseRate(unitsPerHour);
}

export function calculateSummaryCost(summary: LogSummary, rates: ApplianceRates) {
  const fanUnits = calculateUnits(summary.totalFanMinutes, rates.fanUnitsPerHour);
  const coolerUnits = calculateUnits(summary.totalCoolerMinutes, rates.coolerUnitsPerHour);
  const totalUnits = fanUnits + coolerUnits;
  const totalRupees = totalUnits * RUPEES_PER_UNIT;

  return {
    fanUnits,
    coolerUnits,
    totalUnits,
    totalRupees,
  };
}

export function formatUnits(units: number): string {
  return `${units.toFixed(2)} units`;
}

export function formatRupees(amount: number): string {
  return `Rs ${amount.toFixed(2)}`;
}
