type StatCardProps = {
  title: string;
  value: string;
  detail?: string;
  accent?: 'cyan' | 'fuchsia' | 'emerald' | 'amber';
};

const accents = {
  cyan: 'from-cyan-400/20 to-cyan-400/5 text-cyan-200',
  fuchsia: 'from-fuchsia-400/20 to-fuchsia-400/5 text-fuchsia-200',
  emerald: 'from-emerald-400/20 to-emerald-400/5 text-emerald-200',
  amber: 'from-amber-400/20 to-amber-400/5 text-amber-200',
};

export function StatCard({ title, value, detail, accent = 'cyan' }: StatCardProps) {
  return (
    <article className={`glass-panel bg-gradient-to-br p-5 ${accents[accent]}`}>
      <p className="card-title">{title}</p>
      <div className="mt-5 text-3xl font-semibold tracking-tight text-white md:text-4xl">{value}</div>
      {detail ? <p className="mt-3 text-sm leading-6 text-white/[0.72]">{detail}</p> : null}
    </article>
  );
}
