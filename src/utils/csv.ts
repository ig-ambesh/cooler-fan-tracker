import type { UsageLog } from '../types';
import { formatDurationDetailed } from './time';

function escapeCsv(value: string): string {
  return `"${value.replaceAll('"', '""')}"`;
}

export function usageLogsToCsv(logs: UsageLog[]): string {
  const header = [
    'date',
    'fanStart',
    'fanEnd',
    'fanDurationMinutes',
    'fanDurationPretty',
    'coolerStart',
    'coolerEnd',
    'coolerDurationMinutes',
    'coolerDurationPretty',
    'createdAt',
  ];

  const rows = logs.map((log) => [
    log.date,
    log.fanStart,
    log.fanEnd,
    String(log.fanDuration),
    formatDurationDetailed(log.fanDuration),
    log.coolerStart,
    log.coolerEnd,
    String(log.coolerDuration),
    formatDurationDetailed(log.coolerDuration),
    log.createdAt ? log.createdAt.toDate().toISOString() : '',
  ]);

  return [header, ...rows]
    .map((row) => row.map((value) => escapeCsv(value)).join(','))
    .join('\n');
}
