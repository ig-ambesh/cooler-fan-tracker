import { useEffect, useState } from 'react';
import type { ApplianceRates } from '../types';

const defaultRates: ApplianceRates = {
  fanUnitsPerHour: '',
  coolerUnitsPerHour: '',
};

export function useApplianceRates(userId?: string) {
  const storageKey = userId ? `family-night-rates:${userId}` : 'family-night-rates:guest';
  const [rates, setRates] = useState<ApplianceRates>(defaultRates);

  useEffect(() => {
    const stored = window.localStorage.getItem(storageKey);
    if (!stored) {
      setRates(defaultRates);
      return;
    }

    try {
      const parsed = JSON.parse(stored) as ApplianceRates;
      setRates({
        fanUnitsPerHour: parsed.fanUnitsPerHour ?? '',
        coolerUnitsPerHour: parsed.coolerUnitsPerHour ?? '',
      });
    } catch {
      setRates(defaultRates);
    }
  }, [storageKey]);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(rates));
  }, [rates, storageKey]);

  return {
    rates,
    setRates,
  };
}
