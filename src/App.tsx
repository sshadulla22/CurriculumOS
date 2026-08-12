import { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { supabase } from './supabaseClient';
import { ROADMAP_DATA } from './data/roadmap';

import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import CategorySection from './components/CategorySection';
import SearchModal from './components/SearchModal';
import AdminPortal from './components/AdminPortal';

const OBJECTIVES = [
  { label: 'Syntax', detail: 'Core language primitives' },
  { label: 'Runtime', detail: 'Event loop & memory' },
  { label: 'Patterns', detail: 'Architecture that scales' },
];

function StudentDashboard() {
  const [roadmapData, setRoadmapData] = useState<any[]>([]);
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
    async function fetchCurriculum() {
      if (!supabase) {
        setRoadmapData(ROADMAP_DATA as any[]);
        setActiveId(ROADMAP_DATA[0]?.id ?? '');
        setError('');
        setLoading(false);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('roadmap_modules')
        .select('*')
        .order('index', { ascending: true });

      if (fetchError) {
        console.error('Error fetching roadmap:', fetchError);
        setError(fetchError.message);
      } else {
        setRoadmapData(data ?? []);

        if (data && data.length > 0) {
          setActiveId(data[0].id);
        }
      }

      setLoading(false);
    }

    fetchCurriculum();
  }, []);

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

      <div className="flex">
        <Sidebar
          activeId={activeId}
          items={roadmapData}
          open={sidebarOpen}
          onClose={closeSidebar}
        />

        <main className="w-full min-w-0 xl:ml-64">
          <header className="border-b border-slate-100 px-5 pb-10 pt-14 sm:px-8 lg:px-12">
            <div className="max-w-xl">
              <h1 className="mb-3 text-[32px] font-semibold leading-tight tracking-tight sm:text-[40px]">
                JavaScript Mastery
              </h1>

              <p className="text-[15px] leading-relaxed text-slate-500">
                Fundamentals through production architecture.
              </p>
            </div>

            <ul className="mt-8 grid max-w-xl grid-cols-1 gap-px overflow-hidden rounded-lg border border-slate-100 bg-slate-100 sm:grid-cols-3">
              {OBJECTIVES.map((objective) => (
                <li
                  key={objective.label}
                  className="bg-white px-4 py-3"
                >
                  <p className="text-[13px] font-medium text-slate-900">
                    {objective.label}
                  </p>

                  <p className="mt-0.5 text-xs text-slate-400">
                    {objective.detail}
                  </p>
                </li>
              ))}
            </ul>
          </header>

          <div className="px-5 sm:px-8 lg:px-12">
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