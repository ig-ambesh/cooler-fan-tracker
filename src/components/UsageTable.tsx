import type { UsageLog } from '../types';
import { formatDateLabel, formatDurationDetailed } from '../utils/time';

type UsageTableProps = {
  logs: UsageLog[];
  onEdit: (log: UsageLog) => void;
  onDelete: (log: UsageLog) => void;
  onExport: () => void;
};

export function UsageTable({ logs, onEdit, onDelete, onExport }: UsageTableProps) {
  return (
    <section className="glass-panel p-5 md:p-6">
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="card-title">History</p>
          <h3 className="mt-2 text-lg font-semibold text-white">Past entries</h3>
        </div>
        <button className="btn-secondary" type="button" onClick={onExport}>
          Export CSV
        </button>
      </div>

      {logs.length === 0 ? (
        <div className="rounded-[1.75rem] border border-dashed border-white/[0.15] bg-white/[0.06] p-8 text-center text-sm text-white/[0.55]">
          No usage logs yet. Add the first nightly entry to see your family dashboard come alive.
        </div>
      ) : (
        <div className="space-y-3 md:hidden">
          {logs.map((log) => {
            const total = log.fanDuration + log.coolerDuration;
            return (
              <article key={log.id} className="rounded-[1.75rem] border border-white/[0.15] bg-white/[0.08] p-4">
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div>
                    <div className="font-medium text-white">{formatDateLabel(log.date)}</div>
                    <div className="mt-1 text-xs text-white/[0.45]">{log.date}</div>
                  </div>
                  <div className="rounded-full border border-white/[0.15] bg-white/10 px-3 py-1 text-xs font-semibold text-white/70">
                    {formatDurationDetailed(total)}
                  </div>
                </div>

                <div className="grid gap-3">
                  <div className="rounded-[1.25rem] border border-white/10 bg-black/10 p-3">
                    <div className="text-xs uppercase tracking-[0.18em] text-cyan-100/70">Fan</div>
                    <div className="mt-2 text-sm text-white/[0.85]">{log.fanStart || '--'} - {log.fanEnd || '--'}</div>
                    <div className="mt-1 text-xs text-white/50">{formatDurationDetailed(log.fanDuration)}</div>
                  </div>
                  <div className="rounded-[1.25rem] border border-white/10 bg-black/10 p-3">
                    <div className="text-xs uppercase tracking-[0.18em] text-sky-100/70">Cooler</div>
                    <div className="mt-2 text-sm text-white/[0.85]">{log.coolerStart || '--'} - {log.coolerEnd || '--'}</div>
                    <div className="mt-1 text-xs text-white/50">{formatDurationDetailed(log.coolerDuration)}</div>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <button className="btn-secondary flex-1 px-3 py-2.5 text-xs" type="button" onClick={() => onEdit(log)}>
                    Edit
                  </button>
                  <button className="btn-danger flex-1 px-3 py-2.5 text-xs" type="button" onClick={() => onDelete(log)}>
                    Delete
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {logs.length > 0 ? (
        <div className="hidden overflow-hidden rounded-[1.9rem] border border-white/[0.15] md:block">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-white/10 text-left text-sm">
              <thead className="bg-white/[0.08] text-xs uppercase tracking-[0.2em] text-white/[0.45]">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Fan</th>
                  <th className="px-4 py-3">Cooler</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 bg-white/5">
                {logs.map((log) => {
                  const total = log.fanDuration + log.coolerDuration;
                  return (
                    <tr key={log.id} className="hover:bg-white/5">
                      <td className="px-4 py-4">
                        <div className="font-medium text-white">{formatDateLabel(log.date)}</div>
                        <div className="text-xs text-white/40">{log.date}</div>
                      </td>
                      <td className="px-4 py-4 text-white/80">
                        <div>{log.fanStart || '--'} - {log.fanEnd || '--'}</div>
                        <div className="text-xs text-white/40">{formatDurationDetailed(log.fanDuration)}</div>
                      </td>
                      <td className="px-4 py-4 text-white/80">
                        <div>{log.coolerStart || '--'} - {log.coolerEnd || '--'}</div>
                        <div className="text-xs text-white/40">{formatDurationDetailed(log.coolerDuration)}</div>
                      </td>
                      <td className="px-4 py-4 font-medium text-white">{formatDurationDetailed(total)}</td>
                      <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-2">
                          <button className="btn-secondary px-3 py-2 text-xs" type="button" onClick={() => onEdit(log)}>
                            Edit
                          </button>
                          <button className="btn-danger px-3 py-2 text-xs" type="button" onClick={() => onDelete(log)}>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </section>
  );
}
