import type { User } from 'firebase/auth';

type AppHeaderProps = {
  user?: User | null;
  isDark: boolean;
  onToggleTheme: () => void;
  onSignOut?: () => void;
};

export function AppHeader({ user, isDark, onToggleTheme, onSignOut }: AppHeaderProps) {
  return (
    <header className="glass-panel p-5 md:p-6">
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <span className="chip">Night climate</span>
          <div className="flex items-center gap-2">
            <button className="btn-secondary px-4 py-2.5 text-xs" type="button" onClick={onToggleTheme}>
              {isDark ? 'Light' : 'Dark'}
            </button>
            {onSignOut ? (
              <button className="btn-secondary px-4 py-2.5 text-xs" type="button" onClick={onSignOut}>
                Logout
              </button>
            ) : null}
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-white/[0.15] bg-white/[0.08] p-4 sm:p-5">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <p className="card-title">Family night tracker</p>
              <h1 className="mt-3 max-w-xl text-[2rem] font-semibold leading-none tracking-tight text-white md:text-[3.25rem]">
                Liquid-glass control for fan and cooler nights.
              </h1>
            </div>
            <div className="hidden h-16 w-16 rounded-full border border-white/20 bg-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.25)] sm:block" />
          </div>

          <p className="max-w-2xl text-sm leading-6 text-white/[0.72] md:text-base">
            Track nightly appliance use, estimate power cost, and keep every family member's routine in one calm,
            mobile-first dashboard.
          </p>
        </div>

        <div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-[1.5rem] border border-white/[0.15] bg-white/10 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-white/[0.55]">Mode</p>
              <p className="mt-2 text-sm font-medium text-white/90">Private family dashboard</p>
            </div>
            <div className="rounded-[1.5rem] border border-white/[0.15] bg-white/10 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-white/[0.55]">Member</p>
              <p className="mt-2 truncate text-sm font-medium text-white/90">{user?.email ?? 'Guest view'}</p>
            </div>
            <div className="rounded-[1.5rem] border border-white/[0.15] bg-white/10 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-white/[0.55]">Surface</p>
              <p className="mt-2 text-sm font-medium text-white/90">Mobile-first liquid glass</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
