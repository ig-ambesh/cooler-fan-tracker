import { type FormEvent } from 'react';
import type { UsageFormState } from '../types';

type UsageFormProps = {
  value: UsageFormState;
  onChange: (value: UsageFormState) => void;
  onSubmit: () => Promise<void>;
  isEditing: boolean;
  saving: boolean;
};

function updateField(
  value: UsageFormState,
  key: keyof UsageFormState,
  nextValue: string
): UsageFormState {
  return { ...value, [key]: nextValue };
}

export function UsageForm({ value, onChange, onSubmit, isEditing, saving }: UsageFormProps) {
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSubmit();
  };

  return (
    <section className="glass-panel p-5 md:p-6">
      <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="card-title">Daily entry</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white">{isEditing ? 'Edit log' : 'Add night log'}</h2>
          <p className="mt-2 text-sm text-white/[0.72]">
            Use 24-hour time. If the stop time is earlier than the start time, the app assumes the session crossed
            midnight.
          </p>
        </div>
        <span className="chip">One log per date</span>
      </div>

      <form className="grid gap-4 md:grid-cols-2" onSubmit={submit}>
        <div className="rounded-[1.6rem] border border-white/[0.15] bg-white/[0.08] p-4">
          <label className="label" htmlFor="date">
            Date
          </label>
          <input
            id="date"
            className="input"
            type="date"
            value={value.date}
            onChange={(event) => onChange(updateField(value, 'date', event.target.value))}
            required
          />
        </div>

        <div className="hidden md:block" />

        <div className="rounded-[1.75rem] border border-cyan-200/20 bg-white/[0.08] p-4">
          <p className="mb-4 text-sm font-semibold text-cyan-100">Fan</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="fanStart">
                Start
              </label>
              <input
                id="fanStart"
                className="input"
                type="time"
                step={60}
                value={value.fanStart}
                onChange={(event) => onChange(updateField(value, 'fanStart', event.target.value))}
              />
            </div>
            <div>
              <label className="label" htmlFor="fanEnd">
                Stop
              </label>
              <input
                id="fanEnd"
                className="input"
                type="time"
                step={60}
                value={value.fanEnd}
                onChange={(event) => onChange(updateField(value, 'fanEnd', event.target.value))}
              />
            </div>
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-sky-100/20 bg-white/[0.08] p-4">
          <p className="mb-4 text-sm font-semibold text-sky-100">Cooler</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="coolerStart">
                Start
              </label>
              <input
                id="coolerStart"
                className="input"
                type="time"
                step={60}
                value={value.coolerStart}
                onChange={(event) => onChange(updateField(value, 'coolerStart', event.target.value))}
              />
            </div>
            <div>
              <label className="label" htmlFor="coolerEnd">
                Stop
              </label>
              <input
                id="coolerEnd"
                className="input"
                type="time"
                step={60}
                value={value.coolerEnd}
                onChange={(event) => onChange(updateField(value, 'coolerEnd', event.target.value))}
              />
            </div>
          </div>
        </div>

        <div className="md:col-span-2 flex flex-wrap gap-3 pt-1">
          <button className="btn-primary" type="submit" disabled={saving}>
            {saving ? 'Saving...' : isEditing ? 'Update log' : 'Save log'}
          </button>
          <button
            className="btn-secondary"
            type="button"
            onClick={() =>
              onChange({
                date: value.date,
                fanStart: '',
                fanEnd: '',
                coolerStart: '',
                coolerEnd: '',
              })
            }
          >
            Clear times
          </button>
        </div>
      </form>
    </section>
  );
}
