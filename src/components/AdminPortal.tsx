import { useEffect, useState } from 'react';
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

type Note = {
  type: 'explainer' | 'internal' | 'warning';
  title: string;
  content: string;
};

type InterviewQuestion = {
  question: string;
  answer: string;
};

type Module = {
  id?: string;
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

export default function AdminPortal() {
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [modules, setModules] = useState<Module[]>([]);
  const [currentModule, setCurrentModule] = useState<Module | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');

  /* Authentication */
  useEffect(() => {
    let mounted = true;

    async function checkUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (mounted) {
        setUser(user);
        setAuthLoading(false);
      }
    }
    checkUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setUser(session?.user ?? null);
        setAuthLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  /* Load modules after auth */
  useEffect(() => {
    if (!user) return;
    fetchModules();
  }, [user]);

  async function fetchModules() {
    setLoading(true);
    setError('');

    const { data, error: fetchError } = await supabase
      .from('roadmap_modules')
      .select('*')
      .order('index', { ascending: true });

    if (fetchError) {
      console.error('Fetch error:', fetchError);
      setError(fetchError.message);
      setModules([]);
    } else {
      setModules((data ?? []).map(mapDatabaseModule));
    }
    setLoading(false);
  }

  function handleAddNew() {
    const nextIndex =
      modules.length > 0
        ? Math.max(...modules.map((module) => module.index)) + 1
        : 1;

    setCurrentModule({
      index: nextIndex,
      title: 'New Lesson',
      description: 'Describe this lesson...',
      videoId: '',
      code: '// Enter code here',
      notes: [],
      subTopics: [],
      interviewQuestions: [],
    });
  }

  async function saveToDatabase() {
    if (!currentModule) return;

    if (!currentModule.title.trim()) {
      alert('Please enter a lesson title.');
      return;
    }

    setSaving(true);
    setError('');

    const moduleToSave = {
      ...(currentModule.id ? { id: currentModule.id } : {}),
      index: Number(currentModule.index) || 1,
      title: currentModule.title.trim(),
      description: currentModule.description.trim() || null,
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
      console.error('Save error:', saveError);
      setError(saveError.message);
      alert(`Error saving: ${saveError.message}`);
    } else {
      const savedModule = mapDatabaseModule(data);
      setCurrentModule(savedModule);
      await fetchModules();
    }
    setSaving(false);
  }

  async function deleteModule() {
    if (!currentModule) return;

    if (!currentModule.id) {
      setCurrentModule(null);
      return;
    }

    const confirmed = window.confirm(
      `Delete "${currentModule.title}" permanently?`
    );
    if (!confirmed) return;

    const { error: deleteError } = await supabase
      .from('roadmap_modules')
      .delete()
      .eq('id', currentModule.id);

    if (deleteError) {
      alert(`Error deleting: ${deleteError.message}`);
      return;
    }

    setModules((previousModules) =>
      previousModules.filter((module) => module.id !== currentModule.id)
    );
    setCurrentModule(null);
  }

  async function logout() {
    await supabase.auth.signOut();
    setUser(null);
    setCurrentModule(null);
  }

  function updateModule<K extends keyof Module>(field: K, value: Module[K]) {
    setCurrentModule((previousModule) => {
      if (!previousModule) return null;
      return { ...previousModule, [field]: value };
    });
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
    const updatedNotes = currentModule.notes.map((note, noteIndex) =>
      noteIndex === index ? { ...note, [field]: value } : note
    );
    updateModule('notes', updatedNotes);
  }

  function removeNote(index: number) {
    if (!currentModule) return;
    updateModule(
      'notes',
      currentModule.notes.filter((_, noteIndex) => noteIndex !== index)
    );
  }

  function addQuestion() {
    if (!currentModule) return;
    updateModule('interviewQuestions', [
      ...currentModule.interviewQuestions,
      { question: '', answer: '' },
    ]);
  }

  function updateQuestion(
    index: number,
    field: keyof InterviewQuestion,
    value: string
  ) {
    if (!currentModule) return;
    const updatedQuestions = currentModule.interviewQuestions.map(
      (question, questionIndex) =>
        questionIndex === index ? { ...question, [field]: value } : question
    );
    updateModule('interviewQuestions', updatedQuestions);
  }

  function removeQuestion(index: number) {
    if (!currentModule) return;
    updateModule(
      'interviewQuestions',
      currentModule.interviewQuestions.filter(
        (_, questionIndex) => questionIndex !== index
      )
    );
  }

  /* ---------- Conditional renders (after hooks) ---------- */
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
    return <AdminLogin onLogin={() => window.location.reload()} />;
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="flex items-center gap-2.5 text-[13px] text-neutral-500">
          <Loader2 size={14} className="animate-spin" />
          Loading modules
        </div>
      </div>
    );
  }

  /* ---------- Main UI (Vercel style) ---------- */
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-white font-sans text-neutral-900 antialiased">
      
      {/* ── TOP BAR ───────────────────────────── */}
      <header className="flex h-12 shrink-0 items-center justify-between border-b border-neutral-200 px-3 sm:px-4">
        <div className="flex items-center gap-2 sm:gap-3">
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
          {currentModule && (
            <>
              <span className="text-neutral-300">/</span>
              <span className="max-w-[120px] sm:max-w-[200px] truncate text-[12px] sm:text-[13px] text-neutral-500">
                {currentModule.title || 'untitled'}
              </span>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
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
            onClick={logout}
            className="flex h-7 items-center gap-1.5 rounded-md border border-neutral-200 px-2 sm:px-2.5 text-[12px] text-neutral-600 transition-colors hover:border-neutral-400 hover:text-black"
          >
            <LogOut size={12} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 relative">
        
        {/* Mobile backdrop */}
        {mobileSidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
            onClick={() => setMobileSidebarOpen(false)}
          />
        )}

        {/* ── SIDEBAR ───────────────────────────── */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-neutral-200 bg-white transition-transform duration-200 ease-in-out md:static md:w-60 md:translate-x-0 md:bg-neutral-50/50 ${
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

        {/* ── EMPTY STATE ───────────────────────── */}
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
          <main className="flex min-w-0 flex-1 overflow-hidden">
            
            {/* ── EDITOR ─────────────────────────── */}
            <section
              className={`w-full overflow-y-auto lg:w-[480px] xl:w-[520px] lg:shrink-0 lg:border-r lg:border-neutral-200 ${
                activeTab === 'preview' ? 'hidden xl:block' : 'block'
              }`}
            >
              
              {/* Editor header */}
              <div className="sticky top-0 z-10 flex h-12 items-center justify-between border-b border-neutral-200 bg-white/80 px-5 backdrop-blur">
                <span className="text-[13px] font-medium">Editor</span>
                <div className="flex items-center gap-2">
                  {currentModule.id && (
                    <button
                      type="button"
                      onClick={deleteModule}
                      className="flex h-7 w-7 items-center justify-center rounded-md border border-neutral-200 text-neutral-400 transition-colors hover:border-red-300 hover:text-red-500"
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
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

                {/* Basic fields */}
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
                        onChange={(e) =>
                          updateModule('index', Number(e.target.value))
                        }
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
                        onChange={(e) =>
                          updateModule('videoId', e.target.value)
                        }
                        placeholder="Ihy0QziLDf0"
                        className="h-9 w-full rounded-md border border-neutral-200 px-3 font-mono text-[12px] outline-none transition-colors placeholder:text-neutral-300 focus:border-neutral-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-[12px] font-medium text-neutral-500">
                      Description
                    </label>
                    <textarea
                      rows={3}
                      value={currentModule.description}
                      onChange={(e) =>
                        updateModule('description', e.target.value)
                      }
                      placeholder="Describe this module..."
                      className="w-full resize-y rounded-md border border-neutral-200 p-3 text-[13px] leading-relaxed outline-none transition-colors placeholder:text-neutral-300 focus:border-neutral-900"
                    />
                  </div>
                </div>

                {/* Code */}
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

                {/* Notes */}
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
                      <div
                        key={index}
                        className="rounded-md border border-neutral-200 p-3"
                      >
                        <div className="mb-2 flex items-center justify-between">
                          <select
                            value={note.type}
                            onChange={(e) =>
                              updateNote(index, 'type', e.target.value)
                            }
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
                          onChange={(e) =>
                            updateNote(index, 'title', e.target.value)
                          }
                          placeholder="Note title"
                          className="mb-2 h-8 w-full rounded-md border border-neutral-200 px-2.5 text-[13px] font-medium outline-none placeholder:text-neutral-300 focus:border-neutral-900"
                        />
                        <textarea
                          value={note.content}
                          onChange={(e) =>
                            updateNote(index, 'content', e.target.value)
                          }
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

                {/* Interview questions */}
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
                    {currentModule.interviewQuestions.map(
                      (question, index) => (
                        <div
                          key={index}
                          className="rounded-md border border-neutral-200 p-3"
                        >
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
                            onChange={(e) =>
                              updateQuestion(index, 'question', e.target.value)
                            }
                            placeholder="Question"
                            className="mb-2 h-8 w-full rounded-md border border-neutral-200 px-2.5 text-[13px] font-medium outline-none placeholder:text-neutral-300 focus:border-neutral-900"
                          />
                          <textarea
                            value={question.answer}
                            onChange={(e) =>
                              updateQuestion(index, 'answer', e.target.value)
                            }
                            placeholder="Answer"
                            className="min-h-20 w-full resize-y rounded-md border border-neutral-200 bg-neutral-50 p-2.5 text-[13px] outline-none placeholder:text-neutral-300 focus:border-neutral-900"
                          />
                        </div>
                      )
                    )}

                    {currentModule.interviewQuestions.length === 0 && (
                      <div className="rounded-md border border-dashed border-neutral-200 py-6 text-center text-[12px] text-neutral-400">
                        No questions
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* ── PREVIEW ────────────────────────── */}
            <section
              className={`flex-1 overflow-y-auto bg-neutral-50 ${
                activeTab === 'preview' ? 'block' : 'hidden xl:block'
              }`}
            >
              <div className="sticky top-0 z-10 flex h-12 items-center gap-2 border-b border-neutral-200 bg-neutral-50/80 px-5 backdrop-blur">
                <Eye size={13} className="text-neutral-400" />
                <span className="text-[12px] font-medium text-neutral-500">
                  Preview
                </span>
                <span className="ml-auto flex items-center gap-1.5 text-[11px] text-neutral-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Live
                </span>
              </div>

              <div className="p-6">
                <div className="rounded-lg border border-neutral-200 bg-white p-8">
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
                </div>
              </div>
            </section>
          </main>
        )}
      </div>
    </div>
  );
}