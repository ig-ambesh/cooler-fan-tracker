import { AppHeader } from '../components/AppHeader';
import { AuthForm } from '../components/AuthForm';
import type { AuthMode } from '../types';

type AuthPageProps = {
  mode: AuthMode;
  onModeChange: (mode: AuthMode) => void;
  onSubmit: (email: string, password: string) => Promise<void>;
  error?: string | null;
  isDark: boolean;
  onToggleTheme: () => void;
};

export function AuthPage({ mode, onModeChange, onSubmit, error, isDark, onToggleTheme }: AuthPageProps) {
  return (
    <main className="ios-shell">
      <AppHeader isDark={isDark} onToggleTheme={onToggleTheme} />
      <div className="grid flex-1 place-items-center py-4 md:py-8">
        <AuthForm mode={mode} onModeChange={onModeChange} onSubmit={onSubmit} error={error} />
      </div>
    </main>
  );
}
