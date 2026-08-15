import React, { useState, useMemo } from 'react';
import { Search, X, ChevronRight, Hash, FileText } from 'lucide-react';
import { RoadmapItem } from '../data/roadmap';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: RoadmapItem[];
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
      <div className="fixed inset-0 bg-slate-900/10 backdrop-blur-[2px]" onClick={onClose} />

      <div className="relative w-full max-w-[92vw] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl sm:max-w-lg">
        <div className="flex items-center border-b border-slate-100 px-3 py-3 sm:px-4">
          <Search className="mr-3 text-slate-400" size={18} />
          <input
            autoFocus
            className="flex-1 border-none bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
            placeholder="Search for concepts, patterns, or architecture..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
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
                className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 group transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-md bg-slate-100 flex items-center justify-center text-slate-400 group-hover:text-indigo-600 transition-colors">
                    {res.type === 'Module' ? <Hash size={16} /> : <FileText size={16} />}
                  </div>
                  <div>
                    <div className="text-[13px] font-semibold text-slate-900">{res.title}</div>
                    <div className="text-[10px] text-slate-400 font-medium">{res.parent}</div>
                  </div>
                </div>
                <ChevronRight size={14} className="text-slate-300" />
              </a>
            ))
          ) : query ? (
            <div className="p-10 text-center text-sm text-slate-400">
              No results for "<span className="text-slate-900 font-medium">{query}</span>"
            </div>
          ) : (
            <div className="p-10 text-center text-[12px] font-bold text-slate-300 uppercase tracking-widest">
              Type to search the roadmap
            </div>
          )}
        </div>

        <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex justify-end">
          <div className="flex gap-4">
             <span className="text-[10px] text-slate-400"><kbd className="font-sans border px-1 rounded bg-white">ESC</kbd> to close</span>
             <span className="text-[10px] text-slate-400"><kbd className="font-sans border px-1 rounded bg-white">↵</kbd> to select</span>
          </div>
        </div>
      </div>
    </div>
  );
}