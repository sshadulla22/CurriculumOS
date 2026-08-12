"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Play,
  CheckCircle2,
  Code2,
  Layers3,
  Rocket,
  Terminal,
} from "lucide-react";

const features = [
  "100+ Structured Lessons",
  "20+ Real-World Projects",
  "Certificate of Completion",
  "Lifetime Learning Access",
];

const sidebarLines = ["100%", "82%", "65%", "90%", "72%"];

const stats = [
  {
    value: "100+",
    label: "Lessons",
    icon: Code2,
  },
  {
    value: "20+",
    label: "Projects",
    icon: Layers3,
  },
  {
    value: "Beginner",
    label: "To Advanced",
    icon: Rocket,
  },
];

const Hero = () => {
  return (
    <section className="relative isolate overflow-hidden bg-[#080b14] pt-28 pb-20 md:pt-36 md:pb-28">
      {/* Background */}
      <div className="absolute inset-0 -z-20">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:64px_64px]" />

        <div className="absolute top-[-200px] left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-indigo-600/20 blur-[140px]" />

        <div className="absolute top-[30%] -left-40 h-[400px] w-[400px] rounded-full bg-blue-600/10 blur-[120px]" />

        <div className="absolute bottom-[-200px] -right-32 h-[500px] w-[500px] rounded-full bg-purple-600/15 blur-[140px]" />
      </div>

      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-6xl">
          {/* Hero Content */}
          <div className="mx-auto max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Badge */}
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-500/10 px-4 py-2 text-sm font-medium text-indigo-300 shadow-lg shadow-indigo-500/5 backdrop-blur">
                <span className="h-2 w-2 animate-pulse rounded-full bg-indigo-400" />

                <span>Complete JavaScript Learning Roadmap</span>
              </div>

              {/* Heading */}
              <h1 className="text-5xl font-bold tracking-[-0.04em] text-white sm:text-6xl md:text-7xl lg:text-8xl">
                Master JavaScript
                <br />

                <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
                  From Fundamentals
                </span>

                <br />

                <span className="text-white">To Advanced.</span>
              </h1>

              {/* Description */}
              <p className="mx-auto mt-8 max-w-2xl text-base leading-8 text-slate-400 sm:text-lg md:text-xl">
                A structured, practical learning journey designed to help you
                understand JavaScript deeply, build real-world projects, and
                become a confident developer.
              </p>
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
            >
              <a
                href="#roadmap"
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-500 px-7 py-4 text-base font-semibold text-white shadow-xl shadow-indigo-500/20 transition-all hover:-translate-y-1 hover:bg-indigo-400 hover:shadow-indigo-500/30 sm:w-auto"
              >
                Start Learning

                <ArrowRight
                  size={19}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              </a>

              <button className="group flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-7 py-4 text-base font-semibold text-white backdrop-blur transition-all hover:border-white/20 hover:bg-white/[0.08] sm:w-auto">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10">
                  <Play
                    size={12}
                    className="ml-[1px] fill-white"
                  />
                </span>

                Watch Overview
              </button>
            </motion.div>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-10 flex flex-wrap justify-center gap-x-7 gap-y-4"
            >
              {features.map((feature) => (
                <div
                  key={feature}
                  className="flex items-center gap-2 text-sm text-slate-400"
                >
                  <CheckCircle2
                    size={17}
                    className="text-indigo-400"
                  />

                  {feature}
                </div>
              ))}
            </motion.div>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mx-auto mt-16 grid max-w-3xl grid-cols-1 gap-3 border-y border-white/[0.07] py-6 sm:grid-cols-3"
          >
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.label}
                  className="flex items-center justify-center gap-3 border-white/[0.07] sm:border-r last:border-r-0"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-indigo-400/10 bg-indigo-500/10">
                    <Icon
                      size={19}
                      className="text-indigo-400"
                    />
                  </div>

                  <div className="text-left">
                    <div className="text-lg font-bold text-white">
                      {stat.value}
                    </div>

                    <div className="text-xs text-slate-500">
                      {stat.label}
                    </div>
                  </div>
                </div>
              );
            })}
          </motion.div>

          {/* Code Editor */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.7,
              delay: 0.5,
              ease: "easeOut",
            }}
            className="relative mx-auto mt-20 max-w-5xl"
          >
            {/* Glow */}
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-indigo-500/20 via-purple-500/10 to-blue-500/20 blur-2xl" />

            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0c101c]/90 shadow-2xl shadow-black/40 backdrop-blur-xl">
              {/* Editor Header */}
              <div className="flex items-center justify-between border-b border-white/[0.07] bg-white/[0.025] px-5 py-4">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-400/80" />
                  <div className="h-3 w-3 rounded-full bg-yellow-400/80" />
                  <div className="h-3 w-3 rounded-full bg-emerald-400/80" />
                </div>

                <div className="hidden items-center gap-2 text-xs text-slate-500 sm:flex">
                  <Terminal size={14} />

                  JavaScript Learning Environment
                </div>

                <div className="text-xs text-slate-600">
                  main.js
                </div>
              </div>

              <div className="flex min-h-[380px]">
                {/* Sidebar */}
                <aside className="hidden w-60 shrink-0 border-r border-white/[0.07] bg-black/20 p-5 md:block">
                  <div className="mb-6 text-xs font-medium uppercase tracking-wider text-slate-600">
                    Learning Path
                  </div>

                  <div className="space-y-4">
                    {[
                      "01. Fundamentals",
                      "02. Functions",
                      "03. Arrays",
                      "04. Objects",
                      "05. Async JavaScript",
                    ].map((item, index) => (
                      <div key={item}>
                        <div
                          className={`mb-2 text-xs ${
                            index === 0
                              ? "text-indigo-400"
                              : "text-slate-500"
                          }`}
                        >
                          {item}
                        </div>

                        <div
                          className="h-1.5 rounded-full bg-white/[0.06]"
                          style={{
                            width: sidebarLines[index],
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </aside>

                {/* Code Area */}
                <div className="flex-1 overflow-hidden">
                  {/* Tabs */}
                  <div className="flex gap-6 border-b border-white/[0.07] px-6 text-sm">
                    <button className="border-b-2 border-indigo-400 py-4 text-indigo-300">
                      learning.js
                    </button>

                    <button className="py-4 text-slate-600">
                      concepts.js
                    </button>

                    <button className="py-4 text-slate-600">
                      projects.js
                    </button>
                  </div>

                  <div className="overflow-x-auto p-6 md:p-8">
                    <pre className="font-mono text-xs leading-7 sm:text-sm">
                      <code className="text-indigo-400">
                        const
                      </code>{" "}
                      <code className="text-white">
                        learningPath
                      </code>{" "}
                      <code className="text-slate-400">=</code>{" "}
                      <code className="text-slate-300">{"{"}</code>
                      {"\n"}

                      {"  "}
                      <code className="text-sky-300">
                        title
                      </code>
                      :{" "}
                      <code className="text-emerald-400">
                        "Mastering JavaScript"
                      </code>
                      ,
                      {"\n"}

                      {"  "}
                      <code className="text-sky-300">
                        level
                      </code>
                      :{" "}
                      <code className="text-emerald-400">
                        "Beginner → Advanced"
                      </code>
                      ,
                      {"\n"}

                      {"  "}
                      <code className="text-sky-300">
                        approach
                      </code>
                      :{" "}
                      <code className="text-emerald-400">
                        "Learn by Building"
                      </code>
                      ,
                      {"\n"}

                      {"  "}
                      <code className="text-sky-300">
                        ready
                      </code>
                      :{" "}
                      <code className="text-purple-400">
                        true
                      </code>
                      ,
                      {"\n"}

                      <code className="text-slate-300">{"}"}</code>
                      ;
                      {"\n\n"}

                      <code className="text-indigo-400">
                        async function
                      </code>{" "}
                      <code className="text-blue-400">
                        startJourney
                      </code>
                      <code className="text-white">
                        (developer)
                      </code>{" "}
                      <code className="text-slate-300">
                        {"{"}
                      </code>
                      {"\n"}

                      {"  "}
                      <code className="text-indigo-400">
                        return
                      </code>{" "}
                      developer
                      <code className="text-slate-400">.</code>
                      learn
                      <code className="text-slate-300">(</code>
                      learningPath
                      <code className="text-slate-300">)</code>
                      ;
                      {"\n"}

                      <code className="text-slate-300">
                        {"}"}
                      </code>
                    </pre>
                  </div>
                </div>
              </div>

              {/* Bottom Status */}
              <div className="flex items-center justify-between border-t border-white/[0.07] bg-black/10 px-5 py-3 text-xs text-slate-600">
                <span>JavaScript • ES2024+</span>

                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />

                  Ready to learn
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;