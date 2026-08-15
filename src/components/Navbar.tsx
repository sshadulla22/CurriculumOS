import { Menu, Search, Command, Settings } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import CurriculumOSLogo from './CurriculumOSLogo';

interface NavbarProps {
  progress: number;
  onMenu: () => void;
  onSearch: () => void;
}

export default function Navbar({ progress, onMenu, onSearch }: NavbarProps) {
  const location = useLocation();
  const isAdmin = location.pathname === '/admin';

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-slate-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-auto min-h-[56px] max-w-[1600px] flex-wrap items-center justify-between gap-2 px-3 py-2 sm:px-6 lg:px-8">
        <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3 lg:gap-6">
          {!isAdmin && (
            <button
              onClick={onMenu}
              className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-50 xl:hidden"
              aria-label="Open navigation"
            >
              <Menu size={18} />
            </button>
          )}

          <Link to="/" className="flex min-w-0 items-center gap-2 group" aria-label="CurriculumOS home">
            <CurriculumOSLogo variant="horizontal" className="hidden min-[420px]:flex" />
          </Link>

          {!isAdmin && (
            <button
              onClick={onSearch}
              className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-2 py-1.5 text-slate-400 transition-all hover:border-indigo-400 hover:bg-white group sm:max-w-[360px] sm:px-3 sm:py-2"
            >
              <Search size={14} className="shrink-0 group-hover:text-indigo-500" />
              <span className="hidden min-[500px]:inline truncate text-[12px] font-medium">
                Search documentation...
              </span>
              <span className="ml-auto hidden items-center gap-0.5 rounded-md border border-slate-200 px-1.5 py-0.5 text-[10px] font-bold text-slate-300 lg:flex">
                <Command size={10} /> K
              </span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-3 sm:gap-6">
          {!isAdmin && (
            <div className="hidden items-center gap-3 sm:flex">
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-black uppercase tracking-tighter text-slate-300">
                  Progress
                </span>
                <span className="text-[11px] tabular-nums font-bold text-slate-900">
                  {Math.round(progress)}%
                </span>
              </div>
              <div className="h-[4px] w-12 overflow-hidden rounded-full bg-slate-100 sm:w-20">
                <div
                  className="h-full bg-indigo-600 transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          <Link
            to={isAdmin ? '/' : '/admin'}
            className={`flex items-center justify-center gap-2 rounded-full border px-3 py-2 text-[10px] font-black uppercase tracking-wider transition-all sm:px-4 sm:text-[11px] ${
              isAdmin
                ? 'border-slate-900 bg-slate-900 text-white hover:bg-slate-800'
                : 'border-slate-200 bg-white text-slate-600 hover:border-indigo-500 hover:text-indigo-600'
            }`}
          >
            {isAdmin ? (
              <>View Dashboard</>
            ) : (
              <>
                <Settings size={14} className="animate-spin-slow" />
                <span className="hidden sm:inline">Admin Portal</span>
              </>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}