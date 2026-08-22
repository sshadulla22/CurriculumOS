import { Menu, Search, Settings, LayoutDashboard } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import CurriculumOSLogo from './CurriculumOSLogo';
import ThemeToggle from './ThemeToggle';

interface NavbarProps {
  progress: number;
  onMenu: () => void;
  onSearch: () => void;
}

export default function Navbar({ progress, onMenu, onSearch }: NavbarProps) {
  const location = useLocation();
  const isAdmin = location.pathname === '/admin';

  return (
    <header
      className="fixed top-0 z-50 w-full antialiased glass-panel"
      style={{
        borderBottom: '1px solid var(--border-primary)',
      }}
    >
      {/* Global Reading Progress Bar */}
      {!isAdmin && (
        <motion.div
          className="absolute top-0 left-0 h-[2px] z-50"
          style={{ backgroundColor: 'var(--color-primary)' }}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ ease: "easeOut", duration: 0.2 }}
        />
      )}
      <div className="flex h-14 w-full items-center justify-between px-2 sm:px-6">

        {/* Left Section: Logo & Mobile Menu */}
        <div className="flex items-center gap-4">
          {!isAdmin && (
            <button
              onClick={onMenu}
              className="inline-flex items-center justify-center rounded-md p-1.5 transition-colors xl:hidden"
              style={{ color: 'var(--text-muted)' }}
              aria-label="Open navigation"
            >
              <Menu size={20} />
            </button>
          )}

          <Link to="/" className="flex items-center gap-2 transition-opacity hover:opacity-90">
            <CurriculumOSLogo variant="horizontal" className="h-6 w-auto" />
          </Link>


        </div>

        {/* Right Section: Progress & Admin Toggle */}
        <div className="flex items-center gap-3">

          {!isAdmin && (
            <div
              className="hidden items-center gap-4 pr-4 lg:flex"
              style={{ borderRight: '1px solid var(--border-primary)' }}
            >
              <div className="flex flex-col items-end">
                <span
                  className="text-[10px] font-medium uppercase tracking-wider"
                  style={{ color: 'var(--text-muted)' }}
                >
                  Course Progress
                </span>
                <div className="flex items-center gap-2">
                  <div
                    className="h-1.5 w-24 overflow-hidden rounded-full"
                    style={{ backgroundColor: 'var(--progress-bg)' }}
                  >
                    <div
                      className="h-full transition-all duration-500 ease-out rounded-full"
                      style={{
                        width: `${progress}%`,
                        backgroundColor: 'var(--progress-fill)',
                      }}
                    />
                  </div>
                  <span
                    className="min-w-[2ch] font-mono text-xs font-semibold"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {Math.round(progress)}%
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Search Bar */}
          {!isAdmin && (
            <div className="hidden md:block">
              <button
                onClick={onSearch}
                className="group relative flex h-9 w-64 items-center gap-2 rounded-md px-3 text-sm transition-all"
                style={{
                  border: '1px solid var(--border-primary)',
                  backgroundColor: 'var(--bg-muted)',
                  color: 'var(--text-muted)',
                }}
              >
                <Search size={14} style={{ color: 'var(--text-muted)' }} />
                <span className="text-[13px]">Search...</span>
                <kbd
                  className="pointer-events-none absolute right-1.5 top-1.5 hidden h-6 select-none items-center gap-1 rounded px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex"
                  style={{
                    border: '1px solid var(--border-primary)',
                    backgroundColor: 'var(--kbd-bg)',
                    color: 'var(--text-muted)',
                  }}
                >
                  <span className="text-xs">⌘</span>K
                </kbd>
              </button>
            </div>
          )}

          <Link
            to={isAdmin ? '/' : '/admin'}
            className="inline-flex h-9 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2"
            style={
              isAdmin
                ? {
                  backgroundColor: 'var(--accent-bg)',
                  color: 'var(--accent-text)',
                }
                : {
                  border: '1px solid var(--border-primary)',
                  backgroundColor: 'var(--bg-primary)',
                  color: 'var(--text-primary)',
                }
            }
          >
            {isAdmin ? (
              <>
                <LayoutDashboard size={14} />
                <span>Dashboard</span>
              </>
            ) : (
              <>
                <Settings size={14} style={{ color: 'var(--text-muted)' }} />
                <span>Admin</span>
              </>
            )}
          </Link>

          <ThemeToggle />

          {/* Mobile Search Icon Only */}
          {!isAdmin && (
            <button
              onClick={onSearch}
              className="flex h-9 w-9 items-center justify-center rounded-md md:hidden"
              style={{ color: 'var(--text-muted)' }}
            >
              <Search size={20} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}