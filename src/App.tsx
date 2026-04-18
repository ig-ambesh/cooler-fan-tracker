import { useMemo, useState } from 'react';
import { isFirebaseConfigured } from './firebase/app';
import { useAuth } from './hooks/useAuth';
import { useApplianceRates } from './hooks/useApplianceRates';
import { useTheme } from './hooks/useTheme';
import { useUsageLogs } from './hooks/useUsageLogs';
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import type { AuthMode } from './types';

export default function App() {
  const { user, loading: authLoading, error: authError, signIn, signUp, signOut } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [mode, setMode] = useState<AuthMode>('login');
  const { logs, loading: logsLoading, error: logsError, saveLog, deleteLog } = useUsageLogs(user?.uid);
  const { rates, setRates } = useApplianceRates(user?.uid);

  const appError = useMemo(() => {
    if (!isFirebaseConfigured) {
      return 'Firebase is not configured. Add the VITE_FIREBASE_* environment variables and restart the dev server.';
    }

    return authError ?? logsError ?? null;
  }, [authError, logsError]);

  if (authLoading) {
    return (
      <main className="grid min-h-screen place-items-center px-4">
        <div className="glass rounded-[2rem] px-6 py-5 text-sm text-slate-300">Preparing your dashboard...</div>
      </main>
    );
  }

  if (!user) {
    return (
      <AuthPage
        mode={mode}
        onModeChange={setMode}
        onSubmit={async (email, password) => {
          if (mode === 'login') {
            await signIn(email, password);
            return;
          }

          await signUp(email, password);
        }}
        error={appError}
        isDark={isDark}
        onToggleTheme={toggleTheme}
      />
    );
  }

  return (
    <DashboardPage
      user={user}
      isDark={isDark}
      onToggleTheme={toggleTheme}
      onSignOut={signOut}
      logs={logs}
      loading={logsLoading}
      error={appError}
      onSaveLog={async (value) => saveLog(user.uid, value)}
      onDeleteLog={async (date) => deleteLog(user.uid, date)}
      rates={rates}
      onRatesChange={setRates}
    />
  );
}
