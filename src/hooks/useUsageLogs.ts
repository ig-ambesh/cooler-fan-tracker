import { useEffect, useMemo, useState } from 'react';
import {
  Timestamp,
  collection,
  deleteDoc,
  doc,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import type { UsageFormState, UsageLog } from '../types';
import { db } from '../firebase/firestore';
import { calculateDurationMinutes } from '../utils/time';

type UsageLogsState = {
  logs: UsageLog[];
  loading: boolean;
  error: string | null;
};

const emptyState: UsageLogsState = {
  logs: [],
  loading: true,
  error: null,
};

export function useUsageLogs(userId?: string) {
  const [state, setState] = useState<UsageLogsState>(emptyState);

  useEffect(() => {
    if (!userId) {
      setState(emptyState);
      return;
    }

    const logsRef = collection(db, 'users', userId, 'usageLogs');
    const logsQuery = query(logsRef, orderBy('date', 'desc'), limit(120));

    const unsubscribe = onSnapshot(
      logsQuery,
      (snapshot) => {
        const logs = snapshot.docs.map((item) => {
          const data = item.data();

          return {
            id: item.id,
            date: data.date ?? item.id,
            fanStart: data.fanStart ?? '',
            fanEnd: data.fanEnd ?? '',
            fanDuration: data.fanDuration ?? 0,
            coolerStart: data.coolerStart ?? '',
            coolerEnd: data.coolerEnd ?? '',
            coolerDuration: data.coolerDuration ?? 0,
            createdAt: data.createdAt as Timestamp | undefined,
          } satisfies UsageLog;
        });

        setState({ logs, loading: false, error: null });
      },
      (error) => {
        setState((current) => ({
          ...current,
          loading: false,
          error: error.message,
        }));
      }
    );

    return unsubscribe;
  }, [userId]);

  const saveLog = async (userId: string, values: UsageFormState) => {
    const fanDuration = calculateDurationMinutes(values.fanStart, values.fanEnd);
    const coolerDuration = calculateDurationMinutes(values.coolerStart, values.coolerEnd);
    const docRef = doc(db, 'users', userId, 'usageLogs', values.date);
    const existing = state.logs.find((item) => item.date === values.date);

    await setDoc(
      docRef,
      {
        date: values.date,
        fanStart: values.fanStart,
        fanEnd: values.fanEnd,
        fanDuration,
        coolerStart: values.coolerStart,
        coolerEnd: values.coolerEnd,
        coolerDuration,
        createdAt: existing?.createdAt ?? serverTimestamp(),
      },
      { merge: true }
    );
  };

  const deleteLog = async (userId: string, date: string) => {
    await deleteDoc(doc(db, 'users', userId, 'usageLogs', date));
  };

  const byDate = useMemo(() => {
    return new Map(state.logs.map((log) => [log.date, log]));
  }, [state.logs]);

  return {
    logs: state.logs,
    byDate,
    loading: state.loading,
    error: state.error,
    saveLog,
    deleteLog,
  };
}
