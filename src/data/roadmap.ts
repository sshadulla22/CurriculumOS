export interface RoadmapSubTopic {
  id: string;
  title: string;
  description: string;
  code?: string;
  table?: {
    headers: string[];
    rows: string[][];
  };
}

export interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  videoId?: string;
  notes?: {
    type: 'explainer' | 'internal' | 'warning';
    title: string;
    content: string;
  }[];
  code?: string;
  subTopics?: RoadmapSubTopic[];
  interviewQuestions?: any[]
}

export const ROADMAP_DATA: RoadmapItem[] = [
  {
    id: 'fundamental',
    title: 'What JavaScript Is',
    description:
      'JavaScript is a high-level, dynamically typed language that runs in the browser (and on the server via Node). It is single-threaded, event-driven, and compiled just-in-time by engines like V8 (Chrome, Node) and SpiderMonkey (Firefox).',
    videoId: 'hG9J_wD1aB4',
    notes: [
      {
        type: 'internal',
        title: 'Runtime',
        content:
          'JS itself is single-threaded. Concurrency comes from the Event Loop, Web APIs (browser), and libuv (Node) — not from extra JS threads.',
      },
      {
        type: 'explainer',
        title: 'JIT in one line',
        content:
          'The engine parses source → bytecode → hot paths get compiled to native machine code at runtime. That is Just-In-Time compilation.',
      },
    ],
    code: `// The engine reads this, compiles it, then runs it.
console.log("Hello, JavaScript");

// typeof is an operator, not a function
typeof 42;          // "number"
typeof "hi";        // "string"
typeof undefined;   // "undefined"`,
    subTopics: [
      {
        id: 'js-history',
        title: 'Where it runs',
        description:
          'Browser (DOM, fetch, Web APIs), Node.js (fs, http, process), Deno, Bun, and embedded runtimes. The language is ECMAScript; “JavaScript” is the implementation.',
        table: {
          headers: ['Layer', 'What it is'],
          rows: [
            ['ECMAScript', 'The language spec (ES5, ES6 / ES2015, ES2024…)'],
            ['JavaScript', 'The language people write'],
            ['Engine', 'V8, SpiderMonkey, JavaScriptCore'],
            ['Runtime', 'Browser or Node — APIs around the engine'],
          ],
        },
      },
      {
        id: 'interpreted-vs-compiled',
        title: 'Interpreted vs compiled vs JIT',
        description:
          'Classic interpreters execute line by line. Compilers turn the whole program into machine code first. JS engines do both: parse quickly, then JIT-compile hot functions so repeated work is fast.',
        code: `// First call: parse + interpret (or baseline compile)
// Later calls of hot functions: optimized native code
function add(a, b) {
  return a + b;
}

for (let i = 0; i < 1e6; i++) add(i, i + 1);`,
      },
      {
        id: 'single-thread',
        title: 'Single-threaded model',
        description:
          'One call stack. Long synchronous work blocks painting and input. Offload with async APIs, workers, or break work into chunks.',
        code: `// This freezes the tab — never do this for heavy work
function block(ms) {
  const end = Date.now() + ms;
  while (Date.now() < end) {}
}

// Do this instead
setTimeout(() => console.log("later"), 0);
console.log("now");`,
      },
    ],

    interviewQuestions: [
    { 
      question: "What is the JS Engine vs. Runtime?", 
      answer: "The Engine (V8) parses and runs the code; the Runtime (Browser) provides APIs like the DOM and Event Loop to make it useful." 
    },
    { 
      question: "Explain JIT Compilation.", 
      answer: "It is a performance strategy where the engine compiles 'hot' functions into native machine code while the script is running." 
    },
    { 
      question: "How is JS single-threaded but non-blocking?", 
      answer: "JS executes one task at a time, but offloads slow tasks (like fetch) to the browser runtime, which signals JS back when finished." 
    },
    { 
      question: "What is the Call Stack?", 
      answer: "A LIFO structure that tracks where the program is. Every function call adds a frame; returning removes it." 
    },
    { 
      question: "What causes a Stack Overflow?", 
      answer: "When a function calls itself too many times without stopping, exceeding the Call Stack's memory limit." 
    },
    { 
      question: "What is the Heap?", 
      answer: "A large, unstructured memory area where objects, arrays, and closures are stored for long-term use." 
    },
    { 
      question: "Explain Garbage Collection.", 
      answer: "A process that automatically deletes objects from the Heap that are no longer 'reachable' from the root of the program." 
    },
    { 
      question: "What is an AST?", 
      answer: "Abstract Syntax Tree: A tree representation of code that engines use to understand syntax before converting it to bytecode." 
    },
    { 
      question: "Is JavaScript an interpreted language?", 
      answer: "Technically yes, but modern engines use JIT compilation to make it run at speeds nearly identical to compiled languages." 
    },
    { 
      question: "What is 'Hoisting'?", 
      answer: "A behavior where the engine moves declarations to the top of the scope during the memory allocation phase." 
    }
]
  },

  {
    id: 'variables-types',
    title: 'Variables & Data Types',
    description:
      'Values are either primitives (copied by value) or objects (copied by reference). How you declare a binding — var, let, const — controls scope, hoisting, and reassignment.',
    notes: [
      {
        type: 'warning',
        title: 'Prefer const',
        content:
          'Default to const. Use let only when you reassign. Avoid var in new code — function scope and hoisting make bugs easy.',
      },
    ],
    subTopics: [
      {
        id: 'var-let-const',
        title: 'var, let, const',
        description:
          'var is function-scoped and hoisted as undefined. let and const are block-scoped and live in the Temporal Dead Zone until their line runs. const cannot be reassigned (the binding is fixed; object contents can still change).',
        table: {
          headers: ['', 'var', 'let', 'const'],
          rows: [
            ['Scope', 'Function', 'Block', 'Block'],
            ['Hoisted', 'Yes (undefined)', 'TDZ', 'TDZ'],
            ['Reassign', 'Yes', 'Yes', 'No'],
            ['Redeclare', 'Yes', 'No', 'No'],
          ],
        },
        code: `const user = { name: "Ada" };
user.name = "Grace";   // ok — object mutated
// user = {};          // TypeError — binding is const

if (true) {
  let x = 1;
  var y = 2;
}
// x is gone here
// y is still 2`,
      },
      {
        id: 'primitives',
        title: 'Seven primitives',
        description:
          'string, number, boolean, null, undefined, bigint, symbol. Primitives are immutable. Everything else is an object (including arrays, functions, dates).',
        table: {
          headers: ['Type', 'Example', 'typeof'],
          rows: [
            ['string', '"hi"', '"string"'],
            ['number', '42, NaN, Infinity', '"number"'],
            ['boolean', 'true / false', '"boolean"'],
            ['undefined', 'let x;', '"undefined"'],
            ['null', 'null', '"object"  ← historical bug'],
            ['bigint', '10n', '"bigint"'],
            ['symbol', 'Symbol("id")', '"symbol"'],
          ],
        },
        code: `typeof null;          // "object"  — known bug, do not rely on it
Number.isNaN(NaN);    // true      — use this, not isNaN()
Number.isFinite(10);  // true`,
      },
      {
        id: 'objects-ref',
        title: 'Objects are references',
        description:
          'Assigning an object copies the pointer, not the data. Mutating through one variable is visible through the other. Compare objects with care — === checks identity, not shape.',
        code: `const a = { n: 1 };
const b = a;
b.n = 2;
console.log(a.n);     // 2

const c = { n: 2 };
a === c;              // false — different objects`,
      },
      {
        id: 'type-coercion',
        title: 'Type coercion',
        description:
          'JS converts types implicitly with ==, +, and if. That is why "5" == 5 is true and [] + {} looks cursed. Prefer === and Number / String / Boolean when you convert on purpose.',
        code: `"5" == 5;     // true   — coerced
"5" === 5;    // false  — no coerce

Number("08"); // 8
Boolean("");  // false  — falsy: "", 0, -0, NaN, null, undefined, false
Boolean("0"); // true   — non-empty string`,
      },
    ],
  },

  {
    id: 'operators',
    title: 'Operators',
    description:
      'Arithmetic, comparison, logical, assignment, and bitwise. The ones that bite people are == vs ===, ?? vs ||, and optional chaining.',
    subTopics: [
      {
        id: 'equality',
        title: '== vs ===',
        description:
          '=== compares type and value. == coerces first (null == undefined is true; "0" == 0 is true). Always use === unless you specifically want nullish equality.',
        code: `0 == false;      // true
0 === false;     // false
null == undefined;  // true
null === undefined; // false`,
      },
      {
        id: 'logical-nullish',
        title: '||, &&, ??, ?.',
        description:
          '|| returns the first truthy value. ?? returns the first defined value (only skips null and undefined). ?. stops if the left side is nullish.',
        table: {
          headers: ['Expr', 'When 0 / ""', 'When null'],
          rows: [
            ['a || "default"', 'uses default', 'uses default'],
            ['a ?? "default"', 'keeps 0 / ""', 'uses default'],
            ['a?.b', 'reads b', 'undefined, no throw'],
          ],
        },
        code: `const port = 0;
port || 3000;   // 3000  — 0 is falsy
port ?? 3000;   // 0     — 0 is defined

user?.profile?.email;
user?.save?.();`,
      },
      {
        id: 'arithmetic',
        title: 'Arithmetic & assignment',
        description:
          '+ adds numbers or concatenates strings. Mixing them is a common bug. **, %, ++, --, and compound assignment (+=) work as expected.',
        code: `1 + "2";     // "12"
1 + 2 + "3"; // "33"
"3" + 1 + 2; // "312"

2 ** 10;     // 1024
10 % 3;      // 1`,
      },
    ],
  },

  {
    id: 'control-flow',
    title: 'Control Flow',
    description:
      'if / else, switch, ternary, and loops. Prefer early returns over deep nesting. Know which loop is for arrays vs objects.',
    subTopics: [
      {
        id: 'if-switch',
        title: 'if, switch, ternary',
        description:
          'switch uses ===. Always break (or return) unless you want fall-through. Ternary is an expression — use it for values, not for side effects.',
        code: `const status = code === 200 ? "ok" : "error";

switch (method) {
  case "GET":
    return read();
  case "POST":
    return write();
  default:
    throw new Error("unsupported");
}`,
      },
      {
        id: 'loops',
        title: 'Loops',
        description:
          'for and while when you need an index or early break. for...of for iterable values (arrays, strings, maps). for...in for enumerable keys — usually the wrong tool for arrays.',
        table: {
          headers: ['Loop', 'Use for'],
          rows: [
            ['for', 'Index, step, break/continue'],
            ['while / do...while', 'Unknown count'],
            ['for...of', 'Values of an iterable'],
            ['for...in', 'Keys of a plain object'],
            ['forEach / map', 'Arrays, no break'],
          ],
        },
        code: `const nums = [10, 20, 30];

for (const n of nums) console.log(n);      // 10 20 30
for (const i in nums) console.log(i);      // "0" "1" "2"

for (const [i, n] of nums.entries()) {
  console.log(i, n);
}`,
      },
    ],
  },

  {
    id: 'functions',
    title: 'Functions',
    description:
      'Functions are values. You can store them, pass them, and return them. That single idea unlocks callbacks, HOFs, closures, and most of modern JS.',
    notes: [
      {
        type: 'explainer',
        title: 'Declaration vs expression',
        content:
          'function foo() {} is hoisted in full. const foo = function () {} is not callable above its line. Arrow functions are always expressions and do not bind their own this.',
      },
    ],
    subTopics: [
      {
        id: 'fn-decl',
        title: 'Declarations & expressions',
        description:
          'A declaration is a statement. An expression produces a value you can assign. Named expressions show up correctly in stack traces.',
        code: `function greet(name) {
  return \`Hello, \${name}\`;
}

const greet2 = function greet2(name) {
  return \`Hi, \${name}\`;
};

// default + rest
function sum(a = 0, ...rest) {
  return rest.reduce((s, n) => s + n, a);
}`,
      },
      {
        id: 'arrow-fn',
        title: 'Arrow functions',
        description:
          'Short syntax, lexical this (inherits from the enclosing scope), no arguments object, cannot be used as constructors. Perfect for callbacks. Wrong for object methods that need this.',
        code: `const add = (a, b) => a + b;
const square = (n) => n * n;

const user = {
  name: "Ada",
  // bad: this is not user
  greet: () => this.name,
  // good
  greet() {
    return this.name;
  },
};`,
      },
      {
        id: 'hof',
        title: 'Higher-order functions',
        description:
          'A HOF takes a function, returns a function, or both. map, filter, reduce, and most middleware are HOFs.',
        code: `function withLog(fn) {
  return function logged(...args) {
    console.log("call", args);
    return fn(...args);
  };
}

const add = (a, b) => a + b;
const addLogged = withLog(add);
addLogged(2, 3); // logs, returns 5`,
      },
      {
        id: 'iife-pure',
        title: 'IIFE & purity',
        description:
          'An IIFE runs immediately and builds a private scope. A pure function returns the same output for the same input and has no side effects — easier to test and cache.',
        code: `const config = (() => {
  const secret = "hidden";
  return { env: "prod" };
})();

function tax(amount, rate) {
  return amount * rate; // pure
}`,
      },
    ],
  },

  {
    id: 'scope-context',
    title: 'Scope, Hoisting & Closures',
    description:
      'Scope decides which bindings a line can see. The engine creates an execution context per function call. Closures keep inner functions attached to the variables they closed over — even after the outer function returned.',
    notes: [
      {
        type: 'internal',
        title: 'How a call works',
        content:
          'Call → new Execution Context (this, locals, arguments) pushed on the stack → run → pop. Closures keep an environment record alive on the heap after the stack frame is gone.',
      },
      {
        type: 'warning',
        title: 'Loop + var',
        content:
          'var in a for loop is one shared binding. All closures see the final value. Use let (per-iteration binding) or an IIFE.',
      },
    ],
    code: `function makeCounter() {
  let n = 0;
  return function next() {
    n += 1;
    return n;
  };
}

const c = makeCounter();
c(); // 1
c(); // 2`,
    subTopics: [
      {
        id: 'scope-types',
        title: 'Global, function, block',
        description:
          'Global is the script (or window / globalThis). Function scope is everything inside a function. Block scope is { } with let / const / class.',
        code: `const global = 1;

function outer() {
  const inner = 2;
  if (true) {
    const blocked = 3;
  }
  // blocked is not visible
}`,
      },
      {
        id: 'hoisting',
        title: 'Hoisting & TDZ',
        description:
          'Declarations are hoisted; initializations are not. var becomes undefined. let / const exist but throw if you touch them before the line — the Temporal Dead Zone.',
        code: `console.log(a); // undefined
var a = 1;

// console.log(b); // ReferenceError
let b = 2;

foo(); // works
function foo() {}`,
      },
      {
        id: 'closures',
        title: 'Closures in practice',
        description:
          'Data privacy, partial application, and React’s stale-closure bugs all come from the same rule: the inner function remembers the environment where it was created.',
        code: `function multiply(a) {
  return (b) => a * b;
}
const double = multiply(2);
double(5); // 10

// stale loop bug
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0); // 3 3 3
}
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0); // 0 1 2
}`,
      },
    ],
  },

  {
    id: 'this-keyword',
    title: 'this, call, apply, bind',
    description:
      'this is decided at call time, not at write time — except for arrows, which use lexical this. Losing this in a callback is the most common JS interview trap.',
    notes: [
      {
        type: 'explainer',
        title: 'Four rules',
        content:
          '1) obj.method() → this is obj. 2) fn() → this is undefined (strict) or global. 3) new Fn() → this is the new instance. 4) fn.call/apply/bind set this explicitly. Arrows skip all of this.',
      },
    ],
    subTopics: [
      {
        id: 'this-rules',
        title: 'How this is set',
        description:
          'Look at the call site. The object before the dot wins. Passing a method as a callback strips the object — bind it or wrap it.',
        code: `const user = {
  name: "Ada",
  hi() {
    return this.name;
  },
};

user.hi();            // "Ada"
const fn = user.hi;
fn();                 // undefined (strict)
const bound = user.hi.bind(user);
bound();              // "Ada"`,
      },
      {
        id: 'call-apply-bind',
        title: 'call, apply, bind',
        description:
          'call(thisArg, ...args) and apply(thisArg, array) invoke immediately. bind(thisArg) returns a new function with this locked.',
        code: `function intro(city) {
  return \`\${this.name} — \${city}\`;
}

intro.call({ name: "Ada" }, "London");
intro.apply({ name: "Ada" }, ["London"]);

const ada = intro.bind({ name: "Ada" });
ada("London");`,
      },
    ],
  },

  {
    id: 'objects',
    title: 'Objects',
    description:
      'Objects are key/value maps with a prototype chain. Keys are strings or symbols. Use them for records; use Map when keys are arbitrary or insertion order + size matter.',
    subTopics: [
      {
        id: 'obj-create',
        title: 'Create & access',
        description:
          'Literal form is the default. Computed keys, shorthand, and methods keep syntax short. Prefer dot access; use brackets for dynamic keys.',
        code: `const key = "age";
const user = {
  name: "Ada",
  [key]: 36,
  greet() {
    return this.name;
  },
};

user.name;
user["age"];
delete user.age;`,
      },
      {
        id: 'obj-data',
        title: 'Read keys and values',
        description:
          'Object.keys / values / entries work on own enumerable string keys. They ignore symbols and inherited properties.',
        code: `const user = { name: "Ada", age: 36 };

Object.keys(user);     // ["name", "age"]
Object.values(user);   // ["Ada", 36]
Object.entries(user);  // [["name","Ada"],["age",36]]

for (const [k, v] of Object.entries(user)) {
  console.log(k, v);
}`,
      },
      {
        id: 'obj-copy',
        title: 'Copy & merge',
        description:
          'Spread and Object.assign are shallow. Nested objects are still shared. Structured clone or a library for deep copy.',
        code: `const a = { x: 1, nest: { y: 2 } };
const b = { ...a, x: 9 };
b.nest.y = 3;          // also changes a.nest.y

const deep = structuredClone(a);`,
      },
      {
        id: 'obj-lock',
        title: 'freeze, seal, preventExtensions',
        description:
          'Lock objects when you need guarantees — config, enums, public API surfaces.',
        table: {
          headers: ['Method', 'Change values', 'Add keys', 'Delete keys'],
          rows: [
            ['Object.freeze', 'No', 'No', 'No'],
            ['Object.seal', 'Yes', 'No', 'No'],
            ['Object.preventExtensions', 'Yes', 'No', 'Yes'],
          ],
        },
        code: `const CONFIG = Object.freeze({
  api: "/v1",
  retries: 3,
});
// CONFIG.retries = 1; // ignored in sloppy, TypeError in strict`,
      },
      {
        id: 'destructure-obj',
        title: 'Destructuring objects',
        description:
          'Pull fields out in one line. Rename with :, defaults with =, nest as needed.',
        code: `const user = { name: "Ada", city: "London" };
const { name, city: town, role = "eng" } = user;`,
      },
    ],
  },

  {
    id: 'arrays',
    title: 'Arrays',
    description:
      'Arrays are objects with numeric keys and a length. Prefer immutable methods (map, filter, toSorted) in UI code so you do not mutate state by accident.',
    notes: [
      {
        type: 'explainer',
        title: 'Mutation vs copy',
        content:
          'push / splice / sort change the same array. map / filter / toSorted / toReversed / toSpliced return a new one. In React state, always copy.',
      },
    ],
    subTopics: [
      {
        id: 'arr-add-remove',
        title: 'Add / remove',
        description:
          'Mutating methods change length in place. Use slice / toSpliced / spread when you need a new array.',
        table: {
          headers: ['Method', 'Where', 'Mutates'],
          rows: [
            ['push / pop', 'End', 'Yes'],
            ['unshift / shift', 'Start', 'Yes'],
            ['splice', 'Anywhere', 'Yes'],
            ['toSpliced', 'Anywhere', 'No'],
            ['slice', 'Copy range', 'No'],
            ['concat / spread', 'Join', 'No'],
          ],
        },
        code: `const a = [1, 2, 3];
a.push(4);                 // [1,2,3,4]
const b = [...a, 5];       // new array
const c = a.toSpliced(1, 1); // [1,3,4]`,
      },
      {
        id: 'arr-iter',
        title: 'Iterate',
        description:
          'forEach for side effects. map when you want a new array of the same length. for...of when you need break.',
        code: `nums.forEach((n, i) => console.log(i, n));
nums.entries(); // iterator of [index, value]
nums.keys();
nums.values();`,
      },
      {
        id: 'arr-search',
        title: 'Search',
        description:
          'includes / indexOf for primitives. find / findIndex for a predicate. findLast when you want the last match.',
        table: {
          headers: ['Method', 'Returns'],
          rows: [
            ['includes(v)', 'boolean'],
            ['indexOf(v)', 'index or -1'],
            ['find(fn)', 'element or undefined'],
            ['findIndex(fn)', 'index or -1'],
            ['findLast(fn)', 'last match'],
          ],
        },
        code: `users.find((u) => u.id === 7);
users.findIndex((u) => u.id === 7);
names.includes("Ada");`,
      },
      {
        id: 'arr-filter',
        title: 'Filter & predicates',
        description:
          'filter keeps items that pass. some is OR. every is AND. empty every() is true.',
        code: `nums.filter((n) => n > 0);
nums.some((n) => n < 0);
nums.every((n) => Number.isFinite(n));`,
      },
      {
        id: 'arr-transform',
        title: 'map, reduce, flat',
        description:
          'map transforms each item. reduce folds the list into one value. flat / flatMap unwrap nested arrays.',
        code: `const nums = [1, 2, 3, 4];

nums.map((n) => n * 2);
nums.reduce((sum, n) => sum + n, 0);

[[1, 2], [3]].flat();
["a b", "c"].flatMap((s) => s.split(" "));`,
      },
      {
        id: 'arr-sort',
        title: 'Sort & reverse',
        description:
          'sort mutates and compares as strings by default — so [10, 2] becomes [10, 2]. Pass a compare function. Prefer toSorted to keep the original.',
        code: `[10, 2, 1].sort();                 // [1, 10, 2]  string order
[10, 2, 1].sort((a, b) => a - b); // [1, 2, 10]
[10, 2, 1].toSorted((a, b) => a - b);`,
      },
    ],
  },

  {
    id: 'strings',
    title: 'Strings',
    description:
      'Strings are immutable primitives. Methods return new strings. Template literals handle interpolation and multiline text.',
    subTopics: [
      {
        id: 'str-basics',
        title: 'Create & inspect',
        description:
          'length is UTF-16 code units, not always visual characters. Use for...of or Intl.Segmenter for graphemes.',
        code: `const s = "JavaScript";
s.length;
s[0];
s.includes("Script");
s.startsWith("Java");
s.endsWith("pt");
s.indexOf("S");`,
      },
      {
        id: 'str-transform',
        title: 'Transform',
        description:
          'slice, split, replace, trim, pad, case conversion. replace takes a string or a regex.',
        code: `"  hi  ".trim();
"hi".padStart(4, "0");
"a-b-c".split("-");
"foo bar".replace("foo", "baz");
"foo foo".replaceAll("foo", "baz");
\`Hello, \${name}\`;`,
      },
    ],
  },

  {
    id: 'es6-plus',
    title: 'ES6+ Language Features',
    description:
      'The modern baseline: let/const, arrows, classes, modules, promises, destructuring, rest/spread, optional chaining, nullish coalescing, and later additions like ??=, logical assignment, and top-level await.',
    subTopics: [
      {
        id: 'destructuring',
        title: 'Destructuring',
        description:
          'Unpack arrays by position and objects by name. Works in parameters, which keeps React props and Node handlers clean.',
        code: `const [first, , third] = [1, 2, 3];
const { name, age = 0 } = user;

function User({ name, age }) {
  return name + age;
}`,
      },
      {
        id: 'spread-rest',
        title: 'Spread & rest',
        description:
          'Spread expands. Rest collects. Same ... token, opposite direction. Shallow for objects and arrays.',
        code: `const nums = [1, 2, 3];
Math.max(...nums);

function log(level, ...msg) {
  console.log(level, msg.join(" "));
}

const next = { ...user, age: 37 };`,
      },
      {
        id: 'opt-chain',
        title: 'Optional chaining & nullish',
        description:
          '?. and ?? exist to kill if (x && x.y && x.y.z) chains. Combine them: user?.settings?.theme ?? "light".',
        code: `user?.profile?.email;
user?.save?.();
arr?.[0];

const theme = user?.theme ?? "light";
port ??= 3000;`,
      },
      {
        id: 'modules-es',
        title: 'ES modules',
        description:
          'import / export are static and hoisted. Default export: one per file. Named exports: as many as you want. In browsers, type="module". In Node, "type": "module" or .mjs.',
        code: `// math.js
export const add = (a, b) => a + b;
export default function mul(a, b) {
  return a * b;
}

// app.js
import mul, { add } from "./math.js";`,
      },
      {
        id: 'other-modern',
        title: 'Other essentials',
        description:
          'Template literals, for...of, Promise, class, Symbol, iterators, BigInt, private fields (#name), logical assignment (||=, &&=, ??=), and Array / Object extras (at, hasOwn, groupBy).',
        code: `class Point {
  #secret = 1;
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

items.at(-1);
Object.hasOwn(user, "name");`,
      },
    ],
  },

  {
    id: 'prototypes-classes',
    title: 'Prototypes & Classes',
    description:
      'Every object has an internal [[Prototype]]. Property lookup walks that chain. class is syntax over the same model — not a separate OOP runtime.',
    notes: [
      {
        type: 'internal',
        title: 'Lookup',
        content:
          'obj.foo checks obj, then Object.getPrototypeOf(obj), and so on, until null. That is why methods on Class.prototype are shared across instances.',
      },
    ],
    subTopics: [
      {
        id: 'prototype-chain',
        title: 'The prototype chain',
        description:
          '__proto__ is the instance link (avoid setting it in app code). prototype lives on functions and is assigned to instances created with new.',
        code: `function Person(name) {
  this.name = name;
}
Person.prototype.hi = function () {
  return this.name;
};

const p = new Person("Ada");
p.hi();
Object.getPrototypeOf(p) === Person.prototype;`,
      },
      {
        id: 'classes',
        title: 'class syntax',
        description:
          'constructor, instance methods, static methods, getters, extends, super, and private fields. Methods are non-enumerable on the prototype.',
        code: `class Animal {
  constructor(name) {
    this.name = name;
  }
  speak() {
    return this.name;
  }
}

class Dog extends Animal {
  speak() {
    return super.speak() + " barks";
  }
}

const d = new Dog("Rex");`,
      },
      {
        id: 'new-operator',
        title: 'What new does',
        description:
          'Creates {}, sets the prototype, calls the constructor with this bound, returns this (unless the constructor returns another object).',
        code: `function User(name) {
  this.name = name;
}
const u = new User("Ada");

// roughly:
// const u = Object.create(User.prototype);
// User.call(u, "Ada");`,
      },
    ],
  },

  {
    id: 'async-js',
    title: 'Async JavaScript',
    description:
      'The call stack runs synchronous code. Web APIs / libuv handle waiting. The Event Loop moves completed callbacks onto the stack. Promises use the microtask queue, which always drains before the next macrotask (timer, I/O, click).',
    videoId: 'exBgWAIeIeg',
    notes: [
      {
        type: 'internal',
        title: 'Micro vs macro',
        content:
          'Microtasks: Promise.then, queueMicrotask, MutationObserver. Macrotasks: setTimeout, setInterval, setImmediate (Node), I/O, UI events. After every task, all pending microtasks run first.',
      },
      {
        type: 'warning',
        title: 'Unhandled rejections',
        content:
          'Always attach .catch or use try/catch with await. An unhandled rejection is a real error, not a warning you can ignore in production.',
      },
    ],
    code: `console.log("A");

setTimeout(() => console.log("D timeout"), 0);

Promise.resolve().then(() => console.log("C microtask"));

console.log("B");
// A B C D`,
    subTopics: [
      {
        id: 'callbacks',
        title: 'Callbacks',
        description:
          'A function you pass to be called later. Nested callbacks become unreadable (“callback hell”) and error handling fans out. Promises flatten that.',
        code: `fs.readFile("a.txt", (err, data) => {
  if (err) return console.error(err);
  fs.readFile("b.txt", (err2, data2) => {
    // nesting grows forever
  });
});`,
      },
      {
        id: 'promises',
        title: 'Promises',
        description:
          'A Promise is pending, fulfilled, or rejected — once. then maps a value, catch maps a failure, finally runs either way. Return a promise inside then to chain.',
        code: `fetch("/api/user")
  .then((res) => {
    if (!res.ok) throw new Error(res.status);
    return res.json();
  })
  .then((user) => user.name)
  .catch((err) => console.error(err))
  .finally(() => console.log("done"));

const p = Promise.all([fetch(a), fetch(b)]);
const first = Promise.race([p1, p2]);
const settled = Promise.allSettled([p1, p2]);`,
      },
      {
        id: 'async-await',
        title: 'async / await',
        description:
          'async functions always return a Promise. await pauses that function (not the thread) until the promise settles. Wrap await in try/catch. Run independent work in parallel with Promise.all.',
        code: `async function loadUser(id) {
  try {
    const res = await fetch(\`/api/users/\${id}\`);
    if (!res.ok) throw new Error("fail");
    return await res.json();
  } catch (err) {
    console.error(err);
    return null;
  }
}

const [user, posts] = await Promise.all([
  loadUser(1),
  fetch("/api/posts").then((r) => r.json()),
]);`,
      },
      {
        id: 'event-loop',
        title: 'Event loop, pictorially',
        description:
          'Stack (now) → Web APIs (waiting) → Task queue / Microtask queue → loop pulls the next job when the stack is empty. Rendering in the browser happens between tasks, not in the middle of sync JS.',
        table: {
          headers: ['Piece', 'Holds'],
          rows: [
            ['Call stack', 'What is running now'],
            ['Web APIs / libuv', 'Timers, fetch, I/O'],
            ['Microtask queue', 'Promise jobs'],
            ['Macrotask queue', 'Timers, I/O, events'],
          ],
        },
      },
    ],
  },

  {
    id: 'error-handling',
    title: 'Error Handling',
    description:
      'Throw Error objects, not strings. Catch only what you can handle. Distinguish operational errors (network, validation) from programmer errors (bugs).',
    subTopics: [
      {
        id: 'try-catch',
        title: 'try / catch / finally / throw',
        description:
          'try/catch only sees synchronous throws and awaited rejections. A rejected promise without await slips past catch.',
        code: `class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.name = "HttpError";
    this.status = status;
  }
}

try {
  throw new HttpError(404, "Not found");
} catch (err) {
  if (err instanceof HttpError) {
    console.log(err.status);
  } else {
    throw err;
  }
} finally {
  // always runs
}`,
      },
    ],
  },

  {
    id: 'dom-events',
    title: 'DOM & Events',
    description:
      'The DOM is the tree of the page. You query it, mutate it, and listen for events. Prefer addEventListener, event delegation, and one write per frame over innerHTML in a loop.',
    notes: [
      {
        type: 'warning',
        title: 'XSS',
        content:
          'Never assign untrusted strings to innerHTML. Use textContent, or sanitize. That is the #1 frontend security bug.',
      },
    ],
    subTopics: [
      {
        id: 'dom-query',
        title: 'Query & update',
        description:
          'querySelector / querySelectorAll for CSS selectors. getElementById when you have an id. Create nodes with createElement, then append.',
        code: `const el = document.querySelector(".item");
const all = document.querySelectorAll("li");

el.textContent = "Hi";
el.classList.add("active");
el.setAttribute("aria-current", "true");

const li = document.createElement("li");
li.textContent = "New";
list.append(li);`,
      },
      {
        id: 'events',
        title: 'Events & delegation',
        description:
          'Capture phase goes down, bubble phase goes up. Delegation: listen on a parent, read event.target. Always remove listeners you add in long-lived pages.',
        code: `list.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;
  e.preventDefault();
  console.log(btn.dataset.id);
});

// { once: true } auto-removes
el.addEventListener("click", handler, { once: true });`,
      },
    ],
  },

  {
    id: 'browser-apis',
    title: 'Browser APIs & Storage',
    description:
      'The language is small. The platform is large: fetch, URL, storage, observers, workers, history. Learn the APIs your product actually needs.',
    subTopics: [
      {
        id: 'fetch-json',
        title: 'fetch & JSON',
        description:
          'fetch returns a Promise. res.ok is not thrown for 404 — you check it. JSON is a text format; JSON.parse / stringify convert to and from plain data (no functions, no undefined, no Map).',
        code: `const res = await fetch("/api/users", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name: "Ada" }),
});

if (!res.ok) throw new Error(res.status);
const data = await res.json();

JSON.stringify({ a: 1, skip: undefined }); // '{"a":1}'`,
      },
      {
        id: 'storage',
        title: 'Storage',
        description:
          'localStorage persists per origin. sessionStorage lasts the tab. cookies go to the server (size and security limits). IndexedDB is for larger structured data.',
        table: {
          headers: ['API', 'Size', 'Sent to server', 'Lifetime'],
          rows: [
            ['localStorage', '~5MB', 'No', 'Until cleared'],
            ['sessionStorage', '~5MB', 'No', 'Tab'],
            ['cookies', '~4KB', 'Yes', 'Expires / session'],
            ['IndexedDB', 'Large', 'No', 'Until cleared'],
          ],
        },
        code: `localStorage.setItem("theme", "dark");
const theme = localStorage.getItem("theme");
localStorage.removeItem("theme");`,
      },
      {
        id: 'other-web-apis',
        title: 'Useful platform APIs',
        description:
          'URL / URLSearchParams, AbortController to cancel fetch, IntersectionObserver for lazy load, ResizeObserver, matchMedia, history.pushState, Worker for CPU work off the main thread.',
        code: `const ctl = new AbortController();
fetch("/slow", { signal: ctl.signal });
ctl.abort();

const params = new URLSearchParams(location.search);
params.get("q");`,
      },
    ],
  },

  {
    id: 'collections',
    title: 'Map, Set, WeakMap, WeakSet',
    description:
      'Use Map when keys are not strings or you need size / insertion order. Use Set for unique values. Weak* variants hold objects without preventing garbage collection — good for private metadata and caches.',
    subTopics: [
      {
        id: 'map-set',
        title: 'Map & Set',
        description:
          'Map keys can be objects. Set uniqueness uses SameValueZero (NaN equals NaN).',
        code: `const map = new Map();
map.set(user, "admin");
map.get(user);
map.has(user);
map.size;

const set = new Set([1, 1, 2]);
set.add(3);
[...set]; // [1, 2, 3]`,
      },
      {
        id: 'weak-collections',
        title: 'WeakMap & WeakSet',
        description:
          'Keys must be objects. Not iterable. When the key is unreachable, the entry disappears. Used for private fields (pre-#) and DOM caches.',
        code: `const secret = new WeakMap();

class User {
  constructor(name) {
    secret.set(this, { name });
  }
  get name() {
    return secret.get(this).name;
  }
}`,
      },
    ],
  },

  {
    id: 'iterators-generators',
    title: 'Iterators & Generators',
    description:
      'An iterable has [Symbol.iterator](). for...of, spread, and destructuring all use it. A generator function (function*) pauses with yield and produces an iterator for you.',
    subTopics: [
      {
        id: 'iterators',
        title: 'Iterables',
        description:
          'Arrays, strings, maps, sets, and arguments are iterable. Plain objects are not — use Object.entries.',
        code: `const range = {
  from: 1,
  to: 3,
  *[Symbol.iterator]() {
    for (let i = this.from; i <= this.to; i++) yield i;
  },
};

[...range]; // [1, 2, 3]`,
      },
      {
        id: 'generators',
        title: 'Generators',
        description:
          'yield returns a value and pauses. next(value) resumes. Useful for lazy sequences, custom iterables, and some state machines. async function* + for await...of for async streams.',
        code: `function* ids() {
  let i = 1;
  while (true) yield i++;
}

const g = ids();
g.next().value; // 1
g.next().value; // 2`,
      },
    ],
  },

  {
    id: 'regex-dates',
    title: 'RegExp, Dates & Math',
    description:
      'Regular expressions search and replace text. Date is awkward (month is 0-based); prefer Temporal when available, or a library for time zones. Math covers numbers; for money use integers or a decimal library.',
    subTopics: [
      {
        id: 'regex',
        title: 'Regular expressions',
        description:
          'Literals /pattern/flags or new RegExp. test for yes/no, exec / match / matchAll for captures, replace for rewrite. Flags: i ignore case, g global, m multiline, u unicode, s dotall.',
        code: `const re = /\\b(\\w+)@(\\w+\\.\\w+)\\b/i;
re.test("a@b.com");
"a@b.com".match(re);

"foo 123".replace(/\\d+/g, "#");`,
      },
      {
        id: 'dates',
        title: 'Date',
        description:
          'new Date() is local now. Date.now() is a timestamp. Parsing date-only strings as UTC vs local is a famous footgun. Format with Intl.DateTimeFormat.',
        code: `const d = new Date();
d.getFullYear();
d.getMonth(); // 0–11
Date.now();

new Intl.DateTimeFormat("en-GB").format(d);`,
      },
      {
        id: 'math-numbers',
        title: 'Numbers & Math',
        description:
          'IEEE-754 doubles. 0.1 + 0.2 !== 0.3. Number.MAX_SAFE_INTEGER is 2^53-1. Use Number.isInteger, Number.parseInt with a radix, Math.min/max/floor/round/random.',
        code: `0.1 + 0.2;                  // 0.30000000000000004
Number.EPSILON;
Number.parseInt("08", 10);  // 8
Math.random();              // [0, 1)
Math.floor(Math.random() * 10);`,
      },
    ],
  },

  {
    id: 'modules-tooling',
    title: 'Modules, NPM & Tooling',
    description:
      'Ship code as modules. npm / pnpm / yarn install packages. Bundlers (Vite, webpack) and TypeScript turn what you write into what the browser runs.',
    subTopics: [
      {
        id: 'cjs-esm',
        title: 'CJS vs ESM',
        description:
          'CommonJS (require / module.exports) is the old Node default. ESM (import / export) is the standard. Do not mix blindly — named imports from CJS can break.',
        code: `// CommonJS
const fs = require("fs");
module.exports = { read };

// ESM
import fs from "node:fs";
export function read() {}`,
      },
      {
        id: 'npm',
        title: 'package.json',
        description:
          'dependencies ship to production. devDependencies are for build and test. scripts are the project’s CLI. lockfiles pin versions so installs are reproducible.',
        table: {
          headers: ['Field', 'Role'],
          rows: [
            ['dependencies', 'Runtime packages'],
            ['devDependencies', 'Build, lint, test'],
            ['scripts', 'npm run <name>'],
            ['type: "module"', 'Treat .js as ESM'],
          ],
        },
      },
    ],
  },

  {
    id: 'memory-perf',
    title: 'Memory & Performance',
    description:
      'JS is garbage-collected. Leaks happen when you keep a reference you no longer need — detached DOM nodes, uncleared timers, global caches, closures that hold large data.',
    notes: [
      {
        type: 'explainer',
        title: 'Measure first',
        content:
          'DevTools Performance + Memory panels beat guesswork. Optimize the hot path you measured, not the one that looks slow.',
      },
    ],
    subTopics: [
      {
        id: 'gc-leaks',
        title: 'GC & leaks',
        description:
          'Reachable objects stay alive. Cut the last reference and GC can reclaim. WeakMap / WeakRef exist so caches do not pin objects forever.',
        code: `// leak: listener never removed
window.addEventListener("resize", onResize);

// fix
window.removeEventListener("resize", onResize);
clearInterval(id);`,
      },
      {
        id: 'perf-tips',
        title: 'Practical performance',
        description:
          'Avoid layout thrash (read then write DOM in a loop). Debounce input handlers. Virtualize long lists. Memoize expensive pure functions. Move CPU work to a Worker.',
        code: `function debounce(fn, ms) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}

const onSearch = debounce((q) => fetch(\`/s?q=\${q}\`), 200);`,
      },
    ],
  },

  {
    id: 'patterns-security',
    title: 'Patterns, Testing & Security',
    description:
      'A few patterns cover most app code. Tests lock behavior. Security is mostly about not trusting input and not leaking secrets.',
    subTopics: [
      {
        id: 'patterns',
        title: 'Patterns you will actually use',
        description:
          'Module (public API + private state), Factory (create without new), Observer / pub-sub, Singleton (sparingly), Composition over inheritance, Debounce / Throttle.',
        code: `// factory + composition
function createStore(initial) {
  let state = initial;
  const listeners = new Set();
  return {
    get: () => state,
    set: (next) => {
      state = next;
      listeners.forEach((fn) => fn(state));
    },
    subscribe: (fn) => {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
  };
}`,
      },
      {
        id: 'testing',
        title: 'Testing & debugging',
        description:
          'Unit-test pure functions. Integration-test modules. debugger and breakpoints beat console.log for control flow. Read the stack trace from the top.',
        code: `import { expect, test } from "vitest";
import { add } from "./math";

test("add", () => {
  expect(add(2, 3)).toBe(5);
});`,
      },
      {
        id: 'security',
        title: 'Security basics',
        description:
          'XSS: never inject unsanitized HTML. CSRF: tokens / SameSite cookies. Sensitive data: not in localStorage if XSS is possible. Prototype pollution: freeze or use Map. eval and new Function on user input are unsafe.',
        table: {
          headers: ['Risk', 'Do this'],
          rows: [
            ['XSS', 'textContent, sanitize HTML, CSP'],
            ['CSRF', 'SameSite=Lax/Strict, CSRF token'],
            ['Secrets', 'Server only, never in the bundle'],
            ['eval', 'Do not run user strings'],
          ],
        },
      },
    ],
  },
];