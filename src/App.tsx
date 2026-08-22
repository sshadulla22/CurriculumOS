import { useState, useEffect, useCallback, useRef } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { supabase } from './supabaseClient';
import { ROADMAP_DATA } from './data/roadmap';

import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import CategorySection from './components/CategorySection';
import SearchModal from './components/SearchModal';
import AdminPortal from './components/AdminPortal';
import SkeletonLoading from './components/SkeletonLoading';

function StudentDashboard() {
  const [roadmapData, setRoadmapData] = useState<any[]>([]);
  const [tracks, setTracks] = useState<any[]>([]);
  const [currentTrack, setCurrentTrack] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [modulesLoading, setModulesLoading] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);
  const [activeId, setActiveId] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const activeSectionsRef = useRef<Set<string>>(new Set());

  const closeSidebar = useCallback(() => setSidebarOpen(false), []);
  const toggleSearch = useCallback(() => setSearchOpen((prev) => !prev), []);

  // Fetch Tracks Logic (Optimized)
  useEffect(() => {
    async function fetchTracks() {
      if (!supabase) {
        const fallback = { id: 'js', name: 'JavaScript', description: 'Mastery' };
        setTracks([fallback]);
        setCurrentTrack(fallback);
        setRoadmapData(ROADMAP_DATA);
        setActiveId(ROADMAP_DATA[0]?.id ?? '');
        setLoading(false);
        return;
      }

      let didSetTrackFromCache = false;
      const cachedTracks = localStorage.getItem('curriculum-os-tracks');
      if (cachedTracks) {
        try {
          const parsed = JSON.parse(cachedTracks);
          setTracks(parsed);
          if (parsed.length > 0) {
            setCurrentTrack(parsed[0]);
            didSetTrackFromCache = true;
          }
          setLoading(false);
        } catch (e) {
          // ignore parsing errors
        }
      }

      const { data: list, error: e } = await supabase
        .from('roadmap_tracks')
        .select('*')
        .order('order_index', { ascending: true });

      if (e) {
        if (!cachedTracks) {
          setError(e.message);
          setLoading(false);
        }
        return;
      }

      try {
        localStorage.setItem('curriculum-os-tracks', JSON.stringify(list || []));
      } catch (storageErr) {
        console.warn('Could not cache tracks, quota exceeded', storageErr);
      }
      setTracks(list || []);
      if (!didSetTrackFromCache && list && list.length > 0) {
        setCurrentTrack(list[0]);
      }
      setLoading(false);
    }
    fetchTracks();
  }, []);

  // Fetch Modules when Track changes
  useEffect(() => {
    if (!currentTrack || !supabase) return;
    let cancelled = false;

    async function fetchModules() {
      const cacheKey = `curriculum-os-modules-${currentTrack.id}`;
      const cachedModules = localStorage.getItem(cacheKey);

      if (cachedModules) {
        try {
          const parsed = JSON.parse(cachedModules);
          setRoadmapData(parsed);
          setActiveId(parsed?.[0]?.id ?? '');
          setModulesLoading(false);
        } catch (e) {
          // ignore
        }
      } else {
        setModulesLoading(true);
      }

      setError('');

      try {
        const { data, error: fetchError } = await supabase
          .from('roadmap_modules')
          .select('*')
          .eq('track_id', currentTrack.id || currentTrack.track_id)
          .order('index', { ascending: true });

        if (cancelled) return;
        
        if (fetchError) {
          if (!cachedModules) {
            setError(fetchError.message);
            setRoadmapData([]);
          }
        } else {
          try {
            localStorage.setItem(cacheKey, JSON.stringify(data || []));
          } catch (storageErr) {
            console.warn('Could not cache modules, quota exceeded', storageErr);
          }
          setRoadmapData(data || []);
          if (!cachedModules) {
            setActiveId(data?.[0]?.id ?? '');
          }
        }
      } catch (err: any) {
        if (!cancelled && !cachedModules) {
          setError(err.message || 'An unexpected error occurred while loading modules.');
          setRoadmapData([]);
        }
      } finally {
        if (!cancelled) {
          setModulesLoading(false);
        }
      }
    }
    fetchModules();

    return () => {
      cancelled = true;
    };
  }, [currentTrack]);

  // ═══════════════════════════════════════════════
  // INTERSECTION OBSERVER for sidebar active tracking
  // ═══════════════════════════════════════════════
  useEffect(() => {
    // Clean up previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    const sections = document.querySelectorAll<HTMLElement>('[data-scroll-target]');
    if (sections.length === 0) return;

    activeSectionsRef.current.clear();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.id;
          if (entry.isIntersecting) {
            activeSectionsRef.current.add(id);
          } else {
            activeSectionsRef.current.delete(id);
          }
        });

        // Pick the topmost visible section (based on DOM order)
        const allSections = document.querySelectorAll<HTMLElement>('[data-scroll-target]');
        let found = false;
        for (const section of allSections) {
          if (activeSectionsRef.current.has(section.id)) {
            setActiveId(section.id);
            found = true;
            break;
          }
        }
        // If no sections intersect (e.g. fast scrolling), keep the last activeId.
      },
      {
        rootMargin: '-10% 0px -60% 0px',
        threshold: 0,
      }
    );

    sections.forEach((section) => {
      observerRef.current!.observe(section);
    });

    return () => {
      observerRef.current?.disconnect();
    };
  }, [roadmapData]);

  // Scroll Progress (percentage)
  useEffect(() => {
    const handleScroll = () => {
      const winScroll = document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      setProgress(height > 0 ? (winScroll / height) * 100 : 0);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keyboard Shortcuts
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggleSearch();
      }
      if (e.key === 'Escape') closeSidebar();
    };
    window.addEventListener('keydown', down);
    return () => window.removeEventListener('keydown', down);
  }, [toggleSearch, closeSidebar]);

  if (loading) {
    return <SkeletonLoading label="Loading curriculum" />;
  }

  return (
    <div
      className="min-h-screen antialiased relative"
      style={{
        backgroundColor: 'var(--bg-primary)',
        color: 'var(--text-primary)',
      }}
    >
      {/* Ambient Background Orbs */}
      <div className="ambient-orb ambient-orb-1" />
      <div className="ambient-orb ambient-orb-2" />
      
      <Navbar
        progress={progress}
        onMenu={() => setSidebarOpen(true)}
        onSearch={toggleSearch}
      />

      <div className="mx-auto flex max-w-full">
        {/* Left Sidebar */}
        <Sidebar
          activeId={activeId}
          items={roadmapData}
          open={sidebarOpen}
          onClose={closeSidebar}
        />

        <main className="min-w-0 flex-1 px-4 pt-14 sm:px-6 lg:px-10 xl:ml-64">
          
         {/* Sub-header / Track Switcher */}
          <div
            className="sticky top-14 z-30 w-full backdrop-blur-md"
            style={{
              borderBottom: '1px solid var(--border-primary)',
              backgroundColor: 'var(--bg-blur)',
            }}
          >
            <div className="relative mx-auto max-w-7xl">
              <nav
                role="tablist"
                aria-busy={modulesLoading}
                className="no-scrollbar flex h-12 items-center gap-1 overflow-x-auto px-4 sm:px-6 lg:px-8"
              >
                {tracks.map((track) => {
                  const trackId = track.id || track.track_id;
                  const currentTrackId = currentTrack?.id || currentTrack?.track_id;
                  const isActive = currentTrackId === trackId;
                  return (
                    <button
                      key={trackId}
                      role="tab"
                      aria-selected={isActive}
                      aria-current={isActive ? 'page' : undefined}
                      onClick={() => {
                        if (modulesLoading || isActive) return;
                        setCurrentTrack(track);
                        const el = document.getElementById(`track-${trackId}`);
                        el?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                      }}
                      id={`track-${trackId}`}
                      className="group relative flex h-full shrink-0 items-center whitespace-nowrap px-3 py-1.5 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2"
                      style={{
                        color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
                      }}
                    >
                      <span className="relative z-10">{track.name}</span>

                      {/* Smooth sliding underline */}
                      <span
                        className={`absolute bottom-0 left-0 right-0 h-0.5 origin-left transform rounded-full transition-transform duration-300 ease-out ${
                          isActive ? 'scale-x-100' : 'scale-x-0'
                        }`}
                        style={{ backgroundColor: 'var(--text-primary)' }}
                      />
                    </button>
                  );
                })}
              </nav>

              {modulesLoading && (
                <div
                  className="pointer-events-none absolute inset-y-0 right-4 flex items-center gap-2 text-xs"
                  style={{ color: 'var(--text-muted)' }}
                >
                  <div
                    className="h-3.5 w-3.5 animate-spin rounded-full border-2"
                    style={{
                      borderColor: 'var(--border-primary)',
                      borderTopColor: 'var(--text-primary)',
                    }}
                  />
                  Loading modules
                </div>
              )}

              {/* Right fade – mobile only */}
              <div
                className="pointer-events-none absolute right-0 top-0 z-10 h-full w-10 lg:hidden"
                style={{
                  background: `linear-gradient(to left, var(--fade-from), var(--fade-transparent))`,
                }}
              />
            </div>
          </div>

          {/* Hero Section */}
          <header className="mt-16">
            <div className="flex items-center gap-2 text-[13px] font-medium" style={{ color: 'var(--text-muted)' }}>
              <span>Curriculum</span>
              <span>/</span>
              <span style={{ color: 'var(--text-primary)' }}>{currentTrack?.name}</span>
            </div>
            <h1
              className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl"
              style={{ color: 'var(--text-heading)' }}
            >
              {currentTrack?.name}
            </h1>
            <p
              className="mt-4 max-w-2xl text-base leading-relaxed"
              style={{ color: 'var(--text-tertiary)' }}
            >
              {currentTrack?.description || "Master the core principles and advanced patterns through hands-on modules."}
            </p>
          </header>

          {/* Modules List */}
          <div className="pb-20">
            {error && (
              <div
                className="mb-8 rounded-lg px-4 py-3 text-sm"
                style={{
                  border: '1px solid var(--toast-error-border)',
                  backgroundColor: 'var(--toast-error-bg)',
                  color: 'var(--toast-error-text)',
                }}
              >
                Unable to load this roadmap: {error}
              </div>
            )}
            {modulesLoading ? (
              <div
                className="flex items-center gap-2 py-16 text-sm"
                style={{ color: 'var(--text-muted)' }}
                aria-live="polite"
              >
                <div
                  className="h-4 w-4 animate-spin rounded-full border-2"
                  style={{
                    borderColor: 'var(--border-primary)',
                    borderTopColor: 'var(--text-primary)',
                  }}
                />
                Loading modules...
              </div>
            ) : (
              roadmapData.map((item, index) => (
                <CategorySection
                  key={item.id}
                  id={item.id}
                  index={index + 1}
                  title={item.title}
                  description={item.description}
                  videoId={item.video_id}
                  code={item.code}
                  notes={item.notes || []}
                  subTopics={item.sub_topics || []}
                  interviewQuestions={item.interview_questions || []}
                />
              ))
            )}
          </div>
        </main>
      </div>

      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        items={roadmapData}
      />

      {/* Floating Back to Top Button */}
      <AnimatePresence>
        {progress > 15 && (
          <motion.button
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-6 right-6 z-50 flex h-10 w-10 items-center justify-center rounded-full shadow-xl glass-panel"
            style={{ color: 'var(--text-primary)' }}
            aria-label="Back to top"
          >
            <ArrowUp size={20} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AdminPortal />} />
        <Route path="/admin" element={<AdminPortal />} />
        <Route path="/student" element={<StudentDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}