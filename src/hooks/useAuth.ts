import { useEffect, useState } from 'react';
import {
  User,
  UserCredential,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { auth } from '../firebase/auth';

type AuthState = {
  user: User | null;
  loading: boolean;
  error: string | null;
};

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setState((current) => ({
        ...current,
        user,
        loading: false,
      }));
    });

    return unsubscribe;
  }, []);

  const withErrorHandling = async <T,>(action: () => Promise<T>) => {
    try {
      setState((current) => ({ ...current, error: null }));
      return await action();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Authentication failed';
      setState((current) => ({ ...current, error: message }));
      throw error;
    }
  };

  const signUp = (email: string, password: string): Promise<UserCredential> =>
    withErrorHandling(() => createUserWithEmailAndPassword(auth, email, password));

  const signIn = (email: string, password: string): Promise<UserCredential> =>
    withErrorHandling(() => signInWithEmailAndPassword(auth, email, password));

  const signOut = (): Promise<void> => withErrorHandling(() => firebaseSignOut(auth));

  return {
    user: state.user,
    loading: state.loading,
    error: state.error,
    signUp,
    signIn,
    signOut,
  };
}
