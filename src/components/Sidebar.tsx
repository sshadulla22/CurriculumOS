import { useState } from 'react';
import { ChevronDown, X } from 'lucide-react';
import type { RoadmapItem } from '../types/roadmap';

interface SidebarProps {
  activeId: string;
  items: RoadmapItem[];
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ activeId, items, open, onClose }: SidebarProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(items.map((i) => [i.id, true]))
  );

  const nav = (
    <nav aria-label="Roadmap" className="px-3 py-4">
      <p className="px-2 mb-2 text-[11px] font-medium text-slate-400 uppercase tracking-wider">
        Contents
      </p>

      <ul className="space-y-0.5">
        {items.map((item, i) => {
          const isSection =
            activeId === item.id || item.subTopics?.some((s) => s.id === activeId);
          const isOpen = expanded[item.id];

          return (
            <li key={item.id}>
              <div className="flex items-center">
                <a
                  href={`#${item.id}`}
                  onClick={onClose}
                  className={`flex-1 flex items-center gap-2 px-2 py-[5px] rounded-md text-[13px] transition-colors ${
                    isSection
                      ? 'text-slate-900 font-medium bg-gray-200'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <span className="w-4 text-[10px] tabular-nums text-slate-600">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="truncate">{item.title}</span>
                </a>

                {item.subTopics && item.subTopics.length > 0 && (
                  <button
                    type="button"
                    onClick={() =>
                      setExpanded((p) => ({ ...p, [item.id]: !p[item.id] }))
                    }
                    className="p-1.5 text-slate-300 hover:text-slate-600 rounded"
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

              {isOpen && item.subTopics && (
                <ul className="ml-[18px] pl-2 border-l border-slate-100 mt-0.5 mb-1 space-y-px">
                  {item.subTopics.map((sub) => (
                    <li key={sub.id}>
                      <a
                        href={`#${sub.id}`}
                        onClick={onClose}
                        className={`block px-2 py-[4px] rounded text-[12px] transition-colors ${
                          activeId === sub.id
                            ? 'text-slate-900 font-medium'
                            : 'text-slate-400 hover:text-slate-700'
                        }`}
                      >
                        {sub.title}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="fixed bottom-0 top-14 hidden w-64 flex-col overflow-y-auto border-r border-slate-100 bg-white xl:flex">
        {nav}
      </aside>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-50 xl:hidden ${open ? '' : 'pointer-events-none'}`}
        aria-hidden={!open}
      >
        <div
          onClick={onClose}
          className={`absolute inset-0 bg-slate-900/20 transition-opacity ${
            open ? 'opacity-100' : 'opacity-0'
          }`}
        />
        <aside
          role="dialog"
          aria-modal="true"
          aria-label="Navigation"
          className={`absolute bottom-0 left-0 top-0 w-[82vw] max-w-[300px] overflow-y-auto border-r border-slate-100 bg-white transition-transform duration-200 ${
            open ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex h-12 items-center justify-between border-b border-slate-100 px-4">
            <span className="text-[13px] font-semibold">Contents</span>
            <button
              type="button"
              onClick={onClose}
              className="rounded-md p-1.5 text-slate-400 hover:bg-slate-50 hover:text-slate-900"
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