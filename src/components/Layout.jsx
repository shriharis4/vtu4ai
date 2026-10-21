import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import BottomTabs from './BottomTabs';

// Routes where the mobile bottom tab bar is shown (the signed-in app surface).
const APP_ROUTES = ['/solve', '/pyqs', '/notes', '/history'];

export default function Layout() {
  const { pathname } = useLocation();
  const showBottomTabs = APP_ROUTES.some((r) => pathname.startsWith(r));

  // Reset scroll position on navigation so each page starts at the top.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [pathname]);

  return (
    <div className="flex min-h-full flex-col">
      <Navbar />
      {/* Bottom padding on mobile keeps content clear of the fixed tab bar. */}
      <main className={`flex-1 ${showBottomTabs ? 'pb-20 md:pb-0' : ''}`}>
        <Outlet />
      </main>
      {showBottomTabs && <BottomTabs />}
    </div>
  );
}
