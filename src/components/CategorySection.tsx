import React, { useState } from 'react';
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
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  const [imageZoom, setImageZoom] = useState(1);

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section
      id={id}
      className="py-16 md:py-24 border-b border-slate-200 scroll-mt-28"
    >
      {/* 1) HEADER */}
      <div className="max-w-4xl mb-12">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-[10px] font-bold tracking-[0.2em] text-indigo-600 bg-indigo-50 px-2 py-1 rounded uppercase">
            Module {index}
          </span>
          <div className="h-px w-10 bg-slate-200" />
        </div>

        <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 mb-4 tracking-tight">
          {title}
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
            className="max-w-2xl text-base leading-relaxed text-slate-600 [&_p]:mb-3 [&_p:last-child]:mb-0 [&_ul]:ml-5 [&_ul]:list-disc [&_ol]:ml-5 [&_ol]:list-decimal [&_li]:mb-1 [&_strong]:font-semibold [&_em]:italic [&_h1]:text-2xl [&_h2]:text-xl [&_h3]:text-lg [&_h1]:font-semibold [&_h2]:font-semibold [&_h3]:font-semibold [&_blockquote]:border-l-2 [&_blockquote]:border-slate-300 [&_blockquote]:pl-3 [&_blockquote]:text-slate-500 [&_img]:cursor-pointer [&_img]:hover:opacity-80 [&_img]:transition-opacity"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        ) : null}
      </div>

      {/* 2) SANDBOX */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
        {/* Code */}
        {code && (
          <div className="flex w-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-100 px-4 py-2.5">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-200 text-slate-600">
                  <Code size={12} />
                </div>
                <span className="text-[11px] font-semibold tracking-[0.12em] text-slate-600 uppercase">
                  source_code.js
                </span>
              </div>
              <button
                onClick={() => handleCopy(code)}
                className="flex items-center justify-center rounded-lg border border-slate-200 bg-white p-2 text-slate-500 transition hover:border-slate-300 hover:text-slate-700"
                aria-label="Copy code"
              >
                {copied ? (
                  <Check size={14} className="text-emerald-500" />
                ) : (
                  <Copy size={14} />
                )}
              </button>
            </div>

            <div className="w-full overflow-x-auto bg-[#0f172a]">
              <pre className="min-h-[220px] w-full overflow-x-auto p-3 text-[12.5px] leading-6 text-slate-200 md:min-h-[240px] md:p-4">
                <code className="block min-w-max font-mono">{code}</code>
              </pre>
            </div>
          </div>
        )}

        {/* Video */}
        {videoId && (
          <div className="flex h-88 flex-col rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border-b border-slate-200">
              <Play size={14} className="text-slate-400" />
              <span className="text-xs font-medium text-slate-500">
                Video Tutorial
              </span>
            </div>
            <div className="relative aspect-video bg-slate-900">
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
          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
            Key Observations
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {notes.map((note, i) => (
              <div
                key={i}
                className={`p-4 border-l-4 ${
                  note.type === 'warning'
                    ? 'bg-rose-50 border-rose-400'
                    : note.type === 'internal'
                      ? 'bg-emerald-50 border-emerald-400'
                      : 'bg-slate-50 border-slate-400'
                }`}
              >
                <h5 className="text-[11px] font-bold text-slate-900 uppercase mb-1">
                  {note.title}
                </h5>
                <p className="text-sm text-slate-600 leading-snug">
                  {note.content}
                </p>
              </div>
            ))}

            {notes.length === 0 && (
              <div className="p-4 rounded-lg bg-slate-50 text-sm text-slate-500">
                No notes.
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-4">
          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
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
                  className="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <Terminal size={18} className="text-slate-400" />
                    <span className="text-sm font-semibold text-slate-700">
                      {resource.title}
                    </span>
                  </div>
                  <ExternalLink
                    size={14}
                    className="text-slate-300 group-hover:text-slate-600"
                  />
                </a>
              ))}
            </div>
          ) : (
            <div className="p-4 rounded-xl border border-slate-200 text-sm text-slate-500">
              No resources available
            </div>
          )}
        </div>
      </div>

      {/* 4) SUBTOPICS (with anchors) */}
      {subTopics.length > 0 && (
        <div className="mb-16">
          <h4 className="text-lg font-semibold text-black mb-6">
            Module Blueprint
          </h4>

          <div className="grid gap-4">
            {subTopics.map((topic) => (
              <div
                key={topic.id}
                id={topic.id} // ✅ anchor for sidebar subtopic links
                className="rounded-xl bg-gray-50 p-2 scroll-mt-28"
              >
                <div className="flex items-start gap-3 mb-2">
                  <ChevronRight size={18} className="text-indigo-500 mt-1" />
                  <h5 className="text-base font-bold text-slate-900">
                    {topic.title}
                  </h5>
                </div>

                {topic.description && (
                  <p className="text-sm text-slate-700 mb-4 ml-7">
                    {topic.description}
                  </p>
                )}

                {topic.table && (
                  <div className="ml-7 overflow-x-auto rounded-lg border border-slate-300">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-200 text-slate-800 font-bold uppercase">
                        <tr>
                          {topic.table.headers.map((h, i) => (
                            <th key={i} className="px-4 py-2">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-300">
                        {topic.table.rows.map((row, i) => (
                          <tr key={i}>
                            {row.map((cell, j) => (
                              <td
                                key={j}
                                className="px-4 py-2 bg-white text-slate-900"
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
        <div className="bg-slate-50 rounded-2xl p-6 md:p-8">
          <div className="flex items-center gap-2 mb-6">
            <HelpCircle size={20} className="text-slate-400" />
            <h4 className="text-lg font-bold text-slate-900">
              Interview Readiness
            </h4>
          </div>

          <div className="space-y-2">
            {interviewQuestions.map((qa, i) => (
              <div
                key={i}
                className="bg-white border border-slate-200 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-slate-50 transition-colors"
                >
                  <span className="text-[14px] font-semibold text-slate-700">
                    {qa.question}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`text-slate-400 transition-transform ${
                      openFaq === i ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {openFaq === i && (
                  <div className="px-5 pb-5">
                    <div className="pt-2 border-t border-slate-100 flex gap-3 text-sm leading-relaxed text-slate-600">
                      <CheckCircle2
                        size={16}
                        className="text-emerald-500 shrink-0 mt-1"
                      />
                      <p>
                        <span className="font-bold text-slate-900">Answer:</span>{' '}
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
    </section>
  );
}