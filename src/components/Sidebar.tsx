import { useState, useEffect } from 'react';
import { ChevronDown, X, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarItem {
  id: string;
  title: string;
  subTopics?: { id: string; title: string }[];
}

interface SidebarProps {
  activeId: string;
  onSelect?: (id: string) => void;
  items: SidebarItem[];
  open: boolean; // Mobile open/close
  onClose: () => void;
  isCollapsed: boolean; // Desktop collapse state
  onToggleCollapse: () => void; // Toggle function
}

export default function Sidebar({ activeId, onSelect, items, open, onClose, isCollapsed, onToggleCollapse }: SidebarProps) {
  
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(items.map((i) => [i.id, true]))
  );

  useEffect(() => {
    setExpanded((prev) => {
      const next: Record<string, boolean> = {};
      items.forEach((i) => {
        next[i.id] = prev[i.id] !== undefined ? prev[i.id] : true;
      });
      return next;
    });
  }, [items]);

  const nav = (
    <nav aria-label="Roadmap" className="px-3 py-4">
      <div className="flex items-center justify-between mb-2 px-2">
        {!isCollapsed && (
          <p className="text-[11px] font-medium uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
            Contents
          </p>
        )}
        <button
          onClick={onToggleCollapse}
          className="hidden xl:block p-1 rounded hover:bg-[var(--sidebar-hover-bg)]"
          style={{ color: 'var(--text-muted)' }}
        >
          {isCollapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
        </button>
      </div>

      <ul className="space-y-0.5">
        {items.map((item, i) => {
          const isSectionActive = activeId === item.id || item.subTopics?.some((s) => s.id === activeId);
          const isOpen = expanded[item.id];

          return (
            <li key={item.id}>
              <div className="flex items-start">
                <a
                  href={`#${item.id}`}
                  title={item.title} // Tooltip for truncated text
                  onClick={() => { onSelect?.(item.id); onClose(); }}
                  className="flex-1 flex items-start gap-2 px-2 py-[5px] rounded-md text-[13px] transition-all duration-200 relative overflow-hidden"
                  style={{
                    color: isSectionActive ? 'var(--text-primary)' : 'var(--text-muted)',
                    fontWeight: isSectionActive ? 500 : 400,
                    backgroundColor: isSectionActive ? 'var(--sidebar-active-bg)' : 'transparent',
                  }}
                >
                  <span className="w-4 text-[10px] tabular-nums shrink-0 mt-[2px]">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  
                  {!isCollapsed && (
                    <span className="truncate whitespace-nowrap overflow-hidden pr-4">
                      {item.title}
                    </span>
                  )}
                </a>

                {!isCollapsed && item.subTopics && (
                  <button
                    onClick={() => setExpanded((p) => ({ ...p, [item.id]: !p[item.id] }))}
                    className="p-1.5 rounded shrink-0 mt-[2px]"
                  >
                    <ChevronDown size={12} className={`transition-transform ${isOpen ? '' : '-rotate-90'}`} />
                  </button>
                )}
              </div>

              <AnimatePresence>
                {isOpen && item.subTopics && !isCollapsed && (
                  <motion.ul
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="ml-[18px] pl-2 mt-0.5 mb-1 space-y-px border-l border-[var(--border-secondary)]"
                  >
                    {item.subTopics.map((sub) => (
                      <li key={sub.id}>
                        <a
                          href={`#${sub.id}`}
                          title={sub.title}
                          className="block px-2 py-[4px] rounded text-[12px] truncate whitespace-nowrap overflow-hidden"
                          style={{ color: activeId === sub.id ? 'var(--text-primary)' : 'var(--text-muted)' }}
                        >
                          {sub.title}
                        </a>
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </li>
          );
        })}
      </ul>
    </nav>
  );

  return (
    <>
      {/* Desktop */}
      <aside
        className={`fixed bottom-0 top-14 hidden transition-all duration-300 xl:flex flex-col overflow-y-auto z-20 ${
          isCollapsed ? 'w-16' : 'w-64'
        }`}
        style={{ backgroundColor: 'var(--sidebar-bg)', borderRight: '1px solid var(--sidebar-border)' }}
      >
        {nav}
      </aside>

      {/* Mobile drawer (keeps original logic) */}
      <div className={`fixed inset-0 z-50 xl:hidden ${open ? '' : 'pointer-events-none'}`}>
        <div onClick={onClose} className={`absolute inset-0 transition-opacity ${open ? 'opacity-100' : 'opacity-0'}`} style={{ backgroundColor: 'var(--bg-backdrop)' }} />
        <aside className={`absolute inset-y-0 left-0 w-[82vw] max-w-[300px] transition-transform duration-200 ${open ? 'translate-x-0' : '-translate-x-full'}`} style={{ backgroundColor: 'var(--sidebar-bg)' }}>
          {nav}
        </aside>
      </div>
    </>
  );
}