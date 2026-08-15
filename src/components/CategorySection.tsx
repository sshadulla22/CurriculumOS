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
}: Props) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

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
            className="max-w-2xl text-base leading-relaxed text-slate-600 [&_p]:mb-3 [&_p:last-child]:mb-0 [&_ul]:ml-5 [&_ul]:list-disc [&_ol]:ml-5 [&_ol]:list-decimal [&_li]:mb-1 [&_strong]:font-semibold [&_em]:italic [&_h1]:text-2xl [&_h2]:text-xl [&_h3]:text-lg [&_h1]:font-semibold [&_h2]:font-semibold [&_h3]:font-semibold [&_blockquote]:border-l-2 [&_blockquote]:border-slate-300 [&_blockquote]:pl-3 [&_blockquote]:text-slate-500"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        ) : null}
      </div>

      {/* 2) SANDBOX */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
        {/* Code */}
        {code && (
          <div className="flex flex-col rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Code size={14} className="text-slate-400" />
                <span className="text-xs font-medium text-slate-500">
                  source_code.js
                </span>
              </div>
              <button
                onClick={() => handleCopy(code)}
                className="text-slate-400 hover:text-slate-600"
                aria-label="Copy code"
              >
                {copied ? (
                  <Check size={14} className="text-emerald-500" />
                ) : (
                  <Copy size={14} />
                )}
              </button>
            </div>

            <pre className="p-5 text-[13px] font-mono overflow-x-auto leading-relaxed bg-slate-950 text-slate-200">
              <code>{code}</code>
            </pre>
          </div>
        )}

        {/* Video */}
        {videoId && (
          <div className="flex flex-col rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
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

          <a
            href="#"
            className="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <Terminal size={18} className="text-slate-400" />
              <span className="text-sm font-semibold text-slate-700">
                MDN Documentation
              </span>
            </div>
            <ExternalLink
              size={14}
              className="text-slate-300 group-hover:text-slate-600"
            />
          </a>
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
    </section>
  );
}