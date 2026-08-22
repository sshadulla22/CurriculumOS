import { Moon, Sun } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';

const STORAGE_KEY = 'curriculum-os-theme';

export default function ThemeToggle() {
  const [dark, setDark] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(STORAGE_KEY) === 'dark';
  });

  const [animating, setAnimating] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    localStorage.setItem(STORAGE_KEY, dark ? 'dark' : 'light');
  }, [dark]);

  const handleToggle = () => {
    setAnimating(true);
    setDark((current) => !current);

    // Remove animation class after it completes
    setTimeout(() => setAnimating(false), 450);
  };

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={handleToggle}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${animating ? 'theme-toggle-pulse' : ''}`}
      style={{
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: 'var(--border-primary)',
        color: 'var(--text-tertiary)',
        backgroundColor: 'transparent',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
        e.currentTarget.style.color = 'var(--text-primary)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent';
        e.currentTarget.style.color = 'var(--text-tertiary)';
      }}
      aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={dark ? 'Switch to light theme' : 'Switch to dark theme'}
    >
      <span className={animating ? 'theme-icon-enter' : ''} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {dark ? <Sun size={16} /> : <Moon size={16} />}
      </span>
    </button>
  );
}