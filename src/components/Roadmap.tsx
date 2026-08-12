import { motion } from 'framer-motion';
import { Sparkles, Terminal, Layers, Globe, Zap, Database, Code2 } from 'lucide-react';

const steps = [
  {
    title: "Level 1: Core JavaScript",
    description: "Fundamentals, Variables, Data Types, Operators, Control Flow, Functions, Arrays, and Objects.",
    icon: <Terminal className="w-6 h-6" />,
    color: "bg-blue-500",
  },
  {
    title: "Level 2: Intermediate JS",
    description: "Scope, Hoisting, Execution Context, Call Stack, Closures, this, and call/apply/bind.",
    icon: <Layers className="w-6 h-6" />,
    color: "bg-indigo-500",
  },
  {
    title: "Level 3: Modern JavaScript",
    description: "ES6+, Destructuring, Spread/Rest, Optional Chaining, Modules, and Classes.",
    icon: <Sparkles className="w-6 h-6" />,
    color: "bg-purple-500",
  },
  {
    title: "Level 4: Async JavaScript",
    description: "Callbacks, Promises, async/await, Promise.all, Event Loop, and Task Queues.",
    icon: <Zap className="w-6 h-6" />,
    color: "bg-pink-500",
  },
  {
    title: "Level 5: Browser & DOM",
    description: "DOM, Events, Event Bubbling, Delegation, Browser Storage, and Cookies.",
    icon: <Globe className="w-6 h-6" />,
    color: "bg-orange-500",
  },
  {
    title: "Level 6: Professional JS",
    description: "API Networking, Error Handling, Authentication, Security, and Performance.",
    icon: <Database className="w-6 h-6" />,
    color: "bg-emerald-500",
  },
  {
    title: "Level 7: Advanced Concepts",
    description: "Prototype Chain, OOP, Functional Programming, Design Patterns, and Optimization.",
    icon: <Code2 className="w-6 h-6" />,
    color: "bg-red-500",
  }
];

const Roadmap = () => {
  return (
    <section id="roadmap" className="py-24 bg-gray-950/50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">The Complete Roadmap</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            A step-by-step path from your first console.log() to building full-stack production applications.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Vertical Line */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-500 via-purple-500 to-transparent -translate-x-1/2" />

          <div className="space-y-12">
            {steps.map((step, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`flex flex-col md:flex-row items-center gap-8 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
              >
                <div className="flex-1 text-center md:text-left">
                  <div className={`inline-flex items-center justify-center p-3 rounded-2xl ${step.color} bg-opacity-10 mb-4 border border-white/5`}>
                     <div className={step.color.replace('bg-', 'text-')}>
                        {step.icon}
                     </div>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-gray-400">{step.description}</p>
                </div>

                <div className="relative z-10 w-10 h-10 rounded-full bg-gray-900 border-4 border-indigo-600 flex items-center justify-center shadow-[0_0_20px_rgba(79,70,229,0.3)]">
                  <span className="text-sm font-bold text-white">{index + 1}</span>
                </div>

                <div className="flex-1" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Roadmap;
