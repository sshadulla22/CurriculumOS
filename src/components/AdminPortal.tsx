import { useEffect, useRef, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import AdminLogin from './AdminLogin';
import CategorySection from './CategorySection';
import {
  Plus,
  Trash2,
  Save,
  Loader2,
  Code2,
  AlertCircle,
  HelpCircle,
  Eye,
  LogOut,
  ChevronRight,
  Triangle,
  Menu,
  X,
} from 'lucide-react';

/* ---------- TYPES ---------- */
type Note = {
  type: 'explainer' | 'internal' | 'warning';
  title: string;
  content: string;
};

type Track = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  order_index: number;
};

type InterviewQuestion = {
  question: string;
  answer: string;
};

type Module = {
  id?: string;
  trackId: string;
  index: number;
  title: string;
  description: string;
  videoId: string;
  code: string;
  notes: Note[];
  subTopics: any[];
  interviewQuestions: InterviewQuestion[];
};

function mapDatabaseModule(row: any): Module {
  return {
    id: row.id,
    trackId: row.track_id ?? '',
    index: row.index ?? 1,
    title: row.title ?? '',
    description: row.description ?? '',
    videoId: row.video_id ?? '',
    code: row.code ?? '',
    notes: Array.isArray(row.notes) ? row.notes : [],
    subTopics: Array.isArray(row.sub_topics) ? row.sub_topics : [],
    interviewQuestions: Array.isArray(row.interview_questions)
      ? row.interview_questions
      : [],
  };
}

