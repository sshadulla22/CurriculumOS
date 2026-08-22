import { useState, useEffect, useCallback } from 'react';
import { Maximize2, MonitorPlay } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';


import {
  Copy,
  Check,
  Terminal,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  HelpCircle,
  CheckCircle2,
  Play,
  Code,
  X,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import JSCompilerModal from './JSCompilerModal';

type Note = {
  type: 'explainer' | 'internal' | 'warning';
  title: string;
  content: string;
};

type InterviewQuestion = {
  question: string;
  answer: string;
};

type Resource = {
  title: string;
  url: string;
};

type SubTopic = {
  id: string;
  title: string;
  description?: string;
  table?: { headers: string[]; rows: any[][] };
};

type Props = {
  id: string;
  index: number;
  title: string;
  description: string;
  notes?: Note[];
  code?: string;
  videoId?: string;
  subTopics?: SubTopic[];
  interviewQuestions?: InterviewQuestion[];
  resources?: Resource[];
};

export default function CategorySection({
  id,
  index,
  title,
  description,
  notes = [],
  code,
  videoId,
  subTopics = [],
  interviewQuestions = [],
  resources = [],
}: Props) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [copying, setCopying] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  const [imageZoom, setImageZoom] = useState(1);
  const [isCompilerOpen, setIsCompilerOpen] = useState(false);
  const [compilerCode, setCompilerCode] = useState('');

  const handleCopy = async (text: string) => {
    setCopying(true);
    setCopyError(false);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopyError(true);
      setTimeout(() => setCopyError(false), 3000);
    } finally {
      setCopying(false);
    }
  };

  const noteStyle = (type: string) => {
    switch (type) {
      case 'warning':
        return {
          backgroundColor: 'var(--note-warning-bg)',
          borderLeftColor: 'var(--note-warning-border)',
        };
      case 'internal':
        return {
          backgroundColor: 'var(--note-internal-bg)',
          borderLeftColor: 'var(--note-internal-border)',
        };
      default:
        return {
          backgroundColor: 'var(--note-explainer-bg)',
          borderLeftColor: 'var(--note-explainer-border)',
        };
    }
  };

  const [isTheaterMode, setIsTheaterMode] = useState(false);

// Handle ESC to exit theater mode
const handleKeyDown = useCallback((e: KeyboardEvent) => {
  if (e.key === 'Escape') setIsTheaterMode(false);
}, []);

