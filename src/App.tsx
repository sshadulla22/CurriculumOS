import { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { supabase } from './supabaseClient';
import { ROADMAP_DATA } from './data/roadmap';

import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import CategorySection from './components/CategorySection';
import SearchModal from './components/SearchModal';
import AdminPortal from './components/AdminPortal';

function StudentDashboard() {
  const [roadmapData, setRoadmapData] = useState<any[]>([]);
  const [tracks, setTracks] = useState<any[]>([]);
  const [currentTrack, setCurrentTrack] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);
  const [activeId, setActiveId] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

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

      const { data: list, error: e } = await supabase
        .from('roadmap_tracks')
        .select('*')
        .order('order_index', { ascending: true });

      if (e) {
        setError(e.message);
        setLoading(false);
        return;
      }

      setTracks(list || []);
      if (list?.length) setCurrentTrack(list[0]);
      setLoading(false);
    }
    fetchTracks();
  }, []);

  // Fetch Modules when Track changes
  useEffect(() => {
    if (!currentTrack || !supabase) return;
    async function fetchModules() {
      const { data } = await supabase
        .from('roadmap_modules')
        .select('*')
        .eq('track_id', currentTrack.id)
        .order('index', { ascending: true });
      
      setRoadmapData(data || []);
      if (data?.length) setActiveId(data[0].id);
    }
    fetchModules();
  }, [currentTrack]);

  // Scroll Tracking (Vercel uses precise offsets)
  useEffect(() => {
    const handleScroll = () => {
      const winScroll = document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      setProgress((winScroll / height) * 100);

      const sections = document.querySelectorAll<HTMLElement>('[data-scroll-target]');
      let current = activeId;
      sections.forEach((section) => {
        if (winScroll >= section.offsetTop - 160) {
          current = section.id;
        }
      });
      setActiveId(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeId]);

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
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-200 border-t-zinc-900" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-zinc-950 antialiased selection:bg-zinc-900 selection:text-white">
      <Navbar
        progress={progress}
        onMenu={() => setSidebarOpen(true)}
        onSearch={toggleSearch}
      />

      <div className="mx-auto flex max-w-full">
        {/* Vercel-style Left Sidebar */}
        <Sidebar
          activeId={activeId}
          items={roadmapData}
          open={sidebarOpen}
          onClose={closeSidebar}
        />

        <main className="min-w-0 flex-1 px-4 pt-14 sm:px-6 lg:px-10 xl:ml-64">
          
          {/* Sub-header / Track Switcher */}
          <div className="fixed top-14 z-30 -mx-4 mb-8 border-b border-zinc-100 bg-white/80 px-4 backdrop-blur-md sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10">
            <div className="flex h-12 items-center justify-between">
              <nav className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                {tracks.map((track) => (
                  <button
                    key={track.id}
                    onClick={() => setCurrentTrack(track)}
                    className={`relative whitespace-nowrap px-3 py-1.5 text-sm font-medium transition-colors ${
                      currentTrack?.id === track.id 
                        ? 'text-zinc-950' 
                        : 'text-zinc-500 hover:text-zinc-800'
                    }`}
                  >
                    {track.name}
                    {currentTrack?.id === track.id && (
                      <div className="absolute inset-x-0 -bottom-[13px] h-0.5 bg-zinc-950" />
                    )}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Hero Section */}
          <header className="mt-16">
            <div className="flex items-center gap-2 text-[13px] font-medium text-zinc-500">
              <span>Curriculum</span>
              <span>/</span>
              <span className="text-zinc-900">{currentTrack?.name}</span>
            </div>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-zinc-950 sm:text-5xl">
              {currentTrack?.name}
            </h1>
            <p className="mt-4 max-w-2xl text-base text-zinc-600 leading-relaxed">
              {currentTrack?.description || "Master the core principles and advanced patterns through hands-on modules."}
            </p>
          </header>

          {/* Modules List */}
          <div className="pb-20">
            {roadmapData.map((item, index) => (
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
            ))}
          </div>
        </main>
      </div>

      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        items={roadmapData}
      />
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