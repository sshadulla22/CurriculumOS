import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Terminal, Code2 } from 'lucide-react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';

interface JSCompilerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCode?: string;
}

interface Log {
  type: 'log' | 'error' | 'warn' | 'info';
  message: string;
}

export default function JSCompilerModal({ isOpen, onClose, initialCode = '' }: JSCompilerModalProps) {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState<Log[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const workerRef = useRef<Worker | null>(null);
  
  // Sync code when modal opens
  useEffect(() => {
    if (isOpen && initialCode) {
      setCode(initialCode);
      setOutput([]);
    }
  }, [isOpen, initialCode]);

  // Clean up worker on close
  useEffect(() => {
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, []);

  const executeCode = () => {
    if (workerRef.current) {
      workerRef.current.terminate();
    }
    
    setOutput([]);
    setIsRunning(true);

    const workerScript = `
      // Sandbox console
      const originalConsole = console;
      const formatMsg = (args) => args.map(a => {
        if (a === null) return 'null';
        if (a === undefined) return 'undefined';
        if (typeof a === 'object') {
          try {
            return JSON.stringify(a, null, 2);
          } catch(e) {
            return String(a);
          }
        }
        return String(a);
      }).join(' ');

      console = {
        log: (...args) => postMessage({ type: 'log', message: formatMsg(args) }),
        error: (...args) => postMessage({ type: 'error', message: formatMsg(args) }),
        warn: (...args) => postMessage({ type: 'warn', message: formatMsg(args) }),
        info: (...args) => postMessage({ type: 'info', message: formatMsg(args) })
      };

      self.onmessage = async function(e) {
        try {
          // Allow async/await execution at top level by wrapping in async IIFE
          const asyncWrapper = "(async () => { \\n" + e.data + "\\n })();";
          const result = await eval(asyncWrapper);
          // If the script returns a value, we don't necessarily need to print it, 
          // but we will post a completion message.
          postMessage({ type: 'system', message: 'Execution completed.' });
        } catch (err) {
          postMessage({ type: 'error', message: err.toString() });
        }
      };
    `;

    const blob = new Blob([workerScript], { type: 'application/javascript' });
    const worker = new Worker(URL.createObjectURL(blob));
    workerRef.current = worker;

    worker.onmessage = (e) => {
      if (e.data.type === 'system') {
        setIsRunning(false);
      } else {
        setOutput((prev) => [...prev, e.data]);
      }
    };

    worker.onerror = (err) => {
      setOutput((prev) => [...prev, { type: 'error', message: err.message }]);
      setIsRunning(false);
    };

    worker.postMessage(code);

    // Safety timeout for infinite loops (5 seconds max)
    setTimeout(() => {
      if (workerRef.current === worker) {
        worker.terminate();
        setOutput((prev) => [...prev, { type: 'error', message: 'Execution Timeout: Script took longer than 5 seconds.' }]);
        setIsRunning(false);
      }
    }, 5000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 backdrop-blur-sm"
            style={{ backgroundColor: 'var(--bg-backdrop)' }}
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden rounded-xl shadow-2xl glass-panel"
            style={{ backgroundColor: 'var(--bg-primary)' }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-4 py-3 shrink-0"
              style={{ borderBottom: '1px solid var(--border-secondary)' }}
            >
              <div className="flex items-center gap-2">
                <Code2 size={18} className="text-indigo-500" />
                <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                  JS Playground
                </h3>
              </div>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={executeCode}
                  disabled={isRunning}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md bg-indigo-600 text-white hover:bg-indigo-500 transition-colors disabled:opacity-50"
                >
                  <Play size={14} className={isRunning ? "animate-pulse" : ""} />
                  {isRunning ? 'Running...' : 'Run Code'}
                </button>
                <div className="h-4 w-px" style={{ backgroundColor: 'var(--border-secondary)' }} />
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-md hover:bg-white/10 transition-colors"
                  style={{ color: 'var(--text-muted)' }}
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Split View */}
            <div className="flex-1 flex flex-col lg:flex-row min-h-0">
              {/* Editor Pane */}
              <div className="flex-1 lg:border-r" style={{ borderColor: 'var(--border-secondary)' }}>
                <div className="h-full overflow-y-auto">
                  <CodeMirror
                    value={code}
                    height="100%"
                    extensions={[javascript({ jsx: false })]}
                    onChange={(value) => setCode(value)}
                    theme="dark"
                    className="h-full text-base [&_.cm-editor]:h-full"
                  />
                </div>
              </div>

              {/* Output Pane */}
              <div className="flex-1 flex flex-col bg-[#09090b] text-zinc-300">
                <div className="flex items-center gap-2 px-4 py-2 border-b border-zinc-800 shrink-0 bg-[#09090b]">
                  <Terminal size={14} className="text-zinc-500" />
                  <span className="text-xs font-medium text-zinc-400">Console Output</span>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 font-mono text-[13px] leading-relaxed space-y-2">
                  {output.length === 0 && (
                    <span className="text-zinc-600 italic">No output yet. Click "Run Code" to execute.</span>
                  )}
                  {output.map((log, i) => (
                    <div 
                      key={i} 
                      className={`break-words whitespace-pre-wrap ${
                        log.type === 'error' ? 'text-red-400 bg-red-400/10 px-2 py-1 rounded' : 
                        log.type === 'warn' ? 'text-yellow-400' : ''
                      }`}
                    >
                      {log.message}
                    </div>
                  ))}
                  {isRunning && (
                    <div className="flex gap-1 items-center text-zinc-500">
                      <span className="animate-bounce">.</span>
                      <span className="animate-bounce" style={{ animationDelay: '150ms' }}>.</span>
                      <span className="animate-bounce" style={{ animationDelay: '300ms' }}>.</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
