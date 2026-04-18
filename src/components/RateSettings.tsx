import type { ApplianceRates } from '../types';
import { RUPEES_PER_UNIT } from '../utils/cost';

type RateSettingsProps = {
  value: ApplianceRates;
  onChange: (value: ApplianceRates) => void;
};

function updateField(value: ApplianceRates, key: keyof ApplianceRates, nextValue: string): ApplianceRates {
  return { ...value, [key]: nextValue };
}

export function RateSettings({ value, onChange }: RateSettingsProps) {
  return (
    <section className="glass-panel p-5 md:p-6">
      <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="card-title">Electricity cost</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white">Set appliance unit usage</h2>
          <p className="mt-2 text-sm text-white/[0.72]">
            Enter how many electricity units each appliance consumes in one hour. The dashboard multiplies total units
            by Rs {RUPEES_PER_UNIT} per unit.
          </p>
        </div>
        <span className="chip">1 unit = Rs {RUPEES_PER_UNIT}</span>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-[1.75rem] border border-white/[0.15] bg-white/[0.08] p-4">
          <label className="label" htmlFor="fanUnitsPerHour">
            Fan units per hour
          </label>
          <input
            id="fanUnitsPerHour"
            className="input"
            type="number"
            min="0"
            step="0.01"
            value={value.fanUnitsPerHour}
            onChange={(event) => onChange(updateField(value, 'fanUnitsPerHour', event.target.value))}
            placeholder="Example: 0.08"
          />
        </div>

        <div className="rounded-[1.75rem] border border-white/[0.15] bg-white/[0.08] p-4">
          <label className="label" htmlFor="coolerUnitsPerHour">
            Cooler units per hour
          </label>
          <input
            id="coolerUnitsPerHour"
            className="input"
            type="number"
            min="0"
            step="0.01"
            value={value.coolerUnitsPerHour}
            onChange={(event) => onChange(updateField(value, 'coolerUnitsPerHour', event.target.value))}
            placeholder="Example: 0.20"
          />
        </div>
      </div>
    </section>
  );
}
