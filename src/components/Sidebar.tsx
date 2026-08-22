import { useState, useEffect } from 'react';
import { ChevronDown, X } from 'lucide-react';
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
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ activeId, onSelect, items, open, onClose }: SidebarProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(items.map((i) => [i.id, true]))
  );

  // Keep expanded state in sync when items change
  useEffect(() => {
    setExpanded((prev) => {
      const next: Record<string, boolean> = {};
      items.forEach((i) => {
        next[i.id] = prev[i.id] !== undefined ? prev[i.id] : true;
      });
      return next;
    });
  }, [items]);

  // Auto-expand parent section when activeId changes to a subtopic
  useEffect(() => {
    if (!activeId) return;
    for (const item of items) {
      if (item.subTopics?.some((s) => s.id === activeId)) {
        setExpanded((prev) => ({ ...prev, [item.id]: true }));
        break;
      }
    }
  }, [activeId, items]);

  // Auto-scroll active sidebar item into view
  useEffect(() => {
    if (!activeId) return;
    const el = document.getElementById(`sidebar-${activeId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [activeId]);

  const nav = (
    <nav aria-label="Roadmap" className="px-3 py-4">
      <p
        className="px-2 mb-2 text-[11px] font-medium uppercase tracking-wider"
        style={{ color: 'var(--text-muted)' }}
      >
        Contents
      </p>

      <ul className="space-y-0.5">
        {items.map((item, i) => {
          const isSectionExactActive = activeId === item.id;
          const isSectionActive =
            isSectionExactActive || item.subTopics?.some((s) => s.id === activeId);
          const isOpen = expanded[item.id];

          return (
            <li key={item.id}>
              <div className="flex items-start">
                <a
                  id={`sidebar-${item.id}`}
                  href={`#${item.id}`}
                  onClick={() => {
                    onSelect?.(item.id);
                    onClose();
                  }}
                  className="flex-1 flex items-start gap-2 px-2 py-[5px] rounded-md text-[13px] transition-all duration-200 relative"
                  style={{
                    color: isSectionActive ? 'var(--text-primary)' : 'var(--text-muted)',
                    fontWeight: isSectionActive ? 500 : 400,
                    backgroundColor: isSectionActive ? 'var(--sidebar-active-bg)' : 'transparent',
                  }}
                  onMouseEnter={(e) => {
                    if (!isSectionActive) {
                      e.currentTarget.style.backgroundColor = 'var(--sidebar-hover-bg)';
                      e.currentTarget.style.color = 'var(--text-primary)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSectionActive) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = 'var(--text-muted)';
                    }
                  }}
                >
                  {/* Active indicator bar */}
                  {isSectionExactActive && (
                    <motion.span
                      className="absolute left-0 top-1 bottom-1 w-[3px] rounded-full"
                      style={{ backgroundColor: 'var(--sidebar-indicator)' }}
                      initial={{ opacity: 0, scaleY: 0.5 }}
                      animate={{ opacity: 1, scaleY: 1 }}
                      exit={{ opacity: 0, scaleY: 0.5 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                  <span
                    className="w-4 text-[10px] tabular-nums shrink-0 mt-[2px]"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="whitespace-normal break-words">{item.title}</span>
                </a>

                {item.subTopics && item.subTopics.length > 0 && (
                  <button
                    type="button"
                    onClick={() =>
                      setExpanded((p) => ({ ...p, [item.id]: !p[item.id] }))
                    }
                    className="p-1.5 rounded shrink-0 mt-[2px] transition-colors"
                    style={{ color: 'var(--text-muted)' }}
                    aria-expanded={isOpen}
                    aria-label={`${isOpen ? 'Collapse' : 'Expand'} ${item.title}`}
                  >
                    <ChevronDown
                      size={12}
                      className={`transition-transform duration-150 ${
                        isOpen ? '' : '-rotate-90'
                      }`}
                    />
                  </button>
                )}
              </div>

              <AnimatePresence>
                {isOpen && item.subTopics && (
                  <motion.ul
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                    className="ml-[18px] pl-2 mt-0.5 mb-1 space-y-px overflow-hidden"
                    style={{ borderLeft: '1px solid var(--border-secondary)' }}
                  >
                    {item.subTopics.map((sub) => (
                      <motion.li 
                        key={sub.id}
                        initial={{ x: -10, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <a
                          id={`sidebar-${sub.id}`}
                          href={`#${sub.id}`}
                          onClick={() => {
                            onSelect?.(sub.id);
                            onClose();
                          }}
                          className="block px-2 py-[4px] rounded text-[12px] transition-colors whitespace-normal break-words relative"
                          style={{
                            color: activeId === sub.id ? 'var(--text-primary)' : 'var(--text-muted)',
                            fontWeight: activeId === sub.id ? 500 : 400,
                          }}
                        >
                          {/* Active indicator bar for subtopic */}
                          {activeId === sub.id && (
                            <motion.span
                              className="absolute -left-[6px] top-[4px] bottom-[4px] w-[2px] rounded-full"
                              style={{ backgroundColor: 'var(--sidebar-indicator)' }}
                              initial={{ opacity: 0, scaleY: 0.5 }}
                              animate={{ opacity: 1, scaleY: 1 }}
                              exit={{ opacity: 0, scaleY: 0.5 }}
                              transition={{ duration: 0.2 }}
                            />
                          )}
                          {sub.title}
                        </a>
                      </motion.li>
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
        className="fixed bottom-0 top-14 hidden w-64 flex-col overflow-y-auto xl:flex"
        style={{
          backgroundColor: 'var(--sidebar-bg)',
          borderRight: '1px solid var(--sidebar-border)',
        }}
      >
        {nav}
      </aside>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-50 xl:hidden ${open ? '' : 'pointer-events-none'}`}
        aria-hidden={!open}
      >
        <div
          onClick={onClose}
          className={`absolute inset-0 transition-opacity ${
            open ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ backgroundColor: 'var(--bg-backdrop)' }}
        />
        <aside
          role="dialog"
          aria-modal="true"
          aria-label="Navigation"
          className={`absolute bottom-0 left-0 top-0 w-[82vw] max-w-[300px] overflow-y-auto transition-transform duration-200 ${
            open ? 'translate-x-0' : '-translate-x-full'
          }`}
          style={{
            backgroundColor: 'var(--sidebar-bg)',
            borderRight: '1px solid var(--sidebar-border)',
          }}
        >
          <div
            className="flex h-12 items-center justify-between px-4"
            style={{ borderBottom: '1px solid var(--sidebar-border)' }}
          >
            <span className="text-[13px] font-semibold" style={{ color: 'var(--text-primary)' }}>
              Contents
            </span>
            <button
              type="button"
              onClick={onClose}
              className="rounded-md p-1.5 transition-colors"
              style={{ color: 'var(--text-muted)' }}
              aria-label="Close navigation"
            >
              <X size={16} />
            </button>
          </div>
          {nav}
        </aside>
      </div>
    </>
  );
}