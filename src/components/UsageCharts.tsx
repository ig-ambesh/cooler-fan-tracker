import { hoursFromMinutes } from '../utils/time';

type DayBucket = {
  label: string;
  combinedMinutes: number;
};

type UsageChartsProps = {
  weeklyBuckets: DayBucket[];
  fanMonthlyMinutes: number;
  coolerMonthlyMinutes: number;
};

function barWidth(minutes: number, maxMinutes: number): string {
  if (maxMinutes === 0) {
    return '0%';
  }

  return `${Math.max(8, (minutes / maxMinutes) * 100)}%`;
}

export function UsageCharts({ weeklyBuckets, fanMonthlyMinutes, coolerMonthlyMinutes }: UsageChartsProps) {
  const maxWeekly = Math.max(...weeklyBuckets.map((item) => item.combinedMinutes), 0);
  const totalMonthly = fanMonthlyMinutes + coolerMonthlyMinutes;

  return (
    <section className="grid gap-5 xl:grid-cols-2">
      <article className="glass-panel p-5 md:p-6">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="card-title">Weekly chart</p>
            <h3 className="mt-2 text-lg font-semibold text-white">Combined usage by day</h3>
          </div>
          <span className="chip">{hoursFromMinutes(maxWeekly).toFixed(1)}h peak</span>
        </div>

        <div className="space-y-3">
          {weeklyBuckets.map((bucket) => (
            <div key={bucket.label} className="grid grid-cols-[2.5rem_1fr_auto] items-center gap-3">
              <span className="text-xs font-medium uppercase tracking-[0.2em] text-white/50">{bucket.label}</span>
              <div className="h-3 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-200 via-sky-200 to-indigo-200"
                  style={{ width: barWidth(bucket.combinedMinutes, maxWeekly) }}
                />
              </div>
              <span className="text-sm text-white/75">{hoursFromMinutes(bucket.combinedMinutes).toFixed(1)}h</span>
            </div>
          ))}
        </div>
      </article>

      <article className="glass-panel p-5 md:p-6">
        <div className="mb-5">
          <p className="card-title">Monthly split</p>
          <h3 className="mt-2 text-lg font-semibold text-white">Fan vs cooler</h3>
        </div>

        <div className="space-y-5">
          <div>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-cyan-100">Fan</span>
              <span className="text-white/[0.72]">{hoursFromMinutes(fanMonthlyMinutes).toFixed(1)}h</span>
            </div>
            <div className="h-4 rounded-full bg-white/10">
              <div
                className="h-4 rounded-full bg-gradient-to-r from-cyan-100 to-cyan-300"
                style={{ width: barWidth(fanMonthlyMinutes, Math.max(totalMonthly, 1)) }}
              />
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-sky-100">Cooler</span>
              <span className="text-white/[0.72]">{hoursFromMinutes(coolerMonthlyMinutes).toFixed(1)}h</span>
            </div>
            <div className="h-4 rounded-full bg-white/10">
              <div
                className="h-4 rounded-full bg-gradient-to-r from-sky-100 to-indigo-200"
                style={{ width: barWidth(coolerMonthlyMinutes, Math.max(totalMonthly, 1)) }}
              />
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-white/[0.15] bg-white/[0.08] p-4 text-sm text-white/[0.72]">
            <span className="font-semibold text-white">Total monthly usage:</span>{' '}
            {hoursFromMinutes(totalMonthly).toFixed(1)}h
          </div>
        </div>
      </article>
    </section>
  );
}
