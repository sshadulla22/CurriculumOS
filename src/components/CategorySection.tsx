import React, { useState } from 'react';
import {
  Copy, Check, Terminal, Microchip, AlertCircle,
  Info, ChevronRight, ExternalLink, ChevronDown, 
  HelpCircle, CheckCircle2, Play, Code
} from 'lucide-react';

export default function CategorySection({
  id, index, title, description, notes, code, videoId, subTopics, interviewQuestions
}) {
  const [openFaq, setOpenFaq] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = async (text) => {
    await navigator.clipboard.writeText(text.replace(/<[^>]+>/g, ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id={id} className="py-16 md:py-24 border-b border-slate-200 scroll-mt-10">
      
      {/* 1. TOP HEADER: Simple & Direct */}
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
        <p className="text-base text-slate-600 leading-relaxed max-w-2xl">
          {description}
        </p>
      </div>

      {/* 2. SANDBOX: Code & Video side-by-side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
        
        {/* Code Frame */}
        {code && (
          <div className="flex flex-col rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Code size={14} className="text-slate-400" />
                <span className="text-xs font-medium text-slate-500">source_code.js</span>
              </div>
              <button onClick={() => handleCopy(code)} className="text-slate-400 hover:text-slate-600">
                {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
              </button>
            </div>
            <pre className="p-5 text-[13px] font-mono text-slate-700 overflow-x-auto leading-relaxed">
              <code dangerouslySetInnerHTML={{ __html: code }} />
            </pre>
          </div>
        )}

        {/* Video Frame */}
        {videoId && (
          <div className="flex flex-col rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border-b border-slate-200">
              <Play size={14} className="text-slate-400" />
              <span className="text-xs font-medium text-slate-500">Video Tutorial</span>
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

      {/* 3. NOTES & EXTERNAL LINKS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
        <div className="lg:col-span-8 space-y-3">
          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Key Observations</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {notes?.map((note, i) => (
              <div key={i} className={`p-4 border-l-4 ${
                note.type === 'warning' ? 'bg-rose-50 border-rose-400' : 
                note.type === 'internal' ? 'bg-emerald-50 border-emerald-400' : 'bg-slate-50 border-slate-400'
              }`}>
                <h5 className="text-[11px] font-bold text-slate-900 uppercase mb-1">{note.title}</h5>
                <p className="text-sm text-slate-600 leading-snug">{note.content}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4">
          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Resources</h4>
          <a href="#" className="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors group">
            <div className="flex items-center gap-3">
              <Terminal size={18} className="text-slate-400" />
              <span className="text-sm font-semibold text-slate-700">MDN Documentation</span>
            </div>
            <ExternalLink size={14} className="text-slate-300 group-hover:text-slate-600" />
          </a>
        </div>
      </div>

      {/* 4. SUBTOPICS: Minimal Table */}
      {subTopics && (
        <div className="mb-16 ">
          <h4 className="text-lg font-semibold text-black mb-6">Module Blueprint</h4>
          <div className="grid  gap-4">
            {subTopics.map((topic) => (
              <div key={topic.id} className=" rounded-xl bg-gray-50 p-2  hover:border-slate-300 transition-all">
                <div className="flex items-start gap-3 mb-2">
                  <ChevronRight size={18} className="text-indigo-500 mt-1" />
                  <h5 className="text-base font-bold text-slate-900">{topic.title}</h5>
                </div>
                <p className="text-sm text-slate-700 mb-4 ml-7">{topic.description}</p>
                {topic.table && (
                  <div className="ml-7 overflow-x-auto rounded-lg border border-slate-300">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-200 text-slate-800 font-bold uppercase">
                        <tr>{topic.table.headers.map((h, i) => <th key={i} className="px-4 py-2">{h}</th>)}</tr>
                      </thead>
                      <tbody className="divide-y divide-slate-300">
                        {topic.table.rows.map((row : any, i) => (
                          <tr key={i}>{row.map((cell : any, j) => <td key={j} className="px-4 py-2 bg-white text-slate-900">{cell}</td>)}</tr>
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

      {/* 5. INTERVIEW FAQ: Simple Accordion */}
      {interviewQuestions && (
        <div className="bg-slate-50 rounded-2xl p-6 md:p-8">
          <div className="flex items-center gap-2 mb-6">
            <HelpCircle size={20} className="text-slate-400" />
            <h4 className="text-lg font-bold text-slate-900">Interview Readiness</h4>
          </div>
          <div className="space-y-2">
            {interviewQuestions.map((qa, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                <button 
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-slate-50 transition-colors"
                >
                  <span className="text-[14px] font-semibold text-slate-700">{qa.question}</span>
                  <ChevronDown size={16} className={`text-slate-400 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 animate-in fade-in duration-200">
                    <div className="pt-2 border-t border-slate-100 flex gap-3 text-sm leading-relaxed text-slate-600">
                      <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-1" />
                      <p><span className="font-bold text-slate-900">Answer:</span> {qa.answer}</p>
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