useEffect(() => {
  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, [handleKeyDown]);


  return (
    <motion.section
      id={id}
      data-scroll-target
      className="pb-10 md:pb-6 pt-0 scroll-mt-28"
      style={{ borderBottom: '1px solid var(--border-primary)' }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* 1) HEADER */}
      <div className="mb-4">
        <div className="flex items-center gap-3 mb-4">
          {/* <span
            className="text-[10px] font-bold tracking-[0.2em] px-2 py-1 rounded uppercase"
            style={{
              backgroundColor: 'var(--accent-bg)',
              color: 'var(--accent-text)',
            }}
          >
            Module {index}
          </span> */}
          {/* <div className="h-px w-10" style={{ backgroundColor: 'var(--border-primary)' }} /> */}
        </div>

        <h2
          className="text-3xl md:text-3xl flex items-center font-semibold mb-4 tracking-tight"
          style={{ color: 'var(--text-heading)' }}
        >
         {/* <span
            className="text-[10px] font-bold tracking-[0.2em] px-2 py-1 rounded uppercase"
            style={{
              backgroundColor: 'var(--accent-bg)',
              color: 'var(--accent-text)',
            }}
          >
            Module {index}
          </span>  */}
         {/* <div className="h-px w-10" style={{ backgroundColor: 'var(--border-primary)' }} />  */}{title}
        </h2>
        {description ? (
          <div
            onClickCapture={(e) => {
              const target = e.target as HTMLElement;
              if (target.tagName === 'IMG') {
                e.preventDefault();
                setFullscreenImage((target as HTMLImageElement).src);
                setImageZoom(1);
              }
            }}
            className="max-w-2xl text-base leading-relaxed [&_p]:mb-3 [&_p:last-child]:mb-0 [&_ul]:ml-5 [&_ul]:list-disc [&_ol]:ml-5 [&_ol]:list-decimal [&_li]:mb-1 [&_strong]:font-semibold [&_em]:italic [&_h1]:text-2xl [&_h2]:text-xl [&_h3]:text-lg [&_h1]:font-semibold [&_h2]:font-semibold [&_h3]:font-semibold [&_blockquote]:border-l-2 [&_blockquote]:pl-3 [&_img]:cursor-pointer [&_img]:hover:opacity-80 [&_img]:transition-opacity"
            style={{
              color: 'var(--text-tertiary)',
            }}
            dangerouslySetInnerHTML={{ __html: description }}
          />
        ) : null}
      </div>

      {/* 2) SANDBOX */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
{/* Code Block */}
{code && (
  <div
    className="group flex w-full flex-col overflow-hidden rounded-2xl shadow-2xl transition-all duration-500"
    style={{
      border: '1px solid var(--border-primary)',
      backgroundColor: 'var(--code-bg)', // Use code background for the whole container
    }}
  >
    {/* 1. PREMIUM HEADER */}
    <div
      className="flex items-center justify-between px-4 py-3 backdrop-blur-md"
      style={{
        borderBottom: '1px solid var(--code-header-border)',
        backgroundColor: 'var(--code-header-bg)',
      }}
    >
      <div className="flex items-center gap-4">
        {/* macOS Window Controls */}
        <div className="flex gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity hidden sm:flex">
          <div className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]" />
          <div className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
          <div className="h-2.5 w-2.5 rounded-full bg-[#27c93f]" />
        </div>
        
        <div className="flex items-center gap-2 px-2 py-1 rounded-md bg-white/5 border border-white/5">
          <Code size={12} className="text-indigo-400" />
          <span
            className="text-[10px] font-bold tracking-[0.15em] uppercase opacity-70"
            style={{ color: 'var(--text-primary)' }}
          >
            source_code.js
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* RUN BUTTON */}
        <button
          onClick={() => {
            setCompilerCode(code);
            setIsCompilerOpen(true);
          }}
          className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-[11px] font-bold transition-all bg-indigo-500 text-white hover:bg-indigo-400 shadow-lg shadow-indigo-500/20"
        >
          <Play size={10} fill="currentColor" />
          <span>RUN CODE</span>
        </button>

        {/* COPY BUTTON */}
        <button
          onClick={() => handleCopy(code)}
          disabled={copying}
          className="flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-200 hover:bg-white/10"
          style={{
            border: '1px solid var(--border-primary)',
            backgroundColor: 'var(--bg-elevated)',
            color: 'var(--text-muted)',
          }}
          aria-label="Copy code"
        >
          {copying ? (
            <div className="h-3 w-3 animate-spin rounded-full border-2"
              style={{ borderColor: 'var(--border-primary)', borderTopColor: 'var(--text-secondary)' }}
            />
          ) : copied ? (
            <Check size={14} className="text-emerald-400" />
          ) : (
            <Copy size={14} />
          )}
        </button>
      </div>
    </div>

    {/* 2. CODE AREA WITH LINE NUMBERS */}
    <div className="relative flex w-full overflow-hidden font-mono text-[13px] leading-relaxed">
      {/* Line Number Gutter */}
      <div 
        className="flex flex-col border-r px-3 py-5 text-right select-none opacity-20"
        style={{ 
          borderColor: 'var(--border-primary)',
          backgroundColor: 'rgba(0,0,0,0.1)' 
        }}
      >
        {code.split('\n').map((_, i) => (
          <span key={i} className="leading-6">{i + 1}</span>
        ))}
      </div>

      {/* Code Content */}
      <div className="w-full overflow-x-auto">
        <pre className="p-5 leading-6 scrollbar-thin scrollbar-thumb-white/10">
          <code 
            className="block min-w-max text-[var(--code-text)]"
            style={{ fontFamily: '"JetBrains Mono", "Fira Code", monospace' }}
          >
            {code}
          </code>
        </pre>
      </div>
    </div>

    {/* Subtle Language Badge */}
    <div className="absolute bottom-3 right-4 pointer-events-none text-[9px] font-bold uppercase tracking-widest opacity-20">
      JavaScript
    </div>
  </div>
)}

      {/* Video */}
        {videoId && (
          <div
            className="flex h-88 flex-col rounded-xl shadow-sm overflow-hidden"
            style={{
              border: '1px solid var(--border-primary)',
              backgroundColor: 'var(--bg-elevated)',
            }}
          >
            <div
              className="flex items-center gap-2 px-4 py-2.5"
              style={{
                backgroundColor: 'var(--bg-muted)',
                borderBottom: '1px solid var(--border-primary)',
              }}
            >
              <Play size={14} style={{ color: 'var(--text-muted)' }} />
              <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                Video Tutorial
              </span>
            </div>
            <div className="relative aspect-video" style={{ backgroundColor: 'var(--code-bg)' }}>
              <iframe
                className="absolute inset-0 w-full h-full"
                src={`https://www.youtube.com/embed/${videoId}`}
                title="Lesson Video"
                allowFullScreen
              />
            </div>
          </div>
        )}  
      </div>

      {/* 3) NOTES + RESOURCES */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
        <div className="lg:col-span-8 space-y-3">
          <h4
            className="text-[10px] font-bold uppercase tracking-widest mb-4"
            style={{ color: 'var(--text-muted)' }}
          >
            Key Observations
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {notes.map((note, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.02, y: -2 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="p-4 border-l-4 rounded-r-lg shadow-sm"
                style={noteStyle(note.type)}
              >
                <h5
                  className="text-[11px] font-bold uppercase mb-1"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {note.title}
                </h5>
                <p
                  className="text-sm leading-snug"
                  style={{ color: 'var(--text-tertiary)' }}
                >
                  {note.content}
                </p>
              </motion.div>
            ))}

            {notes.length === 0 && (
              <div
                className="p-4 rounded-lg text-sm"
                style={{
                  backgroundColor: 'var(--bg-muted)',
                  color: 'var(--text-muted)',
                }}
              >
                No notes.
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-4">
          <h4
            className="text-[10px] font-bold uppercase tracking-widest mb-4"
            style={{ color: 'var(--text-muted)' }}
          >
            Resources
          </h4>

          {resources && resources.length > 0 ? (
            <div className="space-y-2">
              {resources.map((resource, i) => (
                <a
                  key={i}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 rounded-xl transition-colors group"
                  style={{
                    border: '1px solid var(--border-primary)',
                  }}
                >
                  <div className="flex items-center gap-3">
                    <Terminal size={18} style={{ color: 'var(--text-muted)' }} />
                    <span
                      className="text-sm font-semibold"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {resource.title}
                    </span>
                  </div>
                  <ExternalLink
                    size={14}
                    style={{ color: 'var(--text-muted)' }}
                  />
                </a>
              ))}
            </div>
          ) : (
            <div
              className="p-4 rounded-xl text-sm"
              style={{
                border: '1px solid var(--border-primary)',
                color: 'var(--text-muted)',
              }}
            >
              No resources available
            </div>
          )}
        </div>
      </div>

      {/* 4) SUBTOPICS (with anchors) */}
      {subTopics.length > 0 && (
        <div className="mb-16">
          <h4
            className="text-lg font-semibold mb-6"
            style={{ color: 'var(--text-primary)' }}
          >
            Module Blueprint
          </h4>

          <div className="grid gap-4">
            {subTopics.map((topic) => (
              <div
                key={topic.id}
                id={topic.id}
                data-scroll-target
                className="rounded-xl p-2 scroll-mt-28"
                style={{ backgroundColor: 'var(--subtopic-bg)' }}
              >
                <div className="flex items-start gap-3 mb-2">
                  <ChevronRight size={18} className="text-indigo-500 mt-1" />
                  <h5
                    className="text-base font-bold"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {topic.title}
                  </h5>
                </div>

                {topic.description && (
                  <p
                    className="text-sm mb-4 ml-7"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {topic.description}
                  </p>
                )}

                {topic.table && (
                  <div
                    className="ml-7 overflow-x-auto rounded-lg"
                    style={{ border: '1px solid var(--table-border)' }}
                  >
                    <table className="w-full text-xs text-left">
                      <thead
                        className="font-bold uppercase"
                        style={{
                          backgroundColor: 'var(--table-header-bg)',
                          color: 'var(--table-header-text)',
                        }}
                      >
                        <tr>
                          {topic.table.headers.map((h, i) => (
                            <th key={i} className="px-4 py-2">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody
                        className="divide-y"
                        style={{
                          // @ts-ignore
                          '--tw-divide-opacity': '1',
                        }}
                      >
                        {topic.table.rows.map((row, i) => (
                          <tr
                            key={i}
                            style={{ borderColor: 'var(--table-border)' }}
                          >
                            {row.map((cell, j) => (
                              <td
                                key={j}
                                className="px-4 py-2"
                                style={{
                                  backgroundColor: 'var(--table-cell-bg)',
                                  color: 'var(--text-primary)',
                                }}
                              >
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5) INTERVIEW FAQ */}
      {interviewQuestions.length > 0 && (
        <div
          className="rounded-2xl p-6 md:p-8"
          style={{ backgroundColor: 'var(--faq-bg)' }}
        >
          <div className="flex items-center gap-2 mb-6">
            <HelpCircle size={20} style={{ color: 'var(--text-muted)' }} />
            <h4
              className="text-lg font-bold"
              style={{ color: 'var(--text-primary)' }}
            >
              Interview Readiness
            </h4>
          </div>

          <div className="space-y-2">
            {interviewQuestions.map((qa, i) => (
              <div
                key={i}
                className="rounded-lg overflow-hidden"
                style={{
                  backgroundColor: 'var(--faq-card-bg)',
                  border: '1px solid var(--faq-card-border)',
                }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left transition-colors"
                >
                  <span
                    className="text-[14px] font-semibold"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {qa.question}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${openFaq === i ? 'rotate-180' : ''
                      }`}
                    style={{ color: 'var(--text-muted)' }}
                  />
                </button>

                {openFaq === i && (
                  <div className="px-5 pb-5">
                    <div
                      className="pt-2 flex gap-3 text-sm leading-relaxed"
                      style={{
                        borderTop: '1px solid var(--border-secondary)',
                        color: 'var(--text-tertiary)',
                      }}
                    >
                      <CheckCircle2
                        size={16}
                        className="text-emerald-500 shrink-0 mt-1"
                      />
                      <p>
                        <span
                          className="font-bold"
                          style={{ color: 'var(--text-primary)' }}
                        >
                          Answer:
                        </span>{' '}
                        {qa.answer}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* IMAGE FULLSCREEN MODAL */}
      {fullscreenImage && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={() => setFullscreenImage(null)}
        >
          <div className="relative w-full h-full flex items-center justify-center p-4">
            {/* Close Button */}
            <button
              onClick={() => setFullscreenImage(null)}
              className="absolute top-4 right-4 z-50 p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
              aria-label="Close"
            >
              <X size={24} className="text-white" />
            </button>

            {/* Zoom Controls */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg p-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setImageZoom(Math.max(0.5, imageZoom - 0.2));
                }}
                className="p-2 hover:bg-white/20 rounded transition-colors"
                aria-label="Zoom Out"
              >
                <ZoomOut size={20} className="text-white" />
              </button>

              <span className="text-white text-sm font-medium px-3 min-w-[60px] text-center">
                {Math.round(imageZoom * 100)}%
              </span>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setImageZoom(Math.min(3, imageZoom + 0.2));
                }}
                className="p-2 hover:bg-white/20 rounded transition-colors"
                aria-label="Zoom In"
              >
                <ZoomIn size={20} className="text-white" />
              </button>

              <div className="w-px h-6 bg-white/20 mx-1" />

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setImageZoom(1);
                }}
                className="px-3 py-1 hover:bg-white/20 rounded transition-colors text-white text-sm font-medium"
              >
                Reset
              </button>
            </div>

            {/* Image Container */}
            <div
              className="relative max-w-full max-h-full overflow-auto flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={fullscreenImage}
                alt="Fullscreen view"
                style={{
                  transform: `scale(${imageZoom})`,
                  transition: 'transform 0.2s ease-out',
                }}
                className="max-w-full max-h-full object-contain"
              />
            </div>
          </div>
        </div>
      )}

      {/* JS Live Compiler Modal */}
      <JSCompilerModal
        isOpen={isCompilerOpen}
        onClose={() => setIsCompilerOpen(false)}
        initialCode={compilerCode}
      />
    </motion.section>
  );
}