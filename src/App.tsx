import { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { supabase } from './supabaseClient';
import { ROADMAP_DATA } from './data/roadmap';

import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import CategorySection from './components/CategorySection';
import SearchModal from './components/SearchModal';
import AdminPortal from './components/AdminPortal';

const DEFAULT_TRACKS = [
  { id: 'javascript', name: 'JavaScript', description: 'Core language fundamentals.' },
  { id: 'react', name: 'React', description: 'Component-driven UI development.' },
  { id: 'next', name: 'Next', description: 'Full-stack app architecture.' },
  { id: 'typescript', name: 'TypeScript', description: 'Strong typing for scalable apps.' },
];

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

  const closeSidebar = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  const toggleSearch = useCallback(() => {
    setSearchOpen((previous) => !previous);
  }, []);

  useEffect(() => {
    async function fetchTracks() {
      if (!supabase) {
        const fallbackTrack = {
          id: 'default-track',
          name: 'JavaScript Mastery',
          description: 'Fundamentals through production architecture.',
        };

        setTracks([fallbackTrack]);
        setCurrentTrack(fallbackTrack);
        setRoadmapData(ROADMAP_DATA as any[]);
        setActiveId(ROADMAP_DATA[0]?.id ?? '');
        setError('');
        setLoading(false);
        return;
      }

      const { data: trackRows, error: trackError } = await supabase
        .from('roadmap_tracks')
        .select('*')
        .order('order_index', { ascending: true });

      if (trackError) {
        console.error('Error fetching tracks:', trackError);
        setError(trackError.message);
        setTracks([]);
        setCurrentTrack(null);
        setLoading(false);
        return;
      }

      const list = (trackRows ?? []) as any[];
      setTracks(list);

      const selectedTrack = list.find((track) => track.id === currentTrack?.id) ?? list[0] ?? null;
      setCurrentTrack(selectedTrack);

      if (!selectedTrack) {
        setRoadmapData([]);
        setActiveId('');
        setLoading(false);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('roadmap_modules')
        .select('*')
        .eq('track_id', selectedTrack.id)
        .order('index', { ascending: true });

      if (fetchError) {
        console.error('Error fetching roadmap:', fetchError);
        setError(fetchError.message);
      } else {
        setRoadmapData(data ?? []);

        if (data && data.length > 0) {
          setActiveId(data[0].id);
        } else {
          setActiveId('');
        }
      }

      setLoading(false);
    }

    fetchTracks();
  }, []);

  useEffect(() => {
    if (!currentTrack || !supabase) return;

    async function fetchModulesByTrack(trackId: string) {
      setLoading(true);
      setError('');

      const { data, error: fetchError } = await supabase
        .from('roadmap_modules')
        .select('*')
        .eq('track_id', trackId)
        .order('index', { ascending: true });

      if (fetchError) {
        console.error('Error fetching roadmap modules:', fetchError);
        setError(fetchError.message);
        setRoadmapData([]);
        setActiveId('');
      } else {
        setRoadmapData(data ?? []);
        setActiveId((data ?? [])[0]?.id ?? '');
      }

      setLoading(false);
    }

    fetchModulesByTrack(currentTrack.id);
  }, [currentTrack]);

  useEffect(() => {
    if (roadmapData.length === 0) return;

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const documentHeight =
        document.documentElement.scrollHeight - window.innerHeight;

      setProgress(
        documentHeight > 0
          ? Math.min(100, (scrollTop / documentHeight) * 100)
          : 0
      );

      const sections =
        document.querySelectorAll<HTMLElement>(
          '[data-scroll-target]'
        );

      let currentId = roadmapData[0]?.id ?? '';

      sections.forEach((section) => {
        if (scrollTop >= section.offsetTop - 140) {
          currentId = section.id;
        }
      });

      setActiveId(currentId);
    };

    window.addEventListener('scroll', handleScroll, {
      passive: true,
    });

    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [roadmapData]);

  useEffect(() => {
    document.body.style.overflow =
      sidebarOpen || searchOpen ? 'hidden' : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [sidebarOpen, searchOpen]);

  useEffect(() => {
    const handleKeyboard = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeSidebar();
        setSearchOpen(false);
      }

      if (
        (event.metaKey || event.ctrlKey) &&
        event.key.toLowerCase() === 'k'
      ) {
        event.preventDefault();
        toggleSearch();
      }
    };

    window.addEventListener('keydown', handleKeyboard);

    return () => {
      window.removeEventListener('keydown', handleKeyboard);
    };
  }, [closeSidebar, toggleSearch]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <p className="text-sm text-slate-400">
          Loading curriculum...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-5">
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-center">
          <h2 className="font-semibold text-rose-700">
            Could not load curriculum
          </h2>

          <p className="mt-2 text-sm text-rose-600">
            {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 antialiased">
      <Navbar
        progress={progress}
        onMenu={() => setSidebarOpen(true)}
        onSearch={toggleSearch}
      />

      <div className="flex min-h-screen w-full">
        <Sidebar
          activeId={activeId}
          items={roadmapData}
          open={sidebarOpen}
          onClose={closeSidebar}
        />

        <main className="w-full min-w-0 flex-1 pt-20 xl:ml-64">
          <header className="border-b border-slate-100 px-0 pb-8 pt-0">
            <div className="sticky top-[72px] z-20 border-b border-slate-100 bg-white/90 backdrop-blur-sm px-4 py-3 sm:px-6 lg:px-12">
              <div className="overflow-x-auto no-scrollbar">
                <div className="flex min-w-max items-center gap-2">
                  {tracks.map((track) => {
                    const isActive = currentTrack?.id === track.id;

                    return (
                      <button
                        key={track.id}
                        type="button"
                        onClick={() => setCurrentTrack(track)}
                        className={`shrink-0 rounded-full border px-3 py-2 text-[12px] font-medium transition-colors ${
                          isActive
                            ? 'border-slate-900 bg-slate-900 text-white'
                            : 'border-slate-200 bg-white text-slate-600 hover:border-slate-400 hover:text-slate-900'
                        }`}
                      >
                        {track.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="max-w-xl px-4 pt-6 sm:px-6 lg:px-12 lg:pt-8">
              <h1 className="mb-0 text-[28px] font-semibold leading-tight tracking-tight sm:text-[34px] lg:text-[40px]">
                {currentTrack?.name ?? 'JavaScript Mastery'}
              </h1>
            </div>

          </header>

          <div className="px-4 sm:px-6 lg:px-12">
            {roadmapData.map((item, index) => (
              <CategorySection
                key={item.id}
                id={item.id}
                index={index + 1}
                title={item.title}
                description={item.description}
                videoId={item.video_id ?? undefined}
                code={item.code ?? undefined}
                notes={item.notes ?? []}
                subTopics={item.sub_topics ?? []}
                interviewQuestions={
                  item.interview_questions ?? []
                }
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
        <Route path="/" element={<StudentDashboard />} />
        <Route path="/admin" element={<AdminPortal />} />
      </Routes>
    </BrowserRouter>
  );
}