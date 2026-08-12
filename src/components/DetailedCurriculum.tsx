import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Code, BookOpen, Lightbulb, Target } from 'lucide-react';

const curriculum = [
  {
    level: "Level 1: Core JavaScript",
    topics: [
      {
        id: 1,
        title: "JavaScript Fundamentals",
        content: "Understand the V8 engine, runtime, and JIT compilation. How JS executes internally.",
        code: `console.log("Hello JavaScript");`
      },
      {
        id: 2,
        title: "Variables & Data Types",
        content: "Deep dive into var, let, const. Primitive vs Non-primitive types.",
        code: `let name = "Shadulla";\nconst age = 25;`
      },
      {
        id: 3,
        title: "Operators",
        content: "Arithmetic, Comparison (== vs ===), Logical, and Modern operators (??, ?.).",
        code: `"5" == 5; // true\n"5" === 5; // false`
      },
      {
        id: 4,
        title: "Control Flow",
        content: "If/else, switch, and all loop types (for...of, for...in).",
        code: `for (let item of array) { ... }`
      }
    ]
  },
  {
    level: "Level 2: Intermediate JS",
    topics: [
      {
        id: 8,
        title: "Scope & Hoisting",
        content: "Global, Function, and Block scope. Memory allocation phase vs Execution phase.",
        code: `console.log(name);\nvar name = "John"; // Hoisted`
      },
      {
        id: 9,
        title: "Closures",
        content: "Functions remembering their outer scope even after the outer function has finished.",
        code: `function outer() {\n  let count = 0;\n  return () => count++;\n}`
      },
      {
        id: 13,
        title: "The 'this' Keyword",
        content: "Binding rules: Global, Object method, Regular function, Arrow, and Constructor.",
        code: `const user = {\n  greet() { console.log(this.name); }\n};`
      }
    ]
  },
  {
    level: "Level 4: Async JavaScript",
    topics: [
      {
        id: 20,
        title: "Async/Await & Promises",
        content: "The evolution from Callbacks to Promises to modern Async/Await syntax.",
        code: `async function getData() {\n  const data = await fetch(url);\n}`
      },
      {
        id: 22,
        title: "Event Loop",
        content: "Microtasks vs Macrotasks. How JS handles async operations single-handedly.",
        code: `// Promise.then -> Microtask\n// setTimeout -> Macrotask`
      }
    ]
  },
  {
    level: "Level 6: Professional JS",
    topics: [
      {
        id: 23,
        title: "API & Networking",
        content: "HTTP methods, status codes, headers, CORS, and Authentication flows.",
        code: `const res = await fetch(url, { method: 'POST' });`
      },
      {
        id: 28,
        title: "Performance",
        content: "Debouncing, Throttling, Memoization, and Lazy Loading.",
        code: `const debounced = debounce(fn, 300);`
      }
    ]
  }
];

const DetailedCurriculum = () => {
  const [activeLevel, setActiveLevel] = useState(0);

  return (
    <section id="curriculum" className="py-24 bg-gray-900/30">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Deep Dive Curriculum</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Explore the specific topics covered in each level of the roadmap.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Level Tabs */}
          <div className="lg:w-1/3 flex flex-col gap-2">
            {curriculum.map((level, idx) => (
              <button
                key={idx}
                onClick={() => setActiveLevel(idx)}
                className={`flex items-center justify-between p-5 rounded-2xl transition-all text-left ${
                  activeLevel === idx 
                  ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/20' 
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                <span className="font-bold">{level.level}</span>
                <ChevronRight className={`transition-transform ${activeLevel === idx ? 'rotate-90' : ''}`} />
              </button>
            ))}
          </div>

          {/* Topic Details */}
          <div className="lg:w-2/3 min-h-[500px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeLevel}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {curriculum[activeLevel].topics.map((topic) => (
                  <div key={topic.id} className="glass-card p-6 border-white/5">
                    <div className="flex items-start gap-4">
                      <div className="bg-indigo-500/10 p-3 rounded-xl">
                        <BookOpen className="text-indigo-400 w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-xl font-bold text-white">{topic.title}</h3>
                          <span className="text-xs font-mono text-gray-500">#{topic.id}</span>
                        </div>
                        <p className="text-gray-400 mb-4">{topic.content}</p>
                        
                        <div className="bg-gray-950 rounded-xl p-4 font-mono text-sm overflow-x-auto border border-white/5">
                          <div className="flex gap-2 mb-2 opacity-30">
                             <div className="w-2 h-2 rounded-full bg-red-500" />
                             <div className="w-2 h-2 rounded-full bg-yellow-500" />
                             <div className="w-2 h-2 rounded-full bg-green-500" />
                          </div>
                          <code className="text-indigo-300">{topic.code}</code>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                   <div className="bg-white/5 p-4 rounded-xl flex items-center gap-3">
                      <Target className="text-emerald-400 w-5 h-5" />
                      <span className="text-sm text-gray-300">Predict Output</span>
                   </div>
                   <div className="bg-white/5 p-4 rounded-xl flex items-center gap-3">
                      <Lightbulb className="text-yellow-400 w-5 h-5" />
                      <span className="text-sm text-gray-300">Real-world Use</span>
                   </div>
                   <div className="bg-white/5 p-4 rounded-xl flex items-center gap-3">
                      <Code className="text-blue-400 w-5 h-5" />
                      <span className="text-sm text-gray-300">React Connection</span>
                   </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DetailedCurriculum;
