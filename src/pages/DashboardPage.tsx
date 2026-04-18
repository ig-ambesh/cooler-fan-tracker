import { useMemo, useState } from 'react';
import type { User } from 'firebase/auth';
import type { UsageFormState, UsageLog } from '../types';
import { AppHeader } from '../components/AppHeader';
import { RateSettings } from '../components/RateSettings';
import { StatCard } from '../components/StatCard';
import { UsageCharts } from '../components/UsageCharts';
import { UsageForm } from '../components/UsageForm';
import { UsageTable } from '../components/UsageTable';
import type { ApplianceRates } from '../types';
import { formatRupees, formatUnits, calculateSummaryCost } from '../utils/cost';
import { hoursFromMinutes, toDateInputValue } from '../utils/time';
import { summarizeMonth, summarizeToday, summarizeWeek } from '../utils/summary';
import { usageLogsToCsv } from '../utils/csv';

type DashboardPageProps = {
  user: User;
  isDark: boolean;
  onToggleTheme: () => void;
  onSignOut: () => Promise<void>;
  logs: UsageLog[];
  loading: boolean;
  error?: string | null;
  onSaveLog: (value: UsageFormState) => Promise<void>;
  onDeleteLog: (date: string) => Promise<void>;
  rates: ApplianceRates;
  onRatesChange: (value: ApplianceRates) => void;
};

const defaultForm = (): UsageFormState => ({
  date: toDateInputValue(),
  fanStart: '',
  fanEnd: '',
  coolerStart: '',
  coolerEnd: '',
});

function downloadCsv(filename: string, csv: string) {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function DashboardPage({
  user,
  isDark,
  onToggleTheme,
  onSignOut,
  logs,
  loading,
  error,
  onSaveLog,
  onDeleteLog,
  rates,
  onRatesChange,
}: DashboardPageProps) {
  const [form, setForm] = useState<UsageFormState>(defaultForm);
  const [saving, setSaving] = useState(false);
  const [editingDate, setEditingDate] = useState<string | null>(null);
  const today = toDateInputValue();

  const todaySummary = useMemo(() => summarizeToday(logs, today), [logs, today]);
  const weekSummary = useMemo(() => summarizeWeek(logs), [logs]);
  const monthSummary = useMemo(() => summarizeMonth(logs), [logs]);
  const todayCost = useMemo(() => calculateSummaryCost(todaySummary, rates), [rates, todaySummary]);
  const weekCost = useMemo(() => calculateSummaryCost(weekSummary, rates), [rates, weekSummary]);
  const monthCost = useMemo(() => calculateSummaryCost(monthSummary, rates), [rates, monthSummary]);

  const weeklyBuckets = useMemo(() => {
    const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const current = new Date();
    const start = new Date(current);
    const day = current.getDay();
    const diff = current.getDate() - day + (day === 0 ? -6 : 1);
    start.setDate(diff);
    start.setHours(0, 0, 0, 0);

    return labels.map((label, index) => {
      const bucketDate = new Date(start);
      bucketDate.setDate(start.getDate() + index);
      const dateKey = `${bucketDate.getFullYear()}-${String(bucketDate.getMonth() + 1).padStart(2, '0')}-${String(
        bucketDate.getDate()
      ).padStart(2, '0')}`;
      const log = logs.find((item) => item.date === dateKey);
      return {
        label,
        combinedMinutes: log ? log.fanDuration + log.coolerDuration : 0,
      };
    });
  }, [logs]);

  const monthlyFanMinutes = monthSummary.totalFanMinutes;
  const monthlyCoolerMinutes = monthSummary.totalCoolerMinutes;

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSaveLog(form);
      setEditingDate(null);
      setForm(defaultForm());
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (log: UsageLog) => {
    setEditingDate(log.date);
    setForm({
      date: log.date,
      fanStart: log.fanStart,
      fanEnd: log.fanEnd,
      coolerStart: log.coolerStart,
      coolerEnd: log.coolerEnd,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (log: UsageLog) => {
    const confirmed = window.confirm(`Delete the log for ${log.date}?`);
    if (!confirmed) {
      return;
    }

    await onDeleteLog(log.date);
    if (editingDate === log.date) {
      setEditingDate(null);
      setForm(defaultForm());
    }
  };

  const handleExport = () => {
    const csv = usageLogsToCsv(logs);
    downloadCsv(`usage-logs-${today}.csv`, csv);
  };

  return (
    <main className="ios-shell">
      <AppHeader user={user} isDark={isDark} onToggleTheme={onToggleTheme} onSignOut={onSignOut} />

      {error ? (
        <div className="glass-panel border-rose-300/[0.35] bg-rose-300/10 px-4 py-3 text-sm text-rose-100">{error}</div>
      ) : null}

      <div className="section-stack">
        <section className="grid gap-4 md:grid-cols-3">
          <StatCard
            title="Today"
            value={`${hoursFromMinutes(todaySummary.totalCombinedMinutes).toFixed(1)} hrs`}
            detail={`Fan ${hoursFromMinutes(todaySummary.totalFanMinutes).toFixed(1)}h + Cooler ${hoursFromMinutes(todaySummary.totalCoolerMinutes).toFixed(1)}h`}
            accent="cyan"
          />
          <StatCard
            title="Weekly total"
            value={`${hoursFromMinutes(weekSummary.totalCombinedMinutes).toFixed(1)} hrs`}
            detail={`${weekSummary.logCount} log${weekSummary.logCount === 1 ? '' : 's'} this week`}
            accent="fuchsia"
          />
          <StatCard
            title="Monthly total"
            value={`${hoursFromMinutes(monthSummary.totalCombinedMinutes).toFixed(1)} hrs`}
            detail={`Fan ${hoursFromMinutes(monthlyFanMinutes).toFixed(1)}h, Cooler ${hoursFromMinutes(monthlyCoolerMinutes).toFixed(1)}h`}
            accent="emerald"
          />
        </section>

        <RateSettings value={rates} onChange={onRatesChange} />

        <section className="grid gap-4 md:grid-cols-3">
          <StatCard
            title="Today's electricity cost"
            value={formatRupees(todayCost.totalRupees)}
            detail={`${formatUnits(todayCost.totalUnits)} estimated from fan ${formatUnits(todayCost.fanUnits)} and cooler ${formatUnits(todayCost.coolerUnits)}`}
            accent="amber"
          />
          <StatCard
            title="Weekly electricity cost"
            value={formatRupees(weekCost.totalRupees)}
            detail={`${formatUnits(weekCost.totalUnits)} across ${weekSummary.logCount} log${weekSummary.logCount === 1 ? '' : 's'}`}
            accent="cyan"
          />
          <StatCard
            title="Monthly electricity cost"
            value={formatRupees(monthCost.totalRupees)}
            detail={`${formatUnits(monthCost.totalUnits)} for this month`}
            accent="fuchsia"
          />
        </section>

        <UsageForm
          value={form}
          onChange={setForm}
          onSubmit={handleSave}
          isEditing={Boolean(editingDate)}
          saving={saving}
        />

        <UsageCharts
          weeklyBuckets={weeklyBuckets}
          fanMonthlyMinutes={monthlyFanMinutes}
          coolerMonthlyMinutes={monthlyCoolerMinutes}
        />

        {loading ? (
          <div className="glass-panel p-6 text-sm text-white/[0.72]">Loading your logs...</div>
        ) : null}

        <UsageTable logs={logs} onEdit={handleEdit} onDelete={handleDelete} onExport={handleExport} />
      </div>
    </main>
  );
}
