import { createContext, useContext, useMemo, useState, useCallback } from 'react';
import { loadJSON, saveJSON, removeKey } from '../lib/storage';

const STORAGE_KEY = 'vtusolve.auth';
const AuthContext = createContext(null);

// Mock authentication state. In this phase a "session" is just the login
// identifier (email or USN) persisted to localStorage. No real tokens.
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => loadJSON(STORAGE_KEY, null));

  const signIn = useCallback((session) => {
    // session: { method: 'email' | 'usn', value: string }
    setUser(session);
    saveJSON(STORAGE_KEY, session);
  }, []);

  const signOut = useCallback(() => {
    setUser(null);
    removeKey(STORAGE_KEY);
  }, []);

  const value = useMemo(
    () => ({ user, isAuthed: Boolean(user), signIn, signOut }),
    [user, signIn, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
