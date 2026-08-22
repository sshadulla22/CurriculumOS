import { Menu, Search, Command, Settings, LayoutDashboard } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
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
    <header className="fixed top-0 z-50 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-md antialiased">
      <div className="mx-auto flex h-14 max-w-[1400px] items-center justify-between px-4 sm:px-6">
        
        {/* Left Section: Logo & Mobile Menu */}
        <div className="flex items-center gap-4">
          {!isAdmin && (
            <button
              onClick={onMenu}
              className="inline-flex items-center justify-center rounded-md p-1.5 text-zinc-500 transition-colors hover:bg-zinc-100 xl:hidden"
              aria-label="Open navigation"
            >
              <Menu size={20} />
            </button>
          )}

          <Link to="/" className="flex items-center gap-2 transition-opacity hover:opacity-90">
            <CurriculumOSLogo variant="horizontal" className="h-6 w-auto" />
          </Link>

          {/* Search Bar - Vercel Style */}
          {!isAdmin && (
            <div className="hidden md:block">
              <button
                onClick={onSearch}
                className="group relative flex h-9 w-64 items-center gap-2 rounded-md border border-zinc-200 bg-zinc-50 px-3 text-sm text-zinc-500 transition-all hover:border-zinc-300 hover:bg-zinc-100"
              >
                <Search size={14} className="text-zinc-400 group-hover:text-zinc-600" />
                <span className="text-[13px]">Search...</span>
                <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-6 select-none items-center gap-1 rounded border border-zinc-200 bg-white px-1.5 font-mono text-[10px] font-medium text-zinc-400 opacity-100 sm:flex">
                  <span className="text-xs">⌘</span>K
                </kbd>
              </button>
            </div>
          )}
        </div>

        {/* Right Section: Progress & Admin Toggle */}
        <div className="flex items-center gap-3">
          {!isAdmin && (
            <div className="hidden items-center gap-4 border-r border-zinc-200 pr-4 lg:flex">
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-400">
                  Course Progress
                </span>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-24 overflow-hidden rounded-full bg-zinc-100">
                    <div
                      className="h-full bg-black transition-all duration-500 ease-out"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <span className="min-w-[2ch] font-mono text-xs font-semibold text-zinc-900">
                    {Math.round(progress)}%
                  </span>
                </div>
              </div>
            </div>
          )}

          <Link
            to={isAdmin ? '/' : '/admin'}
            className={`inline-flex h-9 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:ring-offset-2 ${
              isAdmin
                ? 'bg-zinc-900 text-zinc-50 hover:bg-zinc-800'
                : 'border border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-50 shadow-sm'
            }`}
          >
            {isAdmin ? (
              <>
                <LayoutDashboard size={14} />
                <span>Dashboard</span>
              </>
            ) : (
              <>
                <Settings size={14} className="text-zinc-500" />
                <span>Admin</span>
              </>
            )}
          </Link>

          <ThemeToggle />
          
          {/* Mobile Search Icon Only */}
          {!isAdmin && (
            <button 
              onClick={onSearch}
              className="flex h-9 w-9 items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-100 md:hidden"
            >
              <Search size={20} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}