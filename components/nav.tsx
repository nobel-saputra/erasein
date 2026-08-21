// components/nav.tsx
'use client';

import { useState, useEffect, useSyncExternalStore } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export function Nav() {
  const pathname = usePathname();
  const [helpOpen, setHelpOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // True only after the component has mounted on the client. Used to avoid
  // hydration mismatch for theme-dependent icons/logo.
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  // Initialize dark state from the class the inline script already applied to
  // <html> before hydration (avoids a flash and a race with layout's script).
  const [isDark, setIsDark] = useState(() =>
    typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
  );

  useEffect(() => {
    // Ensure favicon matches the current theme on mount.
    const favicon = document.getElementById('favicon') as HTMLLinkElement | null;
    if (favicon) favicon.href = document.documentElement.classList.contains('dark') ? '/black.ico' : '/white.ico';
  }, []);

  const toggleTheme = () => {
    const html = document.documentElement;
    html.classList.add('theme-transition');
    const next = !isDark;
    html.classList.toggle('dark', next);
    setIsDark(next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
    const favicon = document.getElementById('favicon') as HTMLLinkElement | null;
    if (favicon) favicon.href = next ? '/black.ico' : '/white.ico';
    window.setTimeout(() => {
      html.classList.remove('theme-transition');
    }, 350);
  };

  const isActive = (path: string) => pathname === path;

  return (
    <>
      <nav className="bg-surface/80 backdrop-blur-md text-primary tracking-tight docked full-width top-0 sticky z-50 border-b border-outline-variant/40 flex justify-between items-center h-16 px-margin-mobile md:px-margin-desktop w-full">
        <Link href="/" className="flex items-center">
            <Image src={mounted && isDark ? '/black.png' : '/white.png'} alt="EraseIn" width={32} height={32} className="h-8 w-auto" />
          </Link>
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Desktop nav links (hidden on mobile where the hamburger menu is used) */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              href="/"
              className={`px-3 py-1.5 rounded-lg font-label-md text-label-md font-bold transition-colors ${
                isActive('/') ? 'bg-on-surface text-surface' : 'text-secondary hover:text-primary hover:bg-surface-container'
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/history"
              className={`px-3 py-1.5 rounded-lg font-label-md text-label-md font-bold transition-colors ${
                isActive('/history') ? 'bg-on-surface text-surface' : 'text-secondary hover:text-primary hover:bg-surface-container'
              }`}
            >
              History
            </Link>
            <Link
              href="/documentation"
              className={`px-3 py-1.5 rounded-lg font-label-md text-label-md font-bold transition-colors ${
                isActive('/documentation') ? 'bg-on-surface text-surface' : 'text-secondary hover:text-primary hover:bg-surface-container'
              }`}
            >
              Documentation
            </Link>
          </div>
          <button onClick={toggleTheme} className="text-secondary hover:text-primary transition-colors" aria-label="Toggle theme" title={isDark ? 'Light Mode' : 'Dark Mode'}>
            <span className="material-symbols-outlined">{mounted && isDark ? 'light_mode' : 'dark_mode'}</span>
          </button>
          <button onClick={() => setHelpOpen(true)} className="text-secondary hover:text-primary transition-colors" aria-label="Help" title="Info">
            <span className="material-symbols-outlined">help_outline</span>
          </button>
          {/* Hamburger menu — mobile only */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-secondary hover:text-primary transition-colors ml-1 md:hidden" aria-label="Menu" title="Menu" aria-expanded={menuOpen}>
            <span className="material-symbols-outlined">{menuOpen ? 'close' : 'menu'}</span>
          </button>
        </div>
      </nav>

       {/* Mobile navigation menu rendered outside the nav for proper backdrop blur. */}
       {menuOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden" onClick={() => setMenuOpen(false)}></div>
          <div className="fixed top-16 right-margin-mobile md:right-margin-desktop z-50 w-48 bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-lg p-2 flex flex-col gap-1 animate-in fade-in zoom-in-95 duration-150 md:hidden">
            <Link
              href="/"
              onClick={() => setMenuOpen(false)}
              className={`px-4 py-2.5 rounded-lg font-label-md text-label-md font-bold transition-colors ${
                isActive('/') ? 'bg-on-surface text-surface' : 'text-secondary hover:text-primary hover:bg-surface-container'
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/history"
              onClick={() => setMenuOpen(false)}
              className={`px-4 py-2.5 rounded-lg font-label-md text-label-md font-bold transition-colors ${
                isActive('/history') ? 'bg-on-surface text-surface' : 'text-secondary hover:text-primary hover:bg-surface-container'
              }`}
            >
              History
            </Link>
            <Link
              href="/documentation"
              onClick={() => setMenuOpen(false)}
              className={`px-4 py-2.5 rounded-lg font-label-md text-label-md font-bold transition-colors ${
                isActive('/documentation') ? 'bg-on-surface text-surface' : 'text-secondary hover:text-primary hover:bg-surface-container'
              }`}
            >
              Documentation
            </Link>
          </div>
        </>
      )}

       {/* About dialog showing feature highlights and privacy notes. */}
      {helpOpen && (
        <div className="fixed inset-0 z-80 flex items-center justify-center bg-black/60 backdrop-blur-md p-4" onClick={() => setHelpOpen(false)}>
          <div className="p-6 sm:p-8 max-w-xl w-full shadow-lg bg-surface-container-lowest rounded-xl border border-outline-variant/30 animate-in fade-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <h3 className="font-headline-sm text-headline-sm text-on-surface">About EraseIn</h3>
              <button onClick={() => setHelpOpen(false)} className="p-1 rounded-full hover:bg-surface-container transition-colors text-secondary" aria-label="Close">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <p className="font-headline-md text-headline-md font-bold text-primary mb-3">100% FREE, USE IT AS YOU LIKE</p>
            <div className="flex flex-col gap-4">
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                EraseIn is a smart automatic background remover.
              </p>
              <ul className="flex flex-col gap-3">
                <li className="flex items-start gap-2 font-body-sm text-body-sm text-on-surface-variant">
                  <span className="material-symbols-outlined text-[18px] text-primary">check_circle</span>
                  Free forever, no image limits, no account, no hidden costs.
                </li>
                <li className="flex items-start gap-2 font-body-sm text-body-sm text-on-surface-variant">
                  <span className="material-symbols-outlined text-[18px] text-primary">check_circle</span>
                  100% private, your images are automatically deleted from History after 1 day.
                </li>
                <li className="flex items-start gap-2 font-body-sm text-body-sm text-on-surface-variant">
                  <span className="material-symbols-outlined text-[18px] text-primary">check_circle</span>
                  Clean cutouts with high detail (isnet_fp16 model), downloadable one by one or all at once.
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
}