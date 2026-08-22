import { useState, useMemo } from 'react';
import { Search, X, ChevronRight, Hash, FileText } from 'lucide-react';

interface SearchItem {
  id: string;
  title: string;
  subTopics?: { id: string; title: string }[];
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: SearchItem[];
}

export default function SearchModal({ isOpen, onClose, items }: SearchModalProps) {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const searchResults: any[] = [];
    
    items.forEach(item => {
      // Search Main Topic
      if (item.title.toLowerCase().includes(query.toLowerCase())) {
        searchResults.push({ id: item.id, title: item.title, type: 'Module', parent: item.title });
      }
      // Search Subtopics
      item.subTopics?.forEach(sub => {
        if (sub.title.toLowerCase().includes(query.toLowerCase())) {
          searchResults.push({ id: sub.id, title: sub.title, type: 'Concept', parent: item.title });
        }
      });
    });
    
    return searchResults.slice(0, 8); // Limit results
  }, [query, items]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center px-3 pt-16 sm:px-4 sm:pt-20">
      <div
        className="fixed inset-0 backdrop-blur-[2px]"
        style={{ backgroundColor: 'var(--bg-backdrop)' }}
        onClick={onClose}
      />

      <div
        className="relative w-full max-w-[92vw] overflow-hidden rounded-xl shadow-2xl sm:max-w-lg"
        style={{
          border: '1px solid var(--border-primary)',
          backgroundColor: 'var(--search-bg)',
        }}
      >
        <div
          className="flex items-center px-3 py-3 sm:px-4"
          style={{ borderBottom: '1px solid var(--border-secondary)' }}
        >
          <Search className="mr-3" size={18} style={{ color: 'var(--text-muted)' }} />
          <input
            autoFocus
            className="flex-1 border-none bg-transparent text-sm outline-none"
            style={{
              color: 'var(--text-secondary)',
            }}
            placeholder="Search for concepts, patterns, or architecture..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button onClick={onClose} style={{ color: 'var(--text-muted)' }}>
            <X size={18} />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2 sm:max-h-[350px]">
          {results.length > 0 ? (
            results.map((res, i) => (
              <a
                key={i}
                href={`#${res.id}`}
                onClick={onClose}
                className="flex items-center justify-between p-3 rounded-lg group transition-colors"
                style={{ backgroundColor: 'transparent' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--search-result-hover)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-md flex items-center justify-center transition-colors"
                    style={{
                      backgroundColor: 'var(--search-icon-bg)',
                      color: 'var(--text-muted)',
                    }}
                  >
                    {res.type === 'Module' ? <Hash size={16} /> : <FileText size={16} />}
                  </div>
                  <div>
                    <div
                      className="text-[13px] font-semibold"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {res.title}
                    </div>
                    <div
                      className="text-[10px] font-medium"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {res.parent}
                    </div>
                  </div>
                </div>
                <ChevronRight size={14} style={{ color: 'var(--text-muted)' }} />
              </a>
            ))
          ) : query ? (
            <div className="p-10 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
              No results for "<span style={{ color: 'var(--text-primary)' }} className="font-medium">{query}</span>"
            </div>
          ) : (
            <div
              className="p-10 text-center text-[12px] font-bold uppercase tracking-widest"
              style={{ color: 'var(--text-muted)' }}
            >
              Type to search the roadmap
            </div>
          )}
        </div>

        <div
          className="px-4 py-2 flex justify-end"
          style={{
            backgroundColor: 'var(--search-footer-bg)',
            borderTop: '1px solid var(--border-secondary)',
          }}
        >
          <div className="flex gap-4">
            <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
              <kbd
                className="font-sans px-1 rounded"
                style={{
                  border: '1px solid var(--kbd-border)',
                  backgroundColor: 'var(--kbd-bg)',
                }}
              >
                ESC
              </kbd>{' '}
              to close
            </span>
            <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
              <kbd
                className="font-sans px-1 rounded"
                style={{
                  border: '1px solid var(--kbd-border)',
                  backgroundColor: 'var(--kbd-bg)',
                }}
              >
                ↵
              </kbd>{' '}
              to select
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}