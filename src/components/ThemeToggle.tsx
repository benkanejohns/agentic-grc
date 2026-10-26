import * as React from 'react';
import { Moon, Sun } from 'lucide-react';

function getInitialLight(): boolean {
  if (typeof document === 'undefined') return false;
  return document.documentElement.classList.contains('light');
}

export default function ThemeToggle() {
  const [light, setLight] = React.useState<boolean>(getInitialLight);

  const toggle = () => {
    const next = !light;
    setLight(next);
    document.documentElement.classList.toggle('light', next);
    try {
      localStorage.setItem('theme', next ? 'light' : 'dark');
    } catch {
      // Storage denied; theme still applies for the session.
    }
  };

  return (
    <button
      onClick={toggle}
      aria-label={light ? 'Switch to dark mode' : 'Switch to light mode'}
      className="ml-1 inline-flex h-9 w-9 items-center justify-center rounded text-dim transition-colors hover:text-txt focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal"
    >
      {light ? (
        <Moon aria-hidden="true" size={16} />
      ) : (
        <Sun aria-hidden="true" size={16} />
      )}
    </button>
  );
}
