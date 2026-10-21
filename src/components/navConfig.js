import { Sparkles, Library, BookmarkCheck, History } from 'lucide-react';

// App-level tabs shown in the signed-in navigation (desktop navbar + mobile bottom bar).
// Centralised so both components stay in sync.
export const APP_TABS = [
  { to: '/solve', label: 'Solve', icon: Sparkles },
  { to: '/pyqs', label: 'PYQs', icon: Library },
  { to: '/notes', label: 'Notes', icon: BookmarkCheck },
  { to: '/history', label: 'History', icon: History },
];
