import type { UsageLog } from '../types';
import { getStartOfMonth, getStartOfWeek, isWithinRange } from './time';

export type LogSummary = {
  totalFanMinutes: number;
  totalCoolerMinutes: number;
  totalCombinedMinutes: number;
  logCount: number;
};

function emptySummary(): LogSummary {
  return {
    totalFanMinutes: 0,
    totalCoolerMinutes: 0,
    totalCombinedMinutes: 0,
    logCount: 0,
  };
}

export function summarizeLogs(logs: UsageLog[]): LogSummary {
  return logs.reduce<LogSummary>((acc, log) => {
    acc.totalFanMinutes += log.fanDuration || 0;
    acc.totalCoolerMinutes += log.coolerDuration || 0;
    acc.totalCombinedMinutes += (log.fanDuration || 0) + (log.coolerDuration || 0);
    acc.logCount += 1;
    return acc;
  }, emptySummary());
}

export function summarizeToday(logs: UsageLog[], today: string): LogSummary {
  return summarizeLogs(logs.filter((log) => log.date === today));
}

export function summarizeWeek(logs: UsageLog[], today = new Date()): LogSummary {
  const start = getStartOfWeek(today);
  const end = new Date(today);
  end.setHours(23, 59, 59, 999);
  return summarizeLogs(logs.filter((log) => isWithinRange(log.date, start, end)));
}

export function summarizeMonth(logs: UsageLog[], today = new Date()): LogSummary {
  const start = getStartOfMonth(today);
  const end = new Date(today);
  end.setHours(23, 59, 59, 999);
  return summarizeLogs(logs.filter((log) => isWithinRange(log.date, start, end)));
}

export function groupByDate(logs: UsageLog[]): Record<string, UsageLog> {
  return Object.fromEntries(logs.map((log) => [log.date, log]));
}
