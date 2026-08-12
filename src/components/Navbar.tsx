import { Menu, Search, Command, Settings } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface NavbarProps {
  progress: number;
  onMenu: () => void;
  onSearch: () => void;
}

export default function Navbar({ progress, onMenu, onSearch }: NavbarProps) {
  const location = useLocation();
  const isAdmin = location.pathname === '/admin';

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="h-14 px-4 sm:px-8 flex items-center justify-between max-w-[1600px] mx-auto">
        
        {/* LEFT: Menu + Logo + Search */}
        <div className="flex items-center gap-3 sm:gap-6">
          {/* Mobile Menu Toggle - Hidden if on Admin Page */}
          {!isAdmin && (
            <button 
              onClick={onMenu} 
              className="xl:hidden p-2 text-slate-500 hover:bg-slate-50 rounded-lg transition-colors"
            >
              <Menu size={20} />
            </button>
          )}
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-6 h-6 bg-slate-900 text-white flex items-center justify-center text-[10px] font-black rounded group-hover:bg-indigo-600 transition-colors">
              JS
            </div>
            <span className="hidden sm:inline text-[14px] font-bold tracking-tight text-slate-900 uppercase italic">
              Mastery
            </span>
          </Link>

          {/* Search Trigger (Hidden on Admin Page) */}
          {!isAdmin && (
            <button 
              onClick={onSearch}
              className="flex items-center gap-2 px-2 py-1.5 sm:px-3 sm:py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-400 hover:border-indigo-400 hover:bg-white transition-all group"
            >
              <Search size={14} className="group-hover:text-indigo-500" />
              <span className="hidden md:inline text-[12px] font-medium">Search documentation...</span>
              <span className="hidden lg:flex items-center gap-0.5 ml-2 text-[10px] font-bold text-slate-300 border border-slate-200 px-1.5 py-0.5 rounded-md">
                <Command size={10} /> K
              </span>
            </button>
          )}
        </div>

        {/* RIGHT: Progress + Admin Toggle */}
        <div className="flex items-center gap-4 sm:gap-8">
          
          {/* Progress Indicator (Hidden on Admin Page) */}
          {!isAdmin && (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-[10px] font-black uppercase text-slate-300 tracking-tighter">Progress</span>
                <span className="text-[11px] tabular-nums font-bold text-slate-900">{Math.round(progress)}%</span>
              </div>
              <div className="w-12 sm:w-20 h-[4px] bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-600 transition-all duration-300 ease-out" 
                  style={{ width: `${progress}%` }} 
                />
              </div>
            </div>
          )}

          {/* Admin / Portal Toggle */}
          <Link 
            to={isAdmin ? "/" : "/admin"}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-wider transition-all shadow-sm border ${
              isAdmin 
              ? 'bg-slate-900 text-white border-slate-900 hover:bg-slate-800' 
              : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-500 hover:text-indigo-600'
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