/* ---------- COMPONENT ---------- */
export default function AdminPortal() {
  const navigate = useNavigate();

  /* -- state -- */
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [modules, setModules] = useState<Module[]>([]);
  const [currentModule, setCurrentModule] = useState<Module | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const [toast, setToast] = useState<{ id: number; type: 'success' | 'error' | 'info'; message: string } | null>(null);
  const [trackFormOpen, setTrackFormOpen] = useState(false);
  const [trackNameInput, setTrackNameInput] = useState('');
  const [trackRenameInput, setTrackRenameInput] = useState('');
  const [trackRenameOpen, setTrackRenameOpen] = useState(false);

  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);

  const descriptionEditorRef = useRef<HTMLDivElement | null>(null);
  /* FIX 3: backup of the live HTML so nothing is ever lost on a re-mount */
  const descriptionHtmlRef = useRef<string>('');
  /* tracks which module id the editor DOM currently holds */
  const loadedDescIdRef = useRef<string | null>(null);
  /* remembers the signed-in user id, so token refresh doesn't reset state */
  const userIdRef = useRef<string | null>(null);

  function showToast(message: string, type: 'success' | 'error' | 'info' = 'success') {
    const id = Date.now() + Math.random();
    setToast({ id, type, message });
    window.setTimeout(() => {
      setToast((prev) => (prev?.id === id ? null : prev));
    }, 2800);
  }

  function requireSecretPin(label: string) {
    const secretPin = '007';
    const enteredPin = window.prompt(`To delete ${label}, enter the secret pin:`);

    if (enteredPin !== secretPin) {
      showToast('Invalid secret pin. Deletion cancelled.', 'error');
      return false;
    }

    return true;
  }

  /* -- helpers -- */
  function updateModule<K extends keyof Module>(field: K, value: Module[K]) {
    setCurrentModule((prev) => (prev ? { ...prev, [field]: value } : null));
  }

  function addNote() {
    if (!currentModule) return;
    updateModule('notes', [
      ...currentModule.notes,
      { type: 'explainer', title: '', content: '' },
    ]);
  }

  function updateNote(index: number, field: keyof Note, value: string) {
    if (!currentModule) return;
    updateModule(
      'notes',
      currentModule.notes.map((n, i) => (i === index ? { ...n, [field]: value } : n))
    );
  }

  function removeNote(index: number) {
    if (!currentModule) return;
    updateModule('notes', currentModule.notes.filter((_, i) => i !== index));
  }

  function addQuestion() {
    if (!currentModule) return;
    updateModule('interviewQuestions', [
      ...currentModule.interviewQuestions,
      { question: '', answer: '' },
    ]);
  }

  function applyDescriptionCommand(command: string, value?: string) {
    if (!descriptionEditorRef.current) return;
    descriptionEditorRef.current.focus();
    document.execCommand(command, false, value);
    const html = descriptionEditorRef.current.innerHTML;
    descriptionHtmlRef.current = html;
    updateModule('description', html);
  }

  function updateQuestion(index: number, field: keyof InterviewQuestion, value: string) {
    if (!currentModule) return;
    updateModule(
      'interviewQuestions',
      currentModule.interviewQuestions.map((q, i) =>
        i === index ? { ...q, [field]: value } : q
      )
    );
  }

  function removeQuestion(index: number) {
    if (!currentModule) return;
    updateModule(
      'interviewQuestions',
      currentModule.interviewQuestions.filter((_, i) => i !== index)
    );
  }

  /* -- fetch functions -- */
  async function fetchTracks() {
    setError('');
    const { data, error: fetchError } = await supabase
      .from('roadmap_tracks')
      .select('*')
      .order('order_index', { ascending: true });

    if (fetchError) {
      setError(fetchError.message);
      return;
    }

    const list = (data ?? []) as Track[];
    setTracks(list);
    /* keep the SAME object if the track still exists → no re-fetch loop */
    setCurrentTrack((prev) => {
      if (!prev) return list[0] ?? null;
      return list.find((t) => t.id === prev.id) ? prev : (list[0] ?? null);
    });
  }

  async function fetchModules(trackId: string) {
    setLoading(true);
    setError('');

    const { data, error: fetchError } = await supabase
      .from('roadmap_modules')
      .select('*')
      .eq('track_id', trackId)
      .order('index', { ascending: true });

    if (fetchError) {
      setError(fetchError.message);
      setModules([]);
    } else {
      setModules((data ?? []).map(mapDatabaseModule));
    }
    setLoading(false);
  }

  async function addTrack() {
    const name = trackNameInput.trim();
    if (!name) { showToast('Roadmap name is required.', 'info'); return; }
    const slug =
      name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') ||
      `roadmap-${Date.now()}`;

    const { data, error: insertError } = await supabase
      .from('roadmap_tracks')
      .insert({ name, slug, description: '', order_index: tracks.length })
      .select()
      .single();

    if (insertError) {
      setError(insertError.message);
      showToast(`Error creating roadmap: ${insertError.message}`, 'error');
      return;
    }

    setTrackFormOpen(false);
    setTrackNameInput('');
    await fetchTracks();
    setCurrentTrack(data as Track);
    setCurrentModule(null);
    showToast(`Roadmap "${name}" added.`, 'success');
  }

  async function renameTrack() {
    if (!currentTrack) { showToast('Select a roadmap first.', 'info'); return; }
    const newName = trackRenameInput.trim();
    if (!newName) { showToast('Roadmap name is required.', 'info'); return; }

    const slug =
      newName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') ||
      `roadmap-${Date.now()}`;

    const { data, error: renameError } = await supabase
      .from('roadmap_tracks')
      .update({ name: newName, slug })
      .eq('id', currentTrack.id)
      .select()
      .single();

    if (renameError) {
      setError(renameError.message);
      showToast(`Error renaming roadmap: ${renameError.message}`, 'error');
      return;
    }

    const updatedTrack = data as Track;
    setTracks((prev) => prev.map((t) => (t.id === updatedTrack.id ? updatedTrack : t)));
    setCurrentTrack(updatedTrack);
    setTrackRenameOpen(false);
    setTrackRenameInput('');
    showToast(`Roadmap renamed to "${newName}".`, 'success');
  }

  async function deleteTrack() {
    if (!currentTrack) { showToast('Select a roadmap first.', 'info'); return; }
    if (!requireSecretPin(`roadmap "${currentTrack.name}"`)) return;
    if (!window.confirm(`Delete roadmap "${currentTrack.name}" and all its modules?`)) return;

    const { error: moduleDeleteError } = await supabase
      .from('roadmap_modules').delete().eq('track_id', currentTrack.id);
    if (moduleDeleteError) {
      showToast(`Error deleting roadmap modules: ${moduleDeleteError.message}`, 'error');
      return;
    }

    const { error: trackDeleteError } = await supabase
      .from('roadmap_tracks').delete().eq('id', currentTrack.id);
    if (trackDeleteError) {
      showToast(`Error deleting roadmap: ${trackDeleteError.message}`, 'error');
      return;
    }

    const remaining = tracks.filter((t) => t.id !== currentTrack.id);
    setTracks(remaining);
    setCurrentTrack(remaining[0] ?? null);
    setCurrentModule(null);
    setModules([]);
    showToast(`Roadmap "${currentTrack.name}" deleted.`, 'success');
  }

  /* ---------- EFFECTS ---------- */

  /* FIX 1: Auth — ignore token refresh / same-user events */
  useEffect(() => {
    let mounted = true;

    async function checkUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!mounted) return;
      userIdRef.current = user?.id ?? null;
      setUser(user);
      setAuthLoading(false);
    }
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;

      // These fire every time you come back to the browser tab. Ignore them.
      if (event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') return;

      const nextId = session?.user?.id ?? null;
      if (nextId === userIdRef.current) return; // same user → do nothing

      userIdRef.current = nextId;
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  /* Load tracks once per real user change */
  useEffect(() => {
    if (!user?.id) return;
    fetchTracks();
  }, [user?.id]);

  /* Load modules only when the track ID string changes */
  useEffect(() => {
    if (!user?.id || !currentTrack?.id) return;
    fetchModules(currentTrack.id);
  }, [user?.id, currentTrack?.id]);

  /* Sync editor DOM only when the selected module actually changes */
  useEffect(() => {
    if (!currentModule) {
      loadedDescIdRef.current = null;
      descriptionHtmlRef.current = '';
      return;
    }
    const key = currentModule.id || 'new';
    if (loadedDescIdRef.current !== key) {
      loadedDescIdRef.current = key;
      descriptionHtmlRef.current = currentModule.description || '';
      if (descriptionEditorRef.current) {
        descriptionEditorRef.current.innerHTML = descriptionHtmlRef.current;
      }
    }
  }, [currentModule?.id]);

  /* FIX 3: if the editor DOM node ever re-mounts, restore the last HTML */
  function attachDescriptionRef(node: HTMLDivElement | null) {
    descriptionEditorRef.current = node;
    if (node && node.innerHTML !== descriptionHtmlRef.current) {
      node.innerHTML = descriptionHtmlRef.current;
    }
  }

  /* ---------- ACTIONS ---------- */

  function handleAddNew() {
    if (!currentTrack) { showToast('Select a roadmap first.', 'info'); return; }
    const nextIndex = modules.length > 0 ? Math.max(...modules.map((m) => m.index)) + 1 : 1;

    loadedDescIdRef.current = null;
    descriptionHtmlRef.current = 'Describe this lesson...';

    setCurrentModule({
      trackId: currentTrack.id,
      index: nextIndex,
      title: 'New Lesson',
      description: 'Describe this lesson...',
      videoId: '',
      code: '// Enter code here',
      notes: [],
      subTopics: [],
      interviewQuestions: [],
    });

    showToast('New module created.', 'info');
  }

  async function saveToDatabase() {
    if (!currentModule) return;
    if (!currentModule.title.trim()) { alert('Please enter a lesson title.'); return; }
    if (!currentModule.trackId) { alert('Module has no track assigned.'); return; }

    setSaving(true);
    setError('');

    /* always take the freshest HTML straight from the DOM */
    const liveHtml = descriptionEditorRef.current
      ? descriptionEditorRef.current.innerHTML
      : currentModule.description;

    const moduleToSave = {
      ...(currentModule.id ? { id: currentModule.id } : {}),
      track_id: currentModule.trackId,
      index: Number(currentModule.index) || 1,
      title: currentModule.title.trim(),
      description: liveHtml?.trim() || null,
      video_id: currentModule.videoId.trim() || null,
      code: currentModule.code || null,
      notes: currentModule.notes || [],
      sub_topics: currentModule.subTopics || [],
      interview_questions: currentModule.interviewQuestions || [],
    };

    const { data, error: saveError } = await supabase
      .from('roadmap_modules')
      .upsert(moduleToSave)
      .select()
      .single();

    if (saveError) {
      setError(saveError.message);
      showToast(`Error saving: ${saveError.message}`, 'error');
    } else {
      const savedModule = mapDatabaseModule(data);
      loadedDescIdRef.current = savedModule.id || 'new';
      descriptionHtmlRef.current = savedModule.description || '';
      setCurrentModule(savedModule);
      await fetchModules(currentModule.trackId);
      showToast('Changes saved successfully.', 'success');
    }
    setSaving(false);
  }

  async function deleteModule() {
    if (!currentModule) return;
    if (!currentModule.id) { setCurrentModule(null); return; }
    if (!requireSecretPin(`lesson "${currentModule.title}"`)) return;
    if (!window.confirm(`Delete "${currentModule.title}" permanently?`)) return;

    const { error: deleteError } = await supabase
      .from('roadmap_modules').delete().eq('id', currentModule.id);

    if (deleteError) {
      showToast(`Error deleting: ${deleteError.message}`, 'error');
      return;
    }

    setModules((prev) => prev.filter((m) => m.id !== currentModule.id));
    setCurrentModule(null);
    showToast('Module deleted.', 'success');
    if (currentTrack) await fetchModules(currentTrack.id);
  }

  async function logout() {
    await supabase.auth.signOut();
    userIdRef.current = null;
    setUser(null);
    setCurrentModule(null);
    setTracks([]);
    setCurrentTrack(null);
    navigate('/');
  }

  /* Memoized preview — stops the iframe reloading on tab switch */
  const memoizedPreview = useMemo(() => {
    if (!currentModule) return null;
    return (
      <CategorySection
        id="preview-mode"
        index={currentModule.index}
        title={currentModule.title}
        description={currentModule.description}
        videoId={currentModule.videoId || undefined}
        code={currentModule.code || undefined}
        notes={currentModule.notes}
        subTopics={currentModule.subTopics}
        interviewQuestions={currentModule.interviewQuestions}
      />
    );
  }, [currentModule]);

  /* ---------- RENDER ---------- */

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="flex items-center gap-2.5 text-[13px] text-neutral-500">
          <Loader2 size={14} className="animate-spin" />
          Authenticating
        </div>
      </div>
    );
  }

  if (!user) {
    return <AdminLogin onLogin={() => navigate('/student')} />;
  }

  /* FIX 2: only show the full-screen loader on the FIRST load.
     Never unmount the editor while a module is open. */
  if (loading && !currentModule && modules.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="flex items-center gap-2.5 text-[13px] text-neutral-500">
          <Loader2 size={14} className="animate-spin" />
          Loading modules
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-white font-sans text-neutral-900 antialiased">
      {toast && (
        <div className="pointer-events-none fixed right-4 top-16 z-[100]">
          <div
            className={`rounded-lg border px-4 py-2 text-sm shadow-lg backdrop-blur-sm ${
              toast.type === 'error'
                ? 'border-red-200 bg-red-50 text-red-700'
                : toast.type === 'info'
                  ? 'border-sky-200 bg-sky-50 text-sky-700'
                  : 'border-emerald-200 bg-emerald-50 text-emerald-700'
            }`}
          >
            {toast.message}
          </div>
        </div>
      )}

      {/* ── TOP BAR ── */}
      <header className="flex h-auto min-h-12 shrink-0 flex-wrap items-center justify-between gap-2 border-b border-neutral-200 px-3 py-2 sm:px-4">
        <div className="flex min-w-0 flex-wrap items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(true)}
            className="flex h-7 w-7 items-center justify-center rounded-md border border-neutral-200 text-neutral-600 transition-colors hover:bg-neutral-100 md:hidden"
            aria-label="Open sidebar"
          >
            <Menu size={15} />
          </button>
          <Triangle size={15} className="fill-black shrink-0" />
          <span className="text-neutral-300 hidden sm:inline">/</span>
          <span className="text-[13px] font-medium hidden sm:inline">curriculum</span>
          <span className="text-neutral-300">/</span>
          <span className="text-[13px] font-medium text-neutral-500">
            {currentTrack?.name ?? '—'}
          </span>
          {currentModule && (
            <>
              <span className="text-neutral-300">/</span>
              <span className="max-w-[120px] sm:max-w-[200px] truncate text-[12px] sm:text-[13px] text-neutral-500">
                {currentModule.title || 'untitled'}
              </span>
            </>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {currentModule && (
            <div className="flex items-center rounded-lg border border-neutral-200 bg-neutral-100 p-0.5 xl:hidden">
              <button
                type="button"
                onClick={() => setActiveTab('editor')}
                className={`rounded-md px-2 py-0.5 text-[11px] font-medium transition-colors ${
                  activeTab === 'editor'
                    ? 'bg-white text-black shadow-sm'
                    : 'text-neutral-500 hover:text-black'
                }`}
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className={`rounded-md px-2 py-0.5 text-[11px] font-medium transition-colors ${
                  activeTab === 'preview'
                    ? 'bg-white text-black shadow-sm'
                    : 'text-neutral-500 hover:text-black'
                }`}
              >
                Preview
              </button>
            </div>
          )}

          <span className="hidden text-[12px] text-neutral-400 lg:inline">
            {user.email}
          </span>
          <button
            type="button"
            onClick={() => navigate('/student')}
            className="flex h-7 items-center gap-1.5 rounded-md border border-neutral-200 px-2 sm:px-2.5 text-[12px] text-neutral-600 transition-colors hover:border-neutral-400 hover:text-black"
          >
            <ChevronRight size={12} className="rotate-180" />
            <span className="hidden sm:inline">Back</span>
          </button>
          <button
            type="button"
            onClick={logout}
            className="flex h-7 items-center gap-1.5 rounded-md border border-neutral-200 px-2 sm:px-2.5 text-[12px] text-neutral-600 transition-colors hover:border-neutral-400 hover:text-black"
          >
            <LogOut size={12} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col">
        <div className="border-b border-neutral-200 bg-neutral-50/50 px-3 py-2 sm:px-4">
          <div className="flex flex-wrap items-center gap-2">
            {tracks.map((track) => {
              const isActive = currentTrack?.id === track.id;
              return (
                <button
                  key={track.id}
                  type="button"
                  onClick={() => {
                    if (currentTrack?.id === track.id) return;
                    setCurrentTrack(track);
                    setCurrentModule(null);
                  }}
                  className={`rounded-full border px-3 py-1.5 text-[12px] font-medium transition-colors ${
                    isActive
                      ? 'border-black bg-black text-white shadow-sm'
                      : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-400 hover:text-black'
                  }`}
                >
                  {track.name}
                </button>
              );
            })}

            <div className="ml-auto flex items-center gap-2">
              {currentTrack && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setTrackRenameInput(currentTrack.name);
                      setTrackRenameOpen(true);
                    }}
                    className="rounded-full border border-neutral-200 bg-white px-2.5 py-1.5 text-[11px] font-medium text-neutral-600 transition-colors hover:border-neutral-400 hover:text-black"
                  >
                    Rename
                  </button>
                  <button
                    type="button"
                    onClick={deleteTrack}
                    className="rounded-full border border-red-200 bg-red-50 px-2.5 py-1.5 text-[11px] font-medium text-red-600 transition-colors hover:border-red-300 hover:text-red-700"
                  >
                    Delete
                  </button>
                </>
              )}

              <button
                type="button"
                onClick={() => {
                  setTrackNameInput('');
                  setTrackFormOpen(true);
                }}
                className="flex items-center gap-1.5 rounded-full border border-dashed border-neutral-300 bg-white px-3 py-1.5 text-[12px] font-medium text-neutral-600 transition-colors hover:border-neutral-500 hover:text-black"
              >
                <Plus size={12} />
                New Roadmap
              </button>
            </div>
          </div>

          {(trackFormOpen || trackRenameOpen) && (
            <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40 p-4">
              <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white shadow-xl">
                <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3">
                  <h3 className="text-sm font-semibold text-neutral-900">
                    {trackRenameOpen ? 'Rename roadmap' : 'Add roadmap'}
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      setTrackFormOpen(false);
                      setTrackRenameOpen(false);
                      setTrackNameInput('');
                      setTrackRenameInput('');
                    }}
                    className="flex h-8 w-8 items-center justify-center rounded-md text-neutral-400 hover:bg-neutral-100 hover:text-black"
                    aria-label="Close"
                  >
                    <X size={15} />
                  </button>
                </div>

                <div className="p-4">
                  <label className="mb-2 block text-[12px] font-medium text-neutral-500">
                    Roadmap name
                  </label>
                  <input
                    type="text"
                    value={trackRenameOpen ? trackRenameInput : trackNameInput}
                    onChange={(e) => {
                      if (trackRenameOpen) setTrackRenameInput(e.target.value);
                      else setTrackNameInput(e.target.value);
                    }}
                    placeholder={trackRenameOpen ? 'Enter new roadmap name' : 'Enter roadmap name'}
                    className="h-10 w-full rounded-lg border border-neutral-200 px-3 text-sm outline-none focus:border-neutral-900"
                    autoFocus
                  />

                  <div className="mt-4 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setTrackFormOpen(false);
                        setTrackRenameOpen(false);
                        setTrackNameInput('');
                        setTrackRenameInput('');
                      }}
                      className="h-9 rounded-md border border-neutral-200 px-3 text-sm text-neutral-600"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={trackRenameOpen ? renameTrack : addTrack}
                      className="h-9 rounded-md bg-black px-3 text-sm font-medium text-white"
                    >
                      {trackRenameOpen ? 'Save' : 'Add'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {mobileSidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
            onClick={() => setMobileSidebarOpen(false)}
          />
        )}

        <div className="relative flex min-h-0 flex-1 flex-col xl:flex-row">
          <aside
            className={`fixed inset-y-0 left-0 z-50 flex w-[85vw] max-w-xs flex-col border-r border-neutral-200 bg-white transition-transform duration-200 ease-in-out xl:static xl:w-72 xl:translate-x-0 xl:bg-neutral-50/50 ${
              mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            <div className="flex items-center justify-between px-4 pb-2 pt-4 border-b border-neutral-100 md:border-b-0">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-medium uppercase tracking-wider text-neutral-400">
                  Modules
                </span>
                <span className="rounded-full border border-neutral-200 bg-white px-1.5 text-[10px] tabular-nums text-neutral-500">
                  {modules.length}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setMobileSidebarOpen(false)}
                className="flex h-7 w-7 items-center justify-center rounded-md border border-neutral-200 text-neutral-400 transition-colors hover:text-black md:hidden"
                aria-label="Close sidebar"
              >
                <X size={14} />
              </button>
            </div>

            <div className="px-3 py-2 border-b border-neutral-100 bg-neutral-50/60">
              <label
                htmlFor="track-select"
                className="mb-1 block text-[11px] font-medium text-neutral-400"
              >
                Roadmap
              </label>
              <select
                id="track-select"
                value={currentTrack?.id ?? ''}
                onChange={(e) => {
                  if (e.target.value === currentTrack?.id) return;
                  const next = tracks.find((t) => t.id === e.target.value) ?? null;
                  setCurrentTrack(next);
                  setCurrentModule(null);
                }}
                className="h-8 w-full rounded-md border border-neutral-200 bg-white px-2 text-[12px] font-medium outline-none focus:border-neutral-900"
              >
                {tracks.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1 overflow-y-auto px-2 py-2">
              {modules.map((module) => (
                <button
                  key={module.id}
                  type="button"
                  onClick={() => {
                    setCurrentModule(module);
                    setMobileSidebarOpen(false);
                  }}
                  className={`group flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[13px] transition-colors ${
                    currentModule?.id === module.id
                      ? 'bg-neutral-200/60 font-medium text-black'
                      : 'text-neutral-600 hover:bg-neutral-100 hover:text-black'
                  }`}
                >
                  <span className="font-mono text-[11px] tabular-nums text-neutral-400">
                    {String(module.index).padStart(2, '0')}
                  </span>
                  <span className="flex-1 truncate">
                    {module.title || 'Untitled'}
                  </span>
                  <ChevronRight
                    size={12}
                    className={`text-neutral-300 transition-opacity ${
                      currentModule?.id === module.id
                        ? 'opacity-100'
                        : 'opacity-0 group-hover:opacity-100'
                    }`}
                  />
                </button>
              ))}
            </div>

            <div className="border-t border-neutral-200 p-2">
              <button
                type="button"
                onClick={() => {
                  handleAddNew();
                  setMobileSidebarOpen(false);
                }}
                className="flex h-8 w-full items-center justify-center gap-1.5 rounded-md bg-black text-[13px] font-medium text-white transition-colors hover:bg-neutral-800"
              >
                <Plus size={13} />
                New Module
              </button>
            </div>
          </aside>

          {!currentModule ? (
            <main className="flex flex-1 flex-col items-center justify-center gap-3 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-neutral-200 bg-neutral-50">
                <Plus size={18} className="text-neutral-400" />
              </div>
              <p className="text-[13px] text-neutral-500 text-center">
                Select a module or create a new one
              </p>
              <button
                type="button"
                onClick={() => setMobileSidebarOpen(true)}
                className="flex h-8 items-center gap-1.5 rounded-md border border-neutral-200 px-3 text-xs font-medium text-neutral-700 md:hidden"
              >
                <Menu size={14} />
                View Modules ({modules.length})
              </button>
            </main>
          ) : (
            <main className="flex min-w-0 flex-1 flex-col overflow-hidden xl:flex-row">
              <section
                className={`w-full overflow-y-auto xl:w-[520px] xl:shrink-0 xl:border-r xl:border-neutral-200 ${
                  activeTab === 'preview' ? 'hidden xl:block' : 'block'
                }`}
              >
                <div className="sticky top-0 z-10 flex h-12 items-center justify-between border-b border-neutral-200 bg-white/80 px-5 backdrop-blur">
                  <span className="text-[13px] font-medium">Editor</span>
                  <div className="flex items-center gap-2">
                    {/* {currentModule.id && (
                      <button
                        type="button"
                        onClick={deleteModule}
                        className="flex h-7 w-7 items-center justify-center rounded-md border border-neutral-200 text-neutral-400 transition-colors hover:border-red-300 hover:text-red-500"
                        aria-label="Delete"
                      >
                        <Trash2 size={13} />
                      </button>
                    )} */}
                    <button
                      type="button"
                      onClick={saveToDatabase}
                      disabled={saving}
                      className="flex h-7 items-center gap-1.5 rounded-md bg-black px-3 text-[12px] font-medium text-white transition-colors hover:bg-neutral-800 disabled:opacity-40"
                    >
                      {saving ? (
                        <Loader2 size={12} className="animate-spin" />
                      ) : (
                        <Save size={12} />
                      )}
                      {saving ? 'Saving' : 'Save'}
                    </button>
                  </div>
                </div>

                <div className="space-y-8 p-5 pb-24">
                  {error && (
                    <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2.5 text-[12px] text-red-600">
                      {error}
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <label className="mb-1.5 block text-[12px] font-medium text-neutral-500">
                        Title
                      </label>
                      <input
                        type="text"
                        value={currentModule.title}
                        onChange={(e) => updateModule('title', e.target.value)}
                        placeholder="JavaScript Variables"
                        className="h-9 w-full rounded-md border border-neutral-200 bg-white px-3 text-[14px] outline-none transition-colors placeholder:text-neutral-300 focus:border-neutral-900"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="mb-1.5 block text-[12px] font-medium text-neutral-500">
                          Index
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={currentModule.index}
                          onChange={(e) => updateModule('index', Number(e.target.value))}
                          className="h-9 w-full rounded-md border border-neutral-200 px-3 text-[13px] tabular-nums outline-none transition-colors focus:border-neutral-900"
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-[12px] font-medium text-neutral-500">
                          YouTube ID
                        </label>
                        <input
                          type="text"
                          value={currentModule.videoId}
                          onChange={(e) => updateModule('videoId', e.target.value)}
                          placeholder="Ihy0QziLDf0"
                          className="h-9 w-full rounded-md border border-neutral-200 px-3 font-mono text-[12px] outline-none transition-colors placeholder:text-neutral-300 focus:border-neutral-900"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-[12px] font-medium text-neutral-500">
                        Description
                      </label>

                      <div className="overflow-hidden rounded-md border border-neutral-200 bg-white">
                        <div className="flex flex-wrap items-center gap-1.5 border-b border-neutral-200 bg-neutral-50 px-2 py-2">
                          {[
                            { label: 'B', command: 'bold' },
                            { label: 'I', command: 'italic' },
                            { label: 'U', command: 'underline' },
                            { label: '• List', command: 'insertUnorderedList' },
                            { label: '1. List', command: 'insertOrderedList' },
                          ].map((item) => (
                            <button
                              key={item.command}
                              type="button"
                              onMouseDown={(e) => e.preventDefault()}
                              onClick={() => applyDescriptionCommand(item.command)}
                              className="rounded border border-neutral-200 bg-white px-2 py-1 text-[11px] font-medium text-neutral-600 transition-colors hover:border-neutral-400 hover:text-black"
                            >
                              {item.label}
                            </button>
                          ))}
                        </div>

                        <div
                          ref={attachDescriptionRef}
                          contentEditable
                          suppressContentEditableWarning
                          onInput={(event) => {
                            const html = event.currentTarget.innerHTML;
                            descriptionHtmlRef.current = html;
                            updateModule('description', html);
                          }}
                          data-placeholder="Describe this module..."
                          className="min-h-[120px] w-full resize-y overflow-auto bg-white p-3 text-[13px] leading-relaxed text-neutral-700 outline-none placeholder:text-neutral-300 focus:border-neutral-900 [&_ul]:ml-5 [&_ul]:list-disc [&_ol]:ml-5 [&_ol]:list-decimal [&_strong]:font-bold [&_em]:italic [&_u]:underline"
                          style={{ whiteSpace: 'pre-wrap' }}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 flex items-center gap-1.5 text-[12px] font-medium text-neutral-500">
                      <Code2 size={13} />
                      Code
                    </label>
                    <textarea
                      value={currentModule.code}
                      onChange={(e) => updateModule('code', e.target.value)}
                      spellCheck={false}
                      placeholder="// Write code here..."
                      className="min-h-52 w-full resize-y rounded-md border border-neutral-200 bg-neutral-950 p-4 font-mono text-[12.5px] leading-relaxed text-neutral-200 outline-none transition-colors focus:border-neutral-600"
                    />
                  </div>

                  <div>
                    <div className="mb-3 flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-[12px] font-medium text-neutral-500">
                        <AlertCircle size={13} />
                        Notes
                      </span>
                      <button
                        type="button"
                        onClick={addNote}
                        className="flex h-6 items-center gap-1 rounded-md border border-neutral-200 px-2 text-[11px] font-medium text-neutral-600 transition-colors hover:border-neutral-400 hover:text-black"
                      >
                        <Plus size={11} />
                        Add
                      </button>
                    </div>

                    <div className="space-y-2">
                      {currentModule.notes.map((note, index) => (
                        <div key={index} className="rounded-md border border-neutral-200 p-3">
                          <div className="mb-2 flex items-center justify-between">
                            <select
                              value={note.type}
                              onChange={(e) => updateNote(index, 'type', e.target.value)}
                              className="h-6 rounded border border-neutral-200 bg-neutral-50 px-1.5 text-[11px] font-medium text-neutral-600 outline-none"
                            >
                              <option value="explainer">Explainer</option>
                              <option value="warning">Warning</option>
                              <option value="internal">Internal</option>
                            </select>
                            <button
                              type="button"
                              onClick={() => removeNote(index)}
                              className="flex h-6 w-6 items-center justify-center rounded text-neutral-300 transition-colors hover:text-red-500"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>

                          <input
                            type="text"
                            value={note.title}
                            onChange={(e) => updateNote(index, 'title', e.target.value)}
                            placeholder="Note title"
                            className="mb-2 h-8 w-full rounded-md border border-neutral-200 px-2.5 text-[13px] font-medium outline-none placeholder:text-neutral-300 focus:border-neutral-900"
                          />
                          <textarea
                            value={note.content}
                            onChange={(e) => updateNote(index, 'content', e.target.value)}
                            placeholder="Content"
                            className="min-h-16 w-full resize-y rounded-md border border-neutral-200 p-2.5 text-[13px] outline-none placeholder:text-neutral-300 focus:border-neutral-900"
                          />
                        </div>
                      ))}
                      {currentModule.notes.length === 0 && (
                        <div className="rounded-md border border-dashed border-neutral-200 py-6 text-center text-[12px] text-neutral-400">
                          No notes
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="mb-3 flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-[12px] font-medium text-neutral-500">
                        <HelpCircle size={13} />
                        Interview FAQ
                      </span>
                      <button
                        type="button"
                        onClick={addQuestion}
                        className="flex h-6 items-center gap-1 rounded-md border border-neutral-200 px-2 text-[11px] font-medium text-neutral-600 transition-colors hover:border-neutral-400 hover:text-black"
                      >
                        <Plus size={11} />
                        Add
                      </button>
                    </div>

                    <div className="space-y-2">
                      {currentModule.interviewQuestions.map((question, index) => (
                        <div key={index} className="rounded-md border border-neutral-200 p-3">
                          <div className="mb-2 flex items-center justify-between">
                            <span className="font-mono text-[11px] text-neutral-400">
                              Q{index + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeQuestion(index)}
                              className="flex h-6 w-6 items-center justify-center rounded text-neutral-300 transition-colors hover:text-red-500"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>

                          <input
                            type="text"
                            value={question.question}
                            onChange={(e) => updateQuestion(index, 'question', e.target.value)}
                            placeholder="Question"
                            className="mb-2 h-8 w-full rounded-md border border-neutral-200 px-2.5 text-[13px] font-medium outline-none placeholder:text-neutral-300 focus:border-neutral-900"
                          />
                          <textarea
                            value={question.answer}
                            onChange={(e) => updateQuestion(index, 'answer', e.target.value)}
                            placeholder="Answer"
                            className="min-h-20 w-full resize-y rounded-md border border-neutral-200 bg-neutral-50 p-2.5 text-[13px] outline-none placeholder:text-neutral-300 focus:border-neutral-900"
                          />
                        </div>
                      ))}
                      {currentModule.interviewQuestions.length === 0 && (
                        <div className="rounded-md border border-dashed border-neutral-200 py-6 text-center text-[12px] text-neutral-400">
                          No questions
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </section>

              <section
                className={`flex-1 overflow-y-auto bg-neutral-50 ${
                  activeTab === 'preview' ? 'block' : 'hidden xl:block'
                }`}
              >
                <div className="sticky top-0 z-10 flex h-12 items-center gap-2 border-b border-neutral-200 bg-neutral-50/80 px-5 backdrop-blur">
                  <Eye size={13} className="text-neutral-400" />
                  <span className="text-[12px] font-medium text-neutral-500">Preview</span>
                  <span className="ml-auto flex items-center gap-1.5 text-[11px] text-neutral-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Live
                  </span>
                </div>

                <div className="p-6">
                  <div className="rounded-lg border border-neutral-200 bg-white p-8">
                    {memoizedPreview}
                  </div>
                </div>
              </section>
            </main>
          )}
        </div>
      </div>
    </div>
  );
}