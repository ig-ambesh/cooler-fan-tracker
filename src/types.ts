import type { Timestamp } from 'firebase/firestore';

export type UsageLog = {
  id: string;
  date: string;
  fanStart: string;
  fanEnd: string;
  fanDuration: number;
  coolerStart: string;
  coolerEnd: string;
  coolerDuration: number;
  createdAt?: Timestamp;
};

export type UsageFormState = {
  date: string;
  fanStart: string;
  fanEnd: string;
  coolerStart: string;
  coolerEnd: string;
};

export type AuthMode = 'login' | 'signup';

export type ApplianceRates = {
  fanUnitsPerHour: string;
  coolerUnitsPerHour: string;
};
