import {
  createContext,
  useContext,
  useMemo,
  useState,
  useCallback,
  useEffect,
} from 'react';
import { loadJSON, saveJSON, todayKey } from '../lib/storage';

const PROFILE_KEY = 'vtusolve.profile';
const NOTES_KEY = 'vtusolve.notes';
const HISTORY_KEY = 'vtusolve.history';
const USAGE_KEY = 'vtusolve.usage';

export const DAILY_LIMIT = 30; // cosmetic only — never blocks submission.
const MAX_HISTORY = 50;

const ProfileContext = createContext(null);

// Read the usage counter, resetting it when the stored date is not today.
function readUsage() {
  const stored = loadJSON(USAGE_KEY, { date: todayKey(), count: 0 });
  if (stored.date !== todayKey()) return { date: todayKey(), count: 0 };
  return stored;
}

export function ProfileProvider({ children }) {
  // Academic selection: { scheme, branch, semester, subjectCode }
  const [profile, setProfile] = useState(() => loadJSON(PROFILE_KEY, null));
  const [notes, setNotes] = useState(() => loadJSON(NOTES_KEY, []));
  const [history, setHistory] = useState(() => loadJSON(HISTORY_KEY, []));
  const [usage, setUsage] = useState(readUsage);

  // Re-check the daily reset whenever the tab regains focus (handles overnight).
  useEffect(() => {
    const onFocus = () => setUsage(readUsage());
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, []);

  // --- profile -----------------------------------------------------------
  const saveProfile = useCallback((next) => {
    setProfile(next);
    saveJSON(PROFILE_KEY, next);
  }, []);

  const updateProfile = useCallback((patch) => {
    setProfile((prev) => {
      const next = { ...(prev || {}), ...patch };
      saveJSON(PROFILE_KEY, next);
      return next;
    });
  }, []);

  // --- notes -------------------------------------------------------------
  const addNote = useCallback((note) => {
    setNotes((prev) => {
      const next = [{ ...note, savedAt: Date.now() }, ...prev];
      saveJSON(NOTES_KEY, next);
      return next;
    });
  }, []);

  const removeNote = useCallback((id) => {
    setNotes((prev) => {
      const next = prev.filter((n) => n.id !== id);
      saveJSON(NOTES_KEY, next);
      return next;
    });
  }, []);

  const restoreNote = useCallback((note) => {
    setNotes((prev) => {
      if (prev.some((n) => n.id === note.id)) return prev;
      const next = [note, ...prev].sort((a, b) => b.savedAt - a.savedAt);
      saveJSON(NOTES_KEY, next);
      return next;
    });
  }, []);

  // --- history -----------------------------------------------------------
  const addHistory = useCallback((item) => {
    setHistory((prev) => {
      const next = [{ ...item, at: Date.now() }, ...prev].slice(0, MAX_HISTORY);
      saveJSON(HISTORY_KEY, next);
      return next;
    });
  }, []);

  // --- usage (midnight-reset daily counter) ------------------------------
  const incrementUsage = useCallback(() => {
    setUsage((prev) => {
      const base = prev.date === todayKey() ? prev : { date: todayKey(), count: 0 };
      const next = { date: todayKey(), count: base.count + 1 };
      saveJSON(USAGE_KEY, next);
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({
      profile,
      hasProfile: Boolean(profile?.scheme && profile?.branch && profile?.semester),
      saveProfile,
      updateProfile,
      notes,
      addNote,
      removeNote,
      restoreNote,
      history,
      addHistory,
      usage,
      dailyLimit: DAILY_LIMIT,
      incrementUsage,
    }),
    [
      profile,
      saveProfile,
      updateProfile,
      notes,
      addNote,
      removeNote,
      restoreNote,
      history,
      addHistory,
      usage,
      incrementUsage,
    ]
  );

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error('useProfile must be used within ProfileProvider');
  return ctx;
